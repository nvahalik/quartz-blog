---
title: "Dealing with ReferenceError can't access lexical declaration before initialization issues in an Angular application"
date: "2022-10-20"
tags:
draft: 
---

So, there you are, minding your own business when you start getting an error that looks like this:

```
ERROR Error: Uncaught (in promise): ReferenceError: can't access lexical declaration 'NewState' before initialization NewState@http://localhost:8100/default-src_app_modules_messaging_messaging-components_messaging-components_module_ts-src_app_pages-f15b60.js:248:64 
46129@http://localhost:8100/default-src_app_modules_messaging_messaging-components_messaging-components_module_ts-src_app_pages-f15b60.js:613:8 
__webpack_require__@http://localhost:8100/runtime.js:23:42 
3982@http://localhost:8100/default-src_app_modules_messaging_messaging-components_messaging-components_module_ts-src_app_pages-f15b60.js:258:99 
__webpack_require__@http://localhost:8100/runtime.js:23:42 
9851@http://localhost:8100/default-src_app_modules_messaging_messaging-components_messaging-components_module_ts-src_app_pages-f15b60.js:218:102 
__webpack_require__@http://localhost:8100/runtime.js:23:42 
78016@http://localhost:8100/src_app_modules_chat_pages_chat-messages_chat-messages_module_ts.js:22:138 
__webpack_require__@http://localhost:8100/runtime.js:23:42
```

If you search for this error, you'll find lots of links to the MDN article on `ReferenceError` but this isn't helpful. Beacuse at this point you've got TypeScript + Webpack mangling your output so badly that you have absolutely _no_ idea what's going on.

Well, here's the thing, Angular & Webpack do a pretty good job of making sure that you're not hoisting things out of order or doing weird things with your dependency. Here's your real problem:

## You've got a circular dependency

But wait, doesn't Angular already check for circular dependencies? Yeah. Obvious ones, they sure do. You can't have an `NgModule` that references another `NgModule` which references back to the other `NgModule`. It _would_ detect that and throw an error.

Here's an example: https://stackblitz.com/edit/angular-ivy-ez3evu?file=one.module.ts,two.module.ts

It doesn't even compile. It just stack overflows.

I tried to reproduce the actual issue we had in StackBlitz... it didn't work.

The truth is, some circular references are just not detected without a bit of extra work.

Angular CLI to the rescue: `ng build --show-circular-dependencies`

```
Warning: Circular dependency detected:
src/app/modules/chat/state/conversations/small-conversation.state.ts -> 
src/app/pages/trainer-messages/trainer-messages.page.ts -> 
src/app/modules/chat/state/conversations/small-conversation.state.ts
```

This revealed our state model was dependent upon a page... that depends on our state model...? What?

## It was an enum

Ultimately, we had an enum in that page's file and that file depended upon the state model itself. Moving that enum to a new file and including it on both pages fixed the issue.

Here's hoping this page helps other people!