import { Vector2 } from './vector2';
export class Ball{
    position: Vector2;
    direction: Vector2;
    speed: number;
    radius: number;

    constructor(position: Vector2, direction: Vector2){
        this.position = position;
        this.direction = direction;
        this.speed = 5;
        this.radius = 8;
    }
    update(): void{
        this.position = this.position.add(this.direction.multiply(this.speed));
    }
}