---
title: "Theming Local Task Tabs in Drupal 6"
date: "2010-05-14"
tags:
draft:
---

In one of the primary applications on our intranet, we use small icons in the process to help our Agents and Home office users through the process.

Agents see something like this:

![](/sites/nickvahalik.com/files/agents_tab_icons.png)

While our employees see something more along the lines of this:

![](/sites/nickvahalik.com/files/user_tab_icons.png)

There are various combinations but the point that I'd like to impress is that a use-case exists for theming Drupal's MENU_LOCAL_TASK tabs.

In Drupal 5, you could get away with doing stuff like this in [hook_menu](http://dgo.to/hook_menu?):

<?php
    $items[] = array(
      'path' => 'node/'.arg(1).'/reject',
      'title' => 'Reject',
      'type' => MENU_LOCAL_TASK,
      'callback' => 'drupal_get_form',
      'callback arguments' => array('pcf_casetracker_form_reject',$node),
      'access' => $finish_access,
      'weight' => 3,
      'class' => 'hasicon reject'); // Special class for my my tab.
?>

Then, a simple theme override:

```php
function garland_menu_local_task($mid, $active, $primary) {
  $item = menu_get_item($mid);
  if ($active) {
    return '<li class="active'.($item['class']?' '.$item['class']:'').'">'. menu_item_link($mid) ."</li>\\n";
  }
  else {
    return '<li'.($item['class']?' class="'.$item['class'].'"':'').'>'. menu_item_link($mid) ."</li>\\n";
  }
}
```

Would give you the intended results.

This, however, does not work in Drupal 6.  There are two reasons:

Firstly, in Drupal 6, two theme functions are used to build links to menu tabs:

<?php theme('menu_item_link', $link) ?>
<?php theme('menu_local_task', $link, $active = FALSE) ?>

menu_item_link takes the actual menu router item as a parameter.  It returns an HTML link.   menu_local_task takes just the link, wraps it with an &lt;li&gt; tag, and adds the appropriate class if it is $active.  At no time does the $menu_router item get passed to the function where it could affect the display of the &lt;li&gt; tag.

Secondly, the menu router system stores all of its values in a table called... menu_router.  Writing entries to this table strips them of any values which are not in the table to begin with.  So adding <?php 'class' => 'css_class' ?> in the menu's item in [hook_menu()](http://dgo.to/a/hook_menu) does nothing.

So how do we do this?  I've got a hack, and a possible "fix."

h3.  The Hack

In the menu system, <?php 'page arguments' ?> and <?php 'access arguments' ?> can be utilized to pass extra parameters to your page and access callbacks.  These arguments get serialized before they get sent to the database.  So you can actually stick a bunch of stuff in here.  So, if you write your own access callback to only utilize the first param, you can stick extra information on those callback arguments like so:

<?php
  $items['node/%pcf_node/reject'] = array(
    'title' => 'Reject',
    'type' => MENU_LOCAL_TASK,
    ...
    'access callback' => 'pcf_casetracker_can_finish',
    'access arguments' => array(1, array('class' => 'hasicon reject')),
  );
?>

And then simply override your theme callbacks to do some trickery.  Basically, test for that extra set of classes and build the link and the item entry in theme('menu_item_link') instead of building it in theme('menu_local_task').  Then, if menu_local_task detects the '&lt;li' at the beginning, it will just let it pass through.  Now your &lt;li&gt; tags can have extra css or attributes passed to them.

<?php
function garland_menu_local_task($link, $active = FALSE) {
  if (substr($link, 0, 3) != '<li')
    return '<li '. ($active ? 'class="active" ' : '') .'>'. $link ."</li>\\n";

  return $active ? str_replace('class="', 'class="active ', $link) : $link;
}

function garland_menu_item_link($link) {
  if (empty($link['localized_options'])) {
    $link['localized_options'] = array();
  }

  if ($link['access_arguments'] && ($stuff = unserialize($link['access_arguments'])) && is_array($stuff) && ($b = array_pop($stuff)) && is_array($b)) {
    if ($b['class']) {
      $link['class'] = $b['class'];
    }
  }

  if ($link['class']) {
    return '<li class="'.($link['class'] ? ' '.$link['class'] : '').'">'. l($link['title'], $link['href'], $link['localized_options']) ."</li>\\n";
  }

  return l($link['title'], $link['href'], $link['localized_options']);
}
?>

h3.  The "Fix"

Since Drupal 6 isn't taking any new features, it is highly unlikely that this will get fixed.  At any rate, by modifying core to add two fields 'theme callback' and 'theme arguments', the menu system can be modified to add support for theming the individual items as they come out.  From there, it is easy.  One particular function, [menu_local_tasks](http://dgo.to/a/menu_local_tasks) is responsible for actually rendering the links.

By modifying the function to look for the theme function and call it if it exits, we can do all sorts of cool things.  The patch is down a the bottom of this post.  If there is no <?php 'theme callback' ?>, it will fall back to the current method it uses.

It might be more worthwhile to split the actual rendering and collection of the tab information into two separate functions.  This is probably the better way to do it.  Also, there might be a better way to do it in D7.

Also, if you are using the [Chaos tool suite](http://dgo.to/ctools) you'd need to patch it as well (if you are using Garland).

There is also probably a way to do this that involves overriding the menu theme function just like ctools does it.  The only problem that still remains is making sure that the menu tabs get the proper data associated with it.  There doesn't seem to be a no-brainer to attach that data after the fact.  Could be wrong, though!

This is what the code in the new solution looks like (in your module, that is.)

The menu item itself:

<?php
  $items['node/%pcf_node/void'] = array(
    'title' => 'Void',
    'type' => MENU_LOCAL_TASK,
    'page callback' => 'drupal_get_form',
    'page arguments' => array('pcf_casetracker_form_void', 1),
    'access callback' => 'pcf_casetracker_can_void',
    'access arguments' => array(1, array('class' => 'hasicon void',)),
    'theme callback' => 'pcf_casetracker_tab',
    'theme arguments' => array('class' => 'hasicon void'),
    'weight' => 9,);
?>

The callback, which is basically theme('menu_item_link') embedded in a tweaked copy of theme('menu_local_task').

<?php
function theme_pcf_casetracker_tab($menu_item, $options, $active = FALSE) {
  if (empty($menu_item['localized_options'])) {
    $menu_item['localized_options'] = array();
  }

  $classes = array();

  if ($active)
    $classes[] = 'active';

  if (is_string($options['class']))
    $classes[] = $options['class'];

  return '<li'. (count($classes) > 0 ? ' class="'. implode(' ', $classes) .'"' : '') .'>'. l($menu_item['title'], $menu_item['href'], $menu_item['localized_options']) ."</li>\\n";
}
?>

Anyway, hope this helps someone.
