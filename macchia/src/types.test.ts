import { Card, Suit, SuitInfo, Decks, Player } from './types';

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

    it('should distribute the correct number of cards to each player', () => {
        const decks = new Decks(1);
        const players = [new Player("Alice"), new Player("Bob")];
        decks.distribute(players, 5);

        expect(players[0].hand.length).toBe(5);
        expect(players[1].hand.length).toBe(5);
        expect(decks.length()).toBe(52 - 10);
    });

    it('should distribute unique cards to each player', () => {
        const decks = new Decks(1);
        const players = [new Player("Alice"), new Player("Bob")];
        decks.distribute(players, 5);

        const allCards = [...players[0].hand, ...players[1].hand];
        const uniqueCards = new Set(allCards.map(card => card.code()));
        expect(allCards.length).toBe(uniqueCards.size);
    });

    it('should throw an error if there are not enough cards to distribute', () => {
        const decks = new Decks(1);
        const players = [new Player("Alice"), new Player("Bob")];
        expect(() => decks.distribute(players, 30)).toThrow("Not enough cards");
    });

    it('should leave the remaining cards in the deck after distribution', () => {
        const decks = new Decks(1);
        const players = [new Player("Alice"), new Player("Bob")];
        decks.distribute(players, 5);

        const remainingCards = decks.length();
        expect(remainingCards).toBe(52 - 10);
    });

    it('should shuffle the deck before distributing cards', () => {
        const decks = new Decks(1);
        const players = [new Player("Alice"), new Player("Bob")];
        const originalOrder = decks.toString();
        decks.distribute(players, 5);

        const newOrder = decks.toString();
        expect(newOrder).not.toBe(originalOrder);
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

    it('should add a card to the player\'s hand', () => {
        const player = new Player("Alice");
        const card = new Card(1, Suit.Spades);
        player.add(card);
        expect(player.hand.length).toBe(1);
        expect(player.hand[0]).toBe(card);
    });

    it('should add multiple cards to the player\'s hand', () => {
        const player = new Player("Alice");
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(13, Suit.Hearts);
        player.add(card1);
        player.add(card2);
        expect(player.hand.length).toBe(2);
        expect(player.hand).toContain(card1);
        expect(player.hand).toContain(card2);
    });
});
describe('Player.handSort', () => {
    it('should sort the hand by suit and value', () => {
        const player = new Player("Alice");
        const card1 = new Card(13, Suit.Hearts); // King of Hearts
        const card2 = new Card(1, Suit.Spades); // Ace of Spades
        const card3 = new Card(5, Suit.Clubs); // 5 of Clubs
        const card4 = new Card(2, Suit.Clubs); // 2 of Clubs
        const card5 = new Card(2, Suit.Diamonds); // 2 of Diamonds
        const card6 = new Card(2, Suit.Diamonds); // 2 of Diamonds

        player.add(card1);
        player.add(card2);
        player.add(card3);
        player.add(card4);
        player.add(card5);
        player.add(card6);

        player.handSort();

        expect(player.hand).toEqual([
            card2, // Ace of Spades
            card5, // 2 of Diamonds
            card6, // 2 of Diamonds
            card4, // 2 of Clubs
            card3, // 5 of Clubs
            card1  // King of Hearts
        ]);
    });

    it('should handle an empty hand without errors', () => {
        const player = new Player("Alice");
        player.handSort();
        expect(player.hand.length).toBe(0);
    });

    it('should handle a hand with one card without errors', () => {
        const player = new Player("Alice");
        const card = new Card(7, Suit.Hearts); // 7 of Hearts
        player.add(card);

        player.handSort();

        expect(player.hand.length).toBe(1);
        expect(player.hand[0]).toBe(card);
    });

    it('should not modify a hand that is already sorted', () => {
        const player = new Player("Alice");
        const card1 = new Card(1, Suit.Spades); // Ace of Spades
        const card2 = new Card(5, Suit.Clubs); // 5 of Clubs
        const card3 = new Card(2, Suit.Diamonds); // 2 of Diamonds
        const card4 = new Card(13, Suit.Hearts); // King of Hearts

        player.add(card1);
        player.add(card2);
        player.add(card3);
        player.add(card4);

        player.handSort();

        const sortedHand = [...player.hand];
        player.handSort();

        expect(player.hand).toEqual(sortedHand);
    });
});

