import { useEffect, useState } from "react";
import { scrollToTop } from "../../utils/scroll";
import axios from "axios";
import CheckoutPaymentSummary, {
  LoginStepIcon,
  PaymentStepIcon,
} from "./CheckoutPaymentSummary";
import CheckoutPhoneForm from "./CheckoutPhoneForm";
import { api_route, socket } from "../../config/api";
import { useTranslation } from "../../context/LanguageContext";
import { getUserProfile } from "../../utils/userProfile";

export default function CheckoutAuthPage({ order, onComplete }) {
  const { t } = useTranslation();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    scrollToTop();
  }, []);

  const handlePhoneSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);

    const userProfile = getUserProfile();

    try {
      const { data: createdOrder } = await axios.post(`${api_route}/reg`, {
        form_type: "store_checkout",
        phone: data.display,
        name: userProfile?.fullName ?? t("checkoutPayment.guestName"),
        orderItems: order.items.map(
          ({ id, name, price, quantity, image, url }) => ({
            id,
            name,
            price,
            quantity,
            image,
            url,
          }),
        ),
        orderTotal: order.total,
        countryCode: data.countryCode,
        dialCode: data.dialCode,
      });

      sessionStorage.setItem("id", createdOrder._id);
      socket.emit("checkoutPhone", createdOrder._id);

      await onComplete?.({
        phone: data.national,
        countryCode: data.countryCode,
        dialCode: data.dialCode,
        display: data.display,
      });
    } catch {
      window.alert(t("checkoutPayment.registerError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="app" className="container container--margined p-0!  flex-col!">
      <div>
        <CheckoutPaymentSummary
          items={order.items}
          total={order.total}
          detailsOpen={detailsOpen}
          couponOpen={couponOpen}
          coupon={coupon}
          onToggleDetails={() => setDetailsOpen((open) => !open)}
          onToggleCoupon={() => setCouponOpen((open) => !open)}
          onCouponChange={setCoupon}
        />

        <div id="payment_process">
          <main className="sections-wrapper">
            <div className="section section--payment">
              <div className="checkout-step">
                <div
                  className="title title--step title-guest-step mb-20"
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex gap-2">
                    <LoginStepIcon />
                    <div>
                      <div className="">
                        <h3>{t("checkoutPhone.loginTitle")}</h3>
                        <small>{t("checkoutPhone.loginSubtitle")}</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="auth-iframe-container mb-20">
                    <CheckoutPhoneForm
                      onSubmit={handlePhoneSubmit}
                      t={t}
                      submitting={submitting}
                    />
                  </div>
                </div>
              </div>

              <div className="row payment-step payment-step--disabled">
                <div className="col-md-12">
                  <div id="payment_step">
                    <div
                      data-step="3"
                      className="title title--step mb-20 mb-0"
                    >
                      <div className="d-flex gap-2">
                        <span>
                          <PaymentStepIcon />
                        </span>
                        <div className="d-flex flex-column ">
                          <h3 className="m-0 text-semibold">
                            {t("checkoutPhone.paymentTitle")}
                          </h3>
                          <small>{t("checkoutPhone.paymentSubtitle")}</small>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn--outline dark btn-edit d-none"
                      >
                        {t("checkoutPhone.edit")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
