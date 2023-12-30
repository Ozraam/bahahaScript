export enum TokenType {
    // Literals
    Number,
    Identifier,

    // Keywords
    Let,
    Const,
    Fn,
    If,
    Else,
    While,

    // Grouping and operators
    Equals,
    OpenParenthesis,
    CloseParenthesis,
    BinaryOperator,
    OpenBrace,
    CloseBrace,
    openBracket,
    closeBracket,


    EOF, // End of file
    Semicolon,
    Comma,
    Colon,
    Dot,
    String,

    Unknown,
    Import,
}

const KEYWORDS : Record<string, {token: TokenType, value: string}> = {
    "let": {token: TokenType.Let, value: "let"},
    "const": {token: TokenType.Const, value: "const"},
    "fn": {token: TokenType.Fn, value: "fn"},
    "if": {token: TokenType.If, value: "if"},
    "else": {token: TokenType.Else, value: "else"},
    "while": {token: TokenType.While, value: "while"},
    "import": {token: TokenType.Import, value: "import"},
};

export interface Token {
    type: TokenType;
    value: string;
}

function isBinaryOperator(c: string) : boolean {
    return c === "+" || c === "-" || c === "*" || c === "/" || c === "%";
}

function isWhitespace(c: string) : boolean {
    return c === " " || c === "\t" || c === "\n" || c === "\r";
}

function isDigit(c: string) : boolean {
    return /[0-9]/.test(c);
}

function isLetter(c: string) : boolean {
    if (c === undefined) {
        return false;
    }
    return /[a-z]/i.test(c);
}

function isBooleanOperator(c: string) : boolean {
    return c === "=" || c === "!" || c === "<" || c === ">" || c === "&" || c === "|";
}

function token(type: TokenType, value: string) : Token {
    return { type, value };
}

export function tokenize(src: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    while (i < src.length) {
        const c = src[i];
        
        if (c === "(") {
            tokens.push({ type: TokenType.OpenParenthesis, value: c });
            i++;
        } else if (c === ")") {
            tokens.push({ type: TokenType.CloseParenthesis, value: c });
            i++;
        } else if (c === "{") {
            tokens.push({ type: TokenType.OpenBrace, value: c });
            i++;
        } else if (c === "}") {
            tokens.push({ type: TokenType.CloseBrace, value: c });
            i++;
        } else if (c === "[") {
            tokens.push({ type: TokenType.openBracket, value: c });
            i++;
        } else if (c === "]") {
            tokens.push({ type: TokenType.closeBracket, value: c });
            i++;
        } else if (c === ",") {
            tokens.push({ type: TokenType.Comma, value: c });
            i++;
        } else if (c === ":") {
            tokens.push({ type: TokenType.Colon, value: c });
            i++;
        } else if (c === ".") {
            tokens.push({ type: TokenType.Dot, value: c });
            i++;
        }
        else if (isBinaryOperator(c)) {
            tokens.push({ type: TokenType.BinaryOperator, value: c });
            i++;
        } else if (isWhitespace(c)) {
            i++;
        } else if(c === ";") {
            tokens.push({ type: TokenType.Semicolon, value: c });
            i++;
        } else if(c === "\"") {
            let value = "";
            i++;
            while(src[i] !== "\"" && src[i] !== undefined) {
                value += src[i];
                i++;
            }

            tokens.push({ type: TokenType.String, value: value });
            i++;
        } 
        
        else {
            // Check for multi-character tokens


            if (isDigit(c)) {
                const start = i;
                // Loop until we find a non-digit character by incrementing i in the condition
                while (isDigit(src[++i]));

                // Add the number token
                tokens.push(token(TokenType.Number, src.slice(start, i)));
            } else if (isLetter(c)) {
                const start = i;
                // Loop until we find a non-letter character by incrementing i in the condition
                while (isLetter(src[++i]));

                // Add the identifier token
                const value = src.slice(start, i);
                const reservedType = KEYWORDS[value];
                
                const type = reservedType != undefined ? reservedType : {token: TokenType.Identifier, value: value};

                tokens.push(token(type.token, type.value));
            } else if (isBooleanOperator(c)) {
                let value = "";
                while(isBooleanOperator(src[i])) {
                    value += src[i];
                    i++;
                }

                if(value === "=") {
                    tokens.push(token(TokenType.Equals, value));
                } else tokens.push(token(TokenType.BinaryOperator, value));
            }
            
            else {
                console.log("Unexpected character: " + c);
                Deno.exit(1); 
            }
        }
    }
    tokens.push(token(TokenType.EOF, "EndOfFile"));
    return tokens;
}
