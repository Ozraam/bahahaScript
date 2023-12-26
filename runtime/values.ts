import Environment from "./environment.ts";

export type ValueTypes =
    | "null"
    | "number"
    | "boolean"
    | "object"
    | "native_function"

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

export interface ObjectValue extends RuntimeValue {
    type: "object";
    properties: Map<string, RuntimeValue>;
}

export type FunctionCall = (args: RuntimeValue[], env: Environment) => RuntimeValue;

export interface NativeFunctionValue extends RuntimeValue {
    type: "native_function";
    fn: FunctionCall;
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

export function MK_NATIVE_FUNCTION(fn: FunctionCall) : NativeFunctionValue {
    return { type: "native_function", fn } as NativeFunctionValue;
}