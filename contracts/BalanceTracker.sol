// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BalanceTracker {
    // Хранилище для счетчика
    int256 private count;

    // Хранилище для балансов пользователей
    mapping(address => uint256) private balances;

    // События
    event CounterUpdated(int256 newCount);
    event BalanceUpdated(address indexed user, uint256 newBalance);

    // Получить текущее значение счетчика
    function getCount() public view returns (int256) {
        return count;
    }

    // Увеличить значение счетчика
    function increment() public {
        count += 1;
        emit CounterUpdated(count);
    }

    // Уменьшить значение счетчика
    function decrement() public {
        count -= 1;
        emit CounterUpdated(count);
    }

    // Получить текущий баланс пользователя
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }

    // Пополнить баланс
    function deposit() public payable {
        require(msg.value > 0, "Must send some ether");

        balances[msg.sender] += msg.value;
        emit BalanceUpdated(msg.sender, balances[msg.sender]);
    }

    // Снять средства с баланса
    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdraw amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);

        emit BalanceUpdated(msg.sender, balances[msg.sender]);
    }
}
