/** THIS IS A COMMENT FOR TESTING **/
var url = require('url'),
    excludedModule = require('./exclude.js'),
    uri = 'http://www.vast.com/cars',
    mime = require('mime');

console.log(url.parse(uri));