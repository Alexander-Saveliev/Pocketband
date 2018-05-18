// Get all the attributes from the template in EJS style
var sessionId = <%- JSON.stringify(sessionId) %>;
var token = <%- JSON.stringify(token) %>;
var nickName = <%- JSON.stringify(nickName) %>;
var userName = <%- JSON.stringify(userName) %>;
var sessionName = <%- JSON.stringify(sessionName) %>;
console.warn('Request of SESSIONID and TOKEN gone WELL (SESSIONID:' +
  sessionId + ", TOKEN:" + token + ")");

// --- 1) Get an OpenVidu object and init a session with the retrieved sessionId ---

var OV = new OpenVidu();
var session = OV.initSession(sessionId);


// --- 2) Specify the actions when events take place ---

// On every new Stream received...
session.on('streamCreated', function (event) {

  // Subscribe to the Stream to receive it
  // HTML video will be appended to element with 'video-container' id
  var subscriber = session.subscribe(event.stream, 'video-container');

  // When the HTML video has been appended to DOM...
  subscriber.on('videoElementCreated', function (event) {

    // Add a new HTML element for the user's name and nickname just below its video
    appendUserData(event.element, subscriber.stream.connection);
  });
});

// On every Stream destroyed...
session.on('streamDestroyed', function (event) {
  // Delete the HTML element with the user's name and nickname
  removeUserData(event.stream.connection);
});


// --- 3) Connect to the session passing the retrieved token and some more data from
//         the client (in this case a JSON with the nickname chosen by the user) ---

session.connect(token, '{"clientData": "' + nickName + '"}', function (error) {

  // If the connection is successful, initialize a publisher and publish to the session
  if (!error) {

    // Here we check somehow if the user has at least 'PUBLISHER' role before
    // trying to publish its stream. Even if someone modified the client's code and
    // published the stream, it wouldn't work if the token sent in Session.connect
    // method doesn't belong to a 'PUBLIHSER' role
    if (isPublisher()) {

      // --- 4) Get your own camera stream ---

      var publisher = OV.initPublisher('video-container', {
        audio: true,        // Whether you want to transmit audio or not
        video: true,        // Whether you want to transmit video or not
        audioActive: true,  // Whether you want to start the publishing with your audio unmuted or muted
        videoActive: true,  // Whether you want to start the publishing with your video enabled or disabled
        quality: 'MEDIUM',  // The quality of your video ('LOW', 'MEDIUM', 'HIGH')
        screen: false       // true to get your screen as video source instead of your camera
      });

      // When our HTML video has been added to DOM...
      publisher.on('videoElementCreated', function (event) {
        // Init the main video with ours and append our data
        var userData = {
          nickName: nickName,
          userName: userName
        };
        initMainVideo(event.element, userData);
        appendUserData(event.element, userData);
        $(event.element).prop('muted', true); // Mute local video
      });


      // --- 5) Publish your stream ---

      session.publish(publisher);

    } else {
      console.warn('You don\'t have permissions to publish');
      initMainVideoThumbnail(); // Show SUBSCRIBER message in main video
    }
  } else {
    console.warn('There was an error connecting to the session:', error.code, error.message);
  }
});


function leaveSession() {

  // --- 6) Leave the session by calling 'disconnect' method over the Session object ---
  session.disconnect();
}

function appendUserData(videoElement, connection) {
  var clientData;
  var serverData;
  var nodeId;
  if (connection.nickName) { // Appending local video data
    clientData = connection.nickName;
    serverData = connection.userName;
    nodeId = 'main-videodata';
  } else {
    clientData = JSON.parse(connection.data.split('%/%')[0]).clientData;
    serverData = JSON.parse(connection.data.split('%/%')[1]).serverData;
    nodeId = connection.connectionId;
  }
  var dataNode = document.createElement('div');
  dataNode.className = "data-node";
  dataNode.id = "data-" + nodeId;
  dataNode.innerHTML = '<p class="nickName">' + clientData + '</p><p class="userName">' + serverData + '</p>';
  videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);
  addClickListener(videoElement, clientData, serverData);
}

function removeUserData(connection) {
  var userNameRemoved = $("#data-" + connection.connectionId);
  if ($(userNameRemoved).find('p.userName').html() === $('#main-video p.userName').html()) {
    cleanMainVideo(); // The participant focused in the main video has left
  }
  $("#data-" + connection.connectionId).remove();
}

function removeAllUserData() {
  $(".data-node").remove();
}

function cleanMainVideo() {
  $('#main-video video').get(0).srcObject = null;
  $('#main-video p').each(function () {
    $(this).html('');
  });
}

function addClickListener(videoElement, clientData, serverData) {
  videoElement.addEventListener('click', function () {
    var mainVideo = $('#main-video video').get(0);
    if (mainVideo.srcObject !== videoElement.srcObject) {
      $('#main-video p.nickName').html(clientData);
      $('#main-video p.userName').html(serverData);
      mainVideo.srcObject = videoElement.srcObject;
    }
  });
}

function initMainVideo(videoElement, userData) {
  $('#main-video video').get(0).srcObject = videoElement.srcObject;
  $('#main-video p.nickName').html(userData.nickName);
  $('#main-video p.userName').html(userData.userName);
  $('#main-video video').prop('muted', true);
}

function initMainVideoThumbnail() {
  $('#main-video video').css("background", "url('images/subscriber-msg.jpg') round");
}

function isPublisher() {
  return userName.includes('publisher');
}
