/**
 * MergeController.js
 *
 * @description :: Request controller for managing PDF merging
 * @docs        ::
 */

var Merge = require('../services/MergeService');



// Merge all PDF's into one document
module.exports.merge = function(req, res, next) {
    var request = {
        containerID: req.params._id,
        fileArray: req.body.files
    };

    Merge.merge(request, function (err, metadata) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.status(201).json(metadata);
    });
};
