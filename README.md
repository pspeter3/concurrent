Concurrent
==========

Promises/A+ with Scala awesomeness [![Build Status](https://travis-ci.org/pspeter3/concurrent.png)](https://travis-ci.org/pspeter3/concurrent)

Examples
--------

### Simple Promise

Concurrent supports the a bare bones promise implementation that supports
`then(onFulfilled, onRejected)`, `fulfill(value)`, `reject(reason)`.

```js
var Promise = require('concurrent').Promise;

var success = new Promise();
success.then(function(value) {
  console.log(value); // 'success'
});
success.fulfill('success');

var failure = new Promise();
failure.then(null, function(reason) {
  console.log(reason); // 'failure'
});
failure.reject('failure');
```

[Documentation](http://pspeter3.com/concurrent/promise.js.html)

### Futures

Concurrent also provides a Future class which inherits from Promise. It has a
lot of syntactic sugar on top of the Promises/A+ spec based on the Scala Future
API.

```js
var Future = require('concurrent').Future;

var success = new Future();
success.onComplete(function(result) {
  console.log(result; // 'success'
});
success.fulfill('success');

var failure = new Future();
failure.onComplete(function(result) {
  console.log(result); // 'failure'
});
failure.reject('failure');
```

[Documentation](http://pspeter3.com/concurrent/future.js.html)

### Collections

Concurrent also provides a collections library which gives a lot of the standard
iterators. All the iterators are performed asynchronously and return Futures.
The following methods are supported:

- `forEach`
- `every`
- `some`
- `filter`
- `map`
- `reverse`
- `reduce`
- `reduceRight`

[Documentation](http://pspeter3.com/concurrent/collections.js.html)

### Working with existing callbacks

Futures also have support for working with existing callback style libraries by
using the `convert` method which returns a callback handler.

```js
var Future = require('concurrent').Future;
var request = require('request');

var google = new Future();
google.map(function(value) {
  var body = value[1]; // Request returns a response and a body
  console.log(body); // HTML for http://www.google.com
});
request('http://www.google.com', google.convert());
```

### Working with other promise implementations

Since concurrent implements the Promises/A+ spec, it should work with other
libraries that implement the spec. Also, the Future class internally does not
expect any method beyond `then`, `fulfill`, and `reject` so the prototype
methods can be merged into other implementations as long as they have those
three methods.

Credits
-------

There was a lot of inspiration for this project and getting it done. I would
like to thank:

- [@brikis98](https://github.com/brikis98) for helping me come up with the idea
- [Promises, understanding by doing](http://modernjavascript.blogspot.com/2013/08/promisesa-understanding-by-doing.html) for the initial promise spec
- [cujos/when](https://github.com/cujojs/when) for fully featured examples
- [aheckmann/mpromise](https://github.com/aheckmann/mpromise) for node.js specific implementation
- [promises-aplus/promises-tests](https://github.com/promises-aplus/promises-tests) for the test suite
- [Scala Futures](http://www.scala-lang.org/api/current/index.html#scala.concurrent.Future) For API sugar

License
-------

This is licensed under the MIT license. See the LICENSE file
