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

export const SuitInfo: Record<Suit, { color: any; index: number; }> = {
    [Suit.Spades]: { color: BLACK, index: 0 },
    [Suit.Hearts]: { color: RED, index: 1 },
    [Suit.Diamonds]: { color: RED, index: 2 },
    [Suit.Clubs]: { color: BLACK, index: 3 }
};

export const cardSorter = (a: Card, b: Card): number => {
    if (a.value === b.value) {
        return SuitInfo[a.suit].index - SuitInfo[b.suit].index;
    } else {
        return a.value - b.value;
    }
};

export class Card {

    static readonly BASE_CODE = 0x1F0A1; // Base code for playing cards
    static count = 0;

    id: number;
    value: number;
    suit: Suit;
    horizontals: Card[] = [];
    verticals: Card[] = [];


    constructor(value: number, suit: Suit) {
        assert(value >= 1 && value <= 13, "Value must be between 1 and 13");
        this.id = ++Card.count;
        this.value = value;
        this.suit = suit;
    }

    code(): number {
        return Card.BASE_CODE + this.value + (this.value <= 11 ? -1 : 0) + SuitInfo[this.suit].index * 0x10;
    }

    linkVertical(card: Card) {
        this.verticals.push(card);
        card.verticals.push(this);
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
        if (this.value - card.value === 1) {
            return true;
        }
        if (this.value === 1 && card.value === 13) {
            return true;
        }

        return false;
    }

    linkHorizontal(card: Card) {
        this.horizontals.push(card);
        card.horizontals.push(this);
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
        const char = String.fromCodePoint(this.code());
        return SuitInfo[this.suit].color(char);
        // return `${this.value}${this.suit[0]}`;
    }

    toStringExtra(): string {
        const horizs = this.horizontals.length == 0 ? "" : `(H->${this.horizontals.map(c => c.toString()).join("")})`;
        const verts = this.verticals.length == 0 ? "" : `(V->${this.verticals.map(c => c.toString()).join("")})`;
        return `${this.toString()}${horizs}${verts}`;
    }

    relate(card: Card) {
        if (this.isHorizontalMatch(card)) {
            this.linkHorizontal(card);
        }

        if (this.isVerticalMatch(card)) {
            this.linkVertical(card);
        }
    }

    equals(other: Card): boolean {
        return this.value === other.value && this.suit === other.suit && this.id === other.id;
    }
}


