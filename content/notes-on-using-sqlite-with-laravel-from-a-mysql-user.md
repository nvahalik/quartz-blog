---
title: "Notes on using SQLite with Laravel from a MySQL user"
date: "2020-12-04"
tags:
  - Laravel
draft: 
---

I got the bright idea to sit down and see if I could get our test suite running on SQLite. Not that I don't have better things to do, I just think it'd be great if our test runner didn't require MySQL to do it's thing.

# Step 1: A Fresh Migration

The first thing I needed to do was set up everything so that I can migrate the DB. I updated `.env.testing` to use the `sqlite` driver:

```
DB_CONNECTION=sqlite
```

Then, made sure that the DB existed:

```
touch database/database.sqlite
```

And now to run the migration: `php artisan migrate --env=testing`.

Nope. Failures.

Here are the ones I ran into:

1. You cannot drop a [foreign key](https://laravel.com/docs/5.7/upgrade) on an SQLite database.
2. Custom SQL statements (e.g. to update tables) were failing.
3. `DATE_ADD()` statements don't work in SQLite.
4. `IF()` statements don't work in SQLite.
5. You cannot [delete and add columns to a SQLite table in a single transaction](https://github.com/laravel/framework/issues/32922). 

## You can't drop foreign keys
For the foreign key issues, I just commented those out for the time being. I suppose given the way our app works, I could just consolidate all of the old statements and get rid of the all the intermediates.

## Custom SQL statements.
Custom SQL statements were bypassed with checks to see if there was any data in the table. If there was none, then just bypass them:

```
if (DB::table('whatever')->count() > 0) {
   // Do your thing.
}
```

This made sense because since there is no data, nothing needs to be done. Eventually, these can all be cleaned out since the majority will never be ran again.

## DATE_ADD() to date()

Handling the `DATE_ADD()` lack was a little weird. I ended up just using `when()`  methods to change the syntax of various statements like this:

```
->when(DB::getDriverName() === 'mysql', function ($query) {
   $query->where(DB::raw('DATE_SUB(c.end, INTERVAL 7 DAY )'), '<=', DB::raw('u.created_at'));
})
->when(DB::getDriverName() === 'sqlite', function ($query) {
    $query->where(DB::raw('date(c.end, "+7 days")'), '<=', DB::raw('u.created_at'));
})
```

This seems really strange. I'm really suprised the internal Grammers don't have a way to abstract this.

# IF() to CASE statements

`IF()` is so convenient, I use it alot. However, moving to `CASE WHEN ... ELSE ... END` is not so bad all things considered. Migrating to that statement is compatible with both SQLite and MySQL:

```
->selectRaw('COALESCE(IF(from_id = ?, null, from_id), IF(to_id = ?, null, to_id)) AS other_party',
```

Became:

```
->selectRaw('COALESCE(CASE WHEN from_id = ? THEN null ELSE from_id END, CASE WHEN to_id = ? THEN null ELSE to_id END) AS other_party', 
```

# Deleting and adding columns

Again, this particular item would be completely mitigated by just going back and creating new base tables for everything. The workaround, though, is simple. Just wrap the deletion in a separate block:

e.g. this:

```
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('columnToRemove');
    $table->string('columnToAdd');
});
```

Would become this:

```
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('columnToRemove');
});

Schema::table('users', function (Blueprint $table) {
    $table->string('columnToAdd');
});
```

After these changes, the DB now seeds. 

How do the tests fare?

```
..........F.F........EEE.........E.......F.....................  63 / 507 ( 12%)
.................EEEEEEEEE..................FFFF.............F. 126 / 507 ( 24%)
..............E....E.......................F............F...... 189 / 507 ( 37%)
..........................................EE.F.........F....... 252 / 507 ( 49%)
......F......F.....FF...FF...............F..................... 315 / 507 ( 62%)
F.FF.................F.............F...FFF.F......F..F......EEF 378 / 507 ( 74%)
FF..F.........F.F....................F..FFF.F...........F...... 441 / 507 ( 86%)
.FF.....F.......FFF...........FF.....EEE....................... 504 / 507 ( 99%)
...                                                             507 / 507 (100%)
```

Eh. Not so good. I'll take a look at these in the near future. Can these be fixed easily?

I have no idea.