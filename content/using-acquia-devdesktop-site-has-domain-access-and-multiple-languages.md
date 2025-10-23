---
title: "Using Acquia DevDesktop with a site that has domain access and multiple languages"
date: "2015-06-01"
tags:
draft: 
---

Acquia DevDesktop can be pretty slick at times for development, but if you're trying to work with a site that has domain access AND internationalization, you may be scratching your head a bit.

First off, you must correct the entries for the default site (or whichever site you're testing) in the domain and languages tables.

_But then..._

You'll need [this patch](https://www.drupal.org/files/drupal--i1645156-78.D7.patch) since Drupal 7.x Core doesn't handle port numbers properly.

Then your site will work!