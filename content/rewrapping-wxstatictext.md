---
title: "Rewrapping wx.StaticText"
date: "2014-09-02"
tags:
draft: 
---

Per [this thread](http://wxpython-users.1045709.n5.nabble.com/Wrapping-StaticText-again-td2362691.html) (see the [_Rewrap function in Robin's example code](http://wxpython-users.1045709.n5.nabble.com/Wrapping-StaticText-again-td2362691.html#d1205537500000-860)), you need to set the Label Text again in order for it to update properly:

    def _Rewrap(self): 
        self.st.Freeze() 
        self.st.SetLabel(self._label) 
        self.st.Wrap(self.GetSize().width) 
        self.st.Thaw() 

You may also need to call `self.Layout()` (which is the parent of the StaticText element) in order to make sure everything is a-okay.