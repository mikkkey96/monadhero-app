// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MonadFortuneWheel {
    address public owner;
    uint256 public bank;
    uint256 public minBet = 0.05 ether; // 0.05 MON
    uint256 public maxBet = 0.5 ether;  // 0.5 MON
    
    // Баланс каждого игрока
    mapping(address => uint256) public playerBalance;
    mapping(address => Player) public players;
    address[] public leaderboard;
    
    struct Player {
        uint256 totalWins;
        uint256 totalPlayed;
        uint256 bestWin;
    }
    
    event Deposit(address indexed player, uint256 amount);
    event Withdrawal(address indexed player, uint256 amount);
    event BetPlaced(address indexed player, uint256 amount, uint256 bankBefore);
    event BetResult(address indexed player, bool won, uint256 reward, uint256 random);
    event NewHighScore(address indexed player, uint256 amount);
    
    constructor() {
        owner = msg.sender;
        bank = 0;
    }
    
    // Депозит MON в игру
    function deposit() external payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        playerBalance[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    // Вывод своего баланса
    function withdrawUserBalance(uint256 amount) external {
        require(playerBalance[msg.sender] >= amount, "Insufficient balance");
        playerBalance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }
    
    // Полный вывод баланса
    function withdrawAllBalance() external {
        uint256 balance = playerBalance[msg.sender];
        require(balance > 0, "No balance to withdraw");
        playerBalance[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
        emit Withdrawal(msg.sender, balance);
    }
    
    // Ставка из депозитного баланса
    function placeBet(uint256 amount) external returns (bool won, uint256 reward) {
        require(amount >= minBet, "Bet below minimum 0.05 MON");
        require(amount <= maxBet, "Bet above maximum 0.5 MON");
        require(playerBalance[msg.sender] >= amount, "Insufficient deposited balance");
        
        // Снимаем ставку с баланса игрока
        playerBalance[msg.sender] -= amount;
        
        // Добавляем в банк игры
        uint256 bankBefore = bank;
        bank += amount;
        
        // Генерируем случайное число 0-99
        uint256 randomNum = _generateRandom();
        won = randomNum < 25; // 25% шанс выигрыша
        
        players[msg.sender].totalPlayed++;
        
        if (won) {
            // Выигрыш = x2 ставки
            reward = amount * 2;
            
            // Проверяем что в банке достаточно средств
            if (bank >= reward) {
                bank -= reward;
                playerBalance[msg.sender] += reward;
                
                players[msg.sender].totalWins += reward;
                if (reward > players[msg.sender].bestWin) {
                    players[msg.sender].bestWin = reward;
                    emit NewHighScore(msg.sender, reward);
                }
                
                _updateLeaderboard(msg.sender);
            } else {
                // Если в банке недостаточно средств, выплачиваем что есть
                uint256 availableReward = bank;
                bank = 0;
                playerBalance[msg.sender] += availableReward;
                reward = availableReward;
            }
        } else {
            reward = 0;
            // Ставка остается в банке при проигрыше
        }
        
        emit BetPlaced(msg.sender, amount, bankBefore);
        emit BetResult(msg.sender, won, reward, randomNum);
        
        return (won, reward);
    }
    
    function _generateRandom() private view returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    bank,
                    playerBalance[msg.sender]
                )
            )
        ) % 100;
    }
    
    function _updateLeaderboard(address player) private {
        bool exists = false;
        for (uint i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] == player) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            leaderboard.push(player);
        }
    }
    
    function getLeaderboard() external view returns (
        address[] memory addresses,
        uint256[] memory totalWins,
        uint256[] memory bestWins
    ) {
        uint256 length = leaderboard.length > 10 ? 10 : leaderboard.length;
        addresses = new address[](length);
        totalWins = new uint256[](length);
        bestWins = new uint256[](length);
        
        // Простая сортировка по totalWins
        for (uint i = 0; i < length; i++) {
            address topPlayer = leaderboard[0];
            uint256 topWins = players[topPlayer].totalWins;
            
            for (uint j = 0; j < leaderboard.length; j++) {
                if (players[leaderboard[j]].totalWins > topWins) {
                    topPlayer = leaderboard[j];
                    topWins = players[leaderboard[j]].totalWins;
                }
            }
            
            addresses[i] = topPlayer;
            totalWins[i] = players[topPlayer].totalWins;
            bestWins[i] = players[topPlayer].bestWin;
        }
        
        return (addresses, totalWins, bestWins);
    }
    
    function getPlayerStats(address player) external view returns (
        uint256 totalWins,
        uint256 totalPlayed,
        uint256 bestWin,
        uint256 balance
    ) {
        Player memory p = players[player];
        return (p.totalWins, p.totalPlayed, p.bestWin, playerBalance[player]);
    }
    
    // Только владелец может забрать комиссию из банка
    function withdrawOwner(uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        require(bank >= amount, "Insufficient bank funds");
        bank -= amount;
        payable(owner).transfer(amount);
    }
}
