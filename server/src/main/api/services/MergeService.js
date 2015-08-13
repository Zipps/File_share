/**
 * MergePdfs.js
 *
 * @description :: This is the service for merging PDF files
 * @docs        ::
 */


var fs = require('fs');
var PDFMerge = require('pdf-merge');
var pdfPageCount = require('pdf_page_count');
var pdfkit = require('pdfkit');
var Container = require('../models/UploadFileModel');
var uid = require('uid');
var async = require('async');

//  Constants
var PDFTK_PATH = 'C:/PDFtk_Server/bin/pdftk.exe';
var PDF_EXT = '.pdf';
var FILE_STORAGE = './server/file_storage/';
var TEMP_NAME = 'merged_doc.pdf';

module.exports.merge = function (req, callback) {

    // Append all pdf files with full path
    var pdfFileList = function(callback) {
        var pdfFileNames = req.body.files;
        var dir = FILE_STORAGE + req.params._id + '/';
        var n = pdfFileNames.length;
        for(var i = 0; i < n; i++) {
            pdfFileNames[i] = dir + pdfFileNames[i];
        }
        callback(null, pdfFileNames);
    };

    // Merge all PDFs into one document
    var mergePDFs = function(pdfList, callback) {
        var newKey = uid(24);
        var filePath = FILE_STORAGE + req.params._id + '/' + newKey + PDF_EXT;
        var pdfMerge = new PDFMerge(pdfList, PDFTK_PATH);
        pdfMerge.asNewFile(filePath).merge(function(err) {
            if(err) return console.log(err);
            else {
                console.log("Files merged");
                callback(null, newKey);
            }
        });
    };

    // Get the file size of the merged doc
    var getFileSize = function(key, callback) {
        fs.stat(FILE_STORAGE + req.params._id + '/' + key + PDF_EXT, function(err, stats) {
            if(err) console.log("Error getting file size.");
            var fileSize = stats["size"];
            callback(null, key, fileSize);
        });
    };

    // Insert merged doc metadata into database
    var addToDatabase = function(key, fileSize, callback) {
        var metadata = {
            key: key,
            filename: TEMP_NAME,
            size: fileSize,
            contentType: 'application/pdf',
            uploadDate: Date.now()
        };

        Container.findOneAndUpdate({
            _id: req.params._id
        }, {
            $push: {
                files: metadata
            }
        }, function(err) {
            return err;
        });
        callback(null, metadata);
    };

    async.waterfall([
        pdfFileList,
        mergePDFs,
        getFileSize,
        addToDatabase
    ], function (err, metadata) {
        if (err) return next(err);
        callback(null, metadata);
    });
};