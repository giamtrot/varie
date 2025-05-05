import { Combo } from './Combo';
import { Combos } from './Combos';

export class Desk {
    private _combos: Combo[] = [];

    static fromString(desc: string): Desk {
        const desk = new Desk();
        const combos = Combos.fromString(desc)
        desk.replace(combos);
        return desk
    }

    constructor() {
        // console.log("Desk created");
    }

    replace(found: Combos) {
        this._combos = found.combos
    }

    get combos(): Combo[] {
        return this._combos;
    }

    add(combo: Combo): void {
        this._combos.push(combo);
    }

    toString(): string {
        return this._combos.map(combo => combo.toString()).join(' ');
    }

    toJSON() {
        return this._combos.map(combo => combo.toJSON());
    }
}


