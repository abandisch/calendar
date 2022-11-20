import type { Event } from "./types";
import css from "./dayevents.module.css";

interface Props {
  events: Event[];
  onClick?: (event: Event) => void;
}

function DayEvents({ events, onClick }: Props) {
  const handleClick =
    (event: Event) => (clickEvent: React.MouseEvent<HTMLElement>) => {
      clickEvent.stopPropagation();
      onClick && onClick(event);
    };

  return (
    <div style={{ zIndex: 100 }}>
      {events.slice(0, 3).map((e) => (
        <div
          key={e.id}
          className={css["day-event"]}
          style={{ backgroundColor: e.color, zIndex: 100 }}
          onClick={handleClick(e)}
        >
          {e.title}
        </div>
      ))}
      {events.length > 3 && (
        <div className={css["day-event"]}>+{events.length - 3} more ...</div>
      )}
    </div>
  );
}

export default DayEvents;
