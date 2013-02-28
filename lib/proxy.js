var http = require('http');

var Proxy = function() {};

Proxy.prototype.attach = function () {

	this.proxy = function (options, callback) {
		var req = http.get(options.uri, function(res) {			

			if (res.statusCode == 200) {
				res.pipe( options.stream );
			}
			else {
				callback("mixdown-plugins#Proxy Fail", '');
			}

			res.on('end', function() {	
				callback(null);
			})

			.on('error', function(err) {
				callback(err);
			});
		})

		

		return req;
	};

};

module.exports = Proxy;