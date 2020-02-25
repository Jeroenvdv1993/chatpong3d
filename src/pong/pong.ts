import { Ball } from './ball';
import { Player } from './player';
import { Vector2 } from './vector2';

export class Pong{
    run: boolean = false;
    ball: Ball = new Ball();
    player1: Player = new Player(new Vector2(0, 0));
    player2: Player = new Player(new Vector2(224, 0));
    constructor(){
    }

    startGame(){
        this.run = true;
    }

    update(){
        if(this.run){
            this.ball.update();
            this.player1.update();
            this.player2.update();
        }
    }
    stopGame(){
        this.run = false;
    }
}