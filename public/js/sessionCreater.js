$( '#logout' ).click(function() {
  httpRequest('post', '/logout', '', 'logout error', function( data ) {
      window.location = "/";
  });
});

$('form').submit(function(e) {
    $('#send').hide();
    $('#session-creater-message').html('<img src="img/loading.gif" alt="">');

    var $form = $(this);
    var data = $form.serialize() + '&participants=' + participants;

    $.ajax({
      type: $form.attr('method'),
      url: $form.attr('action'),
      data: data
    }).done(function() {
      console.log("Done");
      window.location = "/";
    }).fail(function( data ) {
      console.log("Failed");
      $('#send').show();
      $('#session-creater-message').text(data.responseText);
    });
    //отмена действия по умолчанию для кнопки submit
    e.preventDefault();
});

var participants = [];

function addFriends() {
  httpRequest('post', '/get-friends', '', 'error loading friends', function( data ) {
    $(data).each(function(i, element) {
      addCardFriendWithButtonId('jq_friends', element.username, "You can add this person", element.id);
    });
  });
}

$('body').on('click', '.add-friend-card', function() {
  var userID = $(this).attr('id');
  if ($.inArray(userID, participants) != -1) {
    $('#session_creater_message').text("This person is here already");
  } else {
    var username = $(this).prev().prev().text();

    removeCardSubscriber('jq_participants', username, "", userID);
    $(this).parent().parent().detach();
  }
});

$('body').on('click', '.remove-friend-card', function() {
  var username = $(this).prev().prev().text();
  var userID = $(this).attr('id');

  var i = participants.indexOf(username);
  if (i != -1) {
	     participants.splice(i, 1);
  }

  addCardFriendWithButtonId('jq_friends', username, "You can add this person", userID);
  $(this).parent().parent().detach();
});

addFriends();
