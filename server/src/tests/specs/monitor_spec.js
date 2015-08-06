var should = require('chai').should();
var config = require('config');

var db = require('monk')(config.get('dbURI'));
var mailboxes = db.get('mailboxes');

var CheckMailbox = require('../../main/shared/monitor/worker');

describe('Mailbox Monitor Job', function () {
    var mailbox = {};

    before(function (done) {
        var data = require('../data/monitor_data');

        mailboxes.insert(data, function (err, docs) {
            if (err) {
                should.not.exist(err);
                return process.exit(1);
            }

            mailbox = docs;

            done();
        });
    });
    it('Runs without error', function (done) {
        CheckMailbox(mailbox._id, function (err) {
            console.log(err);
            should.not.exist(err);

            done();
        });
    })
});