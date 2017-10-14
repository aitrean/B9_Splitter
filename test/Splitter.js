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
			eventUtil.assertEvent(contract, { event: 'SendFunds', args: { ownerAddress: owner, accountA: accountA, accountB: accountB } })
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
/*contract('Splitter', function(accounts) {
	const aliceAddress = accounts[0]
	const bobAddress = accounts[1]
	const carolAddress = accounts[2]
	it('should split funds between Bob and Carol, then allow them to withdraw', function() {
		var myInstance
		return Splitter.new(bobAddress, carolAddress, { from: aliceAddress })
			.then(function(instance) {
				myInstance = instance
				return instance.getBalance.call()
			})
			.then(function(balance) {
				assert.equal(
					balance.valueOf(),
					0,
					'balance should initialize with zero'
				)
				return myInstance.sendFunds({ value: 500000 })
			})
			.then(function() {
				return myInstance.getFunds(accounts[1])
			})
			.then(function(balanceInfo) {
				assert.equal(
					balanceInfo,
					250000,
					'Bob should have 250,000 units available'
				)
				return myInstance.getFunds(accounts[2])
			})
			.then(function(balanceInfo) {
				assert.equal(
					balanceInfo,
					250000,
					'Carol should have 250,000 units available'
				)
				return myInstance.withdraw({ from: accounts[2] })
			})
			.then(function() {
				return myInstance.getFunds(accounts[2])
			})
			.then(function(balanceInfo) {
				assert.equal(balanceInfo, 0)
			})
	})
})*/
