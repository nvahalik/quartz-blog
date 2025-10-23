---
title: "Acquia's Access Log File Format"
date: "2016-11-18"
tags: ["Acquia"]
draft:
---

I needed to parse some logs and I wanted to know what Acquia's Log file format was. Here it is:

```
LogFormat "%{X-AH-Client-IP}i %l %u %t \\"%r\\" %>s %b \\"%{Referer}i\\" <br/>
\\"%{User-agent}i\\" vhost=%v host=%{Host}i hosting_site=<siteid> pid=%P <br/> request_time=%D forwarded_for=\\"%{X-Forwarded-For}i\\" <br/> request_id=\\"%{X-Request-Id}i\\" "`
```

Here's a link to the [LogFormat reference](https://httpd.apache.org/docs/2.4/mod/mod_log_config.html#formats).

Key tidbits:

`request_time` is in _microseconds_. Not milliseconds. So divide that sucker by 1,000,000.

Also, `request_id` will correlate requests across different log files (e.g. `drupal-watchdog-<date>` and/or `drupal-requests-<date>`.
