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

        if (this.suit !== card.suit) {
            return false;
        }

        if (Math.abs(this.value - card.value) == 1) {
            return true;
        }

        if (Math.abs(this.value - card.value) == 12) {
            return true;
        }

        return false;
    }

    linkHorizontal(card: Card) {
        this.horizontals.push(card);
        card.horizontals.push(this);
    }

    isHorizontalMatch(card: Card) {
        return this.value === card.value && this.suit !== card.suit;
    }

    static readonly BASE_CODE = 0x1F0A1; // Base code for playing cards

    static count = 0;

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

    equals(other: Card): boolean {
        return this.value === other.value && this.suit === other.suit && this.id === other.id;
    }
}

export class Combo {
    cards: Card[] = [];
    constructor(cards: Card[]) {
        assert(cards.length >= 3, "Combo must have at least 3 cards");
        cards.sort(cardSorter)
        const verticalOk = this.checkSameSuit(cards) && this.checkStraight(cards)
        const horizontalOk = this.checkDifferentSuit(cards) && this.checkSameValue(cards)
        console.log(verticalOk, horizontalOk)
        assert(verticalOk || horizontalOk, `Incorrect Horizontal or Vertical Combo ${cards}`);

        this.cards = cards;
    }

    checkSameValue(cards: Card[]): boolean {
        const value = cards[0].value;
        return cards.filter(card => card.value !== value).length == 0;
    }

    checkDifferentSuit(cards: Card[]) {
        for (let i = 0; i < cards.length - 2; i++) {
            if (cards[i].suit == cards[i + 1].suit) {
                return false;
            }
        }
        return true;
    }

    checkStraight(cards: Card[]): boolean {
        for (let i = 0; i < cards.length - 2; i++) {
            if (cards[i].value + 1 !== cards[i + 1].value) {
                return false;
            }
        }
        return true;
    }

    checkSameSuit(cards: Card[]): boolean {
        const suit = cards[0].suit;
        return cards.filter(card => card.suit !== suit).length == 0;
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
            if (card.isHorizontalMatch(c)) {
                c.linkHorizontal(card);
            }

            if (card.isVerticalMatch(c)) {
                c.linkVertical(card);
            }
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



