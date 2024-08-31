import u from "umbrellajs/umbrella.esm.js";
import { daysSinceEpoch, getDate } from "./dateUtils";
import { updateDay } from "./main";

async function generateCalendar(d) {
    const days = howManyDays(d);
    const shift = getDayFirstDate(d);
    let date = new Date(d);
    clear();
    for (let i = 0; i < days; i++) {
        let posi_row = Math.floor((i + shift) / 7);
        let posi_col = Math.floor((i + shift) % 7);
        let currentDate = i + 1;
        let daysSince = daysSinceEpoch(date.setDate(currentDate));
        u('#calendar_display .r' + posi_row).children('.col' + posi_col).html(await generateHTML(currentDate, daysSince));
    }
}

async function generateHTML(currentDate, daysSince) {
    let classes = "cal-date button"; //cal-notactive"
    if (daysSince == daysSinceEpoch()) {
        classes += " cal-today";
    } else {
        classes += " cal-notactive";
        if (await getDate(daysSince) == "N") {//TODO: change to anything but pre-aproved "A" and "B" days
            classes += " cal-noschool";
        }
    }
    return `<span data-date=${daysSince} class="${classes}">\n${currentDate}\n</span>\n`;
}

function clear() {
    u('#calendar_display tbody td').each(() => {
        u(this).html('');
    });
}

function getDayFirstDate(d) {
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    return firstDay.getDay();
}

function howManyDays(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

/**
 *
 * @param {Date} d the date
 * @param {*} sign 1 if going forword, 0 if going backwards
 */
export function updateDate(d, sign) {
    const m = d.getMonth();
    d.setDate(1);//workaround to not use not skip certian months, as we just use the 'd' date as a month and year tracker
    if (sign) {
        if (m + 1 > 11) {
            d.setFullYear(d.getFullYear() + 1);
            d.setMonth(0);
        } else {
            d.setMonth(m + 1);
        }
    } else {
        if (m - 1 < 0) {
            d.setFullYear(d.getFullYear() - 1);
            d.setMonth(11);
        } else {
            d.setMonth(m - 1);
        }
    }
}

function updateListeners() {
    u(".cal-date").off('click'); //deregister previous
    u(".cal-date").on('click', (data) => {
        let target = u(data.target);
        let date = target.data("date");
        //console.log(date);
        updateDay(date, true);
        u(".cal-date").each((node) => {
            u(node).addClass("cal-notactive");
            u(node).removeClass("cal-active");
        });
        target.addClass("cal-active");
        target.removeClass("cal-notactive");
    });

    u("#toggleCal").on('click', toggleCal);
}

let displayCalendar = true;
function toggleCal() {
    let x = document.getElementById("calendar_container");
    if (displayCalendar) {
        x.classList.add("fade-in");
        x.classList.remove("fade-out");
        x.classList.remove("invisible");
    } else {
        x.classList.remove("fade-in");
        x.classList.add("fade-out");
    }
    displayCalendar = !displayCalendar;
}

export async function registerCalendarEventsAndRender() {
    var d = new Date();
    const updateCalendar = async () => {
        u('#data_chooser').html(`${d.getFullYear()}-${d.getMonth() + 1}`);
        await generateCalendar(d);
        updateListeners();
    }

    u('.left').on('click', async () => {
        updateDate(d, 0);
        await updateCalendar();
        return false;
    });
    u('.right').on('click', async () => {
        updateDate(d, 1);
        await updateCalendar();
        return false;
    });

    await updateCalendar();
}
