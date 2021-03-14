const chai = require('chai')
const spies = require('chai-spies')
const util = require('util')
const fs = require('fs')
var path = require('path');
const fdconnect = require('../src/fdconnect-lib');
const fdConnect = new fdconnect()
const assert = require('chai').assert

// set up some vars 
let mnemonic
let shortcode

let connectPk
let connectPath
let connectAddress

describe('FD Connect Test', () => {
    describe('FD Connect', () => {
        it('creates a mnemonic', async () => {
            mnemonic = await fdConnect.newMnemonic()
            // It returns 12 words
            assert.equal(mnemonic.split(" ").length, 12, "Mnemonic has 12 words")
        })
        it('creates a drive', async () => {
            const fdrive = await fdConnect.newDrive(mnemonic)
            assert.equal(fdrive.status, 200, 'Drive is created')
        })
        it('sets up a connect', async () => {
            const connect = await fdConnect.setupConnect('Instaswarm', 'base64image')
            shortcode = connect.shortCode
            assert.equal(typeof shortcode, "number", 'shortcode should be a number')
        })
        it('resolves the connect', async () => {
            const resolve = await fdConnect.resolveConnect(shortcode, mnemonic)
            connectPk = resolve.pk
            connectPath = resolve.path
            connectAddress = resolve.address
            assert.equal(typeof resolve.path, "string", "Resolve should return a string")
        })
        it('retrieves the newly created connect folder', async () => {
            const instaFolder = await fdConnect.getFolderByName('Instaswarm', mnemonic)
            assert.equal(typeof instaFolder.path, "string", "Should have a path string")
        })
        it('writes to the dappspace', async () => {
            const res = await fdConnect.writeToDappSpace(connectPath, "Hello world", connectPk)
            assert.equal(res, true, "writing to dappspace should return true")
        })
        it('reads the dappspace', async () => {
            const res = await fdConnect.readFromDappSpace(connectPath, connectAddress)
            assert.equal(res, "Hello world", "read from dappspace should return Hello world")
        })
    })
})
