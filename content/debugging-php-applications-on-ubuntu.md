---
title: "Debugging PHP applications on Ubuntu"
date: "2022-04-19"
tags:
draft: 
---

I'm cleaning out some notes and wanted to put this somewhere...

## On Ubuntu

* Crashes go to /var/crash.
* Make sure ulimit -c unlimited is run. Restart php-fpm.

Or see: https://bugs.php.net/bugs-generating-backtrace.php

In order to “unpack them” you use `apport-unpack <crash> ~/destination`. 

See: https://askubuntu.com/questions/434431/how-can-i-read-a-crash-file-from-var-crash

Then, you can use `gdb `cat ExecutablePath` CoreDump` within that directory to examine it.

You’ll need the debug symbols loaded for php-fpm. If you’re using the one from sury: https://github.com/oerdnj/deb.sury.org/issues/512

Basically, add the main/debug repos and then apt-get install the correct php7.4-fpm-dbgsym (or 8.0, whatever, you do you)

You also probably want the dbg helpers for zend: https://reverseengineering.stackexchange.com/questions/9558/how-to-get-current-php-function-name-in-gdb
https://derickrethans.nl/what-is-php-doing.html

Get the current version of .gdbinit: https://github.com/php/php-src/blob/master/.gdbinit

Then you can review the stacktraces...