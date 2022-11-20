import { useState } from "react";
import { format } from "date-fns";
import Calendar from "./components/Calendar";

function App() {
  const [date, setDate] = useState(new Date());

  const handleChangeDate = (d: Date) => {
    setDate(d);
  };

  const handleRenderDay = (d: Date) => {
    return <div onClick={() => setDate(d)}>{format(d, "dd MMM")}</div>;
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
