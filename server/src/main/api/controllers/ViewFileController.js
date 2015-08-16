var Container = require('../models/UploadModel');

module.exports.getContainer = function(req, res, next) {
    var containerId = req.params._id;
    Container.findById(containerId, function(err, doc) {
        if (err) {
            return console.log(err);
        }
        else if (!doc) {
            return res.status(404).message("No upload could be found.");
        }
        res.status(200).json(doc);
        });
    };

