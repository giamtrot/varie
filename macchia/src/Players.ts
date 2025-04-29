import assert from 'assert';
import { Card, Hand } from './Card';
import { Combo } from './Combos';


export class Player {
    name: string;
    hand = new Hand();

    constructor(name: string) {
        this.name = name;
    }

    playCombo(): Combo {
        const combo = this.hand.getCombo();
        combo.cards.forEach(c => this.remove(c));
        return combo;
    }

    handSort(): void {
        this.hand.sort();
    }

    add(card: Card) {
        this.hand.pushAndRelate(card);
    }

    remove(card: Card): void {
        this.hand.remove(card)
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
        return ris
    }
}