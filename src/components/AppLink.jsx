import { Link } from "react-router-dom";
import { isExternalLink, toAppPath } from "../utils/appRoutes";
import { scrollToTop } from "../utils/scroll";

export default function AppLink({ href, to, children, className, onClick, target, rel, ...props }) {
  const destination = to ?? href;

  const handleClick = (event) => {
    scrollToTop();
    onClick?.(event);
  };

  if (!destination) {
    return (
      <span className={className} {...props}>
        {children}
      </span>
    );
  }

  if (isExternalLink(destination)) {
    return (
      <a
        href={destination}
        className={className}
        onClick={onClick}
        target={target ?? "_blank"}
        rel={rel ?? "noreferrer"}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={toAppPath(destination)} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
