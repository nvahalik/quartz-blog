---
title: "SmartSleep Can Kill Your Battery Life"
date: "2009-07-07"
tags:
draft:
---

I usually switch my system to "Better Energy Savings" while on battery.  It kept switching back to "Custom."  I ended up tracking the problem down to a program called [SmartSleep](http://www.jinx.de/SmartSleep.html.)  It appears that it was  changing my settings to Custom about every 30 seconds or so:

<code>de.jinx.SmartSleepDaemon[54] SmartSleepDaemon: setting hibernation state to: 0</code>

If you are wanting to get the best out of your battery life while not connected to a power source, you might want to disable [SmartSleep](http://www.jinx.de/SmartSleep.html.)  It consistently shaved 30 minutes off of my runtime when it was set to "smart sleep."
