import {Cardgame} from '../../src/cardgame/cardgame';
import { Player } from '../../src/cardgame/player';
import io from 'socket.io-client';

let socket = io();
socket.emit('card_connect');

let handUL: HTMLElement | null = document.getElementById("hand");
let opponentHandUL: HTMLElement | null = document.getElementById("opponentHand");
let handLengthSpan: HTMLElement | null = document.getElementById("handLength");
let opponentHandLengthSpan: HTMLElement | null = document.getElementById("opponentHandLength");
let endTurnDiv : HTMLElement | null = document.getElementById("endTurn");
let player: Player | null = null;
let opponent: Player | null = null;
let clientID: number = -1;
let viewer: boolean = false;

socket.on('client_id', function(id: number){
    clientID = id;
})
socket.on('card_reset', function(cardgame: Cardgame){
    getPlayers(cardgame);
    if(!viewer){
        if(endTurnDiv !== null){
            if(cardgame.currentPlayer?.id === clientID){
                endTurnDiv.hidden = false;
            }
            else{
                endTurnDiv.hidden = true;
            }
        }
        updateLists();
    }
    else{
        if(endTurnDiv !== null){
            endTurnDiv.hidden = true;
        }
        updateListsViewer();
    }
})

socket.on('card_switch', function(cardgame: Cardgame){
    if(cardgame.currentPlayer?.id === clientID && endTurnDiv !== null){
        endTurnDiv.hidden = false;
    }
    getPlayers(cardgame);
    if(!viewer) updateLists();
    else updateListsViewer();
})

if(endTurnDiv !== null){
    endTurnDiv.onclick = function(){
        if(endTurnDiv !== null){
            endTurnDiv.hidden = true;
        }
        socket.emit('card_end_turn');
    }
}
function clearUL(UL: HTMLElement | null){
    if(UL !== null){
        while(UL.firstChild){
            UL.removeChild(UL.firstChild);
        }
    }
}

function getPlayers(cardgame: Cardgame){
    if(cardgame.player1.id === clientID){
        player = cardgame.player1;
        opponent = cardgame.player2;
    }
    else if(cardgame.player2.id === clientID){
        player = cardgame.player2;
        opponent = cardgame.player1;
    }
    else{
        player = cardgame.player1;
        opponent = cardgame.player2;
        viewer = true;
    }
}
function updateLists(){
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
}
function updateListsViewer(){
    if(handUL !== null && player !== null){
        clearUL(handUL);
        for(let index: number = 0; index < player.hand.length; index++){
            let img = document.createElement('img');
            img.classList.add("img-fluid");
            img.src = `/img/cardgame/cb_0.jpg`;
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
}