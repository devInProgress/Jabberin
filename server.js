const callbacks = require('./callbacks').callbacks;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

mongoose.Promise = Promise;

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

app.post('/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    console.log('Message Saved');
    const censored = await Message.findOne({message: 'badword'});
    if (censored) {
      await Message.remove({_id: censored._id});
    } else {
        io.emit('message', req.body);
        res.sendStatus(200);
    }
  } catch (error) {
      res.sendStatus(500);
      return console.error(error);
    }
});

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
  err ? console.log(err) : console.log('Connected to MongoDB');
});

var server = http.listen(3000, () => {
  console.log('server started on port', server.address().port);
});

