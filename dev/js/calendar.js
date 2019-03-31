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
    var m = d.getMonth() + 1;
    if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) return 31;
    if (m == 2) {
        if (isLeapYear(d.getFullYear())) {
            return 29;
        } else {
            return 28;
        }
    }
    return 30;
}

function isLeapYear(year) {
    if (year % 400 == 0) {
        return true;
    } else if (year % 100 == 0) {
        return false;
    } else if (year % 4 == 0) {
        return true;
    } else {
        return false;
    }
}
/**
 *
 * @param {Date} d the date
 * @param {*} sign 1 if going forword, 0 if going backwards
 */
function updateDate(d, sign) {
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

var displayCalendar = true;

function toggleCal() {
    var x = document.getElementById("calendar_container");
    x.classList.toggle("fadeIn");
    x.classList.toggle("fadeOut");
    if (displayCalendar) {
        x.classList.add("fadeIn");
        x.classList.remove("fadeOut");
    } else {
        x.classList.remove("fadeIn");
        x.classList.add("fadeOut");
    }
    displayCalendar = !displayCalendar;
}

function registerCalendarEventsAndRender() {
    var d = new Date();
    u('#data_chooser').html(d.getFullYear() + '-' + (d.getMonth() + 1));
    generateCalendar(d);
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