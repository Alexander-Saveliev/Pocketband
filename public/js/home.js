$( '#logout' ).click(function() {
  httpRequest('post', '/logout', '', 'logout error', function( data ) {
      window.location = "/";
  });
});

function addSessions() {
  httpRequest('post', '/get-sessions', '', 'error loading friends', function( data ) {
    $(data).each(function(i, element) {
      joinCardSession('jq_sessions', element.name, element.description, element._id);
    });
  });
}

addSessions();

$('body').on('click', '.join-session-card', function() {
  var username = $(this).prev().prev().text();
  var sessionId = $(this).attr('id');

  httpRequestRaw('post', '/session', `{"sessionID": "${sessionId}"}`, 'logout error', function( data ) {
    document.open();
    document.write(data);
    document.close();
  });
});
