var EventEmitter = require('events').EventEmitter;

/**
 * Promises states according to the A+ Specification
 *
 * @readOnly
 * @enum {Number}
 */
var State = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2
};

/**
 * Executes a function asynchronously. Prefers setImmediate but will fallback to
 * process.nextTick for older versions of node.
 *
 * @type {Function}
 */
var next = typeof setImmediate === 'function' ? setImmediate : procees.nextTick;

/**
 * Triggers the promise events
 *
 * @param {Promise} promise The promise to trigger
 */
var trigger = function(promise) {
  next(function() {
    if (promise.state === State.FULFILLED) {
      promise.events.emit('fulfilled', promise.value);
    }

    if (promise.state === State.REJECTED) {
      promise.events.emit('rejected', promise.value);
    }
  });
};

/**
 * Resolves a promise and triggers the promises
 *
 * @param  {Promise} promise The promise to resolve
 * @param  {State}   state   The new state of the promise
 * @param  {Object}  value   The new value of the promise
 * @return {State}           The current state of the promise
 */
var resolve = function(promise, state, value) {
  // Cannot transition from FULFILLED or REJECTED
  if (promise.state === State.FULFILLED || promise.state === State.REJECTED) {
    return promise.state;
  }

  // Must have a value for value
  if (state === State.FULFILLED && arguments.length < 3) {
    return promise.state;
  }

  // Must have a reason for rejected
  if (state === State.REJECTED && !value) {
    return promise.state;
  }

  promise.state = state;
  promise.value = value;

  trigger(promise);

  return promise.state;
};

/**
 * Handles a callback from then
 *
 * @param  {Promise}   promise The new promise
 * @param  {State}     state   The state to transition to
 * @param  {Function}  fn      The callback from then
 * @return {Function}          The event handler
 */
var handle = function(promise, state, fn) {
  return function(value) {
    if (typeof fn !== 'function') {
      return resolve(promise, state, fn);
    }

    try {
      var result = fn(value);

      if (result && typeof result.then !== 'function') {
        return promise.fulfill(result);
      }

      result.then(function(value) {
        promise.fulfill(value);
      }, function(reason) {
        promise.reject(reason);
      });
    } catch (reason) {
      promise.reject(reason);
    }

    return promise.state;
  };
};

/**
 * Promise
 * @class Promise implementing the Promises/A+ Specification
 */
var Promise = module.exports = function() {
  this.state = State.PENDING;
  this.events = new EventEmitter();
};

/**
 * A+ Then specification
 *
 * @param  {Function} onFulfilled Called when the promise succeeds
 * @param  {Function} onRejected  Called when the promise fails
 * @return {Promise}              The new promise
 */
Promise.prototype.then = function(onFulfilled, onRejected) {
  var promise = new Promise();

  this.events.on('fulfilled', handle(promise, State.FULFILLED, onFulfilled));
  this.events.on('rejected', handle(promise, State.REJECTED, onRejected));

  trigger(this);

  return promise;
};

/**
 * Fulfills the promise with a value
 *
 * @param  {Object} value
 * @return {State} The state of the promise
 */
Promise.prototype.fulfill = function(value) {
  return resolve(this, State.FULFILLED, value);
};

/**
 * Rejects the promise with a reason
 *
 * @param  {Error} reason The reason the promise failed
 * @return {State} The state of the promise
 */
Promise.prototype.reject = function(reason) {
  return resolve(this, State.REJECTED, reason);
};