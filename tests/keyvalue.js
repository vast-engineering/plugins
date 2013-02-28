var broadway = require('broadway'),
    app = new broadway.App(),
    tap = require('tap'),
    test = tap.test,
    KeyValue = require('../index').KeyValue;

var obj = {
    prop1: "foo",
    prop2: "goo",
    prop3: "poo"
};

app.use(new KeyValue(), {
    key: 'foo',
    value: obj
});

test("Test KeyValue Plugin", function(t) {
    t.deepEqual(app.foo, obj, "Insure the object was attached to the correct key");

    t.end();
});