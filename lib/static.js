var fs = require('fs');

var Static = function() {};

Static.prototype.attach = function(options) {
    var app = options.app;

    /**
     * @param options.path
     **/
    this.static = function(path, callback) {
        fs.readFile(path, 'UTF-8', callback);
    };
};

module.exports = Static;