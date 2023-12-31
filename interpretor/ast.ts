// deno-lint-ignore-file no-empty-interface
export type NodeType = 
    // Statements
    | "Program" 
    | "VariableDeclaration"
    | "FunctionDeclaration"
    | "IfStatement"
    | "WhileStatement"
    | "ImportStatement"


    // Expressions
    | "AssignmentExpression"
    | "MemberExpression"
    | "CallExpression"

    // Literals
    | "PropertyLiteral"
    | "ObjectLiteral"
    | "ArrayLiteral"
    | "BinaryExpression"
    | "Identifier" 
    | "NumericLiteral"
    | "StringLiteral"

export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
}

export interface VariableDeclaration extends Statement {
    kind: "VariableDeclaration";
    const: boolean;
    identifier: string;
    value?: Expression;
}

export interface FunctionDeclaration extends Statement {
    kind: "FunctionDeclaration";
    identifier: string;
    parameters: string[];
    body: Statement[];
}

export interface IfStatement extends Statement {
    kind: "IfStatement";
    condition: Expression;
    then: Statement[];
    else?: Statement[];
}

export interface WhileStatement extends Statement {
    kind: "WhileStatement";
    condition: Expression;
    body: Statement[];
}

export interface ImportStatement extends Statement {
    kind: "ImportStatement";
    path: string;
}


export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression";
    operator: string;
    left: Expression;
    right: Expression;
}

export interface MemberExpression extends Expression {
    kind: "MemberExpression";
    object: Expression;
    property: Expression;
    computed: boolean;
}

export interface CallExpression extends Expression {
    kind: "CallExpression";
    callee: Expression;
    args: Expression[];
}

export interface Identifier extends Expression {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral";
    value: number;
}

export interface StringLiteral extends Expression {
    kind: "StringLiteral";
    value: string;
}

export interface AssignmentExpression extends Expression {
    kind: "AssignmentExpression";
    assigne: Expression;
    value: Expression;
}

export interface PropertyLiteral extends Expression {
    kind: "PropertyLiteral";
    key: string;
    value?: Expression;
}

export interface ObjectLiteral extends Expression {
    kind: "ObjectLiteral";
    properties: PropertyLiteral[];
}

export interface ArrayLiteral extends Expression {
    kind: "ArrayLiteral";
    elements: Expression[];
}