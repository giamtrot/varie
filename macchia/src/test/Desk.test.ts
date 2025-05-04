import { Desk } from '../Desk';
import { Combo } from '../Combo';
import { Combos } from '../Combos';
import { Card } from '../Card';
import { Hand } from '../Hand';
import { Decks } from '../Decks';


describe('Desk', () => {
    let desk: Desk;
    let mockCombo: Combo;

    beforeEach(() => {
        desk = new Desk();
        mockCombo = {
            toString: jest.fn().mockReturnValue('Mock Combo'),
            toJSON: jest.fn().mockReturnValue({ value: 'Mock Combo' })
        } as unknown as Combo;
    });

    describe('Desk.addCombo', () => {
        it('should add a combo to the desk', () => {
            desk.add(mockCombo);
            expect(desk.toString()).toContain('Mock Combo');
        });
    });

    describe('Desk.toString', () => {
        it('should return a string representation of all combos', () => {
            desk.add(mockCombo);
            desk.add(mockCombo);
            expect(desk.toString()).toBe('Mock Combo Mock Combo');
        });

        it('should return an empty string if no combos are added', () => {
            expect(desk.toString()).toBe('');
        });
    });

    describe('Desk.toJSON', () => {
        it('should return a JSON representation of all combos', () => {
            desk.add(mockCombo);
            desk.add(mockCombo);
            expect(desk.toJSON()).toEqual([{ value: 'Mock Combo' }, { value: 'Mock Combo' }]);
        });

        it('should return an empty array if no combos are added', () => {
            expect(desk.toJSON()).toEqual([]);
        });
    });

    describe('Desk.replace', () => {
        let desk: Desk;
        let combo1: Combo;
        let combo2: Combo;
        let newCombos: Combos;

        beforeEach(() => {
            desk = new Desk();
            combo1 = new Combo([Card.of("1C"), Card.of("2C"), Card.of("3C")]);
            combo2 = new Combo([Card.of("4D"), Card.of("5D"), Card.of("6D")]);
            newCombos = new Combos();
            newCombos.add(combo1);
            newCombos.add(combo2);
        });

        it('should replace the existing combos with the provided combos', () => {
            desk.add(combo1);
            expect(desk.combos.length).toBe(1);

            desk.replace(newCombos);
            expect(desk.combos.length).toBe(2);
            expect(desk.combos).toContain(combo1);
            expect(desk.combos).toContain(combo2);
        });

        it('should clear existing combos if the provided combos are empty', () => {
            desk.add(combo1);
            desk.add(combo2);
            expect(desk.combos.length).toBe(2);

            const emptyCombos = new Combos();
            desk.replace(emptyCombos);
            expect(desk.combos.length).toBe(0);
        });

        it('should not modify the original Combos object', () => {
            desk.replace(newCombos);
            expect(newCombos.combos.length).toBe(2);
            expect(newCombos.combos).toContain(combo1);
            expect(newCombos.combos).toContain(combo2);
        });
    });
});
