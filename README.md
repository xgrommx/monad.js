Monad.js
========

> Use monads in JavaScript without caring or needing to know how they work.

So why would you want to use monads in JavaScript?  Especially if you don't know how they work?  Because you think this looks gross:

```javascript
fnThree(fnTwo(fnOne('arg')));
```

And you'd rather be able to do this:

```javascript
pass('arg').to(fnOne, fnTwo, fnThree);
```

Of course, if you _do_ understand monads then you understand the benefits.  If you don't, but you're interetested, there's a tiny, very accessible (I promise) section at the bottom of this readme file.

Dependencies
------------

None.

Installation
------------

Installs anywhere and everywhere in whatever way you'd expect.

Usage
-----

Monad.js creates a new global object called `Monad`.  To use that object, you'll need to instantiate it:

```javascript
var monad = new Monad();
```

If you don't know about monads, it may not be super clear why you'd need to do this.  If you _do_ know about monads, it's because the `Monad` constructor actually takes two options arguments allowing you to define your own custom `bind` and `return` functions that will be used with calling methods on this monad.  These arguments are optional so if you don't pass them in, the monad will use some defaults.  This way, if you don't know about monads, you won't have to worry about writing `bind` and `return` functions.

Now lets define some functions to use in our monadic chain:

```javascript
function fnOne(x)   { var y = x + 1; console.log(y); return y; }
function fnTwo(x)   { var y = x + 2; console.log(y); return y; }
function fnThree(x) { var y = x + 3; console.log(y); return y; }
```

Notice that each function adds a different number to its argument and returns the new number.

Now let's call our monad!

```javascript
monad.pass(1).to(fnOne, fnTwo, fnThree);
// => 2
// => 4
// => 7
// <- function (){return e;}
```

In the above example, `1` was passed in to `fnOne` whose return was then passed in to `fnTwo` whose return was then passed in to `fnThree`.  Technically there's a little more to it than that.  You'll also notice that `.to` actually returns a function.  This is because monads are _special_ and work in a _special_ way.  If you want the actual final result of you monad chain, just toss a couple more parens on the end:

```javascript
monad.pass(1).to(fnOne, fnTwo, fnThree)();
// <- 7
```

And there you have it.  That's all you have to do to generate extremely convenient monads in JavaScript.  Kthxbai!

What's Going On Under the Hood
------------------------------

A monad is not a thing.  It's a technique that combines two functions that each do something specific.  There's a function all the literature calls `return` but I'm going to call it `wrap` so as not to be confusing.  There's also a function called `bind`.

1. The `wrap` function takes a value and wraps it up into a package of an expected type.
2. The `bind` function takes a wrapped up value and a function.  It gets the value out of the package, passes it to the function, and returns the result.

So when you create a monad you're really just doing this:

```javascript
bind(
  wrap(
    bind(
      wrap('value'),
      function () {...}
    ),
    function () {...}
  )
);
```

You'll notice that this is very confusing.  That's why I've presented it in a nicer way.

... more to come ...







