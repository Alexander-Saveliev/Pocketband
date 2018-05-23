function clearUsers() {
  $('#jq_find').empty();
  $('#jq_friends').empty();
  $('#jq_subscribers').empty();
  $('#jq_subscriptions').empty();
}

function showUsers() {
  addFriends();
  addSubscribers();
  addSubscriptions();
}

function addFriends() {
  httpRequest('post', '/get-friends', '', 'error loading friends', function( data ) {
    $(data).each(function(i, element) {
      addCardUser('jq_friends', element.username, element.id);
    });
  });
}

function addSubscribers() {
  httpRequest('post', '/get-subscribers', '', 'error loading friends', function( data ) {
    $(data).each(function(i, element) {
      addCardSubscriber('jq_subscribers', element.username, "You can add this persont to friends");
    });
  });
}

function addSubscriptions() {
  httpRequest('post', '/get-subscriptions', '', 'error loading friends', function( data ) {
    $(data).each(function(i, element) {
      addCardUser('jq_subscriptions', element.username, element.id);
    });
  });
}

$(function() {
    $('form').submit(function(e) {
        $('#jq_find').empty();
        $('#send').hide();
        $('#login_message').html('<img src="img/loading.gif" alt="">');

        var $form = $(this);
        $('#jq_find').empty();
        $.ajax({
          type: $form.attr('method'),
          url: $form.attr('action'),
          data: $form.serialize()
        }).done(function( data ) {
          $(data).each(function(i, element) {
            addCardSubscriber('jq_find', element.username, "You can add this persont to friends");
          });

          if (data.length == 0) {
            $('#login_message').text("I've found nothing");
          } else {
            $('#login_message').text("See below what i've found");
          }
          $('#send').show();
        }).fail(function( data ) {
          $('#login_message').text("Something was wrong");
          $('#send').show();
        });
        //отмена действия по умолчанию для кнопки submit
        e.preventDefault();
    });
});

$( '#logout' ).click(function() {
  httpRequest('post', '/logout', '', 'logout error', function( data ) {
      window.location = "/";
  });
});

//jquery почемуто здесь не работает
$('body').on('click', '.add-friend-card', function() {
  var username = $(this).prev().prev().text();

  httpRequest('post', '/add-user', `{"friend": "${username}"}`, 'logout error', function( data ) {
    clearUsers();
    showUsers();
  });
});


showUsers();
