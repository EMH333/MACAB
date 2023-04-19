import { registerCalendarEventsAndRender } from "./calendar";
import { displayiosInstallPrompt } from "./install";
import { getDate, addDays, daysSinceEpoch } from "./dateUtils";
import u from "umbrellajs";

import "../scss/style.scss";

export async function updateDay(sinceEpoch) {
    var currentDate = sinceEpoch;
    var day = await getDate(currentDate);
    var add = 0;
    var total = parseInt(currentDate);
    var properRefrence = "a"; //the before character (like this is an example, instead of, this is a example)
    //make sure we don't loop forever
    while (day == "N" && add < 150) {
        add++;
        total = parseInt(currentDate) + parseInt(add);
        day = await getDate(total);
    }
    if (day == "A") {
        properRefrence = "an";
    }

    var weekdayOptions = {
        weekday: "long",
    };
    var dayOfTheWeek = addDays(total).toLocaleDateString("en-US", weekdayOptions);

    if (total - daysSinceEpoch() == 1) {
        u("#top-info").text("Tomorrow (" + dayOfTheWeek + ") is " + properRefrence + ":");
    } else if (total - daysSinceEpoch() == 0) {
        u("#top-info").text("Today (" + dayOfTheWeek + ") is " + properRefrence + ":");
    } else {
        var options = {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "2-digit"
        };
        u("#top-info").text(addDays(total).toLocaleDateString("en-US", options) + " is " + properRefrence + ":");
    }

    u("#day").html(day);

    if (day == null || day == "N") {
        u("#top-info").text("We Have No Information For That Date! Sorry!");
        u("#day").text("");
        u("#bottom-info").text("");
    } else {
        u("#bottom-info").text("Day");
    }

    /*if (fromCal) {//only if from calendar
        //Sends date selected in form of YYYY-MM-DD to google anylitics so I can see what people are interested in
        ga('send', 'event', 'Calendar', 'select', addDays(parseInt(currentDate)).toISOString().slice(0, 10));
    }*/
    console.log("Add:" + add + " Epoch:" + currentDate + " Total:" + total);
}

const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";

document.addEventListener("DOMContentLoaded", async function () {
    //addSummer(); //Add summer no school days

    await registerCalendarEventsAndRender(); //Register calendar stuff and render all days

    updateDay(daysSinceEpoch(), false); //inital update, not from calendar

    displayiosInstallPrompt();

    //register service worker
    if ('serviceWorker' in navigator && !isLocalhost) {
        navigator.serviceWorker
            .register('/sw.js')
            .then(function () {
                console.log("Service Worker Registered");
            });
    }
});
//https://picnicss.com/documentation#input
//https://umbrellajs.com/documentation#html
