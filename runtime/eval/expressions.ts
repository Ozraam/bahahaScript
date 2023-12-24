import { AssignmentExpression, BinaryExpression,Identifier, ObjectLiteral } from "../../interpretor/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { NumberValue,RuntimeValue,MK_NULL, ObjectValue } from "../values.ts";

function evalNumericExpression(operator: string, left: NumberValue, right: NumberValue): RuntimeValue {
    switch(operator) {
        case "+":
            return { type: "number", value: left.value + right.value } as NumberValue;
        case "-":
            return { type: "number", value: left.value - right.value } as NumberValue;
        case "*":
            return { type: "number", value: left.value * right.value } as NumberValue;
        case "/":
            // TODO: Handle divide by zero
            return { type: "number", value: left.value / right.value } as NumberValue;
        case "%":
            return { type: "number", value: left.value % right.value } as NumberValue;
        default:
            console.error("Unknown operator:", operator);
            Deno.exit(1);
    }
}

export function evaluateBinaryExpression(binop: BinaryExpression, env: Environment): RuntimeValue {
    const left = evaluate(binop.left, env);
    const right = evaluate(binop.right, env);

    if(left.type == "number" && right.type == "number") {
        return evalNumericExpression(binop.operator, left as NumberValue, right as NumberValue);
    }

    // One or both of the operands are Null
    return MK_NULL();
}

export function evalIdentifier(identifier: Identifier, env: Environment): RuntimeValue {
    return env.getVar(identifier.symbol);
}

export function evalAssignmentExpression(node: AssignmentExpression, env: Environment): RuntimeValue {
    if(node.assigne.kind != "Identifier") {
        console.error("Assignment to non-identifier");
        Deno.exit(1);
    }

    const identifier = node.assigne as Identifier;
    const value = evaluate(node.value, env);

    env.assignVar(identifier.symbol, value);

    return value;
}

export function evalObjectExpression(obj: ObjectLiteral, env: Environment) : RuntimeValue {
    const object = { type: "object", properties: new Map() } as ObjectValue;
    for(const { key, value } of obj.properties) {
        const runtimeValue : RuntimeValue = value  ? evaluate(value, env) : env.getVar(key);


        object.properties.set(key, runtimeValue);
    }
    return object;
}