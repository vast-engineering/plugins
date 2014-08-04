var _ = require('lodash');

var Json = function() {};

var htmlEscapingReplacer = function(key,val){
	if(typeof(val) === "string"){
		return val.replace(/&/g, '&amp;')
	    .replace(/"/g, '&quot;')
	    .replace(/'/g, '&#39;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;');
	}
	else{
		return val;
	}
}

Json.prototype.attach = function (options) {
	var jsonpEnabled = options.jsonpEnabled === true || options.jsonpEnabled === 'true' ? true : false;
	
	var replacer = null;
	if(options.escapeStrings){
		replacer = htmlEscapingReplacer;
	}
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
	this.json = function(data, res, headers, req) {
		var str = JSON.stringify(data || {},replacer);
		res.writeHead(200, _.extend({ 'Content-Type': 'application/json'}, headers) );

		if (jsonpEnabled && req && req.query) {
			var cb = req.query.callback ? req.query.callback : req.query.jsonp;

			if (cb) {
				str = cb + '(' + str + ')';
			}
		}
        res.end(str);
	};
};


module.exports = Json;