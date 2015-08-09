var Busboy = require('busboy');
var Container = require('../models/UploadFileModel');
var Utils = require('../utils/ErrorHelper');
var fs = require('fs');
var uid = require('uid');
var mime = require('mime');
var glob = require('glob');

var FILE_STORAGE = './server/file_storage/';

module.exports.newUpload = function(req, res, next) {
    var container = new Container(req.body);
    container.save(function (err, doc) {
        if (err) return res.status(500).json(Utils.handleDatabaseError(err));
        console.log(doc);
        res.status(201).json(doc);
    });

    // Create directory from _id if it does not exist
    var key = container._id;
    var dir = FILE_STORAGE + key;
    if(!fs.exists(dir)) {
        fs.mkdir(dir);
    }
};

// Handles file uploads
module.exports.uploadFile = function(req, res, next) {
    try {
        var busboy = new Busboy({ headers: req.headers });
    } catch (e) {
        console.error(e);
        return res.status(400).json(e);
    }

    // FILE UPLOAD
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('Uploading: ' + filename);

        // generate key for file
        var newKey = uid(24);
        var containerId = req.params._id;


        var metadata= {
            key: newKey,
            filename: filename,
            size: req.headers['content-length'],
            contentType: mimetype,
            uploadDate: Date.now()
        };

        var fstream = fs.createWriteStream(FILE_STORAGE + containerId + '/' + newKey + '.' + mime.extension(metadata.contentType));
        fstream.on('close', function() {
            addFileToDatabase(metadata, containerId);
            //res.redirect('back');
        });
        res.status(200).json(metadata);
        file.pipe(fstream);
    });

    busboy.on('error', function(err) {
        console.error(err);
        res.status(400).json(err);
    });

    busboy.on('finish', function() {
        console.log('Finished.');
    });
    req.pipe(busboy);
    // END FILE UPLOAD
};

var addFileToDatabase = function(metadata, ID) {
    console.log('adding file to : ' + ID);
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

module.exports.deleteFile = function(req, res, next) {
    var fileContainer = req.params._id;
    var fileKey = req.params.key;
    var filePath = FILE_STORAGE + fileContainer + '/' + fileKey;
    var query = {_id: fileContainer};
    glob(filePath + '.*', function(err, files) {
        console.log('File match: ' + files);

        // delete file
        fs.unlink( files[0], function(err) {
            if (err) throw err;
            console.log('deleted: ' + files[0]);
        });
    });

    // remove file from db
    console.log('Removing db entry for key: ' + fileKey);
    Container.findOneAndUpdate(query, {
        $pull: {
            files: {
                key: fileKey
            }
        }
    }, function(err) {
        console.log(err);
    });
    res.status(204).json({});
};

module.exports.downloadFile = function(req, res, next) {
    console.log('downloading file with key: ' + req.params.key);
    Container
        .findOne({
            _id: req.params._id,
            'files.key': req.params.key
        })
        .select({'files.$' : 1})
        .exec(function (err, doc) {

            if (err) console.log(err);
            if (err) return res.status(500).json(Utils.handleDatabaseError(err));
            if (!doc) return res.status(404).json(Utils.handleDatabaseError(err));

            doc = doc.files[0];
            var filestream = fs.createReadStream(FILE_STORAGE + req.params._id + '/' + req.params.key + '.' + mime.extension(doc.contentType));

            res.setHeader('Content-disposition', 'attachment; filename="' + doc.filename + '"');
            res.setHeader('Content-Type', doc.contentType);

            filestream.pipe(res);
        });
};
