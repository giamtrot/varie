import * as fs from "fs";
import { Match } from '../Match';
import { Macchiavelli_Replay } from "../Macchiavelli_Replay";


describe('Macchiavelli_Replay', () => {

    let reply: Macchiavelli_Replay;

    beforeEach(() => {
        reply = new Macchiavelli_Replay();
    });

    it('replay', () => {
        const playersNumber = 5
        const desc = "(11C)(11D)(12C)(7C)(13D)(9S)(6C)(6S)(12H)(1C)(3D)(3C)(13C)(13C)(12S)(11S)(12H)(12S)(7C)(10D)(11C)(7S)(8C)(5S)(9H)(11H)(2H)(4S)(2C)(1H)(4D)(12D)(2C)(2H)(2S)(12C)(6H)(1C)(4H)(3S)(5S)(11H)(8H)(3C)(9C)(3D)(8D)(5C)(7H)(1S)(7S)(8D)(11S)(9D)(13S)(9D)(5C)(5D)(10C)(5D)(7D)(6S)(6H)(3S)(8H)(7D)(10H)(6C)(2D)(3H)(13H)(10H)(9C)(4H)(6D)(10C)(11D)(4C)(13D)(13S)(9H)(4S)(10S)(10S)(3H)(4C)(8C)(10D)(8S)(1D)(2D)(7H)(1S)(13H)(8S)(5H)(9S)(5H)(1D)(2S)(1H)(4D)(6D)(12D)"
        // new Macchiavelli_Replay().init(playersNumber, desc).replay()
    });
});