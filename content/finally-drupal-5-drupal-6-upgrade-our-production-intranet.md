---
title: "Finally: Drupal 5 to Drupal 6 Upgrade of our Production Intranet"
date: "2010-03-15"
tags:
draft: true
---

Since getting to RVOS, a lot of my focus has been on improving things.  Improving the network (new APs, redundant switches), infrastructure downtime (40+ hours a week to &lt;2 hrs a week), improving applications (bugfixes on custom apps), and in general, the way business is done.

Our intranet went live in Q3 of 2007, when [Drupal 6 was still -beta1](http://drupal.org/node/175832).  Right after we went live, I tried to upgrade and failed miserably.  Ultimately, the idea got pushed to the back burner over and over for several years until roughly 2 weeks ago.

I figured this would be somewhat easy since most of the modules now have 6.x counterparts.  This assumption probably would have been true if I was updating a simple Drupal site.  However, Views, Panels, and all of our custom modules have been throwing me for a loop.

Here's just a snapshot of what I've found so far:

1. Upgraded Panels that had views had to be rebuilt after *cough* manually converting the Views.  This doesn't bother me so much, but it's still painful on over 40 custom views.
2. All of my blocks were automatically disabled after the upgrade.
3. The groups part of [LDAP integration module](http://drupal.org/project/ldap_integration) doesn't upgrade properly.  The names of the columns in 5.x start with `ldap_groups_` but in 6.x they start with `ldapgroups_`.  I'd work on a patch, but I'm just not sure how to actually 'rename' a column with the whole [Schema API](http://api.drupal.org/api/group/schemaapi/6) in Drupal 6.
4. LDAP integration also breaks customizations.  To do custom mapping of OUs to Roles, you had to edit a config file in the 5.x version.  In 6.x, it's a configuration parameter in the admin area.  That's actually great, but pretty much ruins any chance of automating it besides writing a custom module to stick that value in there (which I'm doing.)
5. Errors, errors everywhere.  Most of them appeared to be benign, but seeing several hundred errors flood out of an update script can be very unnerving.
6. Running the update script felt like Windows Update.  Had to re-run it five or six times before it finally got everything.  Probably due to the above.

Anyhoo, now that I've vented, let the progress commence again!
