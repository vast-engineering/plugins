var _ = require('lodash'),
    browserify = require('browserify'),
    uglify = require('uglify-js');

var Browserify = function() {};

/**
 * Browserify and uglify.
 **/
Browserify.prototype.attach = function(options) {
    var app = options.app;

    this.browserify = function(entry) {
        var b = options.compress ? browserify({filter: uglify}) : browserify();
        
        _.each(options.alias, function(to, from) {
        	b.alias(from, to);
            b.require(to);
        });

        _.each(options.ignore, function(ignore) {
            b.ignore(ignore);
        });

        b.addEntry(entry);
        return b.bundle();
    }
};

module.exports = Browserify;