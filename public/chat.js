// let typing = false;
// let timeout = undefined;
// let user;

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
    let modal = document.querySelector('#myModal')
    if (re.test(name)) {
      $('#myModal').modal('hide');
    };
  };

  $('#join').on('click',function(){
      validateUser();
    });

  $('.chat-form').keypress((e)=>{
    if(e.which != 13){
      typing=true
      socket.emit('typing', {user:user, typing:true})
      clearTimeout(timeout)
      timeout=setTimeout(typingTimeout, 3000)
    }else{
      clearTimeout(timeout)
      typingTimeout()
      //sendMessage() function will be called once the user hits enter
      sendMessage()
    }
  })

  $("#join").click(e => {
    e.preventDefault();
    let name = $('#name').val();
    if (name != "") {
      socket.emit('join', name);
    } else {
      alert('Enter a name, nameless!');
    }
  });

  $("#join").keypress(e => {
    e.preventDefault();
    if(e.which == 13) {
      let name = $('#name').val();
      if (name != "") {
        socket.emit('join', name);
      } else {
        alert('Enter a name, nameless!');
      }
    };
  });

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

  socket.on('emitParticipants', (people) => {
    console.log('wid')
    $('#invite').html('');
    people.forEach((person) => {
      const $invite = $(`<a class="dropdown-item" href="#">${person} 🌐</a>`);
      $('#invite').append($invite);
    })
  });

});