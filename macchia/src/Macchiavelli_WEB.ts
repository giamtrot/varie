import express, { Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import { Decks } from "./Decks";
import { Player, Players } from "./Players";
import { Desk } from "./Desk";
import { Match } from "./Match";

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

const match = initMatch()

// Serve the HTML page
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../html/Macchiavelli.html"));
});

app.get("/start", (req: Request, res: Response) => {
    status(res);
});

// Handle user input from the web page
app.post("/input", (req: Request, res: Response) => {
    const userInput: string = req.body.input;
    console.log(`User input received: ${userInput}`);

    // Process the input and send a response
    let responseMessage: string;
    const answer = userInput.trim().toLowerCase();
    switch (answer) {
        case "step":
            match.step()
            status(res);
            break;
        case "run":
            break;
        default:
            responseMessage = "Invalid input. Please enter 's', 'q', or 'r'.";
            // do nothing
            res.json({ message: "" });
    }

    
});

// loop() {
//     let loop_status = LOOP_STATUS.STEP
//     while (true) {
//         if (!this.match.checkCards()) {
//             return
//         }

//         if (loop_status == LOOP_STATUS.RUN) {
//             this.match.step()
//             continue
//         }

//         if (loop_status == LOOP_STATUS.STEP) {
//             let answer = this.read("S: step, Q: quit or R: run to end?")
//             console.log(`answer: ${answer}`)

//             switch (answer.trim().toLowerCase()) {
//                 case "q":
//                     return 
//                 case "s":
//                     this.match.step()
//                     break
//                 case "r":
//                     loop_status = LOOP_STATUS.RUN
//                     break;
//                 default:
//                     this.write("Invalid input. Please enter 's', 'q', or 'r'.");
//             }
//         }
//     }
// }

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

function status(res: express.Response<any, Record<string, any>>) {
    res.json(match.toJSON());
}

function initMatch(): Match {
    const decks: Decks = new Decks(2).shuffle();

    const playersNumber = 5
    let ps: Player[] = [];

    for (let p = 1; p <= playersNumber; p++) {
        ps.push(new Player("Player " + p))
    }

    const players = new Players(ps)

    decks.distribute(players.players, 13);
    const desk: Desk = new Desk()

    return new Match(players, decks, desk)
}
