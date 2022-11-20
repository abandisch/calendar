import clsx from "clsx";
import css from "./cell.module.css";

interface Props extends React.PropsWithChildren {
  className?: string;
  onClick?: () => void;
}

function Cell({ children, className, onClick }: Props) {
  return (
    <div onClick={onClick} className={clsx(css.cell, className)}>
      {children}
    </div>
  );
}

export default Cell;
