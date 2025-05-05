import { Suit, Card } from '../Card';
import 'colors';

describe('Card Class', () => {

    describe('Basic Card Creation', () => {
        it('should create a card with valid value and suit', () => {
            Card.count = 0; // Reset the card count for testing
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

    describe('Card suitFromString', () => {
        describe('suitFromString', () => {
            it('should return Suit.Spades for "S"', () => {
                expect(Card.suitFromString("S")).toBe(Suit.Spades);
            });

            it('should return Suit.Spades for "s"', () => {
                expect(Card.suitFromString("s")).toBe(Suit.Spades);
            });

            it('should return Suit.Hearts for "H"', () => {
                expect(Card.suitFromString("H")).toBe(Suit.Hearts);
            });

            it('should return Suit.Hearts for "h"', () => {
                expect(Card.suitFromString("h")).toBe(Suit.Hearts);
            });

            it('should return Suit.Diamonds for "D"', () => {
                expect(Card.suitFromString("D")).toBe(Suit.Diamonds);
            });

            it('should return Suit.Diamonds for "d"', () => {
                expect(Card.suitFromString("d")).toBe(Suit.Diamonds);
            });

            it('should return Suit.Clubs for "C"', () => {
                expect(Card.suitFromString("C")).toBe(Suit.Clubs);
            });

            it('should return Suit.Clubs for "c"', () => {
                expect(Card.suitFromString("c")).toBe(Suit.Clubs);
            });

            it('should throw an error for an invalid single character', () => {
                expect(() => Card.suitFromString("X")).toThrow("Invalid suit description: X");
            });

            it('should throw an error for an empty string', () => {
                expect(() => Card.suitFromString("")).toThrow("Invalid suit description: ");
            });

            it('should throw an error for a multi-character string', () => {
                expect(() => Card.suitFromString("Spades")).toThrow("Invalid suit description: Spades");
            });

            it('should throw an error for a number string', () => {
                expect(() => Card.suitFromString("1")).toThrow("Invalid suit description: 1");
            });
        });
    });

    describe('Card.same', () => {
        let card5S_1: Card;
        let card5S_2: Card;
        let card5H: Card;
        let card6S: Card;
        let card7H: Card;

        beforeEach(() => {
            // Create fresh card instances for each test to ensure distinct IDs
            card5S_1 = Card.of("5S");
            card5S_2 = Card.of("5S");
            card5H = Card.of("5H");
            card6S = Card.of("6S");
            card7H = Card.of("7H");
        });

        it('should return true for two different instances with the same suit and value', () => {
            // Even though IDs are different, suit and value match
            expect(card5S_1.id).not.toBe(card5S_2.id);
            expect(card5S_1.same(card5S_2)).toBe(true);
            expect(card5S_2.same(card5S_1)).toBe(true); // Check commutativity
        });

        it('should return true when comparing a card to itself', () => {
            expect(card5S_1.same(card5S_1)).toBe(true);
        });

        it('should return false for cards with the same value but different suits', () => {
            expect(card5S_1.same(card5H)).toBe(false);
            expect(card5H.same(card5S_1)).toBe(false);
        });

        it('should return false for cards with the same suit but different values', () => {
            expect(card5S_1.same(card6S)).toBe(false);
            expect(card6S.same(card5S_1)).toBe(false);
        });

        it('should return false for cards with different suits and different values', () => {
            expect(card5S_1.same(card7H)).toBe(false);
            expect(card7H.same(card5S_1)).toBe(false);
        });
    });

    describe('Card.fromStringToArray', () => {
        it('should correctly parse a string of card descriptions into an array of Card objects', () => {
            const cards = Card.fromStringToArray("(1S)(2H)(3D)(4C)");
            expect(cards.length).toBe(4);
            expect(cards[0].value).toBe(1);
            expect(cards[0].suit).toBe(Suit.Spades);
            expect(cards[1].value).toBe(2);
            expect(cards[1].suit).toBe(Suit.Hearts);
            expect(cards[2].value).toBe(3);
            expect(cards[2].suit).toBe(Suit.Diamonds);
            expect(cards[3].value).toBe(4);
            expect(cards[3].suit).toBe(Suit.Clubs);
        });

        it('should handle a single card description correctly', () => {
            const cards = Card.fromStringToArray("(13S)");
            expect(cards.length).toBe(1);
            expect(cards[0].value).toBe(13);
            expect(cards[0].suit).toBe(Suit.Spades);
        });

        it('should throw an error for an invalid card description', () => {
            expect(() => Card.fromStringToArray("(1X)(2H)")).toThrow("Invalid suit description: X");
        });

        it('should throw an error for improperly formatted card descriptions', () => {
            expect(() => Card.fromStringToArray("")).toThrow();
            expect(() => Card.fromStringToArray("1S)(2H")).toThrow();
            expect(() => Card.fromStringToArray("(1S(2H)")).toThrow();
        });

        it('should handle cards with 10 as value correctly', () => {
            const cards = Card.fromStringToArray("(10S)(10H)");
            expect(cards.length).toBe(2);
            expect(cards[0].value).toBe(10);
            expect(cards[0].suit).toBe(Suit.Spades);
            expect(cards[1].value).toBe(10);
            expect(cards[1].suit).toBe(Suit.Hearts);
        });
    });
});


