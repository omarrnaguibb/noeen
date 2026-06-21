import { FaStar, FaRegStar } from "react-icons/fa6";

export default function StarRating({ value = 5, size = "sm" }) {
  const stars = [];
  const full = Math.floor(value);
  const sizeClass = size === "sm" ? "text-xs" : "text-sm";

  for (let i = 1; i <= 5; i += 1) {
    if (i <= full) {
      stars.push(<FaStar key={i} className={`${sizeClass} text-amber-400`} />);
    } else {
      stars.push(<FaRegStar key={i} className={`${sizeClass} text-gray-300`} />);
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className={`${sizeClass} ms-1 text-gray-500`}>{value}</span>
    </div>
  );
}
