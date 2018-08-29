/* global u, Cal */
//Origin is First of January 2018
const EPOCH = new Date(2018, 0, 0);
var dates = Object.assign({}, yearStarting2017, yearStarting2018);
function addSummer() {
    //NOTE THIS DATES ARE CURRENTLY DESIGNED TO BE ACTIVE FOR THE SUMMER OF 2018 AND 2019
    for (var index = 168; index < 247; index++) {
        dates[index] = "N";
    }
    for (var sum2019 = 532; sum2019 < 612; sum2019++) {
        dates[sum2019] = "N";
    }
}

function daysSinceEpoch(n) {
    var now;
    if (n == null) {
        now = new Date();
    } else {
        now = new Date(n);
    }
    //var start = new Date(now.getFullYear(), 0, 0);
    var start = EPOCH; //This is uses our "epoch"
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    //console.log('Day of year: ' + day);
    return day;
}

function addDays(days) {
    var result = new Date(EPOCH);
    result.setDate(result.getDate() + days);
    return result;
}

function updateDay(sinceEpoch, fromCal) {
    var currentDate = sinceEpoch;
    var day = dates[currentDate];
    var add = 0;
    var total = parseInt(currentDate);
    var properRefrence = "a"; //the before character (like this is an example, instead of, this is a example)
    while (day == "N") {
        add++;
        total = parseInt(currentDate) + parseInt(add);
        day = dates[total];
    }
    if (day == "A") {
        properRefrence = "an";
    }
    if (!fromCal) {
        if (add == 1) {
            u("#top-info").text("Tommorow is " + properRefrence + ":");
        } else if (add > 0) {
            u("#top-info").text("The next school day (" + add + " days from now), is " + properRefrence + ":");
        } else {
            u("#top-info").text("Today is " + properRefrence + ":");
        }
    } else {
        if (total - daysSinceEpoch() == 1) {
            u("#top-info").text("Tommorow is " + properRefrence + ":");
        } else if (total - daysSinceEpoch() == 0) {
            u("#top-info").text("Today is " + properRefrence + ":");
        } else {
            var options = {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric"
            };
            u("#top-info").text(addDays(total).toLocaleDateString("en-US", options) + " is " + properRefrence + ":");
        }
    }
    u("#day").html(day);

    if (dates[total] == null) {
        u("#top-info").text("We Have No Information For That Date! Sorry!");
        u("#day").text("");
        u("#bottom-info").text("");
    } else {
        u("#bottom-info").text("Day");
    }

    console.log("Add:" + add + " Epoch:" + currentDate + " Total:" + total);
}

function updateListeners() {
    u(".cal-date").off('click'); //deregister previous
    u(".cal-date").on('click', function (data) {
        var target = u(data.target);
        var date = target.data("date");
        //console.log(date);
        updateDay(date, true);
        u(".cal-date").each(function (node, i) {
            u(node).addClass("cal-notactive");
            u(node).removeClass("cal-active");
        });
        target.addClass("cal-active");
        target.removeClass("cal-notactive");
    });
}

document.addEventListener("DOMContentLoaded", function (event) {
    addSummer();//Add summer no school days

    registerCalendarEventsAndRender(); //Register calendar stuff and render all days

    updateDay(daysSinceEpoch(), false); //inital update, not from calendar

    updateListeners(); //add/update calendar listeners

    setupClimate();

    //register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js')
            .then(function () {
                console.log("Service Worker Registered");
            });
    }
});
//https://picnicss.com/documentation#input
//https://umbrellajs.com/documentation#html