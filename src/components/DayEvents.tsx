import clsx from "clsx";
import type { Event } from "./types";
import css from "./dayevents.module.css";

interface Props {
  events: Event[];
  enableScroll?: boolean;
  onClick?: (event: Event) => void;
}

function DayEvents({ events, enableScroll, onClick }: Props) {
  const handleClick =
    (event: Event) => (clickEvent: React.MouseEvent<HTMLElement>) => {
      clickEvent.stopPropagation();
      onClick && onClick(event);
    };

  const _events = enableScroll ? events : events.slice(0, 4);

  return (
    <div className={clsx(css["day"], enableScroll && css["day-scroll"])}>
      {_events.map((e) => (
        <div
          key={e.id}
          className={css["day-event"]}
          style={{ backgroundColor: e.color, zIndex: 100 }}
          onClick={handleClick(e)}
        >
          {e.title}
        </div>
      ))}
      {!enableScroll && events.length > 4 && (
        <div className={css["day-event"]}>+{events.length - 4} more ...</div>
      )}
    </div>
  );
}

export default DayEvents;
