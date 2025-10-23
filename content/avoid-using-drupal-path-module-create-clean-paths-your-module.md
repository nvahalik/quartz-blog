---
title: Avoid Using The Drupal "path" Module To Create Clean Paths In Your Module
date: "2009-11-05"
tags:
draft:
---

I've been doing a lot of cleanup of certain modules at the office.  Two in particular are heavily used apps that incorporate pre-made default views with screens to add nodes or do information lookups.

Part of the problem with this is that although I had a decent URL structure (many paths were aliased), my breadcrumbs were never right.  I usually had to override them to make them work the way I wanted to (Drupal 5 on my end):

<code>drupal_set_breadcrumb(array(...))</code>

This is a hack!  [path.module](http://api.drupal.org/api/drupal/modules--path--path.module/5) is great for aliasing content paths.  But stay away from it for stuff in your module.

Drupal's [drupal_get_breadcrumb](http://api.drupal.org/api/function/drupal_get_breadcrumb/5) actually calls [menu_get_active_breadcrumb](http://api.drupal.org/api/function/menu_get_active_breadcrumb/5) to figure out what to put in the breadcrumb list.  Essentially, this function goes through the url, and looks at each element, gets the title of them if they have the [MENU_VISIBLE_IN_BREADCRUMB](http://api.drupal.org/api/constant/MENU_VISIBLE_IN_BREADCRUMB/5) flag on them.  Both [MENU_NORMAL_ITEM](http://api.drupal.org/api/constant/MENU_NORMAL_ITEM/5) and [MENU_ITEM_GROUPING](http://api.drupal.org/api/constant/MENU_ITEM_GROUPING/5) have that flag by default.

Basically, if you write your [menu hook](http://api.drupal.org/api/function/hook_menu/5) properly, your breadcrumbs will automatically populate for you without any extra work.

The key here is putting this in your menu hook.  If you use path.module's [path_set_alias](http://api.drupal.org/api/function/path_set_alias/5) or you add it manually via the interface, it *won't work!*  The reason is due to the fact that this is an alias.  If you do this, [menu_get_active_breadcrumb](http://api.drupal.org/api/function/menu_get_active_breadcrumb/5) will see the "true" path and not the "aliased" path.

For example: Let's say you have a node form that you want to put inside your path somewhere.  If you do:

<code>path_set_alias('node/add/claim','agents/claims/create')</code>

Your breadcrumb for "agents/claims/create" will show the breadcrumb you will see on "node/add/claim."  (probably just "Home")

However, if you do this:

<code>$items[] = array(
	'path' => 'agents/claims/create',
	'type' => 'callback',
	'callback' => 'node_add',
	'callback arguments' => array('claim')
);</code>

Your breadcrumb will display something along of:

Home &raquo; Agents &raquo; Claims

Which is exactly what you want!

There is *always* a way to make the menu do what you want it to do.  This includes using [node_add](http://api.drupal.org/api/function/node_add/5) to put node creation forms where you want them or using [views_view_page](http://drupalcontrib.org/api/function/views_view_page/5) for displaying views.  It will make your breadcrumbs work right and make your code cleaner since you won't be putting urls and menu information in your [default views hook](http://drupal.org/node/99568!)
