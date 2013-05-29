var _ = require('lodash');
var fs = require('fs');
var mime = require('mime');
var crypto = require('crypto');

var Static = function() {};

Static.prototype.attach = function(options) {
  _.defaults(options, {
    headers: {},
    etag: true
  });

  var app = options.app;
  var global = options.headers;
  var etag = options.etag;
  var hashProvider = etag ? crypto.createHash('md5') : false;

  /**
   * @param options.path - the path to the file
   * @param options.res - response object for streaming
   * @param options.headers - hash containing key/val pairs for headers
   **/
  this.static = {
    file: function(opt, callback) {
      debugger;
      opt = opt || {};

      var res = opt.res;
      var path = opt.path;
      var optHeaders = opt.headers;

      if (!path) {
        callback(new Error("options.path required"));
        return;
      }
      if (!res) {
        callback(new Error("options.res required"));
        return;
      }

      fs.readFile(path, function(err, content) {
        if (err) {
          callback(err);
          return;
        }

        var headers = _.clone(global);

        _.extend(headers, optHeaders);
        _.extend(headers, {'Content-Type': mime.lookup(path)});

        if (etag) {
          headers.ETag = hashProvider.update(content).digest('hex');
        }

        res.on('close', callback).on('error', callback);
        res.writeHead(200, headers);
        res.end(content);
      });

    },

    stream: function(options) {
      if (!options.path) {
        throw new Error("options.path required to lookup the mime type");
      }
      if (!options.res) {
        throw new Error("options.res required");
      }
      var headers = _.clone(global);

      _.extend(headers, options.headers);
      _.extend(headers, {'Content-Type': mime.lookup(options.path)});

      options.res.writeHead(200, headers);
      options.res.end(options.content);
    }
  };
};

module.exports = Static;