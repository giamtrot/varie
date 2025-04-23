import { Suit, SuitInfo } from '../Card';

describe('Suit Enum', () => {
    it('should have correct string values for each suit', () => {
        expect(Suit.Spades).toBe("Spades");
        expect(Suit.Hearts).toBe("Hearts");
        expect(Suit.Diamonds).toBe("Diamonds");
        expect(Suit.Clubs).toBe("Clubs");
    });

    it('should have all suits defined', () => {
        const suits = Object.values(Suit);
        expect(suits).toContain("Spades");
        expect(suits).toContain("Hearts");
        expect(suits).toContain("Diamonds");
        expect(suits).toContain("Clubs");
        expect(suits.length).toBe(4);
    });

});

describe('SuitInfo', () => {
    it('should have correct color and index for each suit', () => {
        expect(SuitInfo[Suit.Spades].color("test")).toBe("test".black.bold);
        expect(SuitInfo[Suit.Spades].index).toBe(0);

        expect(SuitInfo[Suit.Hearts].color("test")).toBe("test".red.bold);
        expect(SuitInfo[Suit.Hearts].index).toBe(1);

        expect(SuitInfo[Suit.Diamonds].color("test")).toBe("test".red.bold);
        expect(SuitInfo[Suit.Diamonds].index).toBe(2);

        expect(SuitInfo[Suit.Clubs].color("test")).toBe("test".black.bold);
        expect(SuitInfo[Suit.Clubs].index).toBe(3);
    });
});
