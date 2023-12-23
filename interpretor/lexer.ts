export enum TokenType {
    // Literals
    Null,
    Number,
    Identifier,

    // Keywords
    Let,

    // Grouping and operators
    Equals,
    OpenParenthesis,
    CloseParenthesis,
    BinaryOperator,
    EOF, // End of file
}

const KEYWORDS : Record<string, TokenType> = {
    "let": TokenType.Let,
    "null": TokenType.Null,
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

function token(type: TokenType, value: string) : Token {
    return { type, value };
}

export function tokenize(src: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    while (i < src.length) {
        const c = src[i];
        
        if (c === "=") {
            tokens.push({ type: TokenType.Equals, value: c });
            i++;
        } else if (c === "(") {
            tokens.push({ type: TokenType.OpenParenthesis, value: c });
            i++;
        } else if (c === ")") {
            tokens.push({ type: TokenType.CloseParenthesis, value: c });
            i++;
        } else if (isBinaryOperator(c)) {
            tokens.push({ type: TokenType.BinaryOperator, value: c });
            i++;
        } else if (isWhitespace(c)) {
            i++;
        } else {
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

                const type = typeof reservedType == "number" ? reservedType : TokenType.Identifier;

                tokens.push(token(type, value));
            } else {
                console.log("Unexpected character: " + c);
                Deno.exit(1); 
            }
        }
    }
    tokens.push(token(TokenType.EOF, "EndOfFile"));
    return tokens;
}
