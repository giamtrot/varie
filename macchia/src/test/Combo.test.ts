import { Suit } from '../Card';
import { Combo } from '../Combos';
import { Card } from '../Card';

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

    it('should return false if two card not consecutive are of the same suit', () => {
        const cards = [new Card(4, Suit.Spades), new Card(4, Suit.Hearts), new Card(4, Suit.Spades)];
        const sorted = Combo.prepareForCheck(cards)
        expect(Combo.checkDifferentSuit(sorted)).toBe(false);
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
        const cards = [new Card(4, Suit.Spades), new Card(5, Suit.Spades), new Card(5, Suit.Spades)];
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

describe('Combo.equals', () => {
    // Helper cards
    const cardAS = new Card(1, Suit.Spades);
    const card2S = new Card(2, Suit.Spades);
    const card3S = new Card(3, Suit.Spades);
    const card4S = new Card(4, Suit.Spades);
    const card5H = new Card(5, Suit.Hearts);
    const card5D = new Card(5, Suit.Diamonds);
    const card5C = new Card(5, Suit.Clubs);
    const card5S = new Card(5, Suit.Spades);


    it('should return true when comparing a combo to itself', () => {
        const combo = new Combo([cardAS, card2S, card3S]);
        expect(combo.equals(combo)).toBe(true);
    });

    it('should return true for two different combo instances with the same cards in the same order', () => {
        // Constructor sorts, so initial order doesn't strictly matter if cards are identical
        const combo1 = new Combo([cardAS, card2S, card3S]);
        const combo2 = new Combo([cardAS, card2S, card3S]);
        expect(combo1.equals(combo2)).toBe(true);
        expect(combo2.equals(combo1)).toBe(true); // Check commutativity
    });

    it('should return true for two combos created with the same cards but different initial order', () => {
        const combo1 = new Combo([card3S, cardAS, card2S]); // Unsorted input
        const combo2 = new Combo([cardAS, card2S, card3S]); // Sorted input
        // Both should result in [AS, 2S, 3S] internally
        expect(combo1.equals(combo2)).toBe(true);
        expect(combo2.equals(combo1)).toBe(true);
    });

    it('should return false for combos with different lengths', () => {
        const combo1 = new Combo([cardAS, card2S, card3S]);
        const combo2 = new Combo([cardAS, card2S, card3S, card4S]); // Different length
        expect(combo1.equals(combo2)).toBe(false);
        expect(combo2.equals(combo1)).toBe(false);
    });

    it('should return false for combos of the same length but with different cards', () => {
        const combo1 = new Combo([cardAS, card2S, card3S]); // Straight flush
        const combo2 = new Combo([card5H, card5D, card5C]); // Set
        expect(combo1.equals(combo2)).toBe(false);
        expect(combo2.equals(combo1)).toBe(false);
    });

    it('should return false for combos of the same length with one different card', () => {
        const combo1 = new Combo([card5C, card5D, card5H]);
        const combo2 = new Combo([card5C, card5D, card5S]); // Last card differs
        expect(combo1.equals(combo2)).toBe(false);
        expect(combo2.equals(combo1)).toBe(false);
    });

    it('should return false when comparing with null', () => {
        const combo = new Combo([cardAS, card2S, card3S]);
        // Need to cast null to Combo type or use ts-ignore for type checking
        expect(combo.equals(null as any)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
        const combo = new Combo([cardAS, card2S, card3S]);
        // Need to cast undefined to Combo type or use ts-ignore for type checking
        expect(combo.equals(undefined as any)).toBe(false);
    });

    // Edge case: Comparing combos where Card.equals might differ due to ID,
    // but value/suit are the same. Your current Combo.equals relies on Card.equals.
    // Let's test this specific interaction.
    it('should return false if Card.equals returns false due to different IDs (current behavior)', () => {
        // Create two distinct Card instances with same value/suit
        const cardInstance1 = new Card(1, Suit.Spades);
        const cardInstance2 = new Card(1, Suit.Spades);
        const cardInstance3 = new Card(2, Suit.Spades);
        const cardInstance4 = new Card(3, Suit.Spades);

        // Ensure IDs are different (they should be by default)
        expect(cardInstance1.id).not.toBe(cardInstance2.id);
        expect(cardInstance1.equals(cardInstance2)).toBe(false); // Card.equals checks ID

        const combo1 = new Combo([cardInstance1, cardInstance3, cardInstance4]);
        const combo2 = new Combo([cardInstance2, cardInstance3, cardInstance4]); // Same values/suits, but first card instance differs

        // Because Combo.equals uses Card.equals, and Card.equals checks ID, this should be false
        expect(combo1.equals(combo2)).toBe(false);
    });
});
