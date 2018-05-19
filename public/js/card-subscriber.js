function addCard(toElementWithID, title, body) {
  $('<div>', {
    class: 'col-sm-6 col-md-4 col-lg-3',
    css: {
      padding: '20px',
    },
    append: $('<div>', {
      class: 'card',
      append: $('<div>', {
        class: 'card-body',
        append: $('<h5>', {
          class: 'card-title',
          text: title,
        })
        .add($('<p>', {
          class: 'card-text',
          text: body,
        }))
        .add($('<a>', {
          class: 'btn btn-primary',
          text: "Add",
          href: "#"
        }))

      })
    })
  }).appendTo("#" + toElementWithID);
}
