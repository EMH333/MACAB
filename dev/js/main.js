import { registerCalendarEventsAndRender } from "./calendar";
import { displayiosInstallPrompt } from "./install";
import { getDate, addDays, daysSinceEpoch } from "./dateUtils";
import u from "umbrellajs/umbrella.esm.js";

import "../scss/style.scss";

export async function updateDay(sinceEpoch) {
    let currentDate = sinceEpoch;
    let day = await getDate(currentDate);
    let add = 0;
    let total = parseInt(currentDate);
    let properRefrence = "a"; //the before character (like this is an example, instead of, this is a example)
    //make sure we don't loop forever
    while (day == "N" && add < 150) {
        add++;
        total = parseInt(currentDate) + parseInt(add);
        day = await getDate(total);
    }
    if (day == "A") {
        properRefrence = "an";
    }

    const weekdayOptions = {
        weekday: "long",
    };
    const dayOfTheWeek = addDays(total).toLocaleDateString("en-US", weekdayOptions);

    if (total - daysSinceEpoch() == 1) {
        u("#top-info").text("Tomorrow (" + dayOfTheWeek + ") is " + properRefrence + ":");
    } else if (total - daysSinceEpoch() == 0) {
        u("#top-info").text("Today (" + dayOfTheWeek + ") is " + properRefrence + ":");
    } else {
        const options = {
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

    console.log("Add:" + add + " Epoch:" + currentDate + " Total:" + total);
}

const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";

document.addEventListener("DOMContentLoaded", async function () {
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
