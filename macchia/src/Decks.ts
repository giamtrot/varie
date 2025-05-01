import assert from 'assert';
import { Card } from './Card';
import { Player, Players } from './Players';
import { Suit } from './Card';


export class Decks {

    cards: Card[];

    constructor({ cards = [], decksNumber = 0 }: { cards?: Card[], decksNumber?: number }) {
        if (cards.length !== 0) {
            this.cards = cards;
            return;
        }

        if (decksNumber === 0) {
            throw new Error("Cards must be provided or number of decks must be greater than 0");
        }

        this.cards = []
        for (let i = 0; i < decksNumber; i++) {
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

    static fromString(desc: string): Decks {
        const cards: Card[] = [];
        desc.split(")(").forEach((cardDesc) => {
            cardDesc = cardDesc.replace("(", "").replace(")", "");
            const card = Card.of(cardDesc);
            cards.push(card);
        });
        return new Decks({ cards: cards });
    }

    next() {
        assert(this.hasNext(), "No card available")
        return this.cards.pop()!;
    }

    hasNext(): boolean {
        return this.cards.length > 0
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

    toJSON() {
        return this.cards.map(card => card.toJSON());
    }

    distribute(players: Player[], cardNumber: number) {
        this.shuffle();
        console.log("Starting desk: " + this.toString())
        assert(players.length * cardNumber < this.length(), "Not enough cards");
        for (let i = 0; i < cardNumber; i++) {
            players.forEach(player => {
                player.add(this.cards.pop()!);
            });
        }
    }


}
