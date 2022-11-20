import { useState } from "react";
import { format, isSameMonth } from "date-fns";
import Calendar from "./components/Calendar";
import type { Event } from "./components/types";
import CalendarMonth from "./classes/CalendarMonth";

const generateEvents = (date = new Date()) => {
  const monthCal = new CalendarMonth(date, "monday", 6);
  const prefixDates = monthCal.prefixDates;
  const postfixDates = monthCal.postfixDates;

  const events: { [key: string]: Event[] } = {};

  const colors = ["lightcoral", "lightblue", "lightgreen", "plum", "orange"];

  let eventCount = 1;

  [...prefixDates, ...postfixDates].reduce((acc, _date) => {
    const day = _date.getDate();
    const month = _date.getMonth();
    const year = _date.getFullYear();
    const key = format(_date, "yyyy-MM-dd");
    const j = Math.floor(Math.random() * 7);
    const add = Math.floor(Math.random() * 10);

    if (add % 2 === 0) {
      const event: Event = {
        id: eventCount++,
        title: `Event ${eventCount}`,
        start: new Date(year, month, day, 6 + j, 0, 0),
        end: new Date(year, month, day, 6 + j, 0, 0),
        allDay: true,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      acc[key] = [event];
    }

    return acc;
  }, events);

  const month = date.getMonth();
  const year = date.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < daysInMonth; i++) {
    const day = i + 1;
    const randomCount = Math.floor(Math.random() * 7);
    const key = format(new Date(year, month, day), "yyyy-MM-dd");
    events[key] = [];

    for (let j = 0; j < randomCount; j++) {
      const randomColor = Math.floor(Math.random() * 5);
      events[key].push({
        id: `${i}-${j}`,
        title: `Event ${eventCount}`,
        start: new Date(year, month, day, 6 + j, 0, 0),
        end: new Date(year, month, day, 7 + j, 0, 0),
        color: colors[randomColor],
      });
      eventCount++;
    }
  }

  return events;
};

interface EventsState {
  [key: string]: Event[];
}

function App() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<EventsState>(generateEvents(date));

  const handleChangeDate = (d: Date) => {
    if (!isSameMonth(d, date)) {
      setEvents(generateEvents(d));
    }
    setDate(d);
  };

  const handleClickEvent = (event: Event) => {
    console.log("event clicked", event);
  };

  // const handleRenderDay = (d: Date) => {
  //   return <div>{format(d, "dd MMM")}</div>;
  // };

  // const handleRenderMonthTitle = (d: Date) => {
  //   return <div>{format(d, "MMMM yyyy")}</div>;
  // };

  return (
    <div style={{ margin: "50px 50px", width: 1000 }}>
      <Calendar
        date={date}
        events={events}
        onChange={handleChangeDate}
        onClickEvent={handleClickEvent}
        // onRenderDayTitle={handleRenderDay}
        // onRenderMonthTitle={handleRenderMonthTitle}
      />
    </div>
  );
}

export default App;
