---
title: "Arrays With UTF-16 Strings Will Give You Headaches"
date: "2011-05-19"
tags:
draft:
---

Today I was working with some CSV files using PHP's [fgetcsv](http://php.net/fgetcsv) and [array_search](http://php.net/array_search) functions.

I had a row like this:

```
cus_no,first_name,last_name,full_name,fax_no,phone_no,e_mail
```

Looks normal, right?

But when I was running `array_search('cus_no', $headerRow)` it would return `FALSE`. What is the deal?

Digging deeper, [print_r()](http://php.net/print_r) returned exactly what expected:

```
Array
(
    [0] => cus_no
    [1] => first_name
    [2] => last_name
    [3] => full_name
    [4] => fax_no
    [5] => phone_no
    [6] => e_mail
)
```

Okay. Scratch head. Sip coffee. Deep breath. *What is going on here?!*

Lets see what [var_dump()](http://php.net/var_dump) says:

```
array(7) {
  [0]=>
  string(12) "cus_no"
  [1]=>
  string(21) "first_name"
  [2]=>
  string(19) "last_name"
  [3]=>
  string(19) "full_name"
  [4]=>
  string(13) "fax_no"
  [5]=>
  string(17) "phone_no"
  [6]=>
" string(15) "e_mail
}
```

Whoa. That is strange. Why is that quote at the _beginning_ of the line? Check eyes. Sip coffee.

[var_export()](http://php.net/var_export) had something much different to report:

```
array (
  0 => 'c' . "\\0" . 'u' . "\\0" . 's' . "\\0" . '_' . "\\0" . 'n' . "\\0" . 'o' . "\\0" . '',
  1 => '' . "\\0" . 'f' . "\\0" . 'i' . "\\0" . 'r' . "\\0" . 's' . "\\0" . 't' . "\\0" . '_' . "\\0" . 'n' . "\\0" . 'a' . "\\0" . 'm' . "\\0" . 'e' . "\\0" . '',
  2 => '' . "\\0" . 'l' . "\\0" . 'a' . "\\0" . 's' . "\\0" . 't' . "\\0" . '_' . "\\0" . 'n' . "\\0" . 'a' . "\\0" . 'm' . "\\0" . 'e' . "\\0" . '',
  3 => '' . "\\0" . 'f' . "\\0" . 'u' . "\\0" . 'l' . "\\0" . 'l' . "\\0" . '_' . "\\0" . 'n' . "\\0" . 'a' . "\\0" . 'm' . "\\0" . 'e' . "\\0" . '',
  4 => '' . "\\0" . 'f' . "\\0" . 'a' . "\\0" . 'x' . "\\0" . '_' . "\\0" . 'n' . "\\0" . 'o' . "\\0" . '',
  5 => '' . "\\0" . 'p' . "\\0" . 'h' . "\\0" . 'o' . "\\0" . 'n' . "\\0" . 'e' . "\\0" . '_' . "\\0" . 'n' . "\\0" . 'o' . "\\0" . '',
' . "\\0" . '',0" . 'e' . "\\0" . '_' . "\\0" . 'm' . "\\0" . 'a' . "\\0" . 'i' . "\\0" . 'l' . "\\0" . '
)
```

Whoa! Now that *is* strange. Looks like there are two characters per... wait a sec!

![CSV file screenshot](sites/nickvahalik.com/files/crazy_csv_file.jpg)

Should have known. UTF-16. Friends don't let friends use non-multibyte functions on multibyte datas! It was putting null characters into the string internally? Who knows. I'm sure the PHP source code would probably enlighten me on this. But no time! Those CSV files aren't going to read themselves!

**Update:**
My fellow llama Jonathan Hodges noticed something I failed to see: The length of the strings in var_dump() are double the size they should be:

```php
array(7) {
  [0]=>
  string(12) "cus_no"
  ...
```
