// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MonadHeroNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct HeroBadge {
        string level;      
        uint256 tier;      
        uint256 score;     
        uint256 timestamp; 
        address hero;      
    }
    
    mapping(uint256 => HeroBadge) public heroBadges;
    mapping(address => uint256[]) public heroTokens;
    
    uint256 public constant MINT_PRICE = 0.001 ether; // 0.001 MON
    
    event HeroBadgeMinted(address indexed hero, uint256 indexed tokenId, string level, uint256 tier, uint256 score);
    
    constructor() ERC721("MonadHero Badge", "HERO") {}
    
    function mintHeroBadge(string memory level, uint256 tier, uint256 score) 
        public 
        payable 
        returns (uint256) 
    {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(tier >= 1 && tier <= 4, "Invalid tier");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        
        heroBadges[newTokenId] = HeroBadge({
            level: level,
            tier: tier,
            score: score,
            timestamp: block.timestamp,
            hero: msg.sender
        });
        
        heroTokens[msg.sender].push(newTokenId);
        
        emit HeroBadgeMinted(msg.sender, newTokenId, level, tier, score);
        
        return newTokenId;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        HeroBadge memory badge = heroBadges[tokenId];
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(bytes(abi.encodePacked(
                '{"name":"MonadHero ',badge.level,' Badge Tier ',_toString(badge.tier),
                '","description":"Hero Badge earned for exceptional activity on Monad blockchain",',
                '"attributes":[',
                '{"trait_type":"Level","value":"',badge.level,'"},',
                '{"trait_type":"Tier","value":',_toString(badge.tier),'},',
                '{"trait_type":"Hero Score","value":',_toString(badge.score),'}',
                ']}'
            )))
        ));
    }
    
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Helper functions для base64 и toString...
}
