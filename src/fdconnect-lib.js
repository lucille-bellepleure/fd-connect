const ethers = require("ethers")
const { createKeyPair } = require('@erebos/secp256k1')
const { pubKeyToAddress } = require('@erebos/keccak256')
const { getFeed, setFeed } = require("./helpers/swarmFeed")
const { toHex, hexToByteArray, byteArrayToHex, numbersToByteArray, stringToUint8Array } = require('./helpers/conversion')


const PRIVATE_KEY_BYTES_LENGTH = 32
const PUBLIC_KEY_BYTES_LENGTH = 33
const ADDRESS_BYTES_LENGTH = 20


function fdconnect() {
}

fdconnect.prototype.newMnemonic = async function () {
    let bytes = ethers.utils.randomBytes(16);
    let language = ethers.wordlists.en;
    let randomMnemonic = await ethers.utils.entropyToMnemonic(bytes, language)
    let mnemonic = randomMnemonic
    return mnemonic
}

fdconnect.prototype.newDrive = async function (mnemonic) {
    let wallet = await ethers.utils.HDNode.fromMnemonic(mnemonic)
    const baseDrive = await setFeed(
        'fairdrive',
        {
            keyIndex: 0,
            lastUpdated: new Date().toISOString(),
            type: 'root',
            content: {
            }
        },
        wallet.privateKey
    )

    let fairdrive = await this.getDrive(mnemonic)

    const documentsFolder = await this.newFolder("Documents", null, mnemonic)
    const picturesFolder = await this.newFolder("Pictures", null, mnemonic)
    const moviesFolder = await this.newFolder("Movies", null, mnemonic)

    fairdrive = await this.getDrive(mnemonic)

    return fairdrive
}

fdconnect.prototype.getDrive = async function (mnemonic) {
    try {
        let wallet = await ethers.utils.HDNode.fromMnemonic(mnemonic)
        let fairdrive = await getFeed("fairdrive", wallet.address)
        return { status: 200, fd: fairdrive }
    } catch (error) {
        let err = error
        return { status: 500, err: err }
    }
}

fdconnect.prototype.newFolder = async function (folderName, path, mnemonic) {
    let wallet = await ethers.utils.HDNode.fromMnemonic(mnemonic)
    const res = await this.getDrive(mnemonic)
    const fairdrive = res.fd
    const newNonce = fairdrive.keyIndex + 1
    const folderWallet = wallet.derivePath("m/44'/60'/0'/0/" + newNonce)
    const newId = new Date().toISOString()
    const newFolderFeed = await setFeed(
        newId,
        {
            id: newId,
            keyIndex: newNonce,
            lastUpdated: new Date().toISOString(),
            type: 'folder',
            name: folderName,
            ownerAddress: folderWallet.address,
            nonce: 0,
            content: {}
        },
        folderWallet.privateKey
    )

    const checkFeed = await getFeed(newId, folderWallet.address)

    if (path) {
        console.log('new folder in a path')
        fairdrive.content[path].content[newId] = {
            id: newId,
            keyIndex: newNonce,
            lastUpdated: new Date().toISOString(),
            type: 'folder',
            name: folderName,
            lastUpdated: new Date().toISOString(),
            address: folderWallet.address,
            content: {}
        }
    } else {
        fairdrive.content[newId] = {
            id: newId,
            keyIndex: newNonce,
            lastUpdated: new Date().toISOString(),
            type: 'folder',
            name: folderName,
            lastUpdated: new Date().toISOString(),
            address: folderWallet.address,
            content: {}
        }
    }

    fairdrive.keyIndex = newNonce
    fairdrive.lastUpdated = newId

    const updateFairdrive = await setFeed(
        'fairdrive',
        fairdrive,
        wallet.privateKey
    )
    return { path: newId, keyIndex: newNonce, pk: wallet.privateKey, address: wallet.address }
}

fdconnect.prototype.getFolder = async function (path, keyIndex, mnemonic) {
    let wallet = await ethers.utils.HDNode.fromMnemonic(mnemonic)
    const folderWallet = wallet.derivePath("m/44'/60'/0'/0/" + keyIndex)
    const folderFeed = await getFeed(path, folderWallet.address)
    return folderFeed
}

fdconnect.prototype.getFolderByName = async function (folderName, mnemonic) {
    const res = await this.getDrive(mnemonic)
    const fairdrive = res.fd
    for (const [key, value] of Object.entries(fairdrive.content)) {
        const searchTerm = folderName
        if (value.name === searchTerm)
            return { path: value.id, keyIndex: value.keyIndex }
    }
}

fdconnect.prototype.setupConnect = async function (appname, appicon) {
    var timeStamp = Math.round((new Date()).getTime() / 100000);
    const shortCode = Math.floor(1000 + Math.random() * 9000);
    const seedstring = shortCode.toString().concat('-fdconnect-', timeStamp.toString())
    const privateKeyGenerated = byteArrayToHex(stringToUint8Array(seedstring), false)
    const keyPair = createKeyPair(privateKeyGenerated)
    const keyPair_toSign = createKeyPair()
    const privateKey = toHex(hexToByteArray(keyPair.getPrivate('hex'), PRIVATE_KEY_BYTES_LENGTH))
    const publicKey = toHex(hexToByteArray(keyPair_toSign.getPublic(true, 'hex'), PUBLIC_KEY_BYTES_LENGTH))

    const address = pubKeyToAddress(keyPair.getPublic('array'))
    const swarmFeed = await setFeed(
        'shortcode',
        {
            appname: appname,
            appicon: appicon,
            publicKey: publicKey
        },
        privateKey)

    return {
        shortCode: shortCode,
        gotUrl: 'https://fairdrive.io/#/connect/' + shortCode
    }
}

fdconnect.prototype.resolveConnect = async function (shortcode, mnemonic) {
    if (!shortcode) throw 'no shortcode!'
    var timeStamp = Math.round((new Date()).getTime() / 100000);
    const seedstring = shortcode.toString().concat('-fdconnect-', timeStamp.toString())
    const privateKeyGenerated = byteArrayToHex(stringToUint8Array(seedstring), false)
    const keyPair = createKeyPair(privateKeyGenerated)
    const privateKey = toHex(hexToByteArray(keyPair.getPrivate('hex'), PRIVATE_KEY_BYTES_LENGTH))
    const publicKey = toHex(hexToByteArray(keyPair.getPublic(true, 'hex'), PUBLIC_KEY_BYTES_LENGTH))
    const address = pubKeyToAddress(keyPair.getPublic('array'))
    const result = await getFeed('shortcode', address)

    // Create a folder for this dapp and return the pk to write to it
    const res = await this.newFolder(result.appname, null, mnemonic)
    return res
}

fdconnect.prototype.writeToDappSpace = async function (path, value, pk) {
    const feed = await setFeed(path, value, pk)
    return true
}

fdconnect.prototype.readFromDappSpace = async function (path, address) {
    const feed = await getFeed(path, address)
    return feed
}

module.exports = fdconnect