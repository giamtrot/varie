

// Import or define the Decks class
import { Player } from './Player';
import { Decks } from './Decks';

const decks: Decks = new Decks(2).shuffle();

// console.log("Decks:\n" + decks.toString());
const playersNumber = 5
let players: Player[] = [];

for (let p = 1; p <= playersNumber; p++) {
    players.push(new Player("Player " + p))
}

decks.distribute(players, 13);

while (true) {
    for (let p = 0; p < players.length; p++) {
        if (!decks.hasNext()) {
            console.log("Exit for")
            break
        }
        const player = players[p];
        console.log(`Doing player ${player.name}`)
        const card = decks.next()
        player.add(card)
    }

    if (!decks.hasNext()) {
        console.log("Exit while")
        break
    }
}

players.forEach(p => { 
    p.handSort(); 
    console.log(p.toString()) 
})