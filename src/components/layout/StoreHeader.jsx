import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaMagnifyingGlass, FaUser } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import {
  useHomepageContent,
  useTranslation,
} from "../../context/LanguageContext";
import RiyalIcon from "../RiyalIcon";
import HeaderCartSummary from "./HeaderCartSummary";
import LoginModal from "./LoginModal";
import MobileMenu from "./MobileMenu";
import { DesktopNavMenu } from "./NavMenu";
import { getUserProfile, saveUserProfile } from "../../utils/userProfile";

function LanguageSwitcher({
  localeLabel,
  language,
  setLanguage,
  t,
  langOpen,
  setLangOpen,
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setLangOpen((value) => !value)}
        className="header-btn btn--gray rounded flex items-center"
      >
        <span>{localeLabel}</span>
        <span className="mx-1.5">|</span>
        <RiyalIcon className="h-3.5 w-3.5" />
      </button>
      {langOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setLangOpen(false)}
          />
          <div className="absolute top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg ltr:right-0 rtl:left-0">
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
  );
}

export default function StoreHeader({ checkout = false }) {
  const { STORE, NAV_LINKS, HEADER_UI } = useHomepageContent();
  const { t, language, setLanguage } = useTranslation();
  const { totalItems, totalPrice } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(() => getUserProfile());

  const localeLabel = language === "ar" ? t("arabic") : t("english");
  const loginHeading = userProfile?.fullName ? 'مرحبا بك':  HEADER_UI.login.heading;
  const loginAction = userProfile?.fullName ?? HEADER_UI.login.action;

  const handleLoginSubmit = (profile) => {
    saveUserProfile(profile);
    setUserProfile(profile);
    setLoginOpen(false);
  };

  return (
    <>
      <header className="store-header sticky top-0 z-40 border-b border-gray-100 bg-white">
        <div className="header-components">
          <div className="container">
            <div className="header-components-inner center-between relative">
              <div className="right-side">
                <div className="hidden items-center justify-end gap-1.5 rtl:space-x-reverse lg:flex lg:justify-start">
                  <LanguageSwitcher
                    localeLabel={localeLabel}
                    language={language}
                    setLanguage={setLanguage}
                    t={t}
                    langOpen={langOpen}
                    setLangOpen={setLangOpen}
                  />
                  <button
                    type="button"
                    aria-label={HEADER_UI.searchLabel}
                    className="search-btn btn--gray flex h-10 w-10  items-center justify-center rounded"
                  >
                    <FaMagnifyingGlass className="text-sm" />
                  </button>
                </div>

                <div className="flex items-center justify-start lg:justify-center">
                  {!checkout && (
                    <button
                      type="button"
                      aria-label={t("menuTitle")}
                      className="mburger mburger--collapse cursor-pointer border-none bg-transparent lg:hidden ltr:mr-3 rtl:ml-3"
                      onClick={() => setMenuOpen(true)}
                    >
                      <FaBars className="text-2xl text-gray-800" />
                    </button>
                  )}

                  <Link
                    to="/"
                    className="navbar-brand inline-flex items-center"
                  >
                    <img
                      src={STORE.logo}
                      alt={STORE.name}
                      className="object-contain"
                    />
                    <h1 className="sr-only">{STORE.name}</h1>
                  </Link>
                </div>
              </div>

              <div className="left-side">
                <button
                  type="button"
                  aria-label={HEADER_UI.searchLabel}
                  className="search-btn  flex h-10 w-10 items-center justify-center rounded lg:hidden"
                >
                  <FaMagnifyingGlass className="text-xl" />
                </button>

                <button
                  type="button"
                  className="header-icon-button"
                  aria-label={loginAction}
                  onClick={() => setLoginOpen(true)}
                >
                  <FaUser className="icon text-lg text-gray-700" />
                  <div className="hidden flex-col text-start text-sm leading-none lg:flex">
                    <p className="mb-1 max-w-[9rem] truncate opacity-50">
                      {loginHeading}
                    </p>
                    <span className="max-w-[9rem] truncate text-sm leading-none">
                      {loginAction}
                    </span>
                  </div>
                </button>
                <HeaderCartSummary
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                />
              </div>
            </div>
          </div>
        </div>

        {!checkout && (
          <div id="mainnav" className="main-nav-container hidden lg:block">
            <div className="inner bg-inherit">
              <div className="container">
                <DesktopNavMenu navLinks={NAV_LINKS} />
              </div>
            </div>
          </div>
        )}
      </header>

      {!checkout && (
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          navLinks={NAV_LINKS}
        />
      )}

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSubmit={handleLoginSubmit}
        initialValues={userProfile}
        t={t}
      />
    </>
  );
}
