import assert from 'assert';
import { Card, Cards } from './Card';
import { Combos, Combo } from './Combos';


export class Player {
    name: string;
    hand = new Cards();
    combos = new Combos();

    playCombo(): Combo {
        assert(this.hasCombo, "No combo available")
        const combo = this.combos.shift();
        combo.cards.forEach(c => this.remove(c));
        return combo;
    }

    hasCombo() {
        return this.combos.length > 0;
    }

    handSort(): void {
        this.hand.sort();
    }

    constructor(name: string) {
        this.name = name;
    }

    add(card: Card) {
        this.hand.pushAndRelate(card);
        this.findCombos()
    }

    remove(card: Card): void {
        card.horizontals.cards.forEach(h => h.unrelate(card))
        card.verticals.cards.forEach(v => v.unrelate(card))
        this.hand.remove(card)
        this.findCombos()
    }

    findCombos() {
        this.combos.reset();
        this.hand.cards.filter(card => card.horizontals.length >= 3).forEach(card => {
            let newCards: Card[] = [card, ...card.horizontals.cards]
            if (Combo.checkValid(Combo.prepareForCheck(newCards))) {
                this.combos.add(new Combo(newCards));
            }
        });

        this.hand.cards.filter(card => card.verticals.length >= 3).forEach(card => {
            let newCards: Card[] = [card, ...card.verticals.cards]
            // Player.collectVerticals(card, newCards)
            if (Combo.checkValid(Combo.prepareForCheck(newCards))) {
                this.combos.add(new Combo(newCards));
            }
        });
    }

    toString(): string {
        return this.name + ": " + this.hand.toString();
    }

    toJSON() {
        return {
            name: this.name,
            hand: this.hand.toJSON()
        }
    }

    private static collectVerticals(card: Card, cards: Card[]) {
        if (cards.filter(c => c.sameValue(card) && c.sameSuit(card)).length > 0) {
            return;
        }
        cards.push(card);
        card.verticals.cards.forEach(c => Player.collectVerticals(c, cards));
    }
}

export class Players {

    _players: Player[];
    private playerPos = 0;

    constructor(players: Player[]) {
        assert(players.length > 0, "No player provided")
        this._players = players;
    }

    get players(): Player[] {
        return this._players;
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

    toJSON() {
        const ris = this.players.map(player => {
            player.handSort();
            return player.toJSON();
        });
        // console.log(ris)
        return ris
    }
}