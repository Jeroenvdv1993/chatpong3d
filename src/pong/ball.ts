import { Vector2 } from './vector2';
export class Ball{
    position: Vector2;
    speed: Vector2;

    constructor(position: Vector2, speed: Vector2){
        this.position = position;
        this.speed = speed;
    }
    update(): void{
        this.position.add(this.speed);
        if(this.position.y < 0 ||this.position.y > 256){
            this.speed.y = -this.speed.y;
        }
    }
}