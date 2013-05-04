/** THIS IS A COMMENT FOR TESTING **/
var url = require('url'),
    excludedModule = require('./exclude.js'),
    uri = 'http://www.vast.com/cars';

console.log(url.parse(uri));