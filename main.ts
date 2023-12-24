import Parser from "./interpretor/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_BOOLEAN, MK_NULL, MK_NUMBER, NumberValue } from "./runtime/values.ts";

async function run(filename: string) {
    const parser = new Parser();
    const env : Environment = new Environment();
    
    const file = await Deno.readTextFile(filename);
    const program = parser.produceAST(file);
    const result = evaluate(program, env);
    console.log(result);
}

function repl() {
    const parser = new Parser();
    console.log("Welcome to the REPL! Type 'exit' to quit. v0.0.1");
    const env : Environment = new Environment();

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

const args = Deno.args;
if(args.length === 0) {
    repl();
} else {
    run(args[0]);
}