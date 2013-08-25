var Promise = require('./promise');
var State = require('./state');
var util = require('util');

var Future = module.exports = function() {
  Promise.call(this);
};

util.inherits(Future, Promise);

Future.prototype.isCompleted = function() {
  return this.state !== State.PENDING;
};

Future.prototype.zip = function(other) {
  var future = new Future();

  this.then(function(left) {
    other.then(function(right) {
      future.fulfill([left, right]);
    });
  });
  
  return future;
};