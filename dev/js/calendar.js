import { daysSinceEpoch, dates } from "./dateUtils";
import { updateDay } from "./main";

function generateCalendar(d) {
    var days = howManyDays(d);
    var shift = getDayFirstDate(d);
    var date = new Date(d);
    clear();
    for (var i = 0; i < days; i++) {
        var posi_row = Math.floor((i + shift) / 7);
        var posi_col = Math.floor((i + shift) % 7);
        var currentDate = i + 1;
        var daysSince = daysSinceEpoch(date.setDate(currentDate));
        u('#calendar_display .r' + posi_row).children('.col' + posi_col).html(generateHTML(currentDate, daysSince));
    }
}

function generateHTML(currentDate, daysSince) {
    var classes = "cal-date button"; //cal-notactive"
    if (daysSince == daysSinceEpoch()) {
        classes = classes + " cal-today";
    } else {
        classes = classes + " cal-notactive";
        if (dates[daysSince] == "N") {//TODO: change to anything but pre-aproved "A" and "B" days
            classes = classes + " cal-noschool";
        }
    }
    return `<span data-date=` + daysSince + ` class="` + classes + `">
` + currentDate + `
</span>
`;
}

function clear() {
    u('#calendar_display tbody td').each(function () {
        u(this).html('');
    });
}

function getDayFirstDate(d) {
    var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
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
    var m = d.getMonth();
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

    u("#toggleCal").on('click', toggleCal);
}

var displayCalendar = true;
function toggleCal() {
    var x = document.getElementById("calendar_container");
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

export function registerCalendarEventsAndRender() {
    var d = new Date();
    u('#data_chooser').html(d.getFullYear() + '-' + (d.getMonth() + 1));
    generateCalendar(d);
    updateListeners();
    u('.left').on('click', function () {
        updateDate(d, 0);
        u('#data_chooser').html(d.getFullYear() + '-' + (d.getMonth() + 1));
        generateCalendar(d);
        updateListeners();
        return false;
    });
    u('.right').on('click', function () {
        updateDate(d, 1);
        u('#data_chooser').html(d.getFullYear() + '-' + (d.getMonth() + 1));
        generateCalendar(d);
        updateListeners();
        return false;
    });
}