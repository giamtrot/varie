import * as fs from "fs";
import { Macchiavelli_CLI } from '../Macchiavelli_CLI';
import { Match } from '../Match';

jest.mock("fs");
jest.mock('../Match');

describe('Macchiavelli_CLI Class', () => {

    let cli: Macchiavelli_CLI;

    beforeEach(() => {
        cli = new Macchiavelli_CLI();
    });

    it('should initialize with a Match instance', () => {
        expect(cli.match).toBeInstanceOf(Match);
    });

    describe('write Method', () => {
        it('should write a message to stdout', () => {
            const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
            cli.write("Test message");
            expect(spy).toHaveBeenCalledWith("Test message\n");
            spy.mockRestore();
        });
    });

    describe('read Method', () => {
        it('should read input from stdin and return it', () => {
            const mockInput = "test input";
            (fs.readSync as jest.Mock).mockImplementation((fd, buffer) => {
                buffer.write(mockInput, 0, "utf8");
                return mockInput.length;
            });

            const result = cli.read("Enter input:");
            expect(result).toBe(mockInput);
        });
    });

    describe('loop Method 1', () => {
        it('should quit the loop when "q" is entered', () => {
            jest.spyOn(cli, 'read').mockReturnValueOnce("q");
            const stepSpy = jest.spyOn(cli.match, 'step').mockImplementation(() => { return false; });
            cli.loop();
            expect(stepSpy).not.toHaveBeenCalled();
        });

        it('should step through the match when "s" is entered', () => {
            jest.spyOn(cli, 'read').mockReturnValueOnce("s").mockReturnValueOnce("q");
            jest.spyOn(cli.match, 'checkCards').mockReturnValueOnce(true)
            const stepSpy = jest.spyOn(cli.match, 'step').mockImplementation(() => { return false; });
            cli.loop();
            expect(stepSpy).toHaveBeenCalledTimes(1);
        });

        it('should run to the end when "r" is entered', () => {
            jest.spyOn(cli, 'read').mockReturnValueOnce("r");
            jest.spyOn(cli.match, 'checkCards').mockReturnValueOnce(true)
            const stepSpy = jest.spyOn(cli.match, 'step').mockImplementation(() => {
                // jest.spyOn(cli.match, 'checkCards').mockReturnValueOnce(false);
                return false;
            });
            cli.loop();
            expect(stepSpy).not.toHaveBeenCalled();
        });

        it('should prompt again for invalid input', () => {
            jest.spyOn(cli, 'read').mockReturnValueOnce("invalid").mockReturnValueOnce("q");
            jest.spyOn(cli.match, 'checkCards').mockReturnValueOnce(true)
            const writeSpy = jest.spyOn(cli, 'write').mockImplementation(() => { });
            cli.loop();
            expect(writeSpy).toHaveBeenCalledWith("Invalid input. Please enter 's', 'q', or 'r'.");
        });
    });

    describe('loop Method 2', () => {
        let readSpy: jest.SpyInstance;
        let writeSpy: jest.SpyInstance;
        let cli: Macchiavelli_CLI;
        let mockMatchInstance: jest.Mocked<Match>;

        beforeEach(() => {
            // Clear all mocks before each test
            jest.clearAllMocks();

            // Create the CLI instance. This will internally create a mocked Match instance
            // because the Match module is mocked.
            cli = new Macchiavelli_CLI();

            // Get the specific mocked Match instance created by the CLI constructor
            // Match constructor is mocked via jest.mock('../Match')
            // We access the first instance created by the mocked constructor
            mockMatchInstance = (Match as jest.MockedClass<typeof Match>).mock.instances[0] as jest.Mocked<Match>;

            // --- Default mock behaviors for Match methods ---
            // Ensure checkCards returns true by default unless overridden in a test
            mockMatchInstance.checkCards.mockReturnValue(true);
            // Ensure step returns false by default unless overridden in a test
            mockMatchInstance.step.mockReturnValue(false);
            // Provide a default toString implementation
            mockMatchInstance.toString.mockReturnValue("Mock Match State");

            // Spy on read and write for loop tests
            readSpy = jest.spyOn(cli, 'read');
            writeSpy = jest.spyOn(cli, 'write').mockImplementation(() => { }); // Suppress output
        });

        afterEach(() => {
            // Restore spies if they were created in beforeEach
            readSpy?.mockRestore();
            writeSpy?.mockRestore();
        });

        it('should quit the loop when "q" is entered', () => {
            readSpy.mockReturnValueOnce("q");
            cli.loop();
            expect(mockMatchInstance.step).not.toHaveBeenCalled();
            expect(readSpy).toHaveBeenCalledTimes(1);
        });

        // --- Test for STEP mode ---
        it('should step through the match when "s" is entered and game is not over', () => {
            readSpy.mockReturnValueOnce("s").mockReturnValueOnce("q"); // Step, then quit
            // step() returns false (default mock behavior) -> game not over
            cli.loop();
            expect(mockMatchInstance.step).toHaveBeenCalledTimes(1);
            expect(writeSpy).not.toHaveBeenCalledWith("Game over!"); // Verify game over message NOT written
            expect(readSpy).toHaveBeenCalledTimes(2); // Called for 's' and 'q'
        });

        it('should write "Game over!" and return when "s" is entered and step() returns true', () => {
            readSpy.mockReturnValueOnce("s"); // Only need 's' input
            mockMatchInstance.step.mockReturnValueOnce(true); // Simulate game over

            cli.loop();

            expect(mockMatchInstance.step).toHaveBeenCalledTimes(1);
            expect(writeSpy).toHaveBeenCalledWith("Game over!"); // Verify game over message IS written
            expect(readSpy).toHaveBeenCalledTimes(1); // Only called once for 's'
            // Verify loop terminated (e.g., read wasn't called again asking for 'q')
        });

        // --- Test for RUN mode ---
        it('should run steps until checkCards is false when "r" is entered', () => {
            readSpy.mockReturnValueOnce("r"); // Enter run mode
            // Simulate checkCards becoming false after a few steps
            mockMatchInstance.checkCards
                .mockReturnValueOnce(true) // First check in loop
                .mockReturnValueOnce(true) // Check before first run step
                .mockReturnValueOnce(true) // Check before second run step
                .mockReturnValueOnce(false); // Check before third run step -> loop terminates

            cli.loop();

            expect(mockMatchInstance.step).toHaveBeenCalledTimes(2); // Called twice in run mode
            expect(writeSpy).not.toHaveBeenCalledWith("Game over!"); // step() returned false
            expect(readSpy).toHaveBeenCalledTimes(1); // Only called once for 'r'
        });

        it('should write "Game over!" and return when in RUN mode and step() returns true', () => {
            readSpy.mockReturnValueOnce("r"); // Enter run mode
            // Simulate step returning true after a couple of iterations
            mockMatchInstance.checkCards.mockReturnValue(true); // Always true for this test
            mockMatchInstance.step
                .mockReturnValueOnce(false) // First run step
                .mockReturnValueOnce(false) // Second run step
                .mockReturnValueOnce(true);  // Third run step -> game over

            cli.loop();

            expect(mockMatchInstance.step).toHaveBeenCalledTimes(3); // Called until game over
            expect(writeSpy).toHaveBeenCalledWith("Game over!"); // Verify game over message IS written
            expect(readSpy).toHaveBeenCalledTimes(1); // Only called once for 'r'
        });


        it('should prompt again for invalid input', () => {
            readSpy.mockReturnValueOnce("invalid").mockReturnValueOnce("q"); // Invalid, then quit
            cli.loop();
            expect(writeSpy).toHaveBeenCalledWith("Invalid input. Please enter 's', 'q', or 'r'.");
            expect(readSpy).toHaveBeenCalledTimes(2);
            expect(mockMatchInstance.step).not.toHaveBeenCalled();
        });
    });

    describe('main Method', () => {
        it('should call loop and print the match state', () => {
            const loopSpy = jest.spyOn(cli, 'loop').mockImplementation(() => { });
            const toStringSpy = jest.spyOn(cli.match, 'toString').mockReturnValue("Match State");
            const writeSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

            cli.main();

            expect(loopSpy).toHaveBeenCalled();
            expect(toStringSpy).toHaveBeenCalled();
            expect(writeSpy).toHaveBeenCalledWith("Match State");
        });
    });
});