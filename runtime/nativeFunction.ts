import { RuntimeValue, SimpleValue, MK_NULL, ObjectValue, FunctionValue, BooleanValue, MK_BOOLEAN, ArrayValue, FunctionCall } from "./values.ts";

export function customPrint(args: RuntimeValue[]) : RuntimeValue {
    let output = "";
    for(const arg of args) {
        output += switchArgType(arg);
    }
    console.log(output);
    
    return MK_NULL();
}

function switchArgType(arg: RuntimeValue) {
  switch (arg.type) {
    case "string":
    case "number":
    case "boolean":
    case "null":
      return ((arg as SimpleValue).value ?? "null").toString();
    case "object":
      return printObjectRecursive(arg);
    case "function":
      return "[function " + (arg as FunctionValue).identifier + "]";
    
    case "array":
      return printArrayRecursive(arg as ArrayValue);

    case "native_function":
      return "[native function]";
  }
}

function printObjectRecursive(obj: RuntimeValue, depth = 1) : string {
    if(depth > 10) return "{ ... }";

    const indent = "  ".repeat(depth);
    const indentEnd = "  ".repeat(depth - 1);
    let output = "{\n";
    for(const [key, value] of (obj as ObjectValue).properties) {
        output += indent + key + ": ";
        output += switchArgType(value) + ",\n";
    }
    output += indentEnd + "}";
    return output;
}

export function notBool(args: RuntimeValue[]) {
  return MK_BOOLEAN(!(args[0] as BooleanValue).value);
}

function printArrayRecursive(arr: ArrayValue, depth = 1) : string {
    if(depth > 10) return "[ ... ]";

    const indent = "  ".repeat(depth);
    const indentEnd = "  ".repeat(depth - 1);
    let output = "[";
    for(const value of arr.values) {
        output += indent;
        output += switchArgType(value) + ",";
    }
    output += indentEnd + " ]";
    return output;
}

export function toStr(args: RuntimeValue[]) {
  return { type: "string", value: args[0].toString() } as RuntimeValue;
}

// Array functions
function length(args: RuntimeValue[]) {
  if(args[0].type != "array") {
    console.error("length() called on non-array");
    Deno.exit(1);
  }

  return { type: "number", value: (args[0] as ArrayValue).values.length } as RuntimeValue;
}

function push(args: RuntimeValue[]) {
  if(args[0].type != "array") {
    console.error("push() called on non-array");
    Deno.exit(1);
  }

  (args[0] as ArrayValue).values.push(args[1]);
  return MK_NULL();
}

function pop(args: RuntimeValue[]) {
  if(args[0].type != "array") {
    console.error("pop() called on non-array");
    Deno.exit(1);
  }

  return (args[0] as ArrayValue).values.pop() ?? MK_NULL();
}

function shift(args: RuntimeValue[]) {
  if(args[0].type != "array") {
    console.error("shift() called on non-array");
    Deno.exit(1);
  }

  return (args[0] as ArrayValue).values.shift() ?? MK_NULL();
}

function unshift(args: RuntimeValue[]) {
  if(args[0].type != "array") {
    console.error("unshift() called on non-array");
    Deno.exit(1);
  }

  (args[0] as ArrayValue).values.unshift(args[1]);
  return MK_NULL();
}

export const arrayFunctions = {
  length,
  push,
  pop,
  shift,
  unshift,
} as Record<string, FunctionCall>;