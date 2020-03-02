import io from 'socket.io-client';
import {ChatClient} from '../../src/chatclient';
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
// clients
socket.on('clients', function(clients: ChatClient[]){
    $('#users').empty();
    clients.forEach(client => {
        $('#users').append($('<li>').addClass('list-group-item').html(client.username));
    });
});

// ask username
var username = prompt('Please tell me your name');
socket.emit('username', username);
