if (process.argv.length != 4) {
    console.log("Usage: node " + __filename + " OPENVIDU_URL OPENVIDU_SECRET");
    process.exit(-1);
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var express    = require('express');
var fs         = require('fs');
var session    = require('express-session');
var https      = require('https');
var bodyParser = require('body-parser');

var app        = express();

app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'MY_SECRET'
}));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.engine('ejs', require('ejs-locals'));

var PORT = 2727;
var options = {
    key:  fs.readFileSync(__dirname + '/ssl/server.key'),
    cert: fs.readFileSync(__dirname + '/ssl/server.crt')
};

// Start server
var db = require('./model/db');

db.connect('mongodb://localhost:27017', function(err) {
    if (err) {
        return console.log(err);
    }

    https.createServer(options, app).listen(PORT);
    console.log("server listen port: " + PORT);
});


/////////////////  API  /////////////////

var loginController    = require("./controller/login");
var sessionController  = require("./controller/session");
var registerController = require("./controller/registration");
var userController     = require("./controller/user");

app.get("/", loginController.login);

app.get("/register", registerController.register);
app.post("/register", registerController.addNewUser);

app.get("/home", loginController.home);
app.post("/home", loginController.home);

app.get("/about", loginController.about);

app.post("/logout", loginController.logout);

app.post('/session', sessionController.join);
app.post('/leave-session', sessionController.leaveSession);

app.post('/add-user', userController.addUser);
