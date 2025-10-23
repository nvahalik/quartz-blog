---
title: "Finally!  An HTML to PDF Workflow That Works"
date: "2011-11-05"
tags:
draft:
---

It is a problem that is as old as computers: making the representation of text and data beautiful. At Classy Llama, we have been searching for a way to make the massive amounts of information we work with accessible, easy to manage, and also beautiful. Here is a workflow that we have started using. Perhaps you might find it useful too.

## Some Background

What we want is a system that is three things: accessible, consistent, and easy to use. First, accessible means that the means by which documents can be generated must be easily accessible. Adobe InDesign is not accessible in that it is expensive. Plain Text is accessible because you can produce it on any platform. Consistency refers to the quality and ability to reproduce that quality over and over again. InDesign can produce documents of consistent quality because that is what it was designed to do. So can LaTeX for that matter. Lastly, ease of use is paramount because without it, nobody would use it. LaTeX and Illustrator are great examples of items that are not easy to use at all. While Word &amp; Pages are fairly easy to use.

There are many factors that can affect this, but ultimately we know that we needed to settle on two things:

1. How documents were going to be generated.
2. Format of the the finished file.

Ultimately, we know that PDF was the only reasonable answer for #2. The answer to #1 gets a little more interesting. That is why we are here!

I really wanted a reason to do a Venn Diagram. So here it is:

![Venn Venn_Diagram_Selections](Venn_Diagram_Selections.png)

## The Software

When starting off, I really knew in the back of my mind that a workflow that started with HTML and ended with PDF was going to be the best one. Why? Simply because it meets all three requirements. There are only a handful of people in the building who do not know HTML. The ones who do not can be worked around. So, with HTML as the source, how do we get to the PDF?

### Giving Safari a spin

The initial idea was to just generate a good looking file and then print it straight to PDF with Safari:

![printing with safar](printing_with_safari.png)

1. Make sure backgrounds are enabled.
2. Turn off the headers and footers.
3. Save as PDF...

In a pinch, Safari can definitely take an HTML document and make it a solid-looking PDF. But the thing is, we did not want it to look like a printed web page. We wanted it to look <em>professional</em>. Safari lacked some some functionality that we really wanted. Control over headers and footers was something we really had to have. [It's not as easy to do in Safari](http://stackoverflow.com/questions/3760202/print-footer-at-bottom-of-page-in-safari) as I had hoped.

### What about Firefox?

Firefox was about the same as Safari except that Firefox gives you some more control over the header and the footer:

![firefox_print_0.png](firefox_print_0.png)

This is fine and good, but still too limiting.

### PHP, Web Services, &amp; Scripts to the Rescue?

There are several options for building PDF documents. [HTML2PDF](http://html2pdf.fr/en) converts HTML documents to PDF as a PHP library. [Others](http://www.htm2pdf.co.uk/) [are](http://html2pdf.seven49.net/Web/) web services. There are yet more scripts and libraries that provide PDF building as an API inside of PHP. I found other scripts that also claimed to convert HTML to PDFs in a CLI package. None that I tried seemed to work quite right (or at all). More dead ends. At this point, I was about to give up.

### We Need an HTML Renderer

The only thing that would really work is if you could find something that rendered the HTML like a browser could. I remember trying Firefox's [Command Line Print Interface[http://sites.google.com/site/torisugari/commandlineprint2] but to no avail. Surely there was something else. That something else was [wkhtmltopdf](http://code.google.com/p/wkhtmltopdf/).

## Finally, a Solution!

`wkhtmltopdf` actually works: a program that contains the webkit rendering system (just like Safari uses) but has been put into a format that specializes in exporting postscript and PDF output of web pages. It is **totally designed for this purpose**. Finally, a solution that works! Proper headers and footers. Table of contents inside of the PDF and bookmarks in the file. Full use of CSS to control every aspect of the rendering (including custom fonts via font-family and `@font-face`). A whole slew of command line options that allow you to control paper size, and set nearly every possible thing you would need. So far, I've found in nearly perfect. There have been a couple of gotchas, though.

## Little Square Boxes

One of the first things to catch my eye was that occasionally there were little squares in generated documents. They weren't there when the document was printed, but when viewing in Acrobat or Preview, they were definitely visible. After much sleuthing, I discovered that the square boxes were null glyphs that had somehow managed to make their way into the various strings in the document. With a little help from pdftk, those boxes are no longer a problem:

1. Use pdftk to uncompress the PDF.
2. Run the resulting file through sed to remove the null glyphs (lines containing `Td \<0000> Tj`).
3. Use pdftk once more to compress the PDF.

Here is the shell script snippet:

```bash
pdftk output.pdf cat output - uncompress
| sed '/Td \<0000> Tj/d'
| pdftk - cat output output.pdf compress
```

## Easier Headers &amp; Footers

The last nagging bit was that we need to be able to have document versions and potentially other info that can be easily updated. The way that wkhtmltopdf is set up by default is that the headers and footers have a specific set of variables that come to them. Mainly just page number information and information about the current “section” of the document you are in. But versioning the document did not seem to be supported out of the box. What I wanted to be able to do was set the version number of the document in the document itself. That would be ideal.

One of the awesome and super-extensible things about wkhtmltopdf is that the headers and footers can be specified as source files. Source files means URLs. URLs mean request variables. The page number information already gets passed as get variables to the document. Those are then parsed out via JavaScript. So, I gave it a shot:

```bash
wkhtmltopdf \\
-s Letter "untitled.html" \\
--header-html "header.html?something=value" \\
--footer-html "footer.html?something=value" output.pdf
```

Which did not work. Passing the query arguments meant that it wanted a real URI. So since these were local files, why not try:

```bash
THISDIR=`pwd`
wkhtmltopdf \\
-s Letter "untitled.html" \\
--header-html "file://$THISDIR/header.html?something=value" \\
--footer-html "file://$THISDIR/footer.html?something=value" output.pdf
```

Which worked perfectly. Still need to get the information about the document from the source HTML into the header and footer files. Now PHP finally comes to the rescue with this little snippet:

```bash
EXTRAVARS=`php -r "echo urldecode(http_build_query(get_meta_tags('untitled.html')));"`
```

This little guy takes this (from the source HTML document):

```html
<meta name="version" content="1.0" />
<meta name="project" content="Example.com" />
<meta name="client" content="SuperAwesome, Inc." />
```

It's important to note that the spaces must stay intact. wkhtmltopdf does not decode them for you. Just escape them in your command line arguments and it will be fine. You will also need to add these variable names into the stock header and footer template that wkhtmltopdf gives you. It will look like this:

```html
<html>
    <head>
        <script>
            function subst() {
                var vars = {};
                var x = document.location.search
                    .substring(1)
                    .split("&amp;amp;");
                for (var i in x) {
                    var z = x[i].split("=", 2);
                    vars[z[0]] = unescape(z[1]);
                }
                var x = [
                    "title",
                    "version",
                    "project",
                    "client",
                    "frompage",
                    "topage",
                    "page",
                    "webpage",
                    "section",
                    "subsection",
                    "subsubsection",
                ]; /* Added new variables here */
                for (var i in x) {
                    var y = document.getElementsByClassName(x[i]);
                    for (var j = 0; j < y.length; ++j)
                        y[j].textContent = vars[x[i]];
                }
            }
        </script>
    </head>
</html>
```

A little bit of bash scripting and now we have something like this:

```bash
#!/bin/bash
# EDIT THIS - This points to your source file
HTMLFILE="my_pretty_file.html"

# Where are we?
THISDIR=$(pwd -P)

# Grab the title of the HTML document from the source.
RAW_TITLE=`grep -e '' "$HTMLFILE" | sed -E 's/<\\/?[^>]+>//g'`
ENTITY_TITLE=`php -r "echo html_entity_decode('${RAW_TITLE}');"`

# Build the extra variables to add to the footer and header.
EXTRAVARS=`php -r "echo urldecode(http_build_query(get_meta_tags('$HTMLFILE')));"`
EXTRAVARS="${EXTRAVARS}&amp;title=${RAW_TITLE}"; # Add the title

# Generate the document.
wkhtmltopdf -q \\
--no-pdf-compression -s Letter \\
--header-html "file://$THISDIR/header.html?$EXTRAVARS" \\
--footer-html "file://$THISDIR/footer.html?$EXTRAVARS" - |
sed '/Td <0000> Tj/d' > "$ENTITY_TITLE.pdf"
```

## Final Thoughts

This is a work in progress, but it is now a viable option for generating beautiful, consistent documents from HTML. You could have a shared server that would host your templates, CSS, fonts, etc and the only tools necessary would be the scripts, wkhtmltopdf, pdftk, and your source file. Not bad for a free setup.

With something like [pandoc](http://johnmacfarlane.net/pandoc/), you need not be limited to just HTML. You could easily modify the script above to take your source file and push it through pandoc and then pass it on down to `wkhtmltopdf`. The possiblities are limitless. So, what are you waiting for? Go try it out!

## Update...

Upon further use, I discovered an unintended side-effect: use of pdftk causes the bookmarks in the file to disappear. However, it turns out that by passing the `--no-pdf-compression` flag removes the need to decompress the PDF file before removing the extra characters.

I'm still looking for a way to append extra files (PDF, HTML, or otherwise) into the file and utilize bookmarks. Any thoughts?
