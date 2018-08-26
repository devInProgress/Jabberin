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

const Message = mongoose.model('Message', {
  name: String,
  message: String
});

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post('/messages', (req, res) => {
  const message = new Message(req.body);
  message.save((err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      io.emit('message', req.body);
      res.sendStatus(200);
    }
  });
});

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
  err ? console.log(err) : console.log('Connected to MongoDB');
});

var server = http.listen(3038, () => {
  console.log('server started on port', server.address().port);
});