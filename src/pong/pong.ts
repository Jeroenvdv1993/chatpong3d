import { Ball } from './ball';
import { Player } from './player';
import { Vector2 } from './vector2';
import { HitDetection} from './hitdetection';
import socketIO from 'socket.io';

const MAXBOUNCEANGLE: number = 5 * Math.PI / 12; // 75 degrees
export class Pong{
    run: boolean = false;
    ball: Ball = new Ball(new Vector2(127, 127), new Vector2(1, 0));
    player1: Player = new Player(new Vector2(4, 127));
    player2: Player = new Player(new Vector2(252, 127));
    hitDetection: HitDetection = new HitDetection();
    constructor(){
    }

    startGame(io: socketIO.Server){
        this.resetGame(io);
        this.run = true;
    }

    update(io: socketIO.Server){
        if(this.run){
            this.ball.update();
            // top and bottom wall
            if(this.ball.position.y < 0){
                this.ball.direction.y = Math.abs(this.ball.direction.y);
            }
            else if(this.ball.position.y > 256){
                this.ball.direction.y = -Math.abs(this.ball.direction.y);
            }
            this.player1.update();
            this.player2.update();
            this.hit(io);
        }
    }
    hit(io: socketIO.Server){
        if(this.hitDetection.hit(this.ball, this.player1)){
            this.changeBallPlayer(this.player1);
        }
        else if(this.hitDetection.hit(this.ball, this.player2)){
            this.changeBallPlayer(this.player2);
        }
        else if(this.ball.position.x >= 256){
            this.resetBall(true, io);
        }
        else if(this.ball.position.x < 0){
            this.resetBall(false, io);
        }
    }
    changeBallPlayer(player: Player){
        let relativeIntersectY = player.position.y - this.ball.position.y;
        let normalizedRelativeIntersectionY = (relativeIntersectY/ (player.size.y / 2) );
        let bounceAngle = normalizedRelativeIntersectionY * MAXBOUNCEANGLE;
        this.ball.direction.x = -this.ball.direction.x;
        this.ball.direction.y = -Math.sin(bounceAngle);
        this.ball.direction.normalize();
    }
    stopGame(){
        this.run = false;
    }
    resetBall(player1Scored: boolean, io: socketIO.Server){
        this.ball.position = new Vector2(127, 127);
        if(player1Scored){
            this.player1.score += 1;
            this.ball.direction = new Vector2(1, 0);
        }
        else{
            this.player2.score += 1;
            this.ball.direction = new Vector2(-1, 0);
        }
        io.emit('score', this.player1.score, this.player2.score);
    }
    resetGame(io: socketIO.Server){
        this.ball.position = new Vector2(127, 127);
        this.ball.direction = new Vector2(1, 0);
        this.player1.score = 0;
        this.player2.score = 0;
        io.emit('score', this.player1.score, this.player2.score);
        this.player1.position = new Vector2(4, 127);
        this.player2.position = new Vector2(252, 127);
    }
}