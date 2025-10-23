---
title: "Building a Website with Drupal: A Methodology"
date: "2008-07-06"
tags:
draft:
---

"How do I build _X_ with [Drupal](http://drupal.org?")  I've received the question a few times... over the past few weeks as my friends and colleagues have been persuaded to give [Drupal](http://drupal.org?) a shot.
But there is still one question that remains.  Once you get past that initial step of getting your feet wet, you want more... and how do you get it?  Here is a guide.

h3.  Step 1: Ask yourself "What am I really trying to achieve?"

Don't limit yourself by what you know.  Write down what you really want your site to do and have.  Make a list, but keep it general -- don't write down any specifics.  Drupal is extremely powerful and flexible, but unless you can write PHP, it's easy to forget that you've got to play by the rules and use what is already available in order to get the most out of it.

h3.  Step 2: Find out the "Drupal" way of solving your problems

This is probably the toughest task you'll have in your endeavor.  In this step, you'll take the list of wants from Step 1 and find a module (or combination of modules) to make your ideas work in Drupal.  There are a couple of ways you can go about this.  One might work for you, but it'll usually take combination to get your list taken care of.

#  Head over to [drupal.org Modules Page](http://drupal.org/project/Modules) and start your search.  Modules are arranged by category.  If you create an account and login, you can filter by the version you are using.
# Just search [Google](http://google.com) for a rough idea of what you want.  drupal.org is indexed very well and not only will it return module search results, but forum posts and handbook pages that might have exactly what you need.
# Check out the [Drupal showcase](http://drupal.org/forum/25.)  There might be a site that has already done what you want and you can benefit from their experience.
# Post in the forums.  There are sections for [Post Installation](http://drupal.org/forum/22) and [Converting to Drupal](http://drupal.org/forum/37) where you can ask your questions, post scenarios.  Be nice, though.

Some modules that can really solve a whole blanket of problems easily are:

# [CCK (Content Creation Kit)](http://drupal.org/project/cck) - The Content Construction Kit allows you create and customize fields using a web browser.  Custom content types can be created in core, and CCK allows you to add custom fields to any content type.
# [Views](http://drupal.org/project/views) - The views module provides a flexible method for Drupal site designers to control how lists of content (nodes) are presented. Traditionally, Drupal has hard-coded most of this, particularly in how taxonomy and tracker lists are formatted.
# [Content Templates (Contemplate)](http://drupal.org/project/contemplate) - This module was written to solve a need with the Content Construction Kit (CCK), where it had a tendency toward outputting content in a not-very-pretty way. And as such, it dovetails nicely with CCK, adding a "template" tab to CCK content-type editing pages and pre-populating the templates with CCK's default layout. This makes it easy to rearrange fields, output different fields for teaser and body, remove the field title headers, etc.

h3.  Step 3: Have fun and play around

Install your modules, give it all a shot, and be patient.  Drupal has a learning curve, but it's well worth it if you play around with it and try not to rush.  It's tough to approach it with that frame of mind if you've got a site you "just want built" and don't have the time (or the patience) to sit down and play around with it.  There is a wealth of resources out of there on the intertubes.  You just have to look for it.

There is a lot that can be achieved with what is out there now.  It's all about finding the right modules and implementing them correctly.  You can build some pretty interesting sites without even touching a single line of PHP.

h3.  Step 4: Write a module

If you just can't find the solution to a particular problem (or, more likely, the *exact* implementation of a solution, you'll need a module.  Modules in drupal are tough to start off.  The [API for drupal](http://api.drupal.org) is pretty big.  There may already be a [hook that does what you need](http://api.drupal.org/api/group/hooks/5.)

At any rate, there are some problems that can *only* be solved with a module.  Also, there are some problems that can only be solved by *patching drupal core*.  I don't recommend the latter, because it can create problems down the road with upgrading.  In general, you may want to explore a trade-off or look at another way to solve the problem if it involves making a change to the drupal core.

Drupal core, by the way, is anything that comes with a default installation of a downloaded drupal source tarball.  [There are reasons why certain things aren't in core](http://api.drupal.org/api/group/hooks/5.)  Keep this in mind.

Writing about module development tactics could take up another post, so we'll just leave Step 4 where it is.

I hope you found this post useful.
