import assert from 'assert';
import { Card } from './Card';


export class CardSet {
    cards: Card[] = [];

    clone(): CardSet {
        const newSet = new CardSet();
        newSet.cards = [...this.cards]; // Shallow copy of the array
        return newSet;
    }

    push(card: Card) {
        this.cards.push(card);
    }

    contains(c: Card): boolean {
        return this.cards.indexOf(c) >= 0;
    }

    sort() {
        this.cards.sort(Card.cardSorter);
    }

    get length() {
        return this.cards.length;
    }

    remove(card: Card) {
        const index = this.cards.indexOf(card);
        assert(index >= 0, `Card ${card} not found in set`);
        this.cards.splice(index, 1);
    }

    toString() {
        return this.cards.map(card => card.toString()).join("");
    }

    toJSON() {
        return this.cards.map(card => card.toJSON());
    }

}
