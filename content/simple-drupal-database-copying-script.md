---
title: "A Simple Drupal Database Copying Script"
date: "2009-01-01"
tags:
draft:
---

<p>At work, I needed a simple, scriptable way to copy my drupal database.  Since we have a shared-table multi-site installation, the normal import/export tools would not work.  What it boiled down to was making sure that all of the data was copied except for:</p>

<ol><li>Caches,</li>
<li>Session data,</li>
<li>Watchdog logs,</li>
<li>and Search data</li>
</ol>

<p>This code seems to work well:</p>

<code lang="bash">mysqldump -dn -h<from_server> -u<user> -p<password> <source_database> `mysql --batch -N -h<from_server> information_schema -e "SET SESSION group_concat_max_len=16768;select group_concat(table_name SEPARATOR ' ') as ' ' FROM tables where table_schema = '<drupal_database>' AND (table_name like '%cache%' OR table_name like 'search%' OR table_name in ('watchdog','sessions') OR table_name like 'devel%') group by table_schema;"` | mysql -h<to_server> -u<user> -p<password> <dest_database></code>
<br/><br/>
<code lang="bash">mysqldump -n -h<from_server> -u<user> -p<password> <source_database> `mysql --batch -N -h<from_server> information_schema -e "SET SESSION group_concat_max_len=16768;select group_concat(table_name SEPARATOR ' ') FROM tables where table_schema = '<source_database>' and table_name not like '%cache%' and table_name not like 'search%' and table_name not in ('watchdog','sessions') and table_name not like 'devel%' group by table_schema;"` | mysql -h<to_server> -u<user> -p<password> <dest_database></code>

Basically, what it does is:

<ol><li>Gets a list of tables the mysql command inside the backticks. This ensures that it always pulls all of the tables.</li>
