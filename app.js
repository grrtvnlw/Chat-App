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

io.on('connection', (socket) => {
  socket.on('join', (name) => {
    console.log(`${name} connected`);
    people.push(name);
    peopleDict[socket.io] = name;
    console.log(people)
    socket.emit('chat message', `you have joined the chat. Hi ${name}!`);
    socket.broadcast.emit('chat message', `${name} has joined the chat.`)
    io.emit('emitParticipants', people);
  });

  socket.on('disconnect', () => {
    console.log(`${peopleDict[socket.io]} disconnected`);
    socket.broadcast.emit('chat message', `${peopleDict[socket.io]} has left the chat.`);
  });

  socket.on('chat message', (data) => {
    console.log('message:', data);
    console.log(`${peopleDict[socket.io]} says`, data)
    // const yellingMessage = data.toUpperCase();
    socket.emit('chat message', 'message sent.');
    socket.broadcast.emit('chat message', `${peopleDict[socket.io]} says ${data}`);
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
