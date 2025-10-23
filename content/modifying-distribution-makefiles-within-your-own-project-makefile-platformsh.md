---
title: "Modifying distribution Makefiles within your own project Makefile on Platform.sh"
date: "2016-02-24"
tags:
draft:
---

As I've written about in the past, Platform.sh's Makefile build system is pretty sweet. One of the things that confuse me the most, however, is how to make a change to a distribution (such as adding a patch) without making things even more complicated.

Hat tip to [Tavi Toporjinschi](https://www.drupal.org/u/vasike) for writing the original example this is based off of.

Let's say for a moment that you want to add a patch to a module included in a distribution. If you're just starting out, you could actually just override the module and add it to `sites/default/modules` by including it within your existing file like so:

    projects[commerce_paypal][version] = "2.3"
    projects[commerce_paypal][patch][2082691] = "https://www.drupal.org/files/issues/2082691-24-support_paypal_adaptive_payments_-chained_0.patch"

However, if you're wanting to change a module that you've already been using, you'll want to modify the distribution directly from within _your_ Makefile.

To do this, start by grabbing a copy of the distribution's git repository (**and make sure you're working from the same version that you're using in your Makefile!**). [Here's instructions for Commerce Kickstart](https://www.drupal.org/project/commerce_kickstart/git-instructions). Once you've done that, open up `drupal-org.make` which is the main Makefile for Commerce Kickstart.

In this particular instance, what I'd like to do is use the [`-rc4` version](https://www.drupal.org/node/2647078) of [Commerce Message](https://www.drupal.org/project/commerce_message). So I'll go ahead and make that change by finding the line that says:

<code>projects[commerce_message][version] = 1.0-rc3</code>

It will now read:

<code>projects[commerce_message][version] = 1.0-rc4</code>

Now that I've got my change and I've tested it (which I'm skipping for now), it's time to add it back into my project. To do this, we'll grab a diff of the change:

<bash>commerce_kickstart$ git diff > commerce_message_to_rc4.patch</bash>

The file `commerce_message_to_rc4.patch` will look something like this:

    diff --git a/drupal-org.make b/drupal-org.make
    index 45fef75..b497a53 100644
    --- a/drupal-org.make
    +++ b/drupal-org.make
    @@ -48,7 +48,7 @@ projects[commerce_moneybookers][patch][] = "http://drupal.org/files/commerce_mon
     projects[commerce_paypal][version] = 2.3
     projects[commerce_paypal][patch][2458721] = "https://www.drupal.org/files/issues/commerce_paypal-addressfield-default-values-2458721-1.patch"
     projects[commerce_backoffice][version] = 1.5
    -projects[commerce_message][version] = 1.0-rc3
    +projects[commerce_message][version] = 1.0-rc4
     projects[commerce_search_api][version] = 1.4
     projects[commerce_add_to_cart_confirmation][version] = 1.0-rc2
     projects[commerce_kiala][version] = 1.0-rc1

To add this to my project, we'll create a `patches/` directory within the project (if it doesn't already exist) and copy that patch into the directory.

<bash>commerce_kickstart$ mkdir ~/Platform.sh/myproject/repository/patches
commerce_kickstart$ cp commerce_message_to_rc4.patch ~/Platform.sh/myproject/repository/patches/</bash>

Now, we just need to patch the distribution within the Makefile. How do we do that? With a patch, of course! You probably have a line like this in your makefile:

    projects[commerce_kickstart][type] = core

This downloads the "core" version of Commerce Kickstart. This is the one that you get when you download directly from [Commerce Kickstart's module page](https://www.drupal.org/project/commerce_kickstart) or when you download `commerce_kickstart-7.x-2.33-core.tar.gz` from the [releases page](https://www.drupal.org/node/1079066/release).

This will then be replaced with the following:

    projects[drupal][type] = core
    projects[commerce_kickstart][type] = profile

    ; Use dev git version with patch.
    projects[commerce_kickstart][download][type] = git
    projects[commerce_kickstart][download][branch] = 7.x-2.x
    projects[commerce_kickstart][patch][] = "patches/commerce_message_to_rc4.patch"

And... breaking it down:

`projects[drupal][type] = core` signals that we're using Drupal core as the base install. Then, we're installing `commerce_kickstart` as a profile on top of that (`projects[commerce_kickstart][type] = profile`). When installing the profile, we specify `git` as the download type and the branch (`7.x-2.x`) that we are working on so that we get the correct version of the code that we worked on up above (which include's _its_ Makefile). Finally, `projects[commerce_kickstart][patch][] = "patches/commerce_message_to_rc4.patch"` patches the distribution so that it downloads the `-rc4` version of Commerce Message.

Now, build the project, if everything is correct, as the build goes by, you'll see the correct module being downloaded:

     >> commerce_authnet-7.x-1.1 downloaded.                             [ok]
     >> commerce_message-7.x-1.0-rc4 downloaded.                         [ok]
     >> commerce_physical cloned from                                    [ok]
    http://git.drupal.org/project/commerce_physical.git.

And there we go. Now, push it up to your repository, and you're all set!
