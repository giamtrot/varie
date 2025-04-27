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

});
    