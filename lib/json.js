var _ = require('lodash');
var Json = function() {};

Json.prototype.attach = function (options) {

	/**
	* Takes the given model and generated the main object that will be passed to the rendering engine.
	* This will include the utils, underscore, siteConfig, and other basic rendering constructs.
	**/
	/**
	* Takes the given model and generated the main object that will be passed to the rendering engine.
	* This will include the utils, underscore, siteConfig, and other basic rendering constructs.
	* @param res {HttpServerResponse} the res to write the output.
	* @param data {Object} Data to pass to the rendering view
	* @param data {Object} Keys/values for headers (This action will set the Content_Type: 'application/json' automatically)
	**/
	this.json = function(data, res, headers) {
		res.writeHead(200, _.extend({ 'Content-Type': 'application/json'}, headers) );
        res.end( JSON.stringify(data || {}) );
	};


};


module.exports = Json;