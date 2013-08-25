var Future = require('./future');
var next = require('./next');

/**
 * Iterates over the collection an fulfills with the number iterated over
 * 
 * @param  {Array}    arr      The array to iterate over
 * @param  {Function} iterator The function to be called each time
 * @return {Future}            The future for the work
 */
var forEach = exports.forEach = function(arr, iterator) {
  var future = new Future();
  var completed = 0;

  arr.forEach(function(element) {
    next(function() {
      try {
        iterator(element);
      } catch(reason) {
        future.reject(reason);
      }

      if (++completed >= arr.length) {
        future.fulfill(completed);
      }
    });
  });

  return future;
};

/**
 * Proxy for every method
 *
 * @param  {Array}    arr       Array to check
 * @param  {Function} predicate Function to check with
 * @return {Future}             Future fulfilled with true if all matched
 */
var every = exports.every = function(arr, predicate) {
  var future = new Future();

  var compute = forEach(arr, function(element) {
    if (!predicate(element)) {
      future.fulfill(false);
    }
  });

  compute.then(function(value) {
    future.fulfill(true);
  }, function(reason) {
    future.reject(reason);
  });

  return future;
};

/**
 * Proxy for some method
 *
 * @param  {Array}    arr       Array to check
 * @param  {Function} predicate Function to check with
 * @return {Future}             Future fulfilled with true if any matched
 */
var some = exports.some = function(arr, predicate) {
  var future = new Future();

  var compute = forEach(arr, function(element) {
    if (predicate(element)) {
      future.fulfill(true);
    }
  });

  compute.then(function(value) {
    future.fulfill(false);
  }, function(reason) {
    future.reject(reason);
  });

  return future;
};

/**
 * Proxy for filter method
 *
 * @param  {Array}    arr       Array to check
 * @param  {Function} predicate Function to check with
 * @return {Future}             Future fulfilled with all that matched
 */
var filter = exports.filter = function(arr, predicate) {
  var future = new Future();
  var elements = [];

  var compute = forEach(arr, function(element) {
    if (predicate(element)) {
      elements.push(element);
    }
  });

  compute.then(function(value) {
    future.fulfill(elements);
  }, function(reason) {
    future.reject(reason);
  });

  return future;
};

/**
 * Proxy for map method
 *
 * @param  {Array}    arr       Array to check
 * @param  {Function} transform Function to map with
 * @return {Future}             Future fulfilled with mapped elements
 */
var map = exports.map = function(arr, transform) {
  var future = new Future();
  var elements = [];

  var compute = forEach(arr, function(element) {
    elements.push(transform(element));
  });

  compute.then(function(value) {
    future.fulfill(elements);
  }, function(reason) {
    future.reject(reason);
  });

  return future;
};
