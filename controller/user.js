var userModel = require('../model/user');


exports.addUser = function(req, res) {
    if (req.session.loggedUser) {
        var user = req.session.loggedUser;
        var friend = req.body.friend;

        if (friend) {
            userModel.addFriend(user, friend, function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send("Friend was added");
                }
            });
        } else {
            req.session.destroy();
            res.status(401).send("Incorrect request");
        }
    } else {
        req.session.destroy();
        res.status(401).send("Unauthorized");
    }
}

exports.getFriends = function(req, res) {
  if (req.session.loggedUser) {
      userModel.getFriends(req.session.loggedUser, function(err, users) {
          if (err) {
              res.status(500).send(err);
          } else {
              res.status(200).send(users);
          }
      });
  } else {
      req.session.destroy();
      res.status(401).send("Unauthorized");
  }
}

exports.getSubscribers = function(req, res) {
  if (req.session.loggedUser) {
      userModel.getSubscribers(req.session.loggedUser, function(err, users) {
          if (err) {
              res.status(500).send(err);
          } else {
              res.status(200).send(users);
          }
      });
  } else {
      req.session.destroy();
      res.status(401).send("Unauthorized");
  }
}

exports.getSubscriptions = function(req, res) {
  if (req.session.loggedUser) {
      userModel.getSubscriptions(req.session.loggedUser, function(err, users) {
          if (err) {
              res.status(500).send(err);
          } else {
              res.status(200).send(users);
          }
      });
  } else {
      req.session.destroy();
      res.status(401).send("Unauthorized");
  }
}
