import { Desk } from '../Desk';
import { WorkingDesk } from '../WorkingDesk';
import { Combo } from '../Combo';
import { Card } from '../Card';
import { Hand } from '../Hand';

describe('WorkingDesk', () => {
    let mockDeskInstance: Desk
    let mockHandInstance: Hand;
    let workingDesk: WorkingDesk;
    let mockCard: Card;
    let combo1: Combo;
    let matchingCard1: Card;
    let nonMatchingCard1: Card;
    let combo2: Combo;
    let combo3: Combo;
    let combo4: Combo;

    beforeEach(() => {
        // Create a fresh mock Desk instance for each test
        mockHandInstance = new (jest.requireActual('../Card').Hand)();
        mockDeskInstance = new (jest.requireActual('../Desk').Desk)();
        workingDesk = new WorkingDesk(mockDeskInstance);
        // Create a mock Card instance
        mockCard = Card.of("1C"); // Use the mocked Card.of
        combo1 = new Combo([mockCard, Card.of("2C"), Card.of("3C")]);
        matchingCard1 = Card.of("4C"); // Use the mocked Card.of
        nonMatchingCard1 = Card.of("5C"); // Use the mocked Card.of
        combo2 = new Combo([mockCard, Card.of("1d"), Card.of("1h")]);
        combo3 = Combo.fromString("(1D)(2d)(3d)");
        combo4 = Combo.fromString("(1H)(2H)(3H)");

    });

    describe('constructor', () => {
        it('should call hand.addAll with the combos from the provided desk', () => {
            // Arrange: Set up the mock desk with some combos
            mockDeskInstance.add(combo1);
            mockDeskInstance.add(combo2);

            // Act: Instantiate WorkingDesk
            const wd = new WorkingDesk(mockDeskInstance);

            expect(wd.hand.cards.length).toBe(5);
            expect(wd.hand.combos.length).toBe(2);
        });

        it('should call hand.addAll with an empty array if the desk has no combos', () => {
            const wd = new WorkingDesk(mockDeskInstance);
            expect(wd.hand.cards.length).toBe(0);
            expect(wd.hand.combos.length).toBe(0);
        });
    });

    describe('add', () => {
        it('should add a card to the internal cards array', () => {
            workingDesk.add(mockCard);
            // Access private property for verification
            const internalCards = (workingDesk as any).hand.cards;
            expect(internalCards.length).toBe(1);
            expect(internalCards.cards).toContain(mockCard);
        });

        it('should add multiple cards correctly', () => {
            const card1 = Card.of("10S");
            const card2 = Card.of("13C");
            workingDesk.add(card1);
            workingDesk.add(card2);
            const internalCards = (workingDesk as any).hand.cards;
            expect(internalCards.length).toBe(2);
            expect(internalCards.cards).toContain(card1);
            expect(internalCards.cards).toContain(card2);
        });
    });

    describe('WorkingDesk.search', () => {

        it('should found nothing if empty', () => {
            const wd = new WorkingDesk(mockDeskInstance);
            expect(wd.hand.cards.length).toBe(0);
            expect(wd.hand.combos.length).toBe(0);
            const foundCombos = wd.searchNewCombos();
            expect(foundCombos).toBeUndefined();
        })

        it('should found the same combination if nothing added', () => {
            mockDeskInstance.add(combo1);
            const wd = new WorkingDesk(mockDeskInstance);
            expect(wd.hand.cards.length).toBe(3);
            expect(wd.hand.combos.length).toBe(1);
            const foundCombos = wd.searchNewCombos();
            expect(foundCombos).toBeDefined();
            expect(foundCombos?.combos.length).toBe(1);
            expect(foundCombos?.combos).toEqual(mockDeskInstance.combos);
            expect(foundCombos?.combos).toEqual([combo1]);
        })

        it('should found a new combination if a matching card is added', () => {
            mockDeskInstance.add(combo1);
            const wd = new WorkingDesk(mockDeskInstance);
            wd.add(matchingCard1);
            const foundCombos = wd.searchNewCombos();
            expect(foundCombos).toBeDefined();
            expect(foundCombos?.combos.length).toBe(1);
            expect(foundCombos?.combos[0].cards.length).toBe(4);
            expect(foundCombos?.combos[0].cards).toContain(matchingCard1);
        })

        it('should not found a new combination if a not matching card is added', () => {
            mockDeskInstance.add(combo1);
            const wd = new WorkingDesk(mockDeskInstance);
            wd.add(nonMatchingCard1);
            const foundCombos = wd.searchNewCombos();
            expect(foundCombos).toBeUndefined();
        })


        it('should rearrange cards after addition to create a new deck', () => {
            mockDeskInstance.add(combo1);
            mockDeskInstance.add(combo3);
            mockDeskInstance.add(combo4);
            const wd = new WorkingDesk(mockDeskInstance);

            expect(wd.hand.cards.length).toBe(9);
            expect(wd.hand.combos.length).toBe(6);

            const newCard = Card.of("1S");
            wd.add(newCard)
            expect(wd.hand.cards.length).toBe(10);
            expect(wd.hand.combos.length).toBe(6);

            const foundCombos = wd.searchNewCombos();
            expect(foundCombos).toBeDefined();
            expect(foundCombos?.combos.length).toBe(3);

            expect(foundCombos?.combos[0].cards.length).toBe(4);
            expect(foundCombos?.combos[0].cards).toContain(newCard);
            expect(foundCombos?.combos[0].cards).toContain(combo1.cards[0]);
            expect(foundCombos?.combos[0].cards).toContain(combo3.cards[0]);
            expect(foundCombos?.combos[0].cards).toContain(combo4.cards[0]);

            expect(foundCombos?.combos[1].cards.length).toBe(3);
            expect(foundCombos?.combos[1].cards).toContain(combo1.cards[1]);
            expect(foundCombos?.combos[1].cards).toContain(combo3.cards[1]);
            expect(foundCombos?.combos[1].cards).toContain(combo4.cards[1]);

            expect(foundCombos?.combos[2].cards.length).toBe(3);
            expect(foundCombos?.combos[2].cards).toContain(combo1.cards[2]);
            expect(foundCombos?.combos[2].cards).toContain(combo3.cards[2]);
            expect(foundCombos?.combos[2].cards).toContain(combo4.cards[2]);
        });

    });
});

describe('WorkingDesk Bugs', () => {

    it('should not crash when searching combos', () => {
        const deskDesc = "(7S)(7H)(7D)(7C)(6S)(6H)(6D)(5H)"
        const hand = new Hand();
        Card.fromStringToArray(deskDesc).forEach(c => hand.push(c));

        const combo = new Combo([hand.cards.cards[1], hand.cards.cards[5], hand.cards.cards[7]]);
        combo.cards.forEach(c => hand.remove(c));
        expect(hand.cards.length).toBe(5);
        expect(hand.cards.cards).not.toContain(Card.of("5H"));
    })

    it('should rearrange cards 1', () => {
        const deskDesc = "(7S)(7H)(7D)(7C) (12S)(12H)(12D)(12C) (6S)(6H)(6D)"
        const cardDesc = "5H"
        const desk = Desk.fromString(deskDesc);
        const wd = new WorkingDesk(desk)
        wd.add(Card.of(cardDesc));
        const ris = wd.searchNewCombos();
        expect(ris).toBeUndefined()
    });

    it('should rearrange cards 2', () => {
        const deskDesc = "(6S)(6H)(6D)(6C) (7S)(7H)(7C)"
        const cardDesc = "7D"
        const desk = Desk.fromString(deskDesc);
        const wd = new WorkingDesk(desk)
        wd.add(Card.of(cardDesc));
        const ris = wd.searchNewCombos();
        expect(ris).toBeDefined()
    });
});