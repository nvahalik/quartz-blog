---
title: "Drag and Drop File Uploads in Adobe AIR"
date: "2008-05-26"
tags:
draft: true
---

After doing quite a bit of research and testing, it seems as though drag-and-drop file uploads in AIR can't have progress monitors.  If I'm wrong, I'd really like to hear about it.  Drop me a line... nick @ &lt;this domain&gt;

Looking through the Flash Documentation, it would appear that the Progress event  for file uploads only fires from the FileReference object.  You can't instantiate this object from inside Javascript.  It appears to work if you use the select dialog box...
<code type="javascript">file = air.file.desktopDirectory
file.addEventListener( air.ProgressEvent.PROGRESS, function() {
air.trace('this will fire')
});
file.browseForOpen( 'Select File' );</code>

 and then upload the file, but doing something like this will never fire the event:

<code language="javascript">// inside drop event handler
myfile = new air.File()
myfile.url = event.dataTransfer.getData("text/uri-list")
ur = new air.URLRequest('http://127.0.0.1/~nvahalik/upload_test.php')
ur.method = 'POST'
myfile.addEventListener(air.ProgressEvent.PROGRESS, function (event){
air.trace('upload in progress')
});</code>

This isn't a show-stopper for this particular project, but knowing my audience, they are going to want to know what the status of the upload is.

It does strike me as rather strange that you can't monitor those kinds of uploads.  Maybe it's coming soon?  I hope.
