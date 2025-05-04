import { Players } from '../Players';
import { Player } from '../Player';
import { Card } from '../Card';
import { Hand } from '../Hand';
import { CardSet } from '../CardSet';
import { Combo } from '../Combo';

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

    describe('Player.cards', () => {
        it('should return an empty array if the player has no cards', () => {
            const player = new Player("Alice");
            expect(player.cards).toEqual([]);
        });

        it('should return all cards in the player\'s hand', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("2H");
            const card3 = Card.of("3D");

            player.add(card1);
            player.add(card2);
            player.add(card3);

            expect(player.cards).toEqual([card1, card2, card3]);
        });

        it('should reflect changes when cards are added to the hand', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("2H");

            player.add(card1);
            expect(player.cards).toEqual([card1]);

            player.add(card2);
            expect(player.cards).toEqual([card1, card2]);
        });

        it('should reflect changes when cards are removed from the hand', () => {
            const player = new Player("Alice");
            const card1 = Card.of("1S");
            const card2 = Card.of("2H");

            player.add(card1);
            player.add(card2);

            player.remove(card1);
            expect(player.cards).toEqual([card2]);

            player.remove(card2);
            expect(player.cards).toEqual([]);
        });
    });

});
