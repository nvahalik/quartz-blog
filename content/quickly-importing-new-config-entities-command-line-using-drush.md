---
title: "Quickly importing new config entities from the command line using Drush"
date: "2016-04-18"
tags:
draft:
---

Drush's `cset` command is a bit picky, but with a few command line options, we can get it to import a yaml file into our site's config:

    drush -y --format=yaml cset config.entity.string '' - < config_file.yml

This will put the entirety of `config_file.yml` into the configuration entity `config.entity.string`.

The `-y` is required because `drush` will ask you if you want add a new entity (and of course you do!). The "trick" if it even is that, is the `''` before the `-` to read from STDIN.
