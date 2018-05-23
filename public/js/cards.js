function addCardSubscriber(toElementWithID, title, body) {
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
        .add($('<button>', {
          type: 'button',
          name: 'button',
          class: 'btn btn-primary add-friend-card',
          text: 'Add'
        }))
      })
    })
  }).appendTo("#" + toElementWithID);
}

function removeCardSubscriber(toElementWithID, title, body, buttonID) {
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
        .add($('<button>', {
          type: 'button',
          name: 'button',
          class: 'btn btn-danger remove-friend-card',
          id: buttonID,
          text: 'Remove'
        }))
      })
    })
  }).appendTo("#" + toElementWithID);
}

function addCardFriendWithButtonId(toElementWithID, title, body, buttonID) {
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
        .add($('<button>', {
          type: 'button',
          name: 'button',
          class: 'btn btn-primary add-friend-card',
          id: buttonID,
          text: 'Add'
        }))
      })
    })
  }).appendTo("#" + toElementWithID);
}

function addCardUser(toElementWithID, title, body) {
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
      })
    })
  }).appendTo("#" + toElementWithID);
}


function joinCardSession(toElementWithID, title, body, buttonID) {
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
        .add($('<button>', {
          type: 'button',
          name: 'button',
          class: 'btn btn-warning join-session-card',
          id: buttonID,
          text: 'Join'
        }))
      })
    })
  }).appendTo("#" + toElementWithID);
}
