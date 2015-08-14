/**
 * merge_test.js
 *
 * @description :: Runs test against API for file merging
 * @docs        :: Uses Mocha test framework - http://mochajs.org/ && https://github.com/visionmedia/supertest/
 */

var request = require('supertest');
var should = require('chai').should();
var fs = require('fs');

// Load app
var app = require('../../../app');
var basePath = '/api';

var container = require('../data/merge_files/merge_data');
var files = [];
var mergeFileKey = 0;

// Load database model
var Container = require('../../main/api/models/UploadFileModel');


before(function (done) {
    // create container for test and add files
    container = new Container(container);

    // add to database
    container.save(function (err) {
        if (err) throw err;

    });

    files.push(container.files[0].key + '.pdf');
    files.push(container.files[1].key + '.pdf');

    // Move files to file_storage
    var dir = './server/file_storage/' + container._id;
    var fileOne = './server/file_storage/' + container._id + '/' + container.files[0].key + '.pdf';
    var fileTwo = './server/file_storage/' + container._id + '/' + container.files[1].key + '.pdf';
    fs.mkdir(dir, function() {
        fs.createReadStream('./server/src/tests/data/merge_files/test_pdf_one.pdf')
            .pipe(fs.createWriteStream(fileOne));
    });
    fs.createReadStream('./server/src/tests/data/merge_files/test_pdf_two.pdf')
        .pipe(fs.createWriteStream(fileTwo));

    done();
});

describe('Merge:', function() {
    it('Should merge the PDF files', function (done) {
        var body = {
            files: files
        };
        request(app)
            .post(basePath + '/upload/' + container._id + '/merge')
            .send(body)
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.body.should.have.property('key');
                res.body.should.have.property('filename');
                res.body.should.have.property('size');
                res.body.should.have.property('pageCount');
                res.body.should.have.property('contentType');
                res.body.should.have.property('uploadDate');
                mergeFileKey = res.body.key;
            })
            .expect(201, done)
    });
    it('Should add the merge file\'s metadata to to database', function (done) {
        Container
            .findOne({
                _id: container._id,
                'files.key' : mergeFileKey
            })
            .select({'files.$' : 1})
            .exec(function (err, doc) {
                if (err) console.log(err);
                if (!doc) console.log("No entry found.");

                doc.files[0].should.have.property('key');
                doc.files[0].should.have.property('filename');
                doc.files[0].should.have.property('size');
                doc.files[0].should.have.property('pageCount');
                doc.files[0].should.have.property('contentType');
                doc.files[0].should.have.property('uploadDate');

                done();
            });


    });
});

after(function (done) {
    done();
});
