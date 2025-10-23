---
title: Authorize.Net Password Reset "Bug"
date: "2008-09-30"
tags:
draft:
---

It turns out that when you reset your password in [Authorize.Net](http://www.authorize.net/,) the password reset page's new password fields have a maxlength value of 50.  This is *great,* but the login form for the Merchant page's login only has a maxlength value of 25.

![files/50_char_pw_reset.jpg](files/50_char_pw_reset.jpg)

The end result is that putting in a password of 26 characters or more in the password reset screen will make you pull your hair out when you can't login to the site (saying that your password is incorrect!)

You can test this by changing your password using the reset link (don't know if it works from inside the account manager) and change it to something longer than 25 characters.  Logout and then try to log back in.  It won't work.  If you visit the page with Firefox and Firebug (or any other edit-in-place browser plugin) and modify the maxlength of the password field in the login form, paste, and submit, you'll be able to login just fine.

p=. !/sites/nickvahalik.com/files/Picture%209.png!

Hopefully they will fix this by extending the maxlength of the login password field and not decreasing the maxlength of the password reset field.
