# arcsecond-binary

Binary parsers for <a href="https://github.com/francisrstokes/arcsecond">arcsecond</a>!

- [1. API](#api)
  - [1.1 rawString](#rawString)
  - [1.2 byte](#byte)
  - [1.3 signedByte](#signedbyte)
  - [1.4 anyByte](#anyByte)
  - [1.5 byteInRange](#byteInRange)
  - [1.6 signedByteInRange](#signedbyteInRange)
  - [1.7 wordLE](#wordLE)
  - [1.8 signedWordLE](#signedwordLE)
  - [1.9 wordBE](#wordBE)
  - [1.10 signedWordBE](#signedwordBE)
  - [1.11 doubleWordLE](#doubleWordLE)
  - [1.12 signedDoubleWordLE](#signeddoubleWordLE)
  - [1.13 doubleWordBE](#doubleWordBE)
  - [1.14 signedDoubleWordBE](#signeddoubleWordBE)
  - [1.15 everythingUntil](#everythingUntil)

## API

<a href="https://github.com/francisrstokes/arcsecond#api">Click here for the main `arcsecond` API docs.</a> Most of the parsers there (for example `many`, `sepBy`, `anythingExcept`, `endOfInput` etc) will work with the binary parsers.

### rawString

`rawString :: String -> Parser String a Buffer`

`rawString` takes a string and returns a parser that matches the binary representation **exactly one** time.

**Example**
```javascript
parse (rawString ('HELLO')) (Buffer.from([0x48, 0x45, 0x4c, 0x4c, 0x4f]));
// -> Either.Right(<Buffer 48 45 4c 4c 4f>)
```

### byte

`byte :: String -> Parser String a Number`

`byte` takes a number [0, 255] and returns a parser that matches that number (max 1 byte) **exactly one** time.

**Example**
```javascript
parse (byte (0xAF)) (Buffer.from([0xAF, 0x00, 0x00, 0x00]));
// -> Either.Right(175)
```

### signedByte

`signedByte :: String -> Parser String a Number`

`signedByte` takes a signed number [-128, 127] and returns a parser that matches that number (max 1 byte) **exactly one** time.

**Example**
```javascript
parse (signedByte (-50)) (Buffer.from([0xCE]));
// -> Either.Right(-50)
```

### anyByte

`anyByte :: Parser String a Number`

`anyByte` is a parser that matches a 1 byte number **exactly one** time.

**Example**
```javascript
parse (anyByte) (Buffer.from([0xAF, 0x00, 0x00, 0x00]));
// -> Either.Right(175)
```

### byteInRange

`byteInRange :: Number -> Number -> Parser String a Number`

`byteInRange` takes a `lowest` and a `highest` bound, and returns a parser that matches **exactly one** byte, such that `lowest >= byte <= highest`.

**Example**
```javascript
parse (byteInRange (0x00) (0x0A)) (Buffer.from([0x19, 0x00, 0x00, 0x00]));
// -> Either.Right(25)
```

### signedByteInRange

`signedByteInRange :: Number -> Number -> Parser String a Number`

`signedByteInRange` takes a `lowest` and a `highest` bound, both in range [-128, 127], and returns a parser that matches **exactly one** byte, such that `lowest >= byte <= highest`.

**Example**
```javascript
parse (signedByteInRange (-50) (50)) (Buffer.from([0xFD]));
// -> Either.Right(-3)
```

### wordLE

`wordLE :: Number -> Parser String a Number`

`wordLE` takes a little-endian 16-bit number, and returns a parser that matches **exactly two** bytes.

**Example**
```javascript
parse (wordLE(0xFFEE)) (Buffer.from([0xEE, 0xFF]));
// -> Either.Right(65518)
```

### signedWordLE

`signedWordLE :: Number -> Parser String a Number`

`signedWordLE` takes a signed, little-endian 16-bit number [-32,768, 32,767], and returns a parser that matches **exactly two** bytes.

**Example**
```javascript
parse (signedWordLE(-420)) (Buffer.from([0x5C, 0xFE]));
// -> Either.Right(-420)
```

### wordBE

`wordLE :: Number -> Parser String a Number`

`wordLE` takes a big-endian 16-bit number, and returns a parser that matches **exactly two** bytes.

**Example**
```javascript
parse (wordLE(0xFFEE)) (Buffer.from([0xFF, 0xEE]));
// -> Either.Right(65518)
```

### signedWordBE

`signedWordBE :: Number -> Parser String a Number`

`signedWordBE` takes a signed, big-endian 16-bit number [-32,768, 32,767], and returns a parser that matches **exactly two** bytes.

**Example**
```javascript
parse (signedWordBE(-420)) (Buffer.from([0xFE, 0x5C]));
// -> Either.Right(-420)
```

### doubleWordLE

`doubleWordLE :: Number -> Parser String a Number`

`doubleWordLE` takes a little-endian 32-bit number, and returns a parser that matches **exactly four** bytes.

**Example**
```javascript
parse (doubleWordLE(0xFFEEDDCC)) (Buffer.from([0xCC, 0xDD, 0xEE, 0xFF]));
// -> Either.Right(4293844428)
```

### signedDoubleWordLE

`signedDoubleWordLE :: Number -> Parser String a Number`

`signedDoubleWordLE` takes a signed little-endian 32-bit number [-2,147,483,648, 2,147,483,647], and returns a parser that matches **exactly four** bytes.

**Example**
```javascript
parse (signedDoubleWordLE(-1234567)) (Buffer.from([0x79, 0x29, 0xED, 0xFF]));
// -> Either.Right(-1234567)
```

### doubleWordBE

`doubleWordLE :: Number -> Parser String a Number`

`doubleWordLE` takes a big-endian 32-bit number, and returns a parser that matches **exactly four** bytes.

**Example**
```javascript
parse (doubleWordLE(0xFFEEDDCC)) (Buffer.from([0xFF, 0xEE, 0xDD, 0xCC]));
// -> Either.Right(4293844428)
```

### signedDoubleWordBE

`signedDoubleWordBE :: Number -> Parser String a Number`

`signedDoubleWordBE` takes a signed big-endian 32-bit number [-2,147,483,648, 2,147,483,647], and returns a parser that matches **exactly four** bytes.

**Example**
```javascript
parse (signedDoubleWordBE(-1234567)) (Buffer.from([0xFF, 0xED, 0x29, 0x79]));
// -> Either.Right(-1234567)
```

### everythingUntil

`everythingUntil :: Parser String a b -> Parser String a [Number]`

`everythingUntil` takes a *termination* parser and returns a new parser which matches everything up until a value is matched by the *termination* parser. When a value is matched by the *termination* parser, it is not "consumed".

**Note**: The difference between this function and the `everythingUntil` in arcsecond is that this function does not concatenate the results into a string, but instead returns an array.

**Example**
```javascript
parse (everythingUntil(byte(0xFF))) (Buffer.from([0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xFF]));
// -> Either.Right([1, 1, 1, 1, 1, 1, 1])
```
