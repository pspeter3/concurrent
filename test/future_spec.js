var expect = require('chai').expect;
var Future = require('../lib/future');

var future;
describe('Future API', function() {
  beforeEach(function() {
    future = new Future();
  });

  it('should have isComplete', function() {
    expect(future).to.have.property('isCompleted');
    expect(future.isCompleted()).to.be.false;
    future.fulfill('success');
    expect(future.isCompleted()).to.be.true;
  });

  it('should have onComplete', function() {
    expect(future).to.have.property('onComplete');
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
    expect(future).to.have.property('onComplete');
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

  it('should have zip', function(done) {
    expect(future).to.have.property('zip');
    var other = new Future();
    var zipped = future.zip(other);
    
    zipped.then(function(tuple) {
      expect(tuple).to.eql(['a', 'b']);
      done();
    });

    future.fulfill('a');
    other.fulfill('b');
  });
});
