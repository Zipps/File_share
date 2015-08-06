/**
 * ErrorHelper.js
 *
 * @description :: This is a error helper utility, for re-usable snippets to transform errors into
 * a consistent response
 * @docs        ::
 */

'use strict';

module.exports.handleDatabaseError = function (err) {
    return {
        status: 500,
        message: 'An internal server error has occurred',
        error: err
    };
};