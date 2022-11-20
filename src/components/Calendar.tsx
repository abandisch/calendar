import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  format as formatDate,
  addMonths,
  addYears,
  isSameDay,
  isSameYear,
} from "date-fns";
import DayTitle from "./DayTitle";
import Cell from "./Cell";
import css from "./calendar.module.css";
import CalendarMonth from "../classes/CalendarMonth";

export type Event = {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
};

interface Props {
  startWeekDay?: "monday" | "sunday";
  date?: Date;
  showPrefixDates?: boolean;
  showPostfixDates?: boolean;
  weekCount?: number;
  events?: { [key: string]: Event[] };
  onChange?: (date: Date) => void;
  onRenderDayTitle?: (date: Date) => React.ReactElement;
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
  events,
  onChange,
  onRenderDayTitle,
  onRenderMonthTitle,
}: Props) {
  const [currentDate, setCurrentDate] = useState(date || new Date());

  useEffect(() => {
    if (date && !isSameDay(date, currentDate)) {
      setCurrentDate(date);
    }
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const monthFormat = () => {
    return isSameYear(currentDate, new Date()) ? "MMMM" : "MMMM yyyy";
  };

  const monthCal = new CalendarMonth(currentDate, startWeekDay, weekCount);
  const daysInMonth = monthCal.daysInMonth;
  const prefixDates = monthCal.prefixDates;
  const postfixDates = monthCal.postfixDates;

  const handleGoToToday = () => {
    const newDate = new Date();
    changeDate(newDate);
  };

  const handleChangeMonth = (direction: "forward" | "backward") => () => {
    const newDate = addMonths(currentDate, direction === "backward" ? -1 : 1);
    changeDate(newDate);
  };

  const handleChangeYear = (direction: "forward" | "backward") => () => {
    const newDate = addYears(currentDate, direction === "backward" ? -1 : 1);
    changeDate(newDate);
  };

  const handleClickDay = (newDate: Date) => () => {
    changeDate(newDate);
  };

  const changeDate = (d: Date) => {
    if (onChange) {
      onChange(d);
    } else {
      setCurrentDate(d);
    }
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
      <Cell className={css["cal-nav"]}>
        <button onClick={handleChangeYear("backward")}>{"<<"}</button>
        <button onClick={handleChangeMonth("backward")}>{"<"}</button>
        <button onClick={handleChangeMonth("forward")}>{">"}</button>
        <button onClick={handleChangeYear("forward")}>{">>"}</button>
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
            onClick={
              showPrefixDates ? handleClickDay(prefixDates[i]) : undefined
            }
          >
            {showPrefixDates &&
              onRenderDayTitle &&
              onRenderDayTitle(prefixDates[i])}
            {showPrefixDates && !onRenderDayTitle && (
              <DayTitle date={prefixDates[i]} />
            )}
            {!showPrefixDates && <>&nbsp;</>}
          </Cell>
        );
      })}

      {Array.from({ length: daysInMonth }).map((_, i) => {
        const d = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          i + 1
        );
        return (
          <Cell
            key={`num-days-${i}`}
            className={clsx(
              css["day"],
              currentDate.getDate() === i + 1 && css["selected-day"]
            )}
            onClick={handleClickDay(d)}
          >
            {onRenderDayTitle && onRenderDayTitle(d)}
            {!onRenderDayTitle && <div>{i + 1}</div>}
            <div className={css["day-events"]}>
              {events &&
                events[formatDate(d, "yyyy-MM-dd")] &&
                events[formatDate(d, "yyyy-MM-dd")].slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className={css["day-event"]}
                    style={{ backgroundColor: e.color }}
                  >
                    {e.title}
                  </div>
                ))}
              {events && events[formatDate(d, "yyyy-MM-dd")]?.length > 3 && (
                <div className={css["day-event"]}>
                  +{events[formatDate(d, "yyyy-MM-dd")].length - 3} more ...
                </div>
              )}
            </div>
          </Cell>
        );
      })}

      {Array.from({ length: postfixDates.length }).map((_, i) => {
        return (
          <Cell
            key={`postfix-${i}`}
            className={clsx(showPostfixDates && css["day"])}
            onClick={
              showPostfixDates ? handleClickDay(postfixDates[i]) : undefined
            }
          >
            {showPostfixDates &&
              onRenderDayTitle &&
              onRenderDayTitle(postfixDates[i])}
            {showPostfixDates &&
              !onRenderDayTitle &&
              formatDate(postfixDates[i], "d")}
            {!showPostfixDates && <>&nbsp;</>}
          </Cell>
        );
      })}
    </div>
  );
}

export default Calendar;
