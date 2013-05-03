var _ = require('lodash'),
    browserify = require('browserify'),
    stream = require('stream'),
    through = require('through'),
    UglifyJS = require('uglify-js');

var Browserify = function() {};

/**
 * Browserify and uglify.  
 **/
Browserify.prototype.attach = function(options) {
    var app = options.app;

    this.browserify = function(entry, callback) {

        if (!_.isFunction(callback)) {
            throw new Error('Callback was not specified.  Are you expecting an old version?');
            return;
        }

        var b = browserify();

        _.each(options.ignore, function(ignore) {
            b.ignore(ignore);
        });

        b.add(entry);

        // b.transform(function (file) {
        //     console.log('ARGS: ' + require('util').inspect(arguments));

        //     var ignore = _.find(options.ignore, function(str) { 
        //         var rx = new RegExp(str + '$');
        //         return rx.test(file);
        //     });

        //     console.log('file: ' + file + ', ignore: ' + ignore != null);

        //     return through(write, end);

        //     function write (buf) { 
        //         if (!ignore) {
        //             this.queue(buf);
        //         }
        //     }
        //     function end () {
        //         this.queue(null);
        //     }
        // });
        
        b.bundle(function(err, bundleScript) {
            if (!err && options.compress) {
                try {
                    bundleScript = UglifyJS.minify(bundleScript, { fromString: true }).code;
                }
                catch (e) {
                    err = e;
                }
            }
            callback(err, bundleScript);
        });
    }
};

module.exports = Browserify;