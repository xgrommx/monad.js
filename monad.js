/*!
 * Name: Monad.js
 * Author: John Newman
 * Date: 11/20/2012
 * License: MIT
 * Version: 0.1
 * Description: Use monads in JavaScript without needing to know how they work.
 */

(function (global) {
  'use strict';

  /*
   * In case we're not in Node, make sure we have something called module
   * so the exports won't throw an error.
   */
  var module = module || null;

  /*
   * Define the Monad constructor
   * Where:
   * ret  - (optional) define your own return function
   * bind - (optional) define your own bind function
   */
  function Monad(ret, bind) {
    var monad = {

      /*
       * The default return function wraps a value
       * in a function.
       */
      "ret" : ret || function (val) {
        return function () {
          return val;
        };
      },

      /*
       * The default bind function invokes a
       * function-wrapped (monadic) value and passes that as
       * an argument to another function.
       */
      "bind" : bind || function (mval, fn) {
        return fn(mval());
      }
    };

    this.monad = monad;
  }

  /*
   * Give the constructor a prototype
   */
  Monad.prototype = {

    /*
     * Define the 'pass' function.
     * Where:
     * val - the value to be passed along the monadic chain
     *
     * Returns an object with the method 'to' wherein you
     * can specify the functions that will become
     * members of the invocation chain.  Invoking 'to' will
     * initialize the monadic invocation chain.
     */
    "pass" : function (val) {
        var monad = this.monad;

      return {

        /*
         * Where:
         * arguments - functions that will be part of the monad call
         */
        "to" : function () {

            /*
             * Grab the functions and wrap our initial value from
             * .pass in the return function.
             */
            var functions = arguments,
                output = monad.ret(val),
                len = functions.length,
                i;

            /*
             * Loop over each argument function.  For each one,
             * bind it to output then wrap that with return.
             */
            for (i = 0; i < len; i += 1) {
                output = monad.ret(monad.bind(output, functions[i]));
            }

            /*
             * Finally, return the output.
             */
            return output;
          }
        };
      }
    };


    /*
     * Export code through various means:
     */

    // AMD
    if (global.define && typeof global.define === 'function' && global.define.amd) {
      global.define('Monad', [], Monad);

    // Node
    } else if (module && module.exports) {
      module.exports = Monad;

    // Browser
    } else {
      global.Monad = Monad;
    }

}(this));


