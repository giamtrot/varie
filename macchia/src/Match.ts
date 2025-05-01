import assert from "assert";
import { Decks } from "./Decks";
import { Desk, WorkingDesk } from "./Desk";
import { Player, Players } from "./Players";
import { Combo } from "./Combos";



export enum STATUS_TYPE {
    RUNNING,
    GAME_OVER
}

export type Status = {
    type: STATUS_TYPE,
    messages: string[]
}

export class Match {

    private players: Players;
    private decks: Decks;
    private desk: Desk;

    constructor(players: Players, { decks = undefined, decksNumber = 0 }: { decks?: Decks | undefined, decksNumber?: number }) {
        this.players = players;
        this.desk = new Desk();

        if (decks !== undefined) {
            this.decks = decks;
        } else if (decksNumber === 0) {
            throw new Error("Decks must be provided or number of decks must be greater than 0")
        }
        else {
            this.decks = new Decks({ decksNumber: decksNumber }).shuffle()
        }

        this.decks.distribute(this.players.players, 13);
    }



    step(): Status {
        assert(this.decks.hasNext(), "No more steps are possible")
        const player = this.players.nextPlayer()

        let somethingPlayed = false
        let iterationCount = 0;
        const maxIterations = 10; // Safeguard to prevent infinite loop
        let messages = []
        while (player.hasCombo()) {
            somethingPlayed = true;
            const combo: Combo = player.playCombo();

            messages.push(`${player.name} plays ${combo}`);
            this.desk.add(combo);

            iterationCount++;
            if (iterationCount >= maxIterations) {
                console.warn(`Potential infinite loop detected for player ${player.name}. Exiting loop.`);
                break;
            }
        }

        // try ot match a card from the desk
        somethingPlayed = this.tryToPlayCards(player, messages, somethingPlayed);

        if (!player.hasCards()) {
            messages.push(`${player.name} has no cards left! They wins!`);
            return { type: STATUS_TYPE.GAME_OVER, messages: messages };
        }

        if (!somethingPlayed) {
            const card = this.decks.next()
            messages.push(`${player.name} gets ${card}`)
            player.add(card)
        }

        if (this.checkCards()) {
            return { type: STATUS_TYPE.RUNNING, messages: messages };
        }
        messages.push("No more cards to play!")
        return { type: STATUS_TYPE.GAME_OVER, messages: messages };

    }

    private tryToPlayCards(player: Player, messages: any[], somethingPlayed: boolean) {
        for (const card of player.cards) {
            const wd = new WorkingDesk(this.desk);
            wd.add(card);
            const found = wd.searchNewCombos();
            if (found) {
                messages.push(`${player.name} plays ${card}`);
                this.desk.replace(found);
                player.remove(card);
                somethingPlayed = true;
            }
        }
        return somethingPlayed;
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