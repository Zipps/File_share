/**
 *
 * UploadFileModel.js
 *
 * @description :: Defines the model for a container configuration
 * @docs        ::
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var containerSchema = new Schema({
    files: [
        {
            _id: {required: false},
            key: {type: String, required: true, index: {unique: true}},
            filename: {type: String, required: true},
            size: {type: Number, required: true},
            pageCount: {type: Number, required: true},
            contentType: {type: String, required: true},
            uploadDate: {type: Date, required: true}
        }
    ]
});

module.exports = mongoose.model('Container', containerSchema);