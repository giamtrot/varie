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
    id: number;
    value: number;
    suit: Suit;
    horizontals: Card[] = [];
    verticals: Card[] = [];

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

        return false
    }

    linkHorizontal(card: Card) {
        this.horizontals.push(card);
        card.horizontals.push(this);
    }

    isHorizontalMatch(card: Card) {
        return this.sameValue(card) && !this.sameSuit(card);
    }

    static readonly BASE_CODE = 0x1F0A1; // Base code for playing cards

    static count = 0;

    sameSuit(card: Card): boolean {
        return this.suit === card.suit;
    }

    sameValue(card: Card) {
        return this.value === card.value;
    }

    code(): number {
        return Card.BASE_CODE + this.value + (this.value <= 11 ? -1 : 0) + SuitInfo[this.suit].index * 0x10;
    }

    constructor(value: number, suit: Suit) {
        assert(value >= 1 && value <= 13, "Value must be between 1 and 13");
        this.id = ++Card.count
        this.value = value;
        this.suit = suit;
    }

    toString(): string {
        const char = String.fromCodePoint(this.code());
        return SuitInfo[this.suit].color(char)
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

export class Combo {
    cards: Card[] = [];
    constructor(cards: Card[]) {
        assert(Combo.checkValid(cards), `Incorrect Horizontal or Vertical Combo ${cards}`);
        this.cards = cards;
    }

    static checkSameValue(cards: Card[]): boolean {
        const first = cards[0];
        return cards.filter(card => !card.sameValue(first)).length == 0;
    }

    static checkDifferentSuit(cards: Card[]) {
        for (let i = 0; i <= cards.length - 2; i++) {
            if (cards[i].sameSuit(cards[i + 1])) {
                return false;
            }
        }
        return true;
    }

    static checkStraight(cards: Card[], start: number = 0): boolean {

        if (start >= cards.length) {
            return false
        }

        let pos = start
        for (let cont = 0; cont < cards.length - 1; cont++) {
            let nextPos = pos + 1 == cards.length ? 0 : pos + 1;
            if (!cards[nextPos].follows(cards[pos])) {
                return Combo.checkStraight(cards, start + 1);
            }
            pos = nextPos
        }

        return true;
    }

    static checkSameSuit(cards: Card[]): boolean {
        const first = cards[0];
        return cards.filter(card => !card.sameSuit(first)).length == 0;
    }

    static checkValid(cards: Card[]): boolean {
        assert(cards.length >= 3, "Combo must have at least 3 cards");
        cards.sort(cardSorter)
        const verticalOk = this.checkSameSuit(cards) && this.checkStraight(cards)
        const horizontalOk = this.checkDifferentSuit(cards) && this.checkSameValue(cards)
        return verticalOk || horizontalOk
    }
}

export class Combos {
    add(arg0: Combo) {
        throw new Error('Method not implemented.');
    }
    combos: Combo[] = [];
}

export class Decks {

    cards: Card[] = [];

    constructor(numDecks: number) {
        for (let i = 0; i < numDecks; i++) {
            Object.values(Suit).forEach(
                (suit) => {
                    for (let i = 1; i <= 13; i++) {
                        const card: Card = new Card(i, suit)
                        this.cards.push(card);
                    }
                }
            )
        }
    }

    shuffle(): Decks {
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

    distribute(players: Player[], cardNumber: number) {
        this.shuffle();
        assert(players.length * cardNumber < this.length(), "Not enough cards");
        for (let i = 0; i < cardNumber; i++) {
            players.forEach(player => {
                player.add(this.cards.pop()!);
            })
        }
    }
}

export class Player {
    name: string;
    hand: Card[] = [];
    combos: Combos = new Combos();

    handSort(): void {
        this.hand.sort(cardSorter);
    }

    constructor(name: string) {
        this.name = name;
    }

    toString(): string {
        return this.name + ": " + this.hand.map(card => card.toString()).join("");
    }

    add(card: Card) {
        this.hand.forEach(c => {
            c.relate(card);
        });
        this.hand.push(card);
    }

    findCombos() {
        this.hand.filter(card => card.horizontals.length >= 2).forEach(card => {
            this.combos.add(new Combo([card, ...card.horizontals]));
        });

        this.hand.filter(card => card.verticals.length >= 2).forEach(card => {
            this.combos.add(new Combo([card, ...card.verticals]));
        });
    }
}

export const cardSorter = (a: Card, b: Card): number => {
    if (a.value === b.value) {
        return SuitInfo[a.suit].index - SuitInfo[b.suit].index;
    } else {
        return a.value - b.value;
    }
};



