
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


// This is just a simple example of a coin-like contract.

library ConvertLib{
	function convert(uint amount,uint conversionRate) public returns (uint convertedAmount){
		return amount * conversionRate;
	}
}

contract MetaCoin {
	mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	function MetaCoins() external {
		balances[tx.origin] = 10000;
	}

	function sendCoin(address receiver, uint amount) external returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		emit Transfer(msg.sender, receiver, amount);
		return true;
	}

	function getBalanceInEth(address addr) external returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) private returns(uint) {
		return balances[addr];
	}
}