# Arcsecond Binary

Binary parsers for <a href="https://github.com/francisrstokes/arcsecond">arcsecond v2</a>!

- [1. API](#api)
  - [1.1 u8](#u8)
  - [1.2 s8](#s8)
  - [1.3 u16LE](#u16LE)
  - [1.4 u16BE](#u16BE)
  - [1.5 s16LE](#s16LE)
  - [1.6 s16BE](#s16BE)
  - [1.7 u32LE](#u32LE)
  - [1.8 u32BE](#u32BE)
  - [1.9 s32LE](#s32LE)
  - [1.10 s32BE](#s32BE)
  - [1.11 exactU8](#exactU8)
  - [1.12 exactS8](#exactS8)
  - [1.13 exactU16LE](#exactU16LE)
  - [1.14 exactU16BE](#exactU16BE)
  - [1.15 exactS16LE](#exactS16LE)
  - [1.16 exactS16BE](#exactS16BE)
  - [1.17 exactU32LE](#exactU32LE)
  - [1.18 exactU32BE](#exactU32BE)
  - [1.19 exactS32LE](#exactS32LE)
  - [1.20 exactS32BE](#exactS32BE)
  - [1.21 rawString](#rawString)
  - [1.22 nullTerminatedString](#nullTerminatedString)

## API

<a href="https://github.com/francisrstokes/arcsecond#api">Click here for the main `arcsecond` API docs.</a> Many of the parser combinators (for example `many`, `sepBy`, `anythingExcept`, `endOfInput` etc) will work with the binary parsers,  but any that specifically assume that the input is a string will not (for example `string`, `letters`, `regex` etc).

### u8

`u8 :: Parser String Number DataView`

`u8` consumes **exactly one** byte, and returns a match that interprets the result as an unsigned integer in the range [0, 255].

**Example**
```javascript
const input = new Uint8Array([0x48, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

u8.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 72,
//      index: 1,
//      data: null
//    }
```

### s8

`s8 :: Parser String Number DataView`

`s8` consumes **exactly one** byte, and returns a match that interprets the result as an unsigned integer in the range [-128, 127].

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

s8.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: -106,
//      index: 1,
//      data: null
//    }
```

### u16LE

`u16LE :: Parser String Number DataView`

`u16LE` consumes **exactly two** bytes, read in little endian order, and returns a match that interprets the result as an unsigned integer in the range [0, 65535].

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

u16LE.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 17814,
//      index: 2,
//      data: null
//    }
```

### u16BE

`u16BE :: Parser String Number DataView`

`u16BE` consumes **exactly two** bytes, read in big endian order, and returns a match that interprets the result as an unsigned integer in the range [0, 65535].

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

u16BE.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 38469,
//      index: 2,
//      data: null
//    }
```

### s16LE

`s16LE :: Parser String Number DataView`

`s16LE` consumes **exactly two** bytes, read in little endian order, and returns a match that interprets the result as a signed integer in the range [-32768, 32767].

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

s16LE.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 17814,
//      index: 2,
//      data: null
//    }
```

### s16BE

`s16BE :: Parser String Number DataView`

`s16BE` consumes **exactly two** bytes, read in big endian order, and returns a match that interprets the result as a signed integer in the range [-32768, 32767].

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

s16BE.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: -27067,
//      index: 2,
//      data: null
//    }
```

### u32LE

`u32LE :: Parser String Number DataView`

`u32LE` consumes **exactly four** bytes, read in little endian order, and returns a match that interprets the result as an unsigned integer in the range [0, 4294967295].

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

u32LE.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 1280066966,
//      index: 4,
//      data: null
//    }
```

### u32BE

`u32BE :: Parser String Number DataView`

`u32BE` consumes **exactly four** bytes, read in big endian order, and returns a match that interprets the result as an unsigned integer in the range [0, 4294967295].

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

u32BE.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 2521123916,
//      index: 4,
//      data: null
//    }
```

### s32LE

`s32LE :: Parser String Number DataView`

`s32LE` consumes **exactly four** bytes, read in little endian order, and returns a match that interprets the result as a signed integer in the range [-2147483648, 2147483647].

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

s32LE.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 1280066966,
//      index: 4,
//      data: null
//    }
```

### s32BE

`s32BE :: Parser String Number DataView`

`s32BE` consumes **exactly four** bytes, read in big endian order, and returns a match that interprets the result as a signed integer in the range [-2147483648, 2147483647].

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

s32BE.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: -1773843380,
//      index: 4,
//      data: null
//    }
```

### exactU8

`exactU8 :: UnsignedByte -> Parser String Number DataView`

`exactU8` takes an unsigned byte `b`, and consumes **exactly one** byte, matching a value equal to `b`, when interpreted as an unsigned integer.

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

exactU8(0x96).run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 150,
//      index: 1,
//      data: null
//    }
```

### exactS8

`exactS8 :: SignedByte -> Parser String Number DataView`

`exactS8` takes a signed byte `b`, and consumes **exactly one** byte, matching a value equal to `b`, when interpreted as a signed integer.

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

exactS8(-106).run(dataViewOfInput);
// -> {
//      isError: false,
//      result: -106,
//      index: 1,
//      data: null
//    }
```

### exactU16LE

`exactU16LE :: UnsignedU16 -> Parser String Number DataView`

`exactU16LE` takes an unsigned 16-bit number `b`, and consumes **exactly two** bytes, matching a value equal to `b`, when interpreted as an unsigned integer in little endian order.

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

exactU16LE(0x4596).run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 17814,
//      index: 1,
//      data: null
//    }
```

### exactU16BE

`exactU16BE :: UnsignedU16 -> Parser String Number DataView`

`exactU16BE` takes an unsigned 16-bit number `b`, and consumes **exactly two** bytes, matching a value equal to `b`, when interpreted as an unsigned integer in big endian order.

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

exactU16BE(0x9645).run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 38469,
//      index: 1,
//      data: null
//    }
```

### exactS16LE

`exactS16LE :: SignedU16 -> Parser String Number DataView`

`exactS16LE` takes an signed 16-bit number `b`, and consumes **exactly two** bytes, matching a value equal to `b`, when interpreted as a signed integer in little endian order.

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

exactS16LE(17814).run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 17814,
//      index: 1,
//      data: null
//    }
```

### exactS16BE

`exactS16BE :: SignedU16 -> Parser String Number DataView`

`exactS16BE` takes an signed 16-bit number `b`, and consumes **exactly two** bytes, matching a value equal to `b`, when interpreted as a signed integer in big endian order.

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

exactS16BE(-27067).run(dataViewOfInput);
// -> {
//      isError: false,
//      result: -27067,
//      index: 1,
//      data: null
//    }
```





### exactU32LE

`exactU32LE :: UnsignedU32 -> Parser String Number DataView`

`exactU32LE` takes an unsigned 32-bit number `b`, and consumes **exactly four** bytes, matching a value equal to `b`, when interpreted as an unsigned integer in little endian order.

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

exactU32LE(0x4c4c4596).run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 1280066966,
//      index: 1,
//      data: null
//    }
```

### exactU32BE

`exactU32BE :: UnsignedU32 -> Parser String Number DataView`

`exactU32BE` takes an unsigned 32-bit number `b`, and consumes **exactly four** bytes, matching a value equal to `b`, when interpreted as an unsigned integer in big endian order.

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

exactU32BE(0x96454c4c).run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 2521123916,
//      index: 1,
//      data: null
//    }
```

### exactS32LE

`exactS32LE :: SignedU32 -> Parser String Number DataView`

`exactS32LE` takes an signed 32-bit number `b`, and consumes **exactly four** bytes, matching a value equal to `b`, when interpreted as a signed integer in little endian order.

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

exactS32LE(1280066966).run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 1280066966,
//      index: 1,
//      data: null
//    }
```

### exactS32BE

`exactS32BE :: SignedU32 -> Parser String Number DataView`

`exactS32BE` takes an signed 32-bit number `b`, and consumes **exactly four** bytes, matching a value equal to `b`, when interpreted as a signed integer in big endian order.

**Example**
```javascript
const input = new Uint8Array([0x96, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

exactS32BE(-1773843380).run(dataViewOfInput);
// -> {
//      isError: false,
//      result: -1773843380,
//      index: 1,
//      data: null
//    }
```


### rawString

`rawString :: String -> Parser String String DataView`

`rawString` takes a string `s`, and consumes **exactly as many bytes as `s` is long**, matching a value equal to `s`, when interpreted as a string data.

**Example**
```javascript
const input = new Uint8Array([0x48, 0x45, 0x4c, 0x4c, 0x4f]);
const dataViewOfInput = new DataView(input);

rawString('HELLO').run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 'HELLO',
//      index: 1,
//      data: null
//    }
```

### nullTerminatedString

`nullTerminatedString :: Parser String String DataView`

`nullTerminatedString` consumes **as much input as possible** until it matches a null byte (`0x00`), matching a string made from the bytes interpreted as string data.

**Example**
```javascript
const input = new Uint8Array([0x48, 0x45, 0x4c, 0x4c, 0x4f, 0x2e, 0x2e, 0x2e, 0x00]);
const dataViewOfInput = new DataView(input);

nullTerminatedString.run(dataViewOfInput);
// -> {
//      isError: false,
//      result: 'HELLO...',
//      index: 1,
//      data: null
//    }
```
