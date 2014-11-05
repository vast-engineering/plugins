var _ = require('lodash');

var htmlEscapingReplacer = function(key,val) {
  if (typeof val === "string") {
    return val.replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  
  return val;
};

var stringIsOnlyAlphanumericsAndUnderscores = function(str) {
  var callbackRestrictionRegex = /^[a-zA-Z0-9_]+$/;
  return callbackRestrictionRegex.test(str);
};

var isTrue = function(val) {
  return _.contains([true, 'true'], val);
};

var Json = function(namespace) {
  namespace = namespace || 'json';

  this.attach = function(options) {
    var jsonpEnabled = isTrue(options.jsonpEnabled);
    var replacer = isTrue(options.escapeStrings) ? htmlEscapingReplacer : null;

    /**
     * Takes the given model and generated the main object that will be passed to the rendering engine.
     * This will include the utils, underscore, siteConfig, and other basic rendering constructs.
     * @param res {HttpServerResponse} the res to write the output.
     * @param data {Object} Data to pass to the rendering view
     * @param data {Object} Keys/values for headers (This action will set the Content_Type: 'application/json' automatically)
     */
    this[namespace] = function(data, res, headers, req) {
      var str = JSON.stringify(data || {}, replacer);

      if (jsonpEnabled && req && req.query) {
        var jsonpCallback = req.query.callback ? req.query.callback : req.query.jsonp;

        if (jsonpCallback === undefined) {
          res.writeHead(200, _.extend({ 'Content-Type': 'application/json' }, headers));
          res.end(str);
        }
        else if (stringIsOnlyAlphanumericsAndUnderscores(jsonpCallback)) {
          //prepended comment for rosetta flash protection
          //see https://miki.it/blog/2014/7/8/abusing-jsonp-with-rosetta-flash/
          str = '/**/' + jsonpCallback + '('+str+')';
          res.writeHead(200, _.extend({ 'Content-Type': 'application/json' }, headers));
          res.end(str);
        }
        else {
          //plain text is used to match regular error pattern
          res.writeHead(400, { 'Content-Type':'text/plain' });
          res.end("invalid JSONP callback");
        }
      }
      else {
        res.writeHead(200, _.extend({ 'Content-Type': 'application/json' }, headers));
        res.end(str);
      }
    };
  }
};

module.exports = Json;