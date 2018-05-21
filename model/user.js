var db = require('./db');

exports.getFriends = function(username, cb) {
    db.get().collection('user').findOne({ username: username }, function(err, users) {
        cb(err, users.friends);
    });
}

exports.getSubscribers = function(username, cb) {
    db.get().collection('user').findOne({ username: username }, function(err, users) {
        cb(err, users.subscribers);
    });
}

exports.getSubscriptions = function(username, cb) {
    db.get().collection('user').findOne({ username: username }, function(err, users) {
        cb(err, users.subscription);
    });
}

function isExist(element, array) {
    var found = false;

    array.forEach(function(el) {
        if (element.id.equals(el.id) && element.username == el.username) {
            found = true;
            return;
        }
    });

    return found;
}

exports.all = function (cb) {
    db.get().collection('user').find().toArray(function (err, docs) {
        cb(err, docs)
    });
}

exports.findById = function(id, cb) {
    db.get().collection('user').findOne({ _id: ObjectID(id) }, function (err, doc) {
        cb(err, doc);
    });
}

exports.findByName = function(name, cb) {
    db.get().collection('user').findOne({ username: name }, function (err, doc) {
        cb(err, doc);
    });
}

exports.findByMail = function(email, cb) {
    db.get().collection('user').findOne({ email: email }, function (err, doc) {
        cb(err, doc);
    });
}

exports.addUser = function(user, cb) {
    db.get().collection('user').insert(user, function(err) {
        cb(err);
    });
}

exports.addFriend = function(user_name, friend_name, cb) {
    db.get().collection('user').findOne({ username: friend_name }, function (err, friend) {
        if (err) {
            cb("Error", err);
        } else if (!friend) {
            cb("Can't see user");
        } else {
            var friendUser = {
                id: friend._id,
                username: friend.username
            }

            db.get().collection('user').findOne({ username: user_name }, function (err, user) {
                if (err) {
                    cb("Error", err);
                } else if (!user) {
                    cb("Can't see user")
                } else {
                    var userUser = {
                      id: user._id,
                      username: user.username
                    }

                    if (isExist(userUser, friend.subscribers) || isExist(userUser, friend.friends)) {
                        return cb("You already asked");
                    } else if (isExist(userUser, friend.subscription)) {
                        // remove from subscribers to friends
                        db.get().collection('user').updateOne(
                            {"username": user_name},
                            { $pull: { subscribers: friendUser } }
                        );

                        db.get().collection('user').updateOne(
                            {"username": user_name},
                            { $pull: { subscription: friendUser } }
                        );

                        db.get().collection('user').updateOne(
                            {"username": user_name},
                            { $addToSet: { friends: friendUser } }
                        );

                        db.get().collection('user').updateOne(
                            {"username": friend_name},
                            { $pull: { subscribers: userUser } }
                        );

                        db.get().collection('user').updateOne(
                            {"username": friend_name},
                            { $pull: { subscription: userUser } }
                        );

                        db.get().collection('user').updateOne(
                            {"username": friend_name},
                            { $addToSet: { friends: userUser } }
                        );
                    } else if (!isExist(friendUser, user.friends)) {
                        // add to subscribers
                        db.get().collection('user').updateOne(
                            {"username": user_name},
                            { $addToSet: { subscription: friendUser } }
                        );

                        db.get().collection('user').updateOne(
                            {"username": friend_name},
                            { $addToSet: { subscribers: userUser } }
                        );
                    }

                    cb("Friend was added");
                }
            });
        }
    });
}
