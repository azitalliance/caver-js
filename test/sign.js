/*
    Copyright 2019 The caver-js Authors
    This file is part of the caver-js library.

    The caver-js library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    The caver-js library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with the caver-js. If not, see <http://www.gnu.org/licenses/>.
*/

const { expect } = require('chai')
const testRPCURL = require('./testrpc')

const Caver = require('../index')

const caver = new Caver(testRPCURL)

let senderPrvKey
let senderAddress

before(() => {
    senderPrvKey =
        process.env.privateKey && String(process.env.privateKey).indexOf('0x') === -1
            ? `0x${process.env.privateKey}`
            : process.env.privateKey

    senderAddress = caver.klay.accounts.wallet.add(senderPrvKey).address
})

describe('caver.klay.sign', () => {
    it('Compare the result of caver.klay.sign and caver.klay.accounts.sign', async () => {
        try {
            // If account is already existed in node, return error.
            const address = await caver.klay.personal.importRawKey(senderPrvKey, 'passphrase')
            expect(address.toLowerCase()).to.equals(senderAddress.toLowerCase())
        } catch (e) {}

        const isUnlock = await caver.klay.personal.unlockAccount(senderAddress, 'passphrase')
        expect(isUnlock).to.be.true

        const ret = await caver.klay.sign('Message to sign', senderAddress)
        const ret2 = await caver.klay.accounts.sign('Message to sign', senderPrvKey)
        expect(ret).to.equals(ret2.signature)
    })
})
