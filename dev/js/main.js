//Origin is First of January 2018
const EPOCH = new Date(2018, 0, 0);
var dates = {
    110: "N",
    111: "N",
    112: "N",
    113: "B",
    114: "A",
    115: "B",
    116: "A",
    117: "B",
    118: "N",
    119: "N",
    120: "A",
    121: "B",
    122: "A",
    123: "B",
    124: "A",
    125: "N",
    126: "N",
    132: "N",
    133: "N",
    139: "N",
    140: "N",
    146: "N",
    147: "N",
    148: "N",
    149: "A",
    150: "B",
    151: "A",
    152: "B",
    153: "N",
    154: "N",
    155: "A",
    156: "B",
    157: "A",
    158: "B",
    159: "A",
    160: "N",
    161: "N",
    162: "B",
    163: "A",
    164: "B",
    165: "A",
    166: "B",
    167: "N",
}

function addSummer() {
    //NOTE THIS DATES ARE DESIGNED TO BE ACTIVE FOR THE SUMMER OF 2018
    for (let index = 168; index < 247; index++) {
        dates[index] = "N";
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
    while (day == "N") {
        add++;
        total = parseInt(currentDate) + parseInt(add);
        day = dates[total];
    }
    if (!fromCal) {
        if (add == 1) {
            u("#top-info").text("Tommorow is a:");
        } else if (add > 0) {
            u("#top-info").text("The next school day (" + add + " days from now), is a:");
        } else {
            u("#top-info").text("Today is a:");
        }
    } else {
        if (total - daysSinceEpoch() == 1) {
            u("#top-info").text("Tommorow is a:");
        } else if (total - daysSinceEpoch() == 0) {
            u("#top-info").text("Today is a:");
        } else {
            var options = {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            };
            u("#top-info").text(addDays(total).toLocaleDateString('en-US', options) + " is a:");
        }
    }
    u("#day").html(day);

    //console.log("Add:" + add + " Epoch:" + currentDate + " Total:" + total);
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
    addSummer();

    updateDay(daysSinceEpoch(), false); //inital update, not from calendar

    updateListeners(); //add/update calendar listeners

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