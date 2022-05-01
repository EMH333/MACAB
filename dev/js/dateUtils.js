import { yearStarting2021 } from "./dates";

//Origin is First of January 2018
export const EPOCH = new Date(2018, 0, 0);
var dates = Object.assign({}, yearStarting2021);
let fetchedDates = false;

export async function getDate(date) {
    if (!fetchedDates && dates[date] === undefined) {
        let response = await fetch("dates.json");
        if (response.ok) {
            await response.json().then(data => {
                dates = Object.assign(dates, data);
            });
        }
        fetchedDates = true;
    }

    // ignore all dates before start of 2021 school year and all after end of 2021 school year
    if (dates[date] === undefined && (date < 1346 || date > 1628)) {
        return "N";
    }

    return dates[date];
}

export function daysSinceEpoch(n) {
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

//Adds days to epoch, which makes it very easy to get dates
export function addDays(days) {
    var result = new Date(EPOCH);
    result.setDate(result.getDate() + days);
    return result;
}
