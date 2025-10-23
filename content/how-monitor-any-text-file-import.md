---
title: "How to monitor any text file import"
date: "2016-07-08"
tags:
draft: 
---

So as I was sitting here just now waiting for an 80+ MB import to process over an SSH connection, I began wondering to myself if there was some way to monitor the progress of an import. Percentage—or even throughput—of the file being sent over the pipe.

Turns out that **there is a way!**

Enter the command [`pv`](http://linux.die.net/man/1/pv).

> pv allows a user to see the progress of data through a pipeline, by giving information such as time elapsed, percentage completed (with progress bar), current throughput rate, total data transferred, and ETA.

Uh. Yes, please.

If you're running GNU/Linux, you probably already have this installed. On a Mac it's available via [Homebrew](http://brew.sh/).

    brew install pv

Once installed, you use it to send your text files to commands that are expecting things through `stdin` like so:

    $ pv some-db.sql | mysql -uroot 8f00b204e9800998ecf8427e
    83.2MiB 0:00:25 [3.28MiB/s] [==================================================================>] 100%

Never worry about where your imports are again!