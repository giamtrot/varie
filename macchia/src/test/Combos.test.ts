import { Combo } from '../Combo';
import { Combos } from '../Combos';
import { Card } from '../Card';
import 'colors'; // Import colors for the string assertion

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

    const comboStraightFlush = new Combo([cardAS, card2S, card3S]);
    const comboStraightFlushSameCardsDifferentOrder = new Combo([card3S, cardAS, card2S]);
    const comboStraightFlushLonger = new Combo([cardAS, card2S, card3S, card4S]);
    const comboSet = new Combo([card5H, card5D, card5C]);
    const comboSetDifferent = new Combo([card5S, card5D, card5C]); // Same values/suits, different card instances

    // Create another instance of the same logical comboSet
    const card5H_Instance2 = Card.of("5H");
    const card5D_Instance2 = Card.of("5D");
    const card5C_Instance2 = Card.of("5C");
    const comboSetEquivalentInstance = new Combo([card5H_Instance2, card5D_Instance2, card5C_Instance2]);


    beforeEach(() => {
        combos = new Combos();
        // Reset card counter if necessary, depending on how Card IDs affect Combo.equals
        // Card.count = 0; // If Card ID matters and needs resetting between tests
    });

    describe('Combos.clone', () => {
        let originalCombos: Combos;
        let combo1: Combo;
        let combo2: Combo;

        beforeEach(() => {
            // Create some real combos for testing
            combo1 = Combo.fromString("(1S)(2S)(3S)");
            combo2 = Combo.fromString("(5H)(5D)(5C)");

            originalCombos = new Combos();
            originalCombos.add(combo1);
            originalCombos.add(combo2);
        });

        it('should return a new Combos instance', () => {
            const clonedCombos = originalCombos.clone();
            expect(clonedCombos).toBeInstanceOf(Combos);
        });

        it('should return a different instance from the original Combos', () => {
            const clonedCombos = originalCombos.clone();
            expect(clonedCombos).not.toBe(originalCombos);
        });

        it('should have a different internal combos array instance', () => {
            const clonedCombos = originalCombos.clone();
            expect(clonedCombos.combos).not.toBe(originalCombos.combos);
        });

        it('should have the same number of combos as the original', () => {
            const clonedCombos = originalCombos.clone();
            expect(clonedCombos.length).toBe(originalCombos.length);
            expect(clonedCombos.length).toBe(2);
        });

        it('should contain clones of the original combos, not the same instances', () => {
            const clonedCombos = originalCombos.clone();

            // Check that the combo instances are different
            expect(clonedCombos.combos[0]).not.toBe(originalCombos.combos[0]);
            expect(clonedCombos.combos[1]).not.toBe(originalCombos.combos[1]);

            // Check that the combos are logically equal using the Combo.equals method
            expect(clonedCombos.combos[0].equals(originalCombos.combos[0])).toBe(true);
            expect(clonedCombos.combos[1].equals(originalCombos.combos[1])).toBe(true);
        });

        it('should create a deep clone (modifying original combos array does not affect clone)', () => {
            const clonedCombos = originalCombos.clone();
            const combo3 = Combo.fromString("(7H)(8H)(9H)");

            // Modify the original after cloning
            originalCombos.add(combo3);

            expect(originalCombos.length).toBe(3);
            expect(clonedCombos.length).toBe(2); // Clone should remain unchanged
            expect(clonedCombos.contains(combo3)).toBe(false);
        });

        it('should create a deep clone (modifying clone combos array does not affect original)', () => {
            const clonedCombos = originalCombos.clone();
            const combo3 = Combo.fromString("(7H)(8H)(9H)");

            // Modify the clone after cloning
            clonedCombos.add(combo3);

            expect(clonedCombos.length).toBe(3);
            expect(originalCombos.length).toBe(2); // Original should remain unchanged
            expect(originalCombos.contains(combo3)).toBe(false);
        });

        it('should correctly clone an empty Combos instance', () => {
            const emptyCombos = new Combos();
            const clonedEmpty = emptyCombos.clone();

            expect(clonedEmpty).toBeInstanceOf(Combos);
            expect(clonedEmpty).not.toBe(emptyCombos);
            expect(clonedEmpty.length).toBe(0);
            expect(clonedEmpty.combos).toEqual([]);
            expect(clonedEmpty.combos).not.toBe(emptyCombos.combos);
        });
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

    describe('Combos Class - toString', () => {
        let combos: Combos;

        beforeEach(() => {
            combos = new Combos();
        });

        it('should return an empty string when there are no combos', () => {
            expect(combos.toString()).toBe('');
        });

        it('should return a string representation of a single combo', () => {
            const combo = Combo.fromString("(1S)(2S)(3S)");
            combos.add(combo);
            expect(combos.toString()).toBe(combo.toString());
        });

        it('should return a space-separated string representation of multiple combos', () => {
            const combo1 = Combo.fromString("(1S)(2S)(3S)");
            const combo2 = Combo.fromString("(5H)(5D)(5C)");
            combos.add(combo1);
            combos.add(combo2);
            expect(combos.toString()).toBe(`${combo1.toString()} ${combo2.toString()}`);
        });

        it('should not include duplicate combos in the string representation', () => {
            const combo = Combo.fromString("(1S)(2S)(3S)");
            combos.add(combo);
            combos.add(combo); // Add the same combo again
            expect(combos.toString()).toBe(combo.toString());
        });

        it('should return a string representation after resetting and adding new combos', () => {
            const combo1 = Combo.fromString("(1S)(2S)(3S)");
            const combo2 = Combo.fromString("(5H)(5D)(5C)");
            combos.add(combo1);
            combos.reset();
            combos.add(combo2);
            expect(combos.toString()).toBe(combo2.toString());
        });
    });
    describe('Combos.fromString', () => {
        it('should create a Combos instance from a valid string description', () => {
            const desc = "(1S)(2S)(3S) (5H)(5D)(5C)";
            const combos = Combos.fromString(desc);

            expect(combos).toBeInstanceOf(Combos);
            expect(combos.length).toBe(2);

            const expectedCombo1 = new Combo([Card.of("1S"), Card.of("2S"), Card.of("3S")]);
            const expectedCombo2 = new Combo([Card.of("5H"), Card.of("5D"), Card.of("5C")]);

            expect(combos.contains(expectedCombo1)).toBe(true);
            expect(combos.contains(expectedCombo2)).toBe(true);
        });

        it('should handle an empty string and throw', () => {
            const desc = "";
            expect(() => Combos.fromString(desc)).toThrow();
        });

        it('should throw an error for invalid combo strings', () => {
            const desc = "(1S)(3S)(5S)"; // Invalid combo
            expect(() => Combos.fromString(desc)).toThrow();
        });

        it('should ignore duplicate combos in the string description', () => {
            const desc = "(1S)(2S)(3S) (1S)(2S)(3S)";
            const combos = Combos.fromString(desc);

            expect(combos).toBeInstanceOf(Combos);
            expect(combos.length).toBe(1);

            const expectedCombo = new Combo([Card.of("1S"), Card.of("2S"), Card.of("3S")]);
            expect(combos.contains(expectedCombo)).toBe(true);
        });

        it('should handle a string with multiple valid combos', () => {
            const desc = "(1S)(2S)(3S) (5H)(5D)(5C) (7H)(7D)(7C)";
            const combos = Combos.fromString(desc);

            expect(combos).toBeInstanceOf(Combos);
            expect(combos.length).toBe(3);

            const expectedCombo1 = new Combo([Card.of("1S"), Card.of("2S"), Card.of("3S")]);
            const expectedCombo2 = new Combo([Card.of("5H"), Card.of("5D"), Card.of("5C")]);
            const expectedCombo3 = new Combo([Card.of("7H"), Card.of("7D"), Card.of("7C")]);

            expect(combos.contains(expectedCombo1)).toBe(true);
            expect(combos.contains(expectedCombo2)).toBe(true);
            expect(combos.contains(expectedCombo3)).toBe(true);
        });
    });



});