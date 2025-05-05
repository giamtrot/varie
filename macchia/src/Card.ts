import assert from 'assert';
import 'colors';

export enum Suit {

    // Hearts = "❤️",
    // Diamonds = "♦️", 
    // Clubs = "♣️",
    // Spades = "♠️",
    Spades = "Spades",
    Hearts = "Hearts",
    Diamonds = "Diamonds",
    Clubs = "Clubs"
}

const RED = (msg: string) => msg.red.bold;
const BLACK = (msg: string) => msg.black.bold;

export const SuitInfo: Record<Suit, { color: any; index: number; colorName: string }> = {
    [Suit.Spades]: { color: BLACK, index: 0, colorName: "Black" },
    [Suit.Hearts]: { color: RED, index: 1, colorName: "Red" },
    [Suit.Diamonds]: { color: RED, index: 2, colorName: "Red" },
    [Suit.Clubs]: { color: BLACK, index: 3, colorName: "Black" }
};



export class Card {

    static readonly BASE_CODE = 0x1F0A1; // Base code for playing cards
    static count = 0;

    id: number;
    value: number;
    suit: Suit;
    // horizontals = new CardSet()
    // verticals = new CardSet()

    constructor(value: number, suit: Suit) {
        assert(value >= 1 && value <= 13, "Value must be between 1 and 13");
        this.id = ++Card.count;
        this.value = value;
        this.suit = suit;
    }

    static fromStringToArray(desc: string): Card[] {
        assert(desc.startsWith("(") && desc.endsWith(")"), "Card description must start with '(' and end with ')'");
        desc = desc.substring(1, desc.length - 1);
        const cards: Card[] = [];
        desc.split(")(").forEach((cardDesc) => {
            // cardDesc = cardDesc.replace("(", "").replace(")", "");
            const card = Card.of(cardDesc);
            cards.push(card);
        });
        return cards;
    }


    static cardSorter = (a: Card, b: Card): number => {
        if (a.value === b.value) {
            return SuitInfo[a.suit].index - SuitInfo[b.suit].index;
        } else {
            return a.value - b.value;
        }
    };

    static suitFromString(desc: string): Suit {
        switch (desc.toUpperCase()) {
            case "S":
                return Suit.Spades;
            case "H":
                return Suit.Hearts;
            case "D":
                return Suit.Diamonds;
            case "C":
                return Suit.Clubs;
            default:
                throw new Error(`Invalid suit description: ${desc}`);
        }
    }

    static of(desc: string) {
        assert(desc.length >= 2 && desc.length <= 3, "Card description must be 2 or 3 characters long");
        const vs = desc.substring(0, 2);
        const value = parseInt(vs);
        assert(!isNaN(value), `Invalid card value '${vs}': Value must be between 1 and 13`);
        const suit = Card.suitFromString(desc[desc.length - 1]);

        return new Card(value, suit);
    }

    code(): number {
        return Card.BASE_CODE + this.value + (this.value <= 11 ? -1 : 0) + SuitInfo[this.suit].index * 0x10;
    }

    isVerticalMatch(card: Card) {
        if (!this.sameSuit(card)) {
            return false;
        }

        if (card.follows(this) || this.follows(card)) {
            return true;
        }

        return false;
    }

    follows(card: Card): boolean {

        if (!this.sameSuit(card)) {
            return false;
        }

        if (this.value - card.value === 1) {
            return true;
        }

        if (this.value === 1 && card.value === 13) {
            return true;
        }

        return false;
    }

    isHorizontalMatch(card: Card) {
        return this.sameValue(card) && !this.sameSuit(card);
    }

    sameSuit(card: Card): boolean {
        return this.suit === card.suit;
    }

    sameValue(card: Card) {
        return this.value === card.value;
    }

    toString(): string {
        const char = this.cardChar();
        return SuitInfo[this.suit].color(`(${this.value}${this.suit[0]})`);
    }

    private cardChar() {
        return String.fromCodePoint(this.code());
    }

    toJSON() {
        const color = SuitInfo[this.suit].colorName
        return { char: this.cardChar(), color: color };
    }

    equals(other: Card): boolean {
        return this.id === other.id;
    }

    same(other: Card): boolean {
        return this.sameSuit(other) && this.sameValue(other);
    }
}


