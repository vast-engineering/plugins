var broadway = require('broadway'),
	app = new broadway.App(),
	tap = require('tap'),
	test = tap.test;

app.use(new Proxy(), {});

test("Test Proxy", function(t) {
	// TODO: write this test.
});