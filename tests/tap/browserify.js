var broadway = require('broadway'),
    tap = require('tap'),
    test = tap.test,
    Browserify = require('../../index').Browserify;

test('Browserify script compressed', function(t) {
    var app = { plugins: new broadway.App() };

    app.plugins.use(new Browserify(), {
        app: app,
        compress: true
    });

    app.plugins.browserify(require.resolve('./test.js'), function(err, output) {

        //console.log(output);
        t.notOk(err, 'Should not be an error');
        t.ok(output, 'Script should exist');
        t.ok(/http:\/\/www.vast.com\/cars/.test(output), 'Output should contain static string from source script.');
        t.notOk(/\s{2}/.test(output), 'Output should be compressed (e.g. never more than 1 whitespace side by side).');
        t.notOk(/\/\*\* THIS IS A COMMENT FOR TESTING \*\*\//.test(output), 'Output should not have comments');
        t.end();
    });
});



test('Browserify script uncompressed', function(t) {
    var app = { plugins: new broadway.App() };

    app.plugins.use(new Browserify(), {
        app: app,
        compress: false
    });

    app.plugins.browserify(require.resolve('./test.js'), function(err, output) {
        
        //console.log(output);
        t.notOk(err, 'Should not be an error');
        t.ok(output, 'Script should exist');
        t.ok(/http:\/\/www.vast.com\/cars/.test(output), 'Output should contain static string from source script.');
        t.ok(/\s{2}/.test(output), 'Output should be not compressed (e.g. more than 1 whitespace side by side).');
        t.ok(/\/\*\* THIS IS A COMMENT FOR TESTING \*\*\//.test(output), 'Output should have comments');
        t.end();
    });
});

test('Browserify script with ignore with .js suffix', function(t) {
    var app = { plugins: new broadway.App() };

    app.plugins.use(new Browserify(), {
        app: app,
        compress: false,
        ignore: ['exclude.js']
    });

    app.plugins.browserify(require.resolve('./test.js'), function(err, output) {
        
        //console.log(output);
        t.notOk(err, 'Should not be an error');
        t.notOk(/excluded module/.test(output), 'Should not contain the body of the excluded module.');
        t.end();
    });
});

test('Browserify script with ignore without .js suffix', function(t) {
    var app = { plugins: new broadway.App() };

    app.plugins.use(new Browserify(), {
        app: app,
        compress: false,
        ignore: ['exclude']
    });

    app.plugins.browserify(require.resolve('./test.js'), function(err, output) {
        
        //console.log(output);
        t.notOk(err, 'Should not be an error');
        t.notOk(/excluded module/.test(output), 'Should not contain the body of the excluded module.');
        t.end();
    });
});