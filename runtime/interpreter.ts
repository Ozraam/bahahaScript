import { ValueTypes, RuntimeValue, NumberValue, MK_NULL, StringValue } from "./values.ts";
import { AssignmentExpression, BinaryExpression, CallExpression, FunctionDeclaration, Identifier, NodeType, NumericLiteral, ObjectLiteral, Program, Statement, StringLiteral, VariableDeclaration } from "../interpretor/ast.ts";
import Environment from "./environment.ts";
import { evalAssignmentExpression, evalCallExpression, evalIdentifier,evalObjectExpression,evaluateBinaryExpression } from "./eval/expressions.ts";
import { evalFunctionDeclaration, evalProgram, evalVariableDeclaration } from "./eval/statements.ts";


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
        
        case "StringLiteral":
            return { 
                value: (astNode as StringLiteral).value, 
                type: "string" 
            } as StringValue;
        
        case "VariableDeclaration":
            return evalVariableDeclaration(astNode as VariableDeclaration, env);
        
        case "FunctionDeclaration":
            return evalFunctionDeclaration(astNode as FunctionDeclaration, env);

        case "AssignmentExpression":
            return evalAssignmentExpression(astNode as AssignmentExpression, env);
        
        case "CallExpression":
            return evalCallExpression(astNode as CallExpression, env);

        default:
            console.error("Unknown AST Node:", astNode);
            Deno.exit(1);
    }
}

