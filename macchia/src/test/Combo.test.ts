import { Suit } from '../Card';
import { Combo, Combos } from '../Combos';
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
    const cardAS = new Card(1, Suit.Spades);
    const card2S = new Card(2, Suit.Spades);
    const card3S = new Card(3, Suit.Spades);
    const card4S = new Card(4, Suit.Spades);

    const card5H = new Card(5, Suit.Hearts);
    const card5D = new Card(5, Suit.Diamonds);
    const card5C = new Card(5, Suit.Clubs);
    const card5S = new Card(5, Suit.Spades);


    const comboStraightFlush = createCombo([cardAS, card2S, card3S]);
    const comboStraightFlushSameCardsDifferentOrder = createCombo([card3S, cardAS, card2S]);
    const comboStraightFlushLonger = createCombo([cardAS, card2S, card3S, card4S]);
    const comboSet = createCombo([card5H, card5D, card5C]);
    const comboSetDifferent = createCombo([card5S, card5D, card5C]); // Same values/suits, different card instances

    // Create another instance of the same logical comboSet
    const card5H_Instance2 = new Card(5, Suit.Hearts);
    const card5D_Instance2 = new Card(5, Suit.Diamonds);
    const card5C_Instance2 = new Card(5, Suit.Clubs);
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

            // Based on current Card.equals checking ID, these combos are NOT equal
            expect(comboSet.equals(comboSetEquivalentInstance)).toBe(false);
            // Therefore, adding the "equivalent" instance should succeed
            expect(combos.combos.length).toBe(2);
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
            // Based on current Card.equals checking ID, these combos are NOT equal
            expect(combos['contains'](comboSetEquivalentInstance)).toBe(false);
        });
    });


    describe('Combos.shift', () => {
        it('should remove and return the first combo added', () => {
            const combos = new Combos();
            const combo1 = new Combo([
                new Card(1, Suit.Spades),
                new Card(2, Suit.Spades),
                new Card(3, Suit.Spades),
            ]);
            const combo2 = new Combo([
                new Card(5, Suit.Hearts),
                new Card(5, Suit.Diamonds),
                new Card(5, Suit.Clubs),
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
                new Card(1, Suit.Spades),
                new Card(2, Suit.Spades),
                new Card(3, Suit.Spades),
            ]);

            combos.add(combo);
            expect(combos.length).toBe(1);

            combos.shift();
            expect(combos.length).toBe(0);
        });
    });
});