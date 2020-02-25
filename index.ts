import express from 'express';
import path from 'path';
import socketIO from 'socket.io';
import http from 'http';
import {Client} from './src/client';
import { Pong } from './src/pong/pong';

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

//------
// Code
//------
let clients: Client[] = [];
let id: number = 0;
let pong: Pong = new Pong();
function update(){
    pong.update();
    io.emit('update', pong);
}
setInterval(update, 20);

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

        // Activate pong
        if(clients.length >= 2){
            console.log("starting pong");
            pong.startGame();
        }
    });

    socket.on('disconnect', function(){
        findClient(function(index: number){
            let username: string = clients[index].username;
            clients.splice(index, 1);
            var today = new Date();
            var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
            var print = '<strong>[' + time + ']</strong>' + '<i>' + username + ' left the chat...</i>';
            io.emit('is_online', print);
            io.emit('clients', clients);

            // Deactivate pong
            if(clients.length < 2){
                console.log("stopping pong");
                pong.stopGame();
            }
        });
    });

    socket.on('chat_message', function(message: string){
        findClient(function(index: number){
            let username: string = clients[index].username;
            var today = new Date();
            var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
            var print = '<strong>[' + time + ']</strong>' +'<strong>' + username +"</strong>: " + message
            io.emit('chat_message', print);
        });
    });

    socket.on('move_down', function(){
        findClient(function(index: number){
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
        findClient(function(index: number){
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
        findClient(function(index: number){
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

    function findClient(execute: any){
        let index: number = clients.findIndex(client => client.id === socket.id);
        if(index !== -1) execute(index);
    }
})

