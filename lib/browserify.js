var browserify = require('browserify'),
    uglify = require('uglify-js');

var Browserify = function() {};

/**
 * Browserify and uglify.
 **/
Browserify.prototype.attach = function(options) {
    var app = options.app;

    this.browserify = function(entry) {
        var b = options.compress ? browserify({filter: uglify}) : browserify();
        b.addEntry(entry);
        return b.bundle();
    }
};

module.exports = Browserify;