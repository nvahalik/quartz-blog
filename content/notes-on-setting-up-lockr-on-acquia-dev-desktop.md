---
title: "Notes on setting up Lockr on Acquia Dev Desktop"
date: "2017-09-01"
tags:
draft: 
---

Have been playing around with [Lockr](https://lockr.io) on Drupal 7 and want to play around with it locally and so I fall back to Acquia Dev Desktop.

Just as a note, as of the writing of this blog post, Acquia Dev Desktop ships with an invalid `openssl.cnf` location, so you have to provide one.

I found this out when I started getting this message while trying to create a certificate locally:

> RuntimeException: Could not create private key. in Lockr\\SiteClient->createCert() (line 37 of /Users/nvahalik/tmp/lockr/src/Lockr/SiteClient.php).

Bummer. Anyway. The fix is simple. Just add the following to your `settings.php` or `local.settings.php` (if you're on a Mac):

```putenv("OPENSSL_CONF=/private/etc/ssl/openssl.cnf");```

And if you're using Lockr, make sure [this patch](https://www.drupal.org/node/2906192#comment-12243884) is applied. The patch is needed due to [this bug in PHP](https://bugs.php.net/bug.php?id=60157).

Once you've done that you should be ready to lock and roll!<!--See what I did there?-->