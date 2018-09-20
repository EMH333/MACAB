function setupClimate() {
    // Get the modal
    var modal = u("#climatePop").first();
    var yes = u("#climateYes");
    var no = u("#climateNo");
    // Detects if device is in standalone mode
    const standalone = () => ('standalone' in window.navigator) && (window.navigator.standalone);

    if (getCookie("climate") === "yes" || localStorage.getItem("climate") === "yes") {
        //has alread seen climate stuff
        setCookie("climate", "yes", 365); //set cookie and local storage again to be sure
        localStorage.setItem('climate', 'yes');
    } else if (standalone()) {
        modal.style.display = "block"; //display to user if haven't seen it and is has installed app
    }

    // Get the <span> element that closes the modal
    //var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    //span.onclick = function () {
    //modal.style.display = "none";//Currently not using this as we want the user to answer the question
    //};

    // When the user clicks anywhere outside of the modal, close it
    /*window.onclick = function (event) {
        if (event.target == modal) {
            //modal.style.display = "none";//Currently not using this as we want the user to answer the question
        }
    };*/

    //if someone clicks yes
    yes.on("click", function (event) {
        modal.style.display = "none"; //hide module
        localStorage.setItem('climate', 'yes');
        setCookie("climate", "yes", 365);
        ga('send', 'event', 'Climate Click', 'click', "Climate Yes");
    });

    //if someone clicks yes
    no.on("click", function (event) {
        modal.style.display = "none"; //hide module
        ga('send', 'event', 'Climate Click', 'click', "Climate No");
        window.location.href = "climate.html";
    });

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
}