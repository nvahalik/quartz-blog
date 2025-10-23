---
title: "Carbon today() vs. now()"
date: "2021-01-13"
tags:
draft: 
---

Beware of `Carbon::today()` vs. `Carbon::now()`. They are not synonyms. The former is equiv. to `Carbon::now()->startOfDay()`.

This is important, especially in test environments. If you're thinking that `Carbon::today()` is _actually_ today... well I suppose it is, but in what *timezone*?

I had a test that was doing something calculated off of `Carbon::today()->subDays(1)` and that is not equal to `Carbon::now()->subDays(1)`.