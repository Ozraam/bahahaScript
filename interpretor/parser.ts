import { Statement, Program, Expression, BinaryExpression, NumberLiteral, Identifier, NullLiteral } from "./ast.ts";
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
        // skip to parseExpression
        return this.parseExpression();
    }

    private parseExpression(): Expression {
        return this.parseAdditiveExpression();
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

            case TokenType.Null:
                this.consume();
                return { kind: "NullLiteral", value: null } as NullLiteral;


            case TokenType.Number:
                return { kind: "NumberLiteral", value: Number(this.consume().value) } as NumberLiteral;

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