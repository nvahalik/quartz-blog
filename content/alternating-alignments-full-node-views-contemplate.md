---
title: "Alternating Alignments On Full Node Views With Contemplate"
date: "2008-07-14"
tags:
draft:
---

While converting my [Netoteric](http://netoteric.com/) site to [Drupal](http://drupal.org/,) there was a small problem with the [portfolio](http://netoteric.com/portfolio) page.  The items in it alternate between left and right.  Views Theme Wizard didn't work.  It was time for more desperate measures.

I added a function in my custom template file, which created an index number and assigned it to a node member.

<code type="php">/**
 * Display the nodes of a view as plain nodes.
 */
function theme_views_view_nodes_portfolio($view, $nodes, $type, $teasers = false, $links = true) {
	$i=0;
  foreach ($nodes as $n) {
    $node = node_load($n->nid);
		$node->__views_index_number = $i++;
    $output .= node_view($node, $teasers, false, $links);
  }
  return $output;
}</code>

<code>theme_views_view_nodes_portfolio</code> overrides the [Views](http://drupal.org/project/views) default theme function, but only for the portfolio view.

Then inside the contemplate body template I just added a modulo function to alternate between left and right:

<code type="php"><div
class="thumbnail <?=($node->__views_index_number % 2 ? 'right':'left')?>"></code>

And voila!  Now the images alternate between left and right...
