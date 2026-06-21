import { Link, useLocation } from "react-router-dom";
import { FaBagShopping, FaUser } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { NOEEN_LOGO } from "../constants/services";

export default function Header() {
  const { totalItems } = useCart();
  const location = useLocation();
  const isCheckout = location.pathname === "/checkout";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={NOEEN_LOGO}
              alt="منصة نعين للخدمات الالكترونية"
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
          <Link
            to="/"
            className={location.pathname === "/" ? "font-bold text-primary" : "hover:text-primary"}
          >
            الرئيسية
          </Link>
          <Link
            to="/checkout"
            className={isCheckout ? "font-bold text-primary" : "hover:text-primary"}
          >
            السلة
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 lg:flex"
          >
            <FaUser />
            <span>تسجيل الدخول</span>
          </button>

          <Link
            to="/checkout"
            className="relative flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 transition hover:bg-primary/10 hover:text-primary"
          >
            <FaBagShopping className="text-lg" />
            <span className="hidden sm:inline">السلة</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
