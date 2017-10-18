var Splitter = artifacts.require('./Splitter.sol')
var eventUtil = require('../eventUtil')

contract('Splitter', accounts => {
	const owner = accounts[0]
	const accountA = accounts[1]
	const accountB = accounts[2]
	const outsideAccount = accounts[3]
	const accountABalance = web3.eth.getBalance(accountA)
	const accountBBalance = web3.eth.getBalance(accountB)

	beforeEach(() => {
		return Splitter.new({ from: owner }).then(instance => contract = instance)
	})

	it('should let the owner send funds to two accounts', () => {
		return contract.sendFunds(accountA, accountB, { value: 4999, from: owner }
		).then(() => {
			eventUtil.assertEvent(contract, { event: 'LogSendFunds', args: { ownerAddress: owner, accountA: accountA, accountB: accountB } })
		}).then(() => {
			return contract.accountBalances.call(accountA)
		}).then(accountBalance =>
			assert.equal(accountBalance, 2499, "the account balance was not properly allocated to each user")
			).catch(err => assert.fail(err))
	})

	it('should let the users withdraw from the contract', () => {
		return contract.sendFunds(accountA, accountB, { value: 4999, from: owner }).then(() => {
			return contract.withdraw({ from: accountA })
		}).then(() => {
			eventUtil.assertEvent(contract, { event: 'Withdraw', args: { to: accountA } })
		}).then(() => {
			return contract.accountBalances.call(accountA)
		}).then(accountBalance => {
			assert.equal(accountBalance, 0, 'the available balance should be depleted')
		}).catch(err => assert.fail(err))
	})
})
