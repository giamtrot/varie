import { Player, Players } from './Players';
import { Decks } from './Decks';
import { Desk } from './Desk';
import { Match } from './Match';
import * as fs from "fs";


enum LOOP_STATUS {
    STEP,
    RUN
}

export class Macchiavelli_CLI {

    match: Match;

    constructor() {
        const playersNumber = 5
        let ps: Player[] = [];
        for (let p = 1; p <= playersNumber; p++) {
            ps.push(new Player("Player " + p))
        }
        const players = new Players(ps)

        this.match = new Match(players, 2)
    }

    main() {
        this.loop()
        console.log(this.match.toString())
    }

    read(msg: string) {
        this.write(msg)
        const buffer = Buffer.alloc(1024);
        const bytesRead = fs.readSync(process.stdin.fd, buffer);
        const answer = buffer.toString("utf8", 0, bytesRead).trim().toLowerCase();
        return answer;
    }

    write(msg: string) {
        process.stdout.write(msg + "\n");
    }


    loop() {
        let loop_status = LOOP_STATUS.STEP
        while (true) {
            if (!this.match.checkCards()) {
                return
            }

            if (loop_status == LOOP_STATUS.RUN) {
                this.match.step()
                continue
            }

            if (loop_status == LOOP_STATUS.STEP) {
                let answer = this.read("S: step, Q: quit or R: run to end?")
                console.log(`answer: ${answer}`)

                switch (answer.trim().toLowerCase()) {
                    case "q":
                        return
                    case "s":
                        this.match.step()
                        break
                    case "r":
                        loop_status = LOOP_STATUS.RUN
                        break;
                    default:
                        this.write("Invalid input. Please enter 's', 'q', or 'r'.");
                }
            }
        }
    }
}


if (process.env.NODE_ENV !== 'test') {
    new Macchiavelli_CLI().main()
}

