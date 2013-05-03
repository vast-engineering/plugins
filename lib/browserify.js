var _ = require('lodash'),
    browserify = require('browserify'),
    UglifyJS = require('uglify-js');

var Browserify = function() {};

/**
 * Browserify and uglify.
 **/
Browserify.prototype.attach = function(options) {
    var app = options.app;

    this.browserify = function(entry) {
        var b = browserify();
        
        _.each(options.alias, function(to, from) {
        	b.alias(from, to);
            b.require(to);
        });

        _.each(options.ignore, function(ignore) {
            b.ignore(ignore);
        });

        b.addEntry(entry);
        
        var bundleScript = b.bundle();

        if (options.compress) {
            bundleScript = UglifyJS.minify(bundleScript, { fromString: true }).code;
        }

        return bundleScript;
    }
};

module.exports = Browserify;