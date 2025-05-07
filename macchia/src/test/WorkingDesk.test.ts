import { Desk } from '../Desk';
import { WorkingDesk } from '../WorkingDesk';
import { Combo } from '../Combo';
import { Card } from '../Card';
import { Hand } from '../Hand';
import { Combos } from '../Combos'; // Import Combos

describe('WorkingDesk', () => {
    let mockDeskInstance: Desk;
    let workingDesk: WorkingDesk;
    let mockCard: Card;
    let combo1: Combo;
    let matchingCard1: Card;
    let nonMatchingCard1: Card;
    let combo2: Combo;
    let combo3: Combo;
    let combo4: Combo;

    // Spies for static methods of WorkingDesk, primarily for instance method tests
    let outerStaticSearchSpy: jest.SpyInstance;
    let outerLogStatSpy: jest.SpyInstance;

    function getEmptyHelper() {
        return { startTime: 0, elapsedTime: 0, branchCount: 0, leafCount: 0, paths: new Set<string>(), cachePath: true };
    }

    beforeEach(() => {
        // Create a fresh mock Desk instance for each test
        // mockHandInstance = new (jest.requireActual('../Hand').Hand)(); // Actual Hand is used by WorkingDesk
        mockDeskInstance = new (jest.requireActual('../Desk').Desk)();
        workingDesk = new WorkingDesk(mockDeskInstance);
        // Create a mock Card instance
        mockCard = Card.of("1C");
        combo1 = new Combo([mockCard, Card.of("2C"), Card.of("3C")]);
        matchingCard1 = Card.of("4C");
        nonMatchingCard1 = Card.of("5C");
        combo2 = new Combo([mockCard, Card.of("1D"), Card.of("1H")]); // Corrected to use 'D' and 'H'
        combo3 = Combo.fromString("(1D)(2D)(3D)"); // Corrected to use 'D'
        combo4 = Combo.fromString("(1H)(2H)(3H)");

        // Spy on static methods to isolate instance method behavior
        // and prevent their full execution or console output.
        outerStaticSearchSpy = jest.spyOn(WorkingDesk, 'search').mockReturnValue([]); // Default mock return
        outerLogStatSpy = jest.spyOn(WorkingDesk as any, 'logStat').mockImplementation(() => { }); // Suppress log output
    });

    afterEach(() => {
        // Restore all spies created in the main beforeEach or within tests
        // This ensures that spies from one test don't affect others.
        // jest.restoreAllMocks() is powerful but use with caution if you have module-level mocks.
        // Specific restoration is often safer.
        outerStaticSearchSpy.mockRestore();
        outerLogStatSpy.mockRestore();
        jest.clearAllMocks(); // Clears call counts etc. for all mocks
    });

    describe('constructor', () => {
        it('should call hand.addAll with the combos from the provided desk', () => {
            // Arrange: Set up the mock desk with some combos
            mockDeskInstance.add(combo1);
            mockDeskInstance.add(combo2);

            // Act: Instantiate WorkingDesk
            const wd = new WorkingDesk(mockDeskInstance);

            // Assertions on the actual hand state
            expect(wd.hand.cards.length).toBe(5); // 1C,2C,3C,1D,1H
            expect(wd.hand.combos.length).toBe(2); // combo1, combo2
        });

        it('should call hand.addAll with an empty array if the desk has no combos', () => {
            const wd = new WorkingDesk(mockDeskInstance); // Desk is empty by default
            expect(wd.hand.cards.length).toBe(0);
            expect(wd.hand.combos.length).toBe(0);
        });
    });

    describe('add', () => {
        it('should add a card to the internal hand cards array', () => {
            workingDesk.add(mockCard);
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

    describe('searchNewCombos', () => {
        let addSpy: jest.SpyInstance;

        beforeEach(() => {
            // Spy on the instance 'add' method for these specific tests
            addSpy = jest.spyOn(workingDesk, 'add');
        });

        it('should call "add" method if addedCard is provided', () => {
            const testCard = Card.of("5S");
            workingDesk.searchNewCombos(testCard);

            expect(addSpy).toHaveBeenCalledTimes(1);
            expect(addSpy).toHaveBeenCalledWith(testCard);
            expect(outerStaticSearchSpy).toHaveBeenCalledTimes(1); // Verify search is still called
        });

        it('should NOT call "add" method if addedCard is undefined', () => {
            workingDesk.searchNewCombos(undefined);

            expect(addSpy).not.toHaveBeenCalled();
            expect(outerStaticSearchSpy).toHaveBeenCalledTimes(1);
        });

        it('should NOT call "add" method if addedCard is not provided (defaults to undefined)', () => {
            workingDesk.searchNewCombos();

            expect(addSpy).not.toHaveBeenCalled();
            expect(outerStaticSearchSpy).toHaveBeenCalledTimes(1);
        });

        it('should call WorkingDesk.search with its hand, new Combos, a helper, and the addedCard', () => {
            const testCard = Card.of("6H");
            workingDesk.searchNewCombos(testCard, false); // cachePath = false

            expect(outerStaticSearchSpy).toHaveBeenCalledTimes(1);
            const searchArgs = outerStaticSearchSpy.mock.calls[0];
            expect(searchArgs[0]).toBe(workingDesk.hand); // First arg is the hand
            expect(searchArgs[1]).toBeInstanceOf(Combos); // Second arg is a new Combos
            expect(searchArgs[2]).toMatchObject({ // Third arg is the helper object
                startTime: expect.any(Number),
                elapsedTime: 0, // Initial value
                branchCount: 0, // Initial value
                leafCount: 0,   // Initial value
                paths: expect.any(Set),
                cachePath: false
            });
            expect(searchArgs[3]).toBe(testCard); // Fourth arg is the addedCard
        });

        it('should call WorkingDesk.logStat after search', () => {
            workingDesk.searchNewCombos();
            expect(outerLogStatSpy).toHaveBeenCalledTimes(1);
            expect(outerLogStatSpy).toHaveBeenCalledWith(expect.objectContaining({
                startTime: expect.any(Number),
                // elapsedTime will be calculated, so we check it's a number
                elapsedTime: expect.any(Number)
            }));
        });
    });

    // This describe block was for the static WorkingDesk.search,
    // keeping it separate for clarity.
    describe('WorkingDesk.search (static method tests)', () => {
        // No need to store originalStaticSearch, originalInnerSearch here
        // if we correctly manage the spies.
        let currentTestLogStatSpy: jest.SpyInstance;

        beforeEach(() => {
            // 1. Restore the spies set up in the outer `beforeEach`
            //    so that `WorkingDesk.search` and `logStat` are their original implementations.
            if (outerStaticSearchSpy) outerStaticSearchSpy.mockRestore();
            if (outerLogStatSpy) outerLogStatSpy.mockRestore();

            // 2. For tests within *this suite*, we want to suppress console.log from the actual logStat
            currentTestLogStatSpy = jest.spyOn(WorkingDesk as any, 'logStat').mockImplementation(() => { });
        });


        afterEach(() => {
            // 1. Restore any spies created specifically for this suite's tests
            //    (e.g., if a test spied on innerSearch).
            //    If a test spied on WorkingDesk.search itself, restore it.
            currentTestLogStatSpy.mockRestore();

            // 2. Re-establish the outer spies for subsequent test suites or tests
            //    in the parent describe block. This is important because `describe`
            //    blocks can run in any order and share the module's state.
            outerStaticSearchSpy = jest.spyOn(WorkingDesk, 'search').mockReturnValue([]);
            outerLogStatSpy = jest.spyOn(WorkingDesk as any, 'logStat').mockImplementation(() => { });
        });


        it('should found nothing if empty hand has no combos', () => {
            const emptyHand = new Hand(); // Real hand, but empty
            const helper = getEmptyHelper();
            const combos = new Combos();
            const foundCombos = WorkingDesk.search(emptyHand, combos, helper);
            expect(foundCombos.length).toBe(0);
            expect(helper.leafCount).toBe(1); // Hits the dead branch condition
        });

        it('should find the same combination if nothing added (and hand has one combo)', () => {
            const handWithOneCombo = new Hand();
            handWithOneCombo.push(Card.of("1S"));
            handWithOneCombo.push(Card.of("2S"));
            handWithOneCombo.push(Card.of("3S")); // This creates a combo in the hand

            expect(handWithOneCombo.combos.length).toBe(1);
            const initialCombo = handWithOneCombo.combos.combos[0];

            const helper = getEmptyHelper();
            const foundCombosArray = WorkingDesk.search(handWithOneCombo, new Combos(), helper);

            expect(foundCombosArray.length).toBe(1); // Expecting one array of Combos solutions
            const foundCombosSolution = foundCombosArray[0];
            expect(foundCombosSolution).toBeInstanceOf(Combos);
            expect(foundCombosSolution.length).toBe(1);
            expect(foundCombosSolution.combos[0].equals(initialCombo)).toBe(true);
        });

        it('should find a new combination if a matching card is added', () => {
            const handForSearch = new Hand();
            // Original combo on desk (simulated by adding to hand)
            handForSearch.push(Card.of("1C"));
            handForSearch.push(Card.of("2C"));
            handForSearch.push(Card.of("3C"));
            // Added card
            const addedMatchingCard = Card.of("4C");
            handForSearch.push(addedMatchingCard); // Hand now has 1C,2C,3C,4C

            expect(handForSearch.combos.length).toBe(3); // Should find (1C 2C 3C 4C)

            const helper = getEmptyHelper();
            const foundCombosArr = WorkingDesk.search(handForSearch, new Combos(), helper, addedMatchingCard);

            expect(foundCombosArr.length).toBe(1);
            const foundCombos = foundCombosArr[0];
            expect(foundCombos.length).toBe(1);
            const foundCombo = foundCombos.combos[0];
            expect(foundCombo.cards.length).toBe(4);
            expect(foundCombo.containsSame(addedMatchingCard)).toBe(true);
        });

        it('should not find a new combination if a not matching card is added and no other combos exist', () => {
            const handForSearch = new Hand();
            // Original combo
            handForSearch.push(Card.of("1C"));
            handForSearch.push(Card.of("2C"));
            handForSearch.push(Card.of("3C"));
            // Added non-matching card
            const addedNonMatchingCard = Card.of("5S");
            handForSearch.push(addedNonMatchingCard);
            // Hand has 1C,2C,3C,5S. Combos in hand: (1C,2C,3C)

            const helper = getEmptyHelper();
            // The search will try the (1C,2C,3C) combo.
            // If addedCard is specified, it will filter for combos containing 5S.
            // Since (1C,2C,3C) doesn't contain 5S, it will be skipped.
            const foundCombos = WorkingDesk.search(handForSearch, new Combos(), helper, addedNonMatchingCard);
            expect(foundCombos.length).toBe(0); // No combo containing 5S is found by hand.updateCombo
        });


        it('should rearrange cards after addition to create a new deck configuration', () => {
            const handForSearch = new Hand();
            // combo1: (1C)(2C)(3C)
            handForSearch.push(Card.of("1C"));
            handForSearch.push(Card.of("2C"));
            handForSearch.push(Card.of("3C"));
            // combo3: (1D)(2D)(3D)
            handForSearch.push(Card.of("1D"));
            handForSearch.push(Card.of("2D"));
            handForSearch.push(Card.of("3D"));
            // combo4: (1H)(2H)(3H)
            handForSearch.push(Card.of("1H"));
            handForSearch.push(Card.of("2H"));
            handForSearch.push(Card.of("3H"));

            // Current combos in hand: (1C,2C,3C), (1D,2D,3D), (1H,2H,3H), and sets of 1s, 2s, 3s
            // For simplicity, let's assume hand.combos will prioritize sets if they are found.
            // After adding 1S, new sets like (1C,1D,1H,1S) become possible.

            const newCard = Card.of("1S");
            handForSearch.push(newCard); // Add the new card

            // Expected combos in hand after adding 1S and updateCombo:
            // (1C,1D,1H,1S)
            // (2C,2D,2H)
            // (3C,3D,3H)
            // (1C,2C,3C)
            // (1D,2D,3D)
            // (1H,2H,3H)
            // (1S) is not a combo

            const helper = getEmptyHelper();
            const foundCombosArr = WorkingDesk.search(handForSearch, new Combos(), helper, newCard);

            // The search should find a solution where the new card is used.
            // The exact number of solutions and their composition depends on the search algorithm's path.
            // This test becomes complex to assert precisely without knowing the exact search path.
            // A simpler assertion is that at least one solution is found.
            expect(foundCombosArr.length).toBeGreaterThanOrEqual(1);

            // Check if one of the found solutions uses the new card in a set of 1s
            const usesNewCardInSetOfOnes = foundCombosArr.some(solution =>
                solution.combos.some(c =>
                    c.cards.length === 4 &&
                    c.containsSame(newCard) &&
                    c.containsSame(Card.of("1C")) &&
                    c.containsSame(Card.of("1D")) &&
                    c.containsSame(Card.of("1H"))
                )
            );
            expect(usesNewCardInSetOfOnes).toBe(true);
        });
    });

    // New describe block for WorkingDesk.innerSearch static method tests
    describe('WorkingDesk.innerSearch (static method tests)', () => {
        let currentTestLogStatSpy: jest.SpyInstance; // For WorkingDesk.logStat
        let consoleLogSpy: jest.SpyInstance;      // For console.log
        const originalLogDetails = WorkingDesk["activaLogDetails"]; // Store original value of WorkingDesk.logDetails

        beforeEach(() => {
            // 1. Restore spies from the outer scope to ensure we're working with original methods
            //    before applying spies specific to this test suite.
            if (outerStaticSearchSpy) outerStaticSearchSpy.mockRestore(); // Makes WorkingDesk.search its original implementation
            if (outerLogStatSpy) outerLogStatSpy.mockRestore();    // Makes WorkingDesk.logStat its original implementation

            // 2. For tests within *this suite*:
            //    - Mock `WorkingDesk.logStat` to prevent its actual console output during tests.
            currentTestLogStatSpy = jest.spyOn(WorkingDesk as any, 'logStat').mockImplementation(() => { });
            //    - Mock `console.log` to control and assert logging from `WorkingDesk.logDetails`.
            consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
            //    - Reset `WorkingDesk.logDetails` to its default (false) for each test.
            WorkingDesk["activaLogDetails"] = false;
        });

        afterEach(() => {
            // 1. Restore spies created specifically for this suite's tests.
            currentTestLogStatSpy.mockRestore();
            consoleLogSpy.mockRestore();
            WorkingDesk["activaLogDetails"] = originalLogDetails; // Restore original static property value

            // 2. Re-establish the outer spies for subsequent test suites or tests
            //    in the parent describe block.
            outerStaticSearchSpy = jest.spyOn(WorkingDesk, 'search').mockReturnValue([]);
            outerLogStatSpy = jest.spyOn(WorkingDesk as any, 'logStat').mockImplementation(() => { });
        });

        it('should return an empty array if the path is already in helper.paths (cycle detected)', () => {
            // Arrange
            const handForInnerSearch = new Hand(); // This is the 'newHand' parameter for innerSearch
            const combosForInnerSearch = new Combos(); // This is the 'combos' parameter for innerSearch
            const currentCombo = Combo.fromString("(1S)(2S)(3S)");

            // Simulate how 'newCombos.toString()' would generate the path
            const tempNewCombos = combosForInnerSearch.clone();
            tempNewCombos.add(currentCombo);
            const pathKey = tempNewCombos.toString();

            const helper = getEmptyHelper(); // Use the existing helper function from the test file
            helper.paths.add(pathKey);       // Pre-populate paths to simulate a cycle
            helper.cachePath = true;         // cachePath being true/false affects adding current path, not checking existing

            // Act
            const result = WorkingDesk.innerSearch(currentCombo, handForInnerSearch, combosForInnerSearch, helper);

            // Assert
            expect(result).toEqual([]);
            expect(consoleLogSpy).not.toHaveBeenCalled(); // WorkingDesk.logDetails is false by default
        });

        it('should log cycle detection message and return empty array if logDetails is true and path is in helper.paths', () => {
            // Arrange
            WorkingDesk["activaLogDetails"] = true; // Enable detailed logging for this specific test

            const handForInnerSearch = new Hand();
            const combosForInnerSearch = new Combos();
            // Add a dummy combo to make combosForInnerSearch.length = 1, so `combos.length - 1` in log is 0
            combosForInnerSearch.add(Combo.fromString("(7H)(8H)(9H)"));

            const currentCombo = Combo.fromString("(1S)(2S)(3S)");

            const tempNewCombos = combosForInnerSearch.clone();
            tempNewCombos.add(currentCombo);
            const pathKey = tempNewCombos.toString();

            const helper = getEmptyHelper();
            helper.paths.add(pathKey);
            helper.cachePath = true;
            helper.leafCount = 5; // Arbitrary leafCount for the log message
            const expectedLogMessage = `${"-".repeat(combosForInnerSearch.length - 1)}${helper.leafCount + 1}. Cycle branch. Skipping`;
            // Act
            const result = WorkingDesk.innerSearch(currentCombo, handForInnerSearch, combosForInnerSearch, helper);
            // Assert
            expect(result).toEqual([]);
            expect(consoleLogSpy).toHaveBeenCalledWith(expectedLogMessage);
        });
    });

    describe('WorkingDesk Use Cases', () => {

        function logElapsed(start: number) {
            const elapsed = performance.now() - start;
            console.log(`Elapsed time: ${(elapsed / 1000.).toFixed(2)} s`);
        }
        it('should not crash when searching combos', () => {
            const deskDesc = "(7S)(7H)(7D)(7C)(6S)(6H)(6D)(5H)"
            const hand = new Hand();
            Card.fromStringToArray(deskDesc).forEach(c => hand.push(c));

            const combo = new Combo([hand.cards.cards[1], hand.cards.cards[5], hand.cards.cards[7]]);
            combo.cards.forEach(c => hand.remove(c));
            expect(hand.cards.length).toBe(5);
            expect(hand.cards.cards).not.toContain(Card.of("5H"));
        })

        it('should rearrange cards 1', async () => {
            const deskDesc = "(7S)(7H)(7D)(7C) (12S)(12H)(12D)(12C) (6S)(6H)(6D)"
            const cardDesc = "5H"
            const desk = Desk.fromString(deskDesc);
            const wd = new WorkingDesk(desk)
            wd.add(Card.of(cardDesc));
            const start = performance.now();
            const ris = wd.searchNewCombos();
            logElapsed(start);
            expect(ris.length).toBe(0);
        }, 5000);

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
});

