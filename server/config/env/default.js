/**
 * default.js
 * @description :: Default configuration file, uses NODE_ENV environment variable to choose which config to load
 * @help        ::
 */

var logger = require('../logger');

module.exports = function () {
    switch (process.env.NODE_ENV) {
        case 'development':
            return {
                app: {
                    name: 'EasyShare-DEV'
                },
                http: 3000,
                imap: {
                    host: 'imap.gmail.com',
                    port: 993,
                    tls: true
                },
                dbURI: 'mongodb://127.0.0.1:27017/mailmonitor',
                logger: logger
            };
        case 'testing':
            return {
                app: {
                    name: 'EasyShare-UAT'
                },
                http: 3000,
                imap: {
                    host: 'imap.gmail.com',
                    port: 993,
                    tls: true
                },
                dbURI: 'mongodb://127.0.0.1:27017/mailmonitor',
                logger: logger
            };
        case 'production':
            return {
                app: {
                    name: 'EasyShare'
                },
                http: 3000,
                imap: {
                    host: 'imap.gmail.com',
                    port: 993,
                    tls: true
                },
                dbURI: 'mongodb://127.0.0.1:27017/mailmonitor',
                logger: logger
            };
        default:
            throw new Error('No NODE_ENV environment variable set.')
    }
}(); // These () calls the function and returns the config JSON object