const {assert} = require('chai');
const A = require('arcsecond');
const B = require('./src');

const parserTest = (name, inputBytes, expectedResult, parser) => it(name, () => {
  const arrayBuffer = new Uint8Array(inputBytes);
  const dataView = new DataView(arrayBuffer.buffer);
  const result = parser.run(dataView);

  if (result.isError) {
    throw new Error(`Unexpected error: ${result.error}`);
  }

  assert.deepEqual(result.result, expectedResult);
});

const expectedFailureTest = (name, inputBytes, expectedErrorMessage, parser) => it(name, () => {
  const arrayBuffer = new Uint8Array(inputBytes);
  const dataView = new DataView(arrayBuffer.buffer);
  const result = parser.run(dataView);

  if (!result.isError) {
    throw new Error('Unexpected suceeding parser');
  }

  assert.deepEqual(result.error, expectedErrorMessage);
});

describe('parsers with no constraint', () => {
  parserTest('u8',
    [0x01, 0x02, 0xff, 0xfe],
    [0x01, 0x02, 0xff, 0xfe],
    A.sequenceOf([B.u8, B.u8, B.u8, B.u8])
  );

  expectedFailureTest('u8: not enough input',
    [],
    'u8: Unexpected end of input',
    B.u8
  );

  parserTest('s8',
    [0x01, 0x02, 0xff, 0xfe],
    [1, 2, -1, -2],
    A.sequenceOf([B.s8, B.s8, B.s8, B.s8])
  );

  parserTest('u16LE',
    [0x01, 0x02, 0xff, 0xfe],
    [0x0201, 0xfeff],
    A.sequenceOf([B.u16LE, B.u16LE])
  );

  expectedFailureTest('u16LE: not enough input',
    [0x01],
    'u16LE: Unexpected end of input',
    B.u16LE
  );

  parserTest('u16BE',
    [0x01, 0x02, 0xff, 0xfe],
    [0x0102, 0xfffe],
    A.sequenceOf([B.u16BE, B.u16BE])
  );

  parserTest('s16LE',
    [0x01, 0x02, 0xff, 0xfe],
    [0x0201, -257],
    A.sequenceOf([B.s16LE, B.s16LE])
  );

  parserTest('s16BE',
    [0x01, 0x02, 0xff, 0xfe],
    [0x0102, -2],
    A.sequenceOf([B.s16BE, B.s16BE])
  );

  parserTest('u32LE',
    [0x01, 0x02, 0xff, 0xfe],
    0xfeff0201,
    B.u32LE
  );

  expectedFailureTest('u32LE: not enough input',
    [0x01, 0x02, 0x03],
    'u32LE: Unexpected end of input',
    B.u32LE
  );

  parserTest('u32BE',
    [0x01, 0x02, 0xff, 0xfe],
    0x0102fffe,
    B.u32BE
  );

  parserTest('s32LE',
    [0x01, 0x02, 0xff, 0xfe],
    -16842239,
    B.s32LE
  );

  parserTest('s32BE',
    [0x01, 0x02, 0xff, 0xfe],
    0x0102fffe,
    B.s32BE
  );

  parserTest('nullTerminatedString',
    [0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x00],
    'hello',
    B.nullTerminatedString
  );
});

describe('parsers with constraints', () => {
  parserTest('exactU8',
    [0x01],
    0x01,
    B.exactU8(0x01)
  );

  expectedFailureTest('exactU8: no match',
    [0x01],
    'u8: Expected 2 but got 1',
    B.exactU8(0x02)
  );

  parserTest('exactS8',
    [0xff],
    -1,
    B.exactS8(-1)
  );

  parserTest('exactU16LE',
    [0x01, 0x02, 0xff, 0xfe],
    [0x0201, 0xfeff],
    A.sequenceOf([
      B.exactU16LE(0x0201),
      B.exactU16LE(0xfeff)
    ])
  );

  parserTest('exactU16BE',
    [0x01, 0x02, 0xff, 0xfe],
    [0x0102, 0xfffe],
    A.sequenceOf([
      B.exactU16BE(0x0102),
      B.exactU16BE(0xfffe)
    ])
  );

  parserTest('exactS16LE',
    [0x01, 0x02, 0xff, 0xfe],
    [0x0201, -257],
    A.sequenceOf([
      B.exactS16LE(0x0201),
      B.exactS16LE(-257)
    ])
  );

  parserTest('exactS16BE',
    [0x01, 0x02, 0xff, 0xfe],
    [0x0102, -2],
    A.sequenceOf([
      B.exactS16BE(0x0102),
      B.exactS16BE(-2)
    ])
  );

  parserTest('exactU32LE',
    [0x01, 0x02, 0xff, 0xfe],
    0xfeff0201,
    B.exactU32LE(0xfeff0201)
  );

  parserTest('exactU32BE',
    [0x01, 0x02, 0xff, 0xfe],
    0x0102fffe,
    B.exactU32BE(0x0102fffe)
  );

  parserTest('exactS32LE',
    [0x01, 0x02, 0xff, 0xfe],
    -16842239,
    B.exactS32LE(-16842239)
  );

  parserTest('exactS32BE',
    [0x01, 0x02, 0xff, 0xfe],
    0x0102fffe,
    B.exactS32BE(0x0102fffe)
  );
});
