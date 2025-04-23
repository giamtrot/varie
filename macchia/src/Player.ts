import { Card, cardSorter } from './Card';
import { Combos, Combo } from './Combos';


export class Player {
    name: string;
    hand: Card[] = [];
    combos: Combos = new Combos();

    handSort(): void {
        this.hand.sort(cardSorter);
    }

    constructor(name: string) {
        this.name = name;
    }

    toString(): string {
        return this.name + ": " + this.hand.map(card => card.toString()).join("");
    }

    add(card: Card) {
        this.hand.forEach(c => {
            c.relate(card);
        });
        this.hand.push(card);
    }

    findCombos() {
        this.hand.filter(card => card.horizontals.length >= 2).forEach(card => {
            this.combos.add(new Combo([card, ...card.horizontals]));
        });

        
        this.hand.filter(card => card.verticals.length >= 2).forEach(card => {
            let newCards: Card[] = [];
            Player.collect(card, newCards)
            
            this.combos.add(new Combo(Array.from(newCards)));
        });
    }

    private static collect(card: Card, cards: Card[]) {
        if (cards.includes(card)) {
            return;
        }
        cards.push(card);
        card.verticals.forEach(c => Player.collect(c, cards));
    }
}
