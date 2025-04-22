import { Card, Combo, Suit } from '../types';

describe('Combo Class', () => {
    it('should create a valid combo with same suit and straight values', () => {
        const cards = [new Card(1, Suit.Spades), new Card(2, Suit.Spades), new Card(3, Suit.Spades)];
        const combo = new Combo(cards);
        expect(combo.cards).toEqual(cards);
    });

    it('should create a valid combo with same value and different suits', () => {
        const cards = [new Card(5, Suit.Spades), new Card(5, Suit.Hearts), new Card(5, Suit.Diamonds)];
        const combo = new Combo(cards);
        expect(combo.cards).toEqual(cards);
    });

    it('should throw an error for invalid combo', () => {
        const cards = [new Card(1, Suit.Spades), new Card(3, Suit.Spades), new Card(5, Suit.Spades)];
        expect(() => new Combo(cards)).toThrow();
    });

    it('should throw an error if cards have different suits and are not consecutive', () => {
        const cards = [new Card(1, Suit.Spades), new Card(2, Suit.Hearts), new Card(3, Suit.Diamonds)];
        expect(() => new Combo(cards)).toThrow();
    });

    it('should throw an error if cards have the same suit but are not consecutive', () => {
        const cards = [new Card(1, Suit.Spades), new Card(3, Suit.Spades), new Card(4, Suit.Spades)];
        expect(() => new Combo(cards)).toThrow();
    });

    it('should throw an error if cards have the same value but duplicate suits', () => {
        const cards = [new Card(5, Suit.Spades), new Card(5, Suit.Spades), new Card(5, Suit.Hearts)];
        expect(() => new Combo(cards)).toThrow();
    });

    it('should throw an error with a single card', () => {
        const cards = [new Card(7, Suit.Clubs)];
        expect(() => new Combo(cards)).toThrow();
    });

    it('should throw an error if no cards are provided', () => {
        const cards: Card[] = [];
        expect(() => new Combo(cards)).toThrow();
    });
});

describe('Combo.checkValid', () => {
    it('should return true for a valid vertical combo (same suit, consecutive values)', () => {
        const cards = [new Card(1, Suit.Spades), new Card(2, Suit.Spades), new Card(3, Suit.Spades)];
        expect(Combo.checkValid(cards)).toBe(true);
    });

    it('should return true for a valid horizontal combo (same value, different suits)', () => {
        const cards = [new Card(5, Suit.Spades), new Card(5, Suit.Hearts), new Card(5, Suit.Diamonds)];
        expect(Combo.checkValid(cards)).toBe(true);
    });

    it('should return false for cards with the same suit but non-consecutive values', () => {
        const cards = [new Card(1, Suit.Spades), new Card(3, Suit.Spades), new Card(4, Suit.Spades)];
        expect(Combo.checkValid(cards)).toBe(false);
    });

    it('should return false for cards with the same value but duplicate suits', () => {
        const cards = [new Card(5, Suit.Spades), new Card(5, Suit.Spades), new Card(5, Suit.Hearts)];
        expect(Combo.checkValid(cards)).toBe(false);
    });

    it('should return false for cards with the straight but replicated values', () => {
        const cards = [new Card(4, Suit.Spades), new Card(5, Suit.Spades), new Card(5, Suit.Hearts)];
        expect(Combo.checkValid(cards)).toBe(false);
    });

    it('should return false for cards with different suits and non-consecutive values', () => {
        const cards = [new Card(1, Suit.Spades), new Card(2, Suit.Hearts), new Card(3, Suit.Diamonds)];
        expect(Combo.checkValid(cards)).toBe(false);
    });

    it('should throw an error for cards with less than 3 cards', () => {
        const cards = [new Card(1, Suit.Spades), new Card(2, Suit.Spades)];
        expect(() => Combo.checkValid(cards)).toThrow();
    });

    it('should return true for a valid vertical combo with edge case values (Ace, King, Queen)', () => {
        const cards = [new Card(12, Suit.Clubs), new Card(13, Suit.Clubs), new Card(1, Suit.Clubs)];
        expect(Combo.checkValid(cards)).toBe(true);
    });

    it('should return true for a valid vertical combo with edge case values (Two, Ace, King)', () => {
        const cards = [new Card(2, Suit.Clubs), new Card(13, Suit.Clubs), new Card(1, Suit.Clubs)];
        expect(Combo.checkValid(cards)).toBe(true);
    });


    it('should return false for an invalid combo with mixed suits and values', () => {
        const cards = [new Card(1, Suit.Spades), new Card(3, Suit.Hearts), new Card(5, Suit.Diamonds)];
        expect(Combo.checkValid(cards)).toBe(false);
    });
});

