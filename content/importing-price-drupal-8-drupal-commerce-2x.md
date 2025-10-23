---
title: "Importing a price in Drupal 8 for Drupal Commerce 2.x"
date: "2016-04-20"
tags:
draft: 
---

Just a quick note that if you're importing a Commerce price:

* you *must* set the `currency_code`.
* what was `commerce_price` in DC 1.x / Drupal 7 is now just `price`.
* the `number` can be a decimal now.

    'price/number': SomeFieldName
    'price/currency_code':
      plugin: default_value
      default_value: 'USD'

Note that you can also set up a constant in the migration definition and use the constant value:

    source:
      plugin: d6_ubercart_product_variation
      constants:
        currency: USD
    ...
    process:
      'price/number': SomeFieldName
      'price/currency_code': 'constants/currency'

It is worth mentioning that this fails silently right now. That is, if you don't provide the currency code, the migration will continue but you just won't have a value.

Update 2017-11-20: [Vimokkhadipa](databc.com) told me that `price/amount` in the example above should actually be `price/number`. Since I haven't done any migration work in a while I'm taking his word for it and noting the update. Thanks Vimokkhadipa!