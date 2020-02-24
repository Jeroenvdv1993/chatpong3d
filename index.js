const express = require('express');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 5000;
const INDEX = "/html/index.html";

const server = express()
.use((req, res) => res.sendFile(INDEX, {root: __dirname}))
.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) =>{
    console.log('Client connected');
    
    socket.on('username', function(username){
        socket.username = username;
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' + '<i>' + socket.username + ' joined the chat...</i>';
        io.emit('is_online', print);
    });

    socket.on('disconnect', function(username){
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' + '<i>' + socket.username + ' left the chat...</i>';
        io.emit('is_online', print);
    });

    socket.on('chat_message', function(message){
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' +'<strong>' + socket.username +"</strong>: " + message
        io.emit('chat_message', print);
    });
})

