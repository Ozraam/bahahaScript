import { ValueTypes, RuntimeValue, NumberValue, MK_NULL } from "./values.ts";
import { AssignmentExpression, BinaryExpression, Identifier, NodeType, NumericLiteral, ObjectLiteral, Program, Statement, VariableDeclaration } from "../interpretor/ast.ts";
import Environment from "./environment.ts";
import { evalAssignmentExpression, evalIdentifier,evalObjectExpression,evaluateBinaryExpression } from "./eval/expressions.ts";
import { evalProgram, evalVariableDeclaration } from "./eval/statements.ts";


export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
    switch(astNode.kind) {
        case "Program":
            return evalProgram(astNode as Program, env);
        
        case "Identifier":
            return evalIdentifier(astNode as Identifier, env);

        case "ObjectLiteral":
            return evalObjectExpression(astNode as ObjectLiteral, env);

        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression, env);
        case "NumericLiteral":
            return { 
                value: (astNode as NumericLiteral).value, 
                type: "number" 
            } as NumberValue;
        
        case "VariableDeclaration":
            return evalVariableDeclaration(astNode as VariableDeclaration, env);
        
        case "AssignmentExpression":
            return evalAssignmentExpression(astNode as AssignmentExpression, env);
        
        default:
            console.error("Unknown AST Node:", astNode.kind);
            Deno.exit(1);
    }
}

