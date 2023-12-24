// deno-lint-ignore-file no-empty-interface
export type NodeType = 
    // Statements
    | "Program" 
    | "VariableDeclaration"

    // Expressions
    | "BinaryExpression"
    | "Identifier" 
    | "NumericLiteral"

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






export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression";
    operator: string;
    left: Expression;
    right: Expression;
}

export interface Identifier extends Expression {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral";
    value: number;
}

