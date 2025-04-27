import * as fs from "fs";
import { Macchiavelli_CLI } from '../Macchiavelli_CLI';
import { Match } from '../Match';
import { Players } from '../Players';
import { Decks } from '../Decks';
import { Desk } from '../Desk';

jest.mock("fs");

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

    describe('loop Method', () => {
        it('should quit the loop when "q" is entered', () => {
            jest.spyOn(cli, 'read').mockReturnValueOnce("q");
            const stepSpy = jest.spyOn(cli.match, 'step').mockImplementation(() => { });
            cli.loop();
            expect(stepSpy).not.toHaveBeenCalled();
        });

        it('should step through the match when "s" is entered', () => {
            jest.spyOn(cli, 'read').mockReturnValueOnce("s").mockReturnValueOnce("q");
            const stepSpy = jest.spyOn(cli.match, 'step').mockImplementation(() => { });
            cli.loop();
            expect(stepSpy).toHaveBeenCalledTimes(1);
        });

        it('should run to the end when "r" is entered', () => {
            jest.spyOn(cli, 'read').mockReturnValueOnce("r");
            const stepSpy = jest.spyOn(cli.match, 'step').mockImplementation(() => {
                jest.spyOn(cli.match, 'checkCards').mockReturnValueOnce(false);
            });
            cli.loop();
            expect(stepSpy).toHaveBeenCalled();
        });

        it('should prompt again for invalid input', () => {
            jest.spyOn(cli, 'read').mockReturnValueOnce("invalid").mockReturnValueOnce("q");
            const writeSpy = jest.spyOn(cli, 'write').mockImplementation(() => { });
            cli.loop();
            expect(writeSpy).toHaveBeenCalledWith("Invalid input. Please enter 's', 'q', or 'r'.");
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