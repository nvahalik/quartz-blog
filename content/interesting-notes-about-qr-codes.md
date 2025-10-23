---
title: "Interesting notes about QR codes"
date: "2013-04-28"
tags:
draft:
---

Doing some research while building some stuff for our store and I stumbled upon a couple of different things you can do to "enhance" QR codes.

## Image Overlay

You can overlay an image on your QR code directly.  To make this work can take a bit of trial and error, but to make this work, build your QR code with the maximum amount of ECC (error correcting code).  Then, just slap an image down over the QR code and you are good to go.  Like this:

<img src="/sites/nickvahalik.com/files/1367184238-4811.png" width="200" />

## Embedded Image

This one is a bit trickier.  To be honest, I'm not 100% sure how this works, but the effect is impressive.  It would appear that it works by making the QR code semi-transparent and then instead of dark squares, black or white circles are put over the grid.  That way, your image shows through.  If your image is sufficiently dark enough, there is no need for the black circles, or if the image is white enough, you can't see the circle.  Here is an example (via [Visualead.com](http://www.visualead.com)):

<img src="/sites/nickvahalik.com/files/MJq_208065_RGB.jpg" width="200" />

## Other Effects

In addition to the direct overlay and embedding techniques, you can stylize your QR code in various ways.  I didn't test them all, but several effects that ship with Photoshop can be applied to a QR code and it will still function properly.  For instance, I tried:

<table>
<tr><th>Effect</th><th>Paramters</th></tr>
<tr><td>Craquelure</td><td>15/6/9</td></tr>
<tr><td>Reticulation</td><td>10/0/0</td></tr>
<tr><td>Conté Crayon</td><td>11/7</td></tr>
<tr><td>Stamp</td><td>25/1</td></tr>
<tr><td>Torn Edges</td><td>25/11/7</td></tr>
<tr><td>Plaster</td><td>24/7/Top Left</td></tr>
<tr><td>Halftone</td><td>4/5/Dot</td></tr>
<tr><td>Glass</td><td>1/3/Canvas or Blocks</td></tr>
<tr><td>Accented Edges</td><td>2/38/5</td></tr>
<tr><td>Crosshatch</td><td>9/6/1</td></tr>
<tr><td>Sumi-e</td><td>10/2/16</td></tr>
<tr><td colspan="2">You get the idea...</td></tr>
</table>

And they worked with [Scan](https://itunes.apple.com/us/app/scan/id411206394?mt=8) on my iPhone 5.  Here's Sumi-e.  I was surprised it worked!

<img alt="Sumi-E QR code filter example" src="/sites/nickvahalik.com/files/sumi-e.png" width="200" />
