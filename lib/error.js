var _ = require('lodash');

var Error = function() {};

Error.prototype.attach = function (options) {

	// handle the weirdness of errors in javascript
	var formatError = function(err) {
		var msg = '';

		if (typeof(err) == 'string') {
			return err;
		}
		
		if (err && err.message) {
			msg += err.message;
		}

		if (err && err.stack) {
			msg += '\n' + err.stack;
		}

		return msg;
	};

	this.error = {
		fail: function(err, res, headers) {
			res.writeHead(500, _.extend({ 'Content-Type': 'text/plain'}, headers) );
	        res.end('Error on page\n' + formatError(err));
		},
		notfound: function(err, res, headers) {
			res.writeHead(404, _.extend({ 'Content-Type': 'text/plain'}, headers) );
	        res.end('Not Found\n' + formatError(err));
		}
	};

};


module.exports = Error;