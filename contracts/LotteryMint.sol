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
        URI[0] = "https://ipfs.io/ipfs/QmVR8saozo2wniS3VxA4jAdiJAmEe2r2Hg6F9csiQrd3os?filename=Petra%20-%20Giordania.jpg";
        URI[1] = "https://ipfs.io/ipfs/QmeAa7KYRexb4q8P9vVPqHyR4xfw5Db6GmeXKpfGzCZuJz?filename=Grande%20Muraglia%20Cinese%20-%20Cina.jpg";
        URI[2] = "https://ipfs.io/ipfs/QmV7M4my4uRwgLNtjBN4PFC2WjUceahiKfbXNtREsvWLta?filename=Colosseo%20-%20Italia.jpg";
        URI[3] = "https://ipfs.io/ipfs/Qmb4TXhHqtwv2XALGfY9iznbb5bp8dYpiZcWF8BhiAaNYg?filename=Machu%20Picchu%20-%20Peru%CC%80.jpg";
        URI[4] = "https://ipfs.io/ipfs/QmSJXaUeyeQFsArZbFvg2adXbyMbVdz24644gowt92DBHg?filename=Cristo%20Redentore%20-%20Brasile.jpg";
        URI[5] = "https://ipfs.io/ipfs/QmSniYADMf7NDm4SXba37q5moPcHQfsGkrKVavwz84JhX4?filename=Chiche%CC%81n%20Itza%CC%81%20-%20Messico.jpg";
        URI[6] = "https://ipfs.io/ipfs/QmerWLUCimRVAveEBPW2MQmLZ5VDq24W8y9vQ2wNFnd9jj?filename=Taj%20Mahal%20-%20India.jpg";
        URI[7] = "https://ipfs.io/ipfs/QmXdZpwuPc3WgnCCR7NGLkvERX5sxNVdXQaVTEEZgVBATx?filename=7%20Meraviglie%20del%20mondo%20moderno.jpg";

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