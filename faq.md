# FAQ

## What about 64-bit?

64-bit is also not implemented as part of this library because it necessitates the need for BigInt, or another similar user space library capable of modeling a 64-bit integer. This is because JavaScript standard number type is a 64-bit Floating Point (IEEE-754), which cannot  accurately represent very large integers. If you're willing to work with a different number type within your application, you can quite easily implement your own 64-bit parsers using something like:

```javascript
const A = require('arcsecond');
const B = require('arcsecond-binary');

// Parse a 64-bit unsigned integer in little endian byte ordering
// Note the resulting type is a BigInt, which cannot be used in place of a regular number.
const u64LE = A.coroutine(function* ()  {
  const low32 = BigInt(yield B.u32LE);
  const high32 = BigInt(yield B.u32LE);
  return (high32 << 32n) | low32;
});
```

## What about length-prefixed datatypes like strings?

These are omitted from the library because they would require adding a variant for every integer type in every endianness, which just adds unnecessary bloat, when most people will just need one. Something like a length prefixed string can easily be implement like this:

```javascript
const B = require('arcsecond-binary');

const byteChar = u8.map(x =>  String.fromCharCode(x));
const repeatParser = (times, parser) => sequenceOf(Array.from({length: times}, ()  => parser));
const lengthPrefixedString = intParser => intParser.chain(length => repeatParser(length, byteChar).map(x => x.join('')));

const lengthPrefixedStringU16LE = lengthPrefixedString(B.u16LE);
```

## What if the format I'm parsing contains information about how to parse it?

Sometimes binary formats contain flags that indicate things like endianness, version, word size, or other context sensitive information.

Let's imagine a very simple structure like:

| Byte Length | Data Type | Description                               |
|-------------|-----------|-------------------------------------------|
| 4           | `u8` x4   | Magic Number `0x01, 0x02, 0x03, 0x04`     |
| 1           | `u8`      | Little endian (`0`) or  Big endian (`>0`) |
| 2           | `u16`     | File size                                 |

And the data:

```
01 02 03 04 00 42 95
```

After parsing the magic number and the endianness flag, we need to parse the 2 bytes `45 95` as either little endian (`0x9542`) or big endian (`0x4592`). We can make use of arcsecond's built in state-management solution to build a context-aware `u16` parser that doesn't require any global variables:

```javascript
const A = require('arcsecond');
const B = require('arcsecond-binary');

const magic = A.sequenceOf([
  B.exactU8(0x01),
  B.exactU8(0x02),
  B.exactU8(0x03),
  B.exactU8(0x04)
]);

const endianness = A.coroutine(function* () {
  const endianness = (yield B.u8) === 0 ? 'little' : 'big';

  // Use setData to store some state that can be later retreived with getData or mapData
  yield A.setData({ endianness });

  return endianness;
});

const u16 = A.getData.chain(({ endianness }) => {
  if (endianness === 'little') {
    return B.u16LE;
  } else {
    return B.u16BE;
  }
});

const parser = A.sequenceOf([
  magic,
  endianness,
  u16
]).map(([magic, endianness, fileSize]) => ({
  magic,
  endianness,
  fileSize
}));
```
