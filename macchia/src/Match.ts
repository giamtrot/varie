import assert from "assert";
import * as fs from "fs";
import { Decks } from "./Decks";
import { Desk } from "./Desk";
import { Player, Players } from "./Players";
import { Combo } from "./Combos";

export class Match {


    private players: Players;
    private decks: Decks;
    private desk: Desk;

    constructor(players: Players, decks: Decks, desk: Desk) {
        this.players = players;
        this.decks = decks;
        this.desk = desk;
    }

    step() {
        assert(this.decks.hasNext(), "No more steps are possible")
        const player = this.players.nextPlayer()

        if (player.hasCombo()) {
            // const combo: Combo = player.playCombo()
            // console.log(`${player.name} plays ${combo}`)
            // this.desk.addCombo(combo)
        }
        else {
            const card = this.decks.next()
            console.log(`${player.name} gets ${card}`)
            player.add(card)
        }
    }

    private noInteraction = false

    canContinue(): boolean {
        if (this.noInteraction) {
            return this.checkCards();
        }

        const answer = this.read("S: step, Q: quit or R: run to end?");

        switch (answer.trim().toLowerCase()) {
            case "s":
                return this.checkCards();
            case "q":
                return false
            case "r":
                this.noInteraction = true
                return this.checkCards()
            default:
                this.write("Invalid input. Please enter 's', 'q', or 'r'.");
                return this.canContinue();
        }
    }

    private checkCards(): boolean {
        return this.decks.hasNext();
    }

    private read(msg: string) {
        this.write(msg)
        const buffer = Buffer.alloc(1024);
        const bytesRead = fs.readSync(process.stdin.fd, buffer);
        const answer = buffer.toString("utf8", 0, bytesRead).trim().toLowerCase();
        return answer;
    }

    private write(msg: string) {
        process.stdout.write(msg + "\n");
    }

    toString() {
        return `Match State:
        Players:\n${this.players}
        Decks: ${this.decks}
        Desk: ${this.desk}`;
    }
}