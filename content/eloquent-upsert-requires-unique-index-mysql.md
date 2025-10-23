---
title: "Eloquent upsert() requires a UNIQUE index on MySQL"
date: "2021-10-29"
tags:
  - Laravel
draft: 
---

tl;dr - `upsert()` acts different based on your DB. MySQL _requires_ that a `UNIQUE INDEX` exist for the combination of column you are wanting upsert to work on.

Where I can, I've been using [upsert()](https://laravel.com/docs/8.x/eloquent#upserts) as a way to make many queries into (usually) a single query.

Recently, I had a situation where a function in our code base was _essentially_ doing this:

```
$model->relation->delete();
foreach ($anArray as $newModels) {
   $model->relation()->create($anArray);
}
```

This operation was wrapped in a `DB::beginTransaction()` / `DB::commit()`.

When I finally got around to re-writing it, it was much cleaner and of course looked something like this:

```
RelatedModel::upsert(
   $models,
   ['key_one', 'key_two', 'key_three'].
   ['col1', 'col2']
);
```

I ran the test suite (it passed), pushed and went to sleep.

When I woke up the next morning, I saw a number of errors and a large number of records being generated. Obviously, something was not right in the world of `upsert`.

After digging into things and exploring how MySQL "compiles" upserts, it turns out that this:

```
RelatedModel::upsert(
   $models,
   ['key_one', 'key_two', 'key_three'].
   ['col1', 'col2']
);
```

Also could be written like this:

```
RelatedModel::upsert(
   $models,
   [].
   ['col1', 'col2']
);
```

That second set of parameters is _never used_ [in the function](https://github.com/laravel/framework/blob/9bd19df052be07f33e87242d8c110d0ea5027da4/src/Illuminate/Database/Query/Grammars/MySqlGrammar.php#L164-L176): 

    public function compileUpsert(Builder $query, array $values, array $uniqueBy, array $update)
    {
        $sql = $this->compileInsert($query, $values).' on duplicate key update ';

        $columns = collect($update)->map(function ($value, $key) {
            return is_numeric($key)
                ? $this->wrap($value).' = values('.$this->wrap($value).')'
                : $this->wrap($key).' = '.$this->parameter($value);
        })->implode(', ');

        return $sql.$columns;
    }

`$uniqueBy` isn't used. It is in the SQLite version, but not here.

After cleaning up the DB and adding an index, the `upsert` will work as expected.