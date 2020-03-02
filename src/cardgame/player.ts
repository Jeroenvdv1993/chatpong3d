import { Card } from "./card";
import { shuffle } from "./shuffle";
export class Player{
    id: number;
    hand: Card[] = [];
    deck: Card[] = [];
    playzone: Card[] = [];
    energyzone: Card[] = [];
    discardpile: Card[] = [];
    points: number = 0;
    constructor(id: number){
        this.id = id;
        this.reset();
    }
    shuffle(): void {
        shuffle(this.deck);
    }
    draw(amount: number = 1): boolean{
        if(this.deck.length >= amount){
            for(let index: number = 0; index < amount; index++){
                this.hand.push(this.deck[this.deck.length - 1]);
                this.deck.pop();
            }
            return true;
        }
        else{
            return false;
        }
    }
    reset(): void{
        this.points = 0;
        this.hand = [];
        this.deck = [];
        this.playzone = [];
        this.energyzone = [];
        this.discardpile = [];
        this.deck.push(new Card(0, "zero", 0));
        this.deck.push(new Card(0, "zero", 0));
        this.deck.push(new Card(0, "zero", 0));
        this.deck.push(new Card(0, "zero", 0));
        this.deck.push(new Card(0, "zero", 0));
        this.deck.push(new Card(1, "one", 1));
        this.deck.push(new Card(1, "one", 1));
        this.deck.push(new Card(1, "one", 1));
        this.deck.push(new Card(1, "one", 1));
        this.deck.push(new Card(1, "one", 1));
        this.deck.push(new Card(2, "two", 2));
        this.deck.push(new Card(2, "two", 2));
        this.deck.push(new Card(2, "two", 2));
        this.deck.push(new Card(2, "two", 2));
        this.deck.push(new Card(2, "two", 2));
        this.deck.push(new Card(3, "three", 3));
        this.deck.push(new Card(3, "three", 3));
        this.deck.push(new Card(3, "three", 3));
        this.deck.push(new Card(3, "three", 3));
        this.deck.push(new Card(3, "three", 3));
        this.deck.push(new Card(4, "four", 4));
        this.deck.push(new Card(4, "four", 4));
        this.deck.push(new Card(4, "four", 4));
        this.deck.push(new Card(4, "four", 4));
        this.deck.push(new Card(4, "four", 4));
    }
    play(index: number): void{
        this.moveCard(this.hand, index, this.playzone);
    }
    discard(index: number): void{
        this.moveCard(this.playzone, index, this.discardpile);
    }
    energy(index: number): void{
        this.moveCard(this.hand, index, this.energyzone);
    }
    moveCard(fromArray: Card[], fromIndex: number, toArray: Card[]){
        let card = fromArray[fromIndex];
        if(card !== null){
            this.removeCard(fromArray, card);
            toArray.push(card);
        }
    }
    removeCard(array: Card[], card: Card){
        const index = array.indexOf(card, 0);
        if( index > -1){
            array.splice(index, 1);
        }
    }
};