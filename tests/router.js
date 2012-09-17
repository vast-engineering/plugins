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

	    router.get('/foo.js', function(req, res) {
	    	app.plugins.static.stream({
	    		content: "alert('foo');",
	    		path: req.urlParsed.pathname,
	    		res: res
	    	}, function(err) {
	    		if (err) {
	    			console.log(err);
	    			res.writeHead(200);
	    			res.end(err);
	    		}
	    	});
	    });

	    router.get(/.*/, function(req, res) {
	    	app.plugins.static.file({
		    		path: '.' + req.urlParsed.pathname, 
		    		res: res,
		    		headers: { "Cache-Control": "max-age=86400, public" }
		    	}, function(err) {
		    		if (err) {
		    			console.log(err);
		    			res.writeHead(200);
		    			res.end(err);
		    		}
		    	}
		    );
	    });

	    return router;
	};


};

module.exports = TestRouter;