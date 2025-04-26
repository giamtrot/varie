import { Player, Players } from '../Players';
import { Suit } from '../Card';
import { Card } from '../Card';
import { Combo } from '../Combos';

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

describe('Player.add', () => {
    it('should add a card to the player\'s hand', () => {
        const player = new Player("Alice");
        const card = new Card(1, Suit.Spades);
        player.add(card);
        expect(player.hand.length).toBe(1);
        expect(player.hand.cards[0]).toBe(card);
    });

    it('should relate the new card with existing cards in the hand (horizontal match)', () => {
        const player = new Player("Alice");
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(1, Suit.Hearts); // Same value, different suit
        player.add(card1);
        player.add(card2);

        expect(card1.horizontals.cards).toContain(card2);
        expect(card2.horizontals.cards).toContain(card1);
    });

    it('should relate the new card with existing cards in the hand (vertical match)', () => {
        const player = new Player("Alice");
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(2, Suit.Spades); // Same suit, consecutive value
        player.add(card1);
        player.add(card2);

        expect(card1.verticals.cards).toContain(card2);
        expect(card2.verticals.cards).toContain(card1);
    });

    it('should not relate the new card if there is no match', () => {
        const player = new Player("Alice");
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(3, Suit.Hearts); // Different value and suit
        player.add(card1);
        player.add(card2);

        expect(card1.horizontals.cards).not.toContain(card2);
        expect(card1.verticals.cards).not.toContain(card2);
        expect(card2.horizontals.cards).not.toContain(card1);
        expect(card2.verticals.cards).not.toContain(card1);
    });

    it('should handle adding multiple cards and maintain relationships', () => {
        const player = new Player("Alice");
        const card1 = new Card(1, Suit.Spades);
        const card2 = new Card(1, Suit.Hearts); // Horizontal match with card1
        const card3 = new Card(2, Suit.Spades); // Vertical match with card1
        player.add(card1);
        player.add(card2);
        player.add(card3);

        expect(card1.horizontals.cards).toContain(card2);
        expect(card1.verticals.cards).toContain(card3);
        expect(card2.horizontals.cards).toContain(card1);
        expect(card3.verticals.cards).toContain(card1);
    });

    it('should add multiple cards and verify combo', () => { });
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

        expect(player.hand.cards).toEqual([
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
        expect(player.hand.cards[0]).toBe(card);
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

        const sortedHand = [...player.hand.cards];
        player.handSort();

        expect(player.hand.cards).toEqual(sortedHand);
    });
});

describe('Player.findCombos', () => {
    let player: Player;

    // Helper cards
    let cardAS: Card;
    let card2S: Card;
    let card3S: Card;
    let card4S: Card;

    let card5H: Card;
    let card5D: Card;
    let card5C: Card;
    let card5S: Card;

    let card6H: Card;
    let card7H: Card;
    let card8H: Card;

    let cardKH: Card;
    let cardAH: Card;
    let card2H: Card;

    let cardQS: Card;
    let cardKS: Card;


    beforeEach(() => {
        player = new Player("Test Player");
        // Reset cards
        cardAS = new Card(1, Suit.Spades);
        card2S = new Card(2, Suit.Spades);
        card3S = new Card(3, Suit.Spades);
        card4S = new Card(4, Suit.Spades);
        card5H = new Card(5, Suit.Hearts);
        card5D = new Card(5, Suit.Diamonds);
        card5C = new Card(5, Suit.Clubs);
        card5S = new Card(5, Suit.Spades);
        card6H = new Card(6, Suit.Hearts);
        card7H = new Card(7, Suit.Hearts);
        card8H = new Card(8, Suit.Hearts);
        cardKH = new Card(13, Suit.Hearts);
        cardAH = new Card(1, Suit.Hearts);
        card2H = new Card(2, Suit.Hearts);
        cardQS = new Card(12, Suit.Spades);
        cardKS = new Card(13, Suit.Spades);
    });

    it('should find no combos in an empty hand', () => {
        player.findCombos();
        expect(player.combos.length).toBe(0);
    });

    it('should find no combos if hand has less than 3 cards', () => {
        player.add(cardAS);
        player.add(card2S);
        player.findCombos();
        expect(player.combos.length).toBe(0);
    });

    it('should find no combos if no cards form a valid combo', () => {
        player.add(cardAS); // 1S
        player.add(card3S); // 3S (no vertical with AS)
        player.add(card5H); // 5H (no horizontal/vertical)
        player.add(card7H); // 7H (no vertical with 5H)
        player.findCombos();
        expect(player.combos.length).toBe(0);
    });

    it('should find one horizontal combo (set)', () => {
        // Add cards that form a set
        player.add(card5H);
        player.add(card5D);
        player.add(card5C);
        // Add an unrelated card
        player.add(cardAS);

        player.findCombos();

        // Create the expected combo using the *exact same card instances*
        const expectedCombo = new Combo([card5H, card5D, card5C]);

        expect(player.combos.length).toBe(1);
        expect(player.combos.contains(expectedCombo)).toBe(true);
    });

    it('should find one horizontal combo (set) of 4 cards', () => {
        // Add cards that form a set
        player.add(card5H);
        player.add(card5D);
        player.add(card5C);
        player.add(card5S); // Add the 4th card for the set

        player.findCombos();

        // Create the expected combo using the *exact same card instances*
        // Note: The order in the Combo constructor doesn't matter due to sorting,
        // but it must contain all the correct card instances.
        const expectedCombo = new Combo([card5H, card5D, card5C, card5S]);

        expect(player.combos.length).toBe(1);
        // Check if a combo equivalent to expectedCombo exists
        expect(player.combos.combos.some(c => c.equals(expectedCombo))).toBe(true);
    });


    it('should find one vertical combo (straight flush)', () => {
        // Add cards that form a straight flush
        player.add(cardAS);
        player.add(card2S);
        player.add(card3S);
        // Add an unrelated card
        player.add(card5H);

        player.findCombos();

        // Create the expected combo using the *exact same card instances*
        const expectedCombo = new Combo([cardAS, card2S, card3S]);

        expect(player.combos.length).toBe(1);
        expect(player.combos.contains(expectedCombo)).toBe(true);
    });

    it('should find one vertical combo (straight flush) of 4 cards', () => {
        // Add cards that form a straight flush
        player.add(cardAS);
        player.add(card2S);
        player.add(card3S);
        player.add(card4S); // 4th card for the straight flush

        player.findCombos();

        // Create the expected combo using the *exact same card instances*
        const expectedCombo = new Combo([cardAS, card2S, card3S, card4S]);

        expect(player.combos.length).toBe(1);
        expect(player.combos.contains(expectedCombo)).toBe(true);
    });


    it('should find multiple distinct horizontal combos', () => {
        // Combo 1: 5H, 5D, 5C
        player.add(card5H);
        player.add(card5D);
        player.add(card5C);
        // Combo 2: Needs new cards, e.g., 6s
        const card6S = new Card(6, Suit.Spades);
        const card6D = new Card(6, Suit.Diamonds);
        const card6C = new Card(6, Suit.Clubs);
        player.add(card6S);
        player.add(card6D);
        player.add(card6C);

        player.findCombos();

        const expectedCombo1 = new Combo([card5H, card5D, card5C]);
        const expectedCombo2 = new Combo([card6S, card6D, card6C]);

        expect(player.combos.length).toBe(2);
        expect(player.combos.contains(expectedCombo1)).toBe(true);
        expect(player.combos.contains(expectedCombo2)).toBe(true);
    });

    it('should find multiple distinct vertical combos', () => {
        // Combo 1: AS, 2S, 3S
        player.add(cardAS);
        player.add(card2S);
        player.add(card3S);
        // Combo 2: 6H, 7H, 8H
        player.add(card6H);
        player.add(card7H);
        player.add(card8H);

        player.findCombos();

        const expectedCombo1 = new Combo([cardAS, card2S, card3S]);
        const expectedCombo2 = new Combo([card6H, card7H, card8H]);

        expect(player.combos.length).toBe(2);
        expect(player.combos.contains(expectedCombo1)).toBe(true);
        expect(player.combos.contains(expectedCombo2)).toBe(true);
    });

    it('should find both horizontal and vertical combos in the same hand', () => {
        // Combo 1 (Vertical): AS, 2S, 3S
        player.add(cardAS);
        player.add(card2S);
        player.add(card3S);
        // Combo 2 (Horizontal): 5H, 5D, 5C
        player.add(card5H);
        player.add(card5D);
        player.add(card5C);

        player.findCombos();

        const expectedComboV = new Combo([cardAS, card2S, card3S]);
        const expectedComboH = new Combo([card5H, card5D, card5C]);

        expect(player.combos.length).toBe(2);
        expect(player.combos.contains(expectedComboV)).toBe(true);
        expect(player.combos.contains(expectedComboH)).toBe(true);
    });

    it('should handle overlapping cards correctly if they form distinct combos', () => {
        // Hand: 5H, 5D, 5C (Horizontal) and 4S, 5S, 6S (Vertical, needs new 6S)
        const card6S = new Card(6, Suit.Spades);
        player.add(card5H);
        player.add(card5D);
        player.add(card5C);
        player.add(card4S);
        player.add(card5S); // This 5S is part of the vertical combo
        player.add(card6S);

        player.findCombos();

        const expectedComboH = new Combo([card5H, card5D, card5C, card5S]);
        const expectedComboV = new Combo([card4S, card5S, card6S]);

        // Should find *both* combos
        expect(player.combos.length).toBe(2);
        expect(player.combos.contains(expectedComboH)).toBe(true);
        expect(player.combos.contains(expectedComboV)).toBe(true);
    });


    it('should not add duplicate combos if findCombos is called multiple times', () => {
        player.add(cardAS);
        player.add(card2S);
        player.add(card3S);

        player.findCombos(); // First call
        expect(player.combos.length).toBe(1);

        player.findCombos(); // Second call
        expect(player.combos.length).toBe(1); // Length should remain 1

        const expectedCombo = new Combo([cardAS, card2S, card3S]);
        expect(player.combos.contains(expectedCombo)).toBe(true);
    });

    it('should find vertical combo with Ace-low wrap-around (A-2-3)', () => {
        // Use Hearts for this test
        player.add(cardAH); // 1H
        player.add(card2H); // 2H
        const card3H = new Card(3, Suit.Hearts);
        player.add(card3H); // 3H

        player.findCombos();

        const expectedCombo = new Combo([cardAH, card2H, card3H]);
        expect(player.combos.length).toBe(1);
        expect(player.combos.contains(expectedCombo)).toBe(true);
    });

    it('should find vertical combo with Ace-high wrap-around (Q-K-A)', () => {
        // Use Spades for this test
        player.add(cardQS); // QS
        player.add(cardKS); // KS
        player.add(cardAS); // AS

        player.findCombos();

        const expectedCombo = new Combo([cardQS, cardKS, cardAS]);
        expect(player.combos.length).toBe(1);
        expect(player.combos.contains(expectedCombo)).toBe(true);
    });

    it('should find vertical combo with Ace-high wrap-around (K-A-2)', () => {
        // Use Hearts for this test
        player.add(cardKH); // KH
        player.add(cardAH); // AH
        player.add(card2H); // 2H

        player.findCombos();

        const expectedCombo = new Combo([cardKH, cardAH, card2H]);
        expect(player.combos.length).toBe(1);
        expect(player.combos.contains(expectedCombo)).toBe(true);
    });
});

describe('Player.findCombosAgain', () => {
    it('should find horizontal combos (same value, different suits)', () => {
        const player = new Player("Alice");
        const card1 = new Card(5, Suit.Spades);
        const card2 = new Card(5, Suit.Hearts);
        const card3 = new Card(5, Suit.Diamonds);

        player.add(card1);
        player.add(card2);
        player.add(card3);

        player.findCombos();

        expect(player.combos.combos.length).toBe(1);
        expect(player.combos.combos[0].cards).toEqual(expect.arrayContaining([card1, card2, card3]));
    });

    it('should find vertical combos (same suit, consecutive values)', () => {
        const player = new Player("Alice");
        const card1 = new Card(3, Suit.Clubs);
        const card2 = new Card(4, Suit.Clubs);
        const card3 = new Card(5, Suit.Clubs);

        player.add(card1);
        player.add(card2);
        player.add(card3);

        player.findCombos();

        expect(player.combos.combos.length).toBe(1);
        expect(player.combos.combos[0].cards).toEqual(expect.arrayContaining([card1, card2, card3]));
    });

    it('should not find combos if there are less than 3 cards', () => {
        const player = new Player("Alice");
        const card1 = new Card(7, Suit.Spades);
        const card2 = new Card(7, Suit.Hearts);

        player.add(card1);
        player.add(card2);

        player.findCombos();

        expect(player.combos.combos.length).toBe(0);
    });

    it('should not find combos if cards do not match horizontally or vertically', () => {
        const player = new Player("Alice");
        const card1 = new Card(2, Suit.Spades);
        const card2 = new Card(5, Suit.Hearts);
        const card3 = new Card(8, Suit.Diamonds);

        player.add(card1);
        player.add(card2);
        player.add(card3);

        player.findCombos();

        expect(player.combos.combos.length).toBe(0);
    });

    it('should find multiple combos in the hand', () => {
        const player = new Player("Alice");
        const card1 = new Card(6, Suit.Spades);
        const card2 = new Card(6, Suit.Hearts);
        const card3 = new Card(6, Suit.Diamonds);
        const card4 = new Card(10, Suit.Clubs);
        const card5 = new Card(11, Suit.Clubs);
        const card6 = new Card(12, Suit.Clubs);

        player.add(card1);
        player.add(card2);
        player.add(card3);
        player.add(card4);
        player.add(card5);
        player.add(card6);

        player.findCombos();

        expect(player.combos.combos.length).toBe(2);
        expect(player.combos.combos[0].cards).toEqual(expect.arrayContaining([card1, card2, card3]));
        expect(player.combos.combos[1].cards).toEqual(expect.arrayContaining([card4, card5, card6]));
    });

    it('should handle an empty hand without errors', () => {
        const player = new Player("Alice");

        player.findCombos();

        expect(player.combos.combos.length).toBe(0);
    });

    it('should handle a hand with no valid combos', () => {
        const player = new Player("Alice");
        const card1 = new Card(9, Suit.Spades);
        const card2 = new Card(3, Suit.Hearts);
        const card3 = new Card(7, Suit.Diamonds);

        player.add(card1);
        player.add(card2);
        player.add(card3);

        player.findCombos();

        expect(player.combos.combos.length).toBe(0);
    });
});

describe('Players Class', () => {
    it('should create a Players instance with a list of players', () => {
        const player1 = new Player("Alice");
        const player2 = new Player("Bob");
        const players = new Players([player1, player2]);

        expect(players.players.length).toBe(2);
        expect(players.players).toContain(player1);
        expect(players.players).toContain(player2);
    });

    it('should throw an error if no players are provided', () => {
        expect(() => new Players([])).toThrow("No player provided");
    });

    it('should return the next player in the sequence', () => {
        const players = new Players([new Player("Alice"), new Player("Bob"), new Player("Charlie")]);

        expect(players.nextPlayer().name).toBe("Alice");
        expect(players.nextPlayer().name).toBe("Bob");
        expect(players.nextPlayer().name).toBe("Charlie");
    });

    it('should loop back to the first player after the last player', () => {
        const players = new Players([new Player("Alice"), new Player("Bob")]);

        expect(players.nextPlayer().name).toBe("Alice");
        expect(players.nextPlayer().name).toBe("Bob");
        expect(players.nextPlayer().name).toBe("Alice");
    });

    it('should handle a single player correctly', () => {
        const players = new Players([new Player("Alice")]);

        expect(players.nextPlayer().name).toBe("Alice");
        expect(players.nextPlayer().name).toBe("Alice");
    });
});

describe('Players.toString', () => {
    it('should return a string representation of all players and their sorted hands', () => {
        const player1 = new Player("Alice");
        const player2 = new Player("Bob");

        const card1 = new Card(5, Suit.Spades); // 5 of Spades
        const card2 = new Card(3, Suit.Hearts); // 3 of Hearts
        const card3 = new Card(7, Suit.Clubs); // 7 of Clubs
        const card4 = new Card(2, Suit.Diamonds); // 2 of Diamonds

        player1.add(card1);
        player1.add(card2);
        player2.add(card3);
        player2.add(card4);

        const players = new Players([player1, player2]);

        const expectedOutput = [
            "Alice: " + [card2.toString(), card1.toString()].join(""), // Sorted hand
            "Bob: " + [card4.toString(), card3.toString()].join("")   // Sorted hand
        ].join("\n");

        expect(players.toString()).toBe(expectedOutput);
    });

    it('should return an empty string for players with no cards', () => {
        const player1 = new Player("Alice");
        const player2 = new Player("Bob");

        const players = new Players([player1, player2]);

        const expectedOutput = [
            "Alice: ",
            "Bob: "
        ].join("\n");

        expect(players.toString()).toBe(expectedOutput);
    });

    it('should handle a single player correctly', () => {
        const player = new Player("Alice");

        const card1 = new Card(10, Suit.Spades); // 10 of Spades
        const card2 = new Card(1, Suit.Clubs);  // Ace of Clubs

        player.add(card1);
        player.add(card2);

        const players = new Players([player]);

        const expectedOutput = "Alice: " + [card2.toString(), card1.toString()].join(""); // Sorted hand

        expect(players.toString()).toBe(expectedOutput);
    });
});


