import assert from 'assert';
import { Player } from './Player';


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