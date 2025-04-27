import { Desk } from '../Desk';
import { Combo } from '../Combos';

describe('Desk', () => {
    let desk: Desk;
    let mockCombo: Combo;

    beforeEach(() => {
        desk = new Desk();
        mockCombo = {
            toString: jest.fn().mockReturnValue('Mock Combo')
        } as unknown as Combo;
    });

    describe('addCombo', () => {
        it('should add a combo to the desk', () => {
            desk.addCombo(mockCombo);
            expect(desk.toJSON()).toContain('Mock Combo');
        });
    });

    describe('toString', () => {
        it('should return a string representation of all combos', () => {
            desk.addCombo(mockCombo);
            desk.addCombo(mockCombo);
            expect(desk.toString()).toBe('Mock Combo\nMock Combo');
        });

        it('should return an empty string if no combos are added', () => {
            expect(desk.toString()).toBe('');
        });
    });

    describe('toJSON', () => {
        it('should return a JSON representation of all combos', () => {
            desk.addCombo(mockCombo);
            desk.addCombo(mockCombo);
            expect(desk.toJSON()).toEqual(['Mock Combo', 'Mock Combo']);
        });

        it('should return an empty array if no combos are added', () => {
            expect(desk.toJSON()).toEqual([]);
        });
    });
});