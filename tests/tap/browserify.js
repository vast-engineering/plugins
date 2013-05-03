var broadway = require('broadway'),
    app = { plugins: new broadway.App() },
    tap = require('tap'),
    test = tap.test,
    Browserify = require('../../index').Browserify;

app.plugins.use(new Browserify(), {
    app: app,
    compress: true
});


test('Browserify script', function(t) {

    var output = app.plugins.browserify(require.resolve('./test.js'));

    console.log(output);
    t.ok(output, 'Script should exist');

    t.end();
});