import { Vector2 } from './vector2';
export class Ball{
    position: Vector2;
    speed: Vector2;

    constructor(){
        this.position = new Vector2(0, 0);
        this.speed = new Vector2(1, 1);
    }
    update(): void{
        this.position.add(this.speed);
        if(this.position.x > 256){
            this.speed.x = -1;
        }
        else if(this.position.x < 0){
            this.speed.x = 1;
        }
        if(this.position.y > 256){
            this.speed.y = -1;
        }
        else if(this.position.y < 0){
            this.speed.y = 1;
        }
    }
}