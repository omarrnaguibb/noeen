import { useState } from "react";
import { useTranslation } from "../../context/LanguageContext";

export default function LoadMoreButton({ onLoadMore, visible }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  if (!visible) return null;

  const handleClick = async () => {
    setLoading(true);
    setError(false);
    try {
      await onLoadMore?.();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="s-infinite-scroll-status">
        <p className="s-infinite-scroll-last infinite-scroll-last s-hidden"> </p>
        <p className={`s-infinite-scroll-error infinite-scroll-error ${error ? "" : "s-hidden"}`}>
          {t("catalogPage.loadMoreError")}
        </p>
      </div>
      <div className="s-infinite-scroll-wrapper">
        <button
          type="button"
          className="s-infinite-scroll-btn s-button-btn s-button-primary"
          onClick={handleClick}
          disabled={loading}
        >
          <span className={`s-button-text s-infinite-scroll-btn-text ${loading ? "s-hidden" : ""}`}>
            {t("catalogPage.loadMore")}
          </span>
          <span
            className={`s-button-loader s-button-loader-center s-infinite-scroll-btn-loader ${loading ? "" : "s-hidden"}`}
          />
        </button>
      </div>
    </>
  );
}
