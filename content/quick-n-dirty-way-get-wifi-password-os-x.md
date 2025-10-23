---
title: "Quick-n-Dirty Way to Get a WiFi Password on OS X"
date: "2012-12-30"
tags:
draft:
---

I saw this [hint on how to get a list of the WiFi networks](http://hints.macworld.com/article.php?story=20121226001352647) you have associated with.  I'm one of those guys that uses Keychain Access to grab old passwords.  This is way easier.  I'm not sure what versions of OS X this will work on.  Mountain Lion for sure, but probably 10.6 and up.

Just add this to your .bash_profile:

<code lang="bash">function get-wifi-password() {
   security find-generic-password -l "$@" -g | grep '^password';
}</code>

Which you can use like this:

<code lang="bash">
$ get-wifi-password "Some Access Point"
password: "Your Password"
</code>
