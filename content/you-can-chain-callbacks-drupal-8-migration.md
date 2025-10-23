---
title: "You can chain callbacks in a Drupal 8 migration"
date: "2016-04-20"
tags:
draft:
---

If you're wanting to do some advanced processing (e.g. lowercasing a word and then capitalizing the first letter) you can chain the two callbacks to get the desired effect:

    process:
      name:
        -
          plugin: callback
          source: MyVar
          callable:
            - '\\Drupal\\Component\\Utility\\Unicode'
            - 'strtolower'
        -
          plugin: callback
          callable:
            - '\\Drupal\\Component\\Utility\\Unicode'
            - 'ucfirst'

The two transformations will take place one after the other. The first one will execute and pass in the value straight from the source (e.g. `'SOMEVAR'`). The next one will get the result (e.g. `'somevar'`) and then the the final value will be (`'Somevar'`).
