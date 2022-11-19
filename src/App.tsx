import { useState } from "react";
import { format } from "date-fns";
import Calendar from "./components/Calendar";

function App() {
  const [date, setDate] = useState(new Date());

  const handleChangeDate = (d: Date) => {
    setDate(d);
  };

  const handleRenderCell = (d: Date) => {
    return <div>{format(d, "dd MMM")}</div>;
  };

  return (
    <div style={{ margin: "50px 50px", width: 1000 }}>
      <Calendar
        date={date}
        onChange={handleChangeDate}
        onRenderCell={handleRenderCell}
      />
    </div>
  );
}

export default App;
