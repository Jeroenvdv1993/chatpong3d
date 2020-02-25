import { Vector2} from './vector2'
export class Player{
    position: Vector2;
    speed: Vector2;
    constructor(position: Vector2){
        this.position = position;
        this.speed = new Vector2();
    }

    update(){
        this.position.add(this.speed);
    }
    moveUp(){
        this.speed.y = -1;
    }
    moveDown(){
        this.speed.y = 1;
    }
    stopMoving(){
        this.speed.y = 0;
    }
}