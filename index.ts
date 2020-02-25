import express from 'express';
import path from 'path';
import socketIO from 'socket.io';
import http from 'http';
import {Client} from './src/client';
const PORT = process.env.PORT || 5000;

let app = express();
let server: http.Server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/css/bootstrap.min.css', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/bootstrap.min.css"));
})
app.get('/js/bootstrap.min.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/js/bootstrap.min.js"));
})
app.get('/js/jquery-3.4.1.min.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/js/jquery-3.4.1.min.js"));
})
app.get('/css/home.css', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/home.css"));
});
app.get('/ts/home.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/ts/home.js"));
});
app.get('/ts/helloworld.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/ts/helloworld.js"));
});
app.get('/ts/test.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/ts/test.js"));
});
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + "/views/html/home.html"));
});

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
        var print = '<strong>[' + time + ']</strong>' + '<i>' + username + ' joined the chat...</i>';
        io.emit('is_online', print);
        io.emit('clients', clients);
    });

    socket.on('disconnect', function(){
        let index: number = clients.findIndex(c => c.id === socket.id);
        let username: string = clients[index].username;
        clients.splice(index, 1);
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' + '<i>' + username + ' left the chat...</i>';
        io.emit('is_online', print);
        io.emit('clients', clients);
    });

    socket.on('chat_message', function(message: string){
        let index: number = clients.findIndex(c => c.id === socket.id);
        let username: string = clients[index].username;
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' +'<strong>' + username +"</strong>: " + message
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

