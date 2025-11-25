---
title: "Benchmarks don't tell the whole story"
tags: ["php", "laravel", "phalcon"]
draft: false
date: 2025-11-21
---
# Phalcon & Laravel (continued)
I have (slowly) continued working on my Laravel Phalcon adapter. Right now it doesn't do all that much because, to be frank, there isn't much to do. The fact that we can bootstrap the DI container and import the routes actually covers nearly 95% of what I (personally) wanted to accomplish.

There are 2 next "big steps". The first one that really got into my head was "what is the overhead of adding Laravel?"

The other one was ORM-related, but that's a topic for another day.

Anyway, this question (about speed) really bothered me. If for no other reason that there is a part of me that thought maybe this whole thing was ridiculous. What's the point in doing this if we make it so slow that it is unbearable? I know others share this as often times Phalcon is touted as being "made for speed."

Curiousity has gotten the better of me so I started thinking through this and wanted to benchmark this.

So I did some benchmarking. 

When I say "some benchmarking", I initially spent probably all of 20 minutes asking Claude some questions, making some minor changes, and then running `ab` a few dozen times. What I was really concerned about was trying to do some "apples to apples" comparisons in terms of just Laravel's "raw overhead". It would definitely be more academic or "scientific" to consider things like pagination or dealing with larger, more complex background tasks.

However, as I started to formulate the concept in my head and wondering about different scenarios and what the "cost" of Laravel is, it started to hit me that perhaps even though I started with an idea of how it would play out, things took a different turn.

# The original expectations
Based on a general basic understanding of Phalcon and Laravel, I expected to see these results:

- Phalcon would be "fast" and have better latency
- Laravel would be slower by some multiple
- Business logic processing time would be neglible between the two

That is, I expected Laravel to add some fairly constant latency or overhead to each request but the content and processing of the request wasn't going to be all that different between the 2 frameworks. That is, if I have 1k records in my DB, the DB, not the framework, is going to dictate a good portion of the response time.

Laravel, being a newer and better maintained framework, I expect to be _somewhat_ faster in some circumstances because it takes performance/memory usage into consideration and has pretty decent support for things like cursors and generators. But again, across the board it probably wouldn't matter significantly in this very simple test.

# What I tested
I tested 3 things:

- A pure Phalcon endpoint that takes 2 parameters and outputs them.
- The Laravel "wrapped" same endpoint.
- A "native" endpoint. E.g. I just "did it in Laravel."

I did all of these running `ab` with 10k requests w/ a concurrency of 10.

<details>
    <summary>Here's the whole (original) <code>ab</code> run if you are so interested...</summary>
    
    ab -n 10000 -c 10 "http://demo.test/test/2/25"
    This is ApacheBench, Version 2.3 <$Revision: 1913912 $>
    Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
    Licensed to The Apache Software Foundation, http://www.apache.org/
    
    Benchmarking demo.test (be patient)
    Completed 1000 requests
    Completed 2000 requests
    Completed 3000 requests
    Completed 4000 requests
    Completed 5000 requests
    Completed 6000 requests
    Completed 7000 requests
    Completed 8000 requests
    Completed 9000 requests
    Completed 10000 requests
    Finished 10000 requests
    
    
    Server Software:        nginx/1.29.1
    Server Hostname:        demo.test
    Server Port:            80
    
    Document Path:          /test/2/25
    Document Length:        19 bytes
    
    Concurrency Level:      10
    Time taken for tests:   2.218 seconds
    Complete requests:      10000
    Failed requests:        0
    Total transferred:      2050000 bytes
    HTML transferred:       190000 bytes
    Requests per second:    4509.06 [#/sec] (mean)
    Time per request:       2.218 [ms] (mean)
    Time per request:       0.222 [ms] (mean, across all concurrent requests)
    Transfer rate:          902.69 [Kbytes/sec] received
    
    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0    0   0.1      0      13
    Processing:     1    2   0.8      2      17
    Waiting:        1    2   0.8      2      17
    Total:          1    2   0.8      2      17
    
    Percentage of the requests served within a certain time (ms)
      50%      2
      66%      2
      75%      2
      80%      3
      90%      3
      95%      3
      98%      3
      99%      4
     100%     17 (longest request)
    
    ab -n 10000 -c 10 "http://fireberry.test/test/2/25"
    This is ApacheBench, Version 2.3 <$Revision: 1913912 $>
    Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
    Licensed to The Apache Software Foundation, http://www.apache.org/
    
    Benchmarking fireberry.test (be patient)
    Completed 1000 requests
    Completed 2000 requests
    Completed 3000 requests
    Completed 4000 requests
    Completed 5000 requests
    Completed 6000 requests
    Completed 7000 requests
    Completed 8000 requests
    Completed 9000 requests
    Completed 10000 requests
    Finished 10000 requests
    
    
    Server Software:        nginx/1.29.1
    Server Hostname:        fireberry.test
    Server Port:            80
    
    Document Path:          /test/2/25
    Document Length:        19 bytes
    
    Concurrency Level:      10
    Time taken for tests:   6.698 seconds
    Complete requests:      10000
    Failed requests:        0
    Total transferred:      2770000 bytes
    HTML transferred:       190000 bytes
    Requests per second:    1493.07 [#/sec] (mean)
    Time per request:       6.698 [ms] (mean)
    Time per request:       0.670 [ms] (mean, across all concurrent requests)
    Transfer rate:          403.89 [Kbytes/sec] received
    
    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0    0   0.0      0       1
    Processing:     3    7   1.1      6      27
    Waiting:        3    7   1.1      6      27
    Total:          3    7   1.1      6      28
    
    Percentage of the requests served within a certain time (ms)
      50%      6
      66%      7
      75%      7
      80%      7
      90%      7
      95%     10
      98%     10
      99%     10
     100%     28 (longest request)
    
    ab -n 10000 -c 10 "http://fireberry.test/native/2/25"
    This is ApacheBench, Version 2.3 <$Revision: 1913912 $>
    Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
    Licensed to The Apache Software Foundation, http://www.apache.org/
    
    Benchmarking fireberry.test (be patient)
    Completed 1000 requests
    Completed 2000 requests
    Completed 3000 requests
    Completed 4000 requests
    Completed 5000 requests
    Completed 6000 requests
    Completed 7000 requests
    Completed 8000 requests
    Completed 9000 requests
    Completed 10000 requests
    Finished 10000 requests
    
    
    Server Software:        nginx/1.29.1
    Server Hostname:        fireberry.test
    Server Port:            80
    
    Document Path:          /native/2/25
    Document Length:        20 bytes
    
    Concurrency Level:      10
    Time taken for tests:   6.753 seconds
    Complete requests:      10000
    Failed requests:        0
    Total transferred:      2780000 bytes
    HTML transferred:       200000 bytes
    Requests per second:    1480.85 [#/sec] (mean)
    Time per request:       6.753 [ms] (mean)
    Time per request:       0.675 [ms] (mean, across all concurrent requests)
    Transfer rate:          402.03 [Kbytes/sec] received
    
    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0    0   0.0      0       0
    Processing:     3    7   2.1      6      54
    Waiting:        3    7   2.1      6      54
    Total:          3    7   2.1      6      54
    
    Percentage of the requests served within a certain time (ms)
      50%      6
      66%      6
      75%      6
      80%      6
      90%      8
      95%     10
      98%     11
      99%     14
     100%     54 (longest request)     
</details>

# The (initial) results

Here's the summary:

- Phalcon is fast
- Laravel "costs" ~4.4ms/req overhead
- "Wrapped Phalcon" ~= "Native Laravel"

Phalcon is, noticeably fast. Taking just 2.2s to do 10k requests, it blazes through a very (_very_) simple script that just spits out some GET vars back to the response.

It makes sense given the fact that batteries aren't included and certain generally-assumed things are omitted by default. There is no Middleware pipeline that everything runs through. The DI in a super basic app might have 2 or 3 definitions. Maybe 4-5 files get loaded. No frills. No fuss.

Laravel, on the other hand, loads dozens of files during application bootstrap. It has an entire Middleware stack that runs on each request. Running `./artisan optimize` before doing the benchmark had no visible effect on the outcomes.

What's kind-of mind blowing is that Laravel while still doing everything it is doing is still returning a sub-10ms response. Disabling the middleware on some routes has a negligible impact (in my testing the 6.6s avg. response time dropped to 6.3s or about ~5% faster).

Let's dig deeper into why this happens.

# Why is Phalcon fast?

This got me thinking a bit more deeply about what is going on here. _Why_ is Phalcon fast? 

What trade-offs does Laravel make that make it slower? What is it doing during it's init process that adds that overhead?

Is there any point at which those choices in architectures flip around the equation. This little "demo app" is small. What if the apps got bigger? This got me thinking about what specifically `./artisan optimize` does and what impact it has.

Specifically, `./artisan optimize` caches the following items by default:

1. Config
2. Routes
3. Events
4. Views

Since Laravel will allow multiple service providers to define routes, events, etc., auto-discovery is expensive—_even_ if you have nothing to discover!—caching ensures that overhead is gone.

With `./artisan optimize` we don't see a major decrease for a small application... but what about if we had a larger application? One with, say, a _thousand_ routes?

## Adding the routes

I ran this snippet and then added the output to my Phalcon `router.php` file:

```
for ($i = 0; $i < 1000; $i++) {
    $path = new Phalcon\Support\Helper\Str\Random();
    echo "\$router->addGet('/{$path()}', ['controller' => 'test', 'action' => 'n', 'id' => 1]);".PHP_EOL;
}
```

It generated 1k routes which looked like this:

```
$router->addGet('/t7diZ7cg', ['controller' => 'test', 'action' => 'n', 'id' => 1]);
```

Laravel, of course, recognized the new routes:

```
./artisan route:list

<SNIP>
GET|HEAD   zq4Pt06T ............... Demo\Controllers\TestController@nAction
GET|HEAD   zrYD8a7V ............... Demo\Controllers\TestController@nAction
GET|HEAD   zsV1hO8p ............... Demo\Controllers\TestController@nAction

                                                     Showing [1009] routes
```


<details>
    <summary>See the `ab` runs with 1k routes.</summary>

    ab -n 10000 -c 10 "http://fireberry.test/native/2/25"
    This is ApacheBench, Version 2.3 <$Revision: 1913912 $>
    Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
    Licensed to The Apache Software Foundation, http://www.apache.org/
    
    Benchmarking fireberry.test (be patient)
    Completed 1000 requests
    Completed 2000 requests
    Completed 3000 requests
    Completed 4000 requests
    Completed 5000 requests
    Completed 6000 requests
    Completed 7000 requests
    Completed 8000 requests
    Completed 9000 requests
    Completed 10000 requests
    Finished 10000 requests
    
    
    Server Software:        nginx/1.29.1
    Server Hostname:        fireberry.test
    Server Port:            80
    
    Document Path:          /native/2/25
    Document Length:        20 bytes
    
    Concurrency Level:      10
    Time taken for tests:   7.289 seconds
    Complete requests:      10000
    Failed requests:        0
    Total transferred:      2780000 bytes
    HTML transferred:       200000 bytes
    Requests per second:    1372.02 [#/sec] (mean)
    Time per request:       7.289 [ms] (mean)
    Time per request:       0.729 [ms] (mean, across all concurrent requests)
    Transfer rate:          372.48 [Kbytes/sec] received
    
    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0    0   0.0      0       1
    Processing:     3    7   2.0      6      42
    Waiting:        3    7   2.0      6      42
    Total:          3    7   2.0      6      42
    
    Percentage of the requests served within a certain time (ms)
      50%      6
      66%      6
      75%      8
      80%      9
      90%     10
      95%     12
      98%     13
      99%     13
     100%     42 (longest request)
    % ab -n 10000 -c 10 "http://demo.test/test/2/25"
    This is ApacheBench, Version 2.3 <$Revision: 1913912 $>
    Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
    Licensed to The Apache Software Foundation, http://www.apache.org/
    
    Benchmarking demo.test (be patient)
    Completed 1000 requests
    Completed 2000 requests
    Completed 3000 requests
    Completed 4000 requests
    Completed 5000 requests
    Completed 6000 requests
    Completed 7000 requests
    Completed 8000 requests
    Completed 9000 requests
    Completed 10000 requests
    Finished 10000 requests
    
    
    Server Software:        nginx/1.29.1
    Server Hostname:        demo.test
    Server Port:            80
    
    Document Path:          /test/2/25
    Document Length:        19 bytes
    
    Concurrency Level:      10
    Time taken for tests:   9.702 seconds
    Complete requests:      10000
    Failed requests:        0
    Total transferred:      2050000 bytes
    HTML transferred:       190000 bytes
    Requests per second:    1030.67 [#/sec] (mean)
    Time per request:       9.702 [ms] (mean)
    Time per request:       0.970 [ms] (mean, across all concurrent requests)
    Transfer rate:          206.33 [Kbytes/sec] received
    
    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0    0   0.0      0       1
    Processing:     5   10   1.8      9      38
    Waiting:        5   10   1.8      9      38
    Total:          5   10   1.8      9      38
    
    Percentage of the requests served within a certain time (ms)
      50%      9
      66%      9
      75%      9
      80%      9
      90%     11
      95%     14
      98%     15
      99%     19
     100%     38 (longest request)
</details>

Phalcon is now 30% _slower_ than Laravel with 1000 defined routes.

_Why?_

## Laravel's route optimization

When you run `./artisan route:cache`, Laravel is essentially exporting a serialized snapshot of the router to disk. It's bypassing any processing on those routes. This _substantially_ reduces the overhead in creating router for each request.

Phalcon has no equivalent functionality. In theory I suppose you could create a `RouteGroup` and then just `attach()` it to the main router, but there isn't a way to serialize the current set of routes, export it, and then just re-import it later. Phalcon has to re-process every set of routes for every page load.

# Why do we choose a framework?

You don't necessarily choose frameworks for speed. You choose them for their features. Speed _can_ be a feature. And if we're talking about latency or response times, Laravel is not going to be the fastest.

_However_, it _is_ reasonable to assume that for a large-enough project, the "benefits" of Phalcon start to disappear and Laravel actually shines by doing some things to work around its perceived areas of weakness. In other words—Laravel may not be "the fastest" but it is _darn fast_ for a large application.

But if we're talking about being able to get a project set up and operational. If we're talking about someone being able to "walk on" and pick up a project, then Laravel's strengths really shine through. Laravel trades speed for certainty and consistency. And that is massive when you are talking about a large project.

At 1st Phorm we hosted our stuff on a small cluster of 4CPUx8G servers. We never had major issues with latency. Our response times were generally <100 ms for 99% of requests. At that size, your DB, how you architecture your data, write your queries, and handle your background processes matter far more. MySQL was a big culprit. We didn't use Octane.

# Putting it all together

- 14ms vs 6ms vs 2ms. These latency numbers are already tiny. These are web requests for an API. Anything less than <100ms is great! We're not doing stock trading here.
- This isn't meant to be a comprehensive benchmark. I just wanted to see if adding Laravel meant losing some performance.
- You know how long it took me to get the demo working? I'm not proud but I ran into some weird stuff getting the Phalcon routing (in Phalcon mind you) to work correctly. Maybe 20 minutes. I am still not sure what the issue was.
- How long did it take for me to rewrite in Laravel? Maybe 60 seconds. If that.

> [!Thought] 
> That 2ms response time is meaningless if you spend 500ms in the DB or 250ms on a dependent API call.

That response time isn't going to help you ship your code faster. It _is_ going to abstract things, but it'll also make upgrading your code to later versions of the language simpler. It _should_ make keeping your dependencies updated easier.

It should mean that someone walking onto the team does't have to spend 2-4 weeks figuring out a new framework. It should mean that adding a new queue is a config change and not major code surgery.

It should mean that stuff like logging and exception handling are just "taken care of" for you.

It should mean having access to a huge ecosystem of great solutions that mean you don't have to recreate the wheel to do things like auditing or ACLs.

# tl;dr

If you care about raw latency and response times, Go can answer requests _way_ faster than Phalcon can (A simple script from Claude doing the same exact thing ran in ~.3s, almost 7x faster). And it can do it with less memory.

PHP has come such a long way in being performant. Using opcache, along with Octane-adjacent technologies, getting consistent sub 10ms performance is possible. I still contend that it is overkill for most applications.

And while using a framework "for speed" might have been reasonable 10+ years ago, in the modern PHP era of 8.0+, it doesn't mean much. Use whatever framework helps you get stuff shipped, gives your team confidence, and keeps you running effectively.

My preference: use Laravel for large applications. But you can use whatever you want knowing that it'll work well.
