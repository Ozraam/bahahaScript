import { Program, VariableDeclaration } from "../../interpretor/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeValue,MK_NULL } from "../values.ts";

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