import { Combo } from './Combos';

export class Desk {
    private combos: Combo[] = [];

    addCombo(combo: Combo): void {
        this.combos.push(combo);
    }

    toString(): string {
        return this.combos.map(combo => combo.toString()).join('\n');
    }
}
