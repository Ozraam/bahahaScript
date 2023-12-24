import Parser from "./interpretor/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_BOOLEAN, MK_NULL, MK_NUMBER, NumberValue } from "./runtime/values.ts";

function repl() {
    const parser = new Parser();
    console.log("Welcome to the REPL! Type 'exit' to quit. v0.0.1");
    const env : Environment = new Environment();
    env.declareVar("pi", MK_NUMBER(Math.PI));
    env.declareVar("null", MK_NULL());
    env.declareVar("true", MK_BOOLEAN(true));
    env.declareVar("false", MK_BOOLEAN(false));
    while(true) {
        const input = prompt(">> ");
        if (input === null || input === "exit") {
            console.log("Goodbye!");
            Deno.exit(0);
        }
        const program = parser.produceAST(input);

        const result = evaluate(program, env);
        console.log(result);
    }
}

repl();