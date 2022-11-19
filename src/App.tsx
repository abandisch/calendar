import Calendar from "./components/Calendar";

function App() {
  return (
    <div style={{ margin: "50px 50px", width: 1000 }}>
      <Calendar
        startWeekDay="monday"
        showPrefixDates={true}
        showPostfixDates={true}
      />
    </div>
  );
}

export default App;
