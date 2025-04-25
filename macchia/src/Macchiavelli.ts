

// Import or define the Decks class
import { Player, Players } from './Players';
import { Decks } from './Decks';
import { Combo } from './Combos';

import { Desk } from './Desk';
import { Match } from './Match';

const decks: Decks = new Decks(2).shuffle();

// console.log("Decks:\n" + decks.toString());
const playersNumber = 5
let ps: Player[] = [];

for (let p = 1; p <= playersNumber; p++) {
    ps.push(new Player("Player " + p))
}

const players = new Players(ps)

decks.distribute(players.players, 13);
const desk: Desk = new Desk()

let match = new Match(players, decks, desk)
while (match.canContinue()) {
    match.step()
}

console.log(match.toString())

