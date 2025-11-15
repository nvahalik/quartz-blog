---
title: "Laravel's ControllerDispatcher: a cleaner solution for custom controllers"
date: 2025-11-15
tags: ["laravel", "php"]
draft: false
---
# `ControllerDispatcher`?

After my [last post](./running-phalcon-within-laravel.md), I ended up coming across [Aaron Francis' video: Hacking the Laravel router](https://www.youtube.com/watch?v=NecBFUJmov4). It was an interesting video but ultimately the "big thing" that I came away from was the diving into the source. I started looking into the `Route` façade again and I saw something that made me perk up a bit: I saw a reference to something called `ControllerDispatcher` in the code base. So I did a quick search.

I found [one blog post](https://peerdh.com/blogs/programming-insights/understanding-laravels-controller-dispatcher) about it that was actually helpful.

So, again, in my last post, I was using `callAction` as a "workaround" since I need to be able to modify the output of the Phalcon controllers. I used `callAction` as that way to wrap it, but this isn't a perfect solution. Ultimately, I need that control, and while implementing `callAction` doesn't break any of the original rules I set for myself, it does _feel_ a little brittle. Especially since `<action>Action` is the way names actions. If there is one for `call` then it would break.

# Rewriting the original solution

With this in mind, the solution from earlier becomes _much_ simpler.

First, we create a new `ControllerDispatcher` class. `App\Routing` seems like a good place for it:

```php
class ControllerDispatcher extends \Illuminate\Routing\ControllerDispatcher
{
    public function dispatch(Route $route, $controller, $method)
    {
        if (!$result && \Phalcon\Di\Di::getDefault()->has('view')) {
            $vi ew = \Phalcon\Di\Di::getDefault()->getShared('view');
            $view->start();
            $controller = request()->route()->getAction()['controller'];
            preg_match('/\\\\(\w+)Controller@(\w+)Action/', $controller, $matches);
    
            $view->render(strtolower($matches[1]), $matches[2]);
            $view->finish();
    
            return $view->getContent();
        }
    
        if ($result instanceof \Phalcon\Http\ResponseInterface) {
            return new Response($result->getContent(), $result->getStatusCode());
        }
    
        return $result;
    }
}
```

Then, we register this new class as the alias for the contract:

```php
$this->app->alias(\App\Routing\ControllerDispatcher::class, \Illuminate\Routing\Contracts\ControllerDispatcher::class);
```

Finally, we can remove the custom `callAction` method from the `BaseController` class from before.

# This is cool

This _is_ a superior solution because now we don't have to worry about `callAction` (in fact, we could even _remove_ that from the above.) We could also only apply our logic based on the namespace of the Controller (e.g. only for the ones that need the custom logic).

The fact that this can be done without modifying core Laravel feels wild to me.

On to bigger and better things!
