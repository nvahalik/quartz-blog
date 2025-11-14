---
title: Running Phalcon within Laravel
date: 2025-11-14
tags: ["php", "phalcon", "laravel"]
draft: false
---
I've been thinking a lot about Phalcon _and_ Laravel lately. Namely, I've been considering how to gracefully move a _large_ Phalcon application over to Laravel.

There is more to be said on this, but for this point, my thoughts go to "serving" the application.

Phalcon is lightweight enough that spinning up "micro apps" isn't really a big deal. In fact, Phalcon in _some_ respects almost makes more sense for extremely simple apps. But the point is that a lot of Phalcon apps are really just an `index.php` file with some service definitions (DI) in which your controllers and views are set up. You don't even technically have to wire up a router. By default, Phalcon will map all of your requests to `/<contoller>/<action?>`. This makes it very simple to get started, but on larger projects, you'll probably have a router set up. (Hint: this is an assumption I'm going to be making!)

> [!ASIDE]
> After I did all of this work, I found a [blog post by Garry Sanders](https://medium.com/@ganderseng/migrating-php-frameworks-d6bfafec6f89) that provides an interesting alternative. However, for reasons I'll get to in a moment, I didn't delete all of my work.

So, hypothetically, what would it would take to get your Phalcon app to be _served_ by Laravel? What does that mean? Here's a working definition:

1. Laravel can have routes defined (e.g. `web.php`).
2. Phalcon can have routes defined (e.g. `routes.php` somewhere in the code-base).
3. `./artisan route:list` shows all of the defined routes (Phalcon and Laravel).
4. A single point of entry (one `index.php`) file.
5. Ability to access Phalcon's DI from within Laravel itself.
6. The Phalcon app **can still work without world-breaking changes**.

# Let's talk routing

Laravel has a pretty robust Router. In fact, this was probably the _easiest_ part. I started with the idea that in my `web.php` file, I wanted to be able to do this:

```php
// Load all of my routes from Phalcon.
Route::fromPhalcon(base_path('phalcon/config/routes.php'));
```

1. Note that I'm putting Phalcon _inside_ of the repo. This is just how I'm doing things. In reality, it could be anywhere, but this is a demo, so I'm keeping it simple.
2. The routes are defined in a `routes.php` file. Note that this may require you to make changes to a Phalcon app, but it doesn't _break_ the application. It just clarifies it. (IOW, you can't use MVC routing, you have to use explicit routes.)
3. No changes to core Laravel here. Starting point here is just a [Macro](https://laravel.io/articles/laravel-under-the-hood-a-little-bit-of-macros) on the `Route` object.

What does the macro look like? Glad you asked:

```php
Route::macro('fromPhalcon', function (\Phalcon\Mvc\Router $router) {
    $routeNamespace = $router->getDefaults()['namespace'];

    foreach ($router->getRoutes() as $route) {
        $methods = $collect($route->getHttpMethods())->map(fn($method) => strtolower($method));

        $paths = $route->getPaths();
        $fullClass = $routeNamespace . ucfirst($paths['controller']) . 'Controller';
        $actionName = $paths['action'] . 'Action';
        
        foreach ($methods as $method) {
            Route::{$method}($route->getPattern(), [$fullClass, $actionName])
                ->middleware(PhalconCompatibility::class)
            ->withoutMiddleware([VerifyCsrfToken::class, ValidateCsrfToken::class]);
        }
    }
});
```

> [!IMPORTANT]
> This is _really_ basic. This initial version doesn't support route parameters nor does it support several features that I know it would need. My initial work here is based off of a demo project I wrote.
> Another **important** bit here is the assumption that the Phalcon application:
> 1. Has namespaces/PSR-4 compatibility. IOW, non-PSR-4 Phalcon won't work.
> 2. Does _not_ currently use the `App\` namespace.

Where does this leave us? Does `./artisan route:list` work?

```
% ./artisan route:list

 GET|HEAD   / .......................... Demo\Controllers\IndexController@indexAction
 GET|HEAD   api/version ................ Demo\Controllers\ApiController@versionAction
 GET|HEAD   signup .................... Demo\Controllers\SignupController@indexAction
 POST       signup/register ........ Demo\Controllers\SignupController@registerAction
 GET|HEAD   storage/{path} ............................................ storage.local
 GET|HEAD   test .................................................................... 
 GET|HEAD   up ...................................................................... 

                                                                   Showing [7] routes
```

Yes. Yes it does.

# The middleware: `PhalconCompatibility::class`

As much as I would love to regale you on the finer aspects of Phalcon Application route matching, dispatching, and response generation, I'm going to skip over all of that for now. Suffice to say that Phalcon and Laravel _both_ have their love of deep magicks and Laravel only scores points here because their magick is user-space and not [inside of a Zend extension](https://github.com/phalcon/cphalcon/blob/master/phalcon/Mvc/Application.zep).

What can and should be said is that Phalcon controllers are, actually, _insanely_ simple. Controllers must extend [`\Phalcon\Mvc\Controller`](https://github.com/phalcon/cphalcon/blob/master/phalcon/Mvc/Controller.zep) but this is only a constructor and the `ControllerInterface` is actually [empty](https://github.com/phalcon/cphalcon/blob/master/phalcon/Mvc/ControllerInterface.zep). There is... _one_ thing going on here that the `\Phalcon\Mvc\Controller` does extend from and that is [`Injectable`](https://github.com/phalcon/cphalcon/blob/master/phalcon/Di/Injectable.zep).

But even `Injectable` itself is pretty basic. Phalcon exposes DI as a global singleton class ([`\Phalcon\Di\Di`](https://github.com/phalcon/cphalcon/blob/master/phalcon/Di/Di.zep) for those of you keep track of this). And `Injectable` just makes that DI available to any class that extends `InjectionAware`.

By way of comparison:

```php
// In Phalcon:
class Someclass extends Injectable {
    public function someFunc() {
        // These are sort-of equivalent.
        dump($this->getDi()->get('config')->some->value);
        dump($this->config->some->value);
    }
}

// In Laravel (same idea, but better DevEx).
app('config')->get('some.value');
config('some.value');
```

> [!IMPORTANT]
> I mentioned that the example above, `$this->config` and `$this->getDi()->get('config')` where sort-of equivalent. They will (under _most_) circumstances give you the same output. However, when you do `$this->{somevar}` Phalcon will memoize whatever it pulls out of DI for you. In some cases this will break things like tests which might reset values between calls because Phalcon isn't discarding the controller instances. Anyway, this _can_ bite you if you aren't watching out for it! IOW, if you call `$this->getDi()->setShared('config', new Config(...))` that new value will only be used on _new_ memoizations of `$this->config`.

So this is a lot of talk, but what does the Middleware actually need to do?

1. Create the DI instance.
2. Load the DI service definitions.

... that's actually it?

As long as your service definitions are in a single place, it could concievably look like this:

```php
class PhalconCompatability
{
    public function handle(Request $request, Closure $next): Response
    {
        define('APP_PATH', base_path('phalcon/src'));
        $di = require(base_path('phalcon/config/di.php'));
        \Phalcon\Di\Di::setDefault($di);

        return $next($request);
    }
}
```

Seriously. That's it. Again, if your service definitions are all in `config/di.php`, that is.

# Actually serving controller responses

If you are crazy enough to be trying this, you might have tired to access your routes and they won't work. For a number of reasons. Namely, the expected return value of the Phalcon controllers are varied. In Phalcon, these are all valid response types from a controller:

1. Nothing at all. (Usually means you are using [Simple or Implicit views](https://docs.phalcon.io/5.9/views/?h=view#simple-rendering).)
2. A string. In other words, raw content.
3. A `\Phalcon\Http\Response` object.

Laravel will gladly accept 1 and 2 (1 being 2 with no content at all.) But it doesn't know about Implicit views. So that's a problem.

The other problem is that `\Phalcon\Http\Response` isn't `Responsable` nor does it inherit from the Symfony HTTP Response class. If you return that the application will throw a 500 error.

So, how do we get the content out of these views?

This was actually the hardest part of this whole experiment. I tried a number of different approaches:

1. **Hooking `PreparingResponse` and `PreparedResponse` events** - These assume a valid `Response` object coming from the controller, which we aren't guaranteed.
2. **Middleware** - Again, these assume a valid response object coming from the controller, which we aren't guaranteed.
3. **Overriding the `router` service** - Couldn't get this one to work at all. If you've ever done this, I'm curious how you did it.
4. **Harnessing [`callAction`](https://github.com/laravel/ideas/issues/1067)** - This has so little information, but ultimately was what I used. It is possible that there are deeper ways to accomplish this, but I was able to get this to work successfully.
5. **Custom controllers** - In theory, the way I would go if I hadn't found `callAction`.

## `callAction` in practice

Remember up above I mentioned that one of the things we couldn't do was break existing Phalcon code? Well turns out adding a `callAction` function to a common base controller _does not break anything_. I suppose if you had an actual `callAction` action, that might be a problem, but we'll work around that when we get there.

Anyway, `callAction`:

```php
public function callAction($method, $params = [])
{
    $return = $this->$method(...$params);

    if (!$return && \Phalcon\Di\Di::getDefault()->has('view')) {
        $view = \Phalcon\Di\Di::getDefault()->getShared('view');
        $view->start();
        $controller = request()->route()->getAction()['controller'];
        preg_match('/\\\\(\w+)Controller@(\w+)Action/', $controller, $matches);

        $view->render(strtolower($matches[1]), $matches[2]);
        $view->finish();

        return $view->getContent();
    }

    if ($return instanceof \Phalcon\Http\ResponseInterface) {
        return new Response($return->getContent(), $return->getStatusCode());
    }
}
```

I'm sure there are some gotchas and issues with this, but again, this was a PoC, written in ~2hrs. It:

1. Renders Implicit views
2. Handles custom `Response` objects
3. Works

# Next steps

Honestly, I'm not even sure what's next, but here's a short list:

1. Exposing Phalcon's DI to Laravel (`app()` fall back?).
2. Exposing Phalcon's Config to Laravel (fraught with peril, to be sure).
3. Shimming or extending `\Phalcon\Mvc\Model` to work with Eloquent (I've already done some of this in separate work getting Pest to work with Phalcon).

# Conclusion

Should you do this? Maybe! Garry's solution is simpler to be fair. But this certainly _feels_ better!
