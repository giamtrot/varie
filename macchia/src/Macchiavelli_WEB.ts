import express, { Request, Response } from "express";
import session from 'express-session';
import path from "path";
import bodyParser from "body-parser";
import { Decks } from "./Decks";
import { Player, Players } from "./Players";
import { Desk } from "./Desk";
import { Match } from "./Match";

// Extend the session data to include the 'match' property
declare module 'express-session' {
    interface SessionData {
        match?: Match;
    }
}

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.use(session({
    secret: 'my-super-secret-key', // move to env var in real apps
    resave: false,                   // don't save session if unmodified
    saveUninitialized: true,         // don't create session until something stored
    cookie: {
        maxAge: 1000 * 60 * 60,         // 1 hour
        httpOnly: true,                 // prevents JS access to cookies
        secure: false                   // set true if HTTPS
    }
}));

declare global {
    namespace Express {
        interface Request {
            match: Match;
        }
    }
}
const matches: Map<string, Match> = new Map();
app.use((req: Request, res: Response, next) => {
    // console.log(req.session)
    // console.log(req.sessionID)
    if (!matches.has(req.sessionID)) {
        matches.set(req.sessionID, initMatch());
    }

    req.match = matches.get(req.sessionID) as Match;
    next();
});


// Serve the HTML page
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../html/Macchiavelli.html"));
});

app.get("/start", (req: Request, res: Response) => {
    sendStatus(res, req.match, "step");
});

// Handle user input from the web page
app.post("/input", (req: Request, res: Response) => {
    const userInput: string = req.body.input;
    console.log(`User input received: ${userInput}`);

    const match = req.match

    // Process the input and send a response
    const answer = userInput.trim().toLowerCase();
    switch (answer) {
        case "step":
            const gameOver = match.step()
            sendStatus(res, match, match.checkCards() ? "step" : "ended");
            break;
        case "run":
            match.step()
            sendStatus(res, match, match.checkCards() ? "run" : "ended");
            break;
        default:
            throw Error(`Invalid input: ${answer}`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

function sendStatus(res: express.Response<any, Record<string, any>>, match: Match, status: string) {
    console.log(status)
    res.json({ status: status, info: match.toJSON() });
}

function initMatch(): Match {

    const playersNumber = 5
    let ps: Player[] = [];
    for (let p = 1; p <= playersNumber; p++) {
        ps.push(new Player("Player " + p))
    }
    const players = new Players(ps)

    return new Match(players, { decksNumber: 2 })
}
