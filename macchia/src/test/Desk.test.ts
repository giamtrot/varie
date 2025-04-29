import { Desk } from '../Desk';
import { Combo } from '../Combos';

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

    describe('addCombo', () => {
        it('should add a combo to the desk', () => {
            desk.addCombo(mockCombo);
            expect(desk.toString()).toContain('Mock Combo');
        });
    });

    describe('toString', () => {
        it('should return a string representation of all combos', () => {
            desk.addCombo(mockCombo);
            desk.addCombo(mockCombo);
            expect(desk.toString()).toBe('Mock Combo Mock Combo');
        });

        it('should return an empty string if no combos are added', () => {
            expect(desk.toString()).toBe('');
        });
    });

    describe('toJSON', () => {
        it('should return a JSON representation of all combos', () => {
            desk.addCombo(mockCombo);
            desk.addCombo(mockCombo);
            expect(desk.toJSON()).toEqual([{ value: 'Mock Combo' }, { value: 'Mock Combo' }]);
        });

        it('should return an empty array if no combos are added', () => {
            expect(desk.toJSON()).toEqual([]);
        });
    });

    describe('New Deck decider', () => {
        it('should rearrange cards after addition to create a new deck', () => {
            const desk = new Desk();
            // const combo1 = Combo.fromString("1C 2C 3C");



        });


    });
});