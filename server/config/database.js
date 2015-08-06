/**
 * database.js
 * @description :: Initiate connections to the database - Could be extended to take advantage of mongo replica sets etc
 * @type {Config|exports|module.exports}
 */

var config = require('config');
var logger = config.get('logger');

var mongoose = require('mongoose');

mongoose.connect(config.get('dbURI'));

mongoose.connection.on('error', function (err) {
    logger.error('database connection error', arguments);
});

mongoose.connection.on('open', function () {
    logger.log('Connected to the database');
});