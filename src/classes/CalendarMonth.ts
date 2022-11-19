import { getDaysInMonth, startOfMonth, subMonths, addMonths } from "date-fns";

class CalendarMonth {
  date: Date;
  startWeek: "monday" | "sunday";
  equalWeekCount: boolean;

  constructor(
    date: Date,
    startWeek: "monday" | "sunday" = "sunday",
    equalWeekCount: boolean = false
  ) {
    this.date = startOfMonth(date);
    this.startWeek = startWeek;
    this.equalWeekCount = equalWeekCount;
  }

  get daysInMonth() {
    return getDaysInMonth(this.date);
  }

  get prefixDayCount() {
    if (this.startWeek === "sunday") {
      return this.date.getDay();
    }

    // Start week = monday
    return this.date.getDay() === 0 ? 6 : this.date.getDay() - 1;
  }

  get prefixDates() {
    const prevMonth = subMonths(this.date, 1);
    const prevMonthDays = getDaysInMonth(prevMonth);
    const dates = [];
    for (let i = 0; i < this.prefixDayCount; i++) {
      dates.push(
        new Date(
          prevMonth.getFullYear(),
          prevMonth.getMonth(),
          prevMonthDays - i
        )
      );
    }

    return dates.reverse();
  }

  get postfixDayCount() {
    if (this.equalWeekCount) {
      return 6 * 7 - (this.daysInMonth + this.prefixDayCount);
    }

    const isFullMonth = (this.daysInMonth + this.prefixDayCount) % 7 === 0;
    return isFullMonth ? 0 : 7 - ((this.daysInMonth + this.prefixDayCount) % 7);
  }

  get postfixDates() {
    const nextMonth = addMonths(this.date, 1);
    const dates = [];
    for (let i = 0; i < this.postfixDayCount; i++) {
      dates.push(
        new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i + 1)
      );
    }

    return dates;
  }
}

export default CalendarMonth;
