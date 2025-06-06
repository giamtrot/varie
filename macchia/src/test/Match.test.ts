import { Match, STATUS_TYPE } from '../Match';
import { Players } from '../Players';
import { Player } from '../Player';
import { Decks } from '../Decks';
import { Desk } from '../Desk';
import { WorkingDesk } from '../WorkingDesk';
import { Card } from '../Card';
import { Combo } from '../Combo';
import { Combos } from '../Combos';

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
    let consoleLogSpy: jest.SpyInstance; // Spy for console.log

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Create mock player instances
        player1 = {
            name: "Alice",
            hand: [],
            hasCombo: jest.fn().mockReturnValue(true),
            hasCards: jest.fn().mockReturnValue(true),
            playCombo: jest.fn(),
            add: jest.fn(),
            remove: jest.fn(),
        } as unknown as jest.Mocked<Player>;

        Object.defineProperty(player1, 'cards', {
            configurable: true,
            get: jest.fn(() => []),
        });

        player2 = {
            name: "Bob",
            hand: [],
            hasCombo: jest.fn().mockReturnValue(false),
            hasCards: jest.fn().mockReturnValue(true),
            playCombo: jest.fn(),
            add: jest.fn(),
            remove: jest.fn(),
        } as unknown as jest.Mocked<Player>;

        Object.defineProperty(player2, 'cards', {
            configurable: true,
            get: jest.fn(() => []),
        });


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
            replace: jest.fn(),
        } as unknown as jest.Mocked<Desk>;
        (Desk as jest.MockedClass<typeof Desk>).mockImplementation(() => deskInstance);
        Object.defineProperty(deskInstance, 'combos', {
            configurable: true,
            get: jest.fn().mockReturnValue([]),
        });

        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { }); // Suppress actual log output

    });

    afterEach(() => {
        // Restore console spy
        consoleLogSpy.mockRestore();
    })

    describe('Match.constructor', () => {
        it('should initialize with provided decks', () => {
            const mockDecks = new Decks({ decksNumber: 1 });
            jest.clearAllMocks(); // Clear previous calls to Decks constructor

            const match = new Match(playersInstance, { decks: mockDecks });

            expect(match['players']).toBe(playersInstance);
            expect(match['decks']).toBe(mockDecks);
            expect(Decks).not.toHaveBeenCalled()
        });

        it('should initialize with a new shuffled deck if decksNumber is provided', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });

            expect(match['players']).toBe(playersInstance);
            expect(Decks).toHaveBeenCalledTimes(1);
            expect(decksInstance.shuffle).toHaveBeenCalledTimes(1);
            expect(decksInstance.distribute).toHaveBeenCalledWith(playersInstance.players, 13);
        });

        it('should throw an error if neither decks nor decksNumber is provided', () => {
            expect(() => new Match(playersInstance, {})).toThrow(
                "Decks must be provided or number of decks must be greater than 0"
            );
        });
    });

    it('should initialize players, decks, and desk', () => {
        const match = new Match(playersInstance, { decksNumber: 2 });

        expect(Decks).toHaveBeenCalledWith({ decksNumber: 2 });
        expect(Decks).toHaveBeenCalledTimes(1);

        expect(decksInstance.shuffle).toHaveBeenCalledTimes(1);
        expect(decksInstance.distribute).toHaveBeenCalledTimes(1);
        expect(decksInstance.distribute).toHaveBeenCalledWith(playersInstance.players, 13);

        expect(Desk).toHaveBeenCalledTimes(1);
        expect(match['players']).toBe(playersInstance);
        expect(match['decks']).toBe(decksInstance);
        expect(match['desk']).toBe(deskInstance);
    });

    describe('Match.step', () => {
        it('should get the next player', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            jest.spyOn(player1, 'hasCombo').mockReturnValueOnce(false); // Player1 has not a combo
            match.step();
            expect(playersInstance.nextPlayer).toHaveBeenCalledTimes(1);
        });

        it('should make the player draw a card if they have no combo', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
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
            const match = new Match(playersInstance, { decksNumber: 2 });
            const mockCombo = Combo.fromString("(1S)(2S)(3S)");
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
            const match = new Match(playersInstance, { decksNumber: 2 });
            jest.spyOn(decksInstance, 'hasNext').mockReturnValue(false); // No cards left

            expect(() => match.step()).toThrow("No more steps are possible");
        });

        it('should alternate players correctly', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
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
            const match = new Match(playersInstance, { decksNumber: 2 });
            const mockCombo = Combo.fromString("(1S)(2S)(3S)");
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

        it('should make the game end if a player has no cards', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            jest.spyOn(player1, 'hasCards').mockReturnValueOnce(true).mockReturnValueOnce(false); // Ensure player1 has no combo

            expect(match.step().type).toBe(STATUS_TYPE.RUNNING);
            expect(match.step().type).toBe(STATUS_TYPE.RUNNING);
            expect(match.step().type).toBe(STATUS_TYPE.GAME_OVER); // Player1 has no cards left
            expect(player1.hasCards).toHaveBeenCalledTimes(2); // Called twice: once before drawing a card and once after
            expect(player2.hasCards).toHaveBeenCalledTimes(1); // Called once
        });

        it('should NOT log break step message if breakStep is not reached', () => {
            const match = new Match(playersInstance, { decksNumber: 1 });
            const breakStepValue = 5;

            match.step(breakStepValue); // steps = 1
            match.step(breakStepValue); // steps = 2
            match.step(breakStepValue); // steps = 3

            expect(consoleLogSpy).not.toHaveBeenCalledWith(`Break step ${breakStepValue} reached`);
        });

        it('should log break step message when steps equals breakStep', () => {
            const match = new Match(playersInstance, { decksNumber: 1 });
            const breakStepValue = 3;

            match.step(breakStepValue); // steps = 1
            match.step(breakStepValue); // steps = 2
            match.step(breakStepValue); // steps = 3 -> condition met

            expect(consoleLogSpy).toHaveBeenCalledTimes(1); // Called only once
            expect(consoleLogSpy).toHaveBeenCalledWith(`Break step ${breakStepValue} reached`);
        });

        it('should NOT log break step message if breakStep is default (-1)', () => {
            const match = new Match(playersInstance, { decksNumber: 1 });

            match.step(); // steps = 1, breakStep = -1
            match.step(); // steps = 2, breakStep = -1

            expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining("Break step"));
        });

        it('should NOT log break step message if breakStep is 0', () => {
            const match = new Match(playersInstance, { decksNumber: 1 });

            match.step(0); // steps = 1, breakStep = 0
            match.step(0); // steps = 2, breakStep = 0

            expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining("Break step"));
        });

        it('should log break step message only on the specific step', () => {
            const match = new Match(playersInstance, { decksNumber: 1 });
            const breakStepValue = 2;

            match.step(breakStepValue); // steps = 1
            match.step(breakStepValue); // steps = 2 -> LOG
            match.step(breakStepValue); // steps = 3

            expect(consoleLogSpy).toHaveBeenCalledTimes(1); // Called only once
            expect(consoleLogSpy).toHaveBeenCalledWith(`Break step ${breakStepValue} reached`);
        });
    });

    describe('Match.checkCards', () => {
        it('should return true if the deck has cards', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            jest.spyOn(decksInstance, 'hasNext').mockReturnValue(true);
            expect(match.checkCards()).toBe(true);
            expect(decksInstance.hasNext).toHaveBeenCalledTimes(1);
        });

        it('should return false if the deck has no cards', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            jest.spyOn(decksInstance, 'hasNext').mockReturnValue(false);
            expect(match.checkCards()).toBe(false);
            expect(decksInstance.hasNext).toHaveBeenCalledTimes(1);
        });
    });

    describe('Match.toString', () => {
        it('should return a string representation of the match state', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
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

    describe('Match.toJSON', () => {
        it('should return a JSON representation of the match state', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
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

    describe('Match.tryToPlayCards', () => {
        it('should play a card if it forms a new combo on the desk', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            const card = Card.of("5H");
            const mockCombo = Combo.fromString("(5H)(6H)(7H)");
            const mockCombos = new Combos();
            mockCombos.add(mockCombo);
            Object.defineProperty(player1, 'cards', {
                configurable: true,
                get: jest.fn(() => [card]),
            });
            jest.spyOn(WorkingDesk.prototype, 'add').mockImplementation();
            jest.spyOn(WorkingDesk.prototype, 'searchNewCombos').mockReturnValue([mockCombos]);
            jest.spyOn(deskInstance, 'replace').mockImplementation();
            jest.spyOn(player1, 'remove').mockImplementation();

            const messages: string[] = [];
            const result = match['tryToPlayCards'](player1, messages, false);

            expect(result).toBe(true);
            expect(messages).toContain(`${player1.name} plays ${card}`);
            expect(deskInstance.replace).toHaveBeenCalledWith(mockCombos);
            expect(player1.remove).toHaveBeenCalledWith(card);
        });

        it('should not play a card if no new combo is found', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            const card = Card.of("5H");
            jest.spyOn(player1, 'cards', 'get').mockReturnValue([card]);
            jest.spyOn(WorkingDesk.prototype, 'add').mockImplementation();
            jest.spyOn(WorkingDesk.prototype, 'searchNewCombos').mockReturnValue([]);

            const messages: string[] = [];
            const result = match['tryToPlayCards'](player1, messages, false);

            expect(result).toBe(false);
            expect(messages).not.toContain(`${player1.name} plays ${card}`);
        });

        it('should iterate through all cards in the player\'s hand', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            const card1 = Card.of("5H");
            const card2 = Card.of("6H");
            jest.spyOn(player1, 'cards', 'get').mockReturnValue([card1, card2]);
            jest.spyOn(WorkingDesk.prototype, 'searchNewCombos').mockReturnValue([]);

            const messages: string[] = [];
            match['tryToPlayCards'](player1, messages, false);

            expect(WorkingDesk.prototype.searchNewCombos).toHaveBeenCalledWith(card1);
            expect(WorkingDesk.prototype.searchNewCombos).toHaveBeenCalledWith(card2);
        });

        it('should return true if at least one card is played', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            const card1 = Card.of("5H");
            const card2 = Card.of("6H");
            const mockCombo = Combo.fromString("(5H)(6H)(7H)");
            const mockCombos = new Combos();
            mockCombos.add(mockCombo);
            jest.spyOn(player1, 'cards', 'get').mockReturnValue([card1, card2]);
            jest.spyOn(WorkingDesk.prototype, 'add').mockImplementation();
            jest.spyOn(WorkingDesk.prototype, 'searchNewCombos')
                .mockReturnValueOnce([mockCombos])
                .mockReturnValueOnce([]);
            jest.spyOn(deskInstance, 'replace').mockImplementation();
            jest.spyOn(player1, 'remove').mockImplementation();

            const messages: string[] = [];
            const result = match['tryToPlayCards'](player1, messages, false);

            expect(result).toBe(true);
            expect(messages).toContain(`${player1.name} plays ${card1}`);
            expect(deskInstance.replace).toHaveBeenCalledWith(mockCombos);
            expect(player1.remove).toHaveBeenCalledWith(card1);
        });

        it('should return the initial value of somethingPlayed if no cards are played', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            const card = Card.of("5H");
            jest.spyOn(player1, 'cards', 'get').mockReturnValue([card]);
            jest.spyOn(WorkingDesk.prototype, 'add').mockImplementation();
            jest.spyOn(WorkingDesk.prototype, 'searchNewCombos').mockReturnValue([]);

            const messages: string[] = [];
            const result = match['tryToPlayCards'](player1, messages, true);

            expect(result).toBe(true);
        });
    });

    describe('Match.step', () => {
        it('should handle a player playing multiple combos in a single turn', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            const mockCombo1 = Combo.fromString("(1S)(2S)(3S)");
            const mockCombo2 = Combo.fromString("(4S)(5S)(6S)");
            jest.spyOn(player1, 'hasCombo').mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false);
            jest.spyOn(player1, 'playCombo')
                .mockReturnValueOnce(mockCombo1)
                .mockReturnValueOnce(mockCombo2);

            const status = match.step();

            expect(status.type).toBe(STATUS_TYPE.RUNNING);
            expect(status.messages).toContain(`${player1.name} plays ${mockCombo1}`);
            expect(status.messages).toContain(`${player1.name} plays ${mockCombo2}`);
            expect(deskInstance.add).toHaveBeenCalledWith(mockCombo1);
            expect(deskInstance.add).toHaveBeenCalledWith(mockCombo2);
        });

        it('should handle a player drawing a card if no combos are available', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            const drawnCard = Card.of("7H");
            jest.spyOn(player1, 'hasCombo').mockReturnValue(false);
            jest.spyOn(decksInstance, 'next').mockReturnValue(drawnCard);

            const status = match.step();

            expect(status.type).toBe(STATUS_TYPE.RUNNING);
            expect(status.messages).toContain(`${player1.name} gets ${drawnCard}`);
            expect(player1.add).toHaveBeenCalledWith(drawnCard);
        });

        it('should end the game if a player has no cards left', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            jest.spyOn(player1, 'hasCards').mockReturnValueOnce(false);

            const status = match.step();

            expect(status.type).toBe(STATUS_TYPE.GAME_OVER);
            expect(status.messages).toContain(`${player1.name} has no cards left! They wins!`);
        });

        it('should end the game if the deck has no cards left', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            jest.spyOn(decksInstance, 'hasNext').mockReturnValueOnce(true).mockReturnValueOnce(false);

            const status = match.step();

            expect(status.type).toBe(STATUS_TYPE.GAME_OVER);
            expect(status.messages).toContain("No more cards to play!");
        });

        it('should handle a player playing a card that forms a new combo', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            const card = Card.of("8H");
            const mockCombo = Combo.fromString("(8H)(9H)(10H)");
            const mockCombos = new Combos();
            mockCombos.add(mockCombo);
            Object.defineProperty(player1, 'cards', {
                configurable: true,
                get: jest.fn(() => [card]),
            });

            // (WorkingDesk as jest.MockedClass<typeof WorkingDesk>).mockImplementation(() => playersInstance);
            jest.spyOn(WorkingDesk.prototype, 'add').mockImplementation();
            jest.spyOn(WorkingDesk.prototype, 'searchNewCombos').mockReturnValue([mockCombos]);

            jest.spyOn(deskInstance, 'replace').mockImplementation();

            jest.spyOn(player1, 'remove').mockImplementation();
            jest.spyOn(player1, 'hasCombo').mockReturnValueOnce(false);

            const status = match.step();

            expect(status.type).toBe(STATUS_TYPE.RUNNING);
            expect(status.messages).toContain(`${player1.name} plays ${card}`);
            expect(deskInstance.replace).toHaveBeenCalledWith(mockCombos);
            expect(player1.remove).toHaveBeenCalledWith(card);
        });

        it('should alternate turns between players', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            const card1 = Card.of("3D");
            const card2 = Card.of("4D");
            jest.spyOn(decksInstance, 'next').mockReturnValueOnce(card1).mockReturnValueOnce(card2);
            jest.spyOn(player1, 'hasCombo').mockReturnValue(false);
            jest.spyOn(player2, 'hasCombo').mockReturnValue(false);

            let status = match.step(); // player1's turn
            expect(status.type).toBe(STATUS_TYPE.RUNNING);
            expect(status.messages).toContain(`${player1.name} gets ${card1}`);
            expect(player1.add).toHaveBeenCalledWith(card1);

            status = match.step(); // player2's turn
            expect(status.type).toBe(STATUS_TYPE.RUNNING);
            expect(status.messages).toContain(`${player2.name} gets ${card2}`);
            expect(player2.add).toHaveBeenCalledWith(card2);
        });

        it('should handle a safeguard for infinite loops when a player keeps playing combos', () => {
            const match = new Match(playersInstance, { decksNumber: 2 });
            const mockCombo = Combo.fromString("(1S)(2S)(3S)");
            jest.spyOn(player1, 'hasCombo').mockReturnValue(true);
            jest.spyOn(player1, 'playCombo').mockReturnValue(mockCombo);
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            const status = match.step();

            expect(status.type).toBe(STATUS_TYPE.RUNNING);
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining(`Potential infinite loop detected for player ${player1.name}`));
            expect(player1.playCombo).toHaveBeenCalledTimes(10); // Safeguard limit
            consoleWarnSpy.mockRestore();
        });
    });

});
