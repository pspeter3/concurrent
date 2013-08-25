var Promise = require('./promise');
var State = require('./state');
var util = require('util');

var Future = module.exports = function() {
  Promise.call(this);
};

util.inherits(Future, Promise);
