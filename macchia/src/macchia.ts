

// Import or define the Decks class
import { Decks, Player } from './types'; // Adjust the path as needed

const decks: Decks = new Decks(2);
console.log("Decks:\n" + decks.toString());
let player1: Player = new Player("Player 1");
let player2: Player = new Player("Player 2");
let player3: Player = new Player("Player 3");
let player4: Player = new Player("Player 4");
let players: Player[] = [player1, player2, player3, player4];
console.log("Players:\n" + players.map(player => player.name).join("\n"));

decks.distribute(players, 13);

// console.log("Deck\n" + deck.shuffle().toString());


// console.log(`Shuffled Deck: ${deck[0]}`);
// console.log("Shuffled Deck: " + deck[0]);

