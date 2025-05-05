import assert from 'assert';
import { Card } from './Card';


export class Combo {
    readonly cards: ReadonlyArray<Card>;

    static fromString(desc: string): Combo {
        const cards = Card.fromStringToArray(desc);
        return new Combo(cards);
    }

    clone(): Combo {
        const newCombo = new Combo([... this.cards]);
        return newCombo;
    }

    constructor(cards: Card[]) {
        this.cards = Combo.prepareForCheck(cards);
        assert(Combo.checkValid(this.cards), `Incorrect Horizontal or Vertical Combo ${this.cards}`);
    }

    static prepareForCheck(cards: Card[]): ReadonlyArray<Card> {
        const sortedCards = [...cards]; // Shallow copy
        sortedCards.sort(Card.cardSorter);
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
        assert(Combo.minLength(cards), "Combo must have at least 3 cards");
        const verticalOk = this.checkSameSuit(cards) && this.checkStraight(cards);
        const horizontalOk = this.checkDifferentSuit(cards) && this.checkSameValue(cards);
        return verticalOk || horizontalOk;
    }

    static minLength(cards: readonly Card[]): unknown {
        return cards.length >= 3;
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
            if (!this.cards[i].same(other.cards[i])) {
                return false;
            }
        }

        // All cards matched
        return true;
    }

    toString(): string {
        return this.cards.map(card => card.toString()).join('');
    }

    toJSON(): any {
        return this.cards.map(card => card.toJSON());
    }
}


