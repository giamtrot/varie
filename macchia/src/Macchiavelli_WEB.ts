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
    res.sendFile(path.join(__dirname, "../html/console.html"));
});

app.get("/start", (req: Request, res: Response) => {
    const ris = match.toJSON();
    // console.log(ris)
    res.json(ris)
});

// Handle user input from the web page
app.post("/input", (req: Request, res: Response) => {
    const userInput: string = req.body.input;
    console.log(`User input received: ${userInput}`);

    // Process the input and send a response
    let responseMessage: string;
    const answer = userInput.trim().toLowerCase();
    switch (answer) {
        case "s":
            responseMessage = "Step executed.";
            break;
        case "q":
            responseMessage = "Quit.";
            break;
        case "r":
            responseMessage = "Run to end.";
            break;
        default:
            responseMessage = "Invalid input. Please enter 's', 'q', or 'r'.";
    }

    res.json({ message: responseMessage });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

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
