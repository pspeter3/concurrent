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
});