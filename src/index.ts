import express from 'express'
import socketIO from 'socket.io';
import {Client} from './client';
const PORT = process.env.PORT || 5000;
const INDEX = "/html/index.html";

const server = express()
.use((req, res) => res.sendFile(INDEX, {root: __dirname}))
.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

let clients: Client[] = [];
let id: number = 0;

io.on('connection', (socket: any) =>{
    socket.on('username', function(username: string){
        socket.id = id;
        clients.push(new Client(id, username, 5, 5));
        id++;
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' + '<i>' + socket.username + ' joined the chat...</i>';
        io.emit('is_online', print);
        io.emit('clients', clients);
    });

    socket.on('disconnect', function(){
        clients.splice(clients.findIndex(client => client.id === socket.id), 1);
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' + '<i>' + socket.username + ' left the chat...</i>';
        io.emit('is_online', print);
        io.emit('clients', clients);
    });

    socket.on('chat_message', function(message: string){
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' +'<strong>' + socket.username +"</strong>: " + message
        io.emit('chat_message', print);
    });

    socket.on('move_down', function(){
        var index = clients.findIndex(client => client.id === socket.id);
        clients[index].y += 5;
        io.emit('clients', clients);
    })
    socket.on('move_up', function(){
        var index = clients.findIndex(client => client.id === socket.id);
        clients[index].y -= 5;
        io.emit('clients', clients);
    })
    socket.on('move_right', function(){
        var index = clients.findIndex(client => client.id === socket.id);
        clients[index].x += 5;
        io.emit('clients', clients);
    })
    socket.on('move_left', function(){
        var index = clients.findIndex(client => client.id === socket.id);
        clients[index].x -= 5;
        io.emit('clients', clients);

    })
})

