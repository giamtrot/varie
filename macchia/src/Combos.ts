import assert from 'assert';
import { Card } from './Card';
import { cardSorter } from './Card';


export class Combo {
    readonly cards: ReadonlyArray<Card>;

    constructor(cards: Card[]) {
        this.cards = Combo.prepareForCheck(cards);
        assert(Combo.checkValid(this.cards), `Incorrect Horizontal or Vertical Combo ${this.cards}`);
    }

    static prepareForCheck(cards: Card[]): ReadonlyArray<Card> {
        const sortedCards = [...cards]; // Shallow copy
        sortedCards.sort(cardSorter);
        return Object.freeze(sortedCards)
    }

    static checkSameValue(cards: ReadonlyArray<Card>): boolean {
        const first = cards[0];
        return cards.filter(card => !card.sameValue(first)).length == 0;
    }

    static checkDifferentSuit(cards: ReadonlyArray<Card>) {
        for (let i = 0; i <= cards.length - 2; i++) {
            if (cards[i].sameSuit(cards[i + 1])) {
                return false;
            }
        }
        return true;
    }

    static checkStraight(cards: ReadonlyArray<Card>): boolean {
        assert(cards.length >= 3, "Combo must have at least 3 cards");

        for (let start = 0; start < cards.length; start++) {
            const recombined = [...cards.slice(start), ...cards.slice(0, start)];
            if (Combo.checkFollowing(recombined)) {
                return true;
            }
        }


        return false;
    }

    private static checkFollowing(cards: ReadonlyArray<Card>): boolean {
        for (let i = 0; i <= cards.length - 2; i++) {
            if (!cards[i + 1].follows(cards[i])) {
                return false;
            }
        }
        return true;
    }

    static checkSameSuit(cards: ReadonlyArray<Card>): boolean {
        const first = cards[0];
        return cards.filter(card => !card.sameSuit(first)).length == 0;
    }

    static checkValid(cards: ReadonlyArray<Card>): boolean {
        assert(cards.length >= 3, "Combo must have at least 3 cards");
        const verticalOk = this.checkSameSuit(cards) && this.checkStraight(cards);
        const horizontalOk = this.checkDifferentSuit(cards) && this.checkSameValue(cards);
        return verticalOk || horizontalOk;
    }

    equals(other: Combo): boolean {
        if (other === null || other === undefined) {
            return false;
        }

        if (this === other) { // Same instance
            return true;
        }
        if (this.cards.length !== other.cards.length) {
            return false;
        }

        // Compare card by card
        for (let i = 0; i < this.cards.length; i++) {
            if (!this.cards[i].equals(other.cards[i])) {
                return false;
            }
        }

        // All cards matched
        return true;
    }

}

export class Combos {
    combos: Combo[] = [];

    add(combo: Combo) {
        if (!this.contains(combo)) {
            this.combos.push(combo);
        }
    }

    get length(): number {
        return this.combos.length;
    }

    pop(): Combo {
        assert(this.length > 0, "No combo avaliable")
        return this.combos.pop()!;
    }

    contains(combo: Combo) {
        return this.combos.filter(c => c.equals(combo)).length > 0;
    }
}
