import { FunctionDeclaration, IfStatement, Program, VariableDeclaration, WhileStatement } from "../../interpretor/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeValue,MK_NULL, FunctionValue, BooleanValue } from "../values.ts";

export function evalProgram(program: Program, env: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = MK_NULL();

    for(const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}

export function evalVariableDeclaration(astNode: VariableDeclaration,env: Environment): RuntimeValue {
    return env.declareVar(astNode.identifier, astNode.value ? evaluate(astNode.value, env) : MK_NULL(), astNode.const);
}

export function evalFunctionDeclaration(astNode: FunctionDeclaration, env: Environment): RuntimeValue {
    const fn = {
        type: "function",
        identifier: astNode.identifier,
        parameters: astNode.parameters,
        body: astNode.body,
        env: env
    } as FunctionValue;

    env.declareVar(astNode.identifier, fn, true);

    return fn;
}

export function evalIfStatement(astNode: IfStatement, env: Environment): RuntimeValue {
    const condition = evaluate(astNode.condition, env);

    if(condition.type !== "boolean") {
        console.error("If statement condition must be a boolean");
        Deno.exit(1);
    }

    let lastEvaluated: RuntimeValue = MK_NULL();

    if((condition as BooleanValue).value) {
        astNode.then.forEach(stat => {
            lastEvaluated = evaluate(stat, env);
        });
    } else if(astNode.else) {
        astNode.else.forEach(stat => {
            lastEvaluated = evaluate(stat, env);
        });
    }

    return lastEvaluated;
}

export function evalWhileStatement(astNode: WhileStatement, env: Environment): RuntimeValue {
    let condition = evaluate(astNode.condition, env);

    if(condition.type !== "boolean") {
        console.error("While statement condition must be a boolean");
        Deno.exit(1);
    }

    let lastEvaluated: RuntimeValue = MK_NULL();

    while((condition as BooleanValue).value) {
        astNode.body.forEach(stat => {
            lastEvaluated = evaluate(stat, env);
        });

        condition = evaluate(astNode.condition, env);
    }

    return lastEvaluated;
}