import { yearStarting2024 } from "./dates";

//Origin is First of January 2018
export const EPOCH = new Date(2018, 0, 0);
const ONE_DAY_IN_SECONDS = 86400000;

let dates = Object.assign({}, yearStarting2024);
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

    // if date is not defined, then must be day off
    if (dates[date] === undefined) {
        return "N";
    }

    return dates[date];
}

export function daysSinceEpoch(n) {
    let now;
    if (n == null) {
        now = new Date();
    } else {
        now = new Date(n);
    }

    const start = EPOCH; //This is uses our "epoch"
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const day = Math.floor(diff / ONE_DAY_IN_SECONDS);
    return day;
}

//Adds days to epoch, which makes it very easy to get dates
export function addDays(days) {
    let result = new Date(EPOCH);
    result.setDate(result.getDate() + days);
    return result;
}
