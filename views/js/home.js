
var socket = io();

// submit text message without reload/refresh the page
$('#send').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat_message', $('#txt').val());
    $('#txt').val('');
    return false;
});

// append the chat text message
socket.on('chat_message', function(msg){
    $('#messages').append($('<li>').addClass('list-group-item').html(msg));
})

// append text if someone is online
socket.on('is_online', function(username){
    $('#messages').append($('<li>').addClass('list-group-item').html(username));
})

// canvas
const canvas = document.getElementById('dot');
const context = canvas.getContext('2d');
const radius = 10;

// clients
socket.on('clients', function(clients){
    $('#users').empty();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 2;
    context.strokeStyle = "#FF0000";
    context.strokeRect(0,0, canvas.width, canvas.height);
    clients.forEach(client => {
        $('#users').append($('<li>').addClass('list-group-item').html(client.username));
        context.beginPath();
        context.arc(client.x, client.y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
    });
});

// ask username
var username = prompt('Please tell me your name');
socket.emit('username', username);

// move
var map = {};
document.onkeydown = document.onkeyup = function(e){
    e = e ||event; // to deal with IE
    map[e.keyCode] = e.type === 'keydown';
    if(!($('#txt').is(':focus'))){
        if(map[90]){
            socket.emit('move_up');
        }
        if(map[83]){
            socket.emit('move_down');
        }
        if(map[81]){
            socket.emit('move_left');
        }
        if(map[68]){
            socket.emit('move_right');
        }
    }
}