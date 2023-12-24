import { ValueTypes, RuntimeValue, NumberValue, MK_NULL } from "./values.ts";
import { BinaryExpression, Identifier, NodeType, NumericLiteral, Program, Statement } from "../interpretor/ast.ts";
import Environment from "./environment.ts";

function evalProgram(program: Program, env: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = MK_NULL();

    for(const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}

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

function evaluateBinaryExpression(binop: BinaryExpression, env: Environment): RuntimeValue {
    const left = evaluate(binop.left, env);
    const right = evaluate(binop.right, env);

    if(left.type == "number" && right.type == "number") {
        return evalNumericExpression(binop.operator, left as NumberValue, right as NumberValue);
    }

    // One or both of the operands are Null
    return MK_NULL();
}

function evalIdentifier(identifier: Identifier, env: Environment): RuntimeValue {
    return env.getVar(identifier.symbol);
}

export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
    switch(astNode.kind) {
        case "Program":
            return evalProgram(astNode as Program, env);
        
        case "Identifier":
            return evalIdentifier(astNode as Identifier, env);
        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression, env);
        case "NumericLiteral":
            return { 
                value: (astNode as NumericLiteral).value, 
                type: "number" 
            } as NumberValue;
        
        default:
            console.error("Unknown AST Node:", astNode.kind);
            Deno.exit(1);
    }
}