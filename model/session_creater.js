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
      console.log(sessions);
        cb(err, sessions);
    });

//     db.get().collection('session').find( { },
//                 { participants :
//                     { $elemMatch :
//                        { id : user_id }
//                     }
//                 },
//                 function(err, sessions) {
//                     console.log(sessions);
//                 }
// );

}


// db.course.find( { },
//                 { students :
//                     { $elemMatch :
//                        { id : ObjectId("51780f796ec4051a536015d0"),
//                          name : "Sam"
//                        }
//                     }
//                 }
// );
