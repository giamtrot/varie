import { Player, Players } from './Players';
import { Match, STATUS_TYPE } from './Match';
import { Decks } from './Decks';
import assert from 'assert';

export class Macchiavelli_Replay {


    match: Match[] = [];

    init(playersNumber: number, desc: string) {
        let ps: Player[] = [];
        for (let p = 1; p <= playersNumber; p++) {
            ps.push(new Player("Player " + p))
        }
        const players = new Players(ps)
        const decks = Decks.fromString(desc)
        this.match.push(new Match(players, { decks: decks }))
        return this
    }

    replay() {
        assert(this.match.length > 0, "Match not initialized")
        const match = this.match[0]
        while (true) {
            const stepStatus = match.step()

            stepStatus.messages.forEach(msg => {
                console.log(msg)
                console.log(match.toString())
            });

            if (stepStatus.type == STATUS_TYPE.GAME_OVER) {
                break
            }
        }
        console.log(this.match.toString())
    }
}