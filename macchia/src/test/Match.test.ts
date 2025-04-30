import { Match } from '../Match';
import { Player, Players } from '../Players';
import { Decks } from '../Decks';
import { Desk } from '../Desk';
import { Card, Hand, Suit } from '../Card';
import { Combo } from '../Combos';

// Mock dependencies
jest.mock('../Players');
jest.mock('../Decks');
jest.mock('../Desk');
jest.mock('../Combos'); // Mock Combo if needed for playCombo return

describe('Match Class', () => {
    let playersInstance: Players;
    let decksInstance: Decks;
    let deskInstance: Desk;
    let player1: Player;
    let player2: Player;
    let mockPlayersArray: Player[];

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Create mock player instances
        player1 = {
            name: "Alice",
            hand: [],
            hasCombo: jest.fn().mockReturnValue(true),
            playCombo: jest.fn(),
            add: jest.fn(),
        } as unknown as jest.Mocked<Player>;
        player2 = {
            name: "Bob",
            hand: [],
            hasCombo: jest.fn().mockReturnValue(false),
            playCombo: jest.fn(),
            add: jest.fn(),
        } as unknown as jest.Mocked<Player>;

        mockPlayersArray = [player1, player2];

        playersInstance = {
            players: mockPlayersArray,
            nextPlayer: jest.fn().mockReturnValueOnce(player1).mockReturnValueOnce(player2).mockReturnValue(player1),
            toString: jest.fn().mockReturnValue("Alice: \nBob: "),
            toJSON: jest.fn().mockReturnValue([{ name: "Alice", hand: [] }, { name: "Bob", hand: [] }])
        } as unknown as jest.Mocked<Players>;
        // Tell the mocked Players constructor *what to return* when called
        (Players as jest.MockedClass<typeof Players>).mockImplementation(() => playersInstance);

        const card = Card.of("10H");
        decksInstance = {
            shuffle: jest.fn().mockReturnThis(),
            distribute: jest.fn(),
            hasNext: jest.fn().mockReturnValue(true),
            next: jest.fn().mockReturnValue(card), // Provide a default mock card
            toJSON: jest.fn().mockReturnValue([card.toJSON()]), // Example JSON
            toString: jest.fn().mockReturnValue(card.toString()),
            cards: [],
            length: jest.fn().mockReturnValue(52), // Mock length method if used
        } as unknown as jest.Mocked<Decks>; // Cast to satisfy type checks
        (Decks as jest.MockedClass<typeof Decks>).mockImplementation(() => decksInstance);

        deskInstance = {
            toString: jest.fn().mockReturnValue(""),
            toJSON: jest.fn().mockReturnValue([]),
            add: jest.fn(),
        } as unknown as jest.Mocked<Desk>;
        (Desk as jest.MockedClass<typeof Desk>).mockImplementation(() => deskInstance);
    });

    it('should initialize players, decks, and desk', () => {
        const match = new Match(playersInstance, 2);

        expect(Decks).toHaveBeenCalledWith(2);
        expect(Decks).toHaveBeenCalledTimes(1);

        expect(decksInstance.shuffle).toHaveBeenCalledTimes(1);
        expect(decksInstance.distribute).toHaveBeenCalledTimes(1);
        expect(decksInstance.distribute).toHaveBeenCalledWith(playersInstance.players, 13);

        expect(Desk).toHaveBeenCalledTimes(1);
        expect(match['players']).toBe(playersInstance);
        expect(match['decks']).toBe(decksInstance);
        expect(match['desk']).toBe(deskInstance);
    });

    describe('step', () => {
        it('should get the next player', () => {
            const match = new Match(playersInstance, 2);
            jest.spyOn(player1, 'hasCombo').mockReturnValueOnce(false); // Player1 has not a combo
            match.step();
            expect(playersInstance.nextPlayer).toHaveBeenCalledTimes(1);
        });

        it('should make the player draw a card if they have no combo', () => {
            const match = new Match(playersInstance, 2);
            const drawnCard = Card.of("5C");
            jest.spyOn(decksInstance, 'next').mockReturnValueOnce(drawnCard);
            jest.spyOn(player1, 'hasCombo').mockReturnValueOnce(false); // Ensure player1 has no combo

            match.step(); // player1's turn

            expect(player1.hasCombo).toHaveBeenCalledTimes(1);
            expect(decksInstance.next).toHaveBeenCalledTimes(1);
            expect(player1.add).toHaveBeenCalledWith(drawnCard);
            expect(player1.playCombo).not.toHaveBeenCalled();
            expect(deskInstance.add).not.toHaveBeenCalled(); // Currently commented out in Match.ts
        });

        it('should make the player play a combo if they have one', () => {
            const match = new Match(playersInstance, 2);
            const mockCombo = Combo.of("1S 2S 3S");
            (Combo as unknown as jest.Mock).mockImplementation(() => mockCombo); // Ensure Combo constructor mock returns something
            jest.spyOn(player1, 'hasCombo').mockReturnValueOnce(true).mockReturnValueOnce(false); // Player1 has a combo
            jest.spyOn(player1, 'playCombo').mockReturnValueOnce(mockCombo); // Mock playCombo return value

            match.step(); // player1's turn

            expect(player1.hasCombo).toHaveBeenCalledTimes(2);
            expect(player1.playCombo).toHaveBeenCalledTimes(1);
            expect(deskInstance.add).toHaveBeenCalledWith(mockCombo); // Currently commented out in Match.ts
            expect(decksInstance.next).not.toHaveBeenCalled();
            expect(player1.add).not.toHaveBeenCalled();
        });

        it('should throw an error if step is called when no cards are left in the deck', () => {
            const match = new Match(playersInstance, 2);
            jest.spyOn(decksInstance, 'hasNext').mockReturnValue(false); // No cards left

            expect(() => match.step()).toThrow("No more steps are possible");
        });

        it('should alternate players correctly', () => {
            const match = new Match(playersInstance, 2);
            const card1 = Card.of("1D");
            const card2 = Card.of("2D");
            jest.spyOn(decksInstance, 'next').mockReturnValueOnce(card1).mockReturnValueOnce(card2);
            jest.spyOn(player1, 'hasCombo').mockReturnValue(false);
            jest.spyOn(player2, 'hasCombo').mockReturnValue(false);

            match.step(); // player1's turn
            expect(playersInstance.nextPlayer).toHaveBeenCalledTimes(1);
            expect(player1.add).toHaveBeenCalledWith(card1);
            expect(player2.add).not.toHaveBeenCalled();

            match.step(); // player2's turn
            expect(playersInstance.nextPlayer).toHaveBeenCalledTimes(2);
            expect(player2.add).toHaveBeenCalledWith(card2);
        });

        // Test for the infinite loop safeguard
        it('should break the loop if a player keeps having combos (safeguard)', () => {
            const match = new Match(playersInstance, 2);
            const mockCombo = new Combo([Card.of("1S"), Card.of("2S"), Card.of("3S")]);
            (Combo as unknown as jest.Mock).mockImplementation(() => mockCombo); // Ensure Combo constructor mock returns something
            const hasComboMock = jest.spyOn(player1, 'hasCombo').mockReturnValue(true); // Player1 has a combo
            const playComboMock = jest.spyOn(player1, 'playCombo').mockReturnValueOnce(mockCombo); // Mock playCombo return value
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(); // Suppress console output during test

            match.step(); // player1's turn

            // The loop should run maxIterations 10 times before breaking
            expect(hasComboMock).toHaveBeenCalledTimes(10); // Called 10 times in loop + 1 check before loop
            expect(playComboMock).toHaveBeenCalledTimes(10); // Called 10 times
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining(`Potential infinite loop detected for player ${player1.name}`));

            jest.restoreAllMocks();
        });
    });

    describe('checkCards', () => {
        it('should return true if the deck has cards', () => {
            const match = new Match(playersInstance, 2);
            jest.spyOn(decksInstance, 'hasNext').mockReturnValue(true);
            expect(match.checkCards()).toBe(true);
            expect(decksInstance.hasNext).toHaveBeenCalledTimes(1);
        });

        it('should return false if the deck has no cards', () => {
            const match = new Match(playersInstance, 2);
            jest.spyOn(decksInstance, 'hasNext').mockReturnValue(false);
            expect(match.checkCards()).toBe(false);
            expect(decksInstance.hasNext).toHaveBeenCalledTimes(1);
        });
    });

    describe('toString', () => {
        it('should return a string representation of the match state', () => {
            const match = new Match(playersInstance, 2);
            jest.spyOn(decksInstance, 'toString').mockReturnValue("🂾");
            const expectedString = `Match State:
    Players:\nAlice: \nBob: 
    Decks: 🂾
    Desk: `;
            expect(match.toString()).toBe(expectedString);
            expect(playersInstance.toString).toHaveBeenCalledTimes(1);
            expect(decksInstance.toString).toHaveBeenCalledTimes(1);
            expect(deskInstance.toString).toHaveBeenCalledTimes(1);
        });
    });

    describe('toJSON', () => {
        it('should return a JSON representation of the match state', () => {
            const match = new Match(playersInstance, 2);
            jest.spyOn(decksInstance, 'toJSON').mockReturnValue([{ char: "🂾", color: "Black" }]);
            const expectedJSON = {
                match: {
                    players: [{ name: "Alice", hand: [] }, { name: "Bob", hand: [] }],
                    decks: [{ char: "🂾", color: "Black" }],
                    desk: [],
                }
            };
            expect(match.toJSON()).toEqual(expectedJSON);
            expect(playersInstance.toJSON).toHaveBeenCalledTimes(1);
            expect(decksInstance.toJSON).toHaveBeenCalledTimes(1);
            expect(deskInstance.toJSON).toHaveBeenCalledTimes(1);
        });
    });

});
