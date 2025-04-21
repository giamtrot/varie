import { Card, CardLink, CardLinkType, Suit } from '../types';
describe('Card Class', () => {
    it('should create a card with valid value and suit', () => {
        const card1 = new Card(1, Suit.Spades);
        expect(card1.id).toBe(1); // Assuming this is the first card created
        expect(card1.value).toBe(1);
        expect(card1.suit).toBe(Suit.Spades);
        const card2 = new Card(3, Suit.Hearts);
        expect(card2.id).toBe(2);
        expect(card2.value).toBe(3);
        expect(card2.suit).toBe(Suit.Hearts);
    });

    it('should throw an error for invalid card value', () => {
        expect(() => new Card(0, Suit.Spades)).toThrow("Value must be between 1 and 13");
        expect(() => new Card(14, Suit.Spades)).toThrow("Value must be between 1 and 13");
    });

    it('should return the correct Unicode code point for a card', () => {
        const card = new Card(1, Suit.Spades);
        expect(card.code()).toBe(0x1F0A1);
    });

    it('should return the correct string representation of a card', () => {
        const card = new Card(1, Suit.Hearts);
        expect(card.toString()).toBe("🂱".red.bold);
    });

    it('should return true for cards with the same value, suit, and id', () => {
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(1, Suit.Spades);
        card2.id = card1.id; // Manually set the same id for testing
        expect(card1.equals(card2)).toBe(true);
    });

    it('should return false for cards with different values', () => {
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(2, Suit.Spades);
        expect(card1.equals(card2)).toBe(false);
    });

    it('should return false for cards with different suits', () => {
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(1, Suit.Hearts);
        expect(card1.equals(card2)).toBe(false);
    });

    it('should return false for cards with different ids', () => {
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(1, Suit.Spades);
        expect(card1.equals(card2)).toBe(false);
    });

    it('should return true when comparing a card to itself', () => {
        const card = new Card(1, Suit.Spades);
        expect(card.equals(card)).toBe(true);
    });


    describe('CardLink Class', () => {
        it('should create a card link with a type and a card', () => {
            const card = new Card(1, Suit.Spades);
            const link = new CardLink(CardLinkType.Horizontal, card);
            expect(link.type).toBe(CardLinkType.Horizontal);
            expect(link.other).toBe(card);
        });

        it('should return the correct string representation of the card link', () => {
            const card = new Card(1, Suit.Spades);
            const link = new CardLink(CardLinkType.Vertical, card);
            expect(link.toString()).toBe("V -> " + "🂡".black.bold);
        });
    });
});