var Promise = require('./promise');
var State = require('./state');
var util = require('util');

/**
 * Future
 * @class Future class matchin Promises/A+ Spec and Scala API
 */
var Future = module.exports = function() {
  Promise.call(this);
};

util.inherits(Future, Promise);

/**
 * Checks if the future is completed
 *
 * @return {Boolean} Whether or not the future is completed
 */
Future.prototype.isCompleted = function() {
  return this.state !== State.PENDING;
};

/**
 * Assigns one callback for both fulfill and reject
 *
 * @param {Function} callback The callback for both results
 */
Future.prototype.onComplete = function(callback) {
  this.then(function(value) {
    callback(value);
  }, function(reason) {
    callback(reason);
  });
};

/**
 * Converts a traditional style callback and resolves the future. If the future
 * has more than one argument beyond err, it will return and array as the value.
 *
 * @return {Function} The callback for async
 */
Future.prototype.convert = function() {
  var self = this;
  return function() {
    var args = Array.prototype.slice.call(arguments);
    var err = args.shift();

    if (err) {
      return self.reject(err);
    }

    if (args.length === 1) {
      args = args.shift();
    }

    return self.fulfill(args);
  };
};

/**
 * Returns a future that rejects after some time
 *
 * @param  {Number} duration Number of milliseconds to reject at
 * @return {Future}          The instremented future
 */
Future.prototype.ready = function(duration) {
  var future = new Future();

  this.then(function(value) {
    future.fulfill(value);
  });

  setTimeout(function() {
    future.reject(new Error('Did not resolve future in ' + duration + ' ms'));
  }, duration);

  return future;
};

/**
 * Falls back to the result of the other future if this one fails
 *
 * @param  {Promise} promise The promise to fallback to
 * @return {Future}          The future with the fallback value
 */
Future.prototype.fallbackTo = function(promise) {
  var future = new Future();

  this.then(function(value) {
    future.fulfill(value);
  }, function() {
    promise.then(function(value) {
      future.fulfill(value);
    });
  });

  return future;
};

/**
 * Filters the future by ensuring it matches the predicate
 *
 * @param  {Function} predicate The predicate to test the value of the future
 * @return {Future}             The new future
 */
Future.prototype.filter = function(predicate) {
  var future = new Future();

  this.then(function(value) {
    if (predicate(value)) {
      return future.fulfill(value);
    }

    return future.reject(new Error('Value does not match predicate'));
  }, function(reason) {
    future.reject(reason);
  });

  return future;
};

/**
 * Creates a new future based on the map callback
 *
 * @param  {Function} callback The callback on the successful value
 * @return {Future}            The new future
 */
Future.prototype.map = function(callback) {
  return this.then(callback);
};

/**
 * Calls the callback on failure
 *
 * @param {Function} callback The callback to be called if the promise fails
 */
Future.prototype.onFailure = function(callback) {
  this.then(null, callback);
};

/**
 * Calls the callback on success
 *
 * @param {Function} callback The callback to be called if the promise succeeds
 */
Future.prototype.onSuccess = function(callback) {
  this.then(callback);
};

/**
 * Recovers the future if it fails
 *
 * @param  {Object} value The value to recover to
 * @return {Future}       The new future
 */
Future.prototype.recover = function(value) {
  var future = new Future();

  this.then(function(value) {
    future.fulfill(value);
  }, function(reason) {
    future.fulfill(value);
  });

  return future;
};

/**
 * Alias for then
 *
 * @param  {Function} onFulfilled Called when the future succeeds
 * @param  {Function} onRejected  Called when the future fails
 * @return {Future}               The new future
 */
Future.prototype.transform = Future.prototype.then;

/**
 * Takes two futures and zips their values as a tuple
 *
 * @param  {Promise} promise The promise to be applied on the right of the tuple
 * @return {Future}          The new future which will fulfill with the tuple
 */
Future.prototype.zip = function(promise) {
  var future = new Future();

  this.then(function(left) {
    promise.then(function(right) {
      future.fulfill([left, right]);
    });
  });

  return future;
};