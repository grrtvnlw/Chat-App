let socket = io()
let user
let typing=false
let timeout=undefined

$(window).on('load',function(){
  $('#myModal').modal('show');
});

$(document).ready(() => {
  const socket = io();
  $('.chat-form').submit(e => {
    e.preventDefault();
    const value = $('.chat-input').val();
    socket.emit('chat message', value);
    $('.chat-input').val('');
  });

  function validateUser() {
    let name = $('#name').val();
    let re = /[A-Z][a-z]*/;
    if (re.test(name)) {
      $('#myModal').modal('hide');
    };
  };

  $('#join').on('click',function(){
      validateUser();
    });

  $("#join").click(e => {
    e.preventDefault();
    let name = $('#name').val();
    if (name != "") {
      socket.emit('join', name);
    } else {
      alert('Enter a username.');
    }
  });

  $("#join").keypress(e => {
    e.preventDefault();
    if(e.which == 13) {
      let name = $('#name').val();
      if (name != "") {
        socket.emit('join', name);
      } else {
        alert('Enter a username.');
      }
    };
  });

  $(".chat-input").keypress((e) => {
    if (e.which != 13) {
      typing = true
      socket.emit('typing', {user:user, typing:true})
      clearTimeout(timeout)
      timeout = setTimeout(typingTimeout, 1500)
    } else {
      clearTimeout(timeout)
      typingTimeout()
    }
  });

  socket.on('display', (data)=>{
    if (data.typing == true) {
      $('.typing').text(`${data.user} is typing...`)
    }
    else {
      $('.typing').text("")
    }
    });

  function typingTimeout(){
    typing = false
    socket.emit('typing', {user:user, typing:false})
  }

  socket.on('chat message', (message) => {
    const $newChat = $(`<li class="list-group-item">${message}</li>`);
    $('#messages').append($newChat);
  });

  socket.on('emitParticipants', (people) => {
    $('#online').html('');
    people.forEach((person) => {
      const $newName = $(`<li class="list-group-item">${person} is online 🌐</li>`);
      $('#online').append($newName);
    })
  });

  // socket.on('emitParticipants', (people) => {
  //   console.log('wid')
  //   $('#invite').html('');
  //   people.forEach((person) => {
  //     const $invite = $(`<a class="dropdown-item" href="#">${person} 🌐</a>`);
  //     $('#invite').append($invite);
  //   })
  // });

});