const path = require('path');
const http = require('http');
const express = require('express');
const socket_io = require('socket.io');

const public_path = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socket_io(server);

app.use(express.static(public_path));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('disconnect', () => {
        console.log('a user disconnected from server');
    });
});

server.listen(port, () => {
    console.log(`open on port ${port}`);
});