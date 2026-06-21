import { Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";
import PriceAmount from "../PriceAmount";
import { useTranslation } from "../../context/LanguageContext";

export default function HeaderCartSummary({
  totalItems,
  totalPrice,
  variant = "header",
  onNavigate,
}) {
  const isMenu = variant === "menu";
  const { t } = useTranslation();
  return (
    <Link
      to="/cart"
      className={`header-icon-button s-cart-summary-wrapper ${isMenu ? "s-cart-summary-wrapper--menu" : ""}`}
      onClick={onNavigate}
    >
      <div id={isMenu ? undefined : "s-cart-icon"} className="relative">
        <FaBagShopping className="icon leading-none text-gray-700" />
        {totalItems > 0 ? (
          <span className="s-cart-summary-count -top-3! -right-3!">{totalItems}</span>
        ) : null}
      </div>
      {totalItems > 0 ? (
        <p className="s-cart-summary-content">
          <span className="text-gray-500 hidden lg:flex">
            {t("cartPage.cart")}
          </span>
          <PriceAmount
            amount={totalPrice}
            className="s-cart-summary-total hidden! items-center gap-x-0.5 lg:flex!"
          />
        </p>
      ) : null}
    </Link>
  );
}
