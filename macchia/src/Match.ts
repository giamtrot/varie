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

    step(): boolean {
        assert(this.decks.hasNext(), "No more steps are possible")
        const player = this.players.nextPlayer()

        let comboPlayed = false
        let iterationCount = 0;
        const maxIterations = 10; // Safeguard to prevent infinite loop

        while (player.hasCombo()) {
            comboPlayed = true;
            const combo: Combo = player.playCombo();

            console.log(`${player.name} plays ${combo}`);
            this.desk.add(combo);

            iterationCount++;
            if (iterationCount >= maxIterations) {
                console.warn(`Potential infinite loop detected for player ${player.name}. Exiting loop.`);
                break;
            }
        }

        if (!player.hasCards()) {
            console.log(`${player.name} has no cards left! They wins!`);
            return true;
        }

        if (!comboPlayed) {
            const card = this.decks.next()
            console.log(`${player.name} gets ${card}`)
            player.add(card)
        }

        return false;
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