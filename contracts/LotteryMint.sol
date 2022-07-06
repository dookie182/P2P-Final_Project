// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LotteryMint is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    
    string [8] public URI;
    uint256 [] public tokens;
    address lotteryOperator;



    constructor() ERC721("LotteryMint", "LTM") {
        
        lotteryOperator = msg.sender;
        URI[0] = "https://i.ibb.co/Y8Pn24g/Petra-Giordania.webp";
        URI[1] = "https://i.ibb.co/SvTgc6W/Grande-Muraglia-Cinese-Cina.webp";
        URI[2] = "https://i.ibb.co/NW9znYb/Colosseo-Italia.webp";
        URI[3] = "https://i.ibb.co/Lzzj9jB/Machu-Picchu-Peru.webp";
        URI[4] = "https://i.ibb.co/zXNHshT/Cristo-Redentore-Brasile.webp";
        URI[5] = "https://i.ibb.co/9HJ08Yn/Chiche-n-Itza-Messico.webp";
        URI[6] = "https://i.ibb.co/64WMgpX/Taj-Mahal-India.webp";
        URI[7] = "https://i.ibb.co/p3scMKw/7-Meraviglie-del-mondo-moderno.jpg";

    }

    function awardItem(uint class)
        public
        returns (uint256)
    {
        require(class > 0 && class < 9, "Please insert a correct class for the prize!");
        uint256 newItemId = _tokenIds.current();
        _mint(lotteryOperator, newItemId);
        _setTokenURI(newItemId, URI[class - 1]);
        _tokenIds.increment();
        return newItemId;
    }

    function sendNFT (address player, uint256 tokenId) public{
        require(msg.sender == lotteryOperator, "You are not the lottery operator, permission denied!");
        safeTransferFrom(lotteryOperator, player, tokenId);
    }

    function getTokenURI(uint256 tokenID) view public returns (string memory){
        return tokenURI(tokenID);
    }


}
