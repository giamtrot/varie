import assert from 'assert';
import { Combo } from './Combo';


export class Combos {
    combos: Combo[] = [];

    static fromString(desc: string): Combos {
        const combos = new Combos();
        desc.split(' ').forEach(c => {
            const combo = Combo.fromString(c);
            combos.add(combo);
        });
        return combos;
    }

    clone(): Combos {
        const newCombos = new Combos();
        newCombos.combos = this.combos.map(combo => combo.clone());
        return newCombos;
    }

    add(combo: Combo) {
        if (!this.contains(combo)) {
            this.combos.push(combo);
        }
    }

    reset() {
        this.combos = [];
    }

    get length(): number {
        return this.combos.length;
    }

    shift(): Combo {
        assert(this.length > 0, "No combo available");
        return this.combos.shift()!;
    }

    contains(combo: Combo) {
        return this.combos.filter(c => c.equals(combo)).length > 0;
    }

    toString(): string {
        this.combos.sort(Combo.comboSorter)
        return this.combos.map(combo => combo.toString()).join(' ');
    }
}
