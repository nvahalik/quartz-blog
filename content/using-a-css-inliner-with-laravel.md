---
title: "Using a CSS Inliner with Laravel"
date: "2020-11-27"
tags:
  - Laravel
draft: 
---

I had a much longer post written, but the deployment script for my "new" blog got messed up and blew away my DB. So here is a new one, slightly shorter!

Here are some notes from my use of the [Laravel CSS Inliner](https://github.com/fedeisas/laravel-mail-css-inliner) module.

## Use a framework, if you can

Both [MJML](https://mjml.io) and [Zurb Foundation for Email](https://get.foundation/emails.html) appear to be great solutions for building emails. MJML seems to also have a [Laravel Integration](https://github.com/asahasrabuddhe/laravel-mjml). I haven't tried it. Would love to hear from someone who has.

## Separate responsive and non-responsive rules into separate files

Keep structural and responsive rules (things like `padding`, `margin`, `height`, `width`, `display`, `font-size` etc.) in a separate file. This way, you can have your cosmetic changes in one file and your responsive rules separate.

## Remember that media queries aren't inlined

This was the one that bit me hard. We started sending some trial emails and people were noticing that some of the responsive elements were not working properly.

Well, turns out that rules like `display: none` and `width: 50%` were being inlined and their media query overrides were not taking effect.

This leads to the next suggestion:

## Wrap all structural/responsive changes in a media query

Since media queries aren't inlined, and we don't want them to be inlined, if we wrap all of the "regular" CSS rules in a media query like this:

```
@media all {
  // rules
}
```

Then now those rules won't be inlined and everything should start working again.

## Add your CSS into the email template

Since I'm lazy and want my CSS pre-processed, adding this to the top of my `layout.blade.php` seemed to work:

```
<style>
{!! file_get_contents(public_path('dist/css/email-responsive.min.css')) !!}
</style>
```

Now, the processed responsive CSS gets added directly to the email. Cosmetic stuff gets inlined and everyone is happy.