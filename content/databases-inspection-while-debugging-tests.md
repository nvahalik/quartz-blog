---
title: "Databases inspection while debugging tests"
date: "2021-05-04"
tags:
draft: 
---

While debugging, I use a local MySQL database. Sometimes, I want to inspect the contents of the DB while the tests are running to I can check out the state of things.

This is how I do it.

Add a breakpoint to your code, and then open up your query environment of choice:

    set tx_isolation="READ-UNCOMMITTED";

Now run whatever queries you want to inspect the DB.

The `tx_isolation` change will only impact the current session.