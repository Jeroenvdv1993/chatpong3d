import {Vector2} from './vector2';

export class Circle{
    point: Vector2;
    radius: number;
    constructor(point: Vector2, radius: number){
        this.point = point;
        this.radius = radius;
    }
}