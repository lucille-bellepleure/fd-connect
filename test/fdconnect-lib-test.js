const chai = require('chai')
const spies = require('chai-spies')
const util = require('util')
const fs = require('fs')
var path = require('path');
const fdconnect = require('../src/fdconnect-lib');
const fdConnect = new fdconnect()

// set up some vars 
let mnemonic
let shortcode

let connectPk
let connectPath
let connectAddress

describe('Fairdrive', () => {
    describe('Testing', () => {
        it('creates a mnemonic', async () => {
            mnemonic = await fdConnect.newMnemonic()
        })
        it('creates a drive', async () => {
            const fdrive = await fdConnect.newDrive(mnemonic)
        })
        it('sets up a connect', async () => {
            const connect = await fdConnect.setupConnect('Instaswarm', 'base64image')
            shortcode = connect.shortCode
        })
        it('resolves the connect', async () => {
            const resolve = await fdConnect.resolveConnect(shortcode, mnemonic)
            console.log('resolved: ', resolve)
            connectPk = resolve.pk
            connectPath = resolve.path
            connectAddress = resolve.address
        })
        it('gets the connect folder', async () => {
            const gdrive = await fdConnect.getDrive(mnemonic)
            console.log(gdrive)
            const instaFolder = await fdConnect.getFolderByName('Instaswarm', mnemonic)
            console.log(instaFolder)
            const resolvedFolder = await fdConnect.getFolder(instaFolder.path, instaFolder.keyIndex, mnemonic)
            console.log(resolvedFolder)
        })
        it('writes to the dappspace', async () => {
            console.log('trying to write to :', connectPath, connectPk)
            const res = await fdConnect.writeToDappSpace(connectPath, { hello: "world" }, connectPk)
        })
        it('reads the dappspace', async () => {
            console.log('trying to read from :', connectPath, connectAddress)
            const res = await fdConnect.readFromDappSpace(connectPath, connectAddress)
            console.log(res)
        })
    })
})
