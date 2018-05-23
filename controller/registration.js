var password = require('../model/password');
var user     = require('../model/user');

exports.register = function(req, res) {
    if (req.session.loggedUser) {
        user = req.session.loggedUser;
        res.redirect('/home');
    } else {
        req.session.destroy();
        res.render('register.ejs');
    }
}

exports.addNewUser = function(req, res) {
    var userName = req.body.user;
    var pass     = req.body.pass;
    var email    = req.body.email;

    if (!pass || pass.length < 3) {
        return res.status(400).send("Password is too short");
    }

    if (pass != req.body.passcheck) {
        return res.status(400).send("Passwords should be equal");
    }

    user.findByName(userName, function(err, doc) {
        if (err) {
            return res.status(500).send("Registration error");
        }
        if (doc) {
            found = true;
            return res.status(400).send(`User with name ${userName} already exists`);
        } else {
            var newUser = {
                email: email,
                username: userName,
                friends: [],
                subscribers: [],
                subscription: [],
                sessions: [],
                registrationData: Date()
            };
            var newPassword = {
                username: userName,
                password: pass
            }

            user.addUser(newUser, function(err) {
                if (err) {
                    return res.sendStatus(500).send("Registration error");
                } else {
                    password.addPasword(newPassword, function(err) {
                        if (err) {
                            return res.sendStatus(500).send("Registration error");
                        }
                        req.session.loggedUser= newUser.username;
                        return res.status(200).send();
                    });
                }
            });
        }
    });
}
