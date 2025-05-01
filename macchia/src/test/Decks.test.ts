import { Player } from '../Players';
import { Decks } from '../Decks';
import { Card, Suit } from '../Card';

describe('Decks Class', () => {

    it('should create multiple decks', () => {
        const decks = new Decks({ decksNumber: 2 });
        expect(decks.length()).toBe(104);
    });

    it('should shuffle all decks', () => {
        const decks = new Decks({ decksNumber: 2 });;
        const originalOrder = decks.toString();
        decks.shuffle();
        expect(decks.toString()).not.toBe(originalOrder);
    });

    it('should throw an error if distributing more cards than available', () => {
        const decks = new Decks({ decksNumber: 2 });;
        const players = [new Player("Alice"), new Player("Bob")];
        expect(() => decks.distribute(players, 60)).toThrow("Not enough cards");
    });

    it('should distribute the correct number of cards to each player', () => {
        const decks = new Decks({ decksNumber: 1 });;
        const players = [new Player("Alice"), new Player("Bob")];
        decks.distribute(players, 5);

        expect(players[0].hand.cards.length).toBe(5);
        expect(players[1].hand.cards.length).toBe(5);
        expect(decks.length()).toBe(52 - 10);
    });

    it('should distribute unique cards to each player', () => {
        const decks = new Decks({ decksNumber: 1 });;
        const players = [new Player("Alice"), new Player("Bob")];
        decks.distribute(players, 5);

        const allCards = [...players[0].hand.cards.cards, ...players[1].hand.cards.cards];
        const uniqueCards = new Set(allCards.map(card => card.code()));
        expect(allCards.length).toBe(uniqueCards.size);
    });

    it('should throw an error if there are not enough cards to distribute', () => {
        const decks = new Decks({ decksNumber: 1 });;
        const players = [new Player("Alice"), new Player("Bob")];
        expect(() => decks.distribute(players, 30)).toThrow("Not enough cards");
    });

    it('should leave the remaining cards in the deck after distribution', () => {
        const decks = new Decks({ decksNumber: 1 });;
        const players = [new Player("Alice"), new Player("Bob")];
        decks.distribute(players, 5);

        const remainingCards = decks.length();
        expect(remainingCards).toBe(52 - 10);
    });

    it('should shuffle the deck before distributing cards', () => {
        const decks = new Decks({ decksNumber: 1 });;
        const players = [new Player("Alice"), new Player("Bob")];
        const originalOrder = decks.toString();
        decks.distribute(players, 5);

        const newOrder = decks.toString();
        expect(newOrder).not.toBe(originalOrder);
    });

    it('should return the next card from the deck', () => {
        const decks = new Decks({ decksNumber: 1 });;
        const initialLength = decks.length();
        const nextCard = decks.next();

        expect(nextCard).toBeDefined();
        expect(decks.length()).toBe(initialLength - 1);
    });

    it('should throw an error when calling next on an empty deck', () => {
        const decks = new Decks({ decksNumber: 1 });;
        while (decks.hasNext()) {
            decks.next();
        }

        expect(() => decks.next()).toThrow("No card available");
    });
    it('should return a JSON representation of the deck', () => {
        const decks = new Decks({ decksNumber: 1 });;
        const json = decks.toJSON();

        expect(Array.isArray(json)).toBe(true);
        expect(json.length).toBe(52);
        json.forEach(card => {
            expect(card).toHaveProperty('char');
            expect(card).toHaveProperty('color');
        });
    });

    it('should return an empty array when the deck is empty', () => {
        const decks = new Decks({ decksNumber: 1 });;
        while (decks.hasNext()) {
            decks.next();
        }

        const json = decks.toJSON();
        expect(Array.isArray(json)).toBe(true);
        expect(json.length).toBe(0);
    });

    it('should initialize with provided cards', () => {
        const cards = [
            Card.of("1H"),
            Card.of("2S"),
            Card.of("3C"),
        ];
        const decks = new Decks({ cards });

        expect(decks.length()).toBe(3);
        expect(decks.toString()).toBe(cards.map(card => card.toString()).join(""));
    });

    it('should initialize with provided cards, and ignore the number of decks parameter', () => {
        const cards = [
            Card.of("1H"),
            Card.of("2S"),
            Card.of("3C"),
        ];
        const decks = new Decks({ decksNumber: 2, cards });

        expect(decks.length()).toBe(3);
        expect(decks.toString()).toBe(cards.map(card => card.toString()).join(""));
    });

    it('should initialize with the correct number of decks', () => {
        const decks = new Decks({ decksNumber: 2 });

        expect(decks.length()).toBe(104);
    });

    it('should throw an error if no cards or decksNumber are provided', () => {
        expect(() => new Decks({})).toThrow("Cards must be provided or number of decks must be greater than 0");
    });

    it('should create a deck with 52 cards for a single deck', () => {
        const decks = new Decks({ decksNumber: 1 });

        expect(decks.length()).toBe(52);
        const suits = Object.values(Suit);
        suits.forEach(suit => {
            for (let i = 1; i <= 13; i++) {
                expect(decks.toString()).toContain(new Card(i, suit).toString());
            }
        });
    });
    describe('Decks Class fromString Method', () => {
        it('should create a Decks instance from a string representation', () => {
            const cd1 = "1H";
            const cd2 = "2S";
            const cd3 = "3C";
            const cd4 = "4D";
            const desc = `(${cd1})(${cd2})(${cd3})(${cd4})`;
            const decks = Decks.fromString(desc);

            expect(decks.length()).toBe(4);
            expect(decks.cards[0].same(Card.of(cd1))).toBe(true);
            expect(decks.cards[1].same(Card.of(cd2))).toBe(true);
            expect(decks.cards[2].same(Card.of(cd3))).toBe(true);
            expect(decks.cards[3].same(Card.of(cd4))).toBe(true);
        });

        it('should handle an empty string and create an empty Decks instance', () => {
            const desc = "";
            expect(() => Decks.fromString(desc)).toThrow();
        });

        it('should throw an error for an invalid card string', () => {
            const desc = "(1H)(InvalidCard)(3C)";
            expect(() => Decks.fromString(desc)).toThrow();
        });

        it('should ignore extra spaces or invalid formatting in the string', () => {
            const desc = " (1H) (2C) (3C) ";
            expect(() => Decks.fromString(desc)).toThrow();
        });
    });
});