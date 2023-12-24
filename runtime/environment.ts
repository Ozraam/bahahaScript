import { RuntimeValue } from "./values.ts";


export default class Environment {
    private parent?: Environment;

    private variables: Map<string, RuntimeValue>;
    private constants: Set<string>;

    constructor(parent?: Environment) {
        this.parent = parent;
        this.variables = new Map();
        this.constants = new Set();
    }

    public declareVar(varname: string, value: RuntimeValue, constant : boolean = false): RuntimeValue {
        if(this.variables.has(varname)) {
            console.error("Variable", varname, "already declared");
            Deno.exit(1);
        }

        this.variables.set(varname, value);
        if(constant) {
            this.constants.add(varname);
        }
        return value;
    }

    public assignVar(varname: string, value: RuntimeValue): RuntimeValue {
        const env = this.resolveVar(varname)
        
        if(env.constants.has(varname)) {
            console.error("Cannot assign to constant", varname);
            Deno.exit(1);
        }
        env.variables.set(varname, value);
        return value;
    }

    public getVar(varname: string): RuntimeValue {
        return this.resolveVar(varname).variables.get(varname) as RuntimeValue;
    }

    public resolveVar(varname: string): Environment {
        if(this.variables.has(varname)) {
            return this;
        }

        if(this.parent) {
            return this.parent.resolveVar(varname);
        }

        console.error("Variable", varname, "not declared");
        Deno.exit(1);
    }
}