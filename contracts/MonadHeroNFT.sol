// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MonadHeroNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct HeroBadge {
        string level;      // RISING, BRAVE, EPIC, LEGENDARY
        uint256 tier;      // 1, 2, 3, 4
        uint256 score;     // Hero score at mint time
        uint256 timestamp; // Mint timestamp
        address hero;      // Hero's address
    }
    
    mapping(uint256 => HeroBadge) public heroBadges;
    mapping(address => uint256[]) public heroNFTs;
    mapping(address => bool) public hasClaimed;
    
    event HeroBadgeMinted(
        address indexed hero,
        uint256 indexed tokenId,
        string level,
        uint256 tier,
        uint256 score
    );
    
    constructor() ERC721("MonadHero Badge", "HERO") {}
    
    function mintHeroBadge(
        address to,
        string memory level,
        uint256 tier,
        uint256 score
    ) public returns (uint256) {
        require(tier >= 1 && tier <= 4, "Invalid tier");
        require(!hasClaimed[to], "Hero has already claimed badges");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(to, newTokenId);
        
        heroBadges[newTokenId] = HeroBadge({
            level: level,
            tier: tier,
            score: score,
            timestamp: block.timestamp,
            hero: to
        });
        
        heroNFTs[to].push(newTokenId);
        hasClaimed[to] = true;
        
        emit HeroBadgeMinted(to, newTokenId, level, tier, score);
        
        return newTokenId;
    }
    
    function getHeroNFTs(address hero) public view returns (uint256[] memory) {
        return heroNFTs[hero];
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        HeroBadge memory badge = heroBadges[tokenId];
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(bytes(abi.encodePacked(
                '{"name":"MonadHero ',badge.level,' Badge Tier ',_toString(badge.tier),
                '","description":"Hero Badge earned for exceptional activity on Monad blockchain",',
                '"image":"https://your-api.com/hero-badge/',badge.level,'/',_toString(badge.tier),'.png",',
                '"attributes":[',
                '{"trait_type":"Level","value":"',badge.level,'"},',
                '{"trait_type":"Tier","value":',_toString(badge.tier),'},',
                '{"trait_type":"Hero Score","value":',_toString(badge.score),'},',
                '{"trait_type":"Mint Date","value":',_toString(badge.timestamp),'}',
                ']}'
            )))
        ));
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    function _base64Encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        if (data.length == 0) return "";
        string memory result = new string(4 * ((data.length + 2) / 3));
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            for { let i := 0 } lt(i, mload(data)) { i := add(i, 3) } {
                let input := and(mload(add(data, add(32, i))), 0xffffff)
                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr( 6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(        input,  0x3F))), 0xFF))
                out := shl(224, out)
                mstore(resultPtr, out)
                resultPtr := add(resultPtr, 4)
            }
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }
        return result;
    }
}
