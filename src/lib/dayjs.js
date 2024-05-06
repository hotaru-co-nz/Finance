import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(LocalizedFormat);

export default dayjs;

export function getCurrentMonth() {
    const currentDate = dayjs();
    return {
        year: currentDate.year(),
        month: currentDate.month() + 1,
    };
}

export function monthIncrease({year, month}) {
    const nextMonthDate = dayjs(`${year}-${month}-01`).add(1, "month");
    return {
        year: nextMonthDate.year(),
        month: nextMonthDate.month() + 1,
    };
}

export function monthDecrease({year, month}) {
    const prevMonthDate = dayjs(`${year}-${month}-01`).subtract(1, "month");
    return {
        year: prevMonthDate.year(),
        month: prevMonthDate.month() + 1,
    };
}

export function sameMonthDate(data, month, date) {
    const time = dayjs(data)
    return time.date() === date && time.month() + 1 === month

}

export function getCalendar({year, month}) {
    const firstDayOfMonth = dayjs(`${year}-${month}-01`);
    const lastDayOfMonth = firstDayOfMonth.endOf("month");
    const startOfWeek = firstDayOfMonth.startOf("week");
    const endOfWeek = lastDayOfMonth.endOf("week");
    const weeks = [];
    let currentDay = startOfWeek;
    while (currentDay.isBefore(endOfWeek)) {
        const weekDates = [];
        let dayOfWeek = currentDay;
        while (dayOfWeek.isBefore(currentDay.endOf("week"))) {
            weekDates.push({
                month: dayOfWeek.month() + 1,
                date: dayOfWeek.date(),
            });
            dayOfWeek = dayOfWeek.add(1, "day");
        }
        weeks.push(weekDates);
        currentDay = currentDay.add(1, "week");
    }
    return weeks;
}
