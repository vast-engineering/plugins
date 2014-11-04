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

var stringIsOnlyAlphanumericsAndUnderscores = function(str){
	var callbackRestrictionRegex = /^[a-zA-Z0-9_]+$/
	return callbackRestrictionRegex.test(str);
}

Json.prototype.attach = function (options) {
	var jsonpEnabled = options.jsonpEnabled === true || options.jsonpEnabled === 'true' ? true : false;
	var that = this;
	var replacer = null;

	if(options.escapeStrings){
		replacer = htmlEscapingReplacer;
	}
	/**
	* Takes the given model and generated the main object that will be passed to the rendering engine.
	* This will include the utils, underscore, siteConfig, and other basic rendering constructs.
	* @param data {Object} Data to pass to the rendering view
	* @param res {HttpServerResponse} the res to write the output.
	* @param headers {Object} Keys/values for headers (This action will set the Content_Type: 'application/json' automatically)
	**/
	this.json = function(data, res, headers, req) {
		var str = JSON.stringify(data || {}, replacer);

		if(jsonpEnabled && req && req.query) {
			var jsonpCallback = req.query.callback ? req.query.callback : req.query.jsonp;

			if(jsonpCallback === undefined) {
				res.writeHead(200, _.extend({ 'Content-Type': 'application/json'}, headers));
				res.end(str);
			}
			else if(stringIsOnlyAlphanumericsAndUnderscores(jsonpCallback)){
				//prepended comment for rosetta flash protection
				//see https://miki.it/blog/2014/7/8/abusing-jsonp-with-rosetta-flash/
				str = '/**/' + jsonpCallback + '('+str+')';
				res.writeHead(200, _.extend({ 'Content-Type': 'application/json'}, headers));
				res.end(str);
			}
			else{
				//plain text is used to match regular error pattern
				res.writeHead(400,{'Content-Type':'text/plain'});
				res.end("invalid JSONP callback");
			}
		}
		else{
			res.writeHead(200, _.extend({ 'Content-Type': 'application/json'}, headers));
			res.end(str);
		}
	};

	/**
	 * Writes JSON data without escaping, ignores options.escapeStrings.
	 * See json method for available parameters.
	 * @return {undefined}
	 */
	this.json.noEscape = function() {
		var storedReplacer = replacer;
		replacer = null;
		that.json.apply(that, arguments);
		replacer = storedReplacer;
	};
};


module.exports = Json;