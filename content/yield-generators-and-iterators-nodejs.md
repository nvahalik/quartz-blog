---
title: "Yield, Generators, and Iterators in Node.js"
date: "2017-03-09"
tags:
draft: 
---

Although I love Drupal, lately some of my projects have had me delve into learning new technologies and Stacks. The one I've spent more time with lately is Node.js.

One reason for this is that I've actually known JavaScript longer than I've known PHP. I started doing JavaScript about 21 years ago... (that feels like a lifetime ago). Anyhoo, I digress.

I tried playing around with [Koa](http://koajs.com) last night and it seems really slick. However I was trying to map my mind around this whole yield thing as well as how yield and Generators work together with yield to fundamentally change the way Javascript works.

So it finally dawned on me last night after reading some great articles:

* [How yield will transform Node.js](https://blog.alexmaccaw.com/how-yield-will-transform-node)
* [A Study on Solving Callbacks with JavaScript Generators](http://jlongster.com/A-Study-on-Solving-Callbacks-with-JavaScript-Generators)

That given this code:

    var b = function* () {
      yield 1;
      return 4;
    }

    let c = b();
    console.log(c.next()) // { value: 1, done: false }
    console.log(c.next()) // { value: 4, done: true }

That in a sense you *could* rewrite it as:

    var a = function () { return 1; }
    var b = function () { return 4; }

    console.log(a()) // 1
    console.log(b()) // 4

Whenever a yield is encountered, it sort-of slices up the function and returns control back to the caller. The next time `.next()` is called, the yield expression is resolved and execution picks up where it left off.

Just had to write some thoughts down so I could process them.