var chai = require('chai');
var collections = require('../lib/collections');

var expect = chai.expect;

describe('collections', function() {
  describe('#forEach', function() {
    it('should have forEach', function() {
      expect(collections).to.have.property('forEach');
    });
  });

  describe('#every', function() {
    it('should have every', function() {
      expect(collections).to.have.property('every');
    });
  });

  describe('#some', function() {
    it('should have some', function() {
      expect(collections).to.have.property('some');
    });

    it('should return true if any match', function(done) {
      var some = collections.some([1, 2], function(num) {
        return num === 1;
      });

      some.then(function(value) {
        expect(value).to.be.true;
        done();
      });
    });

    it('should return false if none match', function(done) {
      var some = collections.some([1, 2], function(num) {
        return num === 0;
      });

      some.then(function(value) {
        expect(value).to.be.false;
        done();
      });
    });
  });

  describe('#filter', function() {
    it('should have filter', function() {
      expect(collections).to.have.property('filter');
    });
  });

  describe('#map', function() {
    it('should have map', function() {
      expect(collections).to.have.property('map');
    });
  });

  describe('#reduce', function() {
    it('should have reduce', function() {
      expect(collections).to.have.property('reduce');
    });
  });

    describe('#reduceRight', function() {
    it('should have reduceRight', function() {
      expect(collections).to.have.property('reduceRight');
    });
  });
});
