var KeyValue = function() {};

/** 
* This is really simple.  It attaches an object to the app with a given key
**/
KeyValue.prototype.attach = function (options) {
    var key = options.key,
        value = options.value;

    this[key] = value;
};


module.exports = KeyValue;