import { RuntimeValue, NumberValue, StringValue } from "./values.ts";
import { ArrayLiteral, AssignmentExpression, BinaryExpression, CallExpression, FunctionDeclaration, Identifier, IfStatement, ImportStatement, MemberExpression, NumericLiteral, ObjectLiteral, Program, Statement, StringLiteral, VariableDeclaration, WhileStatement } from "../interpretor/ast.ts";
import Environment from "./environment.ts";
import { evalArrayLiteral, evalAssignmentExpression, evalCallExpression, evalIdentifier,evalMemberExpression,evalObjectExpression,evaluateBinaryExpression } from "./eval/expressions.ts";
import { evalFunctionDeclaration, evalIfStatement, evalImportStatement, evalProgram, evalVariableDeclaration, evalWhileStatement } from "./eval/statements.ts";


export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
    switch(astNode.kind) {
        case "Program":
            return evalProgram(astNode as Program, env);
        
        case "Identifier":
            return evalIdentifier(astNode as Identifier, env);
        
        case "ArrayLiteral":
            return evalArrayLiteral(astNode as ArrayLiteral, env);

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

        case "MemberExpression":
            return evalMemberExpression(astNode as MemberExpression, env);

        case "IfStatement":
            return evalIfStatement(astNode as IfStatement, env);
        
        case "WhileStatement":
            return evalWhileStatement(astNode as WhileStatement, env);
        
        case "ImportStatement":
            return evalImportStatement(astNode as ImportStatement, env);

        default:
            console.error("Unknown AST Node:", astNode);
            Deno.exit(1);
    }
}

