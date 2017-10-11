pragma solidity ^0.4.11;

contract Splitter {
 address bobAddress;
 address carolAddress;
 address aliceAddress;
 struct user {
     string name;
     uint availableBalance;
 }
 mapping(address => user) users;
 
 //Alice initializes the contract with Bob and Carol's addresses
 function Splitter(address bob, address carol) public {
     bobAddress = bob;
     carolAddress = carol;
     aliceAddress = msg.sender;
     users[bobAddress] = user("Bob", 0);
     users[carolAddress] = user("Carol", 0);
     users[msg.sender] = user("Alice", 0);
 }
 
 function sendFunds() public payable isAlice() {
     if (msg.value > 0) {
         users[bobAddress].availableBalance += msg.value/2;
         users[carolAddress].availableBalance += msg.value/2;
     }
 }
 
 function withdraw() public validAddress() {
     uint sendAmount = users[msg.sender].availableBalance;
     users[msg.sender].availableBalance = 0;
     newBalance(users[msg.sender].availableBalance);
     msg.sender.transfer(sendAmount);
 }
 
 function getBalance() public constant returns (uint) {
    return this.balance;
 }
 
 function getFunds(address userAddress) public constant returns (uint) {
     return users[userAddress].availableBalance;
 }
 
 function kill() public isAlice() {
     selfdestruct(aliceAddress);
 }
 
 function() public payable {}
 
 modifier validAddress(){
     require(bytes(users[msg.sender].name).length != 0);
     _;
 }
 
 modifier isAlice(){
      require(msg.sender == aliceAddress);
      _;
 }

 event newBalance(uint availableBalance);
}