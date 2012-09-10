var fs = require('fs'),
    mime = require('mime');

var Static = function() {};

Static.prototype.attach = function(options) {
    var app = options.app;

    /**
     * @param options.path
     * @param options.response
     **/
    this.static = function(path, response, callback) {
        if (!path) {
            throw new Error("options.path required")
        }
        if (!response) {
            throw new Error("options.response required")
        }
        fs.exists(path, function(exists) {
            if (!exists) {
                callback(path + " does not exist");
            }
            else {
                response.writeHead(200, {'Content-Type': mime.lookup(path)})
                fs.createReadStream(path).on('error', callback).pipe(response);
            }
        })
    };
};

module.exports = Static;