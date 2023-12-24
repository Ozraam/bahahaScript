import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier, VariableDeclaration, AssignmentExpression } from "./ast.ts";
import { tokenize, Token, TokenType} from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private notEOF() : boolean {
        return this.tokens[0].type !== TokenType.EOF;
    }

    private at() : Token {
        return this.tokens[0];
    }

    private consume() : Token {
        return this.tokens.shift() as Token;
    }

    private consumeAndExpect(type: TokenType, message: string) : Token {
        const token = this.consume();
        if (token.type !== type) {
            console.error("Parser Error:", message, "Found", token.value, "instead");
            Deno.exit(1);
        }
        return token;
    }

    public produceAST(srcCode: string): Program {
        
        this.tokens = tokenize(srcCode);
        
        const program: Program = {
            kind: "Program",
            body: []
        };

        while (this.notEOF()) {
            program.body.push(this.parseStatement());
        }
        

        return program
    }

    private parseStatement(): Statement {
        switch(this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parseVariableDeclaration();

            default:
                return this.parseExpression();
        }
    }

    private parseVariableDeclaration(): Statement {
        const isConst = this.consume().type == TokenType.Const;
        const identifier = this.consumeAndExpect(TokenType.Identifier, "Expected identifier").value;

        if(this.at().type == TokenType.Semicolon) {
            if(isConst) {
                console.error("Parser Error: Const variable must be initialized");
                Deno.exit(1);
            }
            this.consume();
            return { kind: "VariableDeclaration", const: isConst, identifier } as VariableDeclaration;
        }

        this.consumeAndExpect(TokenType.Equals, "Expected '='");

        const value = this.parseExpression();

        this.consumeAndExpect(TokenType.Semicolon, "Expected ';'");
        return { kind: "VariableDeclaration", const: isConst, identifier, value } as VariableDeclaration;
    }

    private parseExpression(): Expression {
        return this.parseAssignmentExpression();
    }

    private parseAssignmentExpression(): Expression {
        const left = this.parseAdditiveExpression();

        if(this.at().type == TokenType.Equals) {
            this.consume();
            const right = this.parseAssignmentExpression();

            return {
                kind: "AssignmentExpression",
                assigne: left,
                value: right
            } as AssignmentExpression;
        }

        return left;
    }

    private parseAdditiveExpression(): Expression {
        let left = this.parseMultiplicaticeExpression();

        while(this.at().value == "+" || this.at().value == "-") {
            const operator = this.consume().value;
            const right = this.parseMultiplicaticeExpression();

            left = {
                kind: "BinaryExpression",
                operator,
                left,
                right
            } as BinaryExpression;
        }

        return left;
    }

    private parseMultiplicaticeExpression(): Expression {
        let left = this.parsePrimaryExpression();

        while(this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.consume().value;
            const right = this.parsePrimaryExpression();

            left = {
                kind: "BinaryExpression",
                operator,
                left,
                right
            } as BinaryExpression;
        }

        return left;
    }

    private parsePrimaryExpression(): Expression {
        const token = this.at().type;

        switch(token) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.consume().value } as Identifier;
            case TokenType.Number:
                return { kind: "NumericLiteral", value: Number(this.consume().value) } as NumericLiteral;

            case TokenType.OpenParenthesis: {
                this.consume();
                const expression = this.parseExpression();
                this.consumeAndExpect(
                    TokenType.CloseParenthesis, 
                    "Expected closing parenthesis"
                );
                return expression;
            }

            default:
                console.error("Unexpected token found during parsing: ", this.at());
                Deno.exit(1);
        }
    }
}