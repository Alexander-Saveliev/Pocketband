$(function() {
    $('form').submit(function(e) {
        $('#send').hide();
        $('#login_message').html('<img src="img/loading.gif" alt="">');

        var $form = $(this);
        $.ajax({
          type: $form.attr('method'),
          url: $form.attr('action'),
          data: $form.serialize()
        }).done(function() {
          window.location = "/";
        }).fail(function( data ) {
          $('#send').show();
          $('#login_message').text(data.responseText);
        });
        //отмена действия по умолчанию для кнопки submit
        e.preventDefault();
    });
});
