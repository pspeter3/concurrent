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
 * Takes two futures and zips their values as a tuple
 * 
 * @param  {Future} other The future to be applied on the right of the tuple
 * @return {Future}       The new future which will be fulfilled with the tuple
 */
Future.prototype.zip = function(other) {
  var future = new Future();

  this.then(function(left) {
    other.then(function(right) {
      future.fulfill([left, right]);
    });
  });

  return future;
};