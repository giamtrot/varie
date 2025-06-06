import { Card } from './Card';
import { Combo } from './Combo';
import { Combos } from './Combos';
import { Desk } from './Desk';
import { Hand } from './Hand';

export type SearchHelper = {
    startTime: number;
    elapsedTime: number;
    branchCount: number;
    leafCount: number;
    paths: Set<string>;
    cachePath: boolean;
};

export class WorkingDesk {
    hand = new Hand();
    private static activaLogDetails = false;

    constructor(desk: Desk) {
        this.hand.addAll(desk.combos);
    }

    add(card: Card): void {
        this.hand.push(card);
    }

    searchNewCombos(addedCard: Card | undefined = undefined, cachePath: boolean = true): Combos[] {
        // console.log("Searching for new combos\n", this.hand.toString());
        const helper: SearchHelper = {
            startTime: performance.now(),
            elapsedTime: 0,
            branchCount: 0,
            leafCount: 0,
            paths: new Set<string>(),
            cachePath: cachePath
        };

        if (addedCard) {
            this.add(addedCard);
        }
        const found = WorkingDesk.search(this.hand, new Combos(), helper, addedCard);
        WorkingDesk.logStat(helper);
        return found;
    }

    /* istanbul ignore next */
    private static logStat(helper: SearchHelper) {
        if (!this.activaLogDetails) return;
        WorkingDesk.dumpHelper(helper);
    }

    static dumpHelper(helper: SearchHelper) {
        helper.elapsedTime = performance.now() - helper.startTime;
        console.log(`Search completed in ${helper.elapsedTime.toFixed(2)} ms: leaves ${helper.leafCount}, branches ${helper.branchCount}`);
    }

    static search(hand: Hand, combos: Combos, helper: SearchHelper, addedCard: Card | undefined = undefined): Combos[] {
        if (hand.combos.combos.length === 0) {
            /* istanbul ignore next */
            WorkingDesk.logDetails(combos, helper.leafCount + 1, "Dead branch");
            helper.leafCount++;
            /* istanbul ignore next */
            WorkingDesk.logStat(helper);
            return [];
        }

        let foundCombos: Combos[] = [];

        for (let i = 0; i < hand.combos.combos.length; i++) {
            const combo = hand.combos.combos[i];
            // console.log(combo.toString())
            if (addedCard && !combo.containsSame(addedCard)) {
                continue;
            }
            /* istanbul ignore next */
            WorkingDesk.logDetails(combos, helper.branchCount, `Hand:  ${hand.toString()}`);
            WorkingDesk.logDetails(combos, helper.branchCount, `Combo: ${combo.toString()}`);
            const newHand = hand.clone();
            combo.cards.forEach(card => {
                newHand.remove(card);
            });
            const innerFoundCombos = WorkingDesk.innerSearch(combo, newHand, combos, helper);
            foundCombos.push(...innerFoundCombos);
            if (foundCombos.length > 0) {
                return foundCombos;
            }
        }

        return foundCombos;
    }

    /* istanbul ignore next */
    private static logDetails(combos: Combos, stat: number, msg: string) {
        if (!this.activaLogDetails) return;
        const prefix = Math.max(0, combos.length - 1);
        console.log(`${"-".repeat(prefix)}${stat}. ${msg}`);
    }

    static innerSearch(combo: Combo, newHand: Hand, combos: Combos, helper: SearchHelper): Combos[] {
        helper.branchCount++;
        const newCombos = combos.clone();
        newCombos.add(combo);
        const path = newCombos.toString();
        if (helper.paths.has(path)) {
            /* istanbul ignore next */
            WorkingDesk.logDetails(combos, helper.leafCount + 1, "Cycle branch. Skipping");
            return []
        }
        if (helper.cachePath) {
            helper.paths.add(path);
        }

        if (newHand.cards.length === 0) {
            /* istanbul ignore next */
            WorkingDesk.logDetails(combos, helper.leafCount + 1, "Completed branch");
            helper.leafCount++;
            /* istanbul ignore next */
            WorkingDesk.logStat(helper);
            return [newCombos];
        }

        return WorkingDesk.search(newHand, newCombos, helper);
    }


}


