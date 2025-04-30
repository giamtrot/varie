import { Card, Hand } from './Card';
import { Combo, Combos } from './Combos';

export class Desk {
    private _combos: Combo[] = [];

    constructor() {
        console.log("Desk created");
    }

    get combos(): Combo[] {
        return this._combos;
    }

    add(combo: Combo): void {
        this._combos.push(combo);
    }

    toString(): string {
        return this._combos.map(combo => combo.toString()).join(' ');
    }

    toJSON() {
        return this._combos.map(combo => combo.toJSON());
    }
}

export class WorkingDesk {
    hand = new Hand();

    constructor(desk: Desk) {
        this.hand.addAll(desk.combos)
    }

    add(card: Card): void {
        this.hand.push(card);
    }

    searchNewCombos(): Combos | undefined {
        return WorkingDesk.search(this.hand, new Combos());
    }

    static innerSearch(combo: Combo, newHand: Hand, combos: Combos): Combos | undefined {
        const newCombos = combos.clone();
        newCombos.add(combo);
        if (newHand.cards.length === 0) {
            return newCombos;
        }

        return WorkingDesk.search(newHand, newCombos);
    }


    static search(hand: Hand, combos: Combos) {
        let foundCombos: Combos | undefined
        for (let i = 0; i < hand.combos.combos.length; i++) {
            const combo = hand.combos.combos[i];
            const newHand = hand.clone();
            combo.cards.forEach(card => {
                newHand.remove(card);
            });
            foundCombos = WorkingDesk.innerSearch(combo, newHand, combos);
            if (foundCombos) {
                return foundCombos;
            }
        };

        return undefined;
    }
}


