/**
 * MergeController.js
 *
 * @description :: Request controller for managing PDF merging
 * @docs        ::
 */

var Merge = require('../services/MergeService')



// Merge all PDF's into one document
module.exports.merge = function(req, res, next) {
    Merge.merge(req, function (err, doc, metadata) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.status(201).json(metadata);
    });

    // Append all pdf files with full path
    var pdfFileList = function(callback) {
        var pdfFileNames = req.body;
        var dir = FILE_STORAGE + req.params._id + '/';
        var n = pdfFileNames.length;
        for(var i = 0; i < n; i++) {
            var temp = dir + pdfFileNames[i];
            pdfFileNames[i] = temp;
        }
        callback(null, pdfFileNames);
    };

    // Merge all PDFs into one document
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
            res.status(201).json(metadata);
    });
};
