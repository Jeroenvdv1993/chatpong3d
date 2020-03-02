import {Cardgame} from '../../src/cardgame/cardgame';
import { Player } from '../../src/cardgame/player';
import io from 'socket.io-client';

let socket = io();
socket.emit('card_connect');

let handUL: HTMLElement | null = document.getElementById("hand");
let opponentHandUL: HTMLElement | null = document.getElementById("opponentHand");
let handLengthSpan: HTMLElement | null = document.getElementById("handLength");
let opponentHandLengthSpan: HTMLElement | null = document.getElementById("opponentHandLength");
let player: Player | null = null;
let opponent: Player | null = null;
let clientID: number = -1;

socket.on('client_id', function(id: number){
    clientID = id;
})
socket.on('card_reset', function(cardgame: Cardgame){
    console.log(`Player1 ID: ${cardgame.player1.id}`);
    console.log(`Player2 ID: ${cardgame.player2.id}`);
    console.log(`Client ID: ${clientID}`);
    if(cardgame.player1.id === clientID){
        console.log("PLAYER 1");
        player = cardgame.player1;
        opponent = cardgame.player2;
    }
    else if(cardgame.player2.id === clientID){
        console.log("PLAYER 2");
        player = cardgame.player2;
        opponent = cardgame.player1;
    }
    else{
        console.log("VIEWER");
    }
    if(handUL !== null && player !== null){
        clearUL(handUL);
        for(let index: number = 0; index < player.hand.length; index++){
            let img = document.createElement('img');
            img.classList.add("img-fluid");
            img.src = `/img/cardgame/c_${player.hand[index].id}.jpg`;
            let li = document.createElement('li');
            li.appendChild(img);
            handUL.appendChild(li);
        }
    }
    if(handLengthSpan !== null && player !== null){
        handLengthSpan.innerText = `${player.hand.length}`;
    }
    if(opponentHandUL !== null && opponent !== null){
        clearUL(opponentHandUL);
        for(let index: number = 0; index < opponent.hand.length; index++){
            let img = document.createElement('img');
            img.classList.add("img-fluid");
            img.src = `/img/cardgame/cb_0.jpg`;
            let li = document.createElement('li');
            li.appendChild(img);
            opponentHandUL.appendChild(li);
        }
    }
    if(opponentHandLengthSpan !== null && opponent !== null){
        opponentHandLengthSpan.innerText = `${opponent.hand.length}`;
    }
})

function clearUL(UL: HTMLElement | null){
    if(UL !== null){
        while(UL.firstChild){
            UL.removeChild(UL.firstChild);
        }
    }
}