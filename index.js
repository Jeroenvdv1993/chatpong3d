const express = require('express');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 5000;
const INDEX = "/html/index.html";

const server = express()
.use((req, res) => res.sendFile(INDEX, {root: __dirname}))
.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

var clients = [];
var x = 5;

io.on('connection', (socket) =>{
    socket.on('username', function(username){
        socket.username = username;
        clients.push({username: username, x: x, y: 5});
        x += 20;
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' + '<i>' + socket.username + ' joined the chat...</i>';
        io.emit('is_online', print);
        io.emit('clients', clients);
    });

    socket.on('disconnect', function(username){
        //TODO remove active account
        clients.splice(clients.findIndex(client => client.username === socket.username), 1);
        x-= 5;
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' + '<i>' + socket.username + ' left the chat...</i>';
        io.emit('is_online', print);
        io.emit('clients', clients);
    });

    socket.on('chat_message', function(message){
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' +'<strong>' + socket.username +"</strong>: " + message
        io.emit('chat_message', print);
    });

    socket.on('move_down', function(distance){
        var index = clients.findIndex(client => client.username === socket.username);
        clients[index].y += distance;
        io.emit('clients', clients);
    })
    socket.on('move_right', function(distance){
        var index = clients.findIndex(client => client.username === socket.username);
        clients[index].x += distance;
        io.emit('clients', clients);
    })
})

