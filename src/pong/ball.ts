import { Vector2 } from './vector2';
import { Circle} from './circle';

const BALL_RADIUS = 8;
const BALL_SPEED = 5;
export class Ball{
    circle: Circle;
    direction: Vector2;
    speed: number;

    constructor(position: Vector2, direction: Vector2){
        this.circle = new Circle(position, BALL_RADIUS);
        this.direction = direction;
        this.speed = BALL_SPEED;
    }
    update(): void{
        this.circle.point = this.circle.point.add(this.direction.multiply(this.speed));
    }
}