---
title: "404 when deleting a model through Livewire"
date: "2021-04-06"
tags:
draft: 
---

LiveWire has become a new favorite thing of mine the last few weeks. It scratches the *itch* that I've had for a long time now: I want some flexibility in the UI to do some very simple AJAX **and** I want to stay in Blade templates.

Anyway, I had an interesting issue which looked like this:

1. Open up a page with a Livewire form on it.
2. Submit the form, causing a new model to be created.
3. This model now has a delete button: so click on it.
4. Livewire shows a 404.

After looking at the HTML coming through the wire, I noticed that the relations Livewire was sending, there was something not right.

Livewire sends some meta-data back to the browser related to your component. It does this, probably, so that it can just rehydrate the models on the component without the original context of the request which was originally used to generate the component.

At any rate, the model's ID that I was generating was `0`. Something about the model wasn't serializing properly.

Turns out that I hadn't actually set `$incrementing = false` nor `$primaryKey` on this model. It... wasn't a standard incrementing model. It's primary key was based on another table and it was only a 0-or-1 to 1 mapping anyway.

Moral of the story: make sure you test the serializability of your models!