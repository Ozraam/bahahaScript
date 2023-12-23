import Parser from "./interpretor/parser.ts";

function repl() {
    const parser = new Parser();
    console.log("Welcome to the REPL! Type 'exit' to quit. v0.0.1");
    
    while(true) {
        const input = prompt(">> ");
        if (input === null || input === "exit") {
            console.log("Goodbye!");
            Deno.exit(0);
        }
        const program = parser.produceAST(input);
        console.log(program);
    }
}

repl();