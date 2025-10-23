---
title: "A quick note about Drupal Commerce price updaters that use Feeds and Feeds Validation"
date: "2016-03-31"
tags:
draft:
---

Perhaps this may save someone else some time:

If you're wanting to do price updating in [Drupal Commerce][dc] using [Feeds][feeds], you'll normally use a field that is guaranteed unique. The Product ID and Product SKU fields (provided by the [Commerce Feeds][cf] module) give this to you out of the box, but if you're wanting to give a user the ability to match by something else: say, a catalog number or some vendor part number that is an actual field on the product entity itself, you might have already looked at [Field Validation][fv] to do this.

The general idea goes like this:

1. Set up field validation so that the field you're wanting to use has the "Unique value" validator.
2. Now, in Feeds, that field will show as being able to be used as a unique field.

This works for fields that are used on a single entity bundle, but **not** for fields that are used on multiple entities.

The problem arises when it tries to read the configuration for the bundles out of the field_validation_rule table. It might work if you have it defined  for **every** instance of the field on **every** bundle, but I haven't tried that.

Make your life easier by just using [Feeds Tamper String2ID][s2id], and creating a view that does a lookup from whatever field you're wanting to match with to the Product ID. Then, let [Commerce Feeds][cf]' ProductProcessor do the rest.

 [fv]: https://www.drupal.org/projects/field_validation
 [dc]: https://www.drupal.org/projects/commerce
 [feeds]: https://www.drupal.org/projects/feeds
 [cf]: https://www.drupal.org/projects/commerce_feeds
 [s2id]: https://www.drupal.org/projects/feeds_tamper_string2id
