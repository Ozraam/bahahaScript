import { RuntimeValue } from "./values.ts";


export default class Environment {
    private parent?: Environment;

    private variables: Map<string, RuntimeValue>;

    constructor(parent?: Environment) {
        this.parent = parent;
        this.variables = new Map();
    }

    public declareVar(varname: string, value: RuntimeValue): RuntimeValue {
        if(this.variables.has(varname)) {
            console.error("Variable", varname, "already declared");
            Deno.exit(1);
        }

        this.variables.set(varname, value);
        return value;
    }

    public assignVar(varname: string, value: RuntimeValue): RuntimeValue {
        this.resolveVar(varname).variables.set(varname, value);
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