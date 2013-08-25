var collections = require('../lib/collections');

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
