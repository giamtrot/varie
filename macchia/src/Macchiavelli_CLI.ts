import { Player, Players } from './Players';
import { Status, Match, STATUS_TYPE } from './Match';
import * as fs from "fs";
import { STATUS_CODES } from 'http';

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

        this.match = new Match(players, { decksNumber: 2 })
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
            let stepStatus: Status

            if (loop_status == LOOP_STATUS.RUN) {
                stepStatus = this.match.step()
            } else if (loop_status == LOOP_STATUS.STEP) {
                console.log(this.match.toString())
                let answer = this.read("S: step, Q: quit or R: run to end?")
                console.log(`answer: ${answer}`)

                switch (answer.trim().toLowerCase()) {
                    case "q":
                        return
                    case "s":
                        stepStatus = this.match.step()
                        break
                    case "r":
                        loop_status = LOOP_STATUS.RUN
                        continue;
                    default:
                        this.write("Invalid input. Please enter 's', 'q', or 'r'.");
                        continue
                }
            } else {
                // Not possible to reach here
                /* istanbul ignore next */
                throw Error(`Invalid loop status ${loop_status}`)
            }

            stepStatus.messages.forEach(msg => {
                this.write(msg)
                this.write(this.match.toString())
            });

            if (stepStatus.type == STATUS_TYPE.GAME_OVER) {
                return
            }
        }
    }
}


/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    new Macchiavelli_CLI().main()
}