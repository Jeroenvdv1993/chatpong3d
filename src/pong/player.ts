import { Vector2} from './vector2';
import { Rectangle } from './rectangle';

export class Player{
    position: Vector2;
    direction: Vector2;
    speed: number;
    size: Vector2;
    score: number;
    constructor(position: Vector2){
        this.position = position;
        this.direction = new Vector2(0, 0);
        this.speed = 5;
        this.size = new Vector2(8, 64);
        this.score = 0;
    }

    update(){
        this.position = this.position.add(this.direction.multiply(this.speed));
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