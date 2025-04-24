import { Suit, Card, cardSorter } from '../Card';
import 'colors';

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

    it('should generate a unique id for each card', () => {
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(2, Suit.Hearts);
        expect(card1.id).not.toBe(card2.id);
    });

    it('should calculate the correct code for a card', () => {
        const card = new Card(1, Suit.Spades);
        expect(card.code()).toBe(0x1F0A1);
    });

    it('should correctly compare two cards for equality', () => {
        const card1 = new Card(5, Suit.Diamonds);
        const card2 = new Card(5, Suit.Diamonds);
        const card3 = new Card(6, Suit.Clubs);
        expect(card1.equals(card2)).toBe(false); // Different IDs
        expect(card1.equals(card3)).toBe(false);
    });

    it('should add a horizontal match correctly', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(5, Suit.Hearts);
        card1.linkHorizontal(card2);
        expect(card1.horizontals).toContain(card2);
        expect(card2.horizontals).toContain(card1);
    });

    it('should add a vertical match correctly', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(6, Suit.Spades);
        card1.linkVertical(card2);
        expect(card1.verticals).toContain(card2);
        expect(card2.verticals).toContain(card1);
    });

    it('should correctly identify a horizontal match', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(5, Suit.Hearts);
        expect(card1.isHorizontalMatch(card2)).toBe(true);
    });

    it('should correctly identify a vertical match', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(6, Suit.Spades);
        expect(card1.isVerticalMatch(card2)).toBe(true);
    });

    it('should correctly identify a vertical match inverted', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(6, Suit.Spades);
        expect(card1.isVerticalMatch(card2)).toBe(true);
    });

    it('should correctly identify a vertical match between Ace and King', () => {
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(13, Suit.Spades);
        expect(card1.isVerticalMatch(card2)).toBe(true);
    });


    it('should not identify a horizontal match for cards with the same suit', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(5, Suit.Spades);
        expect(card1.isHorizontalMatch(card2)).toBe(false);
    });

    it('should not identify a horizontal match for cards with different values', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(5, Suit.Spades);
        expect(card1.isHorizontalMatch(card2)).toBe(false);
    });

    it('should not identify a vertical match for cards with different suits', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(6, Suit.Hearts);
        expect(card1.isVerticalMatch(card2)).toBe(false);
    });

    it('should not identify a vertical match for cards with two number or more of difference', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(8, Suit.Spades);
        expect(card1.isVerticalMatch(card2)).toBe(false);
    });
});

describe('Card.relate', () => {
    it('should link cards horizontally if they have the same value but different suits', () => {
        const card1 = new Card(5, Suit.Hearts);
        const card2 = new Card(5, Suit.Spades);

        card1.relate(card2);

        expect(card1.horizontals).toContain(card2);
        expect(card2.horizontals).toContain(card1);
    });

    it('should link cards vertically if they have the same suit and consecutive values', () => {
        const card1 = new Card(5, Suit.Hearts);
        const card2 = new Card(6, Suit.Hearts);

        card1.relate(card2);

        expect(card1.verticals).toContain(card2);
        expect(card2.verticals).toContain(card1);
    });

    it('should link cards vertically if they have the same suit and wrap-around values (Ace and King)', () => {
        const card1 = new Card(1, Suit.Spades); // Ace of Spades
        const card2 = new Card(13, Suit.Spades); // King of Spades

        card1.relate(card2);

        expect(card1.verticals).toContain(card2);
        expect(card2.verticals).toContain(card1);
    });

    it('should not link cards horizontally if they have the same suit', () => {
        const card1 = new Card(5, Suit.Hearts);
        const card2 = new Card(5, Suit.Hearts);

        card1.relate(card2);

        expect(card1.horizontals).not.toContain(card2);
        expect(card2.horizontals).not.toContain(card1);
    });

    it('should not link cards vertically if they have different suits', () => {
        const card1 = new Card(5, Suit.Hearts);
        const card2 = new Card(6, Suit.Spades);

        card1.relate(card2);

        expect(card1.verticals).not.toContain(card2);
        expect(card2.verticals).not.toContain(card1);
    });

    it('should not link cards horizontally or vertically if they do not match any criteria', () => {
        const card1 = new Card(5, Suit.Hearts);
        const card2 = new Card(7, Suit.Spades);

        card1.relate(card2);

        expect(card1.horizontals).not.toContain(card2);
        expect(card2.horizontals).not.toContain(card1);
        expect(card1.verticals).not.toContain(card2);
        expect(card2.verticals).not.toContain(card1);
    });
});

describe('Card.toStringExtra', () => {
    it('should return the correct string representation with no relationships', () => {
        const card = new Card(1, Suit.Spades); // Ace of Spades
        const expectedString = card.toString();
        expect(card.toStringExtra()).toBe(expectedString);
    });

    it('should return the correct string representation with horizontal relationships', () => {
        const card1 = new Card(1, Suit.Spades); // Ace of Spades
        const card2 = new Card(1, Suit.Hearts); // Ace of Hearts
        card1.linkHorizontal(card2);

        const expectedString = `${card1}(H->${card2})`;
        expect(card1.toStringExtra()).toBe(expectedString);
    });

    it('should return the correct string representation with vertical relationships', () => {
        const card1 = new Card(1, Suit.Spades); // Ace of Spades
        const card2 = new Card(2, Suit.Spades); // 2 of Spades
        card1.linkVertical(card2);

        const expectedString = `${card1}(V->${card2})`;
        expect(card1.toStringExtra()).toBe(expectedString);
    });

    it('should return the correct string representation with both horizontal and vertical relationships', () => {
        const card1 = new Card(1, Suit.Spades); // Ace of Spades
        const card2 = new Card(1, Suit.Hearts); // Ace of Hearts (horizontal)
        const card3 = new Card(2, Suit.Spades); // 2 of Spades (vertical)
        card1.linkHorizontal(card2);
        card1.linkVertical(card3);

        const expectedString = `${card1}(H->${card2})(V->${card3})`;
        expect(card1.toStringExtra()).toBe(expectedString);
    });

    it('should handle multiple horizontal and vertical relationships', () => {
        const card1 = new Card(1, Suit.Spades); // Ace of Spades
        const card2 = new Card(1, Suit.Hearts); // Ace of Hearts (horizontal)
        const card3 = new Card(1, Suit.Diamonds); // Ace of Diamonds (horizontal)
        const card4 = new Card(2, Suit.Spades); // 2 of Spades (vertical)
        const card5 = new Card(13, Suit.Spades); // King of Spades (vertical)

        card1.linkHorizontal(card2);
        card1.linkHorizontal(card3);
        card1.linkVertical(card4);
        card1.linkVertical(card5);

        const expectedString = `${card1}(H->${card2}${card3})(V->${card4}${card5})`;
        expect(card1.toStringExtra()).toBe(expectedString);
    });
});

describe('Card.follows', () => {
    it('should return true if the card follows another card in sequence', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(6, Suit.Spades);
        expect(card2.follows(card1)).toBe(true);
    });

    it('should return true if the card is an Ace and follows a King', () => {
        const card1 = new Card(13, Suit.Spades); // King
        const card2 = new Card(1, Suit.Spades); // Ace
        expect(card2.follows(card1)).toBe(true);
    });

    it('should return false if the card does not follow another card in sequence', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(7, Suit.Spades);
        expect(card2.follows(card1)).toBe(false);
    });

    it('should return false if the card is of a different suit', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(6, Suit.Hearts);
        expect(card2.follows(card1)).toBe(false);
    });
});

describe('Card.sameSuit', () => {
    it('should return true if two cards have the same suit', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(6, Suit.Spades);
        expect(card1.sameSuit(card2)).toBe(true);
    });

    it('should return false if two cards have different suits', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(6, Suit.Hearts);
        expect(card1.sameSuit(card2)).toBe(false);
    });
});

describe('Card.sameValue', () => {
    it('should return true if two cards have the same value', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(5, Suit.Hearts);
        expect(card1.sameValue(card2)).toBe(true);
    });

    it('should return false if two cards have different values', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(6, Suit.Spades);
        expect(card1.sameValue(card2)).toBe(false);
    });
});

describe('Card.cardSorter', () => {
    it('should sort cards by value first', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(3, Suit.Hearts);
        const card3 = new Card(7, Suit.Diamonds);
        const cards = [card1, card2, card3];
        cards.sort(cardSorter);
        expect(cards).toEqual([card2, card1, card3]);
    });

    it('should sort cards by suit index if values are the same', () => {
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(5, Suit.Hearts);
        const card3 = new Card(5, Suit.Diamonds);
        const cards = [card1, card2, card3];
        cards.sort(cardSorter);
        expect(cards).toEqual([card1, card2, card3]);
    });
});
