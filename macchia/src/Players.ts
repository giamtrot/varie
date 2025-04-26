import assert from 'assert';
import { Card, Cards, cardSorter } from './Card';
import { Combos, Combo } from './Combos';


export class Player {
    name: string;
    hand = new Cards();
    combos = new Combos();

    // playCombo(): Combo {
    //     assert(this.hasCombo, "No combo available")
    //     const combo = this.combos.shift();
    //     // combo.cards.forEach(c => this.remove(c));
    //     return combo;
    // }

    hasCombo() {
        return this.combos.length > 0;
    }

    handSort(): void {
        this.hand.sort();
    }

    constructor(name: string) {
        this.name = name;
    }

    toString(): string {
        return this.name + ": " + this.hand.toString();
    }

    add(card: Card) {
        this.hand.pushAndRelate(card);
    }

    remove(card: Card): void {
        card.horizontals.cards.forEach(h => h.unrelate(card))
        card.verticals.cards.forEach(v => v.unrelate(card))
        this.hand.remove(card)
    }

    findCombos() {
        this.hand.cards.filter(card => card.horizontals.length >= 2).forEach(card => {
            this.combos.add(new Combo([card, ...card.horizontals.cards]));
        });

        this.hand.cards.filter(card => card.verticals.length >= 2).forEach(card => {
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
        card.verticals.cards.forEach(c => Player.collect(c, cards));
    }
}

export class Players {
    players: Player[];
    private playerPos = 0;

    constructor(players: Player[]) {
        assert(players.length > 0, "No player provided")
        this.players = players;
    }

    nextPlayer(): Player {
        const player = this.players[this.playerPos];
        this.playerPos = (this.playerPos + 1) % this.players.length;
        return player
    }

    toString() {
        return this.players.map(player => {
            player.handSort()
            return player.toString()
        }).join("\n");
    }
}