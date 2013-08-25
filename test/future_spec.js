var expect = require('chai').expect;
var Future = require('../lib/future');

var future;
var SUCCESS = 'success';
var ERROR = 'error';

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

  it('should have ready', function() {
    expect(future).to.have.property('ready');
  });

  it('should have result', function() {
    expect(future).to.have.property('result');
  });

  it('should have value', function() {
    expect(future).to.have.property('value');
  });

  it('should have andThen', function() {
    expect(future).to.have.property('andThen');
  });

  it('should have collect', function() {
    expect(future).to.have.property('collect');
  });

  it('should have failed', function() {
    expect(future).to.have.property('failed');
  });

  it('should have fallbackTo', function() {
    expect(future).to.have.property('fallbackTo');
  });

  it('should have filter', function() {
    expect(future).to.have.property('filter');
  });

  it('should have flatMap', function() {
    expect(future).to.have.property('flatMap');
  });

  it('should have forEach', function() {
    expect(future).to.have.property('forEach');
  });

  it('should have map', function() {
    expect(future).to.have.property('map');
  });

  it('should have mapTo', function() {
    expect(future).to.have.property('mapTo');
  });

  it('should have onFailure', function() {
    expect(future).to.have.property('onFailure');
  });

  it('should have onSuccess', function() {
    expect(future).to.have.property('onSuccess');
  });

  it('should have recover', function() {
    expect(future).to.have.property('recover');
  });

  it('should have recoverWith', function() {
    expect(future).to.have.property('recoverWith');
  });

  it('should have transform', function() {
    expect(future).to.have.property('transform');
  });

  it('should have withFilter', function() {
    expect(future).to.have.property('withFilter');
  });

  describe('#zip', function() {
    it('should have zip', function() {
      expect(future).to.have.property('zip');
    });

    it('should combine two futures into a tuple', function(done) {
      var other = new Future();
      var zipped = future.zip(other);

      zipped.then(function(tuple) {
        expect(tuple).to.eql([SUCCESS, ERROR]);
        done();
      });

      future.fulfill(SUCCESS);
      other.fulfill(ERROR);
    });
  });
});