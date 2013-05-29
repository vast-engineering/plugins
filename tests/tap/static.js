var broadway = require('broadway');
var tap = require('tap');
var test = tap.test;
var Static = require('../../index').Static;
var MockResponse = require('hammock').Response;
var filepath = require.resolve('./test.js');

console.log(filepath);

test('Serve Static file - default settings', function(t) {
  var app = { plugins: new broadway.App() };
  var res = new MockResponse();

  app.plugins.use(new Static(), {
    app: app
  });

  app.plugins.static.file({ path: filepath, res: res }, function(err) {

    console.log(err);

    t.notOk(err, 'Should not be an error');
    t.equal(res.getHeader('Content-Type'), 'application/javascript', 'Content-Type should be application/javascript');
    t.ok(res.getHeader('ETag'), 'ETag should exist for content');
    t.end();
  });
});

test('Serve Static file - custom headers', function(t) {
  var app = { plugins: new broadway.App() };
  var res = new MockResponse();
  var goldHeaders = { "Cache-Control": "max-age=29030400, public", "foo": Math.random() };

  app.plugins.use(new Static(), {
    app: app,
    headers: goldHeaders
  });

  app.plugins.static.file({ path: filepath, res: res }, function(err) {

    t.notOk(err, 'Should not be an error');
    t.equal(res.getHeader('Content-Type'), 'application/javascript', 'Content-Type should be application/javascript');
    t.ok(res.getHeader('ETag'), 'ETag should exist for content');
    t.equal(res.getHeader('Cache-Control'), goldHeaders['Cache-Control'], 'Cache-Control header should match original');
    t.equal(res.getHeader('foo'), goldHeaders.foo, 'Random header should match original');
    t.end();
  });
});

test('Serve Static file - no etag', function(t) {
  var app = { plugins: new broadway.App() };
  var res = new MockResponse();

  app.plugins.use(new Static(), {
    app: app,
    etag: false
  });

  app.plugins.static.file({ path: filepath, res: res }, function(err) {

    t.notOk(err, 'Should not be an error');
    t.equal(res.getHeader('Content-Type'), 'application/javascript', 'Content-Type should be application/javascript');
    t.notOk(res.getHeader('ETag'), 'ETag should not exist for content');
    t.end();
  });
});