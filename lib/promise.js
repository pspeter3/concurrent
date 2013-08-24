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
 * Resolves the promises asynchronously
 * 
 * @param {Promise} promise The promise to resolve
 */
var resolve = function(promise) {
  next(function() {
    if (promise.callbacks[promise.state]) {
      promise.callbacks[promise.state].forEach(function(callback) {
        callback(promise.value);
      });
      promise.callbacks[promise.state] = [];
    }
  });
};

/**
 * Transitions a promise from one state to another
 * 
 * @param  {Promise} promise The promise to transition
 * @param  {State}   state   The new state of the promise
 * @param  {Object}  value   The value or reason of the promise
 * @return {State}           The state of the promise
 */
var transition = function(promise, state, value) {
  if (promise.state === State.FULFILLED || promise.state === State.REJECTED) {
    return promise.state;
  }

  promise.state = state;
  promise.value = value;

  resolve(promise);

  return promise.state;
};

/**
 * Handles the promise chain and returns a new promise
 * 
 * @param  {Promise}   promise The promise to initialize
 * @param  {State}     state   The state for the promise to transition to
 * @param  {Function}  fn      The callback from then
 * @return {Function}          The callback to be registered
 */
var handle = function(promise, state, fn) {
  return function(value) {
    if (typeof fn !== 'function') {
      return transition(promise, state, fn);
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
  this.callbacks = {};
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
  var callbacks = {};

  callbacks[State.FULFILLED] = onFulfilled;
  callbacks[State.REJECTED] = onRejected;

  for (state in callbacks) {
    this.callbacks[state] = this.callbacks[state] || [];
    this.callbacks[state].push(handle(promise, state, callbacks[state]));
  }

  return promise;
};

/**
 * Fulfills the promise with a value
 *
 * @param  {Object} value
 * @return {State} The state of the promise
 */
Promise.prototype.fulfill = function(value) {
  transition(this, State.FULFILLED, value);
};

/**
 * Rejects the promise with a reason
 *
 * @param  {Error} reason The reason the promise failed
 * @return {State} The state of the promise
 */
Promise.prototype.reject = function(reason) {
  transition(this, State.REJECTED, reason);
};
