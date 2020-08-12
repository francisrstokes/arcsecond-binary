const A = require('arcsecond');
const Parser = A.Parser;

const isError = state => state.isError;
const canReadBytes = (state, n, offset = 0) => state.index + n + offset <= state.target.byteLength;
const updateError = (state, error) => ({ ...state, isError: true, error });
const updateResultAndIndex = (state, result, index) => ({ ...state, result, index });

const needNBytes = (n, name, transformerFn) => new Parser(state => {
  if (isError(state)) return state;
  if (!canReadBytes(state, n)) return updateError(state, `${name}: Unexpected end of input`);
  return transformerFn(state);
})

const parseExact = (name, expectaction) => reality => {
  if (expectaction === reality) {
    return A.succeedWith(reality);
  }
  return A.fail(`${name}: Expected ${expectaction} but got ${reality}`);
}

const bufferRead = (name, bytes, method, littleEndian) => needNBytes(bytes, name, state =>
  updateResultAndIndex(state, state.target[method](state.index, littleEndian), state.index + bytes)
);

const u8 = bufferRead('u8', 1, 'getUint8');
const s8 = bufferRead('s8', 1, 'getInt8');
const u16LE = bufferRead('u16LE', 2, 'getUint16', true);
const s16LE = bufferRead('s16LE', 2, 'getInt16', true);
const u16BE = bufferRead('u16BE', 2, 'getUint16', false);
const s16BE = bufferRead('s16BE', 2, 'getInt16', false);
const u32LE = bufferRead('u32LE', 4, 'getUint32', true);
const s32LE = bufferRead('s32LE', 4, 'getInt32', true);
const u32BE = bufferRead('u32BE', 4, 'getUint32', false);
const s32BE = bufferRead('s32BE', 4, 'getInt32', false);

const exactU8 = expected => u8.chain(parseExact('u8', expected));
const exactS8 = expected => s8.chain(parseExact('s8', expected));
const exactU16LE = expected => u16LE.chain(parseExact('u16LE', expected));
const exactU16BE = expected => u16BE.chain(parseExact('u16BE', expected));
const exactS16LE = expected => s16LE.chain(parseExact('s16LE', expected));
const exactS16BE = expected => s16BE.chain(parseExact('s16BE', expected));
const exactU32LE = expected => u32LE.chain(parseExact('u32LE', expected));
const exactU32BE = expected => u32BE.chain(parseExact('u32BE', expected));
const exactS32LE = expected => s32LE.chain(parseExact('s32LE', expected));
const exactS32BE = expected => s32BE.chain(parseExact('s32BE', expected));

const rawString = string => needNBytes(string.length, 'rawString', state => {
  const bytes = Array.from({length: string.length}, (_, i) => {
    return state.target.getUint8(state.index + i);
  });

  const match = bytes.every((byte, i) => byte === string.charCodeAt(i));

  if (!match) {
    return updateError(state, `Couldn't read raw string "${string}", got "${bytes.map(x => String.fromCharCode(x)).join('')}"`);
  }

  return updateResultAndIndex(state, string, state.index + string.length);
});

const nullTerminatedString = new Parser(state => {
  if (isError(state)) return state;

  let str = '';
  let offset = 0;
  let byte;

  while (true) {
    if (!canReadBytes(state, 1, offset)) {
      return updateError(state, `nullTerminatedString: Unexpected end of input`);
    }
    byte = state.target.getUint8(state.index + offset++);
    if (byte === 0) {
      break;
    }
    str += String.fromCharCode(byte);
  }

  return updateResultAndIndex(state, str, state.index + offset);
});

const endOfInput = new Parser(state => {
  if (isError(state)) return state;
  if (canReadBytes(state, 1)) {
    return updateError(state, `Expected end of input, but got ${state.target.getUint8(state.index)} instead`);
  }
  return updateResultAndIndex(state, null, state.index);
});

const everythingUntil = parser => new Parser(state => {
  if (isError(state)) return state;
  const collected = [];

  let nextState = state;
  while (true) {
    const reachedEndState = parser.p(nextState);
    if (!reachedEndState.isError) {
      return updateResultAndIndex(nextState, collected, nextState.index);
    }

    if (!canReadBytes(nextState, 1)) {
      return updateError(nextState, `everythingUntil: Unexpected end of input`);
    }

    collected.push(nextState.target.getUint8(nextState.index));
    nextState = updateResultAndIndex(nextState, null, nextState.index + 1);
  }
});

const anythingExcept = exceptionParser => new Parser(state => {
  if (isError(state)) return state;
  const exceptionState = exceptionParser.p(state);
  if (!exceptionState.isError) {
    return updateError(state, `anythingExcept: Matched ${exceptionState.result} from the exception parser`);
  }

  const byte = state.target.getUint8(state.index);
  return updateResultAndIndex(state, byte, state.index + 1);
});

module.exports = {
  u8,
  s8,
  u16LE,
  u16BE,
  s16LE,
  s16BE,
  u32LE,
  u32BE,
  s32LE,
  s32BE,
  exactU8,
  exactS8,
  exactU16LE,
  exactU16BE,
  exactS16LE,
  exactS16BE,
  exactU32LE,
  exactU32BE,
  exactS32LE,
  exactS32BE,
  rawString,
  nullTerminatedString,
  endOfInput,
  everythingUntil,
  anythingExcept,
};
