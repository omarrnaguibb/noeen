import { Link } from "react-router-dom";
import { useTranslation } from "../../context/LanguageContext";

function BreadcrumbArrow({ dir }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 32 32"
      className={`text-gray-400 ${dir === "ltr" ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M20.563 22.104l-1.875 1.875-8-8 8-8 1.875 1.875-6.125 6.125z"
      />
    </svg>
  );
}

export default function CatalogBreadcrumb({ current }) {
  const { t, dir } = useTranslation();

  return (
    <nav className="w-full py-5" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <li>
          <Link to="/" className="hover:text-primary">
            {t("cartPage.breadcrumbHome")}
          </Link>
        </li>
        <li className="flex items-center" aria-hidden>
          <BreadcrumbArrow dir={dir} />
        </li>
        <li className="font-medium text-gray-900">{current}</li>
      </ol>
    </nav>
  );
}
