$(function() {
    $('form').submit(function(e) {
        var $form = $(this);
        $.ajax({
          type: $form.attr('method'),
          url: $form.attr('action'),
          data: $form.serialize()
        }).done(function() {
          //window.location = "/";
        }).fail(function( data ) {
          // $('#send').show();
          // $('#login_message').text(data.responseText);
        });
        //отмена действия по умолчанию для кнопки submit
        e.preventDefault();
    });
});
