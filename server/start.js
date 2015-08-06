/**
 * start.js
 *
 * @description :: Load application (app.js) and bind to a http webserver
 * @help        :: http://gulpjs.com/
 */

'use strict';

/**
 * Set environment variable, e.g. development, testing, production
 */

process.env.NODE_ENV = process.NODE_ENV || 'development';

/**
 * Get Config
 * @help :: https://github.com/lorenwest/node-config
 */

// Tell config module where to find the config file
process.env.NODE_CONFIG_DIR = './server/config/env';
// Crash if there are any issues with the config
process.env.NODE_CONFIG_STRICT_MODE = true;

var config = require('config');

/**
 * Import dependencies.
 */

var app = require('./app');
var http = require('http');
var fs = require('fs');

http
    .createServer(app)
    .listen(config.get('http'))
    .on('error', onError)
    .on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error('These ports may require elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error('These ports may already be in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = this.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}