# arcsecond-binary

Binary parsers for <a href="https://github.com/francisrstokes/arcsecond">arcsecond</a>!

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

`byte` takes a number (0-255) and returns a parser that matches that number (max 1 byte) **exactly one** time.

**Example**
```javascript
parse (byte (0xAF)) (Buffer.from([0xAF, 0x00, 0x00, 0x00]));
// -> Either.Right(175)
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
parse (byteInRange (0x00) (0x0AA)) (Buffer.from([0x19, 0x00, 0x00, 0x00]));
// -> Either.Right(25)
```

### wordLE

`wordLE :: Number -> Parser String a Number`

`wordLE` takes a little-endian 16-bit number, and returns a parser that matches **exactly two** bytes.

**Example**
```javascript
parse (wordLE(0xFFEE)) (Buffer.from([0xEE, 0xFF]));
// -> Either.Right(65518)
```

### wordBE

`wordLE :: Number -> Parser String a Number`

`wordLE` takes a big-endian 16-bit number, and returns a parser that matches **exactly two** bytes.

**Example**
```javascript
parse (wordLE(0xFFEE)) (Buffer.from([0xFF, 0xEE]));
// -> Either.Right(65518)
```

### doubleWordLE

`doubleWordLE :: Number -> Parser String a Number`

`doubleWordLE` takes a little-endian 32-bit number, and returns a parser that matches **exactly four** bytes.

**Example**
```javascript
parse (doubleWordLE(0xFFEEDDCC)) (Buffer.from([0xCC, 0xDD, 0xEE, 0xFF]));
// -> Either.Right(4293844428)
```

### doubleWordBE

`doubleWordLE :: Number -> Parser String a Number`

`doubleWordLE` takes a big-endian 32-bit number, and returns a parser that matches **exactly four** bytes.

**Example**
```javascript
parse (doubleWordLE(0xFFEEDDCC)) (Buffer.from([0xFF, 0xEE, 0xDD, 0xCC]));
// -> Either.Right(4293844428)
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
