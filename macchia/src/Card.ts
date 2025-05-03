import assert from 'assert';
import 'colors';
import { Combo, Combos } from './Combos';

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
        const cards: Card[] = [];
        desc.split(")(").forEach((cardDesc) => {
            cardDesc = cardDesc.replace("(", "").replace(")", "");
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

    // toStringExtra(): string {
    //     const horizs = this.horizontals.length == 0 ? "" : `(H->${this.horizontals})`;
    //     const verts = this.verticals.length == 0 ? "" : `(V->${this.verticals})`;
    //     return `${this.toString()}${horizs}${verts}`;
    // }

    equals(other: Card): boolean {
        return this.id === other.id;
    }

    same(other: Card): boolean {
        return this.sameSuit(other) && this.sameValue(other);
    }
}

export class CardSet {
    cards: Card[] = []

    clone(): CardSet {
        const newSet = new CardSet();
        newSet.cards = [...this.cards]; // Shallow copy of the array
        return newSet;
    }

    push(card: Card) {
        this.cards.push(card);
    }

    contains(c: Card): boolean {
        return this.cards.indexOf(c) >= 0;
    }

    sort() {
        this.cards.sort(Card.cardSorter)
    }

    get length() {
        return this.cards.length;
    }

    remove(card: Card) {
        const index = this.cards.indexOf(card);
        assert(index >= 0, `Card ${card} not found in set`)
        this.cards.splice(index, 1);
    }

    toString() {
        return this.cards.map(card => card.toString()).join("")
    }

    toJSON() {
        return this.cards.map(card => card.toJSON())
    }

}

export class Hand {
    _cards: CardSet = new CardSet()
    combos = new Combos();
    horizontals: Map<Card, CardSet> = new Map()
    verticals: Map<Card, CardSet> = new Map()

    clone(): Hand {
        const newHand = new Hand();
        newHand._cards = this._cards.clone()
        newHand.combos = this.combos.clone();
        newHand.horizontals = Hand.cloneMap(this.horizontals);
        newHand.verticals = Hand.cloneMap(this.verticals);
        return newHand;
    }

    static cloneMap(map: Map<Card, CardSet>): Map<Card, CardSet> {
        const deepClonedMap = new Map<Card, CardSet>();

        for (const key of map.keys()) {
            const value: CardSet = map.get(key)!;
            deepClonedMap.set(key, value.clone());
        }

        return deepClonedMap;
    }

    addAll(combos: Combo[]) {
        combos.forEach(combo => {
            combo.cards.forEach(card => {
                if (!this.cards.contains(card)) {
                    this.push(card);
                }
            });
        })
    }

    reset() {
        this.combos.reset()
    }

    getCombo() {
        assert(this.hasCombo(), "No combo available")
        return this.combos.shift()
    }

    hasCombo() {
        return this.combos.length > 0;
    }

    get cards(): CardSet {
        return this._cards;
    }

    getHorizontals(card: Card): CardSet {
        if (!this.horizontals.has(card)) {
            this.horizontals.set(card, new CardSet())
        }
        return this.horizontals.get(card)!;
    }

    getVerticals(card: Card): CardSet {
        if (!this.verticals.has(card)) {
            this.verticals.set(card, new CardSet())
        }
        return this.verticals.get(card)!;
    }

    remove(card: Card) {
        // console.log("Removing card", card.toString(), this.getHorizontals(card))
        this.cards.remove(card)
        const nh = [...this.getHorizontals(card).cards]
        nh.forEach(h => this.unrelate(h, card))
        const nv = [...this.getVerticals(card).cards]
        nv.forEach(v => this.unrelate(v, card))
        // console.log("Removed card", card.toString(), this.getHorizontals(card))
        this.updateCombo()
    }

    relate(card1: Card, card2: Card) {
        if (card1.isHorizontalMatch(card2)) {
            this.linkHorizontal(card1, card2);
        }

        if (card1.isVerticalMatch(card2)) {
            this.linkVertical(card1, card2);
        }
    }

    linkVertical(card1: Card, card2: Card) {
        this.getVerticals(card1).push(card2);
        this.getVerticals(card2).push(card1);
    }

    linkHorizontal(card1: Card, card2: Card) {
        this.getHorizontals(card1).push(card2);
        this.getHorizontals(card2).push(card1);
    }

    unrelate(card1: Card, card2: Card): void {
        assert(this.getHorizontals(card1).contains(card2) || this.getVerticals(card1).contains(card2), `Card ${card2} not linked to ${card1}`)
        if (this.getHorizontals(card1).contains(card2)) {
            this.unlinkHorizontal(card1, card2)
        }
        if (this.getVerticals(card1).contains(card2)) {
            this.unlinkVertical(card1, card2)
        }
    }

    unlinkHorizontal(card1: Card, card2: Card) {
        assert(this.getHorizontals(card1).contains(card2) && this.getHorizontals(card2).contains(card1),
            `Card ${card2} not horizontally linked to ${card1} or viceversa`)
        // console.log("Unlinking", card1.toString(), card2.toString())
        this.getHorizontals(card1).remove(card2)
        this.getHorizontals(card2).remove(card1)
        // console.log("Unlinking", card1.toString(), card2.toString())
    }

    unlinkVertical(card1: Card, card2: Card) {
        assert(this.getVerticals(card1).contains(card2) && this.getVerticals(card2).contains(card1),
            `Card ${card2} not vertically linked to ${card1} or viceversa`)
        this.getVerticals(card1).remove(card2)
        this.getVerticals(card2).remove(card1)
    }

    updateCombo() {
        this.reset()
        this.cards.cards.filter(card => this.getHorizontals(card).length >= 2).forEach(card => {
            let newCards: Card[] = []
            this.collectHorizontals(card, newCards)
            if (Combo.minLength(newCards) && Combo.checkValid(Combo.prepareForCheck(newCards))) {
                this.combos.add(new Combo(newCards));
            }
        });

        this.cards.cards.filter(card => this.getVerticals(card).length >= 2).forEach(card => {
            let newCards: Card[] = []
            this.collectVerticals(card, newCards)
            if (Combo.minLength(newCards) && Combo.checkValid(Combo.prepareForCheck(newCards))) {
                this.combos.add(new Combo(newCards));
            }
        });
    }

    collectHorizontals(card: Card, cards: Card[]) {
        if (cards.filter(c => c.sameValue(card) && c.sameSuit(card)).length > 0) {
            return;
        }
        cards.push(card);
        this.getHorizontals(card).cards.forEach(c => this.collectHorizontals(c, cards));
    }

    collectVerticals(card: Card, cards: Card[]) {
        if (cards.filter(c => c.sameValue(card) && c.sameSuit(card)).length > 0) {
            return;
        }
        cards.push(card);
        this.getVerticals(card).cards.forEach(c => this.collectVerticals(c, cards));
    }

    push(card: Card) {
        assert(!this.cards.contains(card), `Card ${card} already in hand`)
        this.cards.cards.forEach(c => {
            this.relate(c, card);
        });
        this.cards.push(card);
        this.updateCombo()
    }

    toJSON(): any {
        return this.cards.toJSON();
    }

    toString(): string {
        return this.cards.toString();
    }
}

