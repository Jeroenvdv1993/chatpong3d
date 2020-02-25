import { Vector2} from './vector2'
export class Player{
    position: Vector2;
    speed: Vector2;
    size: Vector2;
    constructor(position: Vector2){
        this.position = position;
        this.speed = new Vector2();
        this.size = new Vector2(4, 32);
    }

    update(){
        this.position.add(this.speed);
    }
    moveUp(){
        this.speed.y = -5;
    }
    moveDown(){
        this.speed.y = 5;
    }
    stopMoving(){
        this.speed.y = 0;
    }
}