import { Objects } from "../serialization/ObjectIteration";
import { Transient } from "../serialization/Transient";
import { Cell } from "./Cell";
import { CellReadOnly } from "./CellReadOnly";
import { CellRoot } from "./CellRoot";

export type Bit = boolean | 1 | 0

export class MaskPartReadOnly<T,D extends MaskCell32ReadOnly<T>> {
    protected owner: D;
    protected mask: number;

    constructor(owner: D, mask: number) {
        this.owner = owner;
        this.mask = mask;
    }

    protected get isMask() { return true; }

    get() {
        return (this.owner.get() & this.mask) === this.mask
    }
}

export class MaskPart<T,D extends MaskCell32<T>> {
    protected owner: D;
    protected mask: number;

    constructor(owner: D, mask: number) {
        this.owner = owner;
        this.mask = mask;
    }

    protected get isMask() { return true; }

    get() {
        return (this.owner.get() & this.mask) === this.mask
    }

    set(value: Bit) {
        return value
            ? this.owner.setOr(this.mask)
            : this.owner.setNot(this.mask);
    }
}

export class MaskBit<T,D extends MaskCell<T>> {
    protected owner: D;
    protected bit: number;

    constructor(owner: D, bit: number) {
        this.owner = owner;
        this.bit = bit;
    }

    protected get isBit() { return true; }

    get() { return this.owner.getBit(this.bit); }
    set(value: Bit) { return this.owner.setBit(this.bit,value)}
}

export class MaskMultiBit<T,D extends MaskCell<T>> {
    protected owner: D;
    protected bits: number[];
    protected get isBit() { return true; }

    constructor(owner: D, bits: number[]) {
        this.owner = owner;
        this.bits = bits;
    }

    /**
     * only for objectify
     */
    protected get() {
        return this.get_all();
    }

    get_all() {
        return this.bits.find(x=>this.owner.getBit(x)) !== undefined;
    }

    get_any() {
        return !this.bits.find(x=>!this.owner.getBit(x))
    }

    set(value: Bit): T {
        this.bits.forEach(x=>this.owner.setBit(x,value))
        return MaskCell.owner(this.owner);
    }
}

export abstract class MaskCell<T> extends CellRoot<T> {
    static owner<T>(cell: MaskCell<T>) {
        return cell.owner;
    }

    protected bit(no: number): MaskBit<T,this> {
        return new MaskBit(this, no);
    }

    protected multibits(bits: number[]): MaskMultiBit<T,this> {
        return new MaskMultiBit(this,bits);
    }

    abstract getBit(bit: number): boolean;
    abstract setBit(bit: number, value: Bit): T;
    abstract clearAll(): T;
    abstract toString(): string;

    get length() { return 32; }

    objectify() {
        let usedIndices : number[] = []
        let thing = Object.keys(Objects.mapObject(this, ['object'],
            (k, v) => {
                usedIndices.push(v.bit);
                return v.isBit && v.get();
            },
            (k, v) => {
                return k;
            }
        ));

        for(let i=0;i<this.length;++i) {
            if(this.bit(i).get() && ! usedIndices.includes(i)) {
                thing.push(`Bit${i}`);
            }
        }
        return thing;
    }
}

export class MaskCell64<T> extends MaskCell<T> {
    @Transient
    protected cell: Cell<bigint, any>;

    constructor(owner: T, cell: Cell<bigint, any>) {
        super(owner);
        this.cell = cell;
    }

    set(value: bigint) {
        this.cell.set(value);
        return this.owner;
    }

    get length() { return 64; }

    get() { return this.cell.get(); }

    setBit(no: number, value: boolean) {
        if(value) {
            this.cell.set(this.cell.get() | (BigInt(1) << BigInt(no)));
        } else {
            this.cell.set(this.cell.get() & (~((BigInt(1) << BigInt(no)))));
        }
        return this.owner;
    }

    getBit(no: number): boolean {
        return (this.cell.get() & ((BigInt(1) << BigInt(no)))) !== BigInt(0);
    }

    clearAll(): T {
        this.cell.set(BigInt(0));
        return this.owner;
    }

    toString(): string {
        return this.cell.get().toString(2);
    }

    protected deserialize(value: any) {
        this.set(value);
    }
}


export class MaskBitReadOnly<T,D extends MaskCellReadOnly<T>> {
    protected owner: D;
    protected bit: number;

    constructor(owner: D, bit: number) {
        this.owner = owner;
        this.bit = bit;
    }

    protected get isBit() { return true; }

    get() { return this.owner.getBit(this.bit); }
    protected set(value: boolean): T {
        return MaskCellReadOnly.setBit(this.owner,this.bit,value)
    }

    static set<T,D extends MaskCellReadOnly<T>>(mask: MaskBitReadOnly<T,D>, value: boolean) {
        return mask.set(value);
    }
}

export class MaskMultiBitReadOnly<T,D extends MaskCellReadOnly<T>> {
    protected owner: D;
    protected bits: number[];
    protected get isBit() { return true; }

    constructor(owner: D, bits: number[]) {
        this.owner = owner;
        this.bits = bits;
    }

    get() {
        return !this.bits.find(x=>!this.owner.getBit(x))
    }

    protected set(value: boolean): T {
        this.bits.forEach(x=>MaskCellReadOnly.setBit(this.owner, x,value))
        return MaskCellReadOnly.owner(this.owner);
    }
    static set<T,D extends MaskCellReadOnly<T>>(cell: MaskMultiBitReadOnly<T,D>, value: boolean) {
        return cell.set(value);
    }
}

export abstract class MaskCellReadOnly<T> extends CellRoot<T> {
    static owner<T>(cell: MaskCellReadOnly<T>) {
        return cell.owner;
    }

    protected bit(no: number): MaskBitReadOnly<T,MaskCellReadOnly<T>> {
        return new MaskBitReadOnly(this, no);
    }

    protected multibits(bits: number[]): MaskMultiBitReadOnly<T,MaskCellReadOnly<T>> {
        return new MaskMultiBitReadOnly(this,bits);
    }

    abstract getBit(bit: number): boolean;
    abstract toString(): string;
    protected abstract setBit(bit: number, value: Bit): T;
    protected abstract clearAll(): T;

    static setBit<T>(cell: MaskCellReadOnly<T>, bit: number, value: Bit) {
        return cell.setBit(bit,value);
    }
    static clearAll<T>(cell: MaskCellReadOnly<T>) {
        return cell.clearAll();
    }

    get length() { return 32; }

    objectify() {
        let usedIndices : number[] = []
        let thing = Object.keys(Objects.mapObject(this, ['object'],
            (k, v) => {
                usedIndices.push(v.bit);
                return v.isBit && v.get();
            },
            (k, v) => {
                return k;
            }
        ));

        for(let i=0;i<this.length;++i) {
            if(this.bit(i).get() && ! usedIndices.includes(i)) {
                thing.push(`Bit${i}`);
            }
        }
        return thing;
    }
}


const MaskCell32Impl = {

    unsign32(signed: boolean, old: number) {
        return (signed && old === -1) ? 0xffffffff : old;
    },

    sign32(signed: boolean, old: number) {
        return (signed && old === 0xffffffff) ? -1 : old;
    },

    bits_from(mask: number, signed: boolean = false) {
        let bits: number[] = []
        for(let i=0;i<mask;++i) {
            if((signed && mask === -1) || (mask&(1<<i))) {
                bits.push(i)
            }
        }
        return bits;
    },

    bit_from(mask: number) {
        let found = -1;
        for(let i=0;i<32;++i) {
            if(!(mask&i)) continue;
            if(found>=0) {
                throw new Error(
                      `Tried extracting single bit,`
                    + ` but multiple found: ${found}, ${i}`
                )
            }
            found = i;
        }
        if(found<0) {
            throw new Error(`Not a valid uint32 bitmask: ${mask}`)
        }
        return found;
    },

    ToString(signed: boolean, value: number) {
        return (signed && value == -1)
            ? '1'.repeat(32)
            : value.toString(2)
    },

    set(signed: boolean, value: number) {
        return this.sign32(signed,value);
    },

    setBit(signed: boolean, no: number, value: boolean, oldValue: number) {
        if(value) {
            if(!signed || oldValue != -1) {
                return this.set(signed, (oldValue | 1 << no)>>>0);
            }
        } else {
            if(signed && oldValue == -1 && no < 32 && no >= 0) {
                return 0xffffffff
            }
            return this.set(signed, (oldValue & ~(1 << no))>>>0);
        }
        return oldValue;
    },

    getBit(signed: boolean, no: number, oldValue: number) {
        return (signed && oldValue == -1)
            || ((oldValue) & ((1 << no))>>>0) !== 0;
    },

    flip(signed: boolean, oldValue: number) {
        return (signed && oldValue === 0) ? -1 : ~oldValue>>>0
    },

    or(signed: boolean, mask: number, oldValue: number) {
        if(signed && oldValue === -1) return -1;
        let v = oldValue | mask;
        return this.sign32(signed,v);
    },

    not(signed: boolean, mask: number, oldValue: number) {
        let v = this.unsign32(signed,oldValue);
        v = v & (~mask>>>0)
        return this.sign32(signed,v);
    },

    and(signed: boolean, mask: number, oldValue: number) {
        let v = this.unsign32(signed,oldValue);
        v = v & mask;
        return this.sign32(signed,v);
    },

    xor(signed: boolean, mask: number, oldValue: number) {
        let v = this.unsign32(signed,oldValue);
        v = v ^ mask;
        return this.sign32(signed,v);
    },

    nor(signed: boolean, mask: number, oldValue: number) {
        let v = this.unsign32(signed,oldValue);
        v = ~(mask|v)>>>0;
        return this.sign32(signed,v);
    },

    mask(bits: number|number[]) {
        if(!Array.isArray(bits)) bits = [bits];
        return bits.reduce((p,c)=>(p|(1<<c)),0);
    }
}

export class MaskCell32<T> extends MaskCell<T> {
    extract_bits(mask: number, signed: boolean = false) {
        return this.multibits(MaskCell32Impl.bits_from(mask,signed));
    }

    extract_bit(mask: number) {
        return this.bit(MaskCell32Impl.bit_from(mask));
    }

    @Transient
    protected cell: Cell<number, any>;
    protected readonly signed: boolean;

    constructor(owner: T, cell: Cell<number, any>, signed = false) {
        super(owner);
        this.cell = cell;
        this.signed = signed;
    }

    flip() {
        return this.set(MaskCell32Impl.flip(this.signed, this.cell.get()))
    }

    toString() {
        return MaskCell32Impl.ToString(this.signed, this.cell.get());
    }

    clearAll() {
        this.cell.set(0);
        return this.owner;
    }

    setBit(no: number, value: Bit) {
        this.cell.set(
            MaskCell32Impl.setBit(this.signed,no,value as boolean,this.cell.get())
        )
        return this.owner;
    }

    getBit(no: number): boolean {
        return MaskCell32Impl.getBit(this.signed, no, this.cell.get());
    }

    get(): number {
        return this.cell.get();
    }

    add(bits: number|number[]) {
        return this.setOr(MaskCell32Impl.mask(bits));
    }

    remove(bits: number|number[]) {
        return this.setNot(MaskCell32Impl.mask(bits));
    }

    getOr(mask: number) {
        return MaskCell32Impl.or(this.signed,mask,this.cell.get());
    }
    setOr(mask: number) { return this.set(this.getOr(mask)); }

    getNot(mask: number) {
        return MaskCell32Impl.not(this.signed,mask,this.cell.get())
    }
    setNot(mask: number) { return this.set(this.getNot(mask)); }

    getAnd(mask: number) {
        return MaskCell32Impl.and(this.signed,mask,this.cell.get())
    }

    setAnd(mask: number) {
        return this.set(this.getAnd(mask));
    }

    getXor(mask: number) {
        return MaskCell32Impl.xor(this.signed,mask,this.cell.get())
    }

    setXor(mask: number) {
        return this.set(this.getXor(mask));
    }

    getNor(mask: number) {
        return MaskCell32Impl.nor(this.signed,mask,this.cell.get())
    }

    setNor(mask: number) {
        return this.set(this.getNor(mask));
    }

    set(value: number) {
        this.cell.set(MaskCell32Impl.set(this.signed,value));
        return this.owner;
    }

    protected deserialize(value: any) {
        this.set(value);
    }

    protected bit(no: number): MaskBit<T,this> { return new MaskBit(this, no); }
    protected mask(mask: number): MaskPart<T,this> { return new MaskPart(this, mask); }
}

export class MaskCell32ReadOnly<T> extends MaskCellReadOnly<T> {
    @Transient
    protected cell: CellReadOnly<number, any>;
    protected readonly signed: boolean;

    constructor(owner: T, cell: CellReadOnly<number, any>, signed = false) {
        super(owner);
        this.cell = cell;
        this.signed = signed;
    }

    toString() {
        return MaskCell32Impl.ToString(this.signed, this.cell.get());
    }

    getBit(no: number): boolean {
        return MaskCell32Impl.getBit(this.signed, no, this.cell.get());
    }

    get(): number {
        return this.cell.get();
    }

    extract_bits(mask: number, signed: boolean = false) {
        return this.multibits(MaskCell32Impl.bits_from(mask,signed));
    }

    extract_bit(mask: number) {
        return this.bit(MaskCell32Impl.bit_from(mask));
    }

    getOr(mask: number) {
        return MaskCell32Impl.or(this.signed,mask,this.cell.get());
    }
    protected setOr(mask: number) { return this.set(this.getOr(mask)); }

    getNot(mask: number) {
        return MaskCell32Impl.not(this.signed,mask,this.cell.get())
    }
    protected setNot(mask: number) { return this.set(this.getNot(mask)); }

    getAnd(mask: number) {
        return MaskCell32Impl.and(this.signed,mask,this.cell.get())
    }

    protected setAnd(mask: number) {
        return this.set(this.getAnd(mask));
    }

    getXor(mask: number) {
        return MaskCell32Impl.xor(this.signed,mask,this.cell.get())
    }

    protected setXor(mask: number) {
        return this.set(this.getXor(mask));
    }

    getNor(mask: number) {
        return MaskCell32Impl.nor(this.signed,mask,this.cell.get())
    }

    protected setNor(mask: number) {
        return this.set(this.getNor(mask));
    }


    protected set(value: number) {
        CellReadOnly.set(this.cell, MaskCell32Impl.set(this.signed, value));
        return this.owner;
    }

    protected flip() {
        return this.set(MaskCell32Impl.flip(this.signed, this.cell.get()))
    }

    protected setBit(no: number, value: Bit): T {
        CellReadOnly.set(this.cell,MaskCell32Impl.setBit(this.signed,no,value as boolean,this.cell.get()))
        return this.owner;
    }

    protected clearAll(): T {
        CellReadOnly.set(this.cell,0);
        return this.owner;
    }

    protected deserialize(value: any): void {
        this.set(value);
    }

    protected bit(no: number): MaskBitReadOnly<T,MaskCell32ReadOnly<T>> {
        return new MaskBitReadOnly(this, no);
    }

    protected mask(mask: number): MaskPartReadOnly<T,this> {
        return new MaskPartReadOnly(this, mask);
    }
}

export type MaskCon<T> = T|(T|number)[]|number|undefined
export function makeMask(obj: any, value: MaskCon<any>): number {
    if(value === undefined) return 0;
    if(typeof(value) === 'number') return value;
    if(typeof(value) === 'string') return obj[value];
    if(Array.isArray(value)) return value
        .reduce<number>((p,c)=>p|makeMask(obj,c),0)
    throw new Error(`Unknown MaskCell value: ${value}`)
}
export abstract class MaskCell32T<T,Str> extends MaskCell32<T> {
    protected abstract obj(): any;
    protected mm(value: MaskCon<Str>) {
        return makeMask(this.obj(),value);
    }

    set(value: MaskCon<Str>)    { return super.set(this.mm(value)) }
    setOr(value: MaskCon<Str>)  { return super.setOr(this.mm(value)) }
    getOr(value: MaskCon<Str>)  { return super.getOr(this.mm(value)) }
    add(value: MaskCon<Str>)    { return super.setOr(this.mm(value)) }
    hasAll(value: MaskCon<Str>) {
        let v = this.mm(value);
        return super.getAnd(v) === v;
    }
    hasAny(value: MaskCon<Str>) { return this.getOr(value) !== 0; }
    remove(value: MaskCon<Str>) { return super.setNot(this.mm(value)) }
    setNor(value: MaskCon<Str>) { return super.setNor(this.mm(value)) }
    getNor(value: MaskCon<Str>) { return super.getNor(this.mm(value)) }
    setXor(value: MaskCon<Str>) { return super.setXor(this.mm(value)) }
    getXor(value: MaskCon<Str>) { return super.getXor(this.mm(value)) }
    setAnd(value: MaskCon<Str>) { return super.setAnd(this.mm(value)) }
    getAnd(value: MaskCon<Str>) { return super.getAnd(this.mm(value)) }
    setNot(value: MaskCon<Str>) { return super.setNot(this.mm(value)) }
    getNot(value: MaskCon<Str>) { return super.getNot(this.mm(value)) }
}

export abstract class MaskCell32TReadOnly<T,Str> extends MaskCell32ReadOnly<T> {
    protected abstract obj(): any;
    protected mm(value: MaskCon<Str>) {
        return makeMask(this.obj(),value);
    }

    protected set(value: MaskCon<Str>)    { return super.set(this.mm(value)) }
    protected setOr(value: MaskCon<Str>)  { return super.setOr(this.mm(value)) }
    getOr(value: MaskCon<Str>)  { return super.getOr(this.mm(value)) }
    protected add(value: MaskCon<Str>)    { return super.setOr(this.mm(value)) }
    hasAll(value: MaskCon<Str>) {
        let v = this.mm(value);
        return super.getAnd(v) === v;
    }
    hasAny(value: MaskCon<Str>) { return this.getOr(value) !== 0; }
    protected remove(value: MaskCon<Str>) { return super.setNot(this.mm(value)) }
    protected setNor(value: MaskCon<Str>) { return super.setNor(this.mm(value)) }
    getNor(value: MaskCon<Str>) { return super.getNor(this.mm(value)) }
    protected setXor(value: MaskCon<Str>) { return super.setXor(this.mm(value)) }
    getXor(value: MaskCon<Str>) { return super.getXor(this.mm(value)) }
    protected setAnd(value: MaskCon<Str>) { return super.setAnd(this.mm(value)) }
    getAnd(value: MaskCon<Str>) { return super.getAnd(this.mm(value)) }
    protected setNot(value: MaskCon<Str>) { return super.setNot(this.mm(value)) }
    getNot(value: MaskCon<Str>) { return super.getNot(this.mm(value)) }
}