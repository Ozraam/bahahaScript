import { MK_BOOLEAN, MK_NULL, RuntimeValue } from "./values.ts";

function setupEnv(env: Environment) {
    env.declareVar("null", MK_NULL(), true);
    env.declareVar("true", MK_BOOLEAN(true), true);
    env.declareVar("false", MK_BOOLEAN(false), true);
}

export default class Environment {
    private parent?: Environment;

    private variables: Map<string, RuntimeValue>;
    private constants: Set<string>;

    constructor(parent?: Environment) {
        const global = parent === undefined;
        this.parent = parent;
        this.variables = new Map();
        this.constants = new Set();

        if(global) {
            setupEnv(this);
        }
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

    static baseEnv(): Environment {
        const env = new Environment();
        env.declareVar("null", MK_NULL(), true);
        env.declareVar("true", MK_BOOLEAN(true), true);
        env.declareVar("false", MK_BOOLEAN(false), true);
        return env;
    }
}