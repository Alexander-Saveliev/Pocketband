var password     = require('../model/password');
var sessionModel = require('../model/session_creater');
var userModel    = require('../model/user');

var OpenVidu = require('openvidu-node-client').OpenVidu;
var Session = require('openvidu-node-client').Session;
var OpenViduRole = require('openvidu-node-client').OpenViduRole;
var TokenOptions = require('openvidu-node-client').TokenOptions;

// Collection to pair session is and OpenVidu Session objects
var mapSessionIDSession = {};
// Collection to pair sessionId's (identifiers of Session objects) and tokens
var mapSessionIdTokens = {};

// Environment variable: URL where our OpenVidu server is listening
var OPENVIDU_URL = process.argv[2];
// Environment variable: secret shared with our OpenVidu server
var OPENVIDU_SECRET = process.argv[3];

// OpenVidu object to ask openvidu-server for sessionId and token
var OV = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);


exports.join = function(req, res) {
    if (!req.session.loggedUser) {
        req.session.destroy();
        res.redirect('/');
    } else {
        var clientData = req.session.loggedUser;
        var sessionID  = req.body.sessionID;

        var tokenOptions = new TokenOptions.Builder()
            .data(clientData)
            .build();

        userModel.findByName(clientData, function(err, user) {
            if (err) {
                return res.status(500).send(err);
            }

            if (!user) {
                return res.status(400).send('Unauthorized');
            }

            var isSessionExist = false;
            for (var i = 0; i < user.sessions.length; i++) {
                if (user.sessions[i].equals(sessionID)) {
                    isSessionExist = true;
                    break;
                }
            }
            if (!isSessionExist) {
                return res.status(400).send("You don't have permission");
            }

            if (mapSessionIDSession[sessionID]) {
                // Session already exists: return existing sessionId and a new token
                // Get the existing Session from the collection
                var mySession = mapSessionIDSession[sessionID];

                // Generate a new token asynchronously with the recently created tokenOptions
                mySession.generateToken(tokenOptions, function (token) {
                    // Get the existing sessionId
                    mySession.getSessionId(function (ovSessionId) {
                        // Store the new token in the collection of tokens
                        mapSessionIdTokens[sessionID].push(token);
                            sessionModel.getSession(sessionID, function(err, session) {
                                if (err) {
                                    return res.status(500).send(err);
                                }

                                if (!session) {
                                    return res.status(400).send("Incorrect session");
                                }
                                var sessionName = session.name;

                                // Return session template with all the needed attributes
                                return res.render('session.ejs', {
                                    user: req.session.loggedUser,
                                    ovSessionId: ovSessionId,
                                    sessionID: sessionID,
                                    token: token,
                                    nickName: clientData,
                                    userName: req.session.loggedUser,
                                    sessionName: sessionName
                                });
                            });
                    });
                });
            } else {
                // Create a new OpenVidu Session
                var mySession = OV.createSession();
                // Get the sessionId asynchronously
                mySession.getSessionId(function (ovSessionId) {
                    // Store the new Session in the collection of Sessions
                    mapSessionIDSession[sessionID] = mySession;
                    // Store a new empty array in the collection of tokens
                    mapSessionIdTokens[sessionID] = [];

                    // Generate a new token asynchronously with the recently created tokenOptions
                    mySession.generateToken(tokenOptions, function (token) {
                        // Store the new token in the collection of tokens
                        mapSessionIdTokens[sessionID].push(token);

                        sessionModel.getSession(sessionID, function(err, session) {
                            if (err) {
                                return res.status(500).send(err);
                            }

                            if (!session) {
                                return res.status(400).send("Incorrect session");
                            }
                            var sessionName = session.name;

                            return res.render('session.ejs', {
                                user: req.session.loggedUser,
                                ovSessionId: ovSessionId,
                                sessionID: sessionID,
                                token: token,
                                nickName: clientData,
                                userName: req.session.loggedUser,
                                sessionName: sessionName
                            });
                        });
                    });
                });
            }
        });
    }
}

exports.leaveSession = function(req, res) {
    if (req.session.loggedUser == null) {
        req.session.destroy();
        res.render('index.ejs');
    } else {
        // Retrieve params from POST body
        var sessionID = req.body.sessionID;
        var token     = req.body.token;

        console.log("id " + sessionID);
        console.log("token " + token);

        // If the session exists
        var mySession = mapSessionIDSession[sessionID];
        if (mySession) {
            mySession.getSessionId(function (ovSessionId) {
                var tokens = mapSessionIdTokens[sessionID];
                if (tokens) {
                    var index = tokens.indexOf(token);

                    // If the token exists
                    if (index !== -1) {
                        // Token removed!
                        tokens.splice(index, 1);
                    } else {
                        var msg = 'Problems in the app server: the TOKEN wasn\'t valid';
                        console.log(msg);
                        res.redirect('/home');
                    }
                    if (mapSessionIdTokens[sessionID].length == 0) {
                        // Last user left: session must be removed
                        delete mapSessionIDSession[sessionID];
                    }
                    res.redirect('/home');
                } else {
                    var msg = 'Problems in the app server: the SESSIONID wasn\'t valid';
                    console.log(msg);
                    res.redirect('/home');
                }
            });
        } else {
            var msg = 'Problems in the app server: the SESSION does not exist';
            console.log(msg);
            res.redirect('/home');
        }
    }
}
