var Splitter = artifacts.require('./Splitter.sol')

contract('Splitter', function(accounts) {
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
})
