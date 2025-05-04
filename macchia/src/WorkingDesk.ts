import { Card } from './Card';
import { Combo } from './Combo';
import { Combos } from './Combos';
import { Desk } from './Desk';
import { Hand } from './Hand';

type SearchStat = {
    elapsedTime: number;
    branchCount: number;
    leafCount: number;
};

export class WorkingDesk {
    hand = new Hand();
    static logDetails: boolean = false;

    constructor(desk: Desk) {
        this.hand.addAll(desk.combos);
    }

    add(card: Card): void {
        this.hand.push(card);
    }

    searchNewCombos(): Combos | undefined {
        // console.log("Searching for new combos\n", this.hand.toString());
        const startTime = performance.now();

        const stat: SearchStat = {
            elapsedTime: 0,
            branchCount: 0,
            leafCount: 0
        };

        const found = WorkingDesk.search(this.hand, new Combos(), stat);
        stat.elapsedTime = performance.now() - startTime;
        console.log(`Search completed in ${stat.elapsedTime.toFixed(2)} ms: leaves ${stat.leafCount}, branches ${stat.branchCount}`);
        return found;
    }
    static search(hand: Hand, combos: Combos, stat: SearchStat) {
        if (hand.combos.combos.length === 0) {
            if (WorkingDesk.logDetails) {
                console.log(`${"-".repeat(combos.length - 1)}${stat.leafCount + 1}. Dead branch`);
            }
            stat.leafCount++;
            return undefined;
        }

        let foundCombos: Combos | undefined;

        for (let i = 0; i < hand.combos.combos.length; i++) {
            const combo = hand.combos.combos[i];
            if (WorkingDesk.logDetails) {
                console.log(`${"-".repeat(combos.length)}${stat.branchCount + 1}. Hand:  ${hand.toString()}`);
                console.log(`${"-".repeat(combos.length)}${stat.branchCount + 1}. Combo: ${combo.toString()}`);
            }
            const newHand = hand.clone();
            combo.cards.forEach(card => {
                newHand.remove(card);
            });
            foundCombos = WorkingDesk.innerSearch(combo, newHand, combos, stat);
            if (foundCombos) {
                return foundCombos;
            }
        };

        return undefined;
    }

    static innerSearch(combo: Combo, newHand: Hand, combos: Combos, stat: SearchStat): Combos | undefined {
        stat.branchCount++;
        const newCombos = combos.clone();
        newCombos.add(combo);
        if (newHand.cards.length === 0) {
            if (WorkingDesk.logDetails) {
                console.log(`${"-".repeat(combos.length - 1)}${stat.leafCount + 1}. Success branch`);
            }
            stat.leafCount++;
            return newCombos;
        }

        return WorkingDesk.search(newHand, newCombos, stat);
    }


}
