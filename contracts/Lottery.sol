// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LotteryMint.sol";

contract Lottery{

    //Data struct to manage player's address and played numbers
    struct Ticket{
        address playerAddress;
        uint [] playedNumbers;
    }

    uint private constant TICKET_PRICE = 1 ether; 
    address payable public lotteryOperator; //Address of the lottery operator
    
    uint public ticketingCloses;

    //Declaration of LotteryMint contract
    LotteryMint item;
    
    //List of NFTs IDs
    uint256 [8] private NFTList;
    
    //Array for sorted winning numbers
    uint256 [6] private winningNumbers; 
    
    uint8 private previousValue;
    Ticket [] private tickets;
    uint public lotteryDuration;
    uint private DEBUG = 1;
    uint private K = 11;

    // Events 
    event ticketBuy(address player);
    event roundClosed();
    event roundStart();
    event NFTMinted(address NFTOwner, uint256 newNFTId);
    event awardPlayer(address player, uint256 prize);
    event numbersDrawn(uint256[6] winningNumbers);
    event lotteryClosed();
    event lotteryStart();
    event test();
   


    
    constructor (){}

    //Function to create a new Lottery
    function startLottery (uint duration) public {
        lotteryOperator = payable(msg.sender);
        item = new LotteryMint();
        ticketingCloses = block.number + duration;
        lotteryDuration = duration;
        for(uint i = 1; i < 9; i++){
            mint(i);
        }
        emit lotteryStart();
    }
    
    //Function to buy a new Ticket and to choose numbers to play
    function buy (uint [] memory numbers) public payable { 
        require(block.number <= ticketingCloses, "Lottery round already closed, wait for a new round please!");
        require(msg.value == TICKET_PRICE, "Not enough money, Ticket Price --> 1 Ether"); 
        require(numbers.length == 6, "Please choose exactly six different numbers!");
        Ticket memory newTicket;
        newTicket.playerAddress = msg.sender;
        newTicket.playedNumbers = numbers;
        tickets.push(newTicket);
        emit ticketBuy(msg.sender);
    }

    //Function to select and award winners
    function givePrizes () private {
        require(msg.sender == lotteryOperator, "You are not the lottery operator, permission denied!");
        require(block.number > ticketingCloses, "Round still open, please wait lottery round ends!"); 

        uint guessed = 0;
        uint class = 0;
        bool powerBall = false;
        
        for(uint i = 0; i < tickets.length ;i++){
            Ticket memory player = tickets[i];
            for(uint j = 0; j < player.playedNumbers.length - 1 ; j++){
                uint num = player.playedNumbers[j];
                for(uint k = 0; k < 5; k++){
                    if(num == winningNumbers[k]){
                        guessed++;
                    }
                }
            }
            if(player.playedNumbers[5] == winningNumbers[5]){
                powerBall = true;
            }
            class = uint(selectClass(guessed,powerBall));

            if(class > 0){
                item.sendNFT(player.playerAddress, NFTList[class - 1]);
                emit awardPlayer(player.playerAddress, NFTList[class - 1]);
                mint(class);
            }
            powerBall = false;
            guessed = 0;
        }
    }

    //Function used to select correct prize class
    function selectClass (uint guessed, bool powerBall) private pure returns(uint) {
        uint prize = 0;
        
        if(guessed == 0 && powerBall){
            prize = 8;
        }else{
            if(guessed == 1 && !powerBall){
                prize = 7;
            }else{
                if(guessed == 2 && !powerBall || (guessed == 1 && powerBall)){
                    prize = 6;
                }else{
                    if(guessed == 3 && !powerBall || (guessed == 2 && powerBall)){
                        prize = 5;
                    }else{
                        if(guessed == 4 && !powerBall || (guessed == 3 && powerBall)){
                            prize = 4;
                        }else{
                            if(guessed == 4 && powerBall){
                                prize = 3;
                            }else{
                                if(guessed == 5 && !powerBall){
                                    prize = 2;
                                }else{
                                    if(guessed == 5 && powerBall){
                                        prize = 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return prize;
    }
    //Function used to start a new lottery round
    function startNewRound () public {
        require(msg.sender == lotteryOperator, "You are not the lottery operator, permission denied!");
        require(block.number > ticketingCloses, "Round still open, please wait lottery round ends!");
        delete winningNumbers;
        delete tickets;
        ticketingCloses = block.number + lotteryDuration;
        emit roundStart();
    }

    //Function for lottery operator to draw winning numbers
    function drawNumbers () private {
        if(DEBUG == 1){
        for (uint i = 0; i < 5; i++){
            winningNumbers[i] = i+1;
        }
        winningNumbers[5] = 6;
        }else{
        require(msg.sender == lotteryOperator, "You are not the lottery operator, permission denied!");
        require(block.number > ticketingCloses, "Round still open, please wait lottery round ends!"); 
        for (uint i = 0; i < 6; i++){
            
            if(i == 5){
                winningNumbers[i] = rand(26);
            }
            else{
                winningNumbers[i] = rand(69);
            }
            for(uint j = 0; j <= i; j++){
                if(winningNumbers[i] == winningNumbers[j] && i != 5){
                    emit test();
                    winningNumbers[i] = rand(69);
                }
                if(winningNumbers[i] == winningNumbers[j] && i == 5){
                    winningNumbers[i] = rand(26);
                }
            }
        }
        }

        emit numbersDrawn(winningNumbers);
    }

    //Function used draw numbers and give prizes. Only the lottery operator can call this function.
    function closeRound () public{
        require(msg.sender == lotteryOperator, "You are not the lottery operator, permission denied!");
        require(block.number >= ticketingCloses, "Round still open, please wait lottery round ends!"); 
        drawNumbers();
        givePrizes();
        withdraw();
        emit roundClosed();
    }

    //Function used to close the Lottery and deactivate  the contract
    function closeLottery () public {
        require(msg.sender == lotteryOperator, "You are not the lottery operator, permission denied!");
        address payable refunded;
        if (block.number <= ticketingCloses){
            for (uint i = 0; i < tickets.length ;i++){
                refunded = payable(tickets[i].playerAddress);
                refunded.transfer(TICKET_PRICE);
            }
        }
        emit lotteryClosed();
        selfdestruct(payable(msg.sender));
    }

    //Function used to mint a new NFT
    function mint (uint class) private{
        require(msg.sender == lotteryOperator, "You are not the lottery operator, permission denied!");
        uint256 NFT_ID = uint256(item.awardItem(class));
        NFTList[class - 1] = NFT_ID;
        emit NFTMinted(msg.sender, NFT_ID);
    }
    
    //Function used by the lottery operator to send contract balance to  the lottery operator's address
    function withdraw () private { 
        require(msg.sender == lotteryOperator, "You are not the lottery operator, permission denied!");
        require(block.number > ticketingCloses, "Round still open, please wait lottery round ends!"); 
        lotteryOperator.transfer(address(this).balance);
     }

    //Function used to deterministically extract pseudo-random winning numbers for the lottery
    function rand(uint modulus) private returns (uint8) {
        previousValue = uint8((uint256(keccak256(abi.encodePacked(block.number + K + block.timestamp, previousValue))))% modulus);
        K += 1;
        return previousValue;
    }
    
    //Function used to get URI linked to minted NFT;
    function getURI(uint256 tokenID) view public returns (string memory){
        return item.getTokenURI(tokenID);
    }
}

