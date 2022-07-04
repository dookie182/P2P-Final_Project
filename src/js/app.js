App = {

    contracts: {},
    web3Provider: null,             // Web3 provider
    url: 'http://localhost:8545',   // Url for web3
    account: '0x0',                 // current ethereum account

    init: function() {

        return App.initWeb3();
    },

    /* initialize Web3 */
    initWeb3: function() {
        console.log("Entered")
        // console.log(web3);
        
        if(typeof web3 != 'undefined') {
//            App.web3Provider = web3.currentProvider;
//            web3 = new Web3(web3.currentProvider);
            App.web3Provider = window.ethereum; // !! new standard for modern eth browsers (2/11/18)
            web3 = new Web3(App.web3Provider);
            try {
                    ethereum.enable().then(async() => {                     
                        console.log("DApp connected to Metamask");
                    });
            }
            catch(error) {
                console.log(error);
            }
        } else {
            App.web3Provider = new Web3.providers.HttpProvider(App.url); // <==
            web3 = new Web3(App.web3Provider);
        }

        return App.initContract();
    },

    /* Upload the contract's abstractions */
    initContract: function() {

        // Get current account
        web3.eth.getCoinbase(function(err, account) {
            if(err == null) {
                App.account = account; 
                $("#accountId").html("Account: " + account);
            }
        });

        // Load content's abstractions
        $.getJSON("Lottery.json").done(function(c) {
            App.contracts["Lottery"] = TruffleContract(c);
            App.contracts["Lottery"].setProvider(App.web3Provider);

            return App.listenForEvents();
        });
    },

    // Write an event listener
    listenForEvents: function() {

        App.contracts["Lottery"].deployed().then(async (instance) => {
            const div = document.getElementById("eventId");

            // web3.eth.getBlockNumber(function (error, block) {
                // click is the Solidity event
                instance.roundStart().on('data', function (event) {
                    //$("#eventId").html("Event catched: Round Start");
                    div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    New Round Started!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").first().hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });

                    console.log("Event catched: Round Start");
                    console.log(event);
                    // If event has parameters: event.returnValues.valueName
                });
                instance.ticketBuy().on('data', function (event) {
                    //$("#eventId").html("Event catched: Ticket Buy");

                    div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    Ticket Buy Event
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").first().hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });

                    console.log("Event catched: Ticket Buy");
                    console.log(event);
                    // If event has parameters: event.returnValues.valueName
                });
                instance.lotteryClosed().on('data', function (event) {
                    //$("#eventId").html("Event catched: Lottery Closed");
                    div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    Lottery Closed!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").first().hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                    console.log("Event catched: Lottery Closed");
                    console.log(event);
                    // If event has parameters: event.returnValues.valueName
                });
                instance.roundClosed().on('data', function (event) {
                    //$("#eventId").html("Event catched: Round Closed");
                    div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    Current round closed, wait for a new round!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").first().hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                    console.log("Event catched: Round Closed");
                    console.log(event);
                    // If event has parameters: event.returnValues.valueName
                });
                instance.lotteryStart().on('data', function (event) {
                    //$("#eventId").html("Event catched: Lottery Start");
                    div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    Lottery Started!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").first().hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                    console.log("Event catched: Lottery Start");
                    console.log(event);
                    // If event has parameters: event.returnValues.valueName
                });
                instance.NFTMinted().on('data', function (event) {
                    //$("#eventId").html("");
                    div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    NFT Minted
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                    console.log("Event catched: New NFT Minted");
                    console.log(event);
                    // If event has parameters: event.returnValues.valueName
                });

            // });
        });

        return App.render();
    },

    // Get a value from the smart contract
    render: function() {
        
        App.contracts["Lottery"].deployed().then(async(instance) =>{
            addressLotteryOperator = await instance.lotteryOperator();
            if(sessionStorage.getItem("lotteryOperator") == null && addressLotteryOperator != "0x0000000000000000000000000000000000000000"){
            sessionStorage.setItem("lotteryOperator",addressLotteryOperator.toLowerCase());
            }
            sessionStorage.setItem("currentUser", App.account);
            blockNumber = await web3.eth.getBlockNumber();
            $("#currentBlock").html("Block Number: "+ blockNumber);
            //const v = await instance.value(); // Solidity uint are Js BN (BigNumbers) 
            //console.log(v.toNumber());
            //$("#valueId").html("" + v);
        });
    },

    // Call a function from a smart contract
        // The function send an event that triggers a transaction:: Metamask opens to confirm the transaction by the user
    buyTicket: function() {
        const numbers = [];
        const div = document.getElementById("eventId");
        textInput = document.getElementsByName("numbers")
        for(i = 0; i < 6; i++){
            if(textInput[i].value != ""){
            numbers[i] =  textInput[i].value;
            //textInput[i].value = "";
            }
            console.log(numbers[i]);
        }
        if(numbers.length == 6){
        App.contracts["Lottery"].deployed().then(async(instance) =>{
            try{
            await instance.buy(numbers,{from:App.account, value: 1000000000000000000});
            }
            catch(e){                
                if(e.reason == "invalid BigNumber string"){
                div.innerHTML += `<div class="alert alert-danger" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>        
                <h4 class="alert-heading">Oops..</h4>
                <p>Check numbers inserted in the form!</p>
                <hr>
                <p class="mb-0">Please choose six different numbers! You cannot insert letters in the box!</p>
              </div>
              `;
              $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                }
            }
        });
    } else {
        div.innerHTML += `<div class="alert alert-danger" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>        
        <h4 class="alert-heading">Oops..</h4>
        <p>Check numbers inserted in the form!</p>
        <hr>
        <p class="mb-0">Please choose six different numbers!</p>
      </div>
      `;
        $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
    }
    }, 
    startLottery: function() {

        App.contracts["Lottery"].deployed().then(async(instance) =>{
            await instance.startLottery(10,{from:App.account});
        });
    }, 
    closeLottery: function() {
   
        App.contracts["Lottery"].deployed().then(async(instance) =>{
            await instance.closeLottery({from:App.account});
        });
    },
    closeRound: function() {
        const div = document.getElementById("eventId");

        App.contracts["Lottery"].deployed().then(async(instance) =>{
            roundClose = await instance.ticketingCloses;
            blockNumber = await web3.eth.getBlockNumber();

            console.log(blockNumber);
            console.log(roundClose);

            if(blockNumber >= roundClose){
            try{
                await instance.closeRound({from:App.account});
            }catch(e){
                console.log(e.reason);
                if(e.reason == "Round still open, please wait lottery round ends!"){
                    div.innerHTML += `<div class="alert alert-danger" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>        
                    <h4 class="alert-heading">Oops..</h4>
                    <p>Round still open, please wait lottery round ends!</p>
                    <hr>
                    <p class="mb-0">You cannot close the current lottery round until it ends!</p>
                  </div>
                  `;
                  $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                    }
            }
            }else{
                div.innerHTML += `<div class="alert alert-danger" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>        
                <h4 class="alert-heading">Oops..</h4>
                <p>Round still open, please wait lottery round ends!</p>
                <hr>
                <p class="mb-0">You cannot close the current lottery round until it ends!</p>
              </div>
              `;
              $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
            }
        });
    },
    startRound: function() {
        const div = document.getElementById("eventId");

        App.contracts["Lottery"].deployed().then(async(instance) =>{
            roundClose = await instance.ticketingCloses;
            blockNumber = await web3.eth.getBlockNumber();
            if(blockNumber >= roundClose){
                try{
                    await instance.startNewRound({from:App.account});
                }catch(e){
                    console.log(e.reason);
                }
                }else{
                    div.innerHTML += `<div class="alert alert-danger" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>        
                    <h4 class="alert-heading">Oops..</h4>
                    <p>Round still open, please wait lottery round ends!</p>
                    <hr>
                    <p class="mb-0">You cannot close the current lottery round until it ends!</p>
                  </div>
                  `;
                  $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                }
            
        });
    }

}

// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
        App.init();
    });
});