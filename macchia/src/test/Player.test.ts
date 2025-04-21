import { Card, Suit, Player } from '../types';

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
