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
    Assign,
    OpenParenthesis,
    CloseParenthesis,
    BinaryOperator,
    OpenBrace,
    CloseBrace,
    OpenBracket,
    CloseBracket,


    EOF, // End of file
    Semicolon,
    Comma,
    Colon,
    Dot,
    String,

    Unknown,
    Import,

    SchyzoMode,
}

const KEYWORDS_SCHYZO : Record<string, {token: TokenType, value: string}> = {
    "devasted": {token: TokenType.Let, value: "let"},
    "const": {token: TokenType.Const, value: "const"},

    "feur": {token: TokenType.Fn, value: "fn"},

    "eeeeuh": {token: TokenType.If, value: "if"},
    "cringe": {token: TokenType.Else, value: "else"},
    "while": {token: TokenType.While, value: "while"},
    "gitgud": {token: TokenType.Import, value: "import"},

    "greaterThan": {token: TokenType.BinaryOperator, value: ">"},
    "lessThan": {token: TokenType.BinaryOperator, value: "<"},
    "equals": {token: TokenType.BinaryOperator, value: "=="},
    "and": {token: TokenType.BinaryOperator, value: "&&"},
    "or": {token: TokenType.BinaryOperator, value: "||"},
    "greaterOrEquals": {token: TokenType.BinaryOperator, value: ">="},
    "lessOrEquals": {token: TokenType.BinaryOperator, value: "<="},

    "plus": {token: TokenType.BinaryOperator, value: "+"},
    "minus": {token: TokenType.BinaryOperator, value: "-"},
    "times": {token: TokenType.BinaryOperator, value: "*"},
    "divide": {token: TokenType.BinaryOperator, value: "/"},
    "modulo": {token: TokenType.BinaryOperator, value: "%"},

    "assign": {token: TokenType.Assign, value: "="},

    "openParenthesis": {token: TokenType.OpenParenthesis, value: "("},
    "closeParenthesis": {token: TokenType.CloseParenthesis, value: ")"},
    "openBrace": {token: TokenType.OpenBrace, value: "{"},
    "closeBrace": {token: TokenType.CloseBrace, value: "}"},
    "openBracket": {token: TokenType.OpenBracket, value: "["},
    "closeBracket": {token: TokenType.CloseBracket, value: "]"},
    "comma": {token: TokenType.Comma, value: ","},
    "colon": {token: TokenType.Colon, value: ":"},
    "dot": {token: TokenType.Dot, value: "."},
    "semicolon": {token: TokenType.Semicolon, value: ";"},
};

const KEYWORDS : Record<string, {token: TokenType, value: string}> = {
    "let": {token: TokenType.Let, value: "let"},
    "const": {token: TokenType.Const, value: "const"},

    "fn": {token: TokenType.Fn, value: "fn"},

    "if": {token: TokenType.If, value: "if"},
    "else": {token: TokenType.Else, value: "else"},
    "while": {token: TokenType.While, value: "while"},
    "import": {token: TokenType.Import, value: "import"},

    "schyzo": {token: TokenType.SchyzoMode, value: "schyzo"},
}

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
            tokens.push({ type: TokenType.OpenBracket, value: c });
            i++;
        } else if (c === "]") {
            tokens.push({ type: TokenType.CloseBracket, value: c });
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

                if(type.token === TokenType.SchyzoMode) return tokenizeSchyzo(src);

                tokens.push(token(type.token, type.value));
            } else if (isBooleanOperator(c)) {
                let value = "";
                while(isBooleanOperator(src[i])) {
                    value += src[i];
                    i++;
                }

                if(value === "=") {
                    tokens.push(token(TokenType.Assign, value));
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


function tokenizeSchyzo(src: string): Token[] {
    console.log("Schyzo mode activated");
    
    const tokens: Token[] = [];
    let i = 0;
    while (i < src.length) {
        const c = src[i];
        
        if (isWhitespace(c)) {
            i++;
        } else if(c === "\"") {
            // Create a string token 

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

                if(value !== "schyzo") {
                    const reservedType = KEYWORDS_SCHYZO[value];
                    
                    
                    const type = reservedType != undefined ? reservedType : {token: TokenType.Identifier, value: value};

                    tokens.push(token(type.token, type.value));
                }
            } else {
                console.log("Unexpected character: " + c);
                Deno.exit(1); 
            }
        }
    }
    tokens.push(token(TokenType.EOF, "EndOfFile"));
    return tokens;
}