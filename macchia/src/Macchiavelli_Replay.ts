import { Players } from './Players';
import { Player } from './Player';
import { Match, STATUS_TYPE } from './Match';
import { Decks } from './Decks';
import assert from 'assert';
import { Desk } from './Desk';
import { WorkingDesk } from './WorkingDesk';
import { Card } from './Card';

class Macchiavelli_Replay {

    private match: Match;
    private breakStep;

    constructor(playersNumber: number, desc: string, breakStep: number) {
        let ps: Player[] = [];
        for (let p = 1; p <= playersNumber; p++) {
            ps.push(new Player("Player " + p))
        }
        const players = new Players(ps)
        const decks = Decks.fromString(desc)
        this.match = new Match(players, { decks: decks })
        this.breakStep = breakStep
        return this
    }

    replay() {
        try {
            while (true) {
                const stepStatus = this.match.step()

                stepStatus.messages.forEach(msg => {
                    console.log(msg)
                });
                console.log(this.match.toString())

                if (stepStatus.type == STATUS_TYPE.GAME_OVER) {
                    break
                }
            }
        } catch (e) {
            console.log(e)
            console.log(this.match.toString())
        }
    }
}

const desc = "(11C)(11D)(12C)(7C)(13D)(9S)(6C)(6S)(12H)(1C)(3D)(3C)(13C)(13C)(12S)(11S)(12H)(12S)(7C)(10D)(11C)(7S)(8C)(5S)(9H)(11H)(2H)(4S)(2C)(1H)(4D)(12D)(2C)(2H)(2S)(12C)(6H)(1C)(4H)(3S)(5S)(11H)(8H)(3C)(9C)(3D)(8D)(5C)(7H)(1S)(7S)(8D)(11S)(9D)(13S)(9D)(5C)(5D)(10C)(5D)(7D)(6S)(6H)(3S)(8H)(7D)(10H)(6C)(2D)(3H)(13H)(10H)(9C)(4H)(6D)(10C)(11D)(4C)(13D)(13S)(9H)(4S)(10S)(10S)(3H)(4C)(8C)(10D)(8S)(1D)(2D)(7H)(1S)(13H)(8S)(5H)(9S)(5H)(1D)(2S)(1H)(4D)(6D)(12D)"
const playersNumber = 5
const breakStep = 100
// new Macchiavelli_Replay(playersNumber, desc, breakStep).replay()

const deskDescs = [
    // "(1D)(10D)(11D)(12D)(13D)",
    // "(6S)(6H)(6D)(6C) (1D)(10D)(11D)(12D)(13D)",
    // "(6S)(6H)(6D)(6C) (7H)(8H)(9H) (1D)(+10D)(11D)(12D)(13D)",
    // "(6S)(6H)(6D)(6C) (7H)(8H)(9H) (1D)(2D)(3D)(4D) (1D)(10D)(11D)(12D)(13D)",
    "(6S)(6H)(6D)(6C) (7H)(8H)(9H) (1D)(2D)(3D)(4D) (1D)(10D)(11D)(12D)(13D) (3H)(4H)(5H)(6H)",
    // "(6S)(6H)(6D)(6C) (7H)(8H)(9H) (1D)(2D)(3D)(4D) (1D)(10D)(11D)(12D)(13D) (3H)(4H)(5H)(6H) (8S)(8D)(8C)",
    // "(6S)(6H)(6D)(6C) (7H)(8H)(9H) (1D)(2D)(3D)(4D) (1D)(10D)(11D)(12D)(13D) (3H)(4H)(5H)(6H) (8S)(8D)(8C) (7S)(7H)(7C)",
    // "(6S)(6H)(6D)(6C) (7H)(8H)(9H) (1D)(2D)(3D)(4D) (1D)(10D)(11D)(12D)(13D) (3H)(4H)(5H)(6H) (8S)(8D)(8C) (2S)(3S)(4S) (7S)(7H)(7C)",
]
const cardDesc = "2D"
// const deskDesc = "(1D)(10D)(11D)(12D)(13D) (6S)(6H)(6D)(6C)"
// const deskDesc = "(7S)(8S)(9S) (7H)(8H)(9H) (7C)(8C)(9C) (10H)(10D)(10C)"
// const deskDesc = "(1D)(2D)(3D)(4D)(10D)(11D)(12D)(13D)"
// const deskDesc = "(10D)(11D)(12D)(13D)"
// const deskDesc = "(6S)(6H)(6D)(6C)"
// const cardDesc = "7D"
// const cardDesc = "10S"

deskDescs.forEach(deskDesc => {

    // base 
    console.log("BASE ----------")
    reply(deskDesc, false, false);
    console.log("BASE ----------")

    // cache 
    console.log("CACHE----------")
    reply(deskDesc, false, true);
    console.log("CACHE----------")

    // pivot 
    console.log("PIVOT----------")
    reply(deskDesc, true, true);
    console.log("PIVOT----------")

})

function reply(deskDesc: string, pivotCard: boolean, cachePath: boolean) {
    const desk = Desk.fromString(deskDesc);
    const wd = new WorkingDesk(desk);

    // console.log("before hand", wd.hand.toString());
    console.log("before desk", desk.toString());
    let addedCard: Card | undefined = Card.of(cardDesc);
    if (!pivotCard) {
        wd.add(addedCard);
        addedCard = undefined
    }
    const ris = wd.searchNewCombos(addedCard, cachePath);
    // console.log("after hand", wd.hand.toString());
    console.log("after desk", ris.length);
    ris.forEach(c => console.log(c.toString()));
}
