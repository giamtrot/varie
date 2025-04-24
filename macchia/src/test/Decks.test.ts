import { Player } from '../Player';
import { Decks } from '../Decks';

describe('Decks Class', () => {
    it('should create multiple decks', () => {
        const decks = new Decks(2);
        expect(decks.length()).toBe(104);
    });

    it('should shuffle all decks', () => {
        const decks = new Decks(2);
        const originalOrder = decks.toString();
        decks.shuffle();
        expect(decks.toString()).not.toBe(originalOrder);
    });

    it('should throw an error if distributing more cards than available', () => {
        const decks = new Decks(2);
        const players = [new Player("Alice"), new Player("Bob")];
        expect(() => decks.distribute(players, 60)).toThrow("Not enough cards");
    });

    it('should distribute the correct number of cards to each player', () => {
        const decks = new Decks(1);
        const players = [new Player("Alice"), new Player("Bob")];
        decks.distribute(players, 5);

        expect(players[0].hand.length).toBe(5);
        expect(players[1].hand.length).toBe(5);
        expect(decks.length()).toBe(52 - 10);
    });

    it('should distribute unique cards to each player', () => {
        const decks = new Decks(1);
        const players = [new Player("Alice"), new Player("Bob")];
        decks.distribute(players, 5);

        const allCards = [...players[0].hand, ...players[1].hand];
        const uniqueCards = new Set(allCards.map(card => card.code()));
        expect(allCards.length).toBe(uniqueCards.size);
    });

    it('should throw an error if there are not enough cards to distribute', () => {
        const decks = new Decks(1);
        const players = [new Player("Alice"), new Player("Bob")];
        expect(() => decks.distribute(players, 30)).toThrow("Not enough cards");
    });

    it('should leave the remaining cards in the deck after distribution', () => {
        const decks = new Decks(1);
        const players = [new Player("Alice"), new Player("Bob")];
        decks.distribute(players, 5);

        const remainingCards = decks.length();
        expect(remainingCards).toBe(52 - 10);
    });

    it('should shuffle the deck before distributing cards', () => {
        const decks = new Decks(1);
        const players = [new Player("Alice"), new Player("Bob")];
        const originalOrder = decks.toString();
        decks.distribute(players, 5);

        const newOrder = decks.toString();
        expect(newOrder).not.toBe(originalOrder);
    });
    
    it('should return the next card from the deck', () => {
        const decks = new Decks(1);
        const initialLength = decks.length();
        const nextCard = decks.next();

        expect(nextCard).toBeDefined();
        expect(decks.length()).toBe(initialLength - 1);
    });

    it('should throw an error when calling next on an empty deck', () => {
        const decks = new Decks(1);
        while (decks.hasNext()) {
            decks.next();
        }

        expect(() => decks.next()).toThrow("No card available");
    });

});