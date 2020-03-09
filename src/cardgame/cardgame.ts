import { Player } from "../../src/cardgame/player";

export class Cardgame{
    run: boolean = false;
    player1: Player = new Player(-1);
    player2: Player = new Player(-1);
    currentPlayer: Player | null = null;
    nextPlayer: Player | null = null;
    constructor(){}

    startGame(player1id: number, player2id: number){
        this.player1.id = player1id;
        this.player2.id = player2id;
        this.reset();
        this.currentPlayer = this.player1;
        this.nextPlayer = this.player2;
        this.run = true;
    }
    reset(){
        this.player1.reset();
        this.player1.shuffle();
        this.player1.draw(3);
    
        this.player2.reset();
        this.player2.shuffle();
        this.player2.draw(3);
    }
    playCard(index: number){
        this.currentPlayer?.play(index);
    }
    stopGame(){
        this.run = false;
    }
    endTurn(){
        this.currentPlayer = this.nextPlayer;
        this.currentPlayer?.draw(3);
        if(this.currentPlayer?.id === this.player1.id){
            this.nextPlayer = this.player2;
        }
        else{
            this.nextPlayer = this.player1;
        }
    }
}