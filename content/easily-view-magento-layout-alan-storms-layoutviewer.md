---
title: "Easily View Magento Layout with Alan Storm's Layoutviewer"
date: "2011-05-16"
tags:
draft:
---

[Alan Storm](http://alanstorm.com/) has a great module called [Layoutviewer](http://alanstorm.com/2005/projects/MagentoLayoutViewer.tar.gz) that is great for front-end developers.  It allows you to see the layout that Magento will use to render a page. This can be useful to debug what layout updates have been applied to a page.  One way or another, it usually ends up in most of my development sites.

Here is a nice little shell script you can copy-and-paste or download to easily add it to your project:

<code>
#/bin/bash
VIEWER_HTTP_DOWNLOAD="http://alanstorm.com/2005/projects/MagentoLayoutViewer.tar.gz"

# If we are in the root, then we need to go into app/code/local.
if [ -f "index.php" ]; then
    cd app/code/local;
fi

curl -so - $VIEWER_HTTP_DOWNLOAD | tar xvzf -

(
cat <<'ConfigFile'
<?xml version="1.0"?>
<config>
    <modules>
        <Alanstormdotcom_Layoutviewer>
            <active>true</active>
            <codePool>local</codePool>
        </Alanstormdotcom_Layoutviewer>
    </modules>
</config>

ConfigFile
) > ../../etc/modules/Allanstormdotcom_Layoutviewer.xml
</code>

Also, here is a little bookmarklet that you can use to show the formatted XML for a page using the installed module:

[Display Layout](javascript:window.location.href = window.location.protocol + '//' + window.location.hostname + window.location.pathname + (window.location.search=='' ? '?showLayout=page&amp;showLayoutFormat=text' : window.location.search + '&amp; showLayout=page&amp;showLayoutFormat=text');)

Just drag it to your bookmarks bar!

You can also download the attached shell script.  It will (from the htdocs folder for your Magento site) download the layoutviewer module.
