import { Card } from './Card';
import { Combo } from './Combo';
import { Hand } from './Hand';



export class Player {
    name: string;
    hand = new Hand();


    constructor(name: string) {
        this.name = name;
    }

    get cards(): Card[] {
        return this.hand.cards.cards;
    }

    hasCards(): boolean {
        return this.hand.cards.length > 0;
    }

    hasCombo() {
        return this.hand.hasCombo();
    }

    playCombo(): Combo {
        const combo = this.hand.getCombo();
        combo.cards.forEach(c => this.remove(c));
        return combo;
    }

    handSort(): void {
        this.hand.cards.sort();
    }

    add(card: Card) {
        this.hand.push(card);
    }

    remove(card: Card): void {
        this.hand.remove(card);
    }

    toString(): string {
        return this.name + ": " + this.hand.toString();
    }

    toJSON() {
        return {
            name: this.name,
            hand: this.hand.toJSON()
        };
    }
}
