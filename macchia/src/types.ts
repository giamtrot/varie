import 'colors';
import assert from 'assert';

export enum Suit {

    // Hearts = "❤️",
    // Diamonds = "♦️", 
    // Clubs = "♣️",
    // Spades = "♠️",

    Spades = "Spades",
    Hearts = "Hearts",
    Diamonds = "Diamonds",
    Clubs = "Clubs",
}

const RED = (msg: string) => msg.red.bold;
const BLACK = (msg: string) => msg.black.bold;

export const SuitInfo: Record<Suit, { color: any, index: number }> = {
    [Suit.Spades]: { color: BLACK, index: 0 },
    [Suit.Hearts]: { color: RED, index: 1 },
    [Suit.Diamonds]: { color: RED, index: 2 },
    [Suit.Clubs]: { color: BLACK, index: 3 }
}

export class Card {
    value: number;
    suit: Suit;

    BASE_CODE = 0x1F0A1; // Base code for playing cards

    code(): number {
        return this.BASE_CODE + this.value + (this.value <= 11 ? -1 : 0) + SuitInfo[this.suit].index * 0x10;
    }

    constructor(value: number, suit: Suit) {
        assert(value >= 1 && value <= 13, "Value must be between 1 and 13");
        this.value = value;
        this.suit = suit;
    }

    toString(): string {
        const char = String.fromCodePoint(this.code());
        return SuitInfo[this.suit].color(char)
    }
}

export class Deck {

    cards: Card[] = [];

    constructor() {
        Object.values(Suit).forEach(
            (suit) => {
                for (let i = 1; i <= 13; i++) {
                    const card: Card = new Card(i, suit)
                    this.cards.push(card);
                }
            }
        )
    }

    shuffle(): Deck {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return this;
    }

    length(): number {
        return this.cards.length;
    }

    toString(): string {
        return this.cards.map(card => card.toString()).join("");
    }

}

export class Decks {
    decks: Deck[] = [];
    constructor(numDecks: number) {
        for (let i = 0; i < numDecks; i++) {
            this.decks.push(new Deck());
        }
    }
    shuffle(): Decks {
        this.decks.forEach(deck => deck.shuffle());
        return this;
    }

    length(): number {
        return this.decks.reduce((acc, deck) => acc + deck.length(), 0);
    }

    distribute(players: Player[], howMany: number) {
        this.shuffle();
        assert(players.length * howMany < this.length(), "Not enough cards");
    }

    toString(): string {
        return this.decks.map(deck => deck.toString()).join("\n");
    }
}

export class Player {
    name: string;
    hand: Card[] = [];

    constructor(name: string) {
        this.name = name;
    }

    toString(): string {
        return this.name + ": " + this.hand.map(card => card.toString()).join("");
    }
}