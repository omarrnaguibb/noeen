import AppLink from "../AppLink";
import { useTranslation } from "../../context/LanguageContext";

function BreadcrumbArrow() {
  return (
    <li className="s-breadcrumb-arrow" aria-hidden>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path
          fill="currentColor"
          d="M20.563 22.104l-1.875 1.875-8-8 8-8 1.875 1.875-6.125 6.125z"
        />
      </svg>
    </li>
  );
}

export default function CartBreadcrumb() {
  const { t } = useTranslation();

  return (
    <nav className="breadcrumbs w-full py-5" aria-label="Breadcrumb">
      <ol className="s-breadcrumb-wrapper">
        
        <li className="s-breadcrumb-item">
          <AppLink href="/">{t("cartPage.breadcrumbHome")}</AppLink>
        </li>
        <BreadcrumbArrow />
        <li className="s-breadcrumb-item">{t("cartPage.breadcrumbCart")}</li>
      </ol>
    </nav>
  );
}
