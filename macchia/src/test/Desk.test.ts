import { Desk, WorkingDesk } from '../Desk';
import { Combo } from '../Combos';
import { Card } from '../Card';

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
            desk.add(mockCombo);
            expect(desk.toString()).toContain('Mock Combo');
        });
    });

    describe('toString', () => {
        it('should return a string representation of all combos', () => {
            desk.add(mockCombo);
            desk.add(mockCombo);
            expect(desk.toString()).toBe('Mock Combo Mock Combo');
        });

        it('should return an empty string if no combos are added', () => {
            expect(desk.toString()).toBe('');
        });
    });

    describe('toJSON', () => {
        it('should return a JSON representation of all combos', () => {
            desk.add(mockCombo);
            desk.add(mockCombo);
            expect(desk.toJSON()).toEqual([{ value: 'Mock Combo' }, { value: 'Mock Combo' }]);
        });

        it('should return an empty array if no combos are added', () => {
            expect(desk.toJSON()).toEqual([]);
        });
    });
});

describe('WorkingDesk', () => {
    let mockDeskInstance: Desk;
    let workingDesk: WorkingDesk;
    let mockCard: Card;

    beforeEach(() => {
        // Create a fresh mock Desk instance for each test
        mockDeskInstance = new (jest.requireActual('../Desk').Desk)();
        workingDesk = new WorkingDesk(mockDeskInstance);
        // Create a mock Card instance
        mockCard = Card.of("5H"); // Use the mocked Card.of
    });

    describe('constructor', () => {
        it('should store the provided Desk instance', () => {
            // Access the private property for verification (common in testing)
            expect((workingDesk as any).originalDesk).toBe(mockDeskInstance);
        });

        it('should initialize with an empty cards array', () => {
            expect((workingDesk as any).addedCards).toEqual([]);
        });

        it('should initialize with an empty newCombos array', () => {
            expect(workingDesk.newCombos).toEqual([]);
        });
    });

    describe('add', () => {
        it('should add a card to the internal cards array', () => {
            workingDesk.add(mockCard);
            // Access private property for verification
            const internalCards = (workingDesk as any).addedCards;
            expect(internalCards.length).toBe(1);
            expect(internalCards).toContain(mockCard);
        });

        it('should add multiple cards correctly', () => {
            const card1 = Card.of("10S");
            const card2 = Card.of("13C");
            workingDesk.add(card1);
            workingDesk.add(card2);
            const internalCards = (workingDesk as any).addedCards;
            expect(internalCards.length).toBe(2);
            expect(internalCards).toContain(card1);
            expect(internalCards).toContain(card2);
        });
    });

    describe('rearrange', () => {
        it('should rearrange cards after addition to create a new deck', () => {
            const desk = new Desk();
            const combo1 = Combo.of("1C 2C 3C");
            desk.add(combo1)

            const combo2 = Combo.of("1D 2d 3d");
            desk.add(combo2)

            const combo3 = Combo.of("1H 2H 3H");
            desk.add(combo3)

            const wDesk = new WorkingDesk(desk);
            const newCard = Card.of("1S");
            wDesk.add(newCard)

            wDesk.mix()
            // expect(newCard.horizontals.length).toBe(3);



            // expect(wDesk.newCombos.length).toBe(3);
            // expect(wDesk.newCombos).toContain(Combo.of("1C 1D 1H 1S"));
            // expect(wDesk.newCombos).toContain(Combo.of("2C 2D 2H"));
            // expect(wDesk.newCombos).toContain(Combo.of("3C 3D 3H"));
        });
    });
});