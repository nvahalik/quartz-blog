---
title: "PyAudioMixer: A more versatile Python Audio Mixer"
date: "2014-09-07"
tags:
draft: 
---

When I came across [swmixer](https://pypi.python.org/pypi/SWMixer), it seemed it answered 90% of my needs for a mixer for an amateur radio application I was working on. However, the one thing that it didn't support that was a deal breaker was that only one mixer could be set up. This was no bueno.

The wonderful thing about [swmixer](https://pypi.python.org/pypi/SWMixer), though, was that it seemed like it would lend itself well to being more objectified so that more than one mixer could be set up. And that's exactly what happened.

[PyAudioMixer](https://github.com/nvahalik/PyAudioMixer) is a fork of [swmixer](https://pypi.python.org/pypi/SWMixer) with the following changes (roadmap items in *italics*):

* Multiple discrete mixers
* Microphone as a channel (with volume control)
* Frequency and DTMF Generators
* Support for unlimited length (live) audio streams (partially completed)
* *Mixer to mixer I/O*
* *Output to file*
* *Network transport & codec support*

Patches and comments are welcome!