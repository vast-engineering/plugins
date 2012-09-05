var _ = require('lodash');

var Error = function() {};

Error.prototype.attach = function (options) {

	this.error = {
		fail: function(err, res, headers) {
			res.writeHead(500, _.extend({ 'Content-Type': 'text/plain'}, headers) );
	        res.end('Error on page\n' + err);
		},
		notfound: function(err, res, headers) {
			res.writeHead(404, _.extend({ 'Content-Type': 'text/plain'}, headers) );
	        res.end('Not Found\n' + err);
		}
	};

};


module.exports = Error;