import express from 'express';
import path from 'path';
import socketIO from 'socket.io';
import http from 'http';
import { ChatClient } from './src/chatclient';
import { Pong } from './src/pong/pong';
import { PongClient } from './src/pongclient';

//-------
// Setup
//-------
const PORT = process.env.PORT || 5000;

let app = express();
let server: http.Server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/css/bootstrap.min.css', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/bootstrap.min.css"));
})
app.get('/css/bootstrap.min.css.map', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/bootstrap.min.css.map"));
})
app.get('/js/bootstrap.min.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/js/bootstrap.min.js"));
})
app.get('/js/bootstrap.min.js.map', function(req, res){
    res.sendFile(path.join(__dirname + "/views/js/bootstrap.min.js.map"));
})
app.get('/js/jquery-3.4.1.min.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/js/jquery-3.4.1.min.js"));
})
app.get('/css/home.css', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/home.css"));
});
app.get('/css/pong.css', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/pong.css"));
});
app.get('/ts/home.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/ts/home.js"));
});
app.get('/ts/pong.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/ts/pong.js"));
});
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + "/views/html/home.html"));
});
app.get('/pong', function(req, res){
    res.sendFile(path.join(__dirname + "/views/html/pong.html"));
});

const io: socketIO.Server = socketIO(server);

//------
// Code
//------
let chatClients: ChatClient[] = [];
let pongClients: PongClient[] = [];
let id: number = 0;
let pong: Pong = new Pong();

function update(){
    pong.update(io);
    io.emit('update', pong);
}
setInterval(update, 20);

io.on('connection', (socket: any) =>{
    socket.on('username', function(username: string){
        socket.id = id;
        chatClients.push(new ChatClient(id, username));
        id++;
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var print = '<strong>[' + time + ']</strong>' + '<i>' + username + ' joined the chat...</i>';
        io.emit('is_online', print);
        io.emit('clients', chatClients);

    });
    socket.on('pong_player', function(){
        socket.id = id;
        pongClients.push(new PongClient(id));
        id++;
        // Activate pong
        if(pongClients.length >= 2){
            pong.startGame(io);
        }
    })

    socket.on('disconnect', function(){
        if(isChatClient()){
            findChatClient(function(index: number){
                let username: string = chatClients[index].username;
                chatClients.splice(index, 1);
                var today = new Date();
                var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                var print = '<strong>[' + time + ']</strong>' + '<i>' + username + ' left the chat...</i>';
                io.emit('is_online', print);
                io.emit('clients', chatClients);
            });
        }
        else if(isPongClient()){
            findPongClient(function(index: number){
                pongClients.splice(index, 1);
                // Deactivate pong
                if(pongClients.length < 2){
                    pong.stopGame();
                }
            })
        }
    });

    socket.on('chat_message', function(message: string){
        findChatClient(function(index: number){
            let username: string = chatClients[index].username;
            var today = new Date();
            var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
            var print = '<strong>[' + time + ']</strong>' +'<strong>' + username +"</strong>: " + message
            io.emit('chat_message', print);
        });
    });

    socket.on('move_down', function(){
        findPongClient(function(index: number){
            if(pong.run){
                if(index === 0){
                    pong.player1.moveDown();
                }
                else if(index === 1){
                    pong.player2.moveDown();
                }
            }
        });
    })
    socket.on('move_up', function(){
        findPongClient(function(index: number){
            if(pong.run){
                if(index === 0){
                    pong.player1.moveUp();
                }
                else if(index === 1){
                    pong.player2.moveUp();
                }
            }
        });
    })
    socket.on('move_stop', function(){
        findPongClient(function(index: number){
            if(pong.run){
                if(index === 0){
                    pong.player1.stopMoving();
                }
                else if(index === 1){
                    pong.player2.stopMoving();
                }
            }
        });
    })

    function findChatClient(execute: any){
        let index: number = chatClients.findIndex(client => client.id === socket.id);
        if(index !== -1) execute(index);
    }

    function isChatClient():boolean{
        let index: number = chatClients.findIndex(client => client.id === socket.id);
        if(index !== -1) return true;
        return false;
    }

    function findPongClient(execute: any){
        let index: number = pongClients.findIndex(client => client.id === socket.id);
        if(index !== -1) execute(index);

    }

    function isPongClient(): boolean{
        let index: number = pongClients.findIndex(client => client.id === socket.id);
        if(index !== -1) return true;
        return false;
    }
})

