import { Statement } from "../interpretor/ast.ts";
import Environment from "./environment.ts";

export type ValueTypes =
    | "null"
    | "number"
    | "string"
    | "boolean"
    | "object"
    | "native_function"
    | "function";

export interface RuntimeValue {
    type: ValueTypes;
}

export interface SimpleValue extends RuntimeValue {
    type: ValueTypes;
    // deno-lint-ignore no-explicit-any
    value: any;
}

export interface NullValue extends RuntimeValue {
    type: "null";
    value: null;
}

export interface NumberValue extends RuntimeValue {
    type: "number";
    value: number;
}

export interface StringValue extends RuntimeValue {
    type: "string";
    value: string;
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

export interface FunctionValue extends RuntimeValue {
    type: "function";
    identifier: string;
    parameters: string[];
    body: Statement[];
    env: Environment;
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