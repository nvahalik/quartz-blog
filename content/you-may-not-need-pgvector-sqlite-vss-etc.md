---
title: You may not need pg_vector, sqlite-vss, etc.
date: 2025-11-06
tags: ["ai", "php", "rag", "vectordatabase"]
draft: false
---
I have a little side-project I've been working on for some time. What it does and how it does what it does isn't important. What _is_ important is that it uses vector embeddings and it _does_ use [cosine similarity search](https://towardsdatascience.com/demystifying-cosine-similarity/).

One of the big stumbling blocks I kept running into over and over again was: how do I store these vectors? And, more importantly, how do I _search_ these vectors to find matches?

I tried to get `sqlite-vss` and `sqlite-vec` both going, but I didn't like having to set the size of the embedding in the Schema definition. `pg_vector` forces you to have a single embedding size, but you can truncate the database and re-import and it will only complain about the data if the data you are trying to insert doesn't match the size of the existing vectors in the table.

Honestly, I spent a lot of time just fooling and fiddling around with the DB. It was truly a stumbling block: I couldn't really find the "right way" to do what I wanted to do. I am _still_ toying with different embedding models.

This indecision kept me paralyzed. I just wanted to store my vectors and search them!

Then it hit me.

**I don't _need_ `pg_vector`.** Actually, I don't need a vector-enabled database _at all_.

With about 10 minutes and Claude Code, I was able to build a very simple PHP solution that takes a key/value array like this:

```php
$searchContext = [
   '01K9BDCMXB6SP745NS0C9W9XF9' => [ /* vector */ ],
   '01K9BDCJJHXWF8W5VYYD8DAHPS' => [ /* vector */ ],
   '01K9BDCE0BRZ51KEYM7WGN6EF2' => [ /* vector */ ],
   // More rows.
];
```

And I can search it like this.

```php
$vss = new VSSSearch();
$vss->setSearchContext($searchContext);
$results = $vss->search([/* Vector to search */], k: 2);

foreach ($results as $result) {
    echo "{$result["id"]}: (score: {$result["score"]})\n";
}
```

The results are the same I'd get from a DB. But I don't _need_ a DB to do any searching. I just load whatever set of vectors I need and search them. I'm already doing _other_ stuff after I search anyway. The embedding search is just one step in the process.

This means I can go back to using MySQL. Storage doesn't complain if the vectors are the wrong size. They are just JSON or binary columns.

If I need speed I can just cache them.

**Caveat:** my search set is only a few hundred records (right now). 10K records is on the extreme high-end probably the most I'd see. For that index size, I don't need [HNSW](https://towardsdatascience.com/similarity-search-part-4-hierarchical-navigable-small-world-hnsw-2aad4fe87d37/) or [FAISS](https://github.com/facebookresearch/faiss) or KNN or any of those _fancy_ indexes. For a few hundred records and/or local development, this is 100% _fine_.
