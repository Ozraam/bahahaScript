export type ValueTypes =
    | "null"
    | "number"
    | "boolean";

export interface RuntimeValue {
    type: ValueTypes;
}

export interface NullValue extends RuntimeValue {
    type: "null";
    value: null;
}

export interface NumberValue extends RuntimeValue {
    type: "number";
    value: number;
}

export interface BooleanValue extends RuntimeValue {
    type: "boolean";
    value: boolean;
}

export function MK_NULL() : NullValue {
    return { type: "null", value: null };
}

export function MK_NUMBER(value: number) : NumberValue {
    return { type: "number", value };
}

export function MK_BOOLEAN(value: boolean) : BooleanValue {
    return { type: "boolean", value };
}