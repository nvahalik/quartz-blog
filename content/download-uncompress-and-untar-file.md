---
title: "Download, Uncompress, and Untar a File"
date: "2008-10-27"
tags:
draft:
---

Just wanted to write this little shell code snippet down because I've been using it quite a bit.  It downloads, ungzips, and untars a file without saving it using [wget](http://linux.die.net/man/1/wget:)

<blockcode lang="bash">wget -O - http://example.com/file.tgz | tar xvz</blockcode>

Or, if you're Mac Like Me, you'd use [curl](http://curl.haxx.se/docs/manpage.html:)

<blockcode lang="bash">curl http://example.com/file.tgz | tar xvz</blockcode>

Beats having all those .tar.gz files laying around like dirty kleenex.
