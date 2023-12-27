import { RuntimeValue, SimpleValue, MK_NULL, ObjectValue, FunctionValue, BooleanValue, MK_BOOLEAN } from "./values.ts";

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