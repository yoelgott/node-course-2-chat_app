const path = require('path');
const http = require('http');
const express = require('express');
const socket_io = require('socket.io');

const {generate_message, generate_location_message} = require('./utils/message');
const {is_real_string} = require('./utils/validation');
const {Users} = require('./utils/users');

const public_path = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socket_io(server);
var users = new Users();

app.use(express.static(public_path));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('join', (params, callback) => {
        if (!is_real_string(params.name) || !is_real_string(params.room)){
            return callback('name and room are required');
        }

        socket.join(params.room);
        users.remove_user(socket.id);
        users.add_user(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.get_user_list(params.room));
        socket.emit('newMessage', generate_message('Admin', 'welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generate_message('Admin', `${params.name} has joined`));

        callback();
    })

    socket.on('createMessage', (message, callback) => {
        var user = users.get_user(socket.id);

        if (user && is_real_string(message.text)) {
            io.to(user.room).emit('newMessage', generate_message(user.name, message.text));
        };

        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.get_user(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generate_location_message(user.name, coords.latitude, coords.longitude));
        };
    })

    socket.on('disconnect', () => {
        console.log('a user disconnected from server');

        var user = users.remove_user(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.get_user_list(user.room));
            io.to(user.room).emit('newMessage', generate_message('Admin', `${user.name} has left the chat room`));

        }
    });
});

server.listen(port, () => {
    console.log(`open on port ${port}`);
});