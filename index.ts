import express from 'express';
import path from 'path';
import socketIO from 'socket.io';
import http from 'http';
import { ChatClient } from './src/chatclient';
import { Pong } from './src/pong/pong';
import { PongClient } from './src/pongclient';
import { CardClient} from './src/cardclient';
import fs from 'fs';

//-------
// Setup
//-------
const PORT = process.env.PORT || 5000;

let app = express();
let server: http.Server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

////////////////
// JAVASCRIPT //
////////////////
app.get('/js/bootstrap.min.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/js/bootstrap.min.js"));
})
app.get('/js/bootstrap.min.js.map', function(req, res){
    res.sendFile(path.join(__dirname + "/views/js/bootstrap.min.js.map"));
})
app.get('/js/jquery-3.4.1.min.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/js/jquery-3.4.1.min.js"));
})
app.get('/ts/home.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/ts/home.js"));
});
app.get('/ts/chat.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/ts/chat.js"));
});
app.get('/ts/pong.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/ts/pong.js"));
});
app.get('/ts/cardgame.js', function(req, res){
    res.sendFile(path.join(__dirname + "/views/ts/cardgame.js"));
});

/////////
// CSS //
/////////
app.get('/css/bootstrap.min.css', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/bootstrap.min.css"));
})
app.get('/css/bootstrap.min.css.map', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/bootstrap.min.css.map"));
})
app.get('/css/chat.css', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/chat.css"));
});
app.get('/css/pong.css', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/pong.css"));
});
app.get('/css/cardgame.css', function(req, res){
    res.sendFile(path.join(__dirname + "/views/css/cardgame.css"));
});
////////////
// IMAGES //
////////////
app.get('/img/cardgame/c_0.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/c_0.jpg"));
});
app.get('/img/cardgame/c_1.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/c_1.jpg"));
});
app.get('/img/cardgame/c_2.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/c_2.jpg"));
});
app.get('/img/cardgame/c_3.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/c_3.jpg"));
});
app.get('/img/cardgame/c_4.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/c_4.jpg"));
});
app.get('/img/cardgame/cb_0.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/cb_0.jpg"));
});
app.get('/img/cardgame/cs_0.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/cs_0.jpg"));
});
app.get('/img/cardgame/cs_1.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/cs_1.jpg"));
});
app.get('/img/cardgame/cs_2.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/cs_2.jpg"));
});
app.get('/img/cardgame/cs_3.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/cs_3.jpg"));
});
app.get('/img/cardgame/cs_4.jpg', function(req, res){
    res.sendFile(path.join(__dirname + "/views/img/cardgame/cs_4.jpg"));
});

//////////
// TEXT //
//////////
app.post('/save', function(req, res){
    let body = '';
    let filePath = __dirname + "/views/txt/data.txt";
    req.on('data', function(data){
        body += data;
    });

    req.on('end', function(){
        fs.writeFile(filePath, body, function(){
            res.writeHead(200, {
                'Content-Length': body.length,
                'Content-Type': "text/plain"
            });
            res.write(body);
            res.end();
        });
    });
});
app.get('/txt/data.txt', function(req, res){
    res.sendFile(path.join(__dirname + "/views/txt/data.txt"));
});

///////////
// PAGES //
///////////
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + "/views/html/home.html"));
});
app.get('/chat', function(req, res){
    res.sendFile(path.join(__dirname + "/views/html/chat.html"));
});
app.get('/pong', function(req, res){
    res.sendFile(path.join(__dirname + "/views/html/pong.html"));
});
app.get('/cardgame', function(req, res){
    res.sendFile(path.join(__dirname + "/views/html/cardgame.html"));
});

const io: socketIO.Server = socketIO(server);

//------
// Code
//------
let chatClients: ChatClient[] = [];
let pongClients: PongClient[] = [];
let cardClients: CardClient[] = []
let id: number = 0;
let pong: Pong = new Pong();

function update(){
    pong.update(io);
    io.emit('update', pong);
}
setInterval(update, 20);

io.on('connection', (socket: any) =>{
    ////////////////////////////
    // CONNECT AND DISCONNECT //
    ////////////////////////////
    socket.on('chat_connect', function(username: string){
        socket.id = id;
        chatClients.push(new ChatClient(id, username));
        id++;
        var today = new Date();
        var print = '<strong>[' + timeToString(today) + ']</strong>' + '<i>' + username + ' joined the chat...</i>';
        io.emit('chat_online', print);
        io.emit('chat_users', chatClients);

    });
    socket.on('pong_connect', function(){
        socket.id = id;
        pongClients.push(new PongClient(id));
        id++;
        // Activate pong
        if(pongClients.length >= 2){
            pong.startGame(io);
        }
    });
    socket.on('card_connect', function(){
        socket.id = id;
        cardClients.push(new CardClient(id));
        id++
        
    });
    socket.on('disconnect', function(){
        let chatIndex = chatClients.findIndex(client => client.id === socket.id);
        let pongIndex = pongClients.findIndex(client => client.id === socket.id);
        let cardIndex = cardClients.findIndex(client => client.id === socket.id);
        if(chatIndex !== -1){
            let username: string = chatClients[chatIndex].username;
            chatClients.splice(chatIndex, 1);
            var today = new Date();
            var print = '<strong>[' + timeToString(today) + ']</strong>' + '<i>' + username + ' left the chat...</i>';
            io.emit('chat_online', print);
            io.emit('chat_users', chatClients);
        }
        else if(pongIndex !== -1){
            pongClients.splice(pongIndex, 1);
            // Deactivate pong
            if(pongClients.length < 2){
                pong.stopGame();
            }
        }
        else if(cardIndex !== -1){
            cardClients.splice(cardIndex, 1);
        }
    });

    //////////
    // CHAT //
    //////////
    socket.on('chat_message', function(message: string){
        let chatIndex = chatClients.findIndex(client => client.id === socket.id);
        if(chatIndex !== -1){
            let username: string = chatClients[chatIndex].username;
            var today = new Date();
            var print = '<strong>[' + timeToString(today) + ']</strong>' +'<strong>' + username +"</strong>: " + message
            io.emit('chat_message', print);
        }
    });

    function timeToString(today: Date){
        let time = addZeroBeforeNumber(today.getHours());
        time += ":";
        time += addZeroBeforeNumber(today.getMinutes());
        time += ":";
        time += addZeroBeforeNumber(today.getSeconds());
        return time;
    }
    function addZeroBeforeNumber(value: number): string{
        let result = '';
        if(value < 10){
            result += '0';
            result += value;
        }
        else{
            result += value;
        }
        return result;
    }

    //////////
    // PONG //
    //////////
    socket.on('pong_move_down', function(){
        let pongIndex = pongClients.findIndex(client => client.id === socket.id);
        if(pongIndex !== -1 && pong.run){
            if(pongIndex === 0){
                pong.player1.moveDown();
            }
            else if(pongIndex === 1){
                pong.player2.moveDown();
            }
        };
    })
    socket.on('pong_move_up', function(){
        let pongIndex = pongClients.findIndex(client => client.id === socket.id);
        if(pongIndex !== -1 && pong.run){
            if(pongIndex === 0){
                pong.player1.moveUp();
            }
            else if(pongIndex === 1){
                pong.player2.moveUp();
            }
        };
    })
    socket.on('pong_move_stop', function(){
        let pongIndex = pongClients.findIndex(client => client.id === socket.id);
        if(pongIndex !== -1 && pong.run){
            if(pongIndex === 0){
                pong.player1.stopMoving();
            }
            else if(pongIndex === 1){
                pong.player2.stopMoving();
            }
        }
    })

    //////////////
    // CARDGAME //
    //////////////

})

