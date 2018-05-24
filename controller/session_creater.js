var userModel = require('../model/user');
var sessionModel = require('../model/session_creater');
var ObjectID = require('mongodb').ObjectID;

exports.createSession = function(req, res) {
  var particReq;
  if (!req.body.participants) {
      particReq = [];
  } else {
      particReq = req.body.participants.toString().split(",")
  }
  if (particReq.length == 1 && particReq[0] == '') {
    particReq = [];
  }

    if (req.session.loggedUser) {
console.log(req.body);

        var name         = req.body.name;
        var description  = req.body.description;
        var user         = req.session.loggedUser;
        var friend       = req.body.friend;
        var participants = new Set();
        var sent = false;

        particReq.forEach(function(user_id) {
            participants.add(ObjectID(user_id));
        });

        userModel.isUsersExist([...participants], function(err, isExist) {
            if (err) {
                return res.status(500).send(err);
            } else if (!isExist) {
                return res.status(400).send("Incorrect participant");
            } else {
              userModel.findByName(user, function(err, doc) {
                if (err) {
                    return res.status(401).send("Unauthorized");
                } else {
                  participants.add(doc._id);

                  var newSession = {
                      name: name,
                      description: description,
                      participants: [...participants]
                  };

                  sessionModel.createSession(newSession, function(err, session_id) {
                      if (err) {
                          return res.status(500).send(err);
                      }

                      [...participants].forEach(function(user_id) {
                          userModel.addSession(user_id, session_id);
                      });
                      return res.status(200).send();
                  });
                }
              });
            }
        });
    } else {
        req.session.destroy();
        res.status(401).send("Unauthorized");
    }
}

exports.getSession = function(req, res) {
    if (req.session.loggedUser) {
        var username = req.session.loggedUser;
        userModel.findByName(username, function(err, user) {
            if (err) {
                return res.status(500).send(err);
            }
            sessionModel.getAllUserSessions(user._id, function(err, sessions) {
                if (err) {
                    return res.status(500).send(err);
                }

                res.status(200).send(sessions);
            });
        });
    } else {
        req.session.destroy();
        res.status(401).send("Unauthorized");
    }
}
