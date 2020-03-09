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
let playUL: HTMLElement | null = document.getElementById("play");
let opponentPlayUL: HTMLElement | null = document.getElementById("opponentPlay");
let playLengthSpan: HTMLElement | null = document.getElementById("playLength");
let opponentPlayLengthSpan: HTMLElement | null = document.getElementById("opponentPlayLength");
let player: Player | null = null;
let opponent: Player | null = null;
let clientID: number = -1;
let viewer: boolean = false;

let selectedUL: HTMLElement | null = null;
let selectedImg: HTMLElement | null = null;
let selectedIndex: number |null = null;

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
        updateLists(cardgame);
    }
    else{
        if(endTurnDiv !== null){
            endTurnDiv.hidden = true;
        }
        updateListsViewer();
    }
    
    selectedUL = null;
    selectedImg = null;
    selectedIndex = null;
})

socket.on('card_switch', function(cardgame: Cardgame){
    if(cardgame.currentPlayer?.id === clientID && endTurnDiv !== null){
        endTurnDiv.hidden = false;
    }
    getPlayers(cardgame);
    if(!viewer) updateLists(cardgame);
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

        if(playUL != null){
            playUL.onclick = function(){
                if(selectedIndex !== null){
                    console.log(`Playing index in hand: ${0}`, selectedIndex)
                    socket.emit('card_play_card', selectedIndex);
                    //cardgame.playCard(selectedIndex);

                    if(selectedImg !== null){
                        switchImageSelection(selectedImg);
                    }
                    selectedUL = null;
                    selectedImg = null;
                    selectedIndex = null;
                }
            };
        }
    }
    else if(cardgame.player2.id === clientID){
        player = cardgame.player2;
        opponent = cardgame.player1;

        if(playUL != null){
            playUL.onclick = function(){
                if(selectedIndex !== null){
                    cardgame.playCard(selectedIndex);

                    selectedUL = null;
                    selectedImg = null;
                    selectedIndex = null;
                }
            };
        }
    }
    else{
        player = cardgame.player1;
        opponent = cardgame.player2;
        viewer = true;
    }
}
function updateLists(cardgame: Cardgame){
    if(handUL !== null && player !== null){
        clearUL(handUL);
        for(let index: number = 0; index < player.hand.length; index++){
            let img = document.createElement('img');
            img.classList.add("img-fluid");
            img.src = `/img/cardgame/c_${player.hand[index].id}.jpg`;
            let li = document.createElement('li');
            li.onclick = function(){
                selectCard(handUL, index, cardgame);
            }
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

function selectCard(ul: HTMLElement |null, index: number, cardgame: Cardgame){
    if(ul !== null){
        let li: HTMLElement | null = ul.getElementsByTagName("li")[index];
        if(li !== null){
            let img: HTMLElement | null = li.getElementsByTagName("img")[0];
            if(img !== null && cardgame.currentPlayer?.id === clientID){
                if(selectedImg !== null){
                    switchImageSelection(selectedImg);
                }
                switchImageSelection(img);
                selectedUL = ul;
                selectedImg = img;
                selectedIndex = index;
            }
        }
    }
}

function switchImageSelection(imgNode: any){
    let origSrc: string = imgNode.src;
    let dashPos: number = origSrc.lastIndexOf("/");
    if(dashPos >= 0 && dashPos < origSrc.length){
        let path: string = origSrc.substr(0, dashPos + 1);
        let filename: string = origSrc.substr(dashPos + 1);
        if(filename.slice(0,3) == "cs_"){
            filename = filename.slice(0,1) + filename.substr(2);
        }
        else if(filename.slice(0,2) == "c_"){
            filename = filename.slice(0,1) + 's' + filename.substr(1);
        }
        imgNode.src = path + filename;
    }
}
