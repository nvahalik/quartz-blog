---
title: "Getting a java.io.CharConversionException with pdftk while using MAMP?"
date: "2010-02-05"
tags:
draft:
---

Man, talk about a frustrating problem!  I kept getting this errors while calling pdftk (from the mac installer, which the version as of this writing is 1.12):

<code>Unhandled Java Exception:
java.io.CharConversionException
   <<No stacktrace available>></code>

Anyway, after *much* hair pulling, the answer was found!  Before calling [shell_exec](http://php.net/shell_exec) (or whatever function you use to call pdftk) you need to unset the <code>DYLD_LIBRARY_PATH</code> environment variable.

<code lang="php"># unset this so pdftk will work!
putenv('DYLD_LIBRARY_PATH');

# put the output in a variable
$pdf_data = shell_exec('/usr/local/bin/pdftk '. $file_name .' fill_form '.
$fdf_fn. ' output - flatten');</code>
