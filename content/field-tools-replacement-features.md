---
title: "Field Tools as a replacement for Features"
date: "2016-04-04"
tags:
draft:
---

One of my new favorite modules recently has been [Field Tools][ft]. What I love about it is that it presents you with the ability to export all of the fields on a particular bundle (or even just a single field).

Then, you can just use `field_create_field` or `field_create_instance` in a little loop.

Take for example (in a module's .install file):

<!-- language: lang-php -->

<code lang="php">
function mymodule_install() {
  $fields = mymodule_get_some_fields();

  foreach ($fields as $name => $field) {
    field_create_field($field['field']);
    field_create_instance($field['instance']);
   }
}
</code>

Then, inside of `mymodule_get_some_fields()` you just put the output of Field Tool's export:

<!-- language: lang-php -->

    function mymodule_get_some_fields() {
      $fields = array();
      // Start export.
      $fields['field_name'] = array(
        'field' => array(...),
        'instance' => array(...),
      );
      $fields['another_field_name'] = array(
        'field' => array(...),
        'instance' => array(...),
      );
      // End export.
      return $fields;
    }

See, the magic is that the `$fields` export includes two sub-arrays: `'field'` and `'instance'`. That's what then powers the ability to just run it through the foreach above and it create your bases and your instances.

A couple of caveats:

* You should probably check to see if the field exists before creating it. Otherwise, it'll throw an Exception.
* It dumps everything in the exports, and so you might need to clean them up a bit by checking to ensure that you're not adding them to extra bundles or something like that.

But for most cases, this is way simpler than using [Features][features] and having to bring it in as a dependency.

 [ft]: https://www.drupal.org/project/field_tools
 [features]: https://www.drupal.org/project/features
