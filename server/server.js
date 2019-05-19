const path = require('path');
const http = require('http');
const express = require('express');
const socket_io = require('socket.io');

const {generate_message, generate_location_message} = require('./utils/message');
const {is_real_string} = require('./utils/validation');

const public_path = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socket_io(server);

app.use(express.static(public_path));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('join', (params, callback) => {
        if (!is_real_string(params.name) || !is_real_string(params.room)){
            callback('name and room are required');
        }

        socket.join(params.room);

        socket.emit('newMessage', generate_message('Admin', 'welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generate_message('Admin', `${params.name} has joined`));

        callback();
    })

    socket.on('createMessage', (message, callback) => {
        io.emit('newMessage', generate_message(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generate_location_message('Admin', coords.latitude, coords.longitude));
    })

    socket.on('disconnect', () => {
        console.log('a user disconnected from server');
    });
});

server.listen(port, () => {
    console.log(`open on port ${port}`);
});