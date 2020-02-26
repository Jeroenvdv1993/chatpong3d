import io from 'socket.io-client';
import {Client} from '../../src/client';
import {Pong} from '../../src/pong/pong';
var socket = io();

// submit text message without reload/refresh the page
$('#send').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat_message', $('#txt').val());
    $('#txt').val('');
    return false;
});

// append the chat text message
socket.on('chat_message', function(msg: string){
    $('#messages').append($('<li>').addClass('list-group-item').html(msg));
})

// append text if someone is online
socket.on('is_online', function(username: string){
    $('#messages').append($('<li>').addClass('list-group-item').html(username));
})

// canvas
const canvas = <HTMLCanvasElement | null> document.getElementById('pong');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
if(player1 !== null && player2 !== null){
    socket.on('score', function(player1Score: number, player2Score: number){
        player1.innerHTML = `${player1Score}`;
        player2.innerHTML = `${player2Score}`;
    })
}
if(canvas !== null){
    const context = canvas.getContext('2d');
    
    // clients
    if(context !== null){
        socket.on('clients', function(clients: Client[]){
            $('#users').empty();
            clients.forEach(client => {
                $('#users').append($('<li>').addClass('list-group-item').html(client.username));
            });
        });
        socket.on('update', function(pong: Pong){
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.lineWidth = 2;
            context.strokeStyle = "#000000";
            context.strokeRect(0,0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(pong.ball.position.x, pong.ball.position.y, pong.ball.radius, 0, 2* Math.PI, false);
            context.fillStyle = 'black';
            context.fill();
            context.beginPath();
            context.rect(
                pong.player1.position.x - pong.player1.size.x / 2, 
                pong.player1.position.y - pong.player1.size.y / 2, 
                pong.player1.size.x, 
                pong.player1.size.y);
            context.fillStyle = 'black';
            context.fill();
            context.beginPath();
            context.rect(
                pong.player2.position.x - pong.player2.size.x / 2, 
                pong.player2.position.y - pong.player2.size.y / 2, 
                pong.player2.size.x, 
                pong.player2.size.y);
            context.fillStyle = 'black';
            context.fill();
        });
    }
}

// ask username
var username = prompt('Please tell me your name');
socket.emit('username', username);

// move
let map: any[] = [];
document.onkeydown = document.onkeyup = function(e){
    e = e ||event; // to deal with IE
    map[e.keyCode] = e.type === 'keydown';
    if(!($('#txt').is(':focus'))){
        if(map[90]){
            socket.emit('move_up');
        }
        else if(map[83]){
            socket.emit('move_down');
        }
        else{
            socket.emit('move_stop');
        }
    }
}