/* global Cal */
import { registerCalendarEventsAndRender } from "./calendar";
import { setupClimate } from "./climate";
import { displayiosInstallPrompt } from "./install";
import { dates, addSummer, addDays, daysSinceEpoch } from "./dateUtils";
import u from "umbrellajs";

export function updateDay(sinceEpoch, fromCal) {
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

    if (dates[total] == null) {
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

document.addEventListener("DOMContentLoaded", function (event) {
    addSummer(); //Add summer no school days

    registerCalendarEventsAndRender(); //Register calendar stuff and render all days

    updateDay(daysSinceEpoch(), false); //inital update, not from calendar

    setupClimate();

    displayiosInstallPrompt();

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
