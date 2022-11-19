import clsx from "clsx";
import css from "./cell.module.css";

interface Props extends React.PropsWithChildren {
  className?: string;
}

function Cell({ children, className }: Props) {
  return <div className={clsx(css.cell, className)}>{children}</div>;
}

export default Cell;
