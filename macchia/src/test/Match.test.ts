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

        const match = new Match(mockPlayers, 2);

        expect(match).toBeInstanceOf(Match);
        expect((match as any).players).toBe(mockPlayers);
    });


    describe('toString Method', () => {
        it('should return a string representation of the match state', () => {
            const mockPlayers = { toString: jest.fn().mockReturnValue("Players Info") } as unknown as Players;

            const match = new Match(mockPlayers, 2);

            const result = match.toString();

            expect(result).toBe(`Match State:
    Players:
Players Info
    Decks: Decks Info
    Desk: Desk Info`);
        });
    });

    describe('toJSON Method', () => {
        it('should return a JSON representation of the match state', () => {
            const mockPlayers = { toJSON: jest.fn().mockReturnValue({ players: "Players JSON" }) } as unknown as Players;

            const match = new Match(mockPlayers, 0);

            const result = match.toJSON();

            expect(result).toEqual({
                match: {
                    players: { players: "Players JSON" },
                    decks: { decks: "Decks JSON" },
                    desk: { desk: "Desk JSON" },
                }
            });

            expect(mockPlayers.toJSON).toHaveBeenCalled();
        });
    });

    describe('checkCards Method', () => {
        it('should return true if the deck has more cards', () => {
            const mockPlayers = jest.fn() as unknown as Players;

            const match = new Match(mockPlayers, 2);

            const result = match.checkCards();

            expect(result).toBe(true);
        });

        it('should return false if the deck has no more cards', () => {
            const mockPlayers = jest.fn() as unknown as Players;
            const mockDecks = { hasNext: jest.fn().mockReturnValue(false) } as unknown as Decks;
            const mockDesk = jest.fn() as unknown as Desk;

            const match = new Match(mockPlayers, 0);

            const result = match.checkCards();

            expect(result).toBe(false);
            expect(mockDecks.hasNext).toHaveBeenCalled();
        });
    });

});
    