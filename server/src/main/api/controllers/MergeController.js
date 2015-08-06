var fs = require('fs');
var PDFMerge = require('pdf-merge');
var path = require('path');
var Container = require('../models/UploadFileModel');
var uid = require('uid');

//  Constants
var PDFTK_PATH = 'C:/Program Files (x86)/PDFtk Server/bin/pdftk.exe';
var PDF_EXT = '.pdf';
var FILE_STORAGE = './server/file_storage/';
var TEMP_NAME = 'merged_doc.pdf';



// Merge all PDF's into one document
module.exports.merge = function(req, res, next) {
    var containerId = req.params._id;
    var dir = FILE_STORAGE + containerId + '/';
    var merge = new PDFMerge(pdfFileList(dir), PDFTK_PATH);
    merge.asNewFile(outputFilePath(dir, TEMP_NAME)).merge(function(err) {
        if(err != null){
            console.log("Error merging files: " + err);
        }
        else {
            console.log("Files merged.");
            var metadata = {
                key: uid(24),
                filename: TEMP_NAME,
                size: getFileSize(dir),
                contentType: "application/pdf",
                uploadDate: Date.now()
            };
            addFileToDatabase(metadata, containerId);
            res.json(metadata);
        }
    });
};

var getFileSize = function(dir) {
    var stats = fs.statSync(dir + TEMP_NAME);
    return stats["size"];
};

// Returns an array of all PDF file names in a directory
var pdfFileList = function(dir) {
    var pdfList = [];
    var pdfCount = 0;
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var fileExtention = path.extname(file);
        if (fileExtention == PDF_EXT) {
            ++pdfCount;
            pdfList.push(dir + file);
        }
    });
    if (pdfCount == 0) return null;
    else return pdfList;
};

// Creates the output file path
var outputFilePath = function(dir) {
    var fileExtention = path.extname(TEMP_NAME);
    if(fileExtention != PDF_EXT) {
        TEMP_NAME += PDF_EXT;
    }
    return dir + TEMP_NAME;
};

var addFileToDatabase = function(metadata, ID) {
    Container.findOneAndUpdate({
            _id: ID
        }, {
            $push: {
                files: metadata
            }
        }, function(err) {
            console.log(err);
        }
    )
};