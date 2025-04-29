import { Card } from './Card';
import { Combo } from './Combos';

export class Desk {
    private combos: Combo[] = [];

    constructor() {
        console.log("Desk created");
    }

    add(combo: Combo): void {
        this.combos.push(combo);
    }

    toString(): string {
        return this.combos.map(combo => combo.toString()).join(' ');
    }

    toJSON() {
        return this.combos.map(combo => combo.toJSON());
    }
}

export class WorkingDesk {
    private originalDesk: Desk;
    private addedCards: Card[] = [];
    newCombos: Combo[] = [];

    constructor(desk: Desk) {
        this.originalDesk = desk
    }

    add(card: Card): void {
        this.addedCards.push(card);
    }

    mix() {
        // this.totalCards = [...this.addedCards, ...this.originalDesk.cards]
    }
}


