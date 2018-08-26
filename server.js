const callbacks = require('./callbacks').callbacks;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let messages = [{name: 'Tim', message: 'Hi'}, {name: 'Jane', message: 'Hello'}];

app.get('/messages', (req, res) => {
  res.send(messages);
});

app.post('/messages', (req, res) => {
  messages.push(req.body);
  io.emit('message', req.body);
  res.sendStatus(200);
});

var server = http.listen(4200, () => {
  console.log('server started on port', server.address().port);
});