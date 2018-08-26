const callbacks = require('./callbacks').callbacks;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const dbUrl = 'mongodb://naved1234:n%40ved786@ds131942.mlab.com:31942/db-node';

let messages = [{name: 'Tim', message: 'Hi'}, {name: 'Jane', message: 'Hello'}];

app.get('/messages', (req, res) => {
  res.send(messages);
});

app.post('/messages', (req, res) => {
  messages.push(req.body);
  io.emit('message', req.body);
  res.sendStatus(200);
});

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
  console.log('mongo db connection', err);
});

var server = http.listen(3030, () => {
  console.log('server started on port', server.address().port);
});