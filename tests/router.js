var Router = require('pipeline-router'),
	url = require('url');

var TestRouter = function() {};

/**
* Attaches an autos router plugin to an application.
*
**/ 
TestRouter.prototype.attach = function (options) {
	var app = options.app;

	/**
	* Initializes the routes for this application
	*
	**/
	this.router = function() {
	    var router = new Router(),
	    	proxyurl = 'https://npmjs.org/doc/faq.html';

	    router.param('route', /.*$/);

	    router.get('/faq/:route', function (req, res) {
	        app.plugins.proxy({
	        	uri: url.parse(proxyurl + '#' + req.params.route),
	        	stream: res
	        });
	    });

	    router.get('/json', function (req, res) {
	    	var obj = {
	    		stuff: "rules",
	    		things: "are pretty cool"
	    	};
	    	app.plugins.json(obj, res);
	    });

	    router.get('/error', function(req, res) {
	    	app.plugins.error.fail(new Error("There was an error bro."), res);
	    });

	    return router;
	};


};

module.exports = TestRouter;