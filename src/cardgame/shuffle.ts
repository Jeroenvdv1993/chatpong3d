import {Card }from "./card";
export function shuffle(cards: Card[]){
    let currentIndex: number = cards.length;
    let temporaryValue: Card;
    let randomIndex: number;

    // As long as there are more elements to shuffle
    while(0 !== currentIndex){
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap it with the current element
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}