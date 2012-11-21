Monad.js
========

> Use monads in JavaScript without needing to know how they work.

So why would you want to use monads in JavaScript?  Especially if you don't know how they work?

Because you think this looks gross:

```javascript
fnThree(fnTwo(fnOne('arg')));
```

And you'd rather be able to do this:

```javascript
pass('arg').to(fnOne, fnTwo, fnThree);
```

Of course, if you _do_ understand monads then you understand the benefits.  If you don't, but you're interetested, there's a very accessible (I promise) section at the bottom of this readme file you can check out.

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

If you don't know about monads, it may not be super clear why you'd need to do this.  If you _do_ know about monads, it's because the `Monad` constructor actually takes two optional arguments allowing you to define your own custom `return` and `bind` functions that will be used when calling methods on this monad.  These arguments are optional so if you don't pass them in, the monad will use some defaults.  This way, if you don't know about monads, you won't have to worry about writing `return` and `bind` functions.

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

In the above example, `1` was passed in to `fnOne` whose return was then passed in to `fnTwo` whose return was then passed in to `fnThree`.  Technically there's a little more to it than that.  You'll also notice that `.to` actually returns a function.  This is because monads are _special_ and work in a _special_ way.  If you want the actual final result of your monad chain, just toss a couple more parens on the end:

```javascript
monad.pass(1).to(fnOne, fnTwo, fnThree)();
// <- 7
```

You should know that one limitation of monads is that you can only pass in one value at a time.  It's sort of the nature of the beast.  If you need your functions to deal with multiple values, try passing in a list or an object to the monad.

And there you have it.  That's all you have to do to generate extremely convenient monads in JavaScript.  Kthxbai!


What's Going On Under the Hood
------------------------------

Still here?  Oh, that must be because you're wondering how in the world this works.  Well let's start by talking about monads a little bit.

A monad is not a thing.  It's a technique that combines two functions that each do something specific.  The first function is called `return` in all the monad literature but I find that confusing so I'll call it `wrap` instead.  The other function is called `bind`.

1. The `wrap` (or `return`) function takes a value and wraps it up into a package of an expected type.
2. The `bind` function takes a wrapped up value and a function.  It gets the value out of the package, passes it to the function, and returns the result.

So when you create a monad you're really just doing something like this:

```javascript
/*
 * Takes a value and wraps it up in the form of a function.
 */
function wrap(val) {
  return function () {
    return val;
  };
}

/*
 * Takes a wrapped up value and another function.
 * Unwraps the value and passes it to the function.
 */
function bind(wrappedVal, fn) {
  return fn(wrappedVal());
}

/*
 * And here are a few functions to include in the monad.
 * Notice that each one calls wrap() when it returns a value
 * so the wrap function gets called at ever step.
 */
function monad_1 () { ... return wrap(someValue)}
function monad_2 () { ... return wrap(someValue)}
function monad_3 () { ... return wrap(someValue)}

/*
 * Lets execute that sucker.
 */
bind(
  bind(
    bind(
      wrap('arg'),
      monad_1
    ), 
    monad_2
  ), 
  monad_3
);
```

At this point the process should make sense but you'll notice that, in this form, it's still
rather hard to look at and read.  So what's the benefit of all this wrapping and binding anyway?

Most languages that implement monads natively add syntactic sugar on top.  In Haskell, for example, the `bind` function is impemented as an infix operator (a mathematical operator like `+` that sits between two arguments).  Specifically, it looks like this: `>>=`.  So let's _pretend_ we had that operator in JavaScript.  The above example could be rewritten like so...

```javascript
wrap('arg') >>= monad_1 >>= monad_2 >>= monad_3
```

Once we understand what that operator is doing, the above example becomes really simple.  We wrap up a value then use the bind operator to pass it on to an invocation of `monad_1` whose return gets passed on to `monad_2`, and finally to `monad_3`.

In the case of JavaScript, we don't have a native `bind` operator.  So instead Monad.js uses the most readable syntax possible to give you a sense of the same thing:

```javascript
myMonad.pass('arg').to(monad_1, monad_2, monad_3);
```

### So why don't I have to wrap my return values when using Monad.js?

Good question.  Because there is really no difference between this:

```javascript
(function (x) {
  return wrap(x);
}());
```

...and this:

```javascript
wrap((function (x) {
  return x;
}()));
```

In either case, `x` gets wrapped before anything else touches it.  Monad.js does the latter under the hood for two reasons.  1) Monad.js is a monad generator. It's supposed to take raw input and generate something cool.  2) This way you don't have to worry about really understanding the subtleties of monads while you use Monad.js.  Instead, you can just pass any function you want into the monad generator and have it work.








