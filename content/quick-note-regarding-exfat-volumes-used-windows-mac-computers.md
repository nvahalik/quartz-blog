---
title: "A Quick Note Regarding ExFat Volumes Used On Windows & Mac Computers"
date: "2013-10-20"
tags:
draft:
---

I've reverted to using 16GB SD Cards to move sundry items between an ASUS Laptop and a MacBook Pro.  While not the speediest method, it is the fastest considering that:

* The MacBook Pro lacks an onboard Gigabit Ethernet adapter (and I guess I'm too cheap to [spend the $30 to get one](http://store.apple.com/us/product/MD463ZM/A/thunderbolt-to-gigabit-ethernet-adapter)).
* Although I've got 802.11n running in full force the ASUS is stuck at G.
* All my external big HDDs are HFS+ Formatted...
* etc.

When formatting the SD card most recently, Windows decided to ask me what allocation unit size I wanted. Fair enough, I thought.  I'll set it to something reasonable considering that I'm going to end up putting some rather large files on it.

![Windows dialog box showing the available allocation unit sizes for ExFat](/sites/nickvahalik.com/files/Untitled_0.jpg)

> **What's an allocation unit?** Allocation unit sizes are basically the minimum amount of space that is needed to take up one file on a drive.  For example: a 4K (kilobyte) allocation size means that even if you saved a file with the word "um" in it, it would still take up 4K on the drive itself.  Why does this matter?  Well, this matters because the computer needs to be able to keep track of what files go where and so each unit is recorded during formatting.  I'll not go into the math here, but the implications are simple: If you know you're only going to be storing huge files (videos, MP3s, Virtual machines, etc.) on a device with limited resources such as an SD Card, you can "save" some space, by increasing the allocation unit, requiring less space to keep track of all of those units.  Yeah, the difference is only a few megs, but it feels good to know I'm squeezing everything I can out of it!

**Ahem.  Anyway.** So I formatted with a generous 16M allocation unit size.  After all, I'm really only storing one or two files on this bad boy.  All was great until I stick it into my Mac and noticed it wasn't mounting.  A little more sniffing around in the logs and I found this:

> 10/19/13 9:37:41.754 PM diskarbitrationd[16]: unable to mount /dev/disk3s1 (status code 0x00000047).

I poured over the intertubes to no avail.  I ultimately ended up having OSX format the drive.  What _appears_ to have happened was that OSX did not like the large block size I assigned to it.  It seems to have formatted the device with a 128KB block size. (`touch test; stat -f "%k" blah"` returned `131072`).

So if you happen to have a problem like this, make sure your block size is 128KB (or maybe lower?)  It appears that windows defaults to 32KB.

**Note:** Also, as mentioned before, if you do find a way to use it with a huge block-size, make sure you [disable Spotlight on the drive](http://osxdaily.com/2011/12/30/exclude-drives-or-folders-from-spotlight-index-mac-os-x/) so that you don't end up wasting space with the lots of little dotfiles that Spotlight puts on a partition.
