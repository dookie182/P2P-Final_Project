routing = {

    redirect: function(){
        if(sessionStorage.getItem("currentUser") == sessionStorage.getItem("lotteryOperator") && window.location.href != "http://localhost:3000/managerIndex.html" || sessionStorage.getItem("currentUser") == null && window.location.href != "http://localhost:3000/managerIndex.html"){
            window.location.replace("http://localhost:3000/managerIndex.html");
        }
        if(sessionStorage.getItem("currentUser") != sessionStorage.getItem("lotteryOperator") && window.location.href != "http://localhost:3000/userIndex.html"){
            window.location.replace("http://localhost:3000/userIndex.html");
        }
    }
}


// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
       routing.redirect();
    });
});

/*
$(function(){
    $(window).on('beforeunload', function(){
        sessionStorage.clear;
    })
})
*/