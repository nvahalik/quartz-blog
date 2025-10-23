---
title: "All code (and coding) is moral"
date: "2015-10-19"
tags:
draft:
---

So I was reading through some blogs this weekend and came across [an article about VW on the Clean Code blog][ccb]. It's a short post and I suppose if you wanted a summary blurb, it would be this:

> I think that argument is even more asinine than Michael Horn's. They knew. And if they didn't know, they should have known. They had a responsibility to know.

All too often, we tend to separate the code we write from what it does. In writing open-source Drupal modules, it might be very easy to try to say that there is a certain neutrality about what we do. Take for instance, one of my lowly modules [Permission Report][pr]. All this module does it take existing information and display it to the user. It doesn't modify any values. And you could say that what it doesn't isn't good or bad—that it's morally neutral.

However, if something were *wrong* with my program, people would say something. If it were hiding certain roles or providing bad information, it could be an innocent mistake or it could be something malicious. But it would be flawed. The code itself would be bad. And we are no longer in neutral territory. If the code doesn't get changed, the code will be marked as such and it will eventually be replaced or forgotten by the community.

My point is, we don't do this for code that is "morally neutral." All code has some moral capacity in it. This parallels tangible objects such as cars, knives, and baseball bats which have a particular purpose but can be wielded in negligent or malicious ways. Likewise, open source code projects that have modules can be likewise wielded in ways that might align with or otherwise diverge from what we as individuals consider to be good, right, or true.

Now, for a module in a particular open source project that does a particular purpose: sending emails or handling a transaction, it *could* be used in a project that ultimately disagrees with our own worldview. However, the module itself with it's general quality, tests, and other functionality might be considered morally good, but the resulting use of it might be considered likewise to be morally wrong. But the point is that we didn't write the resulting use, we wrote the intended use and someone else wrote the final moral component. That doesn't change the fact that what we wrote was morally good, just that someone took something good and misused it. There is a difference between creating something good and having it's usage corrupted by circumstances and crafting the corrupting circumstances.

Circling back to the VW article, I'd like to make two points, then:

1. **As a programmer, we have a right—perhaps even a responsibility—to understand what the purpose is for what we are building.** I think this is clear from what the author is saying. I would agree with this statement.
2. **Therefore, as a programmer, we have a right to decline work which we personally disagree with.** While not stated explicitly, if the argument is that a programmer can and should be held responsible for code they wrote, then they should have the ability to decline to do so on the basis of legal or personal moral dissonance.

Programming, then, is a moral activity and should be treated as such by all who engage in it. Are we ready for this discussion?

  [ccb]: http://blog.cleancoder.com/uncle-bob/2015/10/14/VW.html
  [pr]: https://www.drupal.org/project/permission_report
