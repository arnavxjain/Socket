# Random Word Pairs
Generates random heroku like word pairs.
Rip off of [haikunatorjs](https://github.com/Atrox/haikunatorjs).

# Installation
Using npm

    npm install random-word-pairs

Using yarn

    yarn add random-word-pairs

# Usage
```js
import wordpair from 'random-word-pairs';

console.log(wordpair())
// sample output: muddy-bread
```

```js
import wordpair from 'random-word-pairs';

console.log(wordpair({ delim = "_", digits = 4 }))
// sample output: red_forest_4528

```