import { Suit, Card, Cards } from '../Card';
import 'colors';

describe('Card Class', () => {
    it('should create a card with valid value and suit', () => {
        const card1 = Card.of("1S");
        expect(card1.id).toBe(1); // Assuming this is the first card created
        expect(card1.value).toBe(1);
        expect(card1.suit).toBe(Suit.Spades);
        const card2 = Card.of("3h");
        expect(card2.id).toBe(2);
        expect(card2.value).toBe(3);
        expect(card2.suit).toBe(Suit.Hearts);
    });

    it('should throw an error for invalid card value', () => {
        expect(() => Card.of("0S")).toThrow("Value must be between 1 and 13");
        expect(() => Card.of("14S")).toThrow("Value must be between 1 and 13");
    });

    it('should return the correct Unicode code point for a card', () => {
        const card = Card.of("1S");
        expect(card.code()).toBe(0x1F0A1);
    });

    it('should return the correct string representation of a card', () => {
        const card = Card.of("1H");
        expect(card.toString()).toBe("(1H)".red.bold);
    });

    it('should return true for cards with the same value, suit, and id', () => {
        const card1 = Card.of("1S");
        const card2 = Card.of("1S");
        card2.id = card1.id; // Manually set the same id for testing
        expect(card1.equals(card2)).toBe(true);
    });

    it('should return false for cards with different values', () => {
        const card1 = Card.of("1S");
        const card2 = Card.of("2S");
        expect(card1.equals(card2)).toBe(false);
    });

    it('should return false for cards with different suits', () => {
        const card1 = Card.of("1S");
        const card2 = Card.of("1H");
        expect(card1.equals(card2)).toBe(false);
    });

    it('should return false for cards with different ids', () => {
        const card1 = Card.of("1S");
        const card2 = Card.of("1S");
        expect(card1.equals(card2)).toBe(false);
    });

    it('should return true when comparing a card to itself', () => {
        const card = Card.of("1S");
        expect(card.equals(card)).toBe(true);
    });

    it('should generate a unique id for each card', () => {
        const card1 = Card.of("1S");
        const card2 = Card.of("2H");
        expect(card1.id).not.toBe(card2.id);
    });

    it('should calculate the correct code for a card', () => {
        const card = Card.of("1S");
        expect(card.code()).toBe(0x1F0A1);
    });

    it('should correctly compare two cards for equality', () => {
        const card1 = Card.of("5D");
        const card2 = Card.of("5D");
        const card3 = Card.of("6C");
        expect(card1.equals(card2)).toBe(false); // Different IDs
        expect(card1.equals(card3)).toBe(false);
    });

    it('should add a horizontal match correctly', () => {
        const card1 = Card.of("5S");
        const card2 = Card.of("5H");
        card1.linkHorizontal(card2);
        expect(card1.horizontals.cards).toContain(card2);
        expect(card2.horizontals.cards).toContain(card1);
    });

    it('should add a vertical match correctly', () => {
        const card1 = Card.of("5S");
        const card2 = Card.of("6S");
        card1.linkVertical(card2);
        expect(card1.verticals.cards).toContain(card2);
        expect(card2.verticals.cards).toContain(card1);
    });

    it('should correctly identify a horizontal match', () => {
        const card1 = Card.of("5S");
        const card2 = Card.of("5H");
        expect(card1.isHorizontalMatch(card2)).toBe(true);
    });

    it('should correctly identify a vertical match', () => {
        const card1 = Card.of("5S");
        const card2 = Card.of("6S");
        expect(card1.isVerticalMatch(card2)).toBe(true);
    });

    it('should correctly identify a vertical match inverted', () => {
        const card1 = Card.of("5S");
        const card2 = Card.of("6S");
        expect(card1.isVerticalMatch(card2)).toBe(true);
    });

    it('should correctly identify a vertical match between Ace and King', () => {
        const card1 = Card.of("1S");
        const card2 = Card.of("13S");
        expect(card1.isVerticalMatch(card2)).toBe(true);
    });


    it('should not identify a horizontal match for cards with the same suit', () => {
        const card1 = Card.of("5S");
        const card2 = Card.of("5S");
        expect(card1.isHorizontalMatch(card2)).toBe(false);
    });

    it('should not identify a horizontal match for cards with different values', () => {
        const card1 = Card.of("5S");
        const card2 = Card.of("5S");
        expect(card1.isHorizontalMatch(card2)).toBe(false);
    });

    it('should not identify a vertical match for cards with different suits', () => {
        const card1 = Card.of("5S");
        const card2 = Card.of("6H");
        expect(card1.isVerticalMatch(card2)).toBe(false);
    });

    it('should not identify a vertical match for cards with two number or more of difference', () => {
        const card1 = Card.of("5S");
        const card2 = Card.of("8S");
        expect(card1.isVerticalMatch(card2)).toBe(false);
    });


    describe('Card.relate', () => {
        it('should link cards horizontally if they have the same value but different suits', () => {
            const card1 = Card.of("5H");
            const card2 = Card.of("5S");

            card1.relate(card2);

            expect(card1.horizontals.cards).toContain(card2);
            expect(card2.horizontals.cards).toContain(card1);
        });

        it('should link cards vertically if they have the same suit and consecutive values', () => {
            const card1 = Card.of("5H");
            const card2 = Card.of("6H");

            card1.relate(card2);

            expect(card1.verticals.cards).toContain(card2);
            expect(card2.verticals.cards).toContain(card1);
        });

        it('should link cards vertically if they have the same suit and wrap-around values (Ace and King)', () => {
            const card1 = Card.of("1S"); // Ace of Spades
            const card2 = Card.of("13S"); // King of Spades

            card1.relate(card2);

            expect(card1.verticals.cards).toContain(card2);
            expect(card2.verticals.cards).toContain(card1);
        });

        it('should not link cards horizontally if they have the same suit', () => {
            const card1 = Card.of("5H");
            const card2 = Card.of("5H");

            card1.relate(card2);

            expect(card1.horizontals).not.toContain(card2);
            expect(card2.horizontals).not.toContain(card1);
        });

        it('should not link cards vertically if they have different suits', () => {
            const card1 = Card.of("5H");
            const card2 = Card.of("6S");

            card1.relate(card2);

            expect(card1.verticals).not.toContain(card2);
            expect(card2.verticals).not.toContain(card1);
        });

        it('should not link cards horizontally or vertically if they do not match any criteria', () => {
            const card1 = Card.of("5H");
            const card2 = Card.of("7S");

            card1.relate(card2);

            expect(card1.horizontals).not.toContain(card2);
            expect(card2.horizontals).not.toContain(card1);
            expect(card1.verticals).not.toContain(card2);
            expect(card2.verticals).not.toContain(card1);
        });
    });

    describe('Card.toStringExtra', () => {
        it('should return the correct string representation with no relationships', () => {
            const card = Card.of("1S"); // Ace of Spades
            const expectedString = card.toString();
            expect(card.toStringExtra()).toBe(expectedString);
        });

        it('should return the correct string representation with horizontal relationships', () => {
            const card1 = Card.of("1S"); // Ace of Spades
            const card2 = Card.of("1H"); // Ace of Hearts
            card1.linkHorizontal(card2);

            const expectedString = `${card1}(H->${card2})`;
            expect(card1.toStringExtra()).toBe(expectedString);
        });

        it('should return the correct string representation with vertical relationships', () => {
            const card1 = Card.of("1S"); // Ace of Spades
            const card2 = Card.of("2S"); // 2 of Spades
            card1.linkVertical(card2);

            const expectedString = `${card1}(V->${card2})`;
            expect(card1.toStringExtra()).toBe(expectedString);
        });

        it('should return the correct string representation with both horizontal and vertical relationships', () => {
            const card1 = Card.of("1S"); // Ace of Spades
            const card2 = Card.of("1H"); // Ace of Hearts (horizontal)
            const card3 = Card.of("2S"); // 2 of Spades (vertical)
            card1.linkHorizontal(card2);
            card1.linkVertical(card3);

            const expectedString = `${card1}(H->${card2})(V->${card3})`;
            expect(card1.toStringExtra()).toBe(expectedString);
        });

        it('should handle multiple horizontal and vertical relationships', () => {
            const card1 = Card.of("1S"); // Ace of Spades
            const card2 = Card.of("1H"); // Ace of Hearts (horizontal)
            const card3 = Card.of("1D"); // Ace of Diamonds (horizontal)
            const card4 = Card.of("2S"); // 2 of Spades (vertical)
            const card5 = Card.of("13S"); // King of Spades (vertical)

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
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            expect(card2.follows(card1)).toBe(true);
        });

        it('should return true if the card is an Ace and follows a King', () => {
            const card1 = Card.of("13S"); // King
            const card2 = Card.of("1S"); // Ace
            expect(card2.follows(card1)).toBe(true);
        });

        it('should return false if the card does not follow another card in sequence', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("7S");
            expect(card2.follows(card1)).toBe(false);
        });

        it('should return false if the card is of a different suit', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6H");
            expect(card2.follows(card1)).toBe(false);
        });
    });

    describe('Card.sameSuit', () => {
        it('should return true if two cards have the same suit', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            expect(card1.sameSuit(card2)).toBe(true);
        });

        it('should return false if two cards have different suits', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6H");
            expect(card1.sameSuit(card2)).toBe(false);
        });
    });

    describe('Card.sameValue', () => {
        it('should return true if two cards have the same value', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            expect(card1.sameValue(card2)).toBe(true);
        });

        it('should return false if two cards have different values', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            expect(card1.sameValue(card2)).toBe(false);
        });
    });

    describe('Card.cardSorter', () => {
        it('should sort cards by value first', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("3H");
            const card3 = Card.of("7D");
            const cards = [card1, card2, card3];
            cards.sort(Card.cardSorter);
            expect(cards).toEqual([card2, card1, card3]);
        });

        it('should sort cards by suit index if values are the same', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            const card3 = Card.of("5D");
            const cards = [card1, card2, card3];
            cards.sort(Card.cardSorter);
            expect(cards).toEqual([card1, card2, card3]);
        });
    });

    describe('Card.unrelate', () => {
        it('should unlink a horizontal relationship between two cards', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            card1.relate(card2);

            card1.unrelate(card2);

            expect(card1.horizontals.cards).not.toContain(card2);
            expect(card2.horizontals.cards).not.toContain(card1);
            expect(card1.verticals.cards).not.toContain(card2);
            expect(card2.verticals.cards).not.toContain(card1);
        });

        it('should unlink a vertical relationship between two cards', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            card1.relate(card2);

            card1.unrelate(card2);

            expect(card1.horizontals.cards).not.toContain(card2);
            expect(card2.horizontals.cards).not.toContain(card1);
            expect(card1.verticals.cards).not.toContain(card2);
            expect(card2.verticals.cards).not.toContain(card1);
        });

        it('should throw an error if the cards are not linked', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6H");

            expect(() => card1.unrelate(card2)).toThrow(
                `Card ${card2} not linked to ${card1}`
            );
        });
    });

    describe('Card.unlinkHorizontal', () => {
        it('should unlink a horizontal relationship between two cards', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            card1.linkHorizontal(card2);

            card1.unlinkHorizontal(card2);

            expect(card1.horizontals.cards).not.toContain(card2);
            expect(card2.horizontals.cards).not.toContain(card1);
        });

        it('should throw an error if the cards are not horizontally linked', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");

            expect(() => card1.unlinkHorizontal(card2)).toThrow(
                `Card ${card2} not horizontally linked to ${card1} or viceversa`
            );
        });
    });

    describe('Card.unlinkVertical', () => {
        it('should unlink a vertical relationship between two cards', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            card1.linkVertical(card2);

            card1.unlinkVertical(card2);

            expect(card1.verticals.cards).not.toContain(card2);
            expect(card2.verticals.cards).not.toContain(card1);
        });

        it('should throw an error if the cards are not vertically linked', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6H");

            expect(() => card1.unlinkVertical(card2)).toThrow(
                `Card ${card2} not vertically linked to ${card1} or viceversa`
            );
        });
    });

    describe('Card.toJSON', () => {
        it('should return the correct JSON representation for a red card', () => {
            const card = Card.of("1H"); // Ace of Hearts
            const expectedJSON = { char: "🂱", color: "Red" };
            expect(card.toJSON()).toEqual(expectedJSON);
        });

        it('should return the correct JSON representation for a black card', () => {
            const card = Card.of("1S"); // Ace of Spades
            const expectedJSON = { char: "🂡", color: "Black" };
            expect(card.toJSON()).toEqual(expectedJSON);
        });

        it('should return the correct JSON representation for a card with a value of 10', () => {
            const card = Card.of("10D"); // 10 of Diamonds
            const expectedJSON = { char: "🃊", color: "Red" };
            expect(card.toJSON()).toEqual(expectedJSON);
        });

        it('should return the correct JSON representation for a King card', () => {
            const card = Card.of("13C"); // King of Clubs
            const expectedJSON = { char: "🃞", color: "Black" };
            expect(card.toJSON()).toEqual(expectedJSON);
        });
    });
});

describe('Cards Class', () => {
    describe('Cards.pushAndRelate', () => {
        it('should add a card to the collection and relate it to existing cards', () => {
            const cards = new Cards();
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");

            cards.push(card1);
            cards.pushAndRelate(card2);

            expect(cards.cards).toContain(card1);
            expect(cards.cards).toContain(card2);
            expect(card1.horizontals.cards).toContain(card2);
            expect(card2.horizontals.cards).toContain(card1);
        });

        it('should not relate the new card if no matching criteria are met', () => {
            const cards = new Cards();
            const card1 = Card.of("5S");
            const card2 = Card.of("7H");

            cards.push(card1);
            cards.pushAndRelate(card2);

            expect(cards.cards).toContain(card1);
            expect(cards.cards).toContain(card2);
            expect(card1.horizontals.cards).not.toContain(card2);
            expect(card1.verticals.cards).not.toContain(card2);
        });

        it('should not relate the new card if no relate is asked', () => {
            const cards = new Cards();
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");

            cards.push(card1);
            cards.push(card2);

            expect(cards.cards).toContain(card1);
            expect(cards.cards).toContain(card2);
            expect(card1.horizontals.cards).not.toContain(card2);
            expect(card1.verticals.cards).not.toContain(card2);
        });
    });

    describe('Cards.sort', () => {
        it('should sort cards by value in ascending order', () => {
            const cards = new Cards();
            const card1 = Card.of("10H");
            const card2 = Card.of("3S");
            const card3 = Card.of("7D");

            cards.push(card1);
            cards.push(card2);
            cards.push(card3);

            cards.sort();

            expect(cards.cards).toEqual([card2, card3, card1]);
        });

        it('should sort cards by suit index if values are the same', () => {
            const cards = new Cards();
            const card1 = Card.of("5C");

            const card2 = Card.of("5S");
            const card3 = Card.of("5H");

            cards.push(card1);
            cards.push(card2);
            cards.push(card3);

            cards.sort();

            expect(cards.cards).toEqual([card2, card3, card1]);
        });

        it('should handle an empty collection without errors', () => {
            const cards = new Cards();

            expect(() => cards.sort()).not.toThrow();
            expect(cards.cards).toEqual([]);
        });

        it('should handle a single card without changing the order', () => {
            const cards = new Cards();
            const card = Card.of("7D");

            cards.push(card);
            cards.sort();

            expect(cards.cards).toEqual([card]);
        });

        it('should maintain the correct order for already sorted cards', () => {
            const cards = new Cards();
            const card1 = Card.of("3S");
            const card2 = Card.of("7D");
            const card3 = Card.of("10H");

            cards.push(card1);
            cards.push(card2);
            cards.push(card3);

            cards.sort();

            expect(cards.cards).toEqual([card1, card2, card3]);
        });
    });

    describe('Cards.toJSON', () => {
        it('should return the correct JSON representation for a red card and a black card', () => {
            const cards = new Cards();
            const card1 = Card.of("13C");// King of Clubs
            const card2 = Card.of("10D"); // 10 of Diamonds
            const card3 = Card.of("1S"); // Ace of Spades

            cards.push(card1);
            cards.push(card2);
            cards.push(card3);

            cards.sort();

            const expectedJSON = [
                { char: "🂡", color: "Black" },
                { char: "🃊", color: "Red" },
                { char: "🃞", color: "Black" },
            ]
            expect(cards.toJSON()).toEqual(expectedJSON);
        });
    });

});
