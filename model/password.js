var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var fs = require('fs');

var salt = fs.readFileSync(__dirname + '/hash.txt', 'utf-8');


exports.findByName = function(name, cb) {
    db.get().collection('password').findOne({ username: name }, function (err, doc) {
        cb(err, doc);
    });
}

exports.login = function(username, pass, cb) {
    var cryptedPass = bcrypt.hashSync(pass, salt);
    db.get().collection('password').findOne({ username: username, password: cryptedPass }, function (err, doc) {
        cb(err, (doc != null));
    });
}

exports.addPasword = function(password, cb) {
    var cryptedPass = bcrypt.hashSync(password.password, salt);

    password.password = cryptedPass;
    db.get().collection('password').insert(password, function(err) {
        cb(err);
    });
}
