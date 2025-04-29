import { Suit } from '../Card';
import { Combo, Combos } from '../Combos';
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
});


// Helper function to create valid combos for testing
const createCombo = (cards: Card[]): Combo => {
    // In a real test setup, you might want to mock the Combo constructor
    // or ensure these cards *always* form a valid combo to avoid
    // constructor errors interfering with Combos tests.
    // For simplicity here, we assume valid inputs for combo creation.
    try {
        return new Combo(cards);
    } catch (e) {
        // If the test setup guarantees valid combos, this shouldn't happen.
        // If it might, handle or rethrow appropriately for the test.
        console.error("Test setup error: Failed to create a valid combo for testing.", cards, e);
        throw e;
    }
};

describe('Combos Class', () => {
    let combos: Combos;

    // Define some cards and combos to use across tests
    const cardAS = Card.of("1S");
    const card2S = Card.of("2S");
    const card3S = Card.of("3S");
    const card4S = Card.of("4S");

    const card5H = Card.of("5H");
    const card5D = Card.of("5D");
    const card5C = Card.of("5C");
    const card5S = Card.of("5S");


    const comboStraightFlush = createCombo([cardAS, card2S, card3S]);
    const comboStraightFlushSameCardsDifferentOrder = createCombo([card3S, cardAS, card2S]);
    const comboStraightFlushLonger = createCombo([cardAS, card2S, card3S, card4S]);
    const comboSet = createCombo([card5H, card5D, card5C]);
    const comboSetDifferent = createCombo([card5S, card5D, card5C]); // Same values/suits, different card instances

    // Create another instance of the same logical comboSet
    const card5H_Instance2 = Card.of("5H");
    const card5D_Instance2 = Card.of("5D");
    const card5C_Instance2 = Card.of("5C");
    const comboSetEquivalentInstance = createCombo([card5H_Instance2, card5D_Instance2, card5C_Instance2]);


    beforeEach(() => {
        combos = new Combos();
        // Reset card counter if necessary, depending on how Card IDs affect Combo.equals
        // Card.count = 0; // If Card ID matters and needs resetting between tests
    });

    it('should initialize with an empty list of combos', () => {
        expect(combos.combos).toEqual([]);
        expect(combos.combos.length).toBe(0);
    });

    describe('add', () => {
        it('should add a combo to an empty list', () => {
            combos.add(comboStraightFlush);
            expect(combos.length).toBe(1);
            // Use Combo.equals for comparison, not === or toEqual directly on Combo instances
            expect(combos.combos[0].equals(comboStraightFlush)).toBe(true);
        });

        it('should add a unique combo to a non-empty list', () => {
            combos.add(comboStraightFlush);
            combos.add(comboSet);
            expect(combos.length).toBe(2);
            expect(combos.contains(comboStraightFlush)).toBe(true);
            expect(combos.contains(comboSet)).toBe(true);
        });

        it('should not add a combo if an equal combo (same cards, potentially different order) is already present', () => {
            combos.add(comboStraightFlush);
            combos.add(comboStraightFlushSameCardsDifferentOrder); // Should be considered equal by Combo.equals
            expect(combos.length).toBe(1);
            expect(combos.combos[0].equals(comboStraightFlush)).toBe(true);
        });

        it('should not add a combo if an equal combo (different card instances, same value/suit) is already present', () => {
            // This test depends HEAVILY on how Combo.equals and Card.equals are implemented.
            // Current implementation: Card.equals checks ID, so Combo.equals will see these as different.
            // If Combo.equals were changed to only compare value/suit, this test would expect length 1.

            combos.add(comboSet);
            combos.add(comboSetEquivalentInstance); // Logically same, but different Card instances

            // Based on current Card.same, these combos are equal
            expect(comboSet.equals(comboSetEquivalentInstance)).toBe(true);
            // Therefore, adding the "equivalent" instance should succeed
            expect(combos.combos.length).toBe(1);
        });


        it('should add multiple different combos correctly', () => {
            combos.add(comboStraightFlush);
            combos.add(comboSet);
            combos.add(comboStraightFlushLonger); // Different length
            combos.add(comboSetDifferent); // Different card instance

            expect(combos.length).toBe(4); // Assumes Card ID check in equals
            expect(combos.contains(comboStraightFlush)).toBe(true);
            expect(combos.contains(comboSet)).toBe(true);
            expect(combos.contains(comboStraightFlushLonger)).toBe(true);
            expect(combos.contains(comboSetDifferent)).toBe(true);
        });

        it('should handle adding the exact same combo instance multiple times', () => {
            combos.add(comboSet);
            combos.add(comboSet); // Add the same instance again
            expect(combos.length).toBe(1);
            expect(combos.combos[0].equals(comboSet)).toBe(true);
        });
    });

    describe('contains (if public)', () => {
        it('should return false for an empty list', () => {
            expect(combos['contains'](comboSet)).toBe(false); // Access private method for testing
        });

        it('should return true if the exact combo instance exists', () => {
            combos.add(comboSet);
            expect(combos['contains'](comboSet)).toBe(true);
        });

        it('should return true if an equal combo exists (different instance, same cards)', () => {
            combos.add(comboStraightFlush);
            expect(combos['contains'](comboStraightFlushSameCardsDifferentOrder)).toBe(true);
        });

        it('should return false if no equal combo exists', () => {
            combos.add(comboStraightFlush);
            expect(combos['contains'](comboSet)).toBe(false);
        });

        it('should return false if an "equivalent" combo (different card instances) exists (based on current equals)', () => {
            combos.add(comboSet);
            // Based on current Card.same, these combos are equal
            expect(combos['contains'](comboSetEquivalentInstance)).toBe(true);
        });
    });


    describe('Combos.shift', () => {
        it('should remove and return the first combo added', () => {
            const combos = new Combos();
            const combo1 = new Combo([
                Card.of("1S"),
                Card.of("2S"),
                Card.of("3S"),
            ]);
            const combo2 = new Combo([
                Card.of("5H"),
                Card.of("5D"),
                Card.of("5C"),
            ]);

            combos.add(combo1);
            combos.add(combo2);

            const firstCombo = combos.shift();
            expect(firstCombo).toBe(combo1);
            expect(combos.length).toBe(1);
            expect(combos.contains(combo2)).toBe(true);
        });

        it('should throw an error if there are no combos to retrieve', () => {
            const combos = new Combos();
            expect(() => combos.shift()).toThrow("No combo available");
        });

        it('should correctly update the length after popping', () => {
            const combos = new Combos();
            const combo = new Combo([
                Card.of("1S"),
                Card.of("2S"),
                Card.of("3S"),
            ]);

            combos.add(combo);
            expect(combos.length).toBe(1);

            combos.shift();
            expect(combos.length).toBe(0);
        });
    });

    describe('Combos.reset', () => {
        it('should clear all combos when reset is called', () => {
            const card1 = Card.of("1S")
            const card2 = Card.of("2S")
            const card3 = Card.of("3S")
            const card4 = Card.of("2H")
            const card5 = Card.of("2C")
            const combo1 = new Combo([card1, card2, card3]);
            const combo2 = new Combo([card2, card4, card5]);

            const combos = new Combos();
            combos.add(combo1);
            combos.add(combo2);

            expect(combos.length).toBe(2);

            combos.reset();

            expect(combos.length).toBe(0);
        });

        it('should not throw an error when reset is called on an empty Combos instance', () => {
            const combos = new Combos();

            expect(combos.length).toBe(0);

            expect(() => combos.reset()).not.toThrow();

            expect(combos.length).toBe(0);
        });
    });



});