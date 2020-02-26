export class Vector2{
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0){
        this.x = x;
        this.y = y;
    }
    add(other: Vector2): Vector2{
        let result: Vector2 = new Vector2(this.x, this.y);
        result.x += other.x;
        result.y += other.y;
        return result;
    }
    multiply(other: number): Vector2{
        let result: Vector2 = new Vector2(this.x, this.y);
        result.x *= other;
        result.y *= other;
        return result;
    }
    normalize(){
        let length = Math.sqrt(this.x * this.x + this.y * this.y);
        if(Math.abs(length) > 0){
            this.x /= length;
            this.y /= length;
        }
    }
}