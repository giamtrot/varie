import { Card, Suit, SuitInfo, Deck, Decks, Player } from './types';

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

describe('Card Class', () => {
    it('should create a card with valid value and suit', () => {
        const card = new Card(1, Suit.Spades);
        expect(card.value).toBe(1);
        expect(card.suit).toBe(Suit.Spades);
    });

    it('should throw an error for invalid card value', () => {
        expect(() => new Card(0, Suit.Spades)).toThrow("Value must be between 1 and 13");
        expect(() => new Card(14, Suit.Spades)).toThrow("Value must be between 1 and 13");
    });

    it('should return the correct Unicode code point for a card', () => {
        const card = new Card(1, Suit.Spades);
        expect(card.code()).toBe(0x1F0A1);
    });

    it('should return the correct string representation of a card', () => {
        const card = new Card(1, Suit.Hearts);
        expect(card.toString()).toBe("🂱".red.bold);
    });
});

describe('Deck Class', () => {
    it('should create a deck with 52 cards', () => {
        const deck = new Deck();
        expect(deck.length()).toBe(52);
    });

    it('should shuffle the deck', () => {
        const deck = new Deck();
        const originalOrder = deck.toString();
        deck.shuffle();
        expect(deck.toString()).not.toBe(originalOrder);
    });

    it('should return the correct string representation of a deck', () => {
        const deck = new Deck();
        expect(deck.toString().length).toBeGreaterThan(0);
    });
});

describe('Decks Class', () => {
    it('should create multiple decks', () => {
        const decks = new Decks(2);
        expect(decks.length()).toBe(104);
    });

    it('should shuffle all decks', () => {
        const decks = new Decks(2);
        const originalOrder = decks.toString();
        decks.shuffle();
        expect(decks.toString()).not.toBe(originalOrder);
    });

    it('should throw an error if distributing more cards than available', () => {
        const decks = new Decks(2);
        const players = [new Player("Alice"), new Player("Bob")];
        expect(() => decks.distribute(players, 60)).toThrow("Not enough cards");
    });
});

describe('Player Class', () => {
    it('should create a player with a name', () => {
        const player = new Player("Alice");
        expect(player.name).toBe("Alice");
        expect(player.hand.length).toBe(0);
    });

    it('should return the correct string representation of a player', () => {
        const player = new Player("Alice");
        const card = new Card(1, Suit.Clubs);
        player.hand.push(card);
        expect(player.toString()).toBe("Alice: " + "🃑".black.bold);
    });
});


