/**
 * file_test.js
 *
 * @description :: Runs test against API for file uploading
 * @docs        :: Uses Mocha test framework - http://mochajs.org/ && https://github.com/visionmedia/supertest/
 */

var request = require('supertest');
var should = require('chai').should();
var fs = require('fs');

// Load app
var app = require('../../../app');
var basePath = '/api';

// Reusable Variables
var upload = {};

describe('Uploads:', function() {
    it('Should respond with an upload id', function(done) {
        request(app)
            .post(basePath + '/upload')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                console.log(res.body);
                upload = res.body;
                upload.should.have.property('_id').should.not.equal(null);
            })
            .expect(201, done);
    });
    it('Should return file container', function(done) {
        request(app)
            .get(basePath + '/upload/' + upload._id)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                var temp = res.body;
                temp.should.have.property('_id');
                temp.should.not.have.property('key');
            })
            .expect(200, done)
    });
});

describe('Files:', function() {
    it('Should upload a PDF file to the container', function(done) {
        request(app)
            .post(basePath + '/upload/' + upload._id + '/file')
            .attach('test-file', __dirname + '/../data/upload_files/test_file.pdf')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.should.have.property('key').should.not.equal(null);
                res.body.should.have.property('filename').should.not.equal(null);
                res.body.should.have.property('size').should.not.equal(null);
                res.body.should.have.property('contentType').should.not.equal(null);
                res.body.should.have.property('uploadDate').should.not.equal(null);
            })
            .expect(201, done);
    });
    it("Should reject a non-PDF file upload attempt", function(done) {
        request(app)
            .post(basePath + '/upload/' + upload._id + '/file')
            .attach('test-file', __dirname + '/../data/upload_files/test_file.docx')
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('Should return an array of the file names', function(done) {
        request(app)
            .get(basePath + '/upload/' + upload._id)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                var temp = res.body.files[0];
                temp.should.have.property('key');
            })
            .expect(200, done)
    });
});



after(function (done) {
    done();
});