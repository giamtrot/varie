import { Combo } from '../Combo';
import { Card } from '../Card';
import 'colors'; // Import colors for the string assertion

describe('Combo Class', () => {
    it('should create a valid combo with same suit and straight values', () => {
        const cards = [Card.of("1S"), Card.of("2S"), Card.of("3S")];
        const combo = new Combo(cards);
        expect(combo.cards).toEqual(cards);
    });

    it('should create a valid combo with same value and different suits', () => {
        const cards = [Card.of("5S"), Card.of("5H"), Card.of("5D")];
        const combo = new Combo(cards);
        expect(combo.cards).toEqual(cards);
    });

    it('should throw an error for invalid combo', () => {
        const cards = [Card.of("1S"), Card.of("3S"), Card.of("5S")];
        expect(() => new Combo(cards)).toThrow();
    });

    it('should create a valid combo with same suit and straight values - by string', () => {
        expect(() => Combo.fromString("(1S)(2S)(3S)")).not.toThrow();
    });

    it('should create a valid combo with same value and different suits - by string', () => {
        expect(() => Combo.fromString("(5S)(5H)(5D)")).not.toThrow();
    });

    it('should throw an error for invalid combo - by string', () => {
        expect(() => Combo.fromString("(1S)(3S)(5S)")).toThrow();
    });


    it('should throw an error if cards have different suits and are not consecutive', () => {
        const cards = [Card.of("1S"), Card.of("2H"), Card.of("3D")];
        expect(() => new Combo(cards)).toThrow();
    });

    it('should throw an error if cards have the same suit but are not consecutive', () => {
        const cards = [Card.of("1S"), Card.of("3S"), Card.of("4S")];
        expect(() => new Combo(cards)).toThrow();
    });

    it('should throw an error if cards have the same value but duplicate suits', () => {
        const cards = [Card.of("5S"), Card.of("5S"), Card.of("5H")];
        expect(() => new Combo(cards)).toThrow();
    });

    it('should throw an error with a single card', () => {
        const cards = [Card.of("7C")];
        expect(() => new Combo(cards)).toThrow();
    });

    it('should throw an error if no cards are provided', () => {
        const cards: Card[] = [];
        expect(() => new Combo(cards)).toThrow();
    });

    describe('Combo.checkValid', () => {
        it('should return true for a valid vertical combo (same suit, consecutive values)', () => {
            const cards = [Card.of("1S"), Card.of("2S"), Card.of("3S")];
            expect(Combo.checkValid(cards)).toBe(true);
        });

        it('should return false if two card not consecutive are of the same suit', () => {
            const cards = [Card.of("4S"), Card.of("4H"), Card.of("4S")];
            const sorted = Combo.prepareForCheck(cards)
            expect(Combo.checkDifferentSuit(sorted)).toBe(false);
        });

        it('should return true for a valid horizontal combo (same value, different suits)', () => {
            const cards = [Card.of("5S"), Card.of("5H"), Card.of("5D")];
            expect(Combo.checkValid(cards)).toBe(true);
        });

        it('should return false for cards with the same suit but non-consecutive values', () => {
            const cards = [Card.of("1S"), Card.of("3S"), Card.of("4S")];
            expect(Combo.checkValid(cards)).toBe(false);
        });

        it('should return false for cards with the same value but duplicate suits', () => {
            const cards = [Card.of("5S"), Card.of("5S"), Card.of("5H")];
            expect(Combo.checkValid(cards)).toBe(false);
        });

        it('should return false for cards with the straight but replicated values', () => {
            const cards = [Card.of("4S"), Card.of("5S"), Card.of("5S")];
            expect(Combo.checkValid(cards)).toBe(false);
        });

        it('should return false for cards with different suits and non-consecutive values', () => {
            const cards = [Card.of("1S"), Card.of("2H"), Card.of("3D")];
            expect(Combo.checkValid(cards)).toBe(false);
        });

        it('should throw an error for cards with less than 3 cards', () => {
            const cards = [Card.of("1S"), Card.of("2S")];
            expect(() => Combo.checkValid(cards)).toThrow();
        });

        it('should return true for a valid vertical combo with edge case values (Ace, King, Queen)', () => {
            const cards = [Card.of("12C"), Card.of("13C"), Card.of("1C")];
            expect(Combo.checkValid(cards)).toBe(true);
        });

        it('should return true for a valid vertical combo with edge case values (Two, Ace, King)', () => {
            const cards = [Card.of("2C"), Card.of("13C"), Card.of("1C")];
            expect(Combo.checkValid(cards)).toBe(true);
        });


        it('should return false for an invalid combo with mixed suits and values', () => {
            const cards = [Card.of("1S"), Card.of("3H"), Card.of("5D")];
            expect(Combo.checkValid(cards)).toBe(false);
        });
    });

    describe('Combo.equals', () => {
        // Helper cards
        const cardAS = Card.of("1S");
        const card2S = Card.of("2S");
        const card3S = Card.of("3S");
        const card4S = Card.of("4S");
        const card5H = Card.of("5H");
        const card5D = Card.of("5D");
        const card5C = Card.of("5C");
        const card5S = Card.of("5S");


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
            const cardInstance1 = Card.of("1S");
            const cardInstance2 = Card.of("1S");
            const cardInstance3 = Card.of("2S");
            const cardInstance4 = Card.of("3S");

            // Ensure IDs are different (they should be by default)
            expect(cardInstance1.id).not.toBe(cardInstance2.id);
            expect(cardInstance1.equals(cardInstance2)).toBe(false); // Different Card instances
            expect(cardInstance1.same(cardInstance2)).toBe(true); // Different Card instances but same values

            const combo1 = new Combo([cardInstance1, cardInstance3, cardInstance4]);
            const combo2 = new Combo([cardInstance2, cardInstance3, cardInstance4]); // Same values/suits, but first card instance differs

            // Because Combo.equals uses Card.same, so this should be true
            expect(combo1.equals(combo2)).toBe(true);
        });
    });

    describe('Combo Class - toString and toJSON', () => {
        let comboVertical: Combo;
        let comboHorizontal: Combo;
        let cardsVertical: Card[];
        let cardsHorizontal: Card[];

        beforeEach(() => {
            // Create cards for a vertical combo (straight flush)
            // Note: Combo constructor sorts cards, so the order here doesn't strictly matter for the final combo state
            cardsVertical = [
                Card.of("3S"), // 3S
                Card.of("1S"), // AS
                Card.of("2S"), // 2S
            ];
            comboVertical = new Combo(cardsVertical); // Will be sorted to AS, 2S, 3S

            // Create cards for a horizontal combo (set)
            cardsHorizontal = [
                Card.of("7H"),   // 7H
                Card.of("7D"), // 7D
                Card.of("7C"),    // 7C
            ];
            comboHorizontal = new Combo(cardsHorizontal); // Will be sorted by suit index: 7H, 7D, 7C
        });

        describe('toString', () => {
            it('should return a string representation of a vertical combo', () => {
                // Expected string based on sorted order (AS, 2S, 3S)
                const expectedString: string = `${"(1S)".black.bold}${"(2S)".black.bold}${"(3S)".black.bold}`;
                expect(comboVertical.toString()).toBe(expectedString);
            });

            it('should return a string representation of a horizontal combo', () => {
                // Expected string based on sorted order (7H, 7D, 7C)
                const expectedString = `${"(7H)".red.bold}${"(7D)".red.bold}${"(7C)".black.bold}`;
                expect(comboHorizontal.toString()).toBe(expectedString);
            });

            it('should return an empty string if the combo somehow had no cards (though constructor prevents this)', () => {
                // This case is technically unreachable due to constructor validation,
                // but tests the core logic of the method itself.
                const emptyCombo = new Combo([Card.of("1S"), Card.of("2S"), Card.of("3S")]); // Create valid
                (emptyCombo as any).cards = []; // Force cards to be empty for test
                expect(emptyCombo.toString()).toBe('');
            });
        });

        describe('toJSON', () => {
            it('should return a JSON array representation of a vertical combo', () => {
                // Expected JSON based on sorted order (AS, 2S, 3S)
                const expectedJSON = [
                    { char: "🂡", color: "Black" }, // AS
                    { char: "🂢", color: "Black" }, // 2S
                    { char: "🂣", color: "Black" }, // 3S
                ];
                expect(comboVertical.toJSON()).toEqual(expectedJSON);
            });

            it('should return a JSON array representation of a horizontal combo', () => {
                // Expected JSON based on sorted order (7H, 7D, 7C)
                const expectedJSON = [
                    { char: "🂷", color: "Red" },   // 7H
                    { char: "🃇", color: "Red" },   // 7D
                    { char: "🃗", color: "Black" }, // 7C
                ];
                expect(comboHorizontal.toJSON()).toEqual(expectedJSON);
            });

            it('should return an empty array if the combo somehow had no cards (though constructor prevents this)', () => {
                // Similar to the toString test case for empty cards
                const emptyCombo = new Combo([Card.of("4H"), Card.of("5H"), Card.of("6H")]); // Create valid
                (emptyCombo as any).cards = []; // Force cards to be empty
                expect(emptyCombo.toJSON()).toEqual([]);
            });
        });
    });

    describe('Combo.clone', () => {
        let originalCombo: Combo;
        let card1: Card;
        let card2: Card;
        let card3: Card;

        beforeEach(() => {
            // Create some cards and a combo for testing
            card1 = Card.of("5H");
            card2 = Card.of("5D");
            card3 = Card.of("5C");
            originalCombo = new Combo([card1, card2, card3]);
        });

        it('should return a new Combo instance', () => {
            const clonedCombo = originalCombo.clone();
            expect(clonedCombo).toBeInstanceOf(Combo);
        });

        it('should return a different instance from the original combo', () => {
            const clonedCombo = originalCombo.clone();
            expect(clonedCombo).not.toBe(originalCombo);
        });

        it('should have a different cards array instance than the original', () => {
            const clonedCombo = originalCombo.clone();
            // Access the readonly array for comparison
            expect(clonedCombo.cards).not.toBe(originalCombo.cards);
        });

        it('should contain the same card instances in the cards array', () => {
            const clonedCombo = originalCombo.clone();
            // Check if the card instances themselves are the same
            expect(clonedCombo.cards).toHaveLength(originalCombo.cards.length);
            expect(clonedCombo.cards[0]).toBe(originalCombo.cards[0]); // Should be 5H instance
            expect(clonedCombo.cards[1]).toBe(originalCombo.cards[1]); // Should be 5D instance
            expect(clonedCombo.cards[2]).toBe(originalCombo.cards[2]); // Should be 5C instance
        });

        it('should be considered equal to the original combo using the equals method', () => {
            const clonedCombo = originalCombo.clone();
            expect(clonedCombo.equals(originalCombo)).toBe(true);
            expect(originalCombo.equals(clonedCombo)).toBe(true); // Check commutativity
        });

        it('should create a valid combo that passes checkValid', () => {
            // This implicitly tests that the constructor call within clone works
            const clonedCombo = originalCombo.clone();
            // No assertion needed here, as the clone() call itself would throw if invalid
            // But we can explicitly check for clarity
            expect(() => Combo.checkValid(clonedCombo.cards)).not.toThrow();
            expect(Combo.checkValid(clonedCombo.cards)).toBe(true);
        });
    });

    describe('Combo.fromString', () => {
        it('should create a valid Combo from a valid string representation of cards', () => {
            const combo = Combo.fromString("(1S)(2S)(3S)");
            expect(combo).toBeInstanceOf(Combo);
            expect(combo.cards).toHaveLength(3);
            expect(combo.cards[0].same(Card.of("1S"))).toBe(true);
            expect(combo.cards[1].same(Card.of("2S"))).toBe(true);
            expect(combo.cards[2].same(Card.of("3S"))).toBe(true);
        });

        it('should throw an error for an invalid string representation of cards', () => {
            expect(() => Combo.fromString("1S 3S 5S")).toThrow();
        });

        it('should throw an error for a string with less than 3 cards', () => {
            expect(() => Combo.fromString("(1S)(2S)")).toThrow();
        });

        it('should throw an error for a string with an invaliad combo', () => {
            expect(() => Combo.fromString("(1S)(2S)(4S)")).toThrow();
        });

        it('should create a valid Combo for a horizontal combo (same value, different suits)', () => {
            const combo = Combo.fromString("(5S)(5H)(5D)");
            expect(combo).toBeInstanceOf(Combo);
            expect(combo.cards).toHaveLength(3);
            expect(combo.cards[0].same(Card.of("5S"))).toBe(true);
            expect(combo.cards[1].same(Card.of("5H"))).toBe(true);
            expect(combo.cards[2].same(Card.of("5D"))).toBe(true);
        });

        it('should throw an error for a string with duplicate cards', () => {
            expect(() => Combo.fromString("(5S)(5S)(5H)")).toThrow();
        });

        it('should create a valid Combo for edge case values (Ace, King, Queen)', () => {
            const combo = Combo.fromString("(12C)(13C)(1C)");
            expect(combo).toBeInstanceOf(Combo);
            expect(combo.cards).toHaveLength(3);
            expect(combo.cards[0].same(Card.of("1C"))).toBe(true);
            expect(combo.cards[1].same(Card.of("12C"))).toBe(true);
            expect(combo.cards[2].same(Card.of("13C"))).toBe(true);
        });

        it('should throw an error for an empty string', () => {
            expect(() => Combo.fromString("")).toThrow();
        });

        it('should throw an error for a string with invalid card representations', () => {
            expect(() => Combo.fromString("1S 2X 3S")).toThrow();
        });
    });
});

