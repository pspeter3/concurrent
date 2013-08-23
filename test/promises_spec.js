var Promise = require('../lib/promise');
var aplus = require('promises-aplus-tests');

describe('Promises/A+ tests', function() {
  aplus.mocha(Promise);
});
