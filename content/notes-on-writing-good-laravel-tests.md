---
title: "Notes on writing reproducable Laravel tests"
date: "2021-09-22"
tags:
draft: 
---

Just writing some notes down on things that have made my life easier:

## Testing timestamps

This has kicked my butt so many times. Started using `Carbon::setTestNow(now())` and `Carbon::now()` to test timestamps coming back from API calls. You may ask: why do you care? This is beacuse I want to know the format of what comes back. I suppose I could just write a custom assertion that lets me know if the timestamp is within, say, the last second or something like that _and_ matches a valid format. This might work. But I like being _precise_.

## Fully test the "shape" of responses

One of the big things that I've come to rely on tests for is to make sure that I don't accidentally break stuff when refactoring or making changes.

All of our new code is testing such that the entire structure of the response is tested to make sure it's good. We also then test some of the data points to make sure things are where they should be.

```
$this->actingAs($user, 'api')
    ->getJson(route('whatever'))
    ->assertJsonStructure([
        'data' => [
            'id',
            'created_at',
            'updated_at',
            ...
        ],
    ])
    ->assertJsonPath('data.id', $model->id)
```

A couple of times I refactored something and ended up accidentally forgetting (or renaming a value) because a test didn't cover it. APIs are contracts. They should always return the expected data.

## Testing the DB, too.

I've also gotten into a habit of testing the DB after certain API calls, too. This is helpful for testing both what should be there and also for what shouldn't be there. Yes, the tests are longer. This isn't as necessary as much anymore as we've started pulling stuff out of controllers, but on older code this can be valuable, too.

## Testing with no internet connection

Turns out we've accidentally had tests that reached out to production systems to pull data. Testing while offline finds these tests and allows you refactor/abstract them.

## Knowing when to use fake/random values

This is actually a big one for me. For several weeks I fought with tests that would randomly fail.

Turns out the problem was that the models being tested had a flag on their factory that was choosing a random value. This random value determined if the user had an active subscription.

Now, we assume free and require paid using a factory state: `User::factory()->paid()->create()`. This ensures that the tests are clear and we've stopped running into this problem. However, here are some fields you likely shouldn't be using random data for:

* status (paid_status, post status)
* state (sending, processing, etc.)
* type (public, private, shared posts, etc.)
* flags (reported, archived, hidden)
* tags (any tags, really)