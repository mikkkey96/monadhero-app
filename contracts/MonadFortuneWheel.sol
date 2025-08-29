// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MonadFortuneWheel {
    uint256 public bank;
    uint256 public minBet = 0.05 ether; // 0.05 MON
    uint256 public maxBet = 0.5 ether;  // 0.5 MON
    address public owner;
    
    struct Player {
        uint256 totalWins;
        uint256 totalPlayed;
        uint256 bestWin;
    }
    
    mapping(address => Player) public players;
    address[] public leaderboard;
    
    event BetPlaced(address indexed player, uint256 amount, uint256 bankBefore);
    event BetResult(address indexed player, bool won, uint256 reward, uint256 random);
    event NewHighScore(address indexed player, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    function placeBet() external payable returns (bool won, uint256 reward) {
        require(msg.value >= minBet, "Bet below minimum 0.05 MON");
        require(msg.value <= maxBet, "Bet above maximum 0.5 MON");
        
        uint256 bankBefore = bank;
        bank += msg.value;
        
        // Генерируем случайное число 0-99
        uint256 randomNum = _generateRandom();
        won = randomNum < 25; // 25% шанс выигрыша
        
        players[msg.sender].totalPlayed++;
        
        if (won) {
            reward = bank; // Весь банк победителю!
            bank = 0;
            
            players[msg.sender].totalWins += reward;
            if (reward > players[msg.sender].bestWin) {
                players[msg.sender].bestWin = reward;
                emit NewHighScore(msg.sender, reward);
            }
            
            // Обновляем лидерборд
            _updateLeaderboard(msg.sender);
            
            // Выплачиваем выигрыш
            payable(msg.sender).transfer(reward);
        }
        
        emit BetPlaced(msg.sender, msg.value, bankBefore);
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
                    bank
                )
            )
        ) % 100;
    }
    
    function _updateLeaderboard(address player) private {
        // Добавляем игрока в лидерборд если его там нет
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
        
        // Простая сортировка по totalWins (можно оптимизировать)
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
        uint256 bestWin
    ) {
        Player memory p = players[player];
        return (p.totalWins, p.totalPlayed, p.bestWin);
    }
    
    // Только владелец может снять комиссию (если добавить)
    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
