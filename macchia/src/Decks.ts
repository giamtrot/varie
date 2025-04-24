import assert from 'assert';
import { Card } from './Card';
import { Player } from './Player';
import { Suit } from './Card';


export class Decks {

    next() {
        assert(this.hasNext(), "No card available")
        return this.cards.pop()!;
    }
    hasNext(): boolean {
        return this.cards.length > 0
    }

    cards: Card[] = [];

    constructor(numDecks: number) {
        for (let i = 0; i < numDecks; i++) {
            Object.values(Suit).forEach(
                (suit) => {
                    for (let i = 1; i <= 13; i++) {
                        const card: Card = new Card(i, suit);
                        this.cards.push(card);
                    }
                }
            );
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
            });
        }
    }


}
