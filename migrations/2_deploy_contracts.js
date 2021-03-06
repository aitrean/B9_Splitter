var Splitter = artifacts.require('./Splitter.sol')

const addresses = [
	0xfe3f706129cccc44cbeffc055b598b78b86cf682,
	0x56dbedf28500d01b388222f479898eada502fc26,
	0xdd29efb09554fe2abf4a9ebd768018570d838c51,
	0x7cdf0a9e879400ff47010625330455402219fb5d,
	0x03079797a3505dd27031716b2171e5a54ca28445,
	0xcc332eb60153927a1fe522f1f5dfd3b58c8d61d0,
	0x6063761fd8926b60e0e4872da12fdfbadb9a9404,
	0x2488c5f798ef297fe251b00138159b76ce81db47,
	0xd8dcd69ffbbdcf36c1169722826fa2df6dc188e9,
	0x753bd7585ba954f1d119ae94c45124dd0074d4a9
]

module.exports = function(deployer) {
	deployer.deploy(Splitter, addresses[1], addresses[2])
}
