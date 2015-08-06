/**
 * index.js
 *
 * @description :: This is the test suite orchestration script, it will find all specs in the /specs directory
 * and get Mocha to run them.
 * @help        :: https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
 */

process.env.NODE_ENV = process.NODE_ENV || 'development';
process.env.NODE_CONFIG_DIR = './server/config/env';
process.env.SILENT_LOG = true;

var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

// First, you need to instantiate a Mocha instance.
var mocha = new Mocha({
    timeout: 60000
});

// Then, you need to use the method "addFile" on the mocha
// object for each file.

// Here is an example:
fs.readdirSync(__dirname + '/specs').filter(function (file) {
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(function (file) {
    // Use the method "addFile" to add the file to mocha
    mocha.addFile(
        path.join(__dirname + '/specs', file)
    );
});

// Now, you can run the tests.
mocha.run(function (failures) {
    // Exit code of either 0 / 1 : Success / Failure
    var code = 0;

    if (failures > 0) code = 1;

    process.exit(code);
});