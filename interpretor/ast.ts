// deno-lint-ignore-file no-empty-interface
export type NodeType = 
    | "Program" 
    | "BinaryExpression"
    | "NullLiteral"
    | "Identifier" 
    | "NumberLiteral"

export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
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

export interface NumberLiteral extends Expression {
    kind: "NumberLiteral";
    value: number;
}

export interface NullLiteral extends Expression {
    kind: "NullLiteral";
    value: null;
}