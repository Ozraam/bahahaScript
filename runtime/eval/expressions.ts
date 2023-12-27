import { AssignmentExpression, BinaryExpression,CallExpression,Identifier, MemberExpression, ObjectLiteral } from "../../interpretor/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { NumberValue,RuntimeValue,MK_NULL, ObjectValue, NativeFunctionValue, FunctionValue } from "../values.ts";

function evalNumericExpression(operator: string, left: NumberValue, right: NumberValue): RuntimeValue {
    switch(operator) {
        case "+":
            return { type: "number", value: left.value + right.value } as NumberValue;
        case "-":
            return { type: "number", value: left.value - right.value } as NumberValue;
        case "*":
            return { type: "number", value: left.value * right.value } as NumberValue;
        case "/":
            // TODO: Handle divide by zero
            return { type: "number", value: left.value / right.value } as NumberValue;
        case "%":
            return { type: "number", value: left.value % right.value } as NumberValue;
        case "==":
            return { type: "boolean", value: left.value == right.value } as RuntimeValue;
        case "!=":
            return { type: "boolean", value: left.value != right.value } as RuntimeValue;
        case ">":
            return { type: "boolean", value: left.value > right.value } as RuntimeValue;
        case "<":
            return { type: "boolean", value: left.value < right.value } as RuntimeValue;
        case ">=":
            return { type: "boolean", value: left.value >= right.value } as RuntimeValue;
        case "<=":
            return { type: "boolean", value: left.value <= right.value } as RuntimeValue;
        case "&&":
            return { type: "boolean", value: left.value && right.value } as RuntimeValue;
        case "||":
            return { type: "boolean", value: left.value || right.value } as RuntimeValue;
        default:
            console.error("Unknown operator:", operator);
            Deno.exit(1);
    }
}

export function evaluateBinaryExpression(binop: BinaryExpression, env: Environment): RuntimeValue {
    const left = evaluate(binop.left, env);
    const right = evaluate(binop.right, env);

    return evalNumericExpression(binop.operator, left as NumberValue, right as NumberValue);
}

export function evalIdentifier(identifier: Identifier, env: Environment): RuntimeValue {
    return env.getVar(identifier.symbol);
}

export function evalAssignmentExpression(node: AssignmentExpression, env: Environment): RuntimeValue {
    if(node.assigne.kind == "Identifier") {
        const identifier = node.assigne as Identifier;
        const value = evaluate(node.value, env);

        env.assignVar(identifier.symbol, value);
        return value;
    } else if(node.assigne.kind == "MemberExpression") {
        const memberExpression = node.assigne as MemberExpression;
        const object = evaluate(memberExpression.object, env);

        if(object.type != "object") {
            console.error("Member access on non-object");
            Deno.exit(1);
        }

        if(memberExpression.property.kind != "Identifier") {
            console.error("Member access with non-identifier");
            Deno.exit(1);
        }

        const propertyIdentifier = memberExpression.property as Identifier;

        const property = (object as ObjectValue).properties.get(propertyIdentifier.symbol);
        
        if(property == undefined) {
            console.error("Property not found");
            Deno.exit(1);
        }

        const value = evaluate(node.value, env);

        (object as ObjectValue).properties.set(propertyIdentifier.symbol, value);

        return value;
    }

    console.error("Assignment to non-identifier");
    Deno.exit(1);

    return MK_NULL();
}

export function evalObjectExpression(obj: ObjectLiteral, env: Environment) : RuntimeValue {
    const object = { type: "object", properties: new Map() } as ObjectValue;
    for(const { key, value } of obj.properties) {
        const runtimeValue : RuntimeValue = value  ? evaluate(value, env) : env.getVar(key);


        object.properties.set(key, runtimeValue);
    }
    return object;
}

export function evalCallExpression(expression: CallExpression, env: Environment) {
    const args = expression.args.map(arg => evaluate(arg, env));
    const fn = evaluate(expression.callee, env);

    if(fn.type == "native_function") {
        const result = (fn as NativeFunctionValue).fn(args, env);
        return result;
        
    } else if(fn.type == "function") {
        const fnValue = fn as FunctionValue;
        const scope = new Environment(fnValue.env);

        for(let i = 0; i < fnValue.parameters.length; i++) {
            scope.declareVar(fnValue.parameters[i], args[i], true);
        }

        let lastEvaluated: RuntimeValue = MK_NULL();

        for(const statement of fnValue.body) {
            lastEvaluated = evaluate(statement, scope);
        }

        return lastEvaluated;
    }

    
    console.error("Calling non-function " + fn.type);
    Deno.exit(1);
}

export function evalMemberExpression(node: MemberExpression, env: Environment): RuntimeValue {
    const object = evaluate(node.object, env);
    
    if(object.type != "object") {
        console.error("Member access on non-object");
        Deno.exit(1);
    }

    if(node.property.kind != "Identifier") {
        console.error("Member access with non-identifier");
        Deno.exit(1);
    }

    const propertyIdentifier = node.property as Identifier;

    const property = (object as ObjectValue).properties.get(propertyIdentifier.symbol);
    
    if(property == undefined) {
        console.error("Property not found");
        Deno.exit(1);
    }

    return property;
}