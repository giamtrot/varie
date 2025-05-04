import assert from 'assert';
import { Card } from './Card';
import { CardSet } from './CardSet';
import { Combo } from './Combo';
import { Combos } from './Combos';


export class Hand {
    _cards: CardSet = new CardSet();
    combos = new Combos();
    horizontals: Map<Card, CardSet> = new Map();
    verticals: Map<Card, CardSet> = new Map();

    clone(): Hand {
        const newHand = new Hand();
        newHand._cards = this._cards.clone();
        newHand.combos = this.combos.clone();
        newHand.horizontals = Hand.cloneMap(this.horizontals);
        newHand.verticals = Hand.cloneMap(this.verticals);
        return newHand;
    }

    static cloneMap(map: Map<Card, CardSet>): Map<Card, CardSet> {
        const deepClonedMap = new Map<Card, CardSet>();

        for (const key of map.keys()) {
            const value: CardSet = map.get(key)!;
            deepClonedMap.set(key, value.clone());
        }

        return deepClonedMap;
    }

    addAll(combos: Combo[]) {
        combos.forEach(combo => {
            combo.cards.forEach(card => {
                if (!this.cards.contains(card)) {
                    this.push(card);
                }
            });
        });
    }

    reset() {
        this.combos.reset();
    }

    getCombo() {
        assert(this.hasCombo(), "No combo available");
        return this.combos.shift();
    }

    hasCombo() {
        return this.combos.length > 0;
    }

    get cards(): CardSet {
        return this._cards;
    }

    getHorizontals(card: Card): CardSet {
        if (!this.horizontals.has(card)) {
            this.horizontals.set(card, new CardSet());
        }
        return this.horizontals.get(card)!;
    }

    getVerticals(card: Card): CardSet {
        if (!this.verticals.has(card)) {
            this.verticals.set(card, new CardSet());
        }
        return this.verticals.get(card)!;
    }

    remove(card: Card) {
        // console.log("Removing card", card.toString(), this.getHorizontals(card))
        this.cards.remove(card);
        const nh = [...this.getHorizontals(card).cards];
        nh.forEach(h => this.unrelate(h, card));
        const nv = [...this.getVerticals(card).cards];
        nv.forEach(v => this.unrelate(v, card));
        // console.log("Removed card", card.toString(), this.getHorizontals(card))
        this.updateCombo();
    }

    relate(card1: Card, card2: Card) {
        if (card1.isHorizontalMatch(card2)) {
            this.linkHorizontal(card1, card2);
        }

        if (card1.isVerticalMatch(card2)) {
            this.linkVertical(card1, card2);
        }
    }

    linkVertical(card1: Card, card2: Card) {
        this.getVerticals(card1).push(card2);
        this.getVerticals(card2).push(card1);
    }

    linkHorizontal(card1: Card, card2: Card) {
        this.getHorizontals(card1).push(card2);
        this.getHorizontals(card2).push(card1);
    }

    unrelate(card1: Card, card2: Card): void {
        assert(this.getHorizontals(card1).contains(card2) || this.getVerticals(card1).contains(card2), `Card ${card2} not linked to ${card1}`);
        if (this.getHorizontals(card1).contains(card2)) {
            this.unlinkHorizontal(card1, card2);
        }
        if (this.getVerticals(card1).contains(card2)) {
            this.unlinkVertical(card1, card2);
        }
    }

    unlinkHorizontal(card1: Card, card2: Card) {
        assert(this.getHorizontals(card1).contains(card2) && this.getHorizontals(card2).contains(card1),
            `Card ${card2} not horizontally linked to ${card1} or viceversa`);
        // console.log("Unlinking", card1.toString(), card2.toString())
        this.getHorizontals(card1).remove(card2);
        this.getHorizontals(card2).remove(card1);
        // console.log("Unlinking", card1.toString(), card2.toString())
    }

    unlinkVertical(card1: Card, card2: Card) {
        assert(this.getVerticals(card1).contains(card2) && this.getVerticals(card2).contains(card1),
            `Card ${card2} not vertically linked to ${card1} or viceversa`);
        this.getVerticals(card1).remove(card2);
        this.getVerticals(card2).remove(card1);
    }

    findSubCombos(cards: Card[]): Combo[] {
        const subCombos: Combo[] = [];
        if (cards.length < 3) {
            return subCombos;
        }
        if (Combo.checkValid(Combo.prepareForCheck(cards))) {
            subCombos.push(new Combo(cards));
        }
        if (cards.length === 3) {
            return subCombos;
        }

        for (let i = 0; i < cards.length; i++) {
            const subCards = [...cards.slice(0, i), ...cards.slice(i + 1)];
            const subSubCombos = this.findSubCombos(subCards);
            subCombos.push(...subSubCombos);
        }

        return subCombos;
    }

    updateCombo() {
        this.reset();
        let newCards: Card[] = [];
        this.cards.cards.filter(card => this.getHorizontals(card).length >= 2).forEach(card => {
            this.collectHorizontals(card, newCards);
        });

        this.cards.cards.filter(card => this.getVerticals(card).length >= 2).forEach(card => {
            this.collectVerticals(card, newCards);
        });

        const subCombos: Combo[] = this.findSubCombos(newCards);
        subCombos.forEach(combo => {
            this.combos.add(combo);
        });
    }

    collectHorizontals(card: Card, cards: Card[]) {
        if (cards.filter(c => c.sameValue(card) && c.sameSuit(card)).length > 0) {
            return;
        }
        cards.push(card);
        this.getHorizontals(card).cards.forEach(c => this.collectHorizontals(c, cards));
    }

    collectVerticals(card: Card, cards: Card[]) {
        if (cards.filter(c => c.sameValue(card) && c.sameSuit(card)).length > 0) {
            return;
        }
        cards.push(card);
        this.getVerticals(card).cards.forEach(c => this.collectVerticals(c, cards));
    }

    push(card: Card) {
        assert(!this.cards.contains(card), `Card ${card} already in hand`);
        this.cards.cards.forEach(c => {
            this.relate(c, card);
        });
        this.cards.push(card);
        this.updateCombo();
    }

    toJSON(): any {
        return this.cards.toJSON();
    }

    toString(): string {
        return this.cards.toString();
    }
}
