const {Parser} = require('arcsecond');
const {Left, Right} = require('data.either');

const displayBuffer = buf => [...buf.values()].map(v => `0x${v.toString(16)}`).join(', ');

function rawString(str) {
  return new Parser(state => {
    return state.chain(([index, targetBuffer]) => {
      const byteSequence = Buffer.from(str);
      if (index + byteSequence.length <= targetBuffer.byteLength) {
        const slice = targetBuffer.slice(index, index + byteSequence.length);
        if (!slice.equals(byteSequence)) {
          return Left ([index, `ParseError (position ${index}): Expecting [${displayBuffer(byteSequence)}], got [${displayBuffer(slice)}]`]);
        }
        return Right ([index + byteSequence.length, targetBuffer, slice]);
      }
      return Left ([index, `ParseError (position ${index}): Unexpected end of input `]);
    })
  });
};

function byte(value) {
  return new Parser(state => {
    return state.chain(([index, targetBuffer]) => {
      if (index <= targetBuffer.byteLength) {
        if (!targetBuffer[index] === value) {
          return Left ([index, `ParseError (position ${index}): Expecting 0x${value.toString(16)}], got 0x${targetBuffer[i].toString(16)}]`]);
        }
        return Right ([index + 1, targetBuffer, value]);
      }
      return Left ([index, `ParseError (position ${index}): Unexpected end of input `]);
    })
  });
};

const byteInRange = lowest => highest => {
  return new Parser(state => {
    return state.chain(([index, targetBuffer]) => {
      if (index <= targetBuffer.byteLength) {
        if (!(targetBuffer[index] >= lowest && targetBuffer[index] <= highest)) {
          return Left ([index, `ParseError (position ${index}): Expecting byte in range [0x${lowest.toString(16)}], 0x${highest.toString(16)}]. Got 0x${targetBuffer[i].toString(16)}]`]);
        }
        return Right ([index + 1, targetBuffer, targetBuffer[index]]);
      }
      return Left ([index, `ParseError (position ${index}): Unexpected end of input `]);
    })
  });
};

const anyByte = new Parser(state => {
  return state.chain(([index, targetBuffer]) => {
    if (index <= targetBuffer.byteLength) {
      return Right ([index + 1, targetBuffer, targetBuffer[index]]);
    }
    return Left ([index, `ParseError (position ${index}): Unexpected end of input `]);
  })
});

function wordLE(value) {
  return new Parser(state => {
    return state.chain(([index, targetBuffer]) => {
      if (index + 1 <= targetBuffer.byteLength) {
        const dvValue = targetBuffer.readUInt16LE(index);
        if (dvValue !== value) {
          return Left ([index, `ParseError (position ${index}): Expecting 0x${value.toString(16)}, got 0x${dvValue.toString(16)}`]);
        }
        return Right ([index + 1, targetBuffer, value]);
      }
      return Left ([index, `ParseError (position ${index}): Unexpected end of input `]);
    })
  });
};

function wordBE(value) {
  return new Parser(state => {
    return state.chain(([index, targetBuffer]) => {
      if (index + 1 <= targetBuffer.byteLength) {
        const dvValue = targetBuffer.readUInt16BE(index);
        if (dvValue !== value) {
          return Left ([index, `ParseError (position ${index}): Expecting 0x${value.toString(16)}, got 0x${dvValue.toString(16)}`]);
        }
        return Right ([index + 1, targetBuffer, value]);
      }
      return Left ([index, `ParseError (position ${index}): Unexpected end of input `]);
    })
  });
};

function doubleWordLE(value) {
  return new Parser(state => {
    return state.chain(([index, targetBuffer]) => {
      if (index + 3 <= targetBuffer.byteLength) {
        const dvValue = targetBuffer.readUInt32LE(index);
        if (dvValue !== value) {
          return Left ([index, `ParseError (position ${index}): Expecting 0x${value.toString(16)}, got 0x${dvValue.toString(16)}`]);
        }
        return Right ([index + 4, targetBuffer, value]);
      }
      return Left ([index, `ParseError (position ${index}): Unexpected end of input `]);
    })
  });
};

function doubleWordBE(value) {
  return new Parser(state => {
    return state.chain(([index, targetBuffer]) => {
      if (index + 3 <= targetBuffer.byteLength) {
        const dvValue = targetBuffer.readUInt32BE(index);
        if (dvValue !== value) {
          return Left ([index, `ParseError (position ${index}): Expecting 0x${value.toString(16)}, got 0x${dvValue.toString(16)}`]);
        }
        return Right ([index + 4, targetBuffer, value]);
      }
      return Left ([index, `ParseError (position ${index}): Unexpected end of input `]);
    })
  });
};

function everythingUntil(parser) {
  return new Parser(state => {
    return state.chain (function everythingUntil$state(innerState) {
      const results = [];
      let nextState = state;

      while (true) {
        const out = parser.p(nextState);

        if (out.isLeft) {
          const [index, targetString] = nextState.value;
          const val = targetString[index];
          if (val) {
            results.push(val);
            nextState = Right([index + 1, targetString, val]);
          } else {
            return Left ([nextState[0], `ParseError 'everythingUntil' (position ${nextState.value[0]}): Unexpected end of input.`]);
          }
        } else {
          break;
        }
      }
      const [i, s] = nextState.value;
      return Right ([i, s, results]);
    });
  });
};

module.exports = {
  rawString,
  byte,
  anyByte,
  byteInRange,
  wordLE,
  wordBE,
  doubleWordLE,
  doubleWordBE,
  everythingUntil
};
