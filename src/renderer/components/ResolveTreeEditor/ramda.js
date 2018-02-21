export default [
  {
    "description": "Returns a function that always returns the given value. Note that for\nnon-primitives the value returned is a reference to the original value.\n\nThis function is known as `const`, `constant`, or `K` (for K combinator) in\nother languages and libraries.",
    "name": "always",
    "sig": "a -> (* -> a)",
    "category": "Function"
  },
  {
    "description": "A function that always returns `false`. Any passed in parameters are ignored.",
    "name": "F",
    "sig": "* -> Boolean",
    "category": "Function"
  },
  {
    "description": "A function that always returns `true`. Any passed in parameters are ignored.",
    "name": "T",
    "sig": "* -> Boolean",
    "category": "Function"
  },
  {
    "description": "A special placeholder value used to specify \"gaps\" within curried functions,\nallowing partial application of any combination of arguments, regardless of\ntheir positions.\n\nIf `g` is a curried ternary function and `_` is `R.__`, the following are\nequivalent:\n\n  - `g(1, 2, 3)`\n  - `g(_, 2, 3)(1)`\n  - `g(_, _, 3)(1)(2)`\n  - `g(_, _, 3)(1, 2)`\n  - `g(_, 2, _)(1, 3)`\n  - `g(_, 2)(1)(3)`\n  - `g(_, 2)(1, 3)`\n  - `g(_, 2)(_, 3)(1)`",
    "name": "__",
    "sig": "",
    "category": "Function"
  },
  {
    "description": "Adds two values.",
    "name": "add",
    "sig": "Number -> Number -> Number",
    "category": "Math"
  },
  {
    "description": "Returns a curried equivalent of the provided function, with the specified\narity. The curried function has two unusual capabilities. First, its\narguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the\nfollowing are equivalent:\n\n  - `g(1)(2)(3)`\n  - `g(1)(2, 3)`\n  - `g(1, 2)(3)`\n  - `g(1, 2, 3)`\n\nSecondly, the special placeholder value [`R.__`](#__) may be used to specify\n\"gaps\", allowing partial application of any combination of arguments,\nregardless of their positions. If `g` is as above and `_` is [`R.__`](#__),\nthe following are equivalent:\n\n  - `g(1, 2, 3)`\n  - `g(_, 2, 3)(1)`\n  - `g(_, _, 3)(1)(2)`\n  - `g(_, _, 3)(1, 2)`\n  - `g(_, 2)(1)(3)`\n  - `g(_, 2)(1, 3)`\n  - `g(_, 2)(_, 3)(1)`",
    "name": "curryN",
    "sig": "Number -> (* -> a) -> (* -> a)",
    "category": "Function"
  },
  {
    "description": "Creates a new list iteration function from an existing one by adding two new\nparameters to its callback function: the current index, and the entire list.\n\nThis would turn, for instance, [`R.map`](#map) function into one that\nmore closely resembles `Array.prototype.map`. Note that this will only work\nfor functions in which the iteration callback function is the first\nparameter, and where the list is the last parameter. (This latter might be\nunimportant if the list parameter is not used.)",
    "name": "addIndex",
    "sig": "((a ... -> b) ... -> [a] -> *) -> (a ..., Int, [a] -> b) ... -> [a] -> *)",
    "category": "Function"
  },
  {
    "description": "Applies a function to the value at the given index of an array, returning a\nnew copy of the array with the element at the given index replaced with the\nresult of the function application.",
    "name": "adjust",
    "sig": "(a -> a) -> Number -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns `true` if all elements of the list match the predicate, `false` if\nthere are any that don't.\n\nDispatches to the `all` method of the second argument, if present.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "all",
    "sig": "(a -> Boolean) -> [a] -> Boolean",
    "category": "List"
  },
  {
    "description": "Returns the larger of its two arguments.",
    "name": "max",
    "sig": "Ord a => a -> a -> a",
    "category": "Relation"
  },
  {
    "description": "Creates a function that is bound to a context.\nNote: `R.bind` does not provide the additional argument-binding capabilities of\n[Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).",
    "name": "bind",
    "sig": "(* -> *) -> {*} -> (* -> *)",
    "category": "Function"
  },
  {
    "description": "Returns a list containing the names of all the enumerable own properties of\nthe supplied object.\nNote that the order of the output array is not guaranteed to be consistent\nacross different JS platforms.",
    "name": "_keys",
    "sig": "{k: v} -> [k]",
    "category": "Object"
  },
  {
    "description": "Takes a function and\na [functor](https://github.com/fantasyland/fantasy-land#functor),\napplies the function to each of the functor's values, and returns\na functor of the same shape.\n\nRamda provides suitable `map` implementations for `Array` and `Object`,\nso this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.\n\nDispatches to the `map` method of the second argument, if present.\n\nActs as a transducer if a transformer is given in list position.\n\nAlso treats functions as functors and will compose them together.",
    "name": "map",
    "sig": "Functor f => (a -> b) -> f a -> f b",
    "category": "List"
  },
  {
    "description": "Retrieve the value at a given path.",
    "name": "path",
    "sig": "[Idx] -> {a} -> a | Undefined",
    "category": "Object"
  },
  {
    "description": "Returns a function that when supplied an object returns the indicated\nproperty of that object, if it exists.",
    "name": "prop",
    "sig": "s -> {s: a} -> a | Undefined",
    "category": "Object"
  },
  {
    "description": "Returns a new list by plucking the same named property off all objects in\nthe list supplied.\n\n`pluck` will work on\nany [functor](https://github.com/fantasyland/fantasy-land#functor) in\naddition to arrays, as it is equivalent to `R.map(R.prop(k), f)`.",
    "name": "pluck",
    "sig": "Functor f => k -> f {k: v} -> f v",
    "category": "List"
  },
  {
    "description": "Returns a single item by iterating through the list, successively calling\nthe iterator function and passing it an accumulator value and the current\nvalue from the array, and then passing the result to the next call.\n\nThe iterator function receives two values: *(acc, value)*. It may use\n[`R.reduced`](#reduced) to shortcut the iteration.\n\nThe arguments' order of [`reduceRight`](#reduceRight)'s iterator function\nis *(value, acc)*.\n\nNote: `R.reduce` does not skip deleted or unassigned indices (sparse\narrays), unlike the native `Array.prototype.reduce` method. For more details\non this behavior, see:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description\n\nDispatches to the `reduce` method of the third argument, if present. When\ndoing so, it is up to the user to handle the [`R.reduced`](#reduced)\nshortcuting, as this is not implemented by `reduce`.",
    "name": "reduce",
    "sig": "((a, b) -> a) -> a -> [b] -> a",
    "category": "List"
  },
  {
    "description": "Takes a list of predicates and returns a predicate that returns true for a\ngiven list of arguments if every one of the provided predicates is satisfied\nby those arguments.\n\nThe function returned is a curried function whose arity matches that of the\nhighest-arity predicate.",
    "name": "allPass",
    "sig": "[(*... -> Boolean)] -> (*... -> Boolean)",
    "category": "Logic"
  },
  {
    "description": "Returns `true` if both arguments are `true`; `false` otherwise.",
    "name": "and",
    "sig": "a -> b -> a | b",
    "category": "Logic"
  },
  {
    "description": "Returns `true` if at least one of elements of the list match the predicate,\n`false` otherwise.\n\nDispatches to the `any` method of the second argument, if present.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "any",
    "sig": "(a -> Boolean) -> [a] -> Boolean",
    "category": "List"
  },
  {
    "description": "Takes a list of predicates and returns a predicate that returns true for a\ngiven list of arguments if at least one of the provided predicates is\nsatisfied by those arguments.\n\nThe function returned is a curried function whose arity matches that of the\nhighest-arity predicate.",
    "name": "anyPass",
    "sig": "[(*... -> Boolean)] -> (*... -> Boolean)",
    "category": "Logic"
  },
  {
    "description": "ap applies a list of functions to a list of values.\n\nDispatches to the `ap` method of the second argument, if present. Also\ntreats curried functions as applicatives.",
    "name": "ap",
    "sig": "[a -> b] -> [a] -> [b]",
    "category": "Function"
  },
  {
    "description": "Returns a new list, composed of n-tuples of consecutive elements. If `n` is\ngreater than the length of the list, an empty list is returned.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "aperture",
    "sig": "Number -> [a] -> [[a]]",
    "category": "List"
  },
  {
    "description": "Returns a new list containing the contents of the given list, followed by\nthe given element.",
    "name": "append",
    "sig": "a -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Applies function `fn` to the argument list `args`. This is useful for\ncreating a fixed-arity function from a variadic function. `fn` should be a\nbound function if context is significant.",
    "name": "apply",
    "sig": "(*... -> a) -> [*] -> a",
    "category": "Function"
  },
  {
    "description": "Returns a list of all the enumerable own properties of the supplied object.\nNote that the order of the output array is not guaranteed across different\nJS platforms.",
    "name": "values",
    "sig": "{k: v} -> [v]",
    "category": "Object"
  },
  {
    "description": "Given a spec object recursively mapping properties to functions, creates a\nfunction producing an object of the same structure, by mapping each property\nto the result of calling its associated function with the supplied arguments.",
    "name": "applySpec",
    "sig": "{k: ((a, b, ..., m) -> v)} -> ((a, b, ..., m) -> {k: v})",
    "category": "Function"
  },
  {
    "description": "Takes a value and applies a function to it.\n\nThis function is also known as the `thrush` combinator.",
    "name": "applyTo",
    "sig": "a -> (a -> b) -> b",
    "category": "Function"
  },
  {
    "description": "Makes an ascending comparator function out of a function that returns a value\nthat can be compared with `<` and `>`.",
    "name": "ascend",
    "sig": "Ord b => (a -> b) -> a -> a -> Number",
    "category": "Function"
  },
  {
    "description": "Makes a shallow clone of an object, setting or overriding the specified\nproperty with the given value. Note that this copies and flattens prototype\nproperties onto the new object as well. All non-primitive properties are\ncopied by reference.",
    "name": "assoc",
    "sig": "String -> a -> {k: v} -> {k: v}",
    "category": "Object"
  },
  {
    "description": "Checks if the input value is `null` or `undefined`.",
    "name": "isNil",
    "sig": "* -> Boolean",
    "category": "Type"
  },
  {
    "description": "Makes a shallow clone of an object, setting or overriding the nodes required\nto create the given path, and placing the specific value at the tail end of\nthat path. Note that this copies and flattens prototype properties onto the\nnew object as well. All non-primitive properties are copied by reference.",
    "name": "assocPath",
    "sig": "[Idx] -> a -> {a} -> {a}",
    "category": "Object"
  },
  {
    "description": "Wraps a function of any arity (including nullary) in a function that accepts\nexactly `n` parameters. Any extraneous parameters will not be passed to the\nsupplied function.",
    "name": "nAry",
    "sig": "Number -> (* -> a) -> (* -> a)",
    "category": "Function"
  },
  {
    "description": "Wraps a function of any arity (including nullary) in a function that accepts\nexactly 2 parameters. Any extraneous parameters will not be passed to the\nsupplied function.",
    "name": "binary",
    "sig": "(* -> c) -> (a, b -> c)",
    "category": "Function"
  },
  {
    "description": "\"lifts\" a function to be the specified arity, so that it may \"map over\" that\nmany lists, Functions or other objects that satisfy the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).",
    "name": "liftN",
    "sig": "Number -> (*... -> *) -> ([*]... -> [*])",
    "category": "Function"
  },
  {
    "description": "\"lifts\" a function of arity > 1 so that it may \"map over\" a list, Function or other\nobject that satisfies the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).",
    "name": "lift",
    "sig": "(*... -> *) -> ([*]... -> [*])",
    "category": "Function"
  },
  {
    "description": "A function which calls the two provided functions and returns the `&&`\nof the results.\nIt returns the result of the first function if it is false-y and the result\nof the second function otherwise. Note that this is short-circuited,\nmeaning that the second function will not be invoked if the first returns a\nfalse-y value.\n\nIn addition to functions, `R.both` also accepts any fantasy-land compatible\napplicative functor.",
    "name": "both",
    "sig": "(*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)",
    "category": "Logic"
  },
  {
    "description": "Returns a curried equivalent of the provided function. The curried function\nhas two unusual capabilities. First, its arguments needn't be provided one\nat a time. If `f` is a ternary function and `g` is `R.curry(f)`, the\nfollowing are equivalent:\n\n  - `g(1)(2)(3)`\n  - `g(1)(2, 3)`\n  - `g(1, 2)(3)`\n  - `g(1, 2, 3)`\n\nSecondly, the special placeholder value [`R.__`](#__) may be used to specify\n\"gaps\", allowing partial application of any combination of arguments,\nregardless of their positions. If `g` is as above and `_` is [`R.__`](#__),\nthe following are equivalent:\n\n  - `g(1, 2, 3)`\n  - `g(_, 2, 3)(1)`\n  - `g(_, _, 3)(1)(2)`\n  - `g(_, _, 3)(1, 2)`\n  - `g(_, 2)(1)(3)`\n  - `g(_, 2)(1, 3)`\n  - `g(_, 2)(_, 3)(1)`",
    "name": "curry",
    "sig": "(* -> a) -> (* -> a)",
    "category": "Function"
  },
  {
    "description": "Returns the result of calling its first argument with the remaining\narguments. This is occasionally useful as a converging function for\n[`R.converge`](#converge): the first branch can produce a function while the\nremaining branches produce values to be passed to that function as its\narguments.",
    "name": "call",
    "sig": "(*... -> a),*... -> a",
    "category": "Function"
  },
  {
    "description": "`chain` maps a function over a list and concatenates the results. `chain`\nis also known as `flatMap` in some libraries\n\nDispatches to the `chain` method of the second argument, if present,\naccording to the [FantasyLand Chain spec](https://github.com/fantasyland/fantasy-land#chain).",
    "name": "chain",
    "sig": "Chain m => (a -> m b) -> m a -> m b",
    "category": "List"
  },
  {
    "description": "Restricts a number to be within a range.\n\nAlso works for other ordered types such as Strings and Dates.",
    "name": "clamp",
    "sig": "Ord a => a -> a -> a -> a",
    "category": "Relation"
  },
  {
    "description": "Gives a single-word string description of the (native) type of a value,\nreturning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not\nattempt to distinguish user Object types any further, reporting them all as\n'Object'.",
    "name": "type",
    "sig": "(* -> {*}) -> String",
    "category": "Type"
  },
  {
    "description": "Creates a deep copy of the value which may contain (nested) `Array`s and\n`Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are\nassigned by reference rather than copied\n\nDispatches to a `clone` method if present.",
    "name": "clone",
    "sig": "{*} -> {*}",
    "category": "Object"
  },
  {
    "description": "Makes a comparator function out of a function that reports whether the first\nelement is less than the second.",
    "name": "comparator",
    "sig": "((a, b) -> Boolean) -> ((a, b) -> Number)",
    "category": "Function"
  },
  {
    "description": "A function that returns the `!` of its argument. It will return `true` when\npassed false-y value, and `false` when passed a truth-y one.",
    "name": "not",
    "sig": "* -> Boolean",
    "category": "Logic"
  },
  {
    "description": "Takes a function `f` and returns a function `g` such that if called with the same arguments\nwhen `f` returns a \"truthy\" value, `g` returns `false` and when `f` returns a \"falsy\" value `g` returns `true`.\n\n`R.complement` may be applied to any functor",
    "name": "complement",
    "sig": "(*... -> *) -> (*... -> Boolean)",
    "category": "Logic"
  },
  {
    "description": "Returns the elements of the given list or string (or object with a `slice`\nmethod) from `fromIndex` (inclusive) to `toIndex` (exclusive).\n\nDispatches to the `slice` method of the third argument, if present.",
    "name": "slice",
    "sig": "Number -> Number -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns all but the first element of the given list or string (or object\nwith a `tail` method).\n\nDispatches to the `slice` method of the first argument, if present.",
    "name": "tail",
    "sig": "[a] -> [a]",
    "category": "List"
  },
  {
    "description": "Performs left-to-right function composition. The leftmost function may have\nany arity; the remaining functions must be unary.\n\nIn some libraries this function is named `sequence`.\n\n**Note:** The result of pipe is not automatically curried.",
    "name": "pipe",
    "sig": "(((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)",
    "category": "Function"
  },
  {
    "description": "Returns a new list or string with the elements or characters in reverse\norder.",
    "name": "reverse",
    "sig": "[a] -> [a]",
    "category": "List"
  },
  {
    "description": "Performs right-to-left function composition. The rightmost function may have\nany arity; the remaining functions must be unary.\n\n**Note:** The result of compose is not automatically curried.",
    "name": "compose",
    "sig": "((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)",
    "category": "Function"
  },
  {
    "description": "Returns the right-to-left Kleisli composition of the provided functions,\neach of which must return a value of a type supported by [`chain`](#chain).\n\n`R.composeK(h, g, f)` is equivalent to `R.compose(R.chain(h), R.chain(g), f)`.",
    "name": "composeK",
    "sig": "Chain m => ((y -> m z), (x -> m y), ..., (a -> m b)) -> (a -> m z)",
    "category": "Function"
  },
  {
    "description": "Performs left-to-right composition of one or more Promise-returning\nfunctions. The leftmost function may have any arity; the remaining functions\nmust be unary.",
    "name": "pipeP",
    "sig": "((a -> Promise b), (b -> Promise c), ..., (y -> Promise z)) -> (a -> Promise z)",
    "category": "Function"
  },
  {
    "description": "Performs right-to-left composition of one or more Promise-returning\nfunctions. The rightmost function may have any arity; the remaining\nfunctions must be unary.",
    "name": "composeP",
    "sig": "((y -> Promise z), (x -> Promise y), ..., (a -> Promise b)) -> (a -> Promise z)",
    "category": "Function"
  },
  {
    "description": "Returns true if its arguments are identical, false otherwise. Values are\nidentical if they reference the same memory. `NaN` is identical to `NaN`;\n`0` and `-0` are not identical.",
    "name": "identical",
    "sig": "a -> a -> Boolean",
    "category": "Relation"
  },
  {
    "description": "Returns `true` if its arguments are equivalent, `false` otherwise. Handles\ncyclical data structures.\n\nDispatches symmetrically to the `equals` methods of both arguments, if\npresent.",
    "name": "equals",
    "sig": "a -> b -> Boolean",
    "category": "Relation"
  },
  {
    "description": "Takes a predicate and a `Filterable`, and returns a new filterable of the\nsame type containing the members of the given filterable which satisfy the\ngiven predicate. Filterable objects include plain objects or any object\nthat has a filter method such as `Array`.\n\nDispatches to the `filter` method of the second argument, if present.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "filter",
    "sig": "Filterable f => (a -> Boolean) -> f a -> f a",
    "category": "List"
  },
  {
    "description": "The complement of [`filter`](#filter).\n\nActs as a transducer if a transformer is given in list position. Filterable\nobjects include plain objects or any object that has a filter method such\nas `Array`.",
    "name": "reject",
    "sig": "Filterable f => (a -> Boolean) -> f a -> f a",
    "category": "List"
  },
  {
    "description": "Returns the string representation of the given value. `eval`'ing the output\nshould result in a value equivalent to the input value. Many of the built-in\n`toString` methods do not satisfy this requirement.\n\nIf the given value is an `[object Object]` with a `toString` method other\nthan `Object.prototype.toString`, this method is invoked with no arguments\nto produce the return value. This means user-defined constructor functions\ncan provide a suitable `toString` method. For example:\n\n    function Point(x, y) {\n      this.x = x;\n      this.y = y;\n    }\n\n    Point.prototype.toString = function() {\n      return 'new Point(' + this.x + ', ' + this.y + ')';\n    };\n\n    R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'",
    "name": "toString",
    "sig": "* -> String",
    "category": "String"
  },
  {
    "description": "Returns the result of concatenating the given lists or strings.\n\nNote: `R.concat` expects both arguments to be of the same type,\nunlike the native `Array.prototype.concat` method. It will throw\nan error if you `concat` an Array with a non-Array value.\n\nDispatches to the `concat` method of the first argument, if present.\nCan also concatenate two members of a [fantasy-land\ncompatible semigroup](https://github.com/fantasyland/fantasy-land#semigroup).",
    "name": "concat",
    "sig": "[a] -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns a function, `fn`, which encapsulates `if/else, if/else, ...` logic.\n`R.cond` takes a list of [predicate, transformer] pairs. All of the arguments\nto `fn` are applied to each of the predicates in turn until one returns a\n\"truthy\" value, at which point `fn` returns the result of applying its\narguments to the corresponding transformer. If none of the predicates\nmatches, `fn` returns undefined.",
    "name": "cond",
    "sig": "[[(*... -> Boolean),(*... -> *)]] -> (*... -> *)",
    "category": "Logic"
  },
  {
    "description": "Wraps a constructor function inside a curried function that can be called\nwith the same arguments and returns the same type. The arity of the function\nreturned is specified to allow using variadic constructor functions.",
    "name": "constructN",
    "sig": "Number -> (* -> {*}) -> (* -> {*})",
    "category": "Function"
  },
  {
    "description": "Wraps a constructor function inside a curried function that can be called\nwith the same arguments and returns the same type.",
    "name": "construct",
    "sig": "(* -> {*}) -> (* -> {*})",
    "category": "Function"
  },
  {
    "description": "Returns `true` if the specified value is equal, in [`R.equals`](#equals)\nterms, to at least one element of the given list; `false` otherwise.",
    "name": "contains",
    "sig": "a -> [a] -> Boolean",
    "category": "List"
  },
  {
    "description": "Accepts a converging function and a list of branching functions and returns\na new function. When invoked, this new function is applied to some\narguments, each branching function is applied to those same arguments. The\nresults of each branching function are passed as arguments to the converging\nfunction to produce the return value.",
    "name": "converge",
    "sig": "((x1, x2, ...) -> z) -> [((a, b, ...) -> x1), ((a, b, ...) -> x2), ...] -> (a -> b -> ... -> z)",
    "category": "Function"
  },
  {
    "description": "Groups the elements of the list according to the result of calling\nthe String-returning function `keyFn` on each element and reduces the elements\nof each group to a single value via the reducer function `valueFn`.\n\nThis function is basically a more general [`groupBy`](#groupBy) function.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "reduceBy",
    "sig": "((a, b) -> a) -> a -> (b -> String) -> [b] -> {String: a}",
    "category": "List"
  },
  {
    "description": "Counts the elements of a list according to how many match each value of a\nkey generated by the supplied function. Returns an object mapping the keys\nproduced by `fn` to the number of occurrences in the list. Note that all\nkeys are coerced to strings because of how JavaScript objects work.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "countBy",
    "sig": "(a -> String) -> [a] -> {*}",
    "category": "Relation"
  },
  {
    "description": "Decrements its argument.",
    "name": "dec",
    "sig": "Number -> Number",
    "category": "Math"
  },
  {
    "description": "Returns the second argument if it is not `null`, `undefined` or `NaN`;\notherwise the first argument is returned.",
    "name": "defaultTo",
    "sig": "a -> b -> a | b",
    "category": "Logic"
  },
  {
    "description": "Makes a descending comparator function out of a function that returns a value\nthat can be compared with `<` and `>`.",
    "name": "descend",
    "sig": "Ord b => (a -> b) -> a -> a -> Number",
    "category": "Function"
  },
  {
    "description": "Finds the set (i.e. no duplicates) of all elements in the first list not\ncontained in the second list. Objects and Arrays are compared in terms of\nvalue equality, not reference equality.",
    "name": "difference",
    "sig": "[*] -> [*] -> [*]",
    "category": "Relation"
  },
  {
    "description": "Finds the set (i.e. no duplicates) of all elements in the first list not\ncontained in the second list. Duplication is determined according to the\nvalue returned by applying the supplied predicate to two list elements.",
    "name": "differenceWith",
    "sig": "((a, a) -> Boolean) -> [a] -> [a] -> [a]",
    "category": "Relation"
  },
  {
    "description": "Returns a new object that does not contain a `prop` property.",
    "name": "dissoc",
    "sig": "String -> {k: v} -> {k: v}",
    "category": "Object"
  },
  {
    "description": "Removes the sub-list of `list` starting at index `start` and containing\n`count` elements. _Note that this is not destructive_: it returns a copy of\nthe list with the changes.\n<small>No lists have been harmed in the application of this function.</small>",
    "name": "remove",
    "sig": "Number -> Number -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns a new copy of the array with the element at the provided index\nreplaced with the given value.",
    "name": "update",
    "sig": "Number -> a -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Makes a shallow clone of an object, omitting the property at the given path.\nNote that this copies and flattens prototype properties onto the new object\nas well. All non-primitive properties are copied by reference.",
    "name": "dissocPath",
    "sig": "[Idx] -> {k: v} -> {k: v}",
    "category": "Object"
  },
  {
    "description": "Divides two numbers. Equivalent to `a / b`.",
    "name": "divide",
    "sig": "Number -> Number -> Number",
    "category": "Math"
  },
  {
    "description": "Returns all but the first `n` elements of the given list, string, or\ntransducer/transformer (or object with a `drop` method).\n\nDispatches to the `drop` method of the second argument, if present.",
    "name": "drop",
    "sig": "Number -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns the first `n` elements of the given list, string, or\ntransducer/transformer (or object with a `take` method).\n\nDispatches to the `take` method of the second argument, if present.",
    "name": "take",
    "sig": "Number -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns a list containing all but the last `n` elements of the given `list`.",
    "name": "dropLast",
    "sig": "Number -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns a new list excluding all the tailing elements of a given list which\nsatisfy the supplied predicate function. It passes each value from the right\nto the supplied predicate function, skipping elements until the predicate\nfunction returns a `falsy` value. The predicate function is applied to one argument:\n*(value)*.",
    "name": "dropLastWhile",
    "sig": "(a -> Boolean) -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns the nth element of the given list or string. If n is negative the\nelement at index length + n is returned.",
    "name": "nth",
    "sig": "Number -> [a] -> a | Undefined",
    "category": "List"
  },
  {
    "description": "Returns the last element of the given list or string.",
    "name": "last",
    "sig": "[a] -> a | Undefined",
    "category": "List"
  },
  {
    "description": "Returns a new list without any consecutively repeating elements. Equality is\ndetermined by applying the supplied predicate to each pair of consecutive elements. The\nfirst element in a series of equal elements will be preserved.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "dropRepeatsWith",
    "sig": "((a, a) -> Boolean) -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns a new list without any consecutively repeating elements.\n[`R.equals`](#equals) is used to determine equality.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "dropRepeats",
    "sig": "[a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns a new list excluding the leading elements of a given list which\nsatisfy the supplied predicate function. It passes each value to the supplied\npredicate function, skipping elements while the predicate function returns\n`true`. The predicate function is applied to one argument: *(value)*.\n\nDispatches to the `dropWhile` method of the second argument, if present.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "dropWhile",
    "sig": "(a -> Boolean) -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns `true` if one or both of its arguments are `true`. Returns `false`\nif both arguments are `false`.",
    "name": "or",
    "sig": "a -> b -> a | b",
    "category": "Logic"
  },
  {
    "description": "A function wrapping calls to the two functions in an `||` operation,\nreturning the result of the first function if it is truth-y and the result\nof the second function otherwise. Note that this is short-circuited,\nmeaning that the second function will not be invoked if the first returns a\ntruth-y value.\n\nIn addition to functions, `R.either` also accepts any fantasy-land compatible\napplicative functor.",
    "name": "either",
    "sig": "(*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)",
    "category": "Logic"
  },
  {
    "description": "Returns the empty value of its argument's type. Ramda defines the empty\nvalue of Array (`[]`), Object (`{}`), String (`''`), and Arguments. Other\ntypes are supported if they define `<Type>.empty`,\n`<Type>.prototype.empty` or implement the\n[FantasyLand Monoid spec](https://github.com/fantasyland/fantasy-land#monoid).\n\nDispatches to the `empty` method of the first argument, if present.",
    "name": "empty",
    "sig": "a -> a",
    "category": "Function"
  },
  {
    "description": "Returns a new list containing the last `n` elements of the given list.\nIf `n > list.length`, returns a list of `list.length` elements.",
    "name": "takeLast",
    "sig": "Number -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Checks if a list ends with the provided values",
    "name": "endsWith",
    "sig": "[a] -> Boolean",
    "category": "List"
  },
  {
    "description": "Takes a function and two values in its domain and returns `true` if the\nvalues map to the same value in the codomain; `false` otherwise.",
    "name": "eqBy",
    "sig": "(a -> b) -> a -> a -> Boolean",
    "category": "Relation"
  },
  {
    "description": "Reports whether two objects have the same value, in [`R.equals`](#equals)\nterms, for the specified property. Useful as a curried predicate.",
    "name": "eqProps",
    "sig": "k -> {k: v} -> {k: v} -> Boolean",
    "category": "Object"
  },
  {
    "description": "Creates a new object by recursively evolving a shallow copy of `object`,\naccording to the `transformation` functions. All non-primitive properties\nare copied by reference.\n\nA `transformation` function will not be invoked if its corresponding key\ndoes not exist in the evolved object.",
    "name": "evolve",
    "sig": "{k: (v -> v)} -> {k: v} -> {k: v}",
    "category": "Object"
  },
  {
    "description": "Returns the first element of the list which matches the predicate, or\n`undefined` if no element matches.\n\nDispatches to the `find` method of the second argument, if present.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "find",
    "sig": "(a -> Boolean) -> [a] -> a | undefined",
    "category": "List"
  },
  {
    "description": "Returns the index of the first element of the list which matches the\npredicate, or `-1` if no element matches.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "findIndex",
    "sig": "(a -> Boolean) -> [a] -> Number",
    "category": "List"
  },
  {
    "description": "Returns the last element of the list which matches the predicate, or\n`undefined` if no element matches.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "findLast",
    "sig": "(a -> Boolean) -> [a] -> a | undefined",
    "category": "List"
  },
  {
    "description": "Returns the index of the last element of the list which matches the\npredicate, or `-1` if no element matches.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "findLastIndex",
    "sig": "(a -> Boolean) -> [a] -> Number",
    "category": "List"
  },
  {
    "description": "Returns a new list by pulling every item out of it (and all its sub-arrays)\nand putting them in a new array, depth-first.",
    "name": "flatten",
    "sig": "[a] -> [b]",
    "category": "List"
  },
  {
    "description": "Returns a new function much like the supplied one, except that the first two\narguments' order is reversed.",
    "name": "flip",
    "sig": "((a, b, c, ...) -> z) -> (b -> a -> c -> ... -> z)",
    "category": "Function"
  },
  {
    "description": "Iterate over an input `list`, calling a provided function `fn` for each\nelement in the list.\n\n`fn` receives one argument: *(value)*.\n\nNote: `R.forEach` does not skip deleted or unassigned indices (sparse\narrays), unlike the native `Array.prototype.forEach` method. For more\ndetails on this behavior, see:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description\n\nAlso note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns\nthe original array. In some libraries this function is named `each`.\n\nDispatches to the `forEach` method of the second argument, if present.",
    "name": "forEach",
    "sig": "(a -> *) -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Iterate over an input `object`, calling a provided function `fn` for each\nkey and value in the object.\n\n`fn` receives three argument: *(value, key, obj)*.",
    "name": "forEachObjIndexed",
    "sig": "((a, String, StrMap a) -> Any) -> StrMap a -> StrMap a",
    "category": "Object"
  },
  {
    "description": "Creates a new object from a list key-value pairs. If a key appears in\nmultiple pairs, the rightmost pair is included in the object.",
    "name": "fromPairs",
    "sig": "[[k,v]] -> {k: v}",
    "category": "List"
  },
  {
    "description": "Splits a list into sub-lists stored in an object, based on the result of\ncalling a String-returning function on each element, and grouping the\nresults according to values returned.\n\nDispatches to the `groupBy` method of the second argument, if present.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "groupBy",
    "sig": "(a -> String) -> [a] -> {String: [a]}",
    "category": "List"
  },
  {
    "description": "Takes a list and returns a list of lists where each sublist's elements are\nall satisfied pairwise comparison according to the provided function.\nOnly adjacent elements are passed to the comparison function.",
    "name": "groupWith",
    "sig": "((a, a) → Boolean) → [a] → [[a]]",
    "category": "List"
  },
  {
    "description": "Returns `true` if the first argument is greater than the second; `false`\notherwise.",
    "name": "gt",
    "sig": "Ord a => a -> a -> Boolean",
    "category": "Relation"
  },
  {
    "description": "Returns `true` if the first argument is greater than or equal to the second;\n`false` otherwise.",
    "name": "gte",
    "sig": "Ord a => a -> a -> Boolean",
    "category": "Relation"
  },
  {
    "description": "Returns whether or not an object has an own property with the specified name",
    "name": "has",
    "sig": "s -> {s: x} -> Boolean",
    "category": "Object"
  },
  {
    "description": "Returns whether or not an object or its prototype chain has a property with\nthe specified name",
    "name": "hasIn",
    "sig": "s -> {s: x} -> Boolean",
    "category": "Object"
  },
  {
    "description": "Returns the first element of the given list or string. In some libraries\nthis function is named `first`.",
    "name": "head",
    "sig": "[a] -> a | Undefined",
    "category": "List"
  },
  {
    "description": "A function that does nothing but return the parameter supplied to it. Good\nas a default or placeholder function.",
    "name": "identity",
    "sig": "a -> a",
    "category": "Function"
  },
  {
    "description": "Creates a function that will process either the `onTrue` or the `onFalse`\nfunction depending upon the result of the `condition` predicate.",
    "name": "ifElse",
    "sig": "(*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)",
    "category": "Logic"
  },
  {
    "description": "Increments its argument.",
    "name": "inc",
    "sig": "Number -> Number",
    "category": "Math"
  },
  {
    "description": "Given a function that generates a key, turns a list of objects into an\nobject indexing the objects by the given key. Note that if multiple\nobjects generate the same value for the indexing key only the last value\nwill be included in the generated object.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "indexBy",
    "sig": "(a -> String) -> [{k: v}] -> {k: {k: v}}",
    "category": "List"
  },
  {
    "description": "Returns the position of the first occurrence of an item in an array, or -1\nif the item is not included in the array. [`R.equals`](#equals) is used to\ndetermine equality.",
    "name": "indexOf",
    "sig": "a -> [a] -> Number",
    "category": "List"
  },
  {
    "description": "Returns all but the last element of the given list or string.",
    "name": "init",
    "sig": "[a] -> [a]",
    "category": "List"
  },
  {
    "description": "Takes a predicate `pred`, a list `xs`, and a list `ys`, and returns a list\n`xs'` comprising each of the elements of `xs` which is equal to one or more\nelements of `ys` according to `pred`.\n\n`pred` must be a binary function expecting an element from each list.\n\n`xs`, `ys`, and `xs'` are treated as sets, semantically, so ordering should\nnot be significant, but since `xs'` is ordered the implementation guarantees\nthat its values are in the same order as they appear in `xs`. Duplicates are\nnot removed, so `xs'` may contain duplicates if `xs` contains duplicates.",
    "name": "innerJoin",
    "sig": "((a, b) -> Boolean) -> [a] -> [b] -> [a]",
    "category": "Relation"
  },
  {
    "description": "Inserts the supplied element into the list, at the specified `index`. _Note that\nthis is not destructive_: it returns a copy of the list with the changes.\n<small>No lists have been harmed in the application of this function.</small>",
    "name": "insert",
    "sig": "Number -> a -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Inserts the sub-list into the list, at the specified `index`. _Note that this is not\ndestructive_: it returns a copy of the list with the changes.\n<small>No lists have been harmed in the application of this function.</small>",
    "name": "insertAll",
    "sig": "Number -> [a] -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns a new list containing only one copy of each element in the original\nlist, based upon the value returned by applying the supplied function to\neach list element. Prefers the first item if the supplied function produces\nthe same value on two items. [`R.equals`](#equals) is used for comparison.",
    "name": "uniqBy",
    "sig": "(a -> b) -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns a new list containing only one copy of each element in the original\nlist. [`R.equals`](#equals) is used to determine equality.",
    "name": "uniq",
    "sig": "[a] -> [a]",
    "category": "List"
  },
  {
    "description": "Combines two lists into a set (i.e. no duplicates) composed of those\nelements common to both lists.",
    "name": "intersection",
    "sig": "[*] -> [*] -> [*]",
    "category": "Relation"
  },
  {
    "description": "Creates a new list with the separator interposed between elements.\n\nDispatches to the `intersperse` method of the second argument, if present.",
    "name": "intersperse",
    "sig": "a -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Creates an object containing a single key:value pair.",
    "name": "objOf",
    "sig": "String -> a -> {String:a}",
    "category": "Object"
  },
  {
    "description": "Transforms the items of the list with the transducer and appends the\ntransformed items to the accumulator using an appropriate iterator function\nbased on the accumulator type.\n\nThe accumulator can be an array, string, object or a transformer. Iterated\nitems will be appended to arrays and concatenated to strings. Objects will\nbe merged directly or 2-item arrays will be merged as key, value pairs.\n\nThe accumulator can also be a transformer object that provides a 2-arity\nreducing iterator function, step, 0-arity initial value function, init, and\n1-arity result extraction function result. The step function is used as the\niterator function in reduce. The result function is used to convert the\nfinal accumulator into the return type and in most cases is R.identity. The\ninit function is used to provide the initial accumulator.\n\nThe iteration is performed with [`R.reduce`](#reduce) after initializing the\ntransducer.",
    "name": "into",
    "sig": "a -> (b -> b) -> [c] -> a",
    "category": "List"
  },
  {
    "description": "Same as [`R.invertObj`](#invertObj), however this accounts for objects with\nduplicate values by putting the values into an array.",
    "name": "invert",
    "sig": "{s: x} -> {x: [ s, ... ]}",
    "category": "Object"
  },
  {
    "description": "Returns a new object with the keys of the given object as values, and the\nvalues of the given object, which are coerced to strings, as keys. Note\nthat the last key found is preferred when handling the same value.",
    "name": "invertObj",
    "sig": "{s: x} -> {x: s}",
    "category": "Object"
  },
  {
    "description": "Turns a named method with a specified arity into a function that can be\ncalled directly supplied with arguments and a target object.\n\nThe returned function is curried and accepts `arity + 1` parameters where\nthe final parameter is the target object.",
    "name": "invoker",
    "sig": "Number -> String -> (a -> b -> ... -> n -> Object -> *)",
    "category": "Function"
  },
  {
    "description": "See if an object (`val`) is an instance of the supplied constructor. This\nfunction will check up the inheritance chain, if any.",
    "name": "is",
    "sig": "(* -> {*}) -> a -> Boolean",
    "category": "Type"
  },
  {
    "description": "Returns `true` if the given value is its type's empty value; `false`\notherwise.",
    "name": "isEmpty",
    "sig": "a -> Boolean",
    "category": "Logic"
  },
  {
    "description": "Returns a string made by inserting the `separator` between each element and\nconcatenating all the elements into a single string.",
    "name": "join",
    "sig": "String -> [a] -> String",
    "category": "List"
  },
  {
    "description": "juxt applies a list of functions to a list of values.",
    "name": "juxt",
    "sig": "[(a, b, ..., m) -> n] -> ((a, b, ..., m) -> [n])",
    "category": "Function"
  },
  {
    "description": "Returns a list containing the names of all the properties of the supplied\nobject, including prototype properties.\nNote that the order of the output array is not guaranteed to be consistent\nacross different JS platforms.",
    "name": "keysIn",
    "sig": "{k: v} -> [k]",
    "category": "Object"
  },
  {
    "description": "Returns the position of the last occurrence of an item in an array, or -1 if\nthe item is not included in the array. [`R.equals`](#equals) is used to\ndetermine equality.",
    "name": "lastIndexOf",
    "sig": "a -> [a] -> Number",
    "category": "List"
  },
  {
    "description": "Returns the number of elements in the array by returning `list.length`.",
    "name": "length",
    "sig": "[a] -> Number",
    "category": "List"
  },
  {
    "description": "Returns a lens for the given getter and setter functions. The getter \"gets\"\nthe value of the focus; the setter \"sets\" the value of the focus. The setter\nshould not mutate the data structure.",
    "name": "lens",
    "sig": "(s -> a) -> ((a, s) -> s) -> Lens s a",
    "category": "Object"
  },
  {
    "description": "Returns a lens whose focus is the specified index.",
    "name": "lensIndex",
    "sig": "Number -> Lens s a",
    "category": "Object"
  },
  {
    "description": "Returns a lens whose focus is the specified path.",
    "name": "lensPath",
    "sig": "[Idx] -> Lens s a",
    "category": "Object"
  },
  {
    "description": "Returns a lens whose focus is the specified property.",
    "name": "lensProp",
    "sig": "String -> Lens s a",
    "category": "Object"
  },
  {
    "description": "Returns `true` if the first argument is less than the second; `false`\notherwise.",
    "name": "lt",
    "sig": "Ord a => a -> a -> Boolean",
    "category": "Relation"
  },
  {
    "description": "Returns `true` if the first argument is less than or equal to the second;\n`false` otherwise.",
    "name": "lte",
    "sig": "Ord a => a -> a -> Boolean",
    "category": "Relation"
  },
  {
    "description": "The `mapAccum` function behaves like a combination of map and reduce; it\napplies a function to each element of a list, passing an accumulating\nparameter from left to right, and returning a final value of this\naccumulator together with the new list.\n\nThe iterator function receives two arguments, *acc* and *value*, and should\nreturn a tuple *[acc, value]*.",
    "name": "mapAccum",
    "sig": "((acc, x) -> (acc, y)) -> acc -> [x] -> (acc, [y])",
    "category": "List"
  },
  {
    "description": "The `mapAccumRight` function behaves like a combination of map and reduce; it\napplies a function to each element of a list, passing an accumulating\nparameter from right to left, and returning a final value of this\naccumulator together with the new list.\n\nSimilar to [`mapAccum`](#mapAccum), except moves through the input list from\nthe right to the left.\n\nThe iterator function receives two arguments, *value* and *acc*, and should\nreturn a tuple *[value, acc]*.",
    "name": "mapAccumRight",
    "sig": "((x, acc) -> (y, acc)) -> acc -> [x] -> ([y], acc)",
    "category": "List"
  },
  {
    "description": "An Object-specific version of [`map`](#map). The function is applied to three\narguments: *(value, key, obj)*. If only the value is significant, use\n[`map`](#map) instead.",
    "name": "mapObjIndexed",
    "sig": "((*, String, Object) -> *) -> Object -> Object",
    "category": "Object"
  },
  {
    "description": "Tests a regular expression against a String. Note that this function will\nreturn an empty array when there are no matches. This differs from\n[`String.prototype.match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)\nwhich returns `null` when there are no matches.",
    "name": "match",
    "sig": "RegExp -> String -> [String | Undefined]",
    "category": "String"
  },
  {
    "description": "`mathMod` behaves like the modulo operator should mathematically, unlike the\n`%` operator (and by extension, [`R.modulo`](#modulo)). So while\n`-17 % 5` is `-2`, `mathMod(-17, 5)` is `3`. `mathMod` requires Integer\narguments, and returns NaN when the modulus is zero or negative.",
    "name": "mathMod",
    "sig": "Number -> Number -> Number",
    "category": "Math"
  },
  {
    "description": "Takes a function and two values, and returns whichever value produces the\nlarger result when passed to the provided function.",
    "name": "maxBy",
    "sig": "Ord b => (a -> b) -> a -> a -> a",
    "category": "Relation"
  },
  {
    "description": "Adds together all the elements of a list.",
    "name": "sum",
    "sig": "[Number] -> Number",
    "category": "Math"
  },
  {
    "description": "Returns the mean of the given list of numbers.",
    "name": "mean",
    "sig": "[Number] -> Number",
    "category": "Math"
  },
  {
    "description": "Returns the median of the given list of numbers.",
    "name": "median",
    "sig": "[Number] -> Number",
    "category": "Math"
  },
  {
    "description": "A customisable version of [`R.memoize`](#memoize). `memoizeWith` takes an\nadditional function that will be applied to a given argument set and used to\ncreate the cache key under which the results of the function to be memoized\nwill be stored. Care must be taken when implementing key generation to avoid\nclashes that may overwrite previous entries erroneously.",
    "name": "memoizeWith",
    "sig": "(*... -> String) -> (*... -> a) -> (*... -> a)",
    "category": "Function"
  },
  {
    "description": "Creates a new function that, when invoked, caches the result of calling `fn`\nfor a given argument set and returns the result. Subsequent calls to the\nmemoized `fn` with the same argument set will not result in an additional\ncall to `fn`; instead, the cached result for that set of arguments will be\nreturned.",
    "name": "memoize",
    "sig": "(*... -> a) -> (*... -> a)",
    "category": "Function"
  },
  {
    "description": "Create a new object with the own properties of the first object merged with\nthe own properties of the second object. If a key exists in both objects,\nthe value from the second object will be used.",
    "name": "merge",
    "sig": "{k: v} -> {k: v} -> {k: v}",
    "category": "Object"
  },
  {
    "description": "Merges a list of objects together into one object.",
    "name": "mergeAll",
    "sig": "[{k: v}] -> {k: v}",
    "category": "List"
  },
  {
    "description": "Creates a new object with the own properties of the two provided objects. If\na key exists in both objects, the provided function is applied to the key\nand the values associated with the key in each object, with the result being\nused as the value associated with the key in the returned object.",
    "name": "mergeWithKey",
    "sig": "((String, a, a) -> a) -> {a} -> {a} -> {a}",
    "category": "Object"
  },
  {
    "description": "Creates a new object with the own properties of the two provided objects.\nIf a key exists in both objects:\n- and both associated values are also objects then the values will be\n  recursively merged.\n- otherwise the provided function is applied to the key and associated values\n  using the resulting value as the new value associated with the key.\nIf a key only exists in one object, the value will be associated with the key\nof the resulting object.",
    "name": "mergeDeepWithKey",
    "sig": "((String, a, a) -> a) -> {a} -> {a} -> {a}",
    "category": "Object"
  },
  {
    "description": "Creates a new object with the own properties of the first object merged with\nthe own properties of the second object. If a key exists in both objects:\n- and both values are objects, the two values will be recursively merged\n- otherwise the value from the first object will be used.",
    "name": "mergeDeepLeft",
    "sig": "{a} -> {a} -> {a}",
    "category": "Object"
  },
  {
    "description": "Creates a new object with the own properties of the first object merged with\nthe own properties of the second object. If a key exists in both objects:\n- and both values are objects, the two values will be recursively merged\n- otherwise the value from the second object will be used.",
    "name": "mergeDeepRight",
    "sig": "{a} -> {a} -> {a}",
    "category": "Object"
  },
  {
    "description": "Creates a new object with the own properties of the two provided objects.\nIf a key exists in both objects:\n- and both associated values are also objects then the values will be\n  recursively merged.\n- otherwise the provided function is applied to associated values using the\n  resulting value as the new value associated with the key.\nIf a key only exists in one object, the value will be associated with the key\nof the resulting object.",
    "name": "mergeDeepWith",
    "sig": "((a, a) -> a) -> {a} -> {a} -> {a}",
    "category": "Object"
  },
  {
    "description": "Creates a new object with the own properties of the two provided objects. If\na key exists in both objects, the provided function is applied to the values\nassociated with the key in each object, with the result being used as the\nvalue associated with the key in the returned object.",
    "name": "mergeWith",
    "sig": "((a, a) -> a) -> {a} -> {a} -> {a}",
    "category": "Object"
  },
  {
    "description": "Returns the smaller of its two arguments.",
    "name": "min",
    "sig": "Ord a => a -> a -> a",
    "category": "Relation"
  },
  {
    "description": "Takes a function and two values, and returns whichever value produces the\nsmaller result when passed to the provided function.",
    "name": "minBy",
    "sig": "Ord b => (a -> b) -> a -> a -> a",
    "category": "Relation"
  },
  {
    "description": "Divides the first parameter by the second and returns the remainder. Note\nthat this function preserves the JavaScript-style behavior for modulo. For\nmathematical modulo see [`mathMod`](#mathMod).",
    "name": "modulo",
    "sig": "Number -> Number -> Number",
    "category": "Math"
  },
  {
    "description": "Multiplies two numbers. Equivalent to `a * b` but curried.",
    "name": "multiply",
    "sig": "Number -> Number -> Number",
    "category": "Math"
  },
  {
    "description": "Negates its argument.",
    "name": "negate",
    "sig": "Number -> Number",
    "category": "Math"
  },
  {
    "description": "Returns `true` if no elements of the list match the predicate, `false`\notherwise.\n\nDispatches to the `any` method of the second argument, if present.",
    "name": "none",
    "sig": "(a -> Boolean) -> [a] -> Boolean",
    "category": "List"
  },
  {
    "description": "Returns a function which returns its nth argument.",
    "name": "nthArg",
    "sig": "Number -> *... -> *",
    "category": "Function"
  },
  {
    "description": "`o` is a curried composition function that returns a unary function.\nLike [`compose`](#compose), `o` performs right-to-left function composition.\nUnlike [`compose`](#compose), the rightmost function passed to `o` will be\ninvoked with only one argument.",
    "name": "o",
    "sig": "(b -> c) -> (a -> b) -> a -> c",
    "category": "Function"
  },
  {
    "description": "Returns a singleton array containing the value provided.\n\nNote this `of` is different from the ES6 `of`; See\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of",
    "name": "of",
    "sig": "a -> [a]",
    "category": "Function"
  },
  {
    "description": "Returns a partial copy of an object omitting the keys specified.",
    "name": "omit",
    "sig": "[String] -> {String: *} -> {String: *}",
    "category": "Object"
  },
  {
    "description": "Accepts a function `fn` and returns a function that guards invocation of\n`fn` such that `fn` can only ever be called once, no matter how many times\nthe returned function is invoked. The first value calculated is returned in\nsubsequent invocations.",
    "name": "once",
    "sig": "(a... -> b) -> (a... -> b)",
    "category": "Function"
  },
  {
    "description": "Returns the result of \"setting\" the portion of the given data structure\nfocused by the given lens to the result of applying the given function to\nthe focused value.",
    "name": "over",
    "sig": "Lens s a -> (a -> a) -> s -> s",
    "category": "Object"
  },
  {
    "description": "Takes two arguments, `fst` and `snd`, and returns `[fst, snd]`.",
    "name": "pair",
    "sig": "a -> b -> (a,b)",
    "category": "List"
  },
  {
    "description": "Takes a function `f` and a list of arguments, and returns a function `g`.\nWhen applied, `g` returns the result of applying `f` to the arguments\nprovided initially followed by the arguments provided to `g`.",
    "name": "partial",
    "sig": "((a, b, c, ..., n) -> x) -> [a, b, c, ...] -> ((d, e, f, ..., n) -> x)",
    "category": "Function"
  },
  {
    "description": "Takes a function `f` and a list of arguments, and returns a function `g`.\nWhen applied, `g` returns the result of applying `f` to the arguments\nprovided to `g` followed by the arguments provided initially.",
    "name": "partialRight",
    "sig": "((a, b, c, ..., n) -> x) -> [d, e, f, ..., n] -> ((a, b, c, ...) -> x)",
    "category": "Function"
  },
  {
    "description": "Takes a predicate and a list or other `Filterable` object and returns the\npair of filterable objects of the same type of elements which do and do not\nsatisfy, the predicate, respectively. Filterable objects include plain objects or any object\nthat has a filter method such as `Array`.",
    "name": "partition",
    "sig": "Filterable f => (a -> Boolean) -> f a -> [f a, f a]",
    "category": "List"
  },
  {
    "description": "Determines whether a nested path on an object has a specific value, in\n[`R.equals`](#equals) terms. Most likely used to filter a list.",
    "name": "pathEq",
    "sig": "[Idx] -> a -> {a} -> Boolean",
    "category": "Relation"
  },
  {
    "description": "If the given, non-null object has a value at the given path, returns the\nvalue at that path. Otherwise returns the provided default value.",
    "name": "pathOr",
    "sig": "a -> [Idx] -> {a} -> a",
    "category": "Object"
  },
  {
    "description": "Returns `true` if the specified object property at given path satisfies the\ngiven predicate; `false` otherwise.",
    "name": "pathSatisfies",
    "sig": "(a -> Boolean) -> [Idx] -> {a} -> Boolean",
    "category": "Logic"
  },
  {
    "description": "Returns a partial copy of an object containing only the keys specified. If\nthe key does not exist, the property is ignored.",
    "name": "pick",
    "sig": "[k] -> {k: v} -> {k: v}",
    "category": "Object"
  },
  {
    "description": "Similar to `pick` except that this one includes a `key: undefined` pair for\nproperties that don't exist.",
    "name": "pickAll",
    "sig": "[k] -> {k: v} -> {k: v}",
    "category": "Object"
  },
  {
    "description": "Returns a partial copy of an object containing only the keys that satisfy\nthe supplied predicate.",
    "name": "pickBy",
    "sig": "((v, k) -> Boolean) -> {k: v} -> {k: v}",
    "category": "Object"
  },
  {
    "description": "Returns the left-to-right Kleisli composition of the provided functions,\neach of which must return a value of a type supported by [`chain`](#chain).\n\n`R.pipeK(f, g, h)` is equivalent to `R.pipe(f, R.chain(g), R.chain(h))`.",
    "name": "pipeK",
    "sig": "Chain m => ((a -> m b), (b -> m c), ..., (y -> m z)) -> (a -> m z)",
    "category": "Function"
  },
  {
    "description": "Returns a new list with the given element at the front, followed by the\ncontents of the list.",
    "name": "prepend",
    "sig": "a -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Multiplies together all the elements of a list.",
    "name": "product",
    "sig": "[Number] -> Number",
    "category": "Math"
  },
  {
    "description": "Accepts a function `fn` and a list of transformer functions and returns a\nnew curried function. When the new function is invoked, it calls the\nfunction `fn` with parameters consisting of the result of calling each\nsupplied handler on successive arguments to the new function.\n\nIf more arguments are passed to the returned function than transformer\nfunctions, those arguments are passed directly to `fn` as additional\nparameters. If you expect additional arguments that don't need to be\ntransformed, although you can ignore them, it's best to pass an identity\nfunction so that the new function reports the correct arity.",
    "name": "useWith",
    "sig": "((x1, x2, ...) -> z) -> [(a -> x1), (b -> x2), ...] -> (a -> b -> ... -> z)",
    "category": "Function"
  },
  {
    "description": "Reasonable analog to SQL `select` statement.",
    "name": "project",
    "sig": "[k] -> [{k: v}] -> [{k: v}]",
    "category": "Object"
  },
  {
    "description": "Returns `true` if the specified object property is equal, in\n[`R.equals`](#equals) terms, to the given value; `false` otherwise.\nYou can test multiple properties with [`R.where`](#where).",
    "name": "propEq",
    "sig": "String -> a -> Object -> Boolean",
    "category": "Relation"
  },
  {
    "description": "Returns `true` if the specified object property is of the given type;\n`false` otherwise.",
    "name": "propIs",
    "sig": "Type -> String -> Object -> Boolean",
    "category": "Type"
  },
  {
    "description": "If the given, non-null object has an own property with the specified name,\nreturns the value of that property. Otherwise returns the provided default\nvalue.",
    "name": "propOr",
    "sig": "a -> String -> Object -> a",
    "category": "Object"
  },
  {
    "description": "Returns `true` if the specified object property satisfies the given\npredicate; `false` otherwise. You can test multiple properties with\n[`R.where`](#where).",
    "name": "propSatisfies",
    "sig": "(a -> Boolean) -> String -> {String: a} -> Boolean",
    "category": "Logic"
  },
  {
    "description": "Acts as multiple `prop`: array of keys in, array of values out. Preserves\norder.",
    "name": "props",
    "sig": "[k] -> {k: v} -> [v]",
    "category": "Object"
  },
  {
    "description": "Returns a list of numbers from `from` (inclusive) to `to` (exclusive).",
    "name": "range",
    "sig": "Number -> Number -> [Number]",
    "category": "List"
  },
  {
    "description": "Returns a single item by iterating through the list, successively calling\nthe iterator function and passing it an accumulator value and the current\nvalue from the array, and then passing the result to the next call.\n\nSimilar to [`reduce`](#reduce), except moves through the input list from the\nright to the left.\n\nThe iterator function receives two values: *(value, acc)*, while the arguments'\norder of `reduce`'s iterator function is *(acc, value)*.\n\nNote: `R.reduceRight` does not skip deleted or unassigned indices (sparse\narrays), unlike the native `Array.prototype.reduceRight` method. For more details\non this behavior, see:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description",
    "name": "reduceRight",
    "sig": "((a, b) -> b) -> b -> [a] -> b",
    "category": "List"
  },
  {
    "description": "Like [`reduce`](#reduce), `reduceWhile` returns a single item by iterating\nthrough the list, successively calling the iterator function. `reduceWhile`\nalso takes a predicate that is evaluated before each step. If the predicate\nreturns `false`, it \"short-circuits\" the iteration and returns the current\nvalue of the accumulator.",
    "name": "reduceWhile",
    "sig": "((a, b) -> Boolean) -> ((a, b) -> a) -> a -> [b] -> a",
    "category": "List"
  },
  {
    "description": "Returns a value wrapped to indicate that it is the final value of the reduce\nand transduce functions. The returned value should be considered a black\nbox: the internal structure is not guaranteed to be stable.\n\nNote: this optimization is unavailable to functions not explicitly listed\nabove. For instance, it is not currently supported by\n[`reduceRight`](#reduceRight).",
    "name": "reduced",
    "sig": "a -> *",
    "category": "List"
  },
  {
    "description": "Calls an input function `n` times, returning an array containing the results\nof those function calls.\n\n`fn` is passed one argument: The current value of `n`, which begins at `0`\nand is gradually incremented to `n - 1`.",
    "name": "times",
    "sig": "(Number -> a) -> Number -> [a]",
    "category": "List"
  },
  {
    "description": "Returns a fixed list of size `n` containing a specified identical value.",
    "name": "repeat",
    "sig": "a -> n -> [a]",
    "category": "List"
  },
  {
    "description": "Replace a substring or regex match in a string with a replacement.",
    "name": "replace",
    "sig": "RegExp|String -> String -> String -> String",
    "category": "String"
  },
  {
    "description": "Scan is similar to [`reduce`](#reduce), but returns a list of successively\nreduced values from the left",
    "name": "scan",
    "sig": "((a, b) -> a) -> a -> [b] -> [a]",
    "category": "List"
  },
  {
    "description": "Transforms a [Traversable](https://github.com/fantasyland/fantasy-land#traversable)\nof [Applicative](https://github.com/fantasyland/fantasy-land#applicative) into an\nApplicative of Traversable.\n\nDispatches to the `sequence` method of the second argument, if present.",
    "name": "sequence",
    "sig": "(Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)",
    "category": "List"
  },
  {
    "description": "Returns the result of \"setting\" the portion of the given data structure\nfocused by the given lens to the given value.",
    "name": "set",
    "sig": "Lens s a -> a -> s -> s",
    "category": "Object"
  },
  {
    "description": "Returns a copy of the list, sorted according to the comparator function,\nwhich should accept two values at a time and return a negative number if the\nfirst value is smaller, a positive number if it's larger, and zero if they\nare equal. Please note that this is a **copy** of the list. It does not\nmodify the original.",
    "name": "sort",
    "sig": "((a, a) -> Number) -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Sorts the list according to the supplied function.",
    "name": "sortBy",
    "sig": "Ord b => (a -> b) -> [a] -> [a]",
    "category": "Relation"
  },
  {
    "description": "Sorts a list according to a list of comparators.",
    "name": "sortWith",
    "sig": "[(a, a) -> Number] -> [a] -> [a]",
    "category": "Relation"
  },
  {
    "description": "Splits a string into an array of strings based on the given\nseparator.",
    "name": "split",
    "sig": "(String | RegExp) -> String -> [String]",
    "category": "String"
  },
  {
    "description": "Splits a given list or string at a given index.",
    "name": "splitAt",
    "sig": "Number -> [a] -> [[a], [a]]",
    "category": "List"
  },
  {
    "description": "Splits a collection into slices of the specified length.",
    "name": "splitEvery",
    "sig": "Number -> [a] -> [[a]]",
    "category": "List"
  },
  {
    "description": "Takes a list and a predicate and returns a pair of lists with the following properties:\n\n - the result of concatenating the two output lists is equivalent to the input list;\n - none of the elements of the first output list satisfies the predicate; and\n - if the second output list is non-empty, its first element satisfies the predicate.",
    "name": "splitWhen",
    "sig": "(a -> Boolean) -> [a] -> [[a], [a]]",
    "category": "List"
  },
  {
    "description": "Checks if a list starts with the provided values",
    "name": "startsWith",
    "sig": "[a] -> Boolean",
    "category": "List"
  },
  {
    "description": "Subtracts its second argument from its first argument.",
    "name": "subtract",
    "sig": "Number -> Number -> Number",
    "category": "Math"
  },
  {
    "description": "Finds the set (i.e. no duplicates) of all elements contained in the first or\nsecond list, but not both.",
    "name": "symmetricDifference",
    "sig": "[*] -> [*] -> [*]",
    "category": "Relation"
  },
  {
    "description": "Finds the set (i.e. no duplicates) of all elements contained in the first or\nsecond list, but not both. Duplication is determined according to the value\nreturned by applying the supplied predicate to two list elements.",
    "name": "symmetricDifferenceWith",
    "sig": "((a, a) -> Boolean) -> [a] -> [a] -> [a]",
    "category": "Relation"
  },
  {
    "description": "Returns a new list containing the last `n` elements of a given list, passing\neach value to the supplied predicate function, and terminating when the\npredicate function returns `false`. Excludes the element that caused the\npredicate function to fail. The predicate function is passed one argument:\n*(value)*.",
    "name": "takeLastWhile",
    "sig": "(a -> Boolean) -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Returns a new list containing the first `n` elements of a given list,\npassing each value to the supplied predicate function, and terminating when\nthe predicate function returns `false`. Excludes the element that caused the\npredicate function to fail. The predicate function is passed one argument:\n*(value)*.\n\nDispatches to the `takeWhile` method of the second argument, if present.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "takeWhile",
    "sig": "(a -> Boolean) -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Runs the given function with the supplied object, then returns the object.\n\nActs as a transducer if a transformer is given as second parameter.",
    "name": "tap",
    "sig": "(a -> *) -> a -> a",
    "category": "Function"
  },
  {
    "description": "Determines whether a given string matches a given regular expression.",
    "name": "test",
    "sig": "RegExp -> String -> Boolean",
    "category": "String"
  },
  {
    "description": "The lower case version of a string.",
    "name": "toLower",
    "sig": "String -> String",
    "category": "String"
  },
  {
    "description": "Converts an object into an array of key, value arrays. Only the object's\nown properties are used.\nNote that the order of the output array is not guaranteed to be consistent\nacross different JS platforms.",
    "name": "toPairs",
    "sig": "{String: *} -> [[String,*]]",
    "category": "Object"
  },
  {
    "description": "Converts an object into an array of key, value arrays. The object's own\nproperties and prototype properties are used. Note that the order of the\noutput array is not guaranteed to be consistent across different JS\nplatforms.",
    "name": "toPairsIn",
    "sig": "{String: *} -> [[String,*]]",
    "category": "Object"
  },
  {
    "description": "The upper case version of a string.",
    "name": "toUpper",
    "sig": "String -> String",
    "category": "String"
  },
  {
    "description": "Initializes a transducer using supplied iterator function. Returns a single\nitem by iterating through the list, successively calling the transformed\niterator function and passing it an accumulator value and the current value\nfrom the array, and then passing the result to the next call.\n\nThe iterator function receives two values: *(acc, value)*. It will be\nwrapped as a transformer to initialize the transducer. A transformer can be\npassed directly in place of an iterator function. In both cases, iteration\nmay be stopped early with the [`R.reduced`](#reduced) function.\n\nA transducer is a function that accepts a transformer and returns a\ntransformer and can be composed directly.\n\nA transformer is an an object that provides a 2-arity reducing iterator\nfunction, step, 0-arity initial value function, init, and 1-arity result\nextraction function, result. The step function is used as the iterator\nfunction in reduce. The result function is used to convert the final\naccumulator into the return type and in most cases is\n[`R.identity`](#identity). The init function can be used to provide an\ninitial accumulator, but is ignored by transduce.\n\nThe iteration is performed with [`R.reduce`](#reduce) after initializing the transducer.",
    "name": "transduce",
    "sig": "(c -> c) -> ((a, b) -> a) -> a -> [b] -> a",
    "category": "List"
  },
  {
    "description": "Transposes the rows and columns of a 2D list.\nWhen passed a list of `n` lists of length `x`,\nreturns a list of `x` lists of length `n`.",
    "name": "transpose",
    "sig": "[[a]] -> [[a]]",
    "category": "List"
  },
  {
    "description": "Maps an [Applicative](https://github.com/fantasyland/fantasy-land#applicative)-returning\nfunction over a [Traversable](https://github.com/fantasyland/fantasy-land#traversable),\nthen uses [`sequence`](#sequence) to transform the resulting Traversable of Applicative\ninto an Applicative of Traversable.\n\nDispatches to the `traverse` method of the third argument, if present.",
    "name": "traverse",
    "sig": "(Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)",
    "category": "List"
  },
  {
    "description": "Removes (strips) whitespace from both ends of the string.",
    "name": "trim",
    "sig": "String -> String",
    "category": "String"
  },
  {
    "description": "`tryCatch` takes two functions, a `tryer` and a `catcher`. The returned\nfunction evaluates the `tryer`; if it does not throw, it simply returns the\nresult. If the `tryer` *does* throw, the returned function evaluates the\n`catcher` function and returns its result. Note that for effective\ncomposition with this function, both the `tryer` and `catcher` functions\nmust return the same type of results.",
    "name": "tryCatch",
    "sig": "(...x -> a) -> ((e, ...x) -> a) -> (...x -> a)",
    "category": "Function"
  },
  {
    "description": "Takes a function `fn`, which takes a single array argument, and returns a\nfunction which:\n\n  - takes any number of positional arguments;\n  - passes these arguments to `fn` as an array; and\n  - returns the result.\n\nIn other words, `R.unapply` derives a variadic function from a function which\ntakes an array. `R.unapply` is the inverse of [`R.apply`](#apply).",
    "name": "unapply",
    "sig": "([*...] -> a) -> (*... -> a)",
    "category": "Function"
  },
  {
    "description": "Wraps a function of any arity (including nullary) in a function that accepts\nexactly 1 parameter. Any extraneous parameters will not be passed to the\nsupplied function.",
    "name": "unary",
    "sig": "(* -> b) -> (a -> b)",
    "category": "Function"
  },
  {
    "description": "Returns a function of arity `n` from a (manually) curried function.",
    "name": "uncurryN",
    "sig": "Number -> (a -> b) -> (a -> c)",
    "category": "Function"
  },
  {
    "description": "Builds a list from a seed value. Accepts an iterator function, which returns\neither false to stop iteration or an array of length 2 containing the value\nto add to the resulting list and the seed to be used in the next call to the\niterator function.\n\nThe iterator function receives one argument: *(seed)*.",
    "name": "unfold",
    "sig": "(a -> [b]) -> * -> [b]",
    "category": "List"
  },
  {
    "description": "Combines two lists into a set (i.e. no duplicates) composed of the elements\nof each list.",
    "name": "union",
    "sig": "[*] -> [*] -> [*]",
    "category": "Relation"
  },
  {
    "description": "Returns a new list containing only one copy of each element in the original\nlist, based upon the value returned by applying the supplied predicate to\ntwo list elements. Prefers the first item if two items compare equal based\non the predicate.",
    "name": "uniqWith",
    "sig": "((a, a) -> Boolean) -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Combines two lists into a set (i.e. no duplicates) composed of the elements\nof each list. Duplication is determined according to the value returned by\napplying the supplied predicate to two list elements.",
    "name": "unionWith",
    "sig": "((a, a) -> Boolean) -> [*] -> [*] -> [*]",
    "category": "Relation"
  },
  {
    "description": "Tests the final argument by passing it to the given predicate function. If\nthe predicate is not satisfied, the function will return the result of\ncalling the `whenFalseFn` function with the same argument. If the predicate\nis satisfied, the argument is returned as is.",
    "name": "unless",
    "sig": "(a -> Boolean) -> (a -> a) -> a -> a",
    "category": "Logic"
  },
  {
    "description": "Shorthand for `R.chain(R.identity)`, which removes one level of nesting from\nany [Chain](https://github.com/fantasyland/fantasy-land#chain).",
    "name": "unnest",
    "sig": "Chain c => c (c a) -> c a",
    "category": "List"
  },
  {
    "description": "Takes a predicate, a transformation function, and an initial value,\nand returns a value of the same type as the initial value.\nIt does so by applying the transformation until the predicate is satisfied,\nat which point it returns the satisfactory value.",
    "name": "until",
    "sig": "(a -> Boolean) -> (a -> a) -> a -> a",
    "category": "Logic"
  },
  {
    "description": "Returns a list of all the properties, including prototype properties, of the\nsupplied object.\nNote that the order of the output array is not guaranteed to be consistent\nacross different JS platforms.",
    "name": "valuesIn",
    "sig": "{k: v} -> [v]",
    "category": "Object"
  },
  {
    "description": "Returns a \"view\" of the given data structure, determined by the given lens.\nThe lens's focus determines which portion of the data structure is visible.",
    "name": "view",
    "sig": "Lens s a -> s -> a",
    "category": "Object"
  },
  {
    "description": "Tests the final argument by passing it to the given predicate function. If\nthe predicate is satisfied, the function will return the result of calling\nthe `whenTrueFn` function with the same argument. If the predicate is not\nsatisfied, the argument is returned as is.",
    "name": "when",
    "sig": "(a -> Boolean) -> (a -> a) -> a -> a",
    "category": "Logic"
  },
  {
    "description": "Takes a spec object and a test object; returns true if the test satisfies\nthe spec. Each of the spec's own properties must be a predicate function.\nEach predicate is applied to the value of the corresponding property of the\ntest object. `where` returns true if all the predicates return true, false\notherwise.\n\n`where` is well suited to declaratively expressing constraints for other\nfunctions such as [`filter`](#filter) and [`find`](#find).",
    "name": "where",
    "sig": "{String: (* -> Boolean)} -> {String: *} -> Boolean",
    "category": "Object"
  },
  {
    "description": "Takes a spec object and a test object; returns true if the test satisfies\nthe spec, false otherwise. An object satisfies the spec if, for each of the\nspec's own properties, accessing that property of the object gives the same\nvalue (in [`R.equals`](#equals) terms) as accessing that property of the\nspec.\n\n`whereEq` is a specialization of [`where`](#where).",
    "name": "whereEq",
    "sig": "{String: *} -> {String: *} -> Boolean",
    "category": "Object"
  },
  {
    "description": "Returns a new list without values in the first argument.\n[`R.equals`](#equals) is used to determine equality.\n\nActs as a transducer if a transformer is given in list position.",
    "name": "without",
    "sig": "[a] -> [a] -> [a]",
    "category": "List"
  },
  {
    "description": "Creates a new list out of the two supplied by creating each possible pair\nfrom the lists.",
    "name": "xprod",
    "sig": "[a] -> [b] -> [[a,b]]",
    "category": "List"
  },
  {
    "description": "Creates a new list out of the two supplied by pairing up equally-positioned\nitems from both lists. The returned list is truncated to the length of the\nshorter of the two input lists.\nNote: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.",
    "name": "zip",
    "sig": "[a] -> [b] -> [[a,b]]",
    "category": "List"
  },
  {
    "description": "Creates a new object out of a list of keys and a list of values.\nKey/value pairing is truncated to the length of the shorter of the two lists.\nNote: `zipObj` is equivalent to `pipe(zip, fromPairs)`.",
    "name": "zipObj",
    "sig": "[String] -> [*] -> {String: *}",
    "category": "List"
  },
  {
    "description": "Creates a new list out of the two supplied by applying the function to each\nequally-positioned pair in the lists. The returned list is truncated to the\nlength of the shorter of the two input lists.",
    "name": "zipWith",
    "sig": "((a, b) -> c) -> [a] -> [b] -> [c]",
    "category": "List"
  }
]