import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import {
  useHomepageContent,
  useTranslation,
} from "../../context/LanguageContext";
import RiyalIcon from "../RiyalIcon";
import HeaderCartSummary from "./HeaderCartSummary";
import { MobileNavMenu } from "./NavMenu";

export default function MobileMenu({ open, onClose, navLinks }) {
  const { t, language, setLanguage } = useTranslation();
  const { HEADER_UI } = useHomepageContent();
  const { totalItems, totalPrice } = useCart();
  const [langOpen, setLangOpen] = useState(false);

  const localeLabel = language === "ar" ? t("arabic") : t("english");

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="mobile-nav-backdrop fixed inset-0 z-40 bg-black/40 transition lg:hidden visible opacity-100"
        onClick={onClose}
        aria-hidden={false}
      />

      <div
        id="mobile-mainnav"
        className="main-nav-container main-nav-container--mobile fixed inset-y-0 z-50 flex w-[min(100%,20rem)] translate-x-0 flex-col bg-white shadow-2xl transition duration-300 lg:hidden ltr:left-0 rtl:right-0"
        aria-hidden={false}
      >
        <div className="menu-fixed-bar ">
          <div className="relative w-full text-center">
            <button
              type="button"
              onClick={() => setLangOpen((value) => !value)}
              className="mobile-btn btn--gray rounded flex items-center w-full justify-center"
            >
              <span>{localeLabel}</span>
              <span className="mx-1.5">|</span>
              <RiyalIcon className="h-3.5 w-3.5" />
            </button>
            {langOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLangOpen(false)}
                />
                <div className="absolute top-full z-20 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg ltr:left-0 rtl:right-0">
                  <button
                    type="button"
                    className={`block w-full px-4 py-2.5 text-start text-sm hover:bg-gray-50 ${language === "ar" ? "font-bold text-primary" : ""}`}
                    onClick={() => {
                      setLanguage("ar");
                      setLangOpen(false);
                    }}
                  >
                    {t("arabic")}
                  </button>
                  <button
                    type="button"
                    className={`block w-full px-4 py-2.5 text-start text-sm hover:bg-gray-50 ${language === "en" ? "font-bold text-primary" : ""}`}
                    onClick={() => {
                      setLanguage("en");
                      setLangOpen(false);
                    }}
                  >
                    {t("english")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="inner relative flex min-h-0 flex-1 flex-col bg-inherit">
          <button
            type="button"
            className="close-menu lg:hidden"
            aria-label={t("close")}
            onClick={onClose}
          >
            <FaXmark />
          </button>
          <div className="container flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6">
            <h2 className="menu-title">{t("menuTitle")}</h2>

            <MobileNavMenu
              navLinks={navLinks}
              onNavigate={onClose}
              viewAllLabel={HEADER_UI.viewAll ?? t("viewAll")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
