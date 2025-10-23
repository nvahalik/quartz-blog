---
title: "Acquia Dev Desktop and the Drupal 7 test runner"
date: "2015-11-15"
tags:
draft: 
---

Recently, I tried to run some tests locally and the test runner kept silently failing. Ultimately, it was just giving up during bootstrap. The problem was eventually traced to Acquia's frustrating modification of the settings.php file; it only loads when `$_SERVER['DEVDESKTOP_DRUPAL_SETTINGS_DIR']` is defined.

So in order to make it run, you'll need to:

1. Define `DEVDESKTOP_DRUPAL_SETTINGS_DIR` in your CLI environment _or_:
2. Modify `run-tests.sh` to populate that value in `$_SERVER` before bootstrapping Drupal:

<php>
  $_SERVER['HTTP_USER_AGENT'] = 'Drupal command line';
  $_SERVER['DEVDESKTOP_DRUPAL_SETTINGS_DIR'] = '/Users/myusername/.acquia/DevDesktop/DrupalSettings';
</php>

Then the test runner will actually do something useful.