/**
 * MergeService.js
 *
 * @description :: This is the service for merging PDF files
 * @docs        ::
 */


var fs = require('fs');
var PDFMerge = require('pdf-merge');
var Container = require('../models/UploadModel');
var uid = require('uid');
var async = require('async');
var pdfPageCount = require('pdf_page_count');

// Blank PDF for inserting to merge
var blankpage = './server/file_storage/blank.pdf';


//  Constants
var PDFTK_PATH = 'C:/PDFtk_Server/bin/pdftk.exe';
var PDF_EXT = '.pdf';
var FILE_STORAGE = './server/file_storage/';
var TEMP_NAME = 'merged_doc.pdf';

module.exports.merge = function (request, callback) {

    // Append all pdf files with full path
    var pdfFileList = function(callback) {
        var pdfFileNames = request.fileArray;
        var dir = FILE_STORAGE + request.containerID + '/';
        var n = pdfFileNames.length;
        for(var i = 0; i < n; i++) {
            pdfFileNames[i] = dir + pdfFileNames[i];
        }
        callback(null, pdfFileNames);
    };

    // Merge all PDFs into one document
    var mergePDFs = function(pdfList, callback) {
        var newKey = uid(24);
        var filePath = FILE_STORAGE + request.containerID + '/' + newKey + PDF_EXT;
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
    var getFileData = function(key, callback) {
        var filepath = FILE_STORAGE + request.containerID + '/' + key + PDF_EXT;
        fs.stat(filepath, function(err, stats) {
            if(err) console.log("Error getting file size.");
            var fileSize = stats["size"];
            pdfPageCount.count(filepath, function (result) {
                if (!result.success) res.status(500).json(result.error);
                callback(null, key, fileSize, result.data);
            })

        });
    };

    // Insert merged doc metadata into database
    var addToDatabase = function(key, fileSize, pageCount, callback) {
        var metadata = {
            key: key,
            filename: TEMP_NAME,
            size: fileSize,
            pageCount: pageCount,
            contentType: 'application/pdf',
            uploadDate: Date.now()
        };

        Container.findOneAndUpdate({
            _id: request.containerID
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
        getFileData,
        addToDatabase
    ], function (err, metadata) {
        if (err) return next(err);
        callback(null, metadata);
    });
};