---
title: "How I Cut My Server's Load Average In (More Than) Half"
date: "2008-05-27"
tags:
draft:
---

I try to monitor my hosting server pretty closely.  It's rare that a days goes by when I haven't checked logs and monitored process and memory usage.  For the most part nothing big happens.  It just makes me feel important. But over the past few months the load average appeared to be above normal.

After attending a session on [APC](http://pecl.php.net/package/APC) at [php|tek](http://tek.phparch.com/,) I installed it on my primary hosting box.

For the past few months, I'd ssh in and see something like this:

<pre>nick@hosting$ w
22:41:12  up 135 days, 13:33,  1 user,  load average: 0.78, 0.91, 1.18
...</pre>

Today, it looks something like this:

<pre>nick@hosting$ w
21:45:40  up 35 days, 23:33,  1 user,  load average: 0.18, 0.18, 0.21
...</pre>

I must say... quite an improvement!

So this brings up a question... if it can improve performance this dramatically, how well would it do if say... the Drupal caching mechanism were rewritten to use this as a cache?  It uses SQL, so taking out a bunch of SQL queries per page load might dramatically improve it's performance on single-server setups.

Actually, a bit of searching reveals that [someone else has already thought of this](http://drupal.org/project/apc.)  One user says that his app was able to [handle 50% more traffic after using this new cache.inc file](http://drupal.org/node/224213.)  Interesting.  Wonder why this hasn't been push into core yet?  Would it be too hard to detect APC and use one set or the other?
