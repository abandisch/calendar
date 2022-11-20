import { format } from "date-fns";

interface Props {
  date: Date;
}

function DayTitle({ date }: Props) {
  return <>{format(date, "dd")}</>;
}

export default DayTitle;
