jest.mock("fs");
import * as fs from "fs";
import { Match } from '../Match';
import { Players } from '../Players';
import { Decks } from '../Decks';
import { Desk } from '../Desk';
import { ReadSyncOptions } from "fs";

describe('Match Class', () => {

    it('should initialize Match with given players, decks, and desk', () => {
        const mockPlayers = jest.fn() as unknown as Players;
        const mockDecks = jest.fn() as unknown as Decks;
        const mockDesk = jest.fn() as unknown as Desk;

        const match = new Match(mockPlayers, mockDecks, mockDesk);

        expect(match).toBeInstanceOf(Match);
        expect((match as any).players).toBe(mockPlayers);
        expect((match as any).decks).toBe(mockDecks);
        expect((match as any).desk).toBe(mockDesk);
    });


    describe('canContinue Method', () => {
        it('should return false when noInteraction is true and decks have no next card', () => {
            const mockPlayers = jest.fn() as unknown as Players;
            const mockDecks = { hasNext: jest.fn().mockReturnValue(false) } as unknown as Decks;
            const mockDesk = jest.fn() as unknown as Desk;

            const match = new Match(mockPlayers, mockDecks, mockDesk);
            (match as any).noInteraction = true;

            expect(match.canContinue()).toBe(false);
        });

        it('should return true when noInteraction is true and decks have next card', () => {
            const mockPlayers = jest.fn() as unknown as Players;
            const mockDecks = { hasNext: jest.fn().mockReturnValue(true) } as unknown as Decks;
            const mockDesk = jest.fn() as unknown as Desk;

            const match = new Match(mockPlayers, mockDecks, mockDesk);
            (match as any).noInteraction = true;

            expect(match.canContinue()).toBe(true);
        });

        it('should return false when user inputs "q"', () => {
            const mockPlayers = jest.fn() as unknown as Players;
            const mockDecks = { hasNext: jest.fn().mockReturnValue(true) } as unknown as Decks;
            const mockDesk = jest.fn() as unknown as Desk;

            const match = new Match(mockPlayers, mockDecks, mockDesk);
            jest.spyOn(match as any, 'read').mockReturnValue('q');

            expect(match.canContinue()).toBe(false);
        });

        it('should set noInteraction to true and return true when user inputs "r" and decks have next card', () => {
            const mockPlayers = jest.fn() as unknown as Players;
            const mockDecks = { hasNext: jest.fn().mockReturnValue(true) } as unknown as Decks;
            const mockDesk = jest.fn() as unknown as Desk;

            const match = new Match(mockPlayers, mockDecks, mockDesk);
            jest.spyOn(match as any, 'read').mockReturnValue('r');

            expect(match.canContinue()).toBe(true);
            expect((match as any).noInteraction).toBe(true);
        });

        it('should return true when user inputs "s" and decks have next card', () => {
            const mockPlayers = jest.fn() as unknown as Players;
            const mockDecks = { hasNext: jest.fn().mockReturnValue(true) } as unknown as Decks;
            const mockDesk = jest.fn() as unknown as Desk;

            const match = new Match(mockPlayers, mockDecks, mockDesk);
            jest.spyOn(match as any, 'read').mockReturnValue('s');

            expect(match.canContinue()).toBe(true);
        });

        it('should prompt again when user inputs invalid option', () => {
            const mockPlayers = jest.fn() as unknown as Players;
            const mockDecks = { hasNext: jest.fn().mockReturnValue(true) } as unknown as Decks;
            const mockDesk = jest.fn() as unknown as Desk;

            const match = new Match(mockPlayers, mockDecks, mockDesk);
            const readSpy = jest.spyOn(match as any, 'read').mockReturnValueOnce('invalid').mockReturnValueOnce('q');
            const writeSpy = jest.spyOn(match as any, 'write').mockImplementation();

            expect(match.canContinue()).toBe(false);
            expect(readSpy).toHaveBeenCalledTimes(2);
            expect(writeSpy).toHaveBeenCalledWith("Invalid input. Please enter 's', 'q', or 'r'.");
        });
    });

    describe('toString Method', () => {
        it('should return a string representation of the match state', () => {
            const mockPlayers = { toString: jest.fn().mockReturnValue("Players Info") } as unknown as Players;
            const mockDecks = { toString: jest.fn().mockReturnValue("Decks Info") } as unknown as Decks;
            const mockDesk = { toString: jest.fn().mockReturnValue("Desk Info") } as unknown as Desk;

            const match = new Match(mockPlayers, mockDecks, mockDesk);

            const result = match.toString();

            expect(result).toBe(`Match State:
        Players:
Players Info
        Decks: Decks Info
        Desk: Desk Info`);
        });
    });

    describe('write Method', () => {
        it('should write the given message to stdout with a newline', () => {
            const mockPlayers = jest.fn() as unknown as Players;
            const mockDecks = jest.fn() as unknown as Decks;
            const mockDesk = jest.fn() as unknown as Desk;

            const match = new Match(mockPlayers, mockDecks, mockDesk);
            const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();

            const message = "Test message";
            (match as any).write(message);

            expect(stdoutSpy).toHaveBeenCalledWith(message + "\n");
            stdoutSpy.mockRestore();
        });

    });

    describe('read Method', () => {
        it('should read input from stdin and return the trimmed, lowercase value', () => {
            const mockPlayers = jest.fn() as unknown as Players;
            const mockDecks = jest.fn() as unknown as Decks;
            const mockDesk = jest.fn() as unknown as Desk;

            const match = new Match(mockPlayers, mockDecks, mockDesk);
            const buffer = Buffer.from("Test Input\n");
            jest.spyOn(fs, 'readSync').mockImplementation((fd, buf) => {
                const uint8Array = new Uint8Array(buf.buffer);
                buffer.copy(uint8Array);
                return buffer.length;
            });
            const writeSpy = jest.spyOn(match as any, 'write').mockImplementation();

            const result = (match as any).read("Enter input:");

            expect(writeSpy).toHaveBeenCalledWith("Enter input:");
            expect(result).toBe("test input");
        });
    });
});
    