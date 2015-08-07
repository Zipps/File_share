var fs = require('fs');
var PDFMerge = require('pdf-merge');
var path = require('path');
var Container = require('../models/UploadFileModel');
var uid = require('uid');
var pdf_page_count = require('pdf_page_count');
var pdfkit = require('pdfkit');
var async = require('async');

//  Constants
var PDFTK_PATH = 'C:/Program Files (x86)/PDFtk Server/bin/pdftk.exe';
var PDF_EXT = '.pdf';
var FILE_STORAGE = './server/file_storage/';
var TEMP_NAME = 'merged_doc.pdf';



// Merge all PDF's into one document
module.exports.merge = function(req, res, next) {

    var pdfFileList = function(callback) {
        var pdfList = [];
        var pdfCount = 0;
        fs.readdir(FILE_STORAGE + req.params._id + '/', function(err, files) {
            files.forEach(function(file) {
                var fileExt = path.extname(file);
                if (fileExt == PDF_EXT) {
                    ++pdfCount;
                    var pdfPath = FILE_STORAGE + req.params._id + '/' + file;
                    pdfList.push(pdfPath);
                }
            });
            if (pdfCount == 0) return err;
            callback(null, pdfList);
        });
    };

    var mergePDFs = function(pdfList, callback) {
        var newKey = uid(24);
        var filePath = FILE_STORAGE + req.params._id + '/' + newKey + PDF_EXT;
        var pdfMerge = new PDFMerge(pdfList, PDFTK_PATH);
        pdfMerge.asNewFile(filePath).merge(function(e) {
                if(e != null) return console.log(e);
                else {
                    console.log("Files merged");
                    callback(null, newKey);
                }
        });
    };

    var getFileSize = function(key, callback) {
        fs.stat(FILE_STORAGE + req.params._id + '/' + key + PDF_EXT, function(err, stats) {
            if(err) console.log("Error getting file size.");
            var fileSize = stats["size"];
            callback(null, key, fileSize);
        });
    };

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
        ], function (err, result) {
            if (err) return next(err);
            res.status(201).json(result);
    });
};
