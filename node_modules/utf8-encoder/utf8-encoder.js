/**
 * Created by mhzed on 2016-08-11.
 */

const utf8 = {

  // convert an Uint8Array utf8 byte sequence to string
  toString(uint8array, offset, byteLength) {
    "use strict";
    let chars = [];
    offset = offset || 0;
    byteLength = byteLength || uint8array.byteLength;
    //let byteLength = uint8array.byteLength;
    // for reason unknown: on nodejs 6.2.0, let offset is 33% slower than var offset during benchmark.
    for(var offset = 0; offset < byteLength; offset++) {
      let charLength = utf8.getCharLength(uint8array[offset]);
      if(offset + charLength > byteLength) {
        if(strict) {
          throw Error('Index ' + offset + ': Found a ' + charLength +
            ' bytes encoded char declaration but only ' +
            (byteLength - offset) +' bytes are available.');
        }
      } else {
        chars.push(String.fromCodePoint(
          utf8.getCharCode(uint8array, offset, charLength, false)
        ));
      }
      offset += charLength - 1;
    }
    return chars.join('');

  },


  // convert string to Uint8Array byte sequence
  fromString(string) {
    "use strict";

    // do not walk char by char to calculate size, it's slow
    // use a conservative estimate first, expand later if needed
    let size = string.length * 2;

    let bytes = new Uint8Array(size);
    let byteOffset = 0;
    for(let i = 0, j = string.length; i < j; i++) {

      let charCode = string.codePointAt(i);
      let nbytes = utf8._bytesForChar(charCode);
      if (nbytes==4) i+=1;
      if (nbytes + byteOffset >size) {  //
        size = string.length * 4;   // max possible size
        let newBytes = new Uint8Array(size);
        newBytes.set(bytes);
        bytes = newBytes;
      }

      if(1 == nbytes) {
        bytes[byteOffset++] = charCode;
      } else {
        // Computing the first byte
        let pad = (15 >> (4-nbytes)) << (8-nbytes);
        bytes[byteOffset++] = pad + (charCode >>> ((--nbytes) * 6));
        // Computing next bytes
        for (; nbytes > 0;) {
          bytes[byteOffset++] = ((charCode >>> ((--nbytes) * 6)) & 0x3F) | 0x80;
        }
      }
    }
    bytes = bytes.subarray(0, byteOffset);
    return bytes;
  },

  _bytesForChar(charCode) {
    "use strict";
    if(charCode < 128) {
      return 1;
    } else if(charCode < 2048) {
      return 2;
    } else if(charCode < 65536) {
      return 3;
    } else if(charCode < 2097152) {
      return 4;
    }
    throw new Error('CharCode '+charCode+' cannot be encoded with UTF8.');
  },

  getCharLength(theByte) {
    // 4 bytes encoded char (mask 11110000)
    if(0xF0 == (theByte&0xF0)) {
      return 4;
      // 3 bytes encoded char (mask 11100000)
    } else if(0xE0 == (theByte&0xE0)) {
      return 3;
      // 2 bytes encoded char (mask 11000000)
    } else if(0xC0 == (theByte&0xC0)) {
      return 2;
      // 1 bytes encoded char
    } else if(theByte == (theByte&0x7F)) {
      return 1;
    }
    return 0;
  },

  getCharCode(bytes, byteOffset, charLength) {
    var charCode = 0, mask = '';
    if(charLength == 0) {
      throw new Error(bytes[byteOffset].toString(2)+' is not a significative' +
        ' byte (offset:'+byteOffset+').');
    }
    // Return byte value if charlength is 1
    if(1 === charLength) {
      return bytes[byteOffset];
    }
    // Test UTF8 integrity
    mask = 1<<charLength;
    if(bytes[byteOffset]&(parseInt(mask, 2))) {
      throw Error('Index ' + byteOffset + ': A ' + charLength + ' bytes' +
        ' encoded char' +' cannot encode the '+(charLength+1)+'th rank bit to 1.');
    }
    // Reading the first byte
    mask=(~((15 >> (4-charLength)) << (7-charLength))) & 127
    charCode+=(bytes[byteOffset]&mask)<<((--charLength)*6);
    // Reading the next bytes
    while(charLength) {
      if(0x80!==(bytes[byteOffset+1]&0x80)
        ||0x40===(bytes[byteOffset+1]&0x40)) {
        throw Error('Index '+(byteOffset+1)+': Next bytes of encoded char'
          +' must begin with a "10" bit sequence.');
      }
      charCode += ((bytes[++byteOffset]&0x3F) << ((--charLength) * 6));
    }
    return charCode;
  },
}

module.exports = utf8;

