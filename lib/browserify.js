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
        // ignoreList = _.map(options.ignore, function(str) { 
        //     return new RegExp(str.replace('.js', '') + '(\.js)?$');
        // });

    this.browserify = function(entry, callback) {

        if (!_.isFunction(callback)) {
            throw new Error('Callback was not specified.  Are you expecting an old version?');
            return;
        }

        var b = browserify();
        b.add(entry);

        _.each(options.ignore, function(ig) {
            b.require(__dirname + '/../_empty.js', { expose: ig });
        });

        _.each(options.alias, function(source, dest) {
            b.require(source, { expose: dest });
        });

        // b.transform(function(file) {

        //     var buffer = [],
        //         ignore = _.find(ignoreList, function(rx) { 
        //             // console.log(rx.toString());
        //             return rx.test(file);
        //         });

        //     console.log('file: ' + file + ', ignore: ' + (ignore != null));

        //     console.trace();

        //     if (!ignore) {
        //         return through();
        //     }

        //     return through(
        //         function(chunk) { 
        //             if (!ignore) {
        //                 buffer.push(chunk);
        //             }
        //         }, 
        //         function() {
        //             this.queue(buffer.join(''));
        //             this.queue(null);
        //         }
        //     );
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