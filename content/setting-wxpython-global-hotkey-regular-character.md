---
title: "Setting a wxPython Global Hotkey with a Regular Character"
date: "2014-08-31"
tags:
draft: 
---

If you're trying to set up a global hotkey in Windows, you can use the win32con.VK_* codes to set a hotkey that uses a regular character (e.g. Control-Alt-B), but on OSX it's not as clear. However, a quick look at [the patch](http://trac.wxwidgets.org/changeset/67574) reveals that all you need to do is pass the ASCII character code for the character you want by using `ord()` like so: 

    result = self.RegisterHotKey(hkid,
        wx.MOD_CONTROL|wx.MOD_SHIFT,
        ord('r'))

And now, when you hit Control-Shift-R, the event will fire.

For what it's worth, you can also use `ord()` with [`wx.GetKeyState()`](http://www.wxpython.org/docs/api/wx-module.html#GetKeyState) to detect if a character has been pressed on the keyboard. Not sure how this works for international apps, but it works great for my purposes:

    print wx.GetKeyState(ord('h')) # Prints true if the 'h' key is currently pressed