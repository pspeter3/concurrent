var Future = require('./future');
var next = require('./next');

var some = exports.some = function(arr, predicate) {
  var length = arr.length;
  var count = 0;
  var future = new Future();

  arr.forEach(function(element) {
    next(function() {
      if (predicate(element)) {
        future.fulfill(true);
      }

      if (++count >= arr.length) {
        future.fulfill(false);
      }
    });
  });

  return future;
};