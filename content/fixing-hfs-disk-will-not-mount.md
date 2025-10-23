---
title: "Fixing an HFS+ Disk That Will Not Mount"
date: "2013-03-17"
tags:
draft:
---

I was unboxing my 1st Gen Drobo today so that I could plug it into my Airport Extreme to share it on my network.  I got a blinking amber light.  So I plugged the Drobo into my Mac and I get this message in Console...

<pre>3/17/13 8:30:24.000 PM kernel[0]: hfs_mountfs: failed to mount non-root inconsistent disk</pre>

At first, I thought I just needed a firmware update.  After updating to the [1.8.4 Drobo firmware](http://support.drobo.com/app/answers/detail/a_id/598/kw/software/r_id/100004), the disk still wasn't showing up.
I tried to use Disk Utility, but it was no help.  The disk was listed, but it would not mount.  After scrolling through console some more, I found out that the problem was that the journal was invalid.  It needed to be disabled.

This [Apple discussion thread](https://discussions.apple.com/thread/1404087?start=0&tstart=0) held the command to disable on a raw disk:

<bash>/System/Library/Filesystems/hfs.fs/hfs.util -N /dev/partitionName</bash>

Almost there.  Once Journaling was disabled the volume was corrupted and a normal fsck (<bash>fsck_hfs /dev/partitionName</bash>) just wasn't working.  I tried the command I found on [this guy's site](http://techierambles.blogspot.com/2008/12/repair-disk-errors-like-invalid-node.html):

<bash>/sbin/fsck_hfs -yprd /dev/partitionName</bash>

And now the disk will mount properly!  The disk appears to be working.  So I went back into Disk Utility, selected my partition, and then clicked "Enable Journaling" to get that back up and running again.

(whew)
