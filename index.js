const express = require('express');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 5000;
const INDEX = "/index.html";

const server = express()
.use((req, res) => res.sendFile(INDEX, {root: __dirname}))
.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) =>{
    console.log('Client connected');
    
    socket.on('username', function(username){
        socket.username = username;
        io.emit('is_online', '<i>' + socket.username + ' join the chat...</i>');
    });

    socket.on('disconnect', function(username){
        io.emit('is_online', '<i>' + socket.username + ' left the chat...</i>');
    });

    socket.on('chat_message', function(message){
        io.emit('chat_message', '<strong>' + socket.username +"</strong>: " + message);
    });
})

