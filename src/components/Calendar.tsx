import clsx from "clsx";
import {
  format as formatDate,
  addMonths,
  addYears,
  isSameYear,
} from "date-fns";
import DayTitle from "./DayTitle";
import DayEvents from "./DayEvents";
import Cell from "./Cell";
import css from "./calendar.module.css";
import CalendarMonth from "../classes/CalendarMonth";
import type { Event } from "./types";

interface Props {
  startWeekDay?: "monday" | "sunday";
  date: Date;
  showPrefixDates?: boolean;
  showPostfixDates?: boolean;
  weekCount?: number;
  events?: { [key: string]: Event[] };
  scrollableEvents?: boolean;
  onClickEvent?: (event: Event) => void;
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
  scrollableEvents = false,
  onChange,
  onClickEvent,
  onRenderDayTitle,
  onRenderMonthTitle,
}: Props) {
  const monthFormat = () => {
    return isSameYear(date, new Date()) ? "MMMM" : "MMMM yyyy";
  };

  const monthCal = new CalendarMonth(date, startWeekDay, weekCount);
  const daysInMonth = monthCal.daysInMonth;
  const prefixDates = monthCal.prefixDates;
  const postfixDates = monthCal.postfixDates;

  const handleGoToToday = () => {
    const newDate = new Date();
    changeDate(newDate);
  };

  const handleChangeMonth = (direction: "forward" | "backward") => () => {
    const newDate = addMonths(date, direction === "backward" ? -1 : 1);
    changeDate(newDate);
  };

  const handleChangeYear = (direction: "forward" | "backward") => () => {
    const newDate = addYears(date, direction === "backward" ? -1 : 1);
    changeDate(newDate);
  };

  const handleClickDay = (newDate: Date) => () => {
    changeDate(newDate);
  };

  const changeDate = (d: Date) => {
    if (onChange) {
      onChange(d);
    }
  };

  const weekdays =
    startWeekDay === "monday" ? WEEK_DAYS_START_MONDAY : WEEK_DAYS_START_SUNDAY;

  return (
    <div className={css.container}>
      <Cell className={css["month-name"]}>
        {onRenderMonthTitle
          ? onRenderMonthTitle(date)
          : formatDate(date, monthFormat())}
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
            className={clsx(
              showPrefixDates && css["day"],
              css["outside-month-day"]
            )}
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
            {showPrefixDates && (
              <div className={css["day-events"]}>
                {events && events[formatDate(prefixDates[i], "yyyy-MM-dd")] && (
                  <DayEvents
                    events={events[formatDate(prefixDates[i], "yyyy-MM-dd")]}
                    onClick={onClickEvent}
                    enableScroll={scrollableEvents}
                  />
                )}
              </div>
            )}
          </Cell>
        );
      })}

      {Array.from({ length: daysInMonth }).map((_, i) => {
        const d = new Date(date.getFullYear(), date.getMonth(), i + 1);
        return (
          <Cell
            key={`num-days-${i}`}
            className={clsx(
              css["day"],
              date.getDate() === i + 1 && css["selected-day"]
            )}
            onClick={handleClickDay(d)}
          >
            {onRenderDayTitle && onRenderDayTitle(d)}
            {!onRenderDayTitle && <div>{i + 1}</div>}
            <div className={css["day-events"]}>
              {events && events[formatDate(d, "yyyy-MM-dd")] && (
                <DayEvents
                  events={events[formatDate(d, "yyyy-MM-dd")]}
                  onClick={onClickEvent}
                  enableScroll={scrollableEvents}
                />
              )}
            </div>
          </Cell>
        );
      })}

      {Array.from({ length: postfixDates.length }).map((_, i) => {
        return (
          <Cell
            key={`postfix-${i}`}
            className={clsx(
              showPostfixDates && css["day"],
              css["outside-month-day"]
            )}
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

            {showPostfixDates && (
              <div className={css["day-events"]}>
                {events &&
                  events[formatDate(postfixDates[i], "yyyy-MM-dd")] && (
                    <DayEvents
                      events={events[formatDate(postfixDates[i], "yyyy-MM-dd")]}
                      onClick={onClickEvent}
                      enableScroll={scrollableEvents}
                    />
                  )}
              </div>
            )}
          </Cell>
        );
      })}
    </div>
  );
}

export default Calendar;
