var request = require('request');

var Proxy = function() {};

Proxy.prototype.attach = function () {

	this.proxy = function (options, callback) {
		var req = {
			method: 'GET',
			uri: options.uri
		};

		request(req, function(err, response) {
			callback(err);				
		}).pipe( options.stream );

		return req;
	};

};

module.exports = Proxy;