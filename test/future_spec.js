var chai = require('chai');
var Future = require('../lib/future');
var spies = require('chai-spies');

chai.use(spies);
var expect = chai.expect;

var future;

var SUCCESS = 'success';
var ERROR = 'error';

var LEFT = 'left';
var RIGHT = 'right';

var ZERO = 0;
var ONE = 1;

describe('Future API', function() {
  beforeEach(function() {
    future = new Future();
  });

  describe('#isCompleted', function() {
    it('should have isCompleted', function() {
      expect(future).to.have.property('isCompleted');
    });

    it('should work as expected', function() {
      expect(future.isCompleted()).to.be.false;
      future.fulfill(SUCCESS);
      expect(future.isCompleted()).to.be.true;
    });
  })

  describe('#onComplete', function() {
    it('should have onComplete', function() {
      expect(future).to.have.property('onComplete');
    });

    it('should call on success', function(done) {
      future.onComplete(function(value) {
        expect(value).to.eql(SUCCESS);
        done();
      });
      future.fulfill(SUCCESS);
    });

    it('should call on error', function(done) {
      future.onComplete(function(value) {
        expect(value).to.eql(ERROR);
        done();
      });
      future.reject(ERROR);
    });
  });

  describe('#ready', function() {
    it('should have ready', function() {
      expect(future).to.have.property('ready');
    });

    it('should be called with value if it succeeds on time', function(done) {
      var readied = future.ready(1000);

      readied.then(function(value) {
        expect(value).to.eql(SUCCESS);
        done();
      });

      future.fulfill(SUCCESS);
    });

    it('should be called with error if it does not succeed', function(done) {
      var readied = future.ready(10);
      var spy = chai.spy(function() {});

      readied.then(null, spy);
      readied.then(null, function() {
        expect(spy).to.have.been.called;
        done();
      });
    });
  });

  describe('#value', function() {
    it('should not have value before being fulfilled', function() {
      expect(future).to.not.have.property('value');
    });

    it('should have value', function() {
      future.fulfill(SUCCESS);
      expect(future).to.have.property('value');
    });
  });

  it('should have failed', function() {
    expect(future).to.have.property('failed');
  });

  describe('#fallbackTo', function() {
    it('should have fallbackTo', function() {
      expect(future).to.have.property('fallbackTo');
    });

    it('should return the value of left if left succeeds', function(done) {
      var other = new Future();
      var fallen = future.fallbackTo(other);

      fallen.then(function(value) {
        expect(value).to.eql(LEFT);
        done();
      });

      future.fulfill(LEFT);
      other.reject(ERROR);
    });

    it('should return the value of left if left succeeds even if right succeeds', function(done) {
      var other = new Future();
      var fallen = future.fallbackTo(other);

      fallen.then(function(value) {
        expect(value).to.eql(LEFT);
        done();
      });

      future.fulfill(LEFT);
      other.fulfill(RIGHT);
    });

    it('should return the value of right if left fails', function(done) {
      var other = new Future();
      var fallen = future.fallbackTo(other);

      fallen.then(function(value) {
        expect(value).to.eql(RIGHT);
        done();
      });

      future.reject(ERROR);
      other.fulfill(RIGHT);
    });

    it('should not be called if both fail', function(done) {
      var other = new Future();
      var fallen = future.fallbackTo(other);
      var spy = chai.spy(function() {});

      fallen.then(spy);

      future.then(null, function() {
        expect(spy).to.have.been.not_called;
        done();
      });

      future.reject(ERROR);
      other.reject(ERROR);
    });
  });

  describe('#filter', function() {
    it('should have filter', function() {
      expect(future).to.have.property('filter');
    });

    it('should be called if the predicate is true', function(done) {
      var filtered = future.filter(function(value) {
        return value === SUCCESS;
      });

      filtered.then(function(value) {
        expect(value).to.eql(SUCCESS);
        done();
      });

      future.fulfill(SUCCESS);
    });

    it('should be rejected if the value is not true', function(done) {
      var filtered = future.filter(function(value) {
        return value !== SUCCESS;
      });
      var spy = chai.spy(function() {});

      filtered.then(null, spy);
      filtered.then(null, function() {
        expect(spy).to.have.been.called;
        done();
      });

      future.fulfill(SUCCESS);
    });

    it('should be rejected if the parent future is', function(done) {
      var filtered = future.filter(function(value) {
        return value === SUCCESS;
      });

      filtered.then(null, function(reason) {
        expect(reason).to.eql(ERROR);
        done();
      });

      future.reject(ERROR);
    });
  });

  describe('#map', function() {
    it('should have map', function() {
      expect(future).to.have.property('map');
    });

    it('should work on success', function(done) {
      var mapped = future.map(function(value) {
        return value + 1;
      });

      mapped.then(function(value) {
        expect(value).to.eql(ONE);
        done();
      });

      future.fulfill(ZERO);
    });

    it('should not be called on error', function(done) {
      var spy = chai.spy(function() {});
      var mapped = future.map(spy);

      future.then(null, function() {
        expect(spy).to.have.been.not_called;
        done();
      });

      future.reject(ERROR);
    });
  });

  describe('#onFailure', function() {
    it('should have onFailure', function() {
      expect(future).to.have.property('onFailure');
    });

    it('should be called on reject', function(done) {
      future.onFailure(function(reason) {
        expect(reason).to.eql(ERROR);
        done();
      });

      future.reject(ERROR);
    });

    it('should not be called on success', function(done) {
      var spy = chai.spy(function() {});

      future.onFailure(spy);

      future.then(function() {
        expect(spy).to.have.been.not_called;
        done();
      });

      future.fulfill(SUCCESS);
    });
  });

  describe('#onSuccess', function() {
    it('should have onSuccess', function() {
      expect(future).to.have.property('onSuccess');
    });

    it('should be called on success', function(done) {
      future.onSuccess(function(value) {
        expect(value).to.eql(SUCCESS);
        done();
      });

      future.fulfill(SUCCESS);
    });

    it('should not be called on error', function(done) {
      var spy = chai.spy(function() {});

      future.onSuccess(spy);

      future.then(null, function() {
        expect(spy).to.have.been.not_called;
        done();
      });

      future.reject(ERROR);
    });
  });

  it('should have recover', function() {
    expect(future).to.have.property('recover');
  });

  it('should have recoverWith', function() {
    expect(future).to.have.property('recoverWith');
  });

  describe('#transform', function() {
    it('should have transform', function() {
      expect(future).to.have.property('transform');
    });

    it('should be called on success', function(done) {
      var spy = chai.spy(function() {});

      var transformed = future.then(function(value) {
        expect(value).to.eql(SUCCESS);
        expect(spy).to.have.been.not_called;
        done();
      }, spy);

      future.fulfill(SUCCESS);
    });

    it('should be called on failure', function(done) {
      var spy = chai.spy(function() {});

      var transformed = future.then(spy, function(reason) {
        expect(reason).to.eql(ERROR);
        expect(spy).to.have.been.not_called;
        done();
      });

      future.reject(ERROR);
    });
  });

  describe('#zip', function() {
    it('should have zip', function() {
      expect(future).to.have.property('zip');
    });

    it('should combine two futures into a tuple', function(done) {
      var other = new Future();
      var zipped = future.zip(other);

      zipped.then(function(tuple) {
        expect(tuple).to.eql([LEFT, RIGHT]);
        done();
      });

      future.fulfill(LEFT);
      other.fulfill(RIGHT);
    });

    it('should not be called if the left future fails', function(done) {
      var other = new Future();
      var zipped = future.zip(other);
      var spy = chai.spy(function() {});

      zipped.then(spy);

      future.then(null, function() {
        expect(spy).to.have.been.not_called;
        done();
      });

      future.reject(ERROR);
      other.fulfill(SUCCESS);
    });

    it('should not be called if the right future fails', function(done) {
      var other = new Future();
      var zipped = future.zip(other);
      var spy = chai.spy(function() {});

      zipped.then(spy);

      other.then(null, function() {
        expect(spy).to.have.been.not_called;
        done();
      });

      future.fulfill(SUCCESS);
      other.reject(ERROR);
    });
  });
});