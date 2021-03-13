utf8-encoder
--------

Encode/decode string to Uint8Array in utf8.  Written in ES6.  Small, no dependencies, and simple API. 

Works in any ES6 environment, and reasonably fast.

## Usage


    const utf8 = require("utf8-encoder");
    let uint8array = utf8.fromString("abc");
    let str = utf8.toString(uint8array);

## Why?

Lots of modules out there.  Most are slow, and some don't deal with Uint8Array.

Thus this module.