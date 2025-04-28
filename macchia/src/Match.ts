import assert from "assert";
import { Decks } from "./Decks";
import { Desk } from "./Desk";
import { Players } from "./Players";
import { Combo } from "./Combos";

export class Match {

    private players: Players;
    private decks: Decks;
    private desk: Desk;

    constructor(players: Players, decksNumber: number) {
        this.players = players;
        this.decks = new Decks(decksNumber).shuffle();
        this.decks.distribute(this.players.players, 13);
        this.desk = new Desk();
    }



    step() {
        assert(this.decks.hasNext(), "No more steps are possible")
        const player = this.players.nextPlayer()

        if (player.hasCombo()) {
            const combo: Combo = player.playCombo()
            // console.log(`${player.name} plays ${combo}`)
            // this.desk.addCombo(combo)
        }
        else {
            const card = this.decks.next()
            console.log(`${player.name} gets ${card}`)
            player.add(card)
        }
    }

    checkCards(): boolean {
        return this.decks.hasNext();
    }

    toString() {
        return "" +
            `Match State:
    Players:\n${this.players}
    Decks: ${this.decks}
    Desk: ${this.desk}`;
    }

    toJSON() {
        return {
            match: {
                players: this.players.toJSON(),
                decks: this.decks.toJSON(),
                desk: this.desk.toJSON(),
            }
        }
    }
}