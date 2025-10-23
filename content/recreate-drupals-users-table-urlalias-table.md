---
title: "Recreate Drupal's users table from url_alias table"
date: "2015-08-19"
tags:
draft:
---

So I needed to recreate a truncated users table to stop the Drupal admin from barfing all over the admin... the url_alias table has the UID and the user names in it... so why not?

<mysql>INSERT INTO users
  SELECT
    REPLACE(source, 'user/', '') AS uid,
    REPLACE(alias, 'users/', '') AS name,
    SHA1('nothing') AS pass,
    CONCAT(REPLACE(alias, 'users/', ''), '@no.none') AS mail,
    '' AS theme,
    '' AS signature,
    'filtered_html' AS signature_format, -- make sure this is okay
    0 AS created,
    0 AS access,
    0 AS login,
    1 AS status,
    NULL AS timezone,
    'en' AS language,
    0 AS picture,
    CONCAT(REPLACE(alias, 'users/', ''), '@no.none') AS initial_size,
    NULL AS data
  FROM url_alias
  WHERE source LIKE "user/%" -- Only grab users
  AND source != "user/1" -- But not user 1</mysql>

I didn't need the emails to be anything useful.
