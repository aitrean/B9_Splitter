pragma solidity ^0.4.11;

/*
* Written by Aitrean
* Prepared for B9 Labs Course, see readme
* This contract assumes Alice initializes a contract to send ether to her
* friends, Bob and Carol. She initializes their addresses during instantiation
* of the contract, and then sends ether through sendFunds()
*/
contract Splitter {
 address owner;
 bool running = true;
 mapping(address => uint) public accountBalances;
 
 event LogSendFunds(address ownerAddress, address accountA, address accountB, uint valueA, uint valueB);
 event LogWithdraw(address to, uint amount);

  modifier onlyIfBalance(){
     require(accountBalances[msg.sender] != 0);
     _;
 }
 
 modifier isOwner(){
      require(msg.sender == owner);
      _;
 }

 modifier isRunning(){
     require(running == true);
     _;
 }

 function Splitter() public {
     owner = msg.sender;
 }
 
 function sendFunds(address addressA, address addressB) public payable isOwner() isRunning() returns (bool){
     if (msg.value > 0) {
         uint valueA = msg.value/2;
         uint valueB = msg.value - valueA;
         accountBalances[addressA] += valueA;
         accountBalances[addressB] += valueB;
         LogSendFunds(owner, addressA, addressB, valueA, valueB);
         return true;
     }
     return false;
 }
 
 function withdraw() public onlyIfBalance() isRunning() {
     uint sendAmount = accountBalances[msg.sender];
     accountBalances[msg.sender] = 0;
     LogWithdraw(msg.sender, sendAmount);
     msg.sender.transfer(sendAmount);
 }
 
 function pauseContract() public isOwner() {
     running = false;
 }

 function resumeContract() public isOwner() {
     running = true;
 }
 
 function() public payable {
     revert();
 }
}