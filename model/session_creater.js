var db = require('./db');
var ObjectID = require('mongodb').ObjectID;

exports.createSession = function(session, cb) {
    db.get().collection('session').insert(session, function(err, doc) {
        cb(err, session._id);
    });
}

exports.getSession = function(session_id, cb) {
  db.get().collection('session').findOne({ "_id": ObjectID(session_id) }, function(err, session) {
      cb(err, session);
  });
}

exports.getAllUserSessions = function(user_id, cb) {
    db.get().collection('session').find({ 'participants': { $in: [ObjectID(user_id)] } }).toArray(function(err, sessions) {
        cb(err, sessions);
    });
}
