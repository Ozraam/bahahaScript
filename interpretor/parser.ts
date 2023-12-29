import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier, VariableDeclaration, AssignmentExpression, PropertyLiteral, ObjectLiteral, CallExpression, MemberExpression, FunctionDeclaration, StringLiteral } from "./ast.ts";
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

            case TokenType.Fn:
                return this.parseFunctionDeclaration();

            case TokenType.If:
                return this.parseIfStatement();

            case TokenType.While:
                return this.parseWhileStatement();

            default:
                return this.parseExpression();
        }
    }

    parseFunctionDeclaration(): Statement {
        this.consume(); // eat fn
        const identifier = this.consumeAndExpect(TokenType.Identifier, "Expected identifier").value;
        this.consumeAndExpect(TokenType.OpenParenthesis, "Expected opening parenthesis");

        const parameters = new Array<string>();
        while(this.at().type != TokenType.CloseParenthesis) {
            const param = this.consumeAndExpect(TokenType.Identifier, "Expected identifier for parameters name").value;
            parameters.push(param);

            if(this.at().type != TokenType.CloseParenthesis) {
                this.consumeAndExpect(TokenType.Comma, "Expected ','");
            }
        }

        this.consumeAndExpect(TokenType.CloseParenthesis, "Expected closing parenthesis");

        const body : Statement[] = this.parseBlock();

        return {
            kind: "FunctionDeclaration",
            identifier,
            parameters,
            body
        } as FunctionDeclaration;
    }

    private parseIfStatement(): Statement {
        this.consume(); // eat if
        this.consumeAndExpect(TokenType.OpenParenthesis, "Expected opening parenthesis");
        const condition = this.parseExpression();
        this.consumeAndExpect(TokenType.CloseParenthesis, "Expected closing parenthesis");

        let then : Statement[];

        if(this.at().type == TokenType.OpenBrace) {
            then = this.parseBlock();
        } else {
            then = [this.parseStatement()];
        }

        if(this.at().type == TokenType.Else) {
            this.consume(); // eat else
            let else_body : Statement[];

            if(this.at().type == TokenType.OpenBrace) {
                else_body = this.parseBlock();
            } else {
                else_body = [this.parseStatement()];
            }

            return {
                kind: "IfStatement",
                condition,
                then,
                else: else_body
            } as Statement;
        }

        return {
            kind: "IfStatement",
            condition,
            then
        } as Statement;
    }

    private parseWhileStatement(): Statement {
        this.consume(); // eat while
        this.consumeAndExpect(TokenType.OpenParenthesis, "Expected opening parenthesis");
        const condition = this.parseExpression();
        this.consumeAndExpect(TokenType.CloseParenthesis, "Expected closing parenthesis");

        const body = this.parseBlock();

        return {
            kind: "WhileStatement",
            condition,
            body
        } as Statement;
    }


    private parseBlock() {
      this.consumeAndExpect(TokenType.OpenBrace, "Expected opening brace");
      const body = new Array<Statement>();
      while (this.at().type != TokenType.CloseBrace && this.notEOF()) {
        body.push(this.parseStatement());
      }
      this.consumeAndExpect(TokenType.CloseBrace, "Expected closing brace");
      return body;
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
        const left = this.parseObjectExpression();

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

    parseObjectExpression() : Expression {
        if(this.at().type != TokenType.OpenBrace) {
            return this.parseBooleanAdditiveExpression();
        }

        this.consume();
        const properties = new Array<PropertyLiteral>();

        while(this.notEOF() && this.at().type != TokenType.CloseBrace) {
            const key = this.consumeAndExpect(TokenType.Identifier, "Expected key identifier").value;

            if(this.at().type == TokenType.Comma) {
                this.consume();
                properties.push({key, kind: 'PropertyLiteral'} as PropertyLiteral);
                continue;
            } else if(this.at().type == TokenType.CloseBrace) {
                properties.push({key, kind: 'PropertyLiteral'} as PropertyLiteral);
                break;
            } 

            this.consumeAndExpect(TokenType.Colon, "Expected ':'");
            const value = this.parseExpression();

            properties.push({key, value, kind: 'PropertyLiteral'} as PropertyLiteral);
            if(this.at().type != TokenType.CloseBrace) {
                this.consumeAndExpect(TokenType.Comma, "Expected ','");
            }
        }

        this.consumeAndExpect(TokenType.CloseBrace, "Expected closing brace");
        return {
            kind: "ObjectLiteral",
            properties
        } as ObjectLiteral;
    }

    parseBooleanAdditiveExpression() : Expression {
        let left = this.parseBooleanMultiplicativeExpression();

        while(this.at().value == "||") {
            const operator = this.consume().value;
            const right = this.parseBooleanMultiplicativeExpression();

            left = {
                kind: "BinaryExpression",
                operator,
                left,
                right
            } as BinaryExpression;
        }

        return left;
    }

    parseBooleanMultiplicativeExpression() : Expression {
        let left = this.parseBooleanUnaryExpression();

        while(this.at().value == "&&") {
            const operator = this.consume().value;
            const right = this.parseBooleanUnaryExpression();

            left = {
                kind: "BinaryExpression",
                operator,
                left,
                right
            } as BinaryExpression;
        }

        return left;
    }

    parseBooleanUnaryExpression() : Expression {
        let left = this.parseAdditiveExpression();
        
        while(this.at().value == "==" || this.at().value == "!=" || this.at().value == "<" || this.at().value == ">" || this.at().value == "<=" || this.at().value == ">=") {
            const operator = this.consume().value;
            const right = this.parseAdditiveExpression();

            left = {
                kind: "BinaryExpression",
                operator,
                left,
                right
            } as BinaryExpression;
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
        let left = this.parseCallMemberExpression();

        while(this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.consume().value;
            const right = this.parseCallMemberExpression();

            left = {
                kind: "BinaryExpression",
                operator,
                left,
                right
            } as BinaryExpression;
        }

        return left;
    }
    
    private parseCallMemberExpression() : Expression {
        const member = this.parseMemberExpression();

        if(this.at().type == TokenType.OpenParenthesis) {
            return this.parseCallExpression(member);
        }

        return member;
    }

    private parseCallExpression(caller: Expression) : Expression {
        let call_expr : Expression = {
            kind: "CallExpression",
            callee: caller,
            args: this.parseArguments()
        } as CallExpression;

        if(this.at().type == TokenType.OpenParenthesis) {
            call_expr = this.parseCallExpression(call_expr);
        }

        return call_expr;
    }

    private parseArguments() : Expression[] {
        this.consumeAndExpect(TokenType.OpenParenthesis, "Expected opening parenthesis");
        const args = this.at().type == TokenType.CloseParenthesis ? [] : this.parseArgumentsList();
        this.consumeAndExpect(TokenType.CloseParenthesis, "Expected closing parenthesis");
        return args;
    }

    private parseArgumentsList() : Expression[] {
        const args = [this.parseAssignmentExpression()];

        while(this.at().type == TokenType.Comma) {
            this.consume();
            args.push(this.parseAssignmentExpression());
        }

        return args;
    }

    private parseMemberExpression() : Expression {
        let object = this.parsePrimaryExpression();

        while(this.at().type == TokenType.Dot || this.at().type == TokenType.openBracket) {
            const operator = this.consume();
            let property : Expression;
            let computed : boolean;

            // non-computed
            if(operator.type == TokenType.Dot) {
                computed = false;
                property = this.parsePrimaryExpression();

                if(property.kind != "Identifier") {
                    console.error("Parser Error: Expected identifier");
                    Deno.exit(1);
                }
            } else {
                computed = true;
                property = this.parseExpression();
                this.consumeAndExpect(TokenType.closeBracket, "Expected closing bracket");
            }

            object = {
                kind: "MemberExpression",
                object,
                property,
                computed
            } as MemberExpression;
        }

        return object;
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

            case TokenType.String:
                return { kind: "StringLiteral", value: this.consume().value } as StringLiteral;

            default:
                console.error("Unexpected token found during parsing: ", this.at());
                Deno.exit(1);
        }
    }
}