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

  httpRequest('get', '/session', `{"friend": "${username}"}`, 'logout error', function( data ) {
    clearUsers();
    showUsers();
  });
});
