# babel-plugin-partial-application &middot; [![Version](https://img.shields.io/npm/v/babel-plugin-partial-application.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/babel-plugin-partial-application) [![License](https://img.shields.io/npm/l/babel-plugin-partial-application.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/babel-plugin-partial-application) [![Travis CI](https://img.shields.io/travis/citycide/babel-plugin-partial-application.svg?style=flat-square&maxAge=3600)](https://travis-ci.org/citycide/babel-plugin-partial-application) [![LightScript](https://img.shields.io/badge/written%20in-lightscript-00a99d.svg?flat-square)](http://www.lightscript.org)

> Partial application syntax for JavaScript, inspired by Scala's `_` & Kotlin's `it`.

- [overview](#overview)
- [installation](#installation)
- [examples & features](#examples)
  - [basic placeholders](#basic-placeholders): `add(1, _)`
  - [spread placeholders](#spread-placeholders): `Math.max(..._)`
  - [lambda parameters](#lambda-parameters): `people.map(_.name)`
  - [object placeholders](#object-placeholders): `_.hasOwnProperty('dapper')`
  - [binary expressions](#binary-expressions): `_ === 'awesome'`, `_.getPower().level > 9000`
  - [template literals](#template-literals): ``const greet = `Hello, ${_}!` ``
  - [set a custom token](#set-a-custom-token): `import _ from 'babel-plugin-partial-application'`
- [usage](#usage)
  - [babelrc](#babelrc)
  - [babel-cli](#babel-cli)
  - [babel-api](#babel-api)
- [caveats & limitations](#caveats--limitations)
- [comparison to libraries](#comparison-to-libraries)
- [see also](#see-also)
- [contributing](#contributing)
- [license](#license)

---

## overview

Use the `_` symbol ( or a custom identifier of your choosing ) as a placeholder
to signal that a function call is partially applied, or that you'll provide the
object of a method call at a later time.

So basically - the original code isn't actually called yet, but will return a new
function receiving the arguments you signified as placeholders.

You can provide one or several placeholders mixed in with the rest of the usual
arguments. Think of the values that aren't placeholders as being "bound". Check
out the [examples](#examples) section to see all the different ways this is useful.

## installation

```console
npm i --save-dev babel-plugin-partial-application
```

Make sure you also have Babel installed:

```console
npm i --save-dev babel-cli
```

## examples

### basic placeholders

Transform this:

```js
function sumOfThreeNumbers (x, y, z) {
  return x + y + z
}

const oneAndTwoPlusOther = sumOfThreeNumbers(1, 2, _)
```

... into this:

```js
function sumOfThreeNumbers (x, y, z) {
  return x + y + z
}

const oneAndTwoPlusOther = _arg => {
  return sumOfThreeNumbers(1, 2, _arg)
}
```

It also works for method calls, where this:

```js
const hasOwn = {}.hasOwnProperty.call(_, _)
```

... becomes:

```js
const hasOwn = (_arg, _arg2) => {
  return {}.hasOwnProperty.call(_arg, _arg2)
}
```

### spread placeholders

You can also use spread to represent multiple arguments:

```js
const maxOf = Math.max(..._)

console.log(maxOf(1, 2, 3, 4, 5))
// -> 5
```

This is compiled to:

```js
const maxOf = (..._spr) => {
  return Math.max(..._spr)
}
```

> If your target environment doesn't support rest / spread,
> you'll have to transpile it separately as usual.

### lambda parameters

Easy shorthand for accessing properties or calling methods on the
applied argument - useful in higher order functions like `Array#map()`:

```js
const people = [
  { name: 'Jeff' },
  { name: 'Karen' },
  { name: 'Genevieve' }
]

console.log(people.map(_.name))
// -> ['Jeff', 'Karen', 'Genevieve']
```

... compiles to:

```js
console.log(people.map(_obj => {
  return _obj.name
}))
```

### object placeholders

> also called "lambda standalones"... only by me though

The placeholder can stand in for an object on which you'll access properties
or call methods. This is very similar to [lambda parameters](#lambda-parameters)
but can be used outside function calls.

As an example, we could re-implement the `hasOwn()` function from the
[basic placeholders section](#basic-placeholders) like this (although
without `.call()` this time):

```js
const hasOwn = _.hasOwnProperty(_)
```

... which compiles to:

```js
const hasOwn = (_obj, _arg) => {
  return _obj.hasOwnProperty(_arg)
}
```

The object that will replace the placeholder becomes the first argument to
the resulting function, so you'd use it like this:

```js
const object = { flammable: true }

hasOwn(object, 'flammable')
// -> true
```

### binary expressions

You can use placeholders within logical comparisons ( `===` ) or
addition, subtraction, string concatenation, etc. So this:

```js
array.map(_ === true)
```

... transforms into this:

```js
array.map(_bin => {
  return _bin === true
})
```

And for a classic example, let's say you have an Array of numbers
and want the total sum of them all:

```js
const array = [1, 2, 3, 4, 5]
array.reduce(_ + _)
// -> 15
```

You can combine this with object placeholders and lambda parameters:

```js
const heroes = [
  { getPower () { return { level: 9001 } } }
  { getPower () { return { level: 4500 } } }
]

heroes.filter(_.getPower().level > 9000)
```

### template literals

You can use almost all the features above inside template literals:

```js
const greet = `Hello, ${_}!`

greet('world')
// -> Hello, world!

const greet2 = `Hello, ${_.name}!`

greet2({ name: 'Tom' })
// -> Hello, Tom!
```

### set a custom token

If you happen to need `_` as an identifier for whatever reason,
there are two different ways to set a custom placeholder token.

You can either use options in your Babel config as described
[below](#usage) or simply import / require the plugin:

```js
import _ from 'babel-plugin-partial-application'

// or, using require:
const _ = require('babel-plugin-partial-application')
```

This import is removed from the compiled output - so you don't
need a production dependency on the plugin. It won't actually
import anything at runtime.

Whatever identifier you set the import to is what will be used
as the placeholder, so all of the following would work:

```js
import __ from 'babel-plugin-partial-application'

const greet = `Hello, ${__}!`
```

```js
import $ from 'babel-plugin-partial-application'

const greet = `Hello, ${$}!`
```

```js
import PLACEHOLDER from 'babel-plugin-partial-application'

const greet = `Hello, ${PLACEHOLDER}!`
```

The benefit of this method over .babelrc configuration is that
linters and type systems won't have a fit because `_` isn't
defined. It's also more explicit, more easily understandable,
and self-documenting. Anyone looking at your code will know
that `_` is from `babel-plugin-partial-application`.

### curried-style functions

A handy usage for this plugin is emulating "curried" style functions,
where a function returns another function that receives the data before
finally returning the result.

While partial application [is a different thing][2ality], it can accomplish
the same goals in a lot of situations. For example, this:

```js
import { map, get } from 'lodash'

const mapper = map(_, get(_, 'nested.key', 'default'))
```

... would compile to this:

```js
import { map, get } from 'lodash'

const mapper = _arg => {
  return map(_arg, _arg2 => {
    return get(_arg2, 'nested.key', 'default')
  })
}
```

... to be used something like this:

```js
const array = [
  { nested: { key: 'value' } },
  { nested: { something: '' } },
  { nested: { key: 'things' } }
]

const newArray = mapper(array))
// -> ['value', 'default', 'things']
```

## usage

### .babelrc

```json
{
  "presets": [],
  "plugins": ["partial-application"]
}
```

Optionally configure the plugin by using an Array of `[pluginName, optionsObject]`.
This is the default configuration:

```json
{
  "presets": [],
  "plugins": [
    ["partial-application", {
      "placeholder": "_",
      "useAlternatePlaceholder": false
    }]
  ]
}
```

| property                  | type      | default | description |
| :-----------------------: | :-------: | :-----: | ----------- |
| `placeholder`             | `String`  |   `_`   | Identifier used to signal partial application in function calls. |
| `useAlternatePlaceholder` | `Boolean` | `false` | Use `__` as the placeholder. Ignored if `placeholder` is set to a custom value. |

You can also set a custom placeholder by importing or requiring the plugin.
See ["set a custom token"](#set-a-custom-token) above for usage.

### Babel CLI

```console
babel --plugins partial-application src.js
```

See Babel's [CLI documentation][babel-cli] for more.

### Babel API

```js
require('babel-core').transform('code', {
  presets: [],
  plugins: ['partial-application']
})
```

## caveats & limitations

> `_` is a common variable name ( eg. for [lodash][lodash] )

This is the most obvious potential pitfall when using this plugin. `_` is commonly
used as the identifier for things like lodash's collection of utilities.

This would be perfectly valid normally, but by default would cause an error
when using this plugin:

```js
import _ from 'lodash'

// -> SyntaxError: src.js: Cannot use placeholder as an identifier.
```

The reason this plugin uses `_` by default then is not to make your life harder.
There are a few reasons this is not seen as problematic.

1. `_` is a common symbol for partial application

  The Scala language uses the underscore as a placeholder for partially
  applied functions, and tons of JavaScript libraries have used it as
  well - so it's become recognizable.

2. Monolithic builds of packages like lodash are on the way out

  lodash v5 will be getting rid of the monolithic build in favor
  of explicitly imported or 'cherry-picked' utilities. So it will
  become less common to see the entirety of lodash imported,
  especially with ES module tree-shaking on the horizon.

  On top of that, [babel-plugin-lodash][babel-lodash] still works
  effectively when you just import what you need like so:

  ```js
  import { add } from 'lodash'
  ```

3. The plugin allows for custom placeholder symbols

  If you do happen to need `_` as an identifier, you're able to change
  the placeholder to any string value you want. Right now this plugin
  doesn't place limitations on that, although obvious keywords won't
  make the cut beyond the plugin.

  You could use `$`, `it`, or even `PLACEHOLDER` - though I think you'll
  understand why the `_` is an appealing choice over the alternatives.

4. Partial application with `_` is damn cool

## comparison to libraries

Lodash, Underscore, Ramda, and other libraries have provided partial application
with a helper function something like `_.partial(fn, _)` which wraps the provided
function, and basically just takes advantage of the fact that `{} !== {}` to recognize
that the monolithic `_`, `_.partial.placeholder`, or Ramda's `R.__` is a specific
object deemed a placeholder.

This Babel plugin gives you the same features at the syntax level. Or even better, like
[lambda parameters](#lambda-parameters) and [object placeholders](#object-placeholders),
eat your heart out lodash :wink:. And it all comes with no runtime overhead. If you don't
use placeholders your functions are unaffected. If you do, they're compiled away and turn
into regular functions that don't have to check arguments to see if a placeholder was provided.

## see also

- [LightScript][lightscript] - the compile-to-JS language this plugin is written in, leveraging [Babel][babel]
- [lodash/fp][lodash-fp] - functional adaptation of the great Lodash utility library
- [Ramda][ramda] - highly functional programming-oriented utility library
- [babel-plugin-transform-scala-lambda][scala-lambda] - a similar plugin for more limited Scala-like lambda syntax

## contributing

Pull requests and any [issues](https://github.com/citycide/babel-plugin-partial-application/issues)
found are always welcome.

1. Fork the project, and preferably create a branch named something like `feat-make-better`
2. Modify as needed, `src/index.lsc` being the source file
3. Make sure all tests continue to pass, and it never hurts to have more tests
4. Push & pull request! :tada:

## license

MIT © [Bo Lingen / citycide](https://github.com/citycide)

[2ality]: http://www.2ality.com/2011/09/currying-vs-part-eval.html
[lightscript]: http://www.lightscript.org
[babel]: https://babeljs.io
[babel-cli]: http://babeljs.io/docs/usage/cli/
[babel-lodash]: https://github.com/lodash/babel-plugin-lodash
[lodash]: https://github.com/lodash/lodash
[lodash-fp]: https://github.com/lodash/lodash/wiki/FP-Guide
[ramda]: http://ramdajs.com/
[scala-lambda]: https://github.com/xtuc/babel-plugin-transform-scala-lambda
