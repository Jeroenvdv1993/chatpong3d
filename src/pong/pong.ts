import { Ball } from './ball';
import { Player } from './player';
import { Vector2 } from './vector2';

export class Pong{
    run: boolean = false;
    ball: Ball = new Ball(new Vector2(127, 127), new Vector2(5, 0));
    player1: Player = new Player(new Vector2(0, 0));
    player2: Player = new Player(new Vector2(248, 0));
    player1Hit: boolean = false;
    player2Hit: boolean = false;
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
            this.hit();
        }
    }
    hit(){
        if(this.ball.position.y >= this.player1.position.y
            && this.ball.position.y <= this.player1.position.y + this.player1.size.y
            && this.ball.position.x <= this.player1.position.x
            && this.player1Hit === false){
                console.log("player 1 hit");
                this.player2Hit = false;
                this.player1Hit = true;
                this.changeBallPlayer(this.player1);
        }
        else if(this.ball.position.y >= this.player2.position.y
        && this.ball.position.y <= this.player2.position.y + this.player2.size.y
        && this.ball.position.x >= this.player2.position.x + this.player2.size.x
        && this.player2Hit === false){
            console.log("player 2 hit");
            this.player2Hit = true;
            this.player1Hit = false;
            this.changeBallPlayer(this.player2);
        }
        else if(this.ball.position.x < 0 ||this.ball.position.x >= 256){
            console.log("reset");
            this.resetBall();
        }
    }
    changeBallPlayer(player: Player){
        let collidePoint = (this.ball.position.y - (player.position.y + player.size.y));
        let angleRad = Math.PI / 4 * collidePoint;
        let direction: number = -1;
        // to do if ball hits bottom side of the paddle direction = 1
        console.log(direction * Math.cos(angleRad));
        this.ball.speed.x = direction * 5 * Math.cos(angleRad);
        this.ball.speed.y = 5 * Math.sin(angleRad);

    }
    stopGame(){
        this.run = false;
    }
    resetBall(){
        this.ball.position = new Vector2(127, 127);
        this.ball.speed = new Vector2(5, 0);
        this.player1Hit = false;
        this.player2Hit = false;
    }
}