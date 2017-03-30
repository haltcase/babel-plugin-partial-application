# babel-plugin-partial-application &middot; [![Version](https://img.shields.io/npm/v/babel-plugin-partial-application.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/babel-plugin-partial-application) [![License](https://img.shields.io/npm/l/babel-plugin-partial-application.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/babel-plugin-partial-application) [![Travis CI](https://img.shields.io/travis/citycide/babel-plugin-partial-application.svg?style=flat-square&maxAge=3600)](https://travis-ci.org/citycide/babel-plugin-partial-application) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square&maxAge=3600)](https://standardjs.com)

> Scala/Kotlin-esque partial application syntax for JavaScript.

## overview

Use an `_` symbol ( or a custom identifier of your choosing )
as a placeholder to signal that a function call is partially
applied. That is, it's not actually called, but will return
a new function receiving the arguments you signified as
placeholders.

You can provide one or several placeholders, in any order with
the rest of the usual arguments. See the [examples](#examples)
section to see what this looks like.

## installation

```console
npm i --save-dev babel-plugin-partial-application
```

Make sure you also have Babel installed:

```console
npm i --save-dev babel-cli
```

## examples

Transform this:

```js
function sumOfThreeNumbers (x, y, z) {
  return x + y + z;
}

let oneAndTwoPlusOther = sumOfThreeNumbers(1, 2, _);
```

Into this:

```js
function sumOfThree (x, y, z) {
  return x + y + z;
}

let oneAndTwoPlusOther = function (_a) {
  return sumOfThree(1, 2, _a);
};
```

It also works for method calls, where this:

```js
const hasOwn = {}.hasOwnProperty.call(_, _);
```

... becomes:

```js
const hasOwn = function (_a4, _a5) {
  return {}.hasOwnProperty.call(_a4, _a5);
};
```

A handy usage for this plugin is for emulating "curried"
functions, where a function returns another function
that would receive the data before finally returning
the result.

Let's ignore the fact that [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide)
exists for a second. It provides auto-curried functions, but in many situations
it's both easily emulated and outperformed by this plugin - because this is at
compile time instead of wrapping functions in functions and checking arguments
and such at runtime.

Try this:

```js
import { map, get } from 'lodash'

const mapper = map(_, get(_, 'nested.key', 'default'))

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

Optionally configure the plugin by using an
Array of `[pluginName, optionsObject]`. This is
the default configuration:

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

### Babel CLI

```console
babel --plugins partial-application src.js
```

See Babel's [CLI documentation](http://babeljs.io/docs/usage/cli/) for more.

### Babel API

```js
require('babel-core').transform('code', {
  presets: [],
  plugins: ['partial-application']
});
```

## caveats & limitations

> `_` is a common variable name ( eg. for [lodash](https://github.com/lodash/lodash) )

This is the most obvious potential pitfall when using this plugin.
`_` is commonly used as the identifier for things like lodash's
collection of utilities.

This would be perfectly valid normally, but by default would
cause an error when using this plugin:

```js
import _ from 'lodash'

// -> SyntaxError: src.js: Cannot use placeholder as an identifier.
```

The reason this plugin uses `_` by default then is not to spite
you or cause harm. There are a few reasons this is not seen as
problematic.

1. `_` is a common symbol for partial application

  Scala & Kotlin both use the underscore as a placeholder for
  partially applied functions, so the idea is recognizable.

2. Monolithic builds of packages like lodash are on the way out

  lodash v5 will be getting rid of the monolithic build in favor
  of explicitly imported or 'cherry-picked' utilities. So it will
  become less common to see the entirety of lodash imported,
  especially with ES module tree-shaking on the horizon.

  On top of that, [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash)
  still works effectively when you just import what you need like so:

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

## see also

- [LightScript](http://www.lightscript.org) - the compile-to-JS language this plugin is written in, leveraging [Babel](https://babeljs.io)

## contributing

Pull requests and any [issues](https://github.com/citycide/babel-plugin-partial-application/issues)
found are always welcome.

1. Fork the project, and preferably create a branch named something like `feat-make-better`
2. Modify as needed, `src/index.lsc` being the source file
3. Make sure all tests continue to pass, and it never hurts to have more tests
4. Push & pull request! :tada:

## license

MIT © [Bo Lingen / citycide](https://github.com/citycide)
