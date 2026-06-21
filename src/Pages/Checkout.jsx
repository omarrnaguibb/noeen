import { useEffect, useState } from "react";
import { scrollToTop } from "../utils/scroll";
import { useNavigate } from "react-router-dom";
import AppLink from "../components/AppLink";
import StoreLayout from "../components/layout/StoreLayout";
import CartBreadcrumb from "../components/cart/CartBreadcrumb";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import CheckoutAuthPage from "../components/checkout/CheckoutAuthPage";
import CheckoutPaymentPage from "../components/checkout/CheckoutPaymentPage";
import { useCart } from "../context/CartContext";
import { useTranslation } from "../context/LanguageContext";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState("cart");
  const [orderSnapshot, setOrderSnapshot] = useState(null);
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    scrollToTop();
  }, [step]);

  const handleSubmit = () => {
    if (items.length === 0) return;

    const snapshot = {
      items: items.map((item) => ({ ...item })),
      total: totalPrice,
    };

    sessionStorage.setItem("orderSnapshot", JSON.stringify(snapshot));
    setOrderSnapshot(snapshot);
    setStep("auth");
  };

  const handleAuthComplete = async (data) => {
    sessionStorage.setItem("checkoutPhone", data.phone);
    sessionStorage.setItem("checkoutCountryCode", data.countryCode);
    sessionStorage.setItem("checkoutDialCode", data.dialCode);
    sessionStorage.setItem("checkoutOtp", data.otp);
    setAuthData(data);
    setStep("payment");
  };

  const handlePaymentComplete = () => {
    const id = sessionStorage.getItem("id");
    clearCart();
    navigate(`/phone?id=${id}`);
  };

  if (step === "auth" && orderSnapshot) {
    return (
      <StoreLayout checkout>
        <CheckoutAuthPage
          order={orderSnapshot}
          onComplete={handleAuthComplete}
        />
      </StoreLayout>
    );
  }

  if (step === "payment" && orderSnapshot && authData) {
    return (
      <StoreLayout checkout>
        <CheckoutPaymentPage
          order={orderSnapshot}
          authData={authData}
          onComplete={handlePaymentComplete}
        />
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="checkout-page pb-12">
        <div className="container page-container px-3 sm:px-5">
          <CartBreadcrumb />

          <h1 className="sr-only">{t("cart.label")}</h1>

          {items.length === 0 ? (
            <div className="rounded-md border border-gray-100 bg-white p-10 text-center">
              <span className="flex items-center justify-center mb-5 text-gray-500">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  aria-hidden
                >
                  <title>shopping-bag</title>
                  <path d="M28 10.667h-4v-2.667c0-4.412-3.588-8-8-8s-8 3.588-8 8v2.667h-4c-0.736 0-1.333 0.596-1.333 1.333v13.333c0 3.676 2.991 6.667 6.667 6.667h13.333c3.676 0 6.667-2.991 6.667-6.667v-13.333c0-0.737-0.597-1.333-1.333-1.333zM10.667 8c0-2.941 2.392-5.333 5.333-5.333s5.333 2.392 5.333 5.333v2.667h-10.667zM26.667 25.333c0 2.205-1.795 4-4 4h-13.333c-2.205 0-4-1.795-4-4v-12h2.667v2.667c0 0.737 0.597 1.333 1.333 1.333s1.333-0.596 1.333-1.333v-2.667h10.667v2.667c0 0.737 0.597 1.333 1.333 1.333s1.333-0.596 1.333-1.333v-2.667h2.667z" />
                </svg>
              </span>
              <p className="mb-4 text-gray-500">
                {t("checkoutPage.emptyHint")}
              </p>
              <AppLink
                href="/"
                className="s-button-element s-button-btn s-button-solid s-button-primary inline-flex min-w-40 justify-center"
              >
                <span className="s-button-text">
                  {t("checkoutPage.browseServices")}
                </span>
              </AppLink>
            </div>
          ) : (
            <div className="flex flex-col items-start lg:flex-row">
              <div className="main-content w-full flex-1 ltr:lg:mr-8 rtl:lg:ml-8">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <CartSummary onSubmit={handleSubmit} />
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
