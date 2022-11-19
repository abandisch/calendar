import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  format as formatDate,
  differenceInCalendarYears as diffYears,
  startOfMonth,
  addMonths,
  addYears,
  isSameDay,
} from "date-fns";
import Cell from "./Cell";
import css from "./calendar.module.css";
import CalendarMonth from "../classes/CalendarMonth";

interface Props {
  startWeekDay?: "monday" | "sunday";
  date?: Date;
  showPrefixDates?: boolean;
  showPostfixDates?: boolean;
  weekCount?: number;
  onChange?: (date: Date) => void;
  onRenderDay?: (date: Date) => React.ReactElement;
  onRenderMonthTitle?: (date: Date) => React.ReactElement;
}

const WEEK_DAYS_START_SUNDAY = ["S", "M", "T", "W", "T", "F", "S"];
const WEEK_DAYS_START_MONDAY = ["M", "T", "W", "T", "F", "S", "S"];

function Calendar({
  date,
  startWeekDay = "monday",
  showPrefixDates = true,
  showPostfixDates = true,
  weekCount = 6,
  onChange,
  onRenderDay,
  onRenderMonthTitle,
}: Props) {
  const [currentDate, setCurrentDate] = useState(date || new Date());

  useEffect(() => {
    if (date) {
      setCurrentDate(date);
    }
  }, [date]);

  const monthFormat = () => {
    const isCurrentYear = diffYears(currentDate, new Date()) === 0;
    return isCurrentYear ? "MMMM" : "MMMM yyyy";
  };

  const monthCal = new CalendarMonth(currentDate, startWeekDay, weekCount);
  const daysInMonth = monthCal.daysInMonth;
  const prefixDates = monthCal.prefixDates;
  const postfixDates = monthCal.postfixDates;

  const handleGoToToday = () => {
    const newDate = new Date();
    setCurrentDate(newDate);
    onChange && onChange(newDate);
  };

  const handleChangeMonth = (direction: "forward" | "backward") => () => {
    const newDate = addMonths(currentDate, direction === "backward" ? -1 : 1);
    setCurrentDate(newDate);
    onChange && onChange(newDate);
  };

  const handleChangeYear = (direction: "forward" | "backward") => () => {
    const newDate = addYears(currentDate, direction === "backward" ? -1 : 1);
    setCurrentDate(newDate);
    onChange && onChange(newDate);
  };

  const weekdays =
    startWeekDay === "monday" ? WEEK_DAYS_START_MONDAY : WEEK_DAYS_START_SUNDAY;

  return (
    <div className={css.container}>
      <Cell className={css["month-name"]}>
        {onRenderMonthTitle
          ? onRenderMonthTitle(currentDate)
          : formatDate(currentDate, monthFormat())}
      </Cell>
      <Cell className={css["month-nav"]}>
        <button onClick={handleChangeYear("backward")}>{"<<"}</button>
        <button onClick={handleChangeMonth("backward")}>{"<"}</button>
        <button onClick={handleChangeMonth("forward")}>{">"}</button>
        <button onClick={handleChangeYear("forward")}>{">>"}</button>
      </Cell>
      <Cell className={css["today-nav"]}>
        <button onClick={handleGoToToday}>Today</button>
      </Cell>

      {Array.from({ length: 7 }).map((_, i) => (
        <Cell key={`day-name-${i}`} className={css["day-name"]}>
          {weekdays[i]}
        </Cell>
      ))}

      {Array.from({ length: prefixDates.length }).map((_, i) => {
        return (
          <Cell
            key={`prefix-${i}`}
            className={clsx(showPrefixDates && css["day"])}
          >
            {showPrefixDates ? (
              onRenderDay ? (
                onRenderDay(prefixDates[i])
              ) : (
                prefixDates[i].getDate()
              )
            ) : (
              <>&nbsp;</>
            )}
          </Cell>
        );
      })}

      {Array.from({ length: daysInMonth }).map((_, i) => (
        <Cell
          key={`num-days-${i}`}
          className={clsx(
            css["day"],
            currentDate.getDate() === i + 1 && css["selected-day"]
          )}
        >
          {onRenderDay
            ? onRenderDay(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  i + 1
                )
              )
            : i + 1}
        </Cell>
      ))}

      {Array.from({ length: postfixDates.length }).map((_, i) => {
        return (
          <Cell
            key={`postfix-${i}`}
            className={clsx(showPostfixDates && css["day"])}
          >
            {showPostfixDates ? (
              onRenderDay ? (
                onRenderDay(postfixDates[i])
              ) : (
                postfixDates[i].getDate()
              )
            ) : (
              <>&nbsp;</>
            )}
          </Cell>
        );
      })}
    </div>
  );
}

export default Calendar;
