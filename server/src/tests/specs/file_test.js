/**
 * file_test.js
 *
 * @description :: Runs test against API
 * @docs        :: Uses Mocha test framework - http://mochajs.org/ && https://github.com/visionmedia/supertest/
 */

var request = require('supertest');
var should = require('chai').should();
var fs = require('fs');

// Load app
var app = require('../../../app');
var basePath = '/api';

describe('Uploads:', function() {
    it('Should respond with an upload id', function(done) {
        request(app)
            .post(basePath + '/upload')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                upload = res.body;
                upload.should.have.property('_id').should.not.equal(null);
            })
            .expect(201, done);
    });
    it('Should return list of files', function(done) {
        request(app)
            .get(basePath + '/upload/' + upload._id)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                console.log(res);
                var temp = res.body[0];
                temp.should.have.property('_id');
                temp.should.not.have.property('key');
            })
            .expect(200, done)
    });
});

describe('Files:', function() {
    it('Should upload the file to the container', function(done) {
        request(app)
            .post(basePath + '/upload/' + upload._id + '/file')
            .attach('test-file', __dirname + '/../data/test_file_one.pdf')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.should.have.property('key');
                res.body.should.have.property('filename');
                res.body.should.have.property('size');
                res.body.should.have.property('contentType');
                res.body.should.have.property('uploadDate');
                file = res.body;
            })
            .expect(201, done);
    });
});

after(function (done) {
    done();
});