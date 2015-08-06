/**
 * app.js
 *
 * @description :: Configure express application
 * @help        :: http://expressjs.com
 */

'use strict';

/**
 * Get Config
 */

var config = require('config');
var logger = config.get('logger');

/**
 * Import core libraries
 */

var express = require('express');
var bodyParser = require('body-parser');
var authParser = require('express-auth-parser');
var onHeaders = require('on-headers');
var compress = require('compression');
var uuid = require('node-uuid');
var mongoose = require('mongoose');

/**
 * Open connections to the database
 */

require('./config/database');


/**
 * Initiate express
 */

var app = express();

// Load and configure router
var routes = require('./config/routes');

// Capture request start time
app.use(function (req, res, next) {
    req.start = Date.now();
    next();
});

// Compress incoming request
app.use(compress());

// Parse incoming request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(authParser);

// Disable powered by express header
app.set('x-powered-by', false);

// Generate UUID for request
app.use(function (req, res, next) {
    req.id = uuid.v4();
    res.set('X-Request-Id', req.id);
    next();
});

// Log Request
app.use(function (req, res, next) {
    // Listen for response event and log
    onHeaders(res, function () {
        logger.info({
            _id: req.id,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            time: (Date.now() - req.start),
            'res-length': res._headers['content-length'] || 0,
            'req-length': req.headers['content-length'] || 0
        });
    });

    next();
});

app.use(express.static('client/public'));

// Check database connection
app.use(function (req, res, next) {
    if (mongoose.connection.readyState) return next();

    next({
        status: 503,
        message: 'Unable to connect to the database.'
    })
});

app.use('/', routes);

// Allow for page refresh with angular
app.use(function (req, res, next) {
    if (req.method === 'GET') {
        return res.redirect('/#' + req.originalUrl);
    }

    next();
});

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    next({status: 404, message: 'Not found.'});
});

// error handlers
app.use(function (err, req, res, next) {
    if (err.name === 'JsonSchemaValidation') {
        err.status = 400;
        err.message = 'Invalid data found.';
        err.error = err.validations;
    }
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err.error
    });
    logger.error('error', err)
});

process.on('uncaughtException', function (err) {
    logger.error('uncaughtException', err);
});

module.exports = app;
