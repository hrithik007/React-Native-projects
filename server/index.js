var express = require('express');
var http =require('http');
var socketio = require('socket.io');
var mongojs = require('mongojs');

var ObjectID = mongojs.ObjectID;
var db = mongojs(process.env.Mongo_URL || 'mongodb://localhost:27017/local');
var app = express();
var server = http.Server(app);
var weebsocket = socketio(server);
server.listen(3000, () => console.log('listening on: '+ ':3000'));

var clients = {};
var users   = {};

var chatId = 1;

websocket.on('connection', (socket) => {
    clients[socket.id] = socket;
    socket.on('userJoined', (userId) => onUserJoined(userId, socket));
    socket.on('message', (message) => onMessageReceived(message, socket));

})

function onUserJOined(userId, socket) {
    try {
        if (!userId) {
            var user = db.collection('user').insert({}, (err, user)) => {
                socket.emit('userJoined', user._id);
                users[socket.id] = user._id;
                _sendExistingMessages(socket);

            });
        } else {
            users[socket.id] = userId;
            _sendExistingMessages(socket);
        }
    }  catch(err) {
        console.err(err);
    }
}

function onMessageReceived(message, senderSocket) {
    var userId = users[senderSocket.id];
    if (!userId) return;

    _sendAndSaveMessage(message, senderSocket);
}

function _sendExistingMessages(socket) {
    var message = db.collection('message')
    .find({chatId})
    .sort({createdAt: 1})
    .toArray((err, messages) => {
        if (!messages.length) return;
        socket.emit('message', message.reverse());
    })
}

function _sendAndsaveMessage(message, socket, fromServer) {
    var messageDate = {
        text: message.text,
        user: message.user,
        createdAt: new Date(message.createdAt),
        chatId: chatId
    };

    db.collection('messages').insert(messageDate, (err, message) => {
        var emitter = fromServer ? websocket : socket.broadcast;
        emitter.emit('message', [message]);
    })

    var stdin = process.openStdin();
    stdin.addListener('data', function(d) {
        _sendAndSaveMessage({
            text: d.toStriing().trim(),
            user: {_id: 'robot'}

        })
    }, null, true);
}







