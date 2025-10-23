---
title: "Hot code updates for Cordova applications"
date: "2022-01-23"
tags:
draft: 
---

A long time ago, I used and (mostly) loved Ionic's [Live Update](https://ionic.io/docs/appflow/quickstart/deploy) (iirc, I think it was called Deploy in the past) functionailty. The idea is really simple. Your "app" lives on-device in a `www/` directory that gets served up by Cordova. There really isn't anything magical about it but why can't you just check to see if your application has updates files every time you start it up? And, if it does, update your files and _then_ launch the app?

Well, that's what Live Update does.

There are some caveats, though.

Obviously, the updates can't add/remove/update Swift/Objective-C libraries or modules. Bugs or improvements in those modules can't managed through this method.

The only real "gotcha" here is that Ionic makes you pay for Deploy credits. By default you currently get 25k per month. This is probably enough if you want to update a small group of users a few times a day, but it isn't enough if you want to push out a large number of updates across the board.

In a way, this whole thing sort-of offends my sensibilities. Why would I pay _per-device_ to deliver a `www/` directory, when CDNs and other systems allow me to do this for _pennies_.

Well, if you're offended by this, like me, then you probably are wondering if there are other options.

Well, _sort of_.

Here's what I've found in my research.

* https://github.com/mnill/cordova-app-updater - Seems like it allows you to make individual file updates available to your Cordova application. Probably not helpful for larger applications or ones that use generated code modules from webpack. Hasn't been updated in over 4 years. **Dead-end.**
* https://github.com/nordnet/cordova-hot-code-push - Also deprecated. Updated about 3 years ago as of time of writing. There appears to be a handful of offshoots that have some recent updates. ([This one](https://github.com/ApowoGames/cordova-hot-code-push) in particular has been updated in the last few weeks.)
* https://github.com/Microsoft/cordova-plugin-code-push - Marked as read-only, this system was effectively a competitor to Appflow Deploy (or at least, it seemed to be). So unless you're planning on using ~~CodePush (now App Center)~~ (nevermind, they [killed off Cordova support completely](https://devblogs.microsoft.com/appcenter/announcing-apache-cordova-retirement/)). Looks like some folks are talking about writing a [replacement for CodePush](https://github.com/IllusionVK/ReplaceAppCenter) but it doesn't seem that much progress has been made. **Dead-end.**

Looks like there are 2 main options here:

1. Use the `chcp` (`cordova-hot-code-push`) module.
2. Set up Appflow Deploy.