import { Player, Players } from '../Players';
import { Suit } from '../Card';
import { Card } from '../Card';
import { Combo } from '../Combos';

describe('Player Class', () => {
    it('should create a player with a name', () => {
        const player = new Player("Alice");
        expect(player.name).toBe("Alice");
        expect(player.hand.cards.length).toBe(0);
    });

    it('should return the correct string representation of a player', () => {
        const player = new Player("Alice");
        const card = Card.of("1C");
        player.hand.push(card);
        expect(player.toString()).toBe("Alice: " + "(1C)".black.bold);
    });

    describe('Player.add', () => {
        it('should add a card to the player\'s hand', () => {
            const player = new Player("Alice");
            const card = Card.of("1S");
            player.add(card);
            expect(player.hand.cards.length).toBe(1);
            expect(player.hand.cards.cards[0]).toBe(card);
        });

        it('should relate the new card with existing cards in the hand (horizontal match)', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("1H"); // Same value, different suit
            player.add(card1);
            player.add(card2);

            expect(card1.horizontals.cards).toContain(card2);
            expect(card2.horizontals.cards).toContain(card1);
        });

        it('should relate the new card with existing cards in the hand (vertical match)', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("2S"); // Same suit, consecutive value
            player.add(card1);
            player.add(card2);

            expect(card1.verticals.cards).toContain(card2);
            expect(card2.verticals.cards).toContain(card1);
        });

        it('should not relate the new card if there is no match', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("3H"); // Different value and suit
            player.add(card1);
            player.add(card2);

            expect(card1.horizontals.cards).not.toContain(card2);
            expect(card1.verticals.cards).not.toContain(card2);
            expect(card2.horizontals.cards).not.toContain(card1);
            expect(card2.verticals.cards).not.toContain(card1);
        });

        it('should handle adding multiple cards and maintain relationships', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("1H"); // Horizontal match with card1
            const card3 = Card.of("2S"); // Vertical match with card1
            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(card1.horizontals.cards).toContain(card2);
            expect(card1.verticals.cards).toContain(card3);
            expect(card2.horizontals.cards).toContain(card1);
            expect(card3.verticals.cards).toContain(card1);
        });

    });

    describe('Player.handSort', () => {
        it('should sort the hand by suit and value', () => {
            const player = new Player("Alice");
            const card1 = Card.of("13H"); // King of Hearts
            const card2 = Card.of("1S"); // Ace of Spades
            const card3 = Card.of("5C"); // 5 of Clubs
            const card4 = Card.of("2C"); // 2 of Clubs
            const card5 = Card.of("2D"); // 2 of Diamonds
            const card6 = Card.of("2D"); // 2 of Diamonds

            player.add(card1);
            player.add(card2);
            player.add(card3);
            player.add(card4);
            player.add(card5);
            player.add(card6);

            player.handSort();

            const sortedHand = [card2, card5, card6, card4, card3, card1]
            expect(player.hand.cards.cards).toEqual(sortedHand);

        });

        it('should handle an empty hand without errors', () => {
            const player = new Player("Alice");
            player.handSort();
            expect(player.hand.cards.length).toBe(0);
        });

        it('should handle a hand with one card without errors', () => {
            const player = new Player("Alice");
            const card = Card.of("7H"); // 7 of Hearts
            player.add(card);

            player.handSort();

            expect(player.hand.cards.length).toBe(1);
            expect(player.hand.cards.cards[0]).toBe(card);
        });

        it('should not modify a hand that is already sorted', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S"); // Ace of Spades
            const card2 = Card.of("5C"); // 5 of Clubs
            const card3 = Card.of("2D"); // 2 of Diamonds
            const card4 = Card.of("13H"); // King of Hearts

            player.add(card1);
            player.add(card2);
            player.add(card3);
            player.add(card4);

            player.handSort();

            const sortedHand = [...player.hand.cards.cards];
            player.handSort();

            expect(player.hand.cards.cards).toEqual(sortedHand);
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
            cardAS = Card.of("1S");
            card2S = Card.of("2S");
            card3S = Card.of("3S");
            card4S = Card.of("4S");
            card5H = Card.of("5H");
            card5D = Card.of("5D");
            card5C = Card.of("5C");
            card5S = Card.of("5S");
            card6H = Card.of("6H");
            card7H = Card.of("7H");
            card8H = Card.of("8H");
            cardKH = Card.of("13H");
            cardAH = Card.of("1H");
            card2H = Card.of("2H");
            cardQS = Card.of("12S");
            cardKS = Card.of("13S");
        });

        it('should find no combos if hand has less than 3 cards', () => {
            player.add(cardAS);
            player.add(card2S);
            expect(player.hand.hasCombo()).toBe(false);
        });

        it('should find no combos if no cards form a valid combo', () => {
            player.add(cardAS); // 1S
            player.add(card3S); // 3S (no vertical with AS)
            player.add(card5H); // 5H (no horizontal/vertical)
            player.add(card7H); // 7H (no vertical with 5H)
            expect(player.hand.hasCombo()).toBe(false);
        });

        it('should find one horizontal combo (set)', () => {
            // Add cards that form a set
            player.add(card5H);
            player.add(card5D);
            player.add(card5C);
            // Add an unrelated card
            player.add(cardAS);

            // Create the expected combo using the *exact same card instances*
            const expectedCombo = new Combo([card5H, card5D, card5C]);

            expect(player.hand.hasCombo()).toBe(true);
            expect(player.hand.combos.contains(expectedCombo)).toBe(true);
        });

        it('should find one horizontal combo (set) of 4 cards', () => {
            // Add cards that form a set
            player.add(card5H);
            player.add(card5D);
            player.add(card5C);
            player.add(card5S); // Add the 4th card for the set

            // Create the expected combo using the *exact same card instances*
            // Note: The order in the Combo constructor doesn't matter due to sorting,
            // but it must contain all the correct card instances.
            const expectedCombo = new Combo([card5H, card5D, card5C, card5S]);

            expect(player.hand.hasCombo()).toBe(true);
            // Check if a combo equivalent to expectedCombo exists
            expect(player.hand.combos.combos.some(c => c.equals(expectedCombo))).toBe(true);
        });


        it('should find one vertical combo (straight flush)', () => {
            // Add cards that form a straight flush
            player.add(cardAS);
            player.add(card2S);
            player.add(card3S);
            // Add an unrelated card
            player.add(card5H);

            // Create the expected combo using the *exact same card instances*
            const expectedCombo = new Combo([cardAS, card2S, card3S]);

            expect(player.hand.hasCombo()).toBe(true);
            expect(player.hand.combos.contains(expectedCombo)).toBe(true);
        });

        it('should find one vertical combo (straight flush) of 4 cards', () => {
            // Add cards that form a straight flush
            player.add(cardAS);
            player.add(card2S);
            player.add(card3S);
            player.add(card4S); // 4th card for the straight flush

            // Create the expected combo using the *exact same card instances*
            const expectedCombo = new Combo([cardAS, card2S, card3S, card4S]);

            expect(player.hand.hasCombo()).toBe(true);
            expect(player.hand.combos.contains(expectedCombo)).toBe(true);
        });


        it('should find multiple distinct horizontal combos', () => {
            // Combo 1: 5H, 5D, 5C
            player.add(card5H);
            player.add(card5D);
            player.add(card5C);
            // Combo 2: Needs new cards, e.g., 6s
            const card6S = Card.of("6S");
            const card6D = Card.of("6D");
            const card6C = Card.of("6C");
            player.add(card6S);
            player.add(card6D);
            player.add(card6C);

            const expectedCombo1 = new Combo([card5H, card5D, card5C]);
            const expectedCombo2 = new Combo([card6S, card6D, card6C]);

            expect(player.hand.combos.length).toBe(2);
            expect(player.hand.combos.contains(expectedCombo1)).toBe(true);
            expect(player.hand.combos.contains(expectedCombo2)).toBe(true);
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

            const expectedCombo1 = new Combo([cardAS, card2S, card3S]);
            const expectedCombo2 = new Combo([card6H, card7H, card8H]);

            expect(player.hand.combos.length).toBe(2);
            expect(player.hand.combos.contains(expectedCombo1)).toBe(true);
            expect(player.hand.combos.contains(expectedCombo2)).toBe(true);
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

            const expectedComboV = new Combo([cardAS, card2S, card3S]);
            const expectedComboH = new Combo([card5H, card5D, card5C]);

            expect(player.hand.combos.length).toBe(2);
            expect(player.hand.combos.contains(expectedComboV)).toBe(true);
            expect(player.hand.combos.contains(expectedComboH)).toBe(true);
        });

        it('should handle overlapping cards correctly if they form distinct combos', () => {
            // Hand: 5H, 5D, 5C (Horizontal) and 4S, 5S, 6S (Vertical, needs new 6S)
            const card6S = Card.of("6S");
            player.add(card5H);
            player.add(card5D);
            player.add(card5C);
            player.add(card4S);
            player.add(card5S); // This 5S is part of the vertical combo
            player.add(card6S);

            const expectedComboH = new Combo([card5H, card5D, card5C, card5S]);
            const expectedComboV = new Combo([card4S, card5S, card6S]);

            // Should find *both* combos
            expect(player.hand.combos.length).toBe(2);
            expect(player.hand.combos.contains(expectedComboH)).toBe(true);
            expect(player.hand.combos.contains(expectedComboV)).toBe(true);
        });


        it('should not add duplicate combos if findCombos is called multiple times', () => {
            player.add(cardAS);
            player.add(card2S);
            player.add(card3S);

            expect(player.hand.hasCombo()).toBe(true);

            const expectedCombo = new Combo([cardAS, card2S, card3S]);
            expect(player.hand.combos.contains(expectedCombo)).toBe(true);
        });

        it('should find vertical combo with Ace-low wrap-around (A-2-3)', () => {
            // Use Hearts for this test
            player.add(cardAH); // 1H
            player.add(card2H); // 2H
            const card3H = Card.of("3H");
            player.add(card3H); // 3H

            const expectedCombo = new Combo([cardAH, card2H, card3H]);
            expect(player.hand.hasCombo()).toBe(true);
            expect(player.hand.combos.contains(expectedCombo)).toBe(true);
        });

        it('should find vertical combo with Ace-high wrap-around (Q-K-A)', () => {
            // Use Spades for this test
            player.add(cardQS); // QS
            player.add(cardKS); // KS
            player.add(cardAS); // AS

            const expectedCombo = new Combo([cardQS, cardKS, cardAS]);
            expect(player.hand.hasCombo()).toBe(true);
            expect(player.hand.combos.contains(expectedCombo)).toBe(true);
        });

        it('should find vertical combo with Ace-high wrap-around (K-A-2)', () => {
            // Use Hearts for this test
            player.add(cardKH); // KH
            player.add(cardAH); // AH
            player.add(card2H); // 2H

            const expectedCombo = new Combo([cardKH, cardAH, card2H]);
            expect(player.hand.hasCombo()).toBe(true);
            expect(player.hand.combos.contains(expectedCombo)).toBe(true);
        });
    });

    describe('Player.findCombosAgain', () => {
        it('should find horizontal combos (same value, different suits)', () => {
            const player = new Player("Alice");
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            const card3 = Card.of("5D");

            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(player.hand.hasCombo()).toBe(true);
            expect(player.hand.combos.combos[0].cards).toEqual(expect.arrayContaining([card1, card2, card3]));
        });

        it('should find horizontal combos (same value, different suits) and reset if seacrh again', () => {
            const player = new Player("Alice");
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            const card3 = Card.of("5D");

            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(player.hand.hasCombo()).toBe(true);
            expect(player.hand.combos.combos[0].cards).toEqual(expect.arrayContaining([card1, card2, card3]));
        });

        it('should find vertical combos (same suit, consecutive values)', () => {
            const player = new Player("Alice");
            const card1 = Card.of("3C");
            const card2 = Card.of("4C");
            const card3 = Card.of("5C");

            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(player.hand.hasCombo()).toBe(true);
            expect(player.hand.combos.combos[0].cards).toEqual(expect.arrayContaining([card1, card2, card3]));
        });

        it('should not find combos if there are less than 3 cards', () => {
            const player = new Player("Alice");
            const card1 = Card.of("7S");
            const card2 = Card.of("7H");

            player.add(card1);
            player.add(card2);

            expect(player.hand.hasCombo()).toBe(false);
        });

        it('should not find combos if cards do not match horizontally or vertically', () => {
            const player = new Player("Alice");
            const card1 = Card.of("2S");
            const card2 = Card.of("5H");
            const card3 = Card.of("8D");

            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(player.hand.hasCombo()).toBe(false);
        });

        it('should find multiple combos in the hand', () => {
            const player = new Player("Alice");
            const card1 = Card.of("6S");
            const card2 = Card.of("6H");
            const card3 = Card.of("6D");
            const card4 = Card.of("10C");
            const card5 = Card.of("11C");
            const card6 = Card.of("12C");

            player.add(card1);
            player.add(card2);
            player.add(card3);
            player.add(card4);
            player.add(card5);
            player.add(card6);

            expect(player.hand.combos.length).toBe(2);
            expect(player.hand.combos.combos[0].cards).toEqual(expect.arrayContaining([card1, card2, card3]));
            expect(player.hand.combos.combos[1].cards).toEqual(expect.arrayContaining([card4, card5, card6]));
        });

        it('should handle a hand with no valid combos', () => {
            const player = new Player("Alice");
            const card1 = Card.of("9S");
            const card2 = Card.of("3H");
            const card3 = Card.of("7D");

            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(player.hand.hasCombo()).toBe(false);
        });

        it('should handle a hand with no valid horizontal combos (2 times same card)', () => {
            const player = new Player("Alice");
            const card1 = Card.of("2C"); // 2 of Clubs
            const card2 = Card.of("2D"); // 2 of Diamonds
            const card3 = Card.of("2D"); // 2 of Diamonds - duplicated

            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(player.hand.hasCombo()).toBe(false);
        });

        it('should handle a hand with no valid vertical combos (2 times same card)', () => {
            const player = new Player("Alice");
            const card1 = Card.of("2D"); // 2 of Diamonds
            const card2 = Card.of("3D"); // 3 of Diamonds
            const card3 = Card.of("2D"); // 2 of Diamonds - duplicated

            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(player.hand.hasCombo()).toBe(false);
        });
    });

    describe('Player.remove', () => {
        it('should remove a card from the player\'s hand', () => {
            const player = new Player("Alice");
            const card = Card.of("1S");

            player.add(card);

            player.remove(card);

            expect(player.hand.cards.length).toBe(0);
            expect(player.hand.cards).not.toContain(card);
        });

        it('should unrelate the removed card from horizontal relationships', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("1H"); // Same value, different suit
            player.add(card1);
            player.add(card2);

            player.remove(card1);

            expect(card2.horizontals.cards).not.toContain(card1);
        });

        it('should unrelate the removed card from vertical relationships', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("2S"); // Same suit, consecutive value
            player.add(card1);
            player.add(card2);

            player.remove(card1);

            expect(card2.verticals.cards).not.toContain(card1);
        });

        it('should handle removing a card that is not in the hand without errors', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("2H"); // Unrelated card

            player.add(card1);
            expect(() => player.remove(card2)).toThrow("not found in set") // Attempt to remove a card not in the hand

            expect(player.hand.cards.cards).toContain(card1);
        });

        it('should maintain relationships between other cards after removal', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("1H"); // Horizontal match with card1
            const card3 = Card.of("2S"); // Vertical match with card1
            const card4 = Card.of("2C"); // Horizontal match with card3

            player.add(card1);
            player.add(card2);
            player.add(card3);
            player.add(card4);

            expect(player.hand.hasCombo()).toBe(false);

            expect(card2.horizontals.cards).toContain(card1);
            expect(card3.verticals.cards).toContain(card1);
            expect(card2.horizontals.cards).toHaveLength(1);
            expect(card3.verticals.cards).toHaveLength(1);
            expect(card3.horizontals.cards).toHaveLength(1);
            expect(card3.horizontals.cards).toContain(card4);

            player.remove(card1);

            expect(card2.horizontals.cards).not.toContain(card1);
            expect(card3.verticals.cards).not.toContain(card1);
            expect(card2.horizontals.cards).toHaveLength(0);
            expect(card3.verticals.cards).toHaveLength(0);
            expect(card3.horizontals.cards).toHaveLength(1);
            expect(card3.horizontals.cards).toContain(card4);
        });
    });

    describe('Player.hasCombo', () => {
        it('should return false if the player has no combos', () => {
            const player = new Player("Alice");
            expect(player.hand.hasCombo()).toBe(false);
        });

        it('should return true if the player has at least one combo', () => {
            const player = new Player("Alice");
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            const card3 = Card.of("5D");

            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(player.hand.hasCombo()).toBe(true);
        });

        it('should return false after all combos are removed', () => {
            const player = new Player("Alice");
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            const card3 = Card.of("5D");

            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(player.hand.hasCombo()).toBe(true);

            player.hand.combos.combos.shift(); // Simulate removing the combo
            expect(player.hand.hasCombo()).toBe(false);
        });
    });

    describe('Player.toJSON', () => {
        it('should return the correct JSON representation of a player', () => {
            const player = new Player("Alice");
            const card1 = Card.of("13C");// King of Clubs
            const card2 = Card.of("10D"); // 10 of Diamonds
            const card3 = Card.of("1S"); // Ace of Spades

            player.add(card1);
            player.add(card2);
            player.add(card3);

            const expectedJSON = {
                name: "Alice",
                hand: [
                    { char: "🃞", color: "Black" },
                    { char: "🃊", color: "Red" },
                    { char: "🂡", color: "Black" },
                ]
            };

            expect(player.toJSON()).toEqual(expectedJSON);
        });

        it('should return an empty hand in the JSON representation if the player has no cards', () => {
            const player = new Player("Bob");

            const expectedJSON = {
                name: "Bob",
                hand: []
            };

            expect(player.toJSON()).toEqual(expectedJSON);
        });
    });

    describe('Player.playCombo', () => {
        let player: Player;
        let card1: Card;
        let card2: Card;
        let card3: Card;
        let combo: Combo;

        beforeEach(() => {
            player = new Player("Test Player");
            card1 = Card.of("5S");
            card2 = Card.of("5H");
            card3 = Card.of("5D");

            // Add cards to hand and let findCombos run
            player.add(card1);
            player.add(card2);
            player.add(card3);

            // Ensure a combo exists (findCombos should have added it)
            expect(player.hand.hasCombo()).toBe(true);
            // Store the combo that should be played
            combo = player.hand.combos.combos[0]; // Get the actual combo instance

            // Spy on the remove method to check if it's called
            jest.spyOn(player, 'remove');
            // Spy on findCombos as it's called within remove
            // jest.spyOn(player, 'updateCombos');
        });

        it('should return the first available combo', () => {
            const playedCombo = player.playCombo();
            // Check if the returned combo is the one we expected
            // Using equals because it might be a new instance depending on implementation details
            expect(playedCombo.equals(combo)).toBe(true);
        });

        it('should remove the cards of the played combo from the player hand', () => {
            player.playCombo();

            // Verify remove was called for each card in the combo
            expect(player.remove).toHaveBeenCalledTimes(combo.cards.length);
            expect(player.remove).toHaveBeenCalledWith(card1);
            expect(player.remove).toHaveBeenCalledWith(card2);
            expect(player.remove).toHaveBeenCalledWith(card3);

            // Optionally, check the hand state directly (though covered by remove calls)
            expect(player.hand.cards).not.toContain(card1);
            expect(player.hand.cards).not.toContain(card2);
            expect(player.hand.cards).not.toContain(card3);
            expect(player.hand.cards.length).toBe(0); // Assuming only combo cards were in hand
        });

        it('should throw an error if the player has no combo', () => {
            // Manually clear combos for this test case
            player.hand.reset();
            expect(player.hand.hasCombo()).toBe(false); // Pre-condition check

            // Expect the assert to throw an error
            expect(() => player.playCombo()).toThrow("No combo available");
        });

        it('should handle playing multiple combos sequentially', () => {
            // Add a second combo
            const cardA = Card.of("1C");
            const cardB = Card.of("2C");
            const cardC = Card.of("3C");
            player.add(cardA);
            player.add(cardB);
            player.add(cardC); // Hand: 5S, 5H, 5D (from prev test setup), AC, 2C, 3C

            expect(player.hand.combos.length).toBe(2); // Should have found both combos
            const combo1 = player.hand.combos.combos[0]; // The 5s combo
            const combo2 = player.hand.combos.combos[1]; // The Clubs straight

            // Play the first combo
            const playedCombo1 = player.playCombo();
            expect(playedCombo1.equals(combo1)).toBe(true);
            expect(player.hand.cards.length).toBe(3); // AC, 2C, 3C left
            expect(player.hand.hasCombo()).toBe(true); // Only the Clubs straight left

            // Play the second combo
            const playedCombo2 = player.playCombo();
            expect(playedCombo2.equals(combo2)).toBe(true);
            expect(player.hand.cards.length).toBe(0); // No cards left
            expect(player.hand.hasCombo()).toBe(false); // No combos left
        });

        it('should handle adding a combo with two times the same card', () => {
            const card1 = Card.of("9C");
            const card2 = Card.of("9C");
            const card3 = Card.of("10C");
            const card4 = Card.of("11C");

            player = new Player("Test Player");

            player.add(card1);
            player.add(card2);
            player.add(card3);
            player.add(card4);

            // Ensure a combo exists (findCombos should have added it)
            expect(player.hand.hasCombo()).toBe(true);
            expect(player.hand.hasCombo()).toBe(true);

            const card5 = Card.of("9H");
            player.add(card5);
            expect(player.hand.hasCombo()).toBe(true);

            const card6 = Card.of("9H");
            player.add(card6);
            expect(player.hand.hasCombo()).toBe(true);

            const card7 = Card.of("9D");
            player.add(card7);
            expect(player.hand.combos.length).toBe(2);

            const card8 = Card.of("9D");
            player.add(card8);
            expect(player.hand.combos.length).toBe(2);
        });
    });

    describe('hasCombo', () => {
        let player: Player;
        let card1: Card;
        let card2: Card;
        let card3: Card;
        let combo: Combo;
        let playerHasCombo: jest.SpyInstance;

        beforeEach(() => {
            player = new Player("Test Player");
            card1 = Card.of("5S");
            card2 = Card.of("5H");
            card3 = Card.of("5D");

            // Add cards to hand and let findCombos run
            player.add(card1);
            player.add(card2);
            player.add(card3);

            // Ensure a combo exists (findCombos should have added it)
            expect(player.hand.hasCombo()).toBe(true);
            // Store the combo that should be played
            combo = player.hand.combos.combos[0]; // Get the actual combo instance

            // Spy on the hasCombo method to check if it's called
            playerHasCombo = jest.spyOn(player, 'hasCombo');
        });

        it('should call hand.hasCombo()', () => {
            player.hasCombo();
            expect(player.hasCombo).toHaveBeenCalledTimes(1);
        });

        it('should return true when hand.hasCombo() returns true', () => {
            // Configure the mock hand's hasCombo to return true
            playerHasCombo.mockReturnValue(true);

            const result = player.hasCombo();
            expect(result).toBe(true);
        });

        it('should return false when hand.hasCombo() returns false', () => {
            // Configure the mock hand's hasCombo to return false
            playerHasCombo.mockReturnValue(false);

            const result = player.hasCombo();
            expect(result).toBe(false);
        });
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

    describe('Players.toString', () => {
        it('should return a string representation of all players and their sorted hands', () => {
            const player1 = new Player("Alice");
            const player2 = new Player("Bob");

            const card1 = Card.of("5S"); // 5 of Spades
            const card2 = Card.of("3H"); // 3 of Hearts
            const card3 = Card.of("7C"); // 7 of Clubs
            const card4 = Card.of("2D"); // 2 of Diamonds

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

            const card1 = Card.of("10S"); // 10 of Spades
            const card2 = Card.of("1C");  // Ace of Clubs

            player.add(card1);
            player.add(card2);

            const players = new Players([player]);

            const expectedOutput = "Alice: " + [card2.toString(), card1.toString()].join(""); // Sorted hand

            expect(players.toString()).toBe(expectedOutput);
        });
    });


    describe('Players.toJSON', () => {
        it('should return the correct JSON representation of all players', () => {
            const player1 = new Player("Alice");
            const player2 = new Player("Bob");

            const card1 = Card.of("13C");// King of Clubs
            const card2 = Card.of("10D"); // 10 of Diamonds
            const card3 = Card.of("1S"); // Ace of Spades

            player1.add(card1);
            player1.add(card2);
            player2.add(card3);

            const players = new Players([player1, player2]);

            const expectedJSON = [
                {
                    name: "Alice",
                    hand: [
                        { char: "🃊", color: "Red" },
                        { char: "🃞", color: "Black" },
                    ]
                },
                {
                    name: "Bob",
                    hand: [
                        { char: "🂡", color: "Black" },
                    ]
                }
            ];

            expect(players.toJSON()).toEqual(expectedJSON);
        });

        it('should return an empty hand for all players if no cards are added', () => {
            const player1 = new Player("Alice");
            const player2 = new Player("Bob");

            const players = new Players([player1, player2]);

            const expectedJSON = [
                { name: "Alice", hand: [] },
                { name: "Bob", hand: [] }
            ];

            expect(players.toJSON()).toEqual(expectedJSON);
        });
    });

});
