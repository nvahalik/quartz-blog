---
title: "Initial impression of the Hamshield"
date: "2016-05-23"
tags:
draft:
---

Background and Intro
-----

The Hamshield was a [Kickstarter](https://www.kickstarter.com/projects/749835103/hamshield-for-arduino-vhf-uhf-transceiver) that ended sometime last summer. The original expected delivery date was October of 2015, but due to issues with manufacturing and a problem with their amplification circuits, it was delayed. I won't go into the details here, but you can read it on their Kickstarter page:

<iframe width="640" height="360" src="https://www.kickstarter.com/projects/749835103/hamshield-for-arduino-vhf-uhf-transceiver/widget/video.html" frameborder="0" scrolling="no"> </iframe>

They started shipping about 3-4 weeks ago.

I got my Hamshield about 2 weeks ago. I was wanting to do more with it once I got it, but we're in the process of moving (and since it required some [assembly & soldering](http://www.instructables.com/id/Getting-Started-With-HamShield/)) it had to wait until I could bust out the old soldering iron before I could do anything with it. Anyway, here are my thoughts and initial impression.

Assembly
-----------

Soldering on the headers wasn't bad at all. Once I got started, it took about 5 minutes to work through them. The GND pins by VIN didn't seem to want to solder very well at all. But everything else went very quickly.

![The GND pins needed more love](https://www.nickvahalik.com/sites/nickvahalik.com/files/IMG_3391_0.jpg)

The SMA connector was a bit much for my little 15 watt iron. Of course, all I had was a fine-tip on my iron, so a bigger tip would work much better on the SMA. My suggestion is to get the two pins on the back first, since they are smaller and tinned and tacked down much more easily than the pins on the tip of the board. I've got a 20W iron somewhere and I'll probably resolder this once I find it and put a bigger tip on it.

The only other "gripe" I had about the SMA jack (and this is really just due to my lack of a good tool) is that there are components **really** close to the jack. I'm talking about C19 and R9, specifically. It was tough to get the iron good and close to the pins. Take a look:

![SMA pins did not solder well and there were components very close to them](https://www.nickvahalik.com/sites/nickvahalik.com/files/IMG_3392_0.JPG)

The only other real thing that bothered me was the proximity of the headers near the USB port on the Uno:

![Close-up of the header pins and the USB jack on the Uno](https://www.nickvahalik.com/sites/nickvahalik.com/files/IMG_3388.JPG)

I stuck a piece of electrical tape on there just to be safe. It looks a little close for comfort.

Oh, and one other note. My shield didn't come with pass-thru headers... like most shield would have so that you could stack them. Not sure if that was a mistake or not, but it would be nice.

Using the Examples
-----------------------

The folks over at [Enhanced Radio Devices](http://enhancedradio.com/) provide an [Arduino library](https://github.com/EnhancedRadioDevices/HamShield) on Github so that you can use and build stuff with your new shield.

Out of the box, I couldn't get the libraries to compile. I've [submitted a pull-request to fix the issue](https://github.com/EnhancedRadioDevices/HamShield/pull/18), which appears to just be a pre-processor define that uses a hyphen in the name.

Once that was fixed, I was able to get the FMBeacon example loaded and going on the device. The audio was a bit anemic, but it does work:

<iframe width="560" height="315" src="https://www.youtube.com/embed/6DUnz-QK69Q" frameborder="0" allowfullscreen></iframe>

However, many of the other examples did not compile, [JustTransmit does not work](https://github.com/EnhancedRadioDevices/HamShield/issues/16) and some of the other ones do not work on Uno [due to memory constraints](https://github.com/EnhancedRadioDevices/HamShield/issues/17).

There is also a reference in some of the applications to a PCM.h. There doesn't appear to be any documentation of what that is, specifically, but there are some [PCM libraries for Arduino](https://github.com/RayHightower/Arduino/blob/master/libraries/pcm/PCM.h). So perhaps those would work.

Review
---------

Well, I'm still excited about using the Hamshield. Though, it still seems like there is much to be cleaned up in the Arduino library and example applications. It'd be nice to be able to test things a bit better and I'm regretting not getting some sort of case for it since a 5W transmitter within a couple of feet will cause the unit to reboot. (I was trying to test the RSSI readings and it would just reboot while I tried this using a Baofeng HT).

Personally, I'd recommend getting some SMA pigtails and using that instead of the supplied antenna, but it will work in a pinch. It's hard to handle this thing with the antenna fully extended.

That's all for now. Thanks Casey and the folks at ERD for their efforts—looking forward to using it in my first real project!
