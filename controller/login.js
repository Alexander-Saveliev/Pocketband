var password = require('../model/password');

exports.login = function(req, res) {
    if (req.session.loggedUser) {
        user = req.session.loggedUser;
        res.redirect('/home');
    } else {
        req.session.destroy();
        res.render('login.ejs');
    }
}

exports.home = function(req, res) {
    if (req.session.loggedUser) {
        user = req.session.loggedUser;
        res.render('home.ejs', {
    	           user: user
    		});
    } else {
        var user = req.body.user;
        var pass = req.body.pass;

        if (!user || !pass) {
            req.session.destroy();
            res.redirect('/');
        }

        console.log("Logging in | {user, pass}={" + user + ", " + pass + "}");

        password.login(user, pass, function(err, success) {
            if (err) {
                console.log("Login error" + err);
                return res.status(500).send("Login error");
            }
            if (success) {
                console.log("'" + user + "' has logged in");
                req.session.loggedUser = user;
                res.status(200).send();
            } else {
                console.log("'" + user + "' invalid credentials");
                req.session.destroy();
                res.status(401).send("incorrect username or password");
            }
        })
    }
}

exports.logout = function(req, res) {
    console.log("'" + req.session.loggedUser + "' invalid credentials");
    req.session.destroy();
    res.redirect('/');
}

exports.about = function(req, res) {
    if (req.session.loggedUser) {
        user = req.session.loggedUser;
        res.render('about.ejs', {
            user: user
        });
    } else {
        req.session.destroy();
        res.render('about.ejs', {
            user: "Log in"
        });
    }
}
