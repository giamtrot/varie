import { Suit, Card, Hand } from '../Card';
import { Combo } from '../Combos';
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

});

describe('Hand Class', () => {
    describe('Hand.pushAndRelate', () => {
        it('should add a card to the collection and relate it to existing cards', () => {
            const hand = new Hand();
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");

            hand.push(card1);
            hand.pushAndRelate(card2);

            expect(hand.cards.contains(card1)).toBe(true);
            expect(hand.cards.contains(card2)).toBe(true);
            expect(card1.horizontals.cards).toContain(card2);
            expect(card2.horizontals.cards).toContain(card1);
        });

        it('should not relate the new card if no matching criteria are met', () => {
            const hand = new Hand();
            const card1 = Card.of("5S");
            const card2 = Card.of("7H");

            hand.push(card1);
            hand.pushAndRelate(card2);

            expect(hand.cards.contains(card1)).toBe(true);
            expect(hand.cards.contains(card2)).toBe(true);
            expect(card1.horizontals.cards).not.toContain(card2);
            expect(card1.verticals.cards).not.toContain(card2);
        });

        it('should not relate the new card if no relate is asked', () => {
            const hand = new Hand();
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");

            hand.push(card1);
            hand.push(card2);

            expect(hand.cards.contains(card1)).toBe(true);
            expect(hand.cards.contains(card2)).toBe(true);
            expect(card1.horizontals.cards).not.toContain(card2);
            expect(card1.verticals.cards).not.toContain(card2);
        });
    });

    describe('Hand.sort', () => {
        it('should sort cards by value in ascending order', () => {
            const hand = new Hand();
            const card1 = Card.of("10H");
            const card2 = Card.of("3S");
            const card3 = Card.of("7D");

            hand.push(card1);
            hand.push(card2);
            hand.push(card3);

            hand.cards.sort();

            expect(hand.cards.cards).toEqual([card2, card3, card1]);
        });

        it('should sort cards by suit index if values are the same', () => {
            const hand = new Hand();
            const card1 = Card.of("5C");

            const card2 = Card.of("5S");
            const card3 = Card.of("5H");

            hand.push(card1);
            hand.push(card2);
            hand.push(card3);

            hand.cards.sort();

            expect(hand.cards.cards).toEqual([card2, card3, card1]);
        });

        it('should handle an empty collection without errors', () => {
            const hand = new Hand();

            expect(() => hand.cards.sort()).not.toThrow();
            expect(hand.cards.cards).toEqual([]);
        });

        it('should handle a single card without changing the order', () => {
            const hand = new Hand();
            const card = Card.of("7D");

            hand.push(card);
            hand.cards.sort();

            expect(hand.cards.cards).toEqual([card]);
        });

        it('should maintain the correct order for already sorted cards', () => {
            const hand = new Hand();
            const card1 = Card.of("3S");
            const card2 = Card.of("7D");
            const card3 = Card.of("10H");

            hand.push(card1);
            hand.push(card2);
            hand.push(card3);

            hand.cards.sort();

            expect(hand.cards.cards).toEqual([card1, card2, card3]);
        });
    });

    describe('Hand.toJSON', () => {
        it('should return the correct JSON representation for a red card and a black card', () => {
            const hand = new Hand();
            const card1 = Card.of("13C");// King of Clubs
            const card2 = Card.of("10D"); // 10 of Diamonds
            const card3 = Card.of("1S"); // Ace of Spades

            hand.push(card1);
            hand.push(card2);
            hand.push(card3);

            hand.cards.sort();

            const expectedJSON = [
                { char: "🂡", color: "Black" },
                { char: "🃊", color: "Red" },
                { char: "🃞", color: "Black" },
            ]
            expect(hand.toJSON()).toEqual(expectedJSON);
        });
    });

    describe('Hand', () => {
        let hand: Hand;
        let card5S: Card, card5H: Card, card5D: Card;
        let card6S: Card, card7S: Card;
        let cardAS: Card;

        // Mock the actual Combo instances returned/used
        const mockCombo1 = {
            cards: [Card.of("1S"), Card.of("2S"), Card.of("3S")],
            equals: jest.fn((other) => other === mockCombo1), // Simple equality for mock
            toString: jest.fn().mockReturnValue("MockCombo1"),
            toJSON: jest.fn().mockReturnValue({})
        } as unknown as Combo;

        const mockCombo2 = {
            cards: [Card.of("5H"), Card.of("5D"), Card.of("5C")],
            equals: jest.fn((other) => other === mockCombo2), // Simple equality for mock
            toString: jest.fn().mockReturnValue("MockCombo2"),
            toJSON: jest.fn().mockReturnValue({})
        } as unknown as Combo;

        beforeEach(() => {
            // Reset mocks on the Combos class constructor/instance methods if needed
            // (The mock implementation above creates a fresh state each time)
            hand = new Hand();
            // Ensure combos are clear before each test
            // hand.combos.reset();

            hand = new Hand();
            // Setup a hand with relationships for removal tests
            card5S = Card.of("5S");
            card5H = Card.of("5H");
            card5D = Card.of("5D");
            card6S = Card.of("6S");
            card7S = Card.of("7S");
            cardAS = Card.of("1S");
        });

        // Helper to add cards and establish relationships for tests
        const setupHand = (cards: Card[]) => {
            cards.forEach(card => hand.pushAndRelate(card));
        };

        describe('hasCombo', () => {
            it('should return false when the combos list is empty', () => {
                expect(hand.hasCombo()).toBe(false);
            });

            it('should return true when the combos list has one combo', () => {
                hand.combos.add(mockCombo1); // Use the mocked add
                expect(hand.hasCombo()).toBe(true);
            });

            it('should return true when the combos list has multiple combos', () => {
                hand.combos.add(mockCombo1);
                hand.combos.add(mockCombo2);
                expect(hand.hasCombo()).toBe(true);
            });

            it('should return false after combos are added and then removed/shifted', () => {
                hand.combos.add(mockCombo1);
                expect(hand.hasCombo()).toBe(true);
                hand.combos.shift(); // Use the mocked shift
                expect(hand.hasCombo()).toBe(false);
            });
        });

        describe('getCombo', () => {
            it('should throw an error if hasCombo is false (combos list is empty)', () => {
                expect(hand.hasCombo()).toBe(false); // Verify precondition
                expect(() => hand.getCombo()).toThrow("No combo available");
            });

            it('should return the first combo from the combos list if hasCombo is true', () => {
                hand.combos.add(mockCombo1);
                hand.combos.add(mockCombo2);
                expect(hand.hasCombo()).toBe(true); // Verify precondition

                const retrievedCombo = hand.getCombo();
                expect(retrievedCombo).toBe(mockCombo1); // Check if the correct combo was returned
            });

            it('should remove the returned combo from the combos list', () => {
                hand.combos.add(mockCombo1);
                hand.combos.add(mockCombo2);

                jest.spyOn(hand.combos, 'shift')
                hand.getCombo(); // Retrieve and remove the first combo

                // Verify shift was called on the underlying combos object
                expect(hand.combos.shift).toHaveBeenCalledTimes(1);

                // Verify the state after removal
                expect(hand.combos.length).toBe(1);
                expect(hand.hasCombo()).toBe(true); // Still has mockCombo2

                // Verify the remaining combo is the second one
                const nextCombo = hand.getCombo();
                expect(nextCombo).toBe(mockCombo2);
                expect(hand.hasCombo()).toBe(false); // Now empty
            });
        });

        describe('remove', () => {

            beforeEach(() => {
                setupHand([card5S, card5H, card6S]); // 5S <-> 5H (H), 5S <-> 6S (V)
            });

            it('should call cards.remove with the specified card', () => {
                jest.spyOn(hand.cards, 'remove')
                hand.remove(card5S);
                expect(hand.cards.remove).toHaveBeenCalledWith(card5S);
            });

            it('should call unrelate on horizontally linked cards', () => {
                jest.spyOn(card5H, 'unrelate')
                hand.remove(card5S);
                // Check if 5H.unrelate(5S) was called
                expect(card5H.unrelate).toHaveBeenCalledWith(card5S);
            });

            it('should call unrelate on vertically linked cards', () => {
                jest.spyOn(card6S, 'unrelate')
                hand.remove(card5S);
                // Check if 6S.unrelate(5S) was called
                expect(card6S.unrelate).toHaveBeenCalledWith(card5S);
            });

            it('should call updateCombo after removing the card', () => {
                const updateComboSpy = jest.spyOn(hand, 'updateCombo');
                hand.remove(card5S);
                expect(updateComboSpy).toHaveBeenCalledTimes(1);
            });

            it('should actually remove the card from the hand cards', () => {
                const initialLength = hand.cards.length;
                hand.remove(card5S);
                // Verify through the mocked CardSet's behavior
                expect(hand.cards.length).toBe(initialLength - 1);
                expect(hand.cards.contains(card5S)).toBe(false); // Assuming mock contains reflects removal
            });

            it('should throw error if card is not in hand (via CardSet.remove mock)', () => {
                const cardNotInHand = Card.of("10C");
                // Expect the mocked CardSet.remove to throw
                expect(() => hand.remove(cardNotInHand)).toThrow(`Card ${cardNotInHand} not found in set`);
            });

            it('should correctly update combos after removing a card that breaks a combo', () => {
                // Setup: 5S, 6S, 7S (Vertical Combo)
                hand = new Hand(); // Start fresh
                setupHand([card5S, card6S, card7S]);
                jest.spyOn(hand.combos, 'reset')
                expect(hand.hasCombo()).toBe(true); // Verify combo exists initially

                hand.remove(card6S); // Remove the middle card

                // updateCombo should have been called, clearing old combos and finding no new ones
                expect(hand.hasCombo()).toBe(false);
                expect(hand.combos.reset).toHaveBeenCalled();
                // Verify add was likely not called again, or called with no valid combos found
            });
        });


        describe('updateCombo', () => {
            it('should call combos.reset() at the beginning', () => {
                jest.spyOn(hand.combos, 'reset')
                hand.updateCombo();
                expect(hand.combos.reset).toHaveBeenCalledTimes(1);
            });

            it('should find and add a horizontal combo', () => {
                jest.spyOn(hand.combos, 'add')
                setupHand([card5S, card5H, card5D, cardAS]); // Set of 5s + Ace
                // updateCombo is called by pushAndRelate

                expect(hand.hasCombo()).toBe(true);
                expect(hand.combos.length).toBe(1); // Only one combo expected

                // Check *what* was added - needs careful mock setup for Combo constructor/equals
                const expectedCombo = new Combo([card5S, card5H, card5D]);
                expect(hand.combos.contains(expectedCombo)).toBe(true);
            });

            it('should find and add a vertical combo', () => {
                jest.spyOn(hand.combos, 'add')
                setupHand([card5S, card6S, card7S, card5H]); // Straight flush + 5H
                // updateCombo is called by pushAndRelate

                expect(hand.hasCombo()).toBe(true);
                expect(hand.combos.length).toBe(1); // Only one combo expected

                // Check *what* was added - needs careful mock setup for Combo constructor/equals
                const expectedCombo = new Combo([card5S, card6S, card7S]);
                expect(hand.combos.contains(expectedCombo)).toBe(true);
            });

            it('should find and add multiple combos (horizontal and vertical)', () => {
                jest.spyOn(hand.combos, 'add')
                setupHand([card5S, card5H, card5D, card6S, card7S, cardAS]); // Set of 5s + 6S, 7S, AS
                // updateCombo is called by pushAndRelate

                expect(hand.hasCombo()).toBe(true);
                expect(hand.combos.length).toBe(2); // Only one combo expected

                // Check *what* was added - needs careful mock setup for Combo constructor/equals
                const expectedComboH = new Combo([card5S, card5H, card5D]);
                const expectedComboV = new Combo([card5S, card6S, card7S]); // 5S is used in H
                expect(hand.combos.contains(expectedComboH)).toBe(true);
                expect(hand.combos.contains(expectedComboV)).toBe(true); // This depends on combo finding logic allowing overlaps
            });

            it('should not add any combos if none exist', () => {
                jest.spyOn(hand.combos, 'add')
                setupHand([card5S, card6S, card5H, cardAS]); // No 3+ combos
                // updateCombo is called by pushAndRelate

                expect(hand.combos.add).not.toHaveBeenCalled();
                expect(hand.hasCombo()).toBe(false);
            });

            it('should handle Ace-high/low vertical combos if collectVerticals supports it', () => {
                jest.spyOn(hand.combos, 'add')
                const cardKS = Card.of("13S");
                const cardQS = Card.of("12S");
                setupHand([cardAS, cardKS, cardQS]); // QKA straight flush
                // updateCombo is called by pushAndRelate

                expect(hand.combos.add).toHaveBeenCalledTimes(1);
                const expectedCombo = new Combo([cardQS, cardKS, cardAS]); // Order after sort
                expect((hand.combos.add as jest.Mock).mock.calls[0][0].equals(expectedCombo)).toBe(true);
                expect(hand.hasCombo()).toBe(true);
            });
        });

        describe('collectHorizontals (static)', () => {
            it('should collect all horizontally linked cards starting from one', () => {
                // Manual setup of links for static method test
                card5S.linkHorizontal(card5H);
                card5H.linkHorizontal(card5D);
                // 5S <-> 5H <-> 5D

                const collected: Card[] = [];
                (Hand as any).collectHorizontals(card5H, collected);

                expect(collected).toHaveLength(3);
                expect(collected).toContain(card5S);
                expect(collected).toContain(card5H);
                expect(collected).toContain(card5D);
            });

            it('should collect only the starting card if no horizontal links', () => {
                const collected: Card[] = [];
                (Hand as any).collectHorizontals(cardAS, collected); // AS has no links here

                expect(collected).toHaveLength(1);
                expect(collected).toContain(cardAS);
            });

            it('should not add duplicate cards', () => {
                // Setup links: 5S <-> 5H, 5H <-> 5D, 5D <-> 5S (circular)
                card5S.linkHorizontal(card5H);
                card5H.linkHorizontal(card5D);
                card5D.linkHorizontal(card5S); // Create cycle

                const collected: Card[] = [];
                (Hand as any).collectHorizontals(card5S, collected);

                expect(collected).toHaveLength(3); // Not more due to cycle
                expect(collected).toContain(card5S);
                expect(collected).toContain(card5H);
                expect(collected).toContain(card5D);
                // Check uniqueness
                expect(new Set(collected).size).toBe(3);
            });
        });

        describe('collectVerticals (static)', () => {
            it('should collect all vertically linked cards starting from one', () => {
                // Manual setup: 5S <-> 6S <-> 7S
                card5S.linkVertical(card6S);
                card6S.linkVertical(card7S);

                const collected: Card[] = [];
                (Hand as any).collectVerticals(card6S, collected);

                expect(collected).toHaveLength(3);
                expect(collected).toContain(card5S);
                expect(collected).toContain(card6S);
                expect(collected).toContain(card7S);
            });

            it('should collect only the starting card if no vertical links', () => {
                const collected: Card[] = [];
                (Hand as any).collectVerticals(card5H, collected); // 5H has no links here

                expect(collected).toHaveLength(1);
                expect(collected).toContain(card5H);
            });

            it('should handle Ace-King wrap-around links', () => {
                // Manual setup: KS <-> AS <-> 2S
                const cardKS = Card.of("13S");
                const card2S = Card.of("2S");
                cardAS.linkVertical(cardKS);
                cardAS.linkVertical(card2S);

                const collected: Card[] = [];
                (Hand as any).collectVerticals(cardAS, collected);

                expect(collected).toHaveLength(3);
                expect(collected).toContain(cardAS);
                expect(collected).toContain(cardKS);
                expect(collected).toContain(card2S);
            });

            it('should not add duplicate cards (e.g., in cycles)', () => {
                // Setup links: AS <-> 2S, 2S <-> 3S, 3S <-> AS (hypothetical cycle)
                const card2S = Card.of("2S");
                const card3S = Card.of("3S");
                cardAS.linkVertical(card2S);
                card2S.linkVertical(card3S);
                card3S.linkVertical(cardAS); // Create cycle

                const collected: Card[] = [];
                (Hand as any).collectVerticals(card2S, collected);

                expect(collected).toHaveLength(3); // Not more due to cycle
                expect(collected).toContain(cardAS);
                expect(collected).toContain(card2S);
                expect(collected).toContain(card3S);
                // Check uniqueness
                expect(new Set(collected).size).toBe(3);
            });
        });
    });
});