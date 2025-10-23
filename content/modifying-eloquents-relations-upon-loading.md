---
title: "Modifying Eloquent's relations upon loading"
date: "2021-09-01"
tags:
draft: 
---

In our application's backend, we have a model that is very large to handle our Training programs. Part of the reason it's so large is because there are a lot of layers to give flexibility to training programmers. For a normal user who is doing a workout, their session looks like this:


                 ,-------.             
                 |Session|             
                 |-------|             
                 `-------'             
                     |                 
                 ,-------.             
                 |Workout|             
                 |-------|             
                 `-------'             
                  /     \                                                   
    ,----------------.  ,------.      
    |Training Program|  |Groups|      
    |----------------|  |------|      
    `----------------'  `------'      
                            |              
                   ,-----------------.
                   |MovementInstances|
                   |-----------------|
                   `-----------------'
                            |         
                       ,--------.     
                       |Movement|     
                       |--------|     
                       `--------'     


One of the things we really have been wanting to implement is the ability to "swap" a `Movement` for another. If you've ever done a work out, especially an advanced one, a good trainer will normally start with a base workout and then will scale it to an individual. If you've ever done Crossfit, you've done this.

In the end, this is essentially what we are wanting to accomplish:

    $swap = [ 
       'original_movement' => 'push-up',
       'new_movement' => 'knee push-up'
    ];

    // true, this is the old one.
    $workout->groups[0]->movements[0]->movement === 'push-up';
    $workout->groups[0]->originalMovements[0]->movement === 'push-up';
   
    $workout->setSwaps([$swap]);

    // now is the new one but original is unchanged.
    $workout->groups[0]->movements[0]->movement === 'knee push-up'; 
    $workout->groups[0]->originalMovements[0]->movement === 'push-up';


We have a lot of code that leverages Eloquent's relations to load and build responses for our API. However, the API _isn't_ the only thing that will need this information. Ultimately, we cannot simply depend on the API/resources to format a response for a user, we need to be able to ensure that for a given point in time, a user's workout representation can be easily generated.

So updating our resource models to somehow transform the data is out.

When thinking about it from a DX perspective first, this is how I originally want to be able to do things:

* When loading a user's training `Session`, I want their swaps to automatically apply.
* When loading a `Workout` (outside of a session), swaps should be able to be selectively applied (e.g. `$workout->setSwaps(...)`).
* A minimum amount of changes should be done to the rest of the API except for adding the necessary attributes to the respective resources.

# A trait and an override gets us most of the way

What I ended up doing was creating a trait `AppliesMovementSwaps` that exposes 3 different implementation points:

* Setting `$inheritSwapsRelation` denotes which relation may contain swap information. This allows `setSwaps()` on a model to talk to a relation to grab their swap information.
* Setting `$appliesSwapsRelation` denotes a "child" relation which may want to take action when adding swaps from "above".
* Classes can implement `applySwaps()` to take action when swaps are added. More on this in a moment.

So now the classes look like this (they all `use AppliesMovementSwaps`).

    ,---------------------------------. 
    |Session                          | 
    |---------------------------------| 
    |$appliesSwapsRelation = 'workout'| 
    `---------------------------------' 
                      |                 
    ,----------------------------------.
    |Workout                           |
    |----------------------------------|
    |$appliesSwapsRelation = 'groups'  |
    |$inheritsSwapsRelation = 'session'|
    `----------------------------------'
                      |                 
    ,----------------------------------.
    |Groups                            |
    |----------------------------------|
    |$inheritsSwapsRelation = 'workout'|
    `----------------------------------'

Additionally:

* The `Groups` model (where the swaps are applied) had the relation that needed to be modified (`exercises`) duplicated so that the _original_ is always available (e.g. `originalExercises`).
* A pointer to the `originalExercises` relation was created.

This was done so that one relation always points to what was programmed for the workout. `exercises` is what the user sees and that's the the relation that gets modified.

Finally, (and most importantly) I overrode `setRelation` on the `Group` model so that I could apply the transformation and "swap" out the records. This allows the relation to be modified and continue to work as a regular relation even though we are doing things with it.

    public function setRelation($relation, $value)
    {
        if ($relation === 'movements' && count($this->getSwaps()) > 0) {
            $value = $this->movementsWithSwaps($value);
        }

        return parent::setRelation($relation, $value);
    }

This all should work _in theory_. In practice, relations make things a little bit harder.

## Modifying relations with `setRelation`

The above mostly works. But it doesn't in some instances. Here is an example:

    // Load workout, apply swaps.
    $workout->setSwaps([...]);
    $workout->load('groups.movements');
    $workout->groups[0]->movements[0]->movement === 'knee push-ups';

    // This doesn't.
    $workout->setSwaps([...]);
    $workout->groups[0]->movements[0]->movement === 'push-ups';

    // Wait, this works?
    $workout->groups[0]->movements[0]->movement === 'knee push-ups';

... what is going on?

# Eloquent + setRelation

When Eloquent is accessing a relation:

    $workout->groups[0]->movements[0]->movement
                         ^^^^^^^^^ This is a relation.
              ^^^^^^ This is too, but not relevant.

It ends up calling a small shrub of functions:

    Model->__get()
      HasAttributes->getAttribute()
        HasAttributes->getRelationValue()
          HasAttributes->getRelationshipFromMethod()

It is here within `getRelationshipFromMethod()` where the issue is manifested:


    protected function getRelationshipFromMethod($method)
    {
        $relation = $this->$method();

        // <snip>...

        return tap($relation->getResults(), function ($results) use ($method) {
            $this->setRelation($method, $results);
        });
    }
       
Huh. So the first time you load a relation, it gets `tap()`'d and during the tap `setRelation` gets called. This means that the first access doesn't see the modified values that we do in `setRelation` only on second access does it pull from the relation value stored on the model. Shucks.

# A hack to make it work

To make it work, we ended up hacking `applySwaps()` to force the reload of those certain relations when swaps were being applied. This means the relation value is primed for any access.

So far, this works really well. It feels hackish, but all of the tests (nearly 2 dozen) are passing so... yay?

# Alternatives?

Here's things that could make this easier:

*  Add the ability to `transform()` a relation before it gets loaded. This would remove the need to override `setRelation`. This seems clean and could be easy to do.
*  Add support for a `get{Relation}Relation()` method? I looked at [Laravel Relationship Events](https://laravel-news.com/relationship-events) but it didn't support the transformation.
*  Rewrite the models to simply support a getter. This is probably the "right" way but would likely have required a lot more time since right now everything is handled using relations.