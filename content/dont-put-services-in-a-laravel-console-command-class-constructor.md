---
title: "Don't put services in a Laravel Console command class constructor"
date: "2021-04-20"
tags:
draft: 
---

It will attempt to resolve the component, and that might not take place when you want it to.

You know, for instance, before your cached config gets cleared and `composer dumpautoload` tries to run and barfs.