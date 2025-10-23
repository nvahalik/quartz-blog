---
title: "Yet Another Reason Why Adobe AIR Is Amazing"
date: "2008-08-09"
tags:
draft:
---

On a project for a client, recently, a vendor he was working with dropped the ball, and in a last minute call, he asked me for my "solution" to a problem we had discussed before.  I spent a few hours researching the _how_ of solving the problem, VB.Net perhaps (bluh), maybe some snappy C#.  I went through the different languages, looking for a solution.  Essentially, he wanted to display a full screen webpage on a couple of multi-monitor systems.  Finally, I came back to [Adobe AIR](http://www.adobe.com/products/air/.)

[AIR has a Screen class](http://help.adobe.com/en_US/AIR/1.1/devappshtml/WS5b3ccc516d4fbf351e63e3d118676a47e0-8000.html) that allows you to enumerate screens and gather info about them.  These was much better than [importing DLLs from user32.dll in C#](http://www.java2s.com/Tutorial/CSharp/0520__Windows/EnumerateDisplayMonitors.htm) or VB.Net and had much better documentation.

After all was said and done, the application works flawlessly and said customer was very happy.  (And I know everyone reading likes to have (or be) a happy customer!  The nicest part, though, was what I also gained by using Adobe AIR.

The web pages that will be shown on those screens are not your standard web-viewing fare.  They have quite a few custom elements and effects (text-shadows, drop shadows on things, etc).  Since [AIR uses Webkit](http://labs.adobe.com/wiki/index.php/Apollo:developerfaq#Is_this_the_same_WebKit_project_that_the_Safari_browser_on_Mac_OS_X_and_the_KHTML_Browser_in_KDE_use.3F) I was able to use all of the really nice features that Webkit has to offer.  Things like [strokes](http://webkit.org/blog/85/introducing-text-stroke/,) [box shadows](http://webkit.org/blog/86/box-shadow/,) and [text shadows](http://www.css3.info/preview/text-shadow/.)  And the best thing is... since these pages are going to end up on Windows machines, they'll display as expected since AIR is displaying them with Webkit!

Adobe, you have made my day!
