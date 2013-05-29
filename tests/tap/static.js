var broadway = require('broadway');
var tap = require('tap');
var test = tap.test;
var Static = require('../../index').Static;
var MockResponse = require('hammock').Response;
var filepath = require.resolve('./test.js');
var async = require('async');

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

test('Stream Static file - no etag', function(t) {
  var app = { plugins: new broadway.App() };
  var res = new MockResponse();

  app.plugins.use(new Static(), {
    app: app,
    etag: false
  });

  app.plugins.static.stream({ path: filepath, res: res, content: 'var foo = "bar";' }, function(err) {

    t.notOk(err, 'Should not be an error');
    t.equal(res.getHeader('Content-Type'), 'application/javascript', 'Content-Type should be application/javascript');
    t.notOk(res.getHeader('ETag'), 'ETag should not exist for content');
    t.end();
  });
});

test('Stream Static file - with etag', function(t) {
  var app = { plugins: new broadway.App() };
  var res1 = new MockResponse();
  var res2 = new MockResponse();
  var queue = [
    function(cb) {
      app.plugins.static.stream({ path: filepath, res: res1, content: 'var foo = "bar";' }, cb);
    },
    function(cb) {
      app.plugins.static.stream({ path: filepath, res: res2, content: 'var foo = "bar";' }, cb);
    }    
  ];

  app.plugins.use(new Static(), {
    app: app
  });

  async.parallel(queue, function(err, results) {
    t.notOk(err, 'Should not be an error');
    t.equal(res1.getHeader('Content-Type'), 'application/javascript', 'Content-Type should be application/javascript (res1)');
    t.equal(res2.getHeader('Content-Type'), 'application/javascript', 'Content-Type should be application/javascript (res2)');
    t.ok(res1.getHeader('ETag'), 'ETag should exist for content (res1)');
    t.ok(res2.getHeader('ETag'), 'ETag should exist for content (res2)')
    t.equal(res1.getHeader('ETag'), res2.getHeader('Etag'), 'ETag should match for res1 & res2');
    t.end();
  });

});