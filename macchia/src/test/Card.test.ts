import { Suit, Card, Hand, CardSet } from '../Card';
import { Combo, Combos } from '../Combos';
import 'colors';

describe('Card Class', () => {

    describe('Basic Card Creation', () => {
        it('should create a card with valid value and suit', () => {
            Card.count = 0; // Reset the card count for testing
            const card1 = Card.of("1S");
            expect(card1.id).toBe(1); // Assuming this is the first card created
            expect(card1.value).toBe(1);
            expect(card1.suit).toBe(Suit.Spades);
            const card2 = Card.of("3h");
            expect(card2.id).toBe(2);
            expect(card2.value).toBe(3);
            expect(card2.suit).toBe(Suit.Hearts);
        });

        it('should throw an error for invalid card value', () => {
            expect(() => Card.of("0S")).toThrow("Value must be between 1 and 13");
            expect(() => Card.of("14S")).toThrow("Value must be between 1 and 13");
        });

        it('should return the correct Unicode code point for a card', () => {
            const card = Card.of("1S");
            expect(card.code()).toBe(0x1F0A1);
        });

        it('should return the correct string representation of a card', () => {
            const card = Card.of("1H");
            expect(card.toString()).toBe("(1H)".red.bold);
        });

        it('should return true for cards with the same value, suit, and id', () => {
            const card1 = Card.of("1S");
            const card2 = Card.of("1S");
            card2.id = card1.id; // Manually set the same id for testing
            expect(card1.equals(card2)).toBe(true);
        });

        it('should return false for cards with different values', () => {
            const card1 = Card.of("1S");
            const card2 = Card.of("2S");
            expect(card1.equals(card2)).toBe(false);
        });

        it('should return false for cards with different suits', () => {
            const card1 = Card.of("1S");
            const card2 = Card.of("1H");
            expect(card1.equals(card2)).toBe(false);
        });

        it('should return false for cards with different ids', () => {
            const card1 = Card.of("1S");
            const card2 = Card.of("1S");
            expect(card1.equals(card2)).toBe(false);
        });

        it('should return true when comparing a card to itself', () => {
            const card = Card.of("1S");
            expect(card.equals(card)).toBe(true);
        });

        it('should generate a unique id for each card', () => {
            const card1 = Card.of("1S");
            const card2 = Card.of("2H");
            expect(card1.id).not.toBe(card2.id);
        });

        it('should calculate the correct code for a card', () => {
            const card = Card.of("1S");
            expect(card.code()).toBe(0x1F0A1);
        });

        it('should correctly compare two cards for equality', () => {
            const card1 = Card.of("5D");
            const card2 = Card.of("5D");
            const card3 = Card.of("6C");
            expect(card1.equals(card2)).toBe(false); // Different IDs
            expect(card1.equals(card3)).toBe(false);
        });

        it('should correctly identify a horizontal match', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            expect(card1.isHorizontalMatch(card2)).toBe(true);
        });

        it('should correctly identify a vertical match', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            expect(card1.isVerticalMatch(card2)).toBe(true);
        });

        it('should correctly identify a vertical match inverted', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            expect(card1.isVerticalMatch(card2)).toBe(true);
        });

        it('should correctly identify a vertical match between Ace and King', () => {
            const card1 = Card.of("1S");
            const card2 = Card.of("13S");
            expect(card1.isVerticalMatch(card2)).toBe(true);
        });


        it('should not identify a horizontal match for cards with the same suit', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5S");
            expect(card1.isHorizontalMatch(card2)).toBe(false);
        });

        it('should not identify a horizontal match for cards with different values', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5S");
            expect(card1.isHorizontalMatch(card2)).toBe(false);
        });

        it('should not identify a vertical match for cards with different suits', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6H");
            expect(card1.isVerticalMatch(card2)).toBe(false);
        });

        it('should not identify a vertical match for cards with two number or more of difference', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("8S");
            expect(card1.isVerticalMatch(card2)).toBe(false);
        });
    });

    describe('Card.follows', () => {
        it('should return true if the card follows another card in sequence', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            expect(card2.follows(card1)).toBe(true);
        });

        it('should return true if the card is an Ace and follows a King', () => {
            const card1 = Card.of("13S"); // King
            const card2 = Card.of("1S"); // Ace
            expect(card2.follows(card1)).toBe(true);
        });

        it('should return false if the card does not follow another card in sequence', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("7S");
            expect(card2.follows(card1)).toBe(false);
        });

        it('should return false if the card is of a different suit', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6H");
            expect(card2.follows(card1)).toBe(false);
        });
    });

    describe('Card.sameSuit', () => {
        it('should return true if two cards have the same suit', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            expect(card1.sameSuit(card2)).toBe(true);
        });

        it('should return false if two cards have different suits', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6H");
            expect(card1.sameSuit(card2)).toBe(false);
        });
    });

    describe('Card.sameValue', () => {
        it('should return true if two cards have the same value', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            expect(card1.sameValue(card2)).toBe(true);
        });

        it('should return false if two cards have different values', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            expect(card1.sameValue(card2)).toBe(false);
        });
    });

    describe('Card.cardSorter', () => {
        it('should sort cards by value first', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("3H");
            const card3 = Card.of("7D");
            const cards = [card1, card2, card3];
            cards.sort(Card.cardSorter);
            expect(cards).toEqual([card2, card1, card3]);
        });

        it('should sort cards by suit index if values are the same', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            const card3 = Card.of("5D");
            const cards = [card1, card2, card3];
            cards.sort(Card.cardSorter);
            expect(cards).toEqual([card1, card2, card3]);
        });
    });

    describe('Card.toJSON', () => {
        it('should return the correct JSON representation for a red card', () => {
            const card = Card.of("1H"); // Ace of Hearts
            const expectedJSON = { char: "🂱", color: "Red" };
            expect(card.toJSON()).toEqual(expectedJSON);
        });

        it('should return the correct JSON representation for a black card', () => {
            const card = Card.of("1S"); // Ace of Spades
            const expectedJSON = { char: "🂡", color: "Black" };
            expect(card.toJSON()).toEqual(expectedJSON);
        });

        it('should return the correct JSON representation for a card with a value of 10', () => {
            const card = Card.of("10D"); // 10 of Diamonds
            const expectedJSON = { char: "🃊", color: "Red" };
            expect(card.toJSON()).toEqual(expectedJSON);
        });

        it('should return the correct JSON representation for a King card', () => {
            const card = Card.of("13C"); // King of Clubs
            const expectedJSON = { char: "🃞", color: "Black" };
            expect(card.toJSON()).toEqual(expectedJSON);
        });
    });

    describe('Card suitFromString', () => {
        describe('suitFromString', () => {
            it('should return Suit.Spades for "S"', () => {
                expect(Card.suitFromString("S")).toBe(Suit.Spades);
            });

            it('should return Suit.Spades for "s"', () => {
                expect(Card.suitFromString("s")).toBe(Suit.Spades);
            });

            it('should return Suit.Hearts for "H"', () => {
                expect(Card.suitFromString("H")).toBe(Suit.Hearts);
            });

            it('should return Suit.Hearts for "h"', () => {
                expect(Card.suitFromString("h")).toBe(Suit.Hearts);
            });

            it('should return Suit.Diamonds for "D"', () => {
                expect(Card.suitFromString("D")).toBe(Suit.Diamonds);
            });

            it('should return Suit.Diamonds for "d"', () => {
                expect(Card.suitFromString("d")).toBe(Suit.Diamonds);
            });

            it('should return Suit.Clubs for "C"', () => {
                expect(Card.suitFromString("C")).toBe(Suit.Clubs);
            });

            it('should return Suit.Clubs for "c"', () => {
                expect(Card.suitFromString("c")).toBe(Suit.Clubs);
            });

            it('should throw an error for an invalid single character', () => {
                expect(() => Card.suitFromString("X")).toThrow("Invalid suit description: X");
            });

            it('should throw an error for an empty string', () => {
                expect(() => Card.suitFromString("")).toThrow("Invalid suit description: ");
            });

            it('should throw an error for a multi-character string', () => {
                expect(() => Card.suitFromString("Spades")).toThrow("Invalid suit description: Spades");
            });

            it('should throw an error for a number string', () => {
                expect(() => Card.suitFromString("1")).toThrow("Invalid suit description: 1");
            });
        });
    });

    describe('Card.same', () => {
        let card5S_1: Card;
        let card5S_2: Card;
        let card5H: Card;
        let card6S: Card;
        let card7H: Card;

        beforeEach(() => {
            // Create fresh card instances for each test to ensure distinct IDs
            card5S_1 = Card.of("5S");
            card5S_2 = Card.of("5S");
            card5H = Card.of("5H");
            card6S = Card.of("6S");
            card7H = Card.of("7H");
        });

        it('should return true for two different instances with the same suit and value', () => {
            // Even though IDs are different, suit and value match
            expect(card5S_1.id).not.toBe(card5S_2.id);
            expect(card5S_1.same(card5S_2)).toBe(true);
            expect(card5S_2.same(card5S_1)).toBe(true); // Check commutativity
        });

        it('should return true when comparing a card to itself', () => {
            expect(card5S_1.same(card5S_1)).toBe(true);
        });

        it('should return false for cards with the same value but different suits', () => {
            expect(card5S_1.same(card5H)).toBe(false);
            expect(card5H.same(card5S_1)).toBe(false);
        });

        it('should return false for cards with the same suit but different values', () => {
            expect(card5S_1.same(card6S)).toBe(false);
            expect(card6S.same(card5S_1)).toBe(false);
        });

        it('should return false for cards with different suits and different values', () => {
            expect(card5S_1.same(card7H)).toBe(false);
            expect(card7H.same(card5S_1)).toBe(false);
        });
    });
});

describe('Hand Class', () => {

    describe('Hand.relate and unrelate', () => {

        it('should unlink a vertical relationship between two cards', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            const hand = new Hand();
            hand.linkVertical(card1, card2);

            hand.unlinkVertical(card1, card2);
            expect(hand.getVerticals(card1).contains(card2)).toBe(false);
            expect(hand.getVerticals(card2).contains(card1)).toBe(false);
        });

        it('should throw an error if the cards are not vertically linked', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6H");
            const hand = new Hand();
            expect(() => hand.unlinkVertical(card1, card2)).toThrow(
                `Card ${card2} not vertically linked to ${card1} or viceversa`
            );
        });

        it('should add a horizontal match correctly', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            const hand = new Hand();
            hand.linkHorizontal(card1, card2);
            expect(hand.getHorizontals(card1).contains(card2)).toBe(true);
            expect(hand.getHorizontals(card2).contains(card1)).toBe(true);
        });

        it('should add a vertical match correctly', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            const hand = new Hand();
            hand.linkVertical(card1, card2);
            expect(hand.getVerticals(card1).contains(card2)).toBe(true);
            expect(hand.getVerticals(card2).contains(card1)).toBe(true);
        });

        it('should unlink a horizontal relationship between two cards', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            const hand = new Hand();
            hand.linkHorizontal(card1, card2);

            hand.unlinkHorizontal(card1, card2);

            expect(hand.getHorizontals(card1).contains(card2)).toBe(false);
            expect(hand.getHorizontals(card2).contains(card1)).toBe(false);
        });

        it('should throw an error if the cards are not horizontally linked', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            const hand = new Hand();
            expect(() => hand.unlinkHorizontal(card1, card2)).toThrow(
                `Card ${card2} not horizontally linked to ${card1} or viceversa`
            );
        });

        it('should link cards horizontally if they have the same value but different suits', () => {
            const card1 = Card.of("5H");
            const card2 = Card.of("5S");

            const hand = new Hand();
            hand.relate(card1, card2);
            expect(hand.getHorizontals(card1).contains(card2)).toBe(true);
            expect(hand.getHorizontals(card2).contains(card1)).toBe(true);
        });

        it('should link cards vertically if they have the same suit and consecutive values', () => {
            const card1 = Card.of("5H");
            const card2 = Card.of("6H");

            const hand = new Hand();
            hand.relate(card1, card2);

            expect(hand.getVerticals(card1).contains(card2)).toBe(true);
            expect(hand.getVerticals(card2).contains(card1)).toBe(true);
        });

        it('should link cards vertically if they have the same suit and wrap-around values (Ace and King)', () => {
            const card1 = Card.of("1S"); // Ace of Spades
            const card2 = Card.of("13S"); // King of Spades

            const hand = new Hand();
            hand.relate(card1, card2);

            expect(hand.getVerticals(card1).contains(card2)).toBe(true);
            expect(hand.getVerticals(card2).contains(card1)).toBe(true);
        });

        it('should not link cards horizontally if they have the same suit', () => {
            const card1 = Card.of("5H");
            const card2 = Card.of("5H");

            const hand = new Hand();
            hand.relate(card1, card2);
            expect(hand.getHorizontals(card1).contains(card2)).toBe(false);
            expect(hand.getHorizontals(card2).contains(card1)).toBe(false);
        });

        it('should not link cards vertically if they have different suits', () => {
            const card1 = Card.of("5H");
            const card2 = Card.of("6S");

            const hand = new Hand();
            hand.relate(card1, card2);

            expect(hand.getVerticals(card1).contains(card2)).toBe(false);
            expect(hand.getVerticals(card2).contains(card1)).toBe(false);
        });

        it('should not link cards horizontally or vertically if they do not match any criteria', () => {
            const card1 = Card.of("5H");
            const card2 = Card.of("7S");

            const hand = new Hand();
            hand.relate(card1, card2);

            expect(hand.getHorizontals(card1).contains(card2)).toBe(false);
            expect(hand.getHorizontals(card2).contains(card1)).toBe(false);
            expect(hand.getVerticals(card1).contains(card2)).toBe(false);
            expect(hand.getVerticals(card2).contains(card1)).toBe(false);
        });

        it('should unlink a horizontal relationship between two cards', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");
            const hand = new Hand();
            hand.relate(card1, card2);

            hand.unrelate(card1, card2);

            expect(hand.getHorizontals(card1).contains(card2)).toBe(false);
            expect(hand.getHorizontals(card2).contains(card1)).toBe(false);
            expect(hand.getVerticals(card1).contains(card2)).toBe(false);
            expect(hand.getVerticals(card2).contains(card1)).toBe(false);
        });

        it('should unlink a vertical relationship between two cards', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6S");
            const hand = new Hand();
            hand.relate(card1, card2);

            hand.unrelate(card1, card2);

            expect(hand.getHorizontals(card1).contains(card2)).toBe(false);
            expect(hand.getHorizontals(card2).contains(card1)).toBe(false);
            expect(hand.getVerticals(card1).contains(card2)).toBe(false);
            expect(hand.getVerticals(card2).contains(card1)).toBe(false);
        });

        it('should throw an error if the cards are not linked', () => {
            const card1 = Card.of("5S");
            const card2 = Card.of("6H");
            const hand = new Hand();

            expect(() => hand.unrelate(card1, card2)).toThrow(
                `Card ${card2} not linked to ${card1}`
            );
        });
    });

    describe('Hand.clone', () => {
        let hand: Hand;
        let card1: Card, card2: Card, card3: Card, card4: Card, card5: Card;
        let combo1: Combo, combo2: Combo;

        beforeEach(() => {
            hand = new Hand();
            card1 = Card.of("5S");
            card2 = Card.of("5H");
            card3 = Card.of("5D");
            card4 = Card.of("6S");
            card5 = Card.of("7S");

            // Add cards and establish relationships
            hand.push(card1); // 5S
            hand.push(card2); // 5H (H with 5S)
            hand.push(card3); // 5D (H with 5S, 5H)
            hand.push(card4); // 6S (V with 5S)
            hand.push(card5); // 7S (V with 6S)

            // Hand should now have combos: [5S, 5H, 5D] and [5S, 6S, 7S]
            combo1 = hand.combos.combos.find(c => c.equals(Combo.of("5S 5H 5D")))!;
            combo2 = hand.combos.combos.find(c => c.equals(Combo.of("5S 6S 7S")))!;

            expect(hand.cards.length).toBe(5);
            expect(hand.combos.length).toBe(2);
            expect(hand.getHorizontals(card1).length).toBe(2); // 5H, 5D
            expect(hand.getVerticals(card1).length).toBe(1);   // 6S
            expect(hand.getVerticals(card5).length).toBe(1);   // 6S
        });

        describe('cloneMap (static)', () => {
            let originalMap: Map<Card, CardSet>;
            let cardSet1: CardSet;
            let cardSet2: CardSet;

            beforeEach(() => {
                originalMap = new Map<Card, CardSet>();
                cardSet1 = new CardSet();
                cardSet1.push(card2);
                cardSet1.push(card3);

                cardSet2 = new CardSet();
                cardSet2.push(card1);

                originalMap.set(card1, cardSet1); // card1 -> [card2, card3]
                originalMap.set(card4, cardSet2); // card4 -> [card1]
            });

            it('should return a new Map instance', () => {
                const clonedMap = Hand.cloneMap(originalMap);
                expect(clonedMap).toBeInstanceOf(Map);
                expect(clonedMap).not.toBe(originalMap);
            });

            it('should have the same keys (Card instances) as the original map', () => {
                const clonedMap = Hand.cloneMap(originalMap);
                const originalKeys = Array.from(originalMap.keys());
                const clonedKeys = Array.from(clonedMap.keys());

                expect(clonedKeys).toHaveLength(originalKeys.length);
                expect(clonedKeys).toContain(card1);
                expect(clonedKeys).toContain(card4);
                // Ensure key instances are the same
                expect(clonedKeys.find(k => k.id === card1.id)).toBe(card1);
                expect(clonedKeys.find(k => k.id === card4.id)).toBe(card4);
            });

            it('should have different CardSet instances as values', () => {
                const clonedMap = Hand.cloneMap(originalMap);
                const originalValue1 = originalMap.get(card1);
                const clonedValue1 = clonedMap.get(card1);
                const originalValue2 = originalMap.get(card4);
                const clonedValue2 = clonedMap.get(card4);

                expect(clonedValue1).toBeInstanceOf(CardSet);
                expect(clonedValue1).not.toBe(originalValue1);
                expect(clonedValue2).toBeInstanceOf(CardSet);
                expect(clonedValue2).not.toBe(originalValue2);
            });

            it('should have CardSet values with the same card instances', () => {
                const clonedMap = Hand.cloneMap(originalMap);
                const clonedValue1 = clonedMap.get(card1);
                const clonedValue2 = clonedMap.get(card4);

                expect(clonedValue1?.cards).toHaveLength(2);
                expect(clonedValue1?.contains(card2)).toBe(true);
                expect(clonedValue1?.contains(card3)).toBe(true);
                // Ensure card instances within the set are the same
                expect(clonedValue1?.cards.find(c => c.id === card2.id)).toBe(card2);
                expect(clonedValue1?.cards.find(c => c.id === card3.id)).toBe(card3);

                expect(clonedValue2?.cards).toHaveLength(1);
                expect(clonedValue2?.contains(card1)).toBe(true);
                expect(clonedValue2?.cards.find(c => c.id === card1.id)).toBe(card1);
            });

            it('should perform a deep clone (modifying original map value does not affect clone)', () => {
                const clonedMap = Hand.cloneMap(originalMap);
                const extraCard = Card.of("10C");

                // Modify original map's CardSet value AFTER cloning
                originalMap.get(card1)?.push(extraCard);

                expect(originalMap.get(card1)?.length).toBe(3);
                expect(clonedMap.get(card1)?.length).toBe(2); // Clone should be unaffected
                expect(clonedMap.get(card1)?.contains(extraCard)).toBe(false);
            });

            it('should perform a deep clone (modifying cloned map value does not affect original)', () => {
                const clonedMap = Hand.cloneMap(originalMap);
                const extraCard = Card.of("10C");

                // Modify cloned map's CardSet value
                clonedMap.get(card1)?.push(extraCard);

                expect(clonedMap.get(card1)?.length).toBe(3);
                expect(originalMap.get(card1)?.length).toBe(2); // Original should be unaffected
                expect(originalMap.get(card1)?.contains(extraCard)).toBe(false);
            });

            it('should correctly clone an empty map', () => {
                const emptyMap = new Map<Card, CardSet>();
                const clonedEmptyMap = Hand.cloneMap(emptyMap);

                expect(clonedEmptyMap).toBeInstanceOf(Map);
                expect(clonedEmptyMap).not.toBe(emptyMap);
                expect(clonedEmptyMap.size).toBe(0);
            });
        });


        describe('Hand.clone', () => {
            let clonedHand: Hand;

            beforeEach(() => {
                // Clone the hand set up in the outer beforeEach
                clonedHand = hand.clone();
            });

            it('should return a new Hand instance', () => {
                expect(clonedHand).toBeInstanceOf(Hand);
                expect(clonedHand).not.toBe(hand);
            });

            // --- _cards Tests ---
            it('should have a different _cards (CardSet) instance', () => {
                expect(clonedHand.cards).toBeInstanceOf(CardSet);
                expect(clonedHand.cards).not.toBe(hand.cards);
            });

            it('should have the same card instances in _cards', () => {
                expect(clonedHand.cards.length).toBe(hand.cards.length);
                expect(clonedHand.cards.contains(card1)).toBe(true);
                expect(clonedHand.cards.contains(card2)).toBe(true);
                expect(clonedHand.cards.contains(card3)).toBe(true);
                expect(clonedHand.cards.contains(card4)).toBe(true);
                expect(clonedHand.cards.contains(card5)).toBe(true);
                // Check instance equality
                expect(clonedHand.cards.cards.find(c => c.id === card1.id)).toBe(card1);
            });

            it('should have independent _cards (modifying original does not affect clone)', () => {
                const extraCard = Card.of("10C");
                hand.push(extraCard); // Modify original hand AFTER cloning

                expect(hand.cards.length).toBe(6);
                expect(clonedHand.cards.length).toBe(5); // Clone unaffected
                expect(clonedHand.cards.contains(extraCard)).toBe(false);
            });

            it('should have independent _cards (modifying clone does not affect original)', () => {
                const extraCard = Card.of("10C");
                clonedHand.push(extraCard); // Modify clone

                expect(clonedHand.cards.length).toBe(6);
                expect(hand.cards.length).toBe(5); // Original unaffected
                expect(hand.cards.contains(extraCard)).toBe(false);
            });

            // --- combos Tests ---
            it('should have a different combos (Combos) instance', () => {
                expect(clonedHand.combos).toBeInstanceOf(Combos);
                expect(clonedHand.combos).not.toBe(hand.combos);
            });

            it('should have the same number of combos', () => {
                expect(clonedHand.combos.length).toBe(hand.combos.length);
                expect(clonedHand.combos.length).toBe(2);
            });

            it('should contain clones of the original combos', () => {
                const clonedCombo1 = clonedHand.combos.combos.find(c => c.equals(combo1));
                const clonedCombo2 = clonedHand.combos.combos.find(c => c.equals(combo2));

                expect(clonedCombo1).toBeDefined();
                expect(clonedCombo2).toBeDefined();
                expect(clonedCombo1).not.toBe(combo1); // Different Combo instance
                expect(clonedCombo2).not.toBe(combo2); // Different Combo instance
                expect(clonedCombo1?.equals(combo1)).toBe(true); // Logically equal
                expect(clonedCombo2?.equals(combo2)).toBe(true); // Logically equal
            });

            it('should have independent combos (modifying original does not affect clone)', () => {
                const extraCombo = Combo.of("8H 9H 10H");
                hand.combos.add(extraCombo); // Modify original AFTER cloning

                expect(hand.combos.length).toBe(3);
                expect(clonedHand.combos.length).toBe(2); // Clone unaffected
                expect(clonedHand.combos.contains(extraCombo)).toBe(false);
            });

            it('should have independent combos (modifying clone does not affect original)', () => {
                const extraCombo = Combo.of("8H 9H 10H");
                clonedHand.combos.add(extraCombo); // Modify clone

                expect(clonedHand.combos.length).toBe(3);
                expect(hand.combos.length).toBe(2); // Original unaffected
                expect(hand.combos.contains(extraCombo)).toBe(false);
            });

            // --- horizontals/verticals Tests ---
            it('should have different horizontals/verticals Map instances', () => {
                expect(clonedHand.horizontals).toBeInstanceOf(Map);
                expect(clonedHand.horizontals).not.toBe(hand.horizontals);
                expect(clonedHand.verticals).toBeInstanceOf(Map);
                expect(clonedHand.verticals).not.toBe(hand.verticals);
            });

            it('should have cloned relationship maps (check content and deep clone)', () => {
                // Check horizontals for card1
                const originalHCard1 = hand.getHorizontals(card1);
                const clonedHCard1 = clonedHand.getHorizontals(card1);
                expect(clonedHCard1).not.toBe(originalHCard1);
                expect(clonedHCard1.length).toBe(originalHCard1.length);
                expect(clonedHCard1.contains(card2)).toBe(true);
                expect(clonedHCard1.contains(card3)).toBe(true);

                // Check verticals for card1
                const originalVCard1 = hand.getVerticals(card1);
                const clonedVCard1 = clonedHand.getVerticals(card1);
                expect(clonedVCard1).not.toBe(originalVCard1);
                expect(clonedVCard1.length).toBe(originalVCard1.length);
                expect(clonedVCard1.contains(card4)).toBe(true);

                // Test deep clone by modifying original relationship
                const extraCard = Card.of("5C");
                hand.linkHorizontal(card1, extraCard); // Modify original AFTER cloning

                expect(hand.getHorizontals(card1).length).toBe(3);
                expect(clonedHand.getHorizontals(card1).length).toBe(2); // Clone unaffected
                expect(clonedHand.getHorizontals(card1).contains(extraCard)).toBe(false);

                // Test deep clone by modifying clone relationship
                const extraCard2 = Card.of("4S");
                clonedHand.linkVertical(card1, extraCard2); // Modify clone

                expect(clonedHand.getVerticals(card1).length).toBe(2);
                expect(hand.getVerticals(card1).length).toBe(1); // Original unaffected
                expect(hand.getVerticals(card1).contains(extraCard2)).toBe(false);
            });

            it('should correctly clone an empty hand', () => {
                const emptyHand = new Hand();
                const clonedEmptyHand = emptyHand.clone();

                expect(clonedEmptyHand).toBeInstanceOf(Hand);
                expect(clonedEmptyHand).not.toBe(emptyHand);
                expect(clonedEmptyHand.cards.length).toBe(0);
                expect(clonedEmptyHand.combos.length).toBe(0);
                expect(clonedEmptyHand.horizontals.size).toBe(0);
                expect(clonedEmptyHand.verticals.size).toBe(0);
            });
        });
    });

    describe('Hand.push', () => {
        it('should add a card to the collection and relate it to existing cards', () => {
            const hand = new Hand();
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");

            hand.push(card1);
            hand.push(card2);

            expect(hand.cards.contains(card1)).toBe(true);
            expect(hand.cards.contains(card2)).toBe(true);
            expect(hand.getHorizontals(card1).contains(card2)).toBe(true);
            expect(hand.getHorizontals(card2).contains(card1)).toBe(true);
        });

        it('should not relate the new card if no matching criteria are met', () => {
            const hand = new Hand();
            const card1 = Card.of("5S");
            const card2 = Card.of("7H");

            hand.push(card1);
            hand.push(card2);

            expect(hand.cards.contains(card1)).toBe(true);
            expect(hand.cards.contains(card2)).toBe(true);
            expect(hand.getHorizontals(card1).contains(card2)).toBe(false);
            expect(hand.getVerticals(card1).contains(card2)).toBe(false);
        });

        it('should not relate the new card if no relate is asked', () => {
            const hand = new Hand();
            const card1 = Card.of("5S");
            const card2 = Card.of("5H");

            hand.push(card1);
            hand.push(card2);

            expect(hand.cards.contains(card1)).toBe(true);
            expect(hand.cards.contains(card2)).toBe(true);
            expect(hand.getHorizontals(card1).contains(card2)).toBe(true);
            expect(hand.getVerticals(card1).contains(card2)).toBe(false);
        });
    });

    describe('Hand.sort', () => {
        it('should sort cards by value in ascending order', () => {
            const hand = new Hand();
            const card1 = Card.of("10H");
            const card2 = Card.of("3S");
            const card3 = Card.of("7D");

            hand.push(card1);
            hand.push(card2);
            hand.push(card3);

            hand.cards.sort();

            expect(hand.cards.cards).toEqual([card2, card3, card1]);
        });

        it('should sort cards by suit index if values are the same', () => {
            const hand = new Hand();
            const card1 = Card.of("5C");

            const card2 = Card.of("5S");
            const card3 = Card.of("5H");

            hand.push(card1);
            hand.push(card2);
            hand.push(card3);

            hand.cards.sort();

            expect(hand.cards.cards).toEqual([card2, card3, card1]);
        });

        it('should handle an empty collection without errors', () => {
            const hand = new Hand();

            expect(() => hand.cards.sort()).not.toThrow();
            expect(hand.cards.cards).toEqual([]);
        });

        it('should handle a single card without changing the order', () => {
            const hand = new Hand();
            const card = Card.of("7D");

            hand.push(card);
            hand.cards.sort();

            expect(hand.cards.cards).toEqual([card]);
        });

        it('should maintain the correct order for already sorted cards', () => {
            const hand = new Hand();
            const card1 = Card.of("3S");
            const card2 = Card.of("7D");
            const card3 = Card.of("10H");

            hand.push(card1);
            hand.push(card2);
            hand.push(card3);

            hand.cards.sort();

            expect(hand.cards.cards).toEqual([card1, card2, card3]);
        });
    });

    describe('Hand.toJSON', () => {
        it('should return the correct JSON representation for a red card and a black card', () => {
            const hand = new Hand();
            const card1 = Card.of("13C");// King of Clubs
            const card2 = Card.of("10D"); // 10 of Diamonds
            const card3 = Card.of("1S"); // Ace of Spades

            hand.push(card1);
            hand.push(card2);
            hand.push(card3);

            hand.cards.sort();

            const expectedJSON = [
                { char: "🂡", color: "Black" },
                { char: "🃊", color: "Red" },
                { char: "🃞", color: "Black" },
            ]
            expect(hand.toJSON()).toEqual(expectedJSON);
        });
    });

    describe('Hand.base', () => {
        let hand: Hand;
        let card5S: Card, card5H: Card, card5D: Card;
        let card6S: Card, card7S: Card;
        let cardAS: Card;

        // Mock the actual Combo instances returned/used
        const mockCombo1 = {
            cards: [Card.of("1S"), Card.of("2S"), Card.of("3S")],
            equals: jest.fn((other) => other === mockCombo1), // Simple equality for mock
            toString: jest.fn().mockReturnValue("MockCombo1"),
            toJSON: jest.fn().mockReturnValue({})
        } as unknown as Combo;

        const mockCombo2 = {
            cards: [Card.of("5H"), Card.of("5D"), Card.of("5C")],
            equals: jest.fn((other) => other === mockCombo2), // Simple equality for mock
            toString: jest.fn().mockReturnValue("MockCombo2"),
            toJSON: jest.fn().mockReturnValue({})
        } as unknown as Combo;

        beforeEach(() => {
            // Reset mocks on the Combos class constructor/instance methods if needed
            // (The mock implementation above creates a fresh state each time)
            hand = new Hand();
            // Ensure combos are clear before each test
            // hand.combos.reset();

            hand = new Hand();
            // Setup a hand with relationships for removal tests
            card5S = Card.of("5S");
            card5H = Card.of("5H");
            card5D = Card.of("5D");
            card6S = Card.of("6S");
            card7S = Card.of("7S");
            cardAS = Card.of("1S");
        });

        // Helper to add cards and establish relationships for tests
        const setupHand = (cards: Card[]) => {
            cards.forEach(card => hand.push(card));
        };

        describe('hasCombo', () => {
            it('should return false when the combos list is empty', () => {
                expect(hand.hasCombo()).toBe(false);
            });

            it('should return true when the combos list has one combo', () => {
                hand.combos.add(mockCombo1); // Use the mocked add
                expect(hand.hasCombo()).toBe(true);
            });

            it('should return true when the combos list has multiple combos', () => {
                hand.combos.add(mockCombo1);
                hand.combos.add(mockCombo2);
                expect(hand.hasCombo()).toBe(true);
            });

            it('should return false after combos are added and then removed/shifted', () => {
                hand.combos.add(mockCombo1);
                expect(hand.hasCombo()).toBe(true);
                hand.combos.shift(); // Use the mocked shift
                expect(hand.hasCombo()).toBe(false);
            });
        });

        describe('getCombo', () => {
            it('should throw an error if hasCombo is false (combos list is empty)', () => {
                expect(hand.hasCombo()).toBe(false); // Verify precondition
                expect(() => hand.getCombo()).toThrow("No combo available");
            });

            it('should return the first combo from the combos list if hasCombo is true', () => {
                hand.combos.add(mockCombo1);
                hand.combos.add(mockCombo2);
                expect(hand.hasCombo()).toBe(true); // Verify precondition

                const retrievedCombo = hand.getCombo();
                expect(retrievedCombo).toBe(mockCombo1); // Check if the correct combo was returned
            });

            it('should remove the returned combo from the combos list', () => {
                hand.combos.add(mockCombo1);
                hand.combos.add(mockCombo2);

                jest.spyOn(hand.combos, 'shift')
                hand.getCombo(); // Retrieve and remove the first combo

                // Verify shift was called on the underlying combos object
                expect(hand.combos.shift).toHaveBeenCalledTimes(1);

                // Verify the state after removal
                expect(hand.combos.length).toBe(1);
                expect(hand.hasCombo()).toBe(true); // Still has mockCombo2

                // Verify the remaining combo is the second one
                const nextCombo = hand.getCombo();
                expect(nextCombo).toBe(mockCombo2);
                expect(hand.hasCombo()).toBe(false); // Now empty
            });
        });

        describe('remove', () => {

            beforeEach(() => {
                setupHand([card5S, card5H, card6S]); // 5S <-> 5H (H), 5S <-> 6S (V)
            });

            it('should call cards.remove with the specified card', () => {
                jest.spyOn(hand.cards, 'remove')
                hand.remove(card5S);
                expect(hand.cards.remove).toHaveBeenCalledWith(card5S);
            });

            it('should call unrelate on horizontally linked cards', () => {
                jest.spyOn(hand, 'unrelate')
                hand.remove(card5S);
                // Check if 5H.unrelate(5S) was called
                expect(hand.unrelate).toHaveBeenCalledWith(card5H, card5S);
            });

            it('should call unrelate on vertically linked cards', () => {
                jest.spyOn(hand, 'unrelate')
                hand.remove(card5S);
                // Check if 6S.unrelate(5S) was called
                expect(hand.unrelate).toHaveBeenCalledWith(card6S, card5S);
            });

            it('should call updateCombo after removing the card', () => {
                const updateComboSpy = jest.spyOn(hand, 'updateCombo');
                hand.remove(card5S);
                expect(updateComboSpy).toHaveBeenCalledTimes(1);
            });

            it('should actually remove the card from the hand cards', () => {
                const initialLength = hand.cards.length;
                hand.remove(card5S);
                // Verify through the mocked CardSet's behavior
                expect(hand.cards.length).toBe(initialLength - 1);
                expect(hand.cards.contains(card5S)).toBe(false); // Assuming mock contains reflects removal
            });

            it('should throw error if card is not in hand (via CardSet.remove mock)', () => {
                const cardNotInHand = Card.of("10C");
                // Expect the mocked CardSet.remove to throw
                expect(() => hand.remove(cardNotInHand)).toThrow(`Card ${cardNotInHand} not found in set`);
            });

            it('should correctly update combos after removing a card that breaks a combo', () => {
                // Setup: 5S, 6S, 7S (Vertical Combo)
                hand = new Hand(); // Start fresh
                setupHand([card5S, card6S, card7S]);
                jest.spyOn(hand.combos, 'reset')
                expect(hand.hasCombo()).toBe(true); // Verify combo exists initially

                hand.remove(card6S); // Remove the middle card

                // updateCombo should have been called, clearing old combos and finding no new ones
                expect(hand.hasCombo()).toBe(false);
                expect(hand.combos.reset).toHaveBeenCalled();
                // Verify add was likely not called again, or called with no valid combos found
            });
        });


        describe('updateCombo', () => {
            it('should call combos.reset() at the beginning', () => {
                jest.spyOn(hand.combos, 'reset')
                hand.updateCombo();
                expect(hand.combos.reset).toHaveBeenCalledTimes(1);
            });

            it('should find and add a horizontal combo', () => {
                jest.spyOn(hand.combos, 'add')
                setupHand([card5S, card5H, card5D, cardAS]); // Set of 5s + Ace
                // updateCombo is called by pushAndRelate

                expect(hand.hasCombo()).toBe(true);
                expect(hand.combos.length).toBe(1); // Only one combo expected

                // Check *what* was added - needs careful mock setup for Combo constructor/equals
                const expectedCombo = new Combo([card5S, card5H, card5D]);
                expect(hand.combos.contains(expectedCombo)).toBe(true);
            });

            it('should find and add a vertical combo', () => {
                jest.spyOn(hand.combos, 'add')
                setupHand([card5S, card6S, card7S, card5H]); // Straight flush + 5H
                // updateCombo is called by pushAndRelate

                expect(hand.hasCombo()).toBe(true);
                expect(hand.combos.length).toBe(1); // Only one combo expected

                // Check *what* was added - needs careful mock setup for Combo constructor/equals
                const expectedCombo = new Combo([card5S, card6S, card7S]);
                expect(hand.combos.contains(expectedCombo)).toBe(true);
            });

            it('should find and add multiple combos (horizontal and vertical)', () => {
                jest.spyOn(hand.combos, 'add')
                setupHand([card5S, card5H, card5D, card6S, card7S, cardAS]); // Set of 5s + 6S, 7S, AS
                // updateCombo is called by pushAndRelate

                expect(hand.hasCombo()).toBe(true);
                expect(hand.combos.length).toBe(2); // Only one combo expected

                // Check *what* was added - needs careful mock setup for Combo constructor/equals
                const expectedComboH = new Combo([card5S, card5H, card5D]);
                const expectedComboV = new Combo([card5S, card6S, card7S]); // 5S is used in H
                expect(hand.combos.contains(expectedComboH)).toBe(true);
                expect(hand.combos.contains(expectedComboV)).toBe(true); // This depends on combo finding logic allowing overlaps
            });

            it('should not add any combos if none exist', () => {
                jest.spyOn(hand.combos, 'add')
                setupHand([card5S, card6S, card5H, cardAS]); // No 3+ combos
                // updateCombo is called by pushAndRelate

                expect(hand.combos.add).not.toHaveBeenCalled();
                expect(hand.hasCombo()).toBe(false);
            });

            it('should handle Ace-high/low vertical combos if collectVerticals supports it', () => {
                jest.spyOn(hand.combos, 'add')
                const cardKS = Card.of("13S");
                const cardQS = Card.of("12S");
                setupHand([cardAS, cardKS, cardQS]); // QKA straight flush
                // updateCombo is called by pushAndRelate

                expect(hand.combos.add).toHaveBeenCalledTimes(1);
                const expectedCombo = new Combo([cardQS, cardKS, cardAS]); // Order after sort
                expect((hand.combos.add as jest.Mock).mock.calls[0][0].equals(expectedCombo)).toBe(true);
                expect(hand.hasCombo()).toBe(true);
            });
        });

        describe('collectHorizontals', () => {
            it('should collect all horizontally linked cards starting from one', () => {
                hand.linkHorizontal(card5S, card5H); // 5S <-> 5H
                hand.linkHorizontal(card5H, card5D); // 5H <-> 5D

                const collected: Card[] = [];
                hand.collectHorizontals(card5H, collected);

                expect(collected).toHaveLength(3);
                expect(collected).toContain(card5S);
                expect(collected).toContain(card5H);
                expect(collected).toContain(card5D);
            });

            it('should collect only the starting card if no horizontal links', () => {
                const collected: Card[] = [];
                hand.collectHorizontals(cardAS, collected); // AS has no links here

                expect(collected).toHaveLength(1);
                expect(collected).toContain(cardAS);
            });

            it('should not add duplicate cards', () => {
                // Setup links: 5S <-> 5H, 5H <-> 5D, 5D <-> 5S (circular)
                hand.linkHorizontal(card5S, card5H); // 5S <-> 5H
                hand.linkHorizontal(card5H, card5D); // 5H <-> 5D
                hand.linkHorizontal(card5D, card5S); // 5S <-> 5H
                // Create cycle

                const collected: Card[] = [];
                hand.collectHorizontals(card5S, collected);

                expect(collected).toHaveLength(3); // Not more due to cycle
                expect(collected).toContain(card5S);
                expect(collected).toContain(card5H);
                expect(collected).toContain(card5D);
                // Check uniqueness
                expect(new Set(collected).size).toBe(3);
            });
        });

        describe('collectVerticals (static)', () => {
            it('should collect all vertically linked cards starting from one', () => {
                // Manual setup: 5S <-> 6S <-> 7S
                hand.linkVertical(card5S, card6S); // 5S <-> 6S
                hand.linkVertical(card6S, card7S); // 6S <-> 7S

                const collected: Card[] = [];
                hand.collectVerticals(card6S, collected);

                expect(collected).toHaveLength(3);
                expect(collected).toContain(card5S);
                expect(collected).toContain(card6S);
                expect(collected).toContain(card7S);
            });

            it('should collect only the starting card if no vertical links', () => {
                const collected: Card[] = [];
                hand.collectVerticals(card5H, collected); // 5H has no links here

                expect(collected).toHaveLength(1);
                expect(collected).toContain(card5H);
            });

            it('should handle Ace-King wrap-around links', () => {
                // Manual setup: KS <-> AS <-> 2S
                const cardKS = Card.of("13S");
                const card2S = Card.of("2S");
                hand.linkVertical(cardAS, cardKS); // AS <-> KS
                hand.linkVertical(cardAS, card2S); // AS <-> 2S

                const collected: Card[] = [];
                hand.collectVerticals(cardAS, collected);

                expect(collected).toHaveLength(3);
                expect(collected).toContain(cardAS);
                expect(collected).toContain(cardKS);
                expect(collected).toContain(card2S);
            });

            it('should not add duplicate cards (e.g., in cycles)', () => {
                // Setup links: AS <-> 2S, 2S <-> 3S, 3S <-> AS (hypothetical cycle)
                const card2S = Card.of("2S");
                const card3S = Card.of("3S");
                hand.linkVertical(cardAS, card2S); // AS <-> 2S
                hand.linkVertical(card2S, card3S); // 2S <-> 3S 
                hand.linkVertical(card3S, cardAS); // 3S <-> AS (hypothetical cycle)

                const collected: Card[] = [];
                hand.collectVerticals(card2S, collected);

                expect(collected).toHaveLength(3); // Not more due to cycle
                expect(collected).toContain(cardAS);
                expect(collected).toContain(card2S);
                expect(collected).toContain(card3S);
                // Check uniqueness
                expect(new Set(collected).size).toBe(3);
            });
        });
    });


    describe('Hand.addAll', () => {
        let hand: Hand;
        let card1: Card, card2: Card, card3: Card, card4: Card, card5: Card, card6: Card;
        let combo1: Combo, combo2: Combo, comboOverlap: Combo;
        let pushSpy: jest.SpyInstance;
        let containsSpy: jest.SpyInstance;

        beforeEach(() => {
            hand = new Hand();

            // Create cards
            card1 = Card.of("1S");
            card2 = Card.of("2S");
            card3 = Card.of("3S"); // Forms combo1 with 1S, 2S
            card4 = Card.of("1H"); // Forms comboOverlap with 1S
            card5 = Card.of("1D"); // Forms comboOverlap with 1S, 1H
            card6 = Card.of("1C");

            // Create combos
            combo1 = new Combo([card1, card2, card3]); // 1S, 2S, 3S
            combo2 = new Combo([card4, card5, card6]); // 1H, 1D, 1C

            // Combo with overlapping card (1S)
            comboOverlap = new Combo([card1, card4, card5]); // 1S, 1H, 1D

            // Spy on methods called by addAll
            // We spy on the actual instance methods
            pushSpy = jest.spyOn(hand, 'push').mockImplementation(); // Mock implementation to prevent side effects like updateCombo
            containsSpy = jest.spyOn(hand.cards, 'contains'); // Spy on the real contains
        });

        afterEach(() => {
            // Restore spies
            pushSpy.mockRestore();
            containsSpy.mockRestore();
        });


        it('should call push for each unique card in a single combo', () => {
            const combosToAdd = [combo1];
            hand.addAll(combosToAdd);

            expect(containsSpy).toHaveBeenCalledTimes(3); // Checked 3 cards
            expect(pushSpy).toHaveBeenCalledTimes(3);
            expect(pushSpy).toHaveBeenCalledWith(card1);
            expect(pushSpy).toHaveBeenCalledWith(card2);
            expect(pushSpy).toHaveBeenCalledWith(card3);
        });

        it('should call push for each unique card across multiple disjoint combos', () => {
            const combosToAdd = [combo1, combo2]; // [1S, 2S, 3S], [1H, 1D, 1C]
            hand.addAll(combosToAdd);

            // contains called for each card = 3 + 3 = 6
            expect(containsSpy).toHaveBeenCalledTimes(6);
            // push called for each unique card = 3 + 3 = 6
            expect(pushSpy).toHaveBeenCalledTimes(6);
            expect(pushSpy).toHaveBeenCalledWith(card1);
            expect(pushSpy).toHaveBeenCalledWith(card2);
            expect(pushSpy).toHaveBeenCalledWith(card3);
            expect(pushSpy).toHaveBeenCalledWith(card4);
            expect(pushSpy).toHaveBeenCalledWith(card5);
            expect(pushSpy).toHaveBeenCalledWith(card6); // card6
        });

        it('should only call push once for cards present in multiple combos', () => {

            // CHeck if a card has been added already
            // We need to mock the contains method to simulate the behavior of the CardSet
            // Explanation:
            //      pushSpy.mock.calls is an array of arrays, where each sub-array represents the arguments passed in a call.
            //      So call[0] is the first argument of one invocation of the mocked function.
            containsSpy = jest.spyOn(hand.cards, 'contains').mockImplementation((card: Card) => {
                return (pushSpy.mock.calls.some(call => call[0] === card))
            });


            const combosToAdd = [combo1, comboOverlap]; // [1S, 2S, 3S], [1S, 1H, 1D]
            // Unique cards: 1S, 2S, 3S, 1H, 1D
            hand.addAll(combosToAdd);

            // contains called for each card = 3 + 3 = 6
            expect(containsSpy).toHaveBeenCalledTimes(6);
            // push called only for unique cards = 5
            expect(pushSpy).toHaveBeenCalledTimes(5);
            expect(pushSpy).toHaveBeenCalledWith(card1); // Called for 1S
            expect(pushSpy).toHaveBeenCalledWith(card2); // Called for 2S
            expect(pushSpy).toHaveBeenCalledWith(card3); // Called for 3S
            expect(pushSpy).toHaveBeenCalledWith(card4); // Called for 1H
            expect(pushSpy).toHaveBeenCalledWith(card5); // Called for 1D

            // Verify push was called only once for the overlapping card (card1)
            const pushCalls = pushSpy.mock.calls;
            let card1PushCount = 0;
            pushCalls.forEach(call => {
                if (call[0] === card1) {
                    card1PushCount++;
                }
            });
            expect(card1PushCount).toBe(1);
        });

        it('should not call push if all cards from combos are already in the hand', () => {
            // Pre-populate hand
            hand.cards.push(card1);
            hand.cards.push(card2);
            hand.cards.push(card3);

            // Reset spies after pre-population
            pushSpy.mockClear();
            containsSpy.mockClear();

            const combosToAdd = [combo1]; // Contains cards already in hand
            hand.addAll(combosToAdd);

            expect(containsSpy).toHaveBeenCalledTimes(3); // contains is still called
            expect(pushSpy).not.toHaveBeenCalled(); // push should not be called
        });

        it('should call push only for cards not already in the hand', () => {
            // Pre-populate hand with one card from combo1
            hand.cards.push(card1);

            // Reset spies
            pushSpy.mockClear();
            containsSpy.mockClear();

            const combosToAdd = [combo1]; // [1S, 2S, 3S]
            hand.addAll(combosToAdd);

            expect(containsSpy).toHaveBeenCalledTimes(3);
            expect(pushSpy).toHaveBeenCalledTimes(2); // Only for card2 and card3
            expect(pushSpy).not.toHaveBeenCalledWith(card1);
            expect(pushSpy).toHaveBeenCalledWith(card2);
            expect(pushSpy).toHaveBeenCalledWith(card3);
        });

        it('should not call push if the input combo array is empty', () => {
            const combosToAdd: Combo[] = [];
            hand.addAll(combosToAdd);

            expect(containsSpy).not.toHaveBeenCalled();
            expect(pushSpy).not.toHaveBeenCalled();
        });
    });

});
