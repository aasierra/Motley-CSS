var should = require('chai').should(),
    motley = require('../motley');
describe('#motley', function() {
	it('runs', function(done) {
		motley({
			fileName:'test/cssTestFile.css',
			callback:function() {
				done();
			},
			diagnostics:true
		});
    	true.should.equal(true);
  	});
});