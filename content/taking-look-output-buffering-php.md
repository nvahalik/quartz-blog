---
title: "Taking a look at output buffering in PHP"
date: "2016-06-26"
tags:
draft:
---

Output buffering in PHP isn't new. It was introduced in PHP 4 and for the most part, it's one of those things that unless you're not using a CMS or a framework, you'll never really need to mess with it much.

However, today I was playing around with doing client-side redirections in JavaScript and wanted to see first-hand how they worked. Modern browsers begin parsing the HTML before it is completely delivered and once the `<script>` tag is parsed, it is [executed immediately](http://w3c.github.io/html/semantics-scripting.html#script-processing-model).

So if we have a `<script>` tag just inside of our `<head>`, then that script tag will get executed as soon as it is done, regardless of the rest of the content in the delivered HTML file.

Anyway, to play around with this, I used this little bit of code:

    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
    <html>
      <head>
        <title>Redirect test</title>
      </head>
      <body>
        <script>location.href="https://google.com/"</script>
        <?php
          flush();
          sleep(10);
        ?>
      </body>
    </html>


However, it did not work as intended.

I tried several different things trying to get it to work, but it wasn't until I added `echo str_pad('', 64 * 1024)."\\n";` before the sleep that it actually worked:

    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
    <html>
      <head>
        <title></title>
      </head>
      <body>
        <script>location.href="https://google.com/"</script>
        <?php
          echo str_pad('', 64 * 1024)."\\n";
          sleep(10);
        ?>
      </body>
    </html>

So, why did it need another 64k worth of stuff in order to have the intended effect? Well, the answer, of course, is buffering!

### Yet another buffer!

I'm using Acquia DevDesktop for local development. It uses PHP's standard buffer size of 4096. No big deal there. I trying backing down the `str_pad()` to that and it still wouldn't send the data.

Ultimately, what I discovered was that FastCGI has a [FcgidOutputBufferSize directive](http://httpd.apache.org/mod_fcgid/mod/mod_fcgid.html#fcgidoutputbuffersize) and it's value is actually set to—get this—_65536_.

So ultimately what was happening was that PHP's buffer was getting sent, but only to the handler (that'd be FastCGI) and then FastCGI was buffering the output itself.

It's also worth noting that using [mod_deflate](http://httpd.apache.org/docs/current/mod/mod_deflate.html) has it's own internal buffer (set by the [DeflateBufferSize directive](http://httpd.apache.org/docs/current/mod/mod_deflate.html#deflatebuffersize)). I had it disabled for my test—and I'm not 100% sure of the impact that it might have.

One other quick note about [`flush()`](http://php.net/flush): As far as I can tell, each buffer will capture data until it gets full. Once it gets full, it will send it's data on to the next buffer. Say for a moment you have a `sleep()` call in your code that suspends execution. How long will it take for a the first byte to get delivered?

<table>
  <tbody>
    <tr>
      <td>Buffer</td>
      <td>6K</td>
      <td>11K</td>
      <td>16K</td>
    </tr>
    <tr>
      <td>PHP, 4K</td>
      <td>2K</td>
      <td>3K</td>
      <td>0</td>
    </tr>
    <tr>
      <td>FastCGI, 8K</td>
      <td>4K</td>
      <td>8K</td>
      <td>8K</td>
    </tr>
    <tr>
      <td>Sent to browser</td>
      <td>0</td>
      <td>0</td>
      <td>8K</td>
    </tr>
  </tbody>
</table>


In other words, the first buffer (PHP's) fills up and then sends it's data over to the next buffer (FastCGI's). FastCGI won't send it's buffer to the user *until PHP delivers enough content to fill up it's own buffer so that it needs to empty it's buffer to start filling it up again.*

It's something to keep in mind. And again, if Apache or something else is doing extra caching, you'll need to ensure you either bypass those buffers or send enough data so that buffers get flushed.
