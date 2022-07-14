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
        
        if(typeof web3 != 'undefined') {
            App.web3Provider = window.ethereum; 
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
            App.web3Provider = new Web3.providers.HttpProvider(App.url);
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

            //  Event Listener for RoundStart event;
                instance.roundStart().on('data', function (event) {
                    //$("#eventId").html("Event catched: Round Start");
                    div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    New Round Started!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });

                    console.log("Event catched: Round Start");
                    console.log(event);
                });

                //  Event Listener for TicketBuy event;
                instance.ticketBuy().on('data', function (event) {
                    div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    Ticket Buy Event
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                    console.log("Event catched: Ticket Buy");
                    console.log(event);
                });

                //  Event Listener for LotteryClosed event;
                instance.lotteryClosed().on('data', function (event) {
                    div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    Lottery Closed!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                    console.log("Event catched: Lottery Closed");
                    console.log(event);
                });

                //  Event Listener for RoundClosed event;
                instance.roundClosed().on('data', function (event) {
                    //$("#eventId").html("Event catched: Round Closed");
                    div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    Current round closed, wait for a new round!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                    console.log("Event catched: Round Closed");
                    console.log(event);
                });

                //  Event Listener for LotteryStart event;
                instance.lotteryStart().on('data', function (event) {
                    $("#eventId").html(`<div class="alert alert-success alert-dismissible fade show" role="alert">
                    Lottery Started!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`);
                  $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                    console.log("Event catched: Lottery Start");
                    console.log(event);
                });

                //  Event Listener for NFTMinted event;
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
                });

                //  Event Listener for awardPlayer event;
                instance.awardPlayer().on('data', function (event) {
                  div.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    Player Awarded!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`;
                  $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                    console.log("Event catched: Player Awarded!");
                    console.log(event);
                });
        });

        return App.render();
    },

    render: function() {
        
        App.contracts["Lottery"].deployed().then(async(instance) =>{
            addressLotteryOperator = await instance.lotteryOperator();
            const div = document.getElementById("eventId");
            if(sessionStorage.getItem("lotteryOperator") == null && addressLotteryOperator != "0x0000000000000000000000000000000000000000"){
            sessionStorage.setItem("lotteryOperator",addressLotteryOperator.toLowerCase());
            window.location.reload();
            }
            sessionStorage.setItem("currentUser", App.account);
            blockNumber = await web3.eth.getBlockNumber();
            closingBlock = await instance.ticketingCloses();
            duration = await instance.lotteryDuration();

            roundStartBlock = parseInt(closingBlock) - parseInt(duration); 

            $("#currentBlock").html("Current Block :"+ blockNumber);
            $("#closingBlock").html("Closing Block :"+ closingBlock);
            $("#roundStartBlock").html("Round Start Block :"+ roundStartBlock);

            instance.getPastEvents('numbersDrawn', {
                fromBlock: roundStartBlock,
                toBlock: 'latest'
            }, function(error, events){ console.log(events); })
            .then(function(events){
                if(events.length != 0){
                $("#drawnNumbers").html("Last Drawn Numbers: " + events[0].returnValues.winningNumbers.toString());
                }
            });
            tokenURI = await instance.getURI(0);

            instance.getPastEvents('awardPlayer', {
                fromBlock: roundStartBlock,
                toBlock: 'latest'
            }, function(error, events){ console.log(events); })
            .then(async(events) =>{

                if(events.length != 0 && sessionStorage.getItem("currentUser") == events[0].returnValues.player.toLowerCase()){
                    for(i = 0; i < events.length; i++){
                        tokenURI = await instance.getURI(events[i].returnValues.prize);
                        $("#prizes").append(`<figure class="figure">
                            <img src="`+ tokenURI + `" class="figure-img img-fluid rounded" alt="A generic square placeholder image with rounded corners in a figure.">
                        <figcaption class="figure-caption">Account:` + events[i].returnValues.player + ` has won NFT #:` + events[i].returnValues.prize + `  </figcaption>
                      </figure>
                      <hr style="height:2px;border-width:0;color:gray;background-color:gray;width:95%">`);
                    }
                }
            });

            if(window.location.href == "http://localhost:3000/nftList.html"){

                    nftList = await instance.getNFTList(App.account,{from:App.account});        
                    if(nftList.length != 0){
                        for(j = 0; j < nftList.length; j++){
                            tokenURI = await instance.getURI(nftList[j].words[0]);
                            
                            $("#allPrizes").append(`<figure class="figure">
                                <img src="`+ tokenURI + `" class="figure-img img-fluid rounded" alt="A generic square placeholder image with rounded corners in a figure.">
                            <figcaption class="figure-caption">Account:` + App.account + ` has won NFT #:` + nftList[j].words[0] + `  </figcaption>
                            </figure>
                            <hr style="height:2px;border-width:0;color:gray;background-color:gray;width:95%">`);
            
                            }
                        }
            }
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
            textInput[i].value = "";
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

                }else{
                
                div.innerHTML += `<div class="alert alert-danger" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>        
                <h4 class="alert-heading">Oops..</h4>
                <p>Lottery round already closed!</p>
                <hr>
                <p class="mb-0">Please wait for a new round!</p>
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
        const lotteryDuration = document.getElementsByName("lotteryDuration");
        const div = document.getElementById("eventId");
        App.contracts["Lottery"].deployed().then(async(instance) =>{
            try {
                await instance.startLottery(lotteryDuration[0].value,{from:App.account});

            } catch (e) {
                if(e.reason == "invalid BigNumber string"){
                    div.innerHTML += `<div class="alert alert-danger" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>        
                    <h4 class="alert-heading">Oops..</h4>
                    <p>Check lottery duration!</p>
                    <hr>
                    <p class="mb-0">Please insert the duration of a single lottery round.</p>
                  </div>
                  `;
                  $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
    
                    }
                else{
                        div.innerHTML += `<div class="alert alert-danger" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>        
                        <h4 class="alert-heading">Oops..</h4>
                        <p>Lottery already existing!</p>
                        <hr>
                        <p class="mb-0">Please close the current lottery to open a new one.</p>
                        </div>
                        `;
                        $(".alert").hide().fadeIn(200).delay(1500).fadeOut(1000, function () { $(this).remove(); });
                
            }
                
            }
        });
    }, 
    closeLottery: function() {
   
        App.contracts["Lottery"].deployed().then(async(instance) =>{
            await instance.closeLottery({from:App.account});
            localStorage.setItem("closed", true);
        });
    },
    closeRound: function() {
        const div = document.getElementById("eventId");

        App.contracts["Lottery"].deployed().then(async(instance) =>{
            roundClose = await instance.ticketingCloses();
            blockNumber = await web3.eth.getBlockNumber();

            if(blockNumber == roundClose){
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
            roundClose = await instance.ticketingCloses();
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
    },
    showPrizes: function(){
        
        App.contracts["Lottery"].deployed().then(async(instance) =>{
            nftList = await instance.getNFTList(App.account.toLowerCase(),{from:App.account});
            window.location.replace("http://localhost:3000/nftList.html");

            if(nftList.length != 0){
            const div = document.getElementById("#allPrizes");
            for(i = 0; i < nftList.length; i++){
                tokenURI = await instance.getURI(nftList[i].words[0]);
                
                $("#allPrizes").append(`<figure class="figure">
                    <img src="`+ tokenURI + `" class="figure-img img-fluid rounded" alt="A generic square placeholder image with rounded corners in a figure.">
                <figcaption class="figure-caption">Account:` + App.account + ` has won NFT #:` + nftList[i].words[0] + `  </figcaption>
                </figure>
                <hr style="height:2px;border-width:0;color:gray;background-color:gray;width:95%">`);

            }
        }        
        });


    }

}
routing = {

    getUserIndex: function(){
            window.location.replace("http://localhost:3000/userIndex.html");
    },

    getManagerIndex: function(){
            window.location.replace("http://localhost:3000/managerIndex.html");
    },

    redirect: function(){

        if(localStorage.getItem("closed") == 'true' && window.location.href != "http://localhost:3000/lotteryClosed.html"){
            window.location.replace("http://localhost:3000/lotteryClosed.html");
        }

        if(sessionStorage.getItem("currentUser") == sessionStorage.getItem("lotteryOperator") && window.location.href != "http://localhost:3000/managerIndex.html" && window.location.href != "http://localhost:3000/nftList.html"){
            window.location.replace("http://localhost:3000/managerIndex.html");
        }
        if(sessionStorage.getItem("currentUser") != sessionStorage.getItem("lotteryOperator") && window.location.href != "http://localhost:3000/userIndex.html" && window.location.href != "http://localhost:3000/nftList.html" ){
            window.location.replace("http://localhost:3000/userIndex.html");
        }
    }
}

// Call App.init and routing.redirect() whenever the window loads;
$(function() {
    $(window).on('load', function () {
        App.init();
        routing.redirect();
    });
});