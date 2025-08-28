// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MonadHeroNFT is ERC721, Ownable {
    using Strings for uint256;
    
    uint256 private _tokenIdCounter;
    uint256 public constant MINT_PRICE = 0.001 ether; // 0.001 MON
    uint256 public constant MAX_SUPPLY = 10000;
    
    struct HeroBadge {
        string level;      // "LEGENDARY HERO", "EPIC HERO", etc.
        uint256 tier;      // 1-4 badges
        uint256 score;     // Hero score
        uint256 timestamp; // Mint timestamp
        address hero;      // Minter address
    }
    
    mapping(uint256 => HeroBadge) public heroBadges;
    mapping(address => uint256[]) public heroTokens;
    
    event HeroBadgeMinted(
        address indexed hero, 
        uint256 indexed tokenId, 
        string level, 
        uint256 tier, 
        uint256 score
    );
    
    constructor() ERC721("MonadHero Badge", "HERO") Ownable(msg.sender) {}
    
    function mintHeroBadge(
        string memory level, 
        uint256 tier, 
        uint256 score
    ) public payable returns (uint256) {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(tier >= 1 && tier <= 4, "Invalid tier");
        require(bytes(level).length > 0, "Level cannot be empty");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _mint(msg.sender, tokenId);
        
        heroBadges[tokenId] = HeroBadge({
            level: level,
            tier: tier,
            score: score,
            timestamp: block.timestamp,
            hero: msg.sender
        });
        
        heroTokens[msg.sender].push(tokenId);
        
        emit HeroBadgeMinted(msg.sender, tokenId, level, tier, score);
        
        return tokenId;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        HeroBadge memory badge = heroBadges[tokenId];
        
        string memory json = string(abi.encodePacked(
            '{"name": "MonadHero ',badge.level,' Badge #',tokenId.toString(),
            '", "description": "Hero Badge earned for exceptional activity on Monad blockchain",',
            ' "image": "https://monadhero-app.vercel.app/api/nft-image/',tokenId.toString(),
            '", "attributes": [',
            '{"trait_type": "Level", "value": "',badge.level,'"},',
            '{"trait_type": "Tier", "value": ',badge.tier.toString(),'},',
            '{"trait_type": "Hero Score", "value": ',badge.score.toString(),'},',
            '{"trait_type": "Mint Date", "value": ',badge.timestamp.toString(),'}',
            ']}'
        ));
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(bytes(json))
        ));
    }
    
    function getHeroTokens(address hero) public view returns (uint256[] memory) {
        return heroTokens[hero];
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Base64 encoding helper
    function _base64Encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        
        if (data.length == 0) return "";
        
        string memory result = new string(4 * ((data.length + 2) / 3));
        
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            
            for { let i := 0 } lt(i, mload(data)) { i := add(i, 3) } {
                let input := and(mload(add(data, add(32, i))), 0xffffff)
                
                let out := shl(248, and(div(input, exp(256, 2)), 0xFF))
                out := add(out, and(shl(240, and(div(input, exp(256, 1)), 0xFF)), 0xFF00))
                out := add(out, and(shl(232, and(input, 0xFF)), 0xFF0000))
                out := add(out, shl(224, 0x3D3D3D))
                
                mstore(resultPtr, out)
                resultPtr := add(resultPtr, 4)
            }
        }
        
        return result;
    }
}
