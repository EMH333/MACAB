import { yearStarting2017, yearStarting2018, yearStarting2019 } from "./dates";

//Origin is First of January 2018
export const EPOCH = new Date(2018, 0, 0);
export var dates = Object.assign({}, yearStarting2017, yearStarting2018, yearStarting2019);

export function addSummer() {
    //NOTE THIS DATES ARE CURRENTLY DESIGNED TO BE ACTIVE FOR THE SUMMER OF 2018, 2019 AND 2020
    for (var index = 168; index < 247; index++) {
        dates[index] = "N";
    }
    for (var sum2019 = 534; sum2019 < 611; sum2019++) {
        dates[sum2019] = "N";
    }
    for (var sum2020 = 894; sum2020<982;sum2020++){
        dates[sum2020] = "N";
    }
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