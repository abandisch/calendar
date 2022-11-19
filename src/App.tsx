import Calendar from "./components/Calendar";

function App() {
  return (
    <div style={{ margin: "50px 50px", width: 1000 }}>
      <Calendar
        startWeekDay="monday"
        showPrefixDates={false}
        showPostfixDates={false}
      />
    </div>
  );
}

export default App;
