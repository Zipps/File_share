/**
 * routes.js
 *
 * @description :: Configure router
 * @docs        ::
 */

var express = require('express');
var router = express.Router();

// Load Controllers
var MergeCtrl = require('../src/main/api/controllers/MergeController');
var UploadCtrl = require('../src/main/api/controllers/UploadController');
var ViewFileCtrl = require('../src/main/api/controllers/ViewFileController');

// Map HTTP Endpoints to controllers
router
    .route('/api/upload')
    .post(UploadCtrl.newUpload);

router
    .route('/api/upload/:_id')
    .get(ViewFileCtrl.getContainer);

router
    .route('/api/upload/:_id/file')
    .post(UploadCtrl.uploadFile);

router
    .route('/api/upload/:_id/file/:key')
    .get(UploadCtrl.downloadFile)
    .delete(UploadCtrl.deleteFile);

router
    .route('/api/upload/:_id/merge')
    .post(MergeCtrl.merge);

module.exports = router;
