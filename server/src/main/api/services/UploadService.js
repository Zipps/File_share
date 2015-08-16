/**
 * UploadService.js
 *
 * @description :: This is the service for managing PDF files
 * @docs        ::
 */

var Container = require('../models/UploadModel');

var fs = require('fs');

module.exports.newUpload = function(body, callback) {
    var container = new Container(body);

    container.save(function (err, doc) {
        console.log(err);
        console.log(doc);
        if (err) return callback(err);

        callback(null, doc);
    });

    // Create directory from _id if it does not exist
    var id = container._id;
    var dir = FILE_STORAGE + id;
    if(!fs.exists(dir)) {
        fs.mkdir(dir);
    }
};
