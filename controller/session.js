var password = require('../model/password');

var OpenVidu = require('openvidu-node-client').OpenVidu;
var Session = require('openvidu-node-client').Session;
var OpenViduRole = require('openvidu-node-client').OpenViduRole;
var TokenOptions = require('openvidu-node-client').TokenOptions;

// Collection to pair session names and OpenVidu Session objects
var mapSessionNameSession = {};
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
       	// The nickname sent by the client
        var clientData = req.session.loggedUser;
        // The video-call to connect ("TUTORIAL")
        var sessionName = req.body.sessionname;

        // Optional data to be passed to other users when this user connects to the video-call
        // In this case, a JSON with the value we stored in the req.session object on login
        var serverData = '{"serverData": "' + req.session.loggedUser + '"}';

        console.log("Getting sessionId and token | {sessionName}={" + sessionName + "}");

        // Build tokenOptions object with the serverData and the role
        var tokenOptions = new TokenOptions.Builder()
            .data(serverData)
            .build();

        if (mapSessionNameSession[sessionName]) {
            // Session already exists: return existing sessionId and a new token
            console.log('Existing session ' + sessionName);

            // Get the existing Session from the collection
            var mySession = mapSessionNameSession[sessionName];

            // Generate a new token asynchronously with the recently created tokenOptions
            mySession.generateToken(tokenOptions, function (token) {

                // Get the existing sessionId
                mySession.getSessionId(function (sessionId) {

                    // Store the new token in the collection of tokens
                    mapSessionIdTokens[sessionId].push(token);

                    // Return session template with all the needed attributes
                    console.log('SESSIONID: ' + sessionId);
                    console.log('TOKEN: ' + token);
                    res.render('session.ejs', {
                        user: req.session.loggedUser,
                        sessionId: sessionId,
                        token: token,
                        nickName: clientData,
                        userName: req.session.loggedUser,
                        sessionName: sessionName
                    });
                });
            });
        } else { // New session: return a new sessionId and a new token
            console.log('New session ' + sessionName);

            // Create a new OpenVidu Session
            var mySession = OV.createSession();

            // Get the sessionId asynchronously
            mySession.getSessionId(function (sessionId) {

                // Store the new Session in the collection of Sessions
                mapSessionNameSession[sessionName] = mySession;
                // Store a new empty array in the collection of tokens
                mapSessionIdTokens[sessionId] = [];

                // Generate a new token asynchronously with the recently created tokenOptions
                mySession.generateToken(tokenOptions, function (token) {

                    // Store the new token in the collection of tokens
                    mapSessionIdTokens[sessionId].push(token);

                    console.log('SESSIONID: ' + sessionId);
                    console.log('TOKEN: ' + token);

                    // Return session template with all the needed attributes
                    res.render('session.ejs', {
                        user: req.session.loggedUser,
                        sessionId: sessionId,
                        token: token,
                        nickName: clientData,
                        userName: req.session.loggedUser,
                        sessionName: sessionName
                    });
                });
            });
        }
    }
}

exports.leaveSession = function(req, res) {
    if (req.session.loggedUser == null) {
        req.session.destroy();
        res.render('index.ejs');
    } else {
        // Retrieve params from POST body
        var sessionName = req.body.sessionname;
        var token = req.body.token;
        console.log('Removing user | {sessionName, token}={' + sessionName + ', ' + token + '}');

        // If the session exists
        var mySession = mapSessionNameSession[sessionName];
        if (mySession) {
            mySession.getSessionId(function (sessionId) {
                var tokens = mapSessionIdTokens[sessionId];
                if (tokens) {
                    var index = tokens.indexOf(token);

                    // If the token exists
                    if (index !== -1) {
                        // Token removed!
                        tokens.splice(index, 1);
                        console.log(sessionName + ': ' + mapSessionIdTokens[sessionId].toString());
                    } else {
                        var msg = 'Problems in the app server: the TOKEN wasn\'t valid';
                        console.log(msg);
                        res.redirect('/home');
                    }
                    if (mapSessionIdTokens[sessionId].length == 0) {
                        // Last user left: session must be removed
                        console.log(sessionName + ' empty!');
                        delete mapSessionNameSession[sessionName];
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
