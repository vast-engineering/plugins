var _ = require('lodash'),
    fs = require('fs'),
    mime = require('mime');

var Static = function() {};

Static.prototype.attach = function(options) {
    var app = options.app,
        global = options.headers || {};

    /**
     * @param options.path - the path to the file
     * @param options.res - response object for streaming
     * @param options.headers - hash containing key/val pairs for headers
     **/
    this.static = function(options, callback) {
        if (!options.path) {
            throw new Error("options.path required")
        }
        if (!options.res) {
            throw new Error("options.res required")
        }
        fs.exists(options.path, function(exists) {
            if (!exists) {
                callback(options.path + " does not exist");
            }
            else {
                var headers = _.clone(global);

                _.extend(headers, options.headers);
                _.extend(headers, {'Content-Type': mime.lookup(options.path)});

                options.res.writeHead(200, headers);
                fs.createReadStream(options.path).on('error', callback).pipe(options.res);
            }
        })
    };
};

module.exports = Static;