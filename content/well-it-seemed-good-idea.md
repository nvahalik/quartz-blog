---
title: "Well, It Seemed Like A Good Idea"
date: "2008-08-11"
tags:
draft: true
---

It turns out that Adobe AIR's embedded version in Windows is not the same as the version embedded in OSX's AIR.  Observe (click on a thumbnail to enlarge):

p=. [!/sites/nickvahalik.com/files/AIR%201.1%20Mac%20OSX_thumb.png!](/sites/nickvahalik.com/files/AIR%201.1%20Mac%20OSX.png)

p=. The pristine, Mac OSX version[1].

p=. [!/sites/nickvahalik.com/files/AIR%201.1%20Windows_thumb.png!](/sites/nickvahalik.com/files/AIR%201.1%20Windows.png)

p=. The no-so-correctly rendered Windows version.

The biggest noticeable difference is the number "4" in the upper-left hand corner.  There is no text-stroke, and no text-shadow on it.  The second thing is that my box-shadow around the dark content box is missing.  Again, it's perfect on the Mac, but is not rendered on the Windows machine.

I've been trying to find documentation that specifies what version of Webkit (in relation to Safari) AIR seems to be running, but it would seem that nobody really knows that the people at Adobe are trying to get the "latest" version out there.  I apologize for the lack of linkage, but even what I did find didn't seem very convincing.

This is very promising technology, but fails on something very simple.  I have to say that I'm a little frustrated that a piece of software that has the *same* version number for both Mac and Windows doesn't provide the same experience on both platforms.  Especially with how it's marketed.

However, my enthusiasm for AIR is only slightly stifled.  I'll continue in the hope the fix this... and soon.

fn1.  Yes, I know the aspect ratio is not right for the poster, but it's going to be stretched on a monitor, so it'll look right there, I promise.
