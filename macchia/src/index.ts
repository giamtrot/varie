enum Suit {
    Hearts = "Hearts",
    Diamonds = "Diamonds",
    Clubs = "Clubs",
    Spades = "Spades",
}

class Card {
    value: number;
    suit: Suit;

    constructor(value: number, suit: Suit) {
        this.value = value;
        this.suit = suit;
    }

    toString(): string {
        let symb = "🂱"
        return `${this.value} of ${this.suit} ${symb}`;
    }
}


type Deck = Card[];

const deck: Deck = [];

for (let m = 1; m <= 2; m++) {
    Object.values(Suit).forEach(
        (suit) => {
            for (let i = 1; i <= 13; i++) {
                const card: Card = { value: i, suit };
                deck.push(card);
                // console.log(card);
            }
        }
    )
}

console.log("Deck: " + JSON.stringify(deck))
// Function to randomize the deck
function shuffleDeck(deck: Deck): Deck {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Shuffle the deck
shuffleDeck(deck);

console.log("Shuffled Deck: " + deck[0]);