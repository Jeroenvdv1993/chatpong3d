export class Client{
    id: number;
    username: string;
    x: number;
    y: number;
    constructor(id: number, username: string, x: number = 0, y: number = 0){
        this.id = id;
        this.username = username;
        this.x = x;
        this.y = y;
    }
}