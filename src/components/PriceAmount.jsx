import RiyalIcon from "./RiyalIcon";

export default function PriceAmount({
  amount,
  className = "inline-flex items-center gap-1",
  iconClassName,
}) {
  return (
    <span className={className}>
      <span>{amount}</span>
      <RiyalIcon className={iconClassName ?? "h-3.5 w-3.5 shrink-0"} />
    </span>
  );
}
