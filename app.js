const express = require('express');
const PORT = process.env.PORT || 3000;

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let people = [];
let peopleDict = {};

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Chat App',
  });
});

app.get('/private', (req, res) => {
  res.render('private', {
    title: 'Private Chat',
    invites: people,
  });
});

io.on('connection', (socket) => {
  socket.on('join', (name) => {
    people.push(name);
    peopleDict[socket.id] = name;
    console.log(peopleDict)
    socket.emit('chat message', `you have joined the chat. Hi ${name}!`);
    socket.broadcast.emit('chat message', `${name} has joined the chat.`)
    io.emit('emitParticipants', people);
  });

  socket.on('disconnect', () => {
    let offline = peopleDict[socket.id];
    socket.broadcast.emit('chat message', `${peopleDict[socket.id]} has left the chat.`);
    let updatedPeople = people.filter(item => {
      return item != offline;
    });
    people = updatedPeople
    io.emit('emitParticipants', people);
  });

  socket.on('chat message', (data) => {
    socket.emit('chat message', 'message sent.');
    socket.broadcast.emit('chat message', `${peopleDict[socket.id]} says ${data}`);
  });

  socket.on('display', (data) => {
    console.log(`${data} on display`)
    if (data.typing==true)
      console.log(`${data.user} is typing...`);
    else
      console.log('stopped typing');
  })

});

http.listen(PORT, () => {
  console.log(`Chat is running: Listening on http://localhost:${PORT}`);
});
