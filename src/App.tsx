import { useEffect, useState } from "react";
import { format, isSameMonth } from "date-fns";
import Calendar from "./components/Calendar";
import type { Event } from "./components/Calendar";

const generateEvents = (date = new Date()) => {
  const events: { [key: string]: Event[] } = {};
  const month = date.getMonth();
  const year = date.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const colors = ["red", "blue", "green", "purple", "orange"];

  let eventCount = 1;

  for (let i = 0; i < daysInMonth; i++) {
    const day = i + 1;
    const randomCount = Math.floor(Math.random() * 7);
    const key = format(new Date(year, month, day), "yyyy-MM-dd");
    events[key] = [];

    for (let j = 0; j < randomCount; j++) {
      const randomColor = Math.floor(Math.random() * 4);
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
  const [events, setEvents] = useState<EventsState>({});

  useEffect(() => {
    setEvents(generateEvents(date));
  }, []);

  const handleChangeDate = (d: Date) => {
    if (!isSameMonth(d, date)) {
      setEvents(generateEvents(d));
    }
    setDate(d);
  };

  const handleRenderDay = (d: Date) => {
    return <div>{format(d, "dd MMM")}</div>;
  };

  const handleRenderMonthTitle = (d: Date) => {
    return <div>{format(d, "MMMM yyyy")}</div>;
  };

  return (
    <div style={{ margin: "50px 50px", width: 1000 }}>
      <Calendar
        date={date}
        onChange={handleChangeDate}
        // onRenderDayTitle={handleRenderDay}
        // onRenderMonthTitle={handleRenderMonthTitle}
      />
    </div>
  );
}

export default App;
