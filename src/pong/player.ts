import { Vector2} from './vector2';
import { Rectangle } from './rectangle';

const PLAYER_MIN_Y: number = 32;
const PLAYER_MAX_Y: number = 224;
const PLAYER_WIDTH: number = 8;
const PLAYER_HEIGHT: number = 64;
const PLAYER_SPEED: number = 5;

export class Player{
    position: Vector2;
    direction: Vector2;
    speed: number;
    size: Vector2;
    score: number;
    constructor(position: Vector2){
        this.position = position;
        this.direction = new Vector2(0, 0);
        this.speed = PLAYER_SPEED;
        this.size = new Vector2(PLAYER_WIDTH, PLAYER_HEIGHT);
        this.score = 0;
    }

    update(){
        this.position = this.position.add(this.direction.multiply(this.speed));
        if(this.position.y < PLAYER_MIN_Y) this.position.y = PLAYER_MIN_Y;
        if(this.position.y > PLAYER_MAX_Y) this.position.y = PLAYER_MAX_Y;
    }
    moveUp(){
        this.direction.y = -1;
    }
    moveDown(){
        this.direction.y = 1;
    }
    stopMoving(){
        this.direction.y = 0;
    }
    getRectangle(): Rectangle{
        let result: Rectangle = new Rectangle(
            this.position.x - this.size.x / 2, 
            this.position.y - this.size.y / 2,
            this.size.x,
            this.size.y);
        return result;
    }
}