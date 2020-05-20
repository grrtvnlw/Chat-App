let typing = false;
let timeout = undefined;
let user;

$(document).ready(() => {
  const socket = io();
  $('.chat-form').submit(e => {
    e.preventDefault();
    const value = $('.chat-input').val();
    socket.emit('chat message', value);
    $('.chat-input').val('');
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

});