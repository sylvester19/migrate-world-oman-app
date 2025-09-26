import React, { useState } from "react";
import toast from "react-hot-toast";

export const Verification = ({
  isVerifiedSet,
  refNoSet,
  personalInformationSet,
  formIdSet,
  content,
  lang
}: any) => {
  const [isOtpSent, isOtpSentSet] = useState(false);
  const [email, emailSet] = useState("");

  const sendOtp = async (e: any) => {
    e.preventDefault();

    try {
      const email = e.target.email.value;

      // form data
      const formData = new FormData();
      formData.append("email", email);
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}send-otp`, {
        method: "POST",
        body: formData,
      });

      const res = await data.json();

      isOtpSentSet(true);
      emailSet(email);
      toast.success(res.message);
    } catch (error) {
      console.log("error", error);
      toast.error("An error occurred, please try again");
    }
  };

  const verifyOtp = async (e: any) => {
    e.preventDefault();

    try {
      const otp = e.target.otp.value;

      // form data
      const formData = new FormData();
      formData.append("otp", otp);
      formData.append("email", email);
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}verify-otp`, {
        method: "POST",
        body: formData,
      });

      const res = await data.json();

      if (res?.data) {
        refNoSet(res.data.ref_no);
        personalInformationSet(res.data.personal_information);
        formIdSet(res.data.id);
        isVerifiedSet(true);
      } else {
        throw new Error(res.error);
      }

      toast.success(res.message);
    } catch (error: any) {
      console.log("error", error);
      toast.error(error.message || "An error occurred, please try again");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-28">
      {!isOtpSent ? (
        <>
        <form
          onSubmit={sendOtp}
          className="w-full flex flex-col items-center justify-center"
        >
          {/* Email */}
          <label className="form-control w-full md:w-1/2 px-8">
            <div className="label">
              <span className="label-text">{content.verification.email.label}</span>
            </div>
            <input
              type="email"
              placeholder={content.verification.email.placeholder}
              name="email"
              className="input input-bordered w-full "
            />
          </label>
          <button className="btn btn-primary mt-8" type="submit">
            {content.verification.email.button}
          </button>
        </form>
        {/* Switch Language (ar | en)*/}
        <div className="mt-8">
          <button
            className="btn btn-neutral btn-outline"
            onClick={() => {
              const newLang = lang === "en" ? "ar" : "en";
              window.location.href = `/${newLang}`;
            }}
          >
            {lang === "en" ? "التبديل إلى اللغة العربية" : "Switch to English"}
          </button>
        </div>
        </>
      ) : (
        <form
          onSubmit={verifyOtp}
          className="w-full flex flex-col items-center justify-center"
        >
          {/* OTP */}
          <label className="form-control w-full md:w-1/2 px-8">
            <div className="label">
              <span className="label-text">{content.verification.otp.label}</span>
            </div>
            <input
              type="number"
              placeholder={content.verification.otp.placeholder}
              name="otp"
              className="input input-bordered w-full "
            />
          </label>
          <button className="btn btn-primary mt-8" type="submit">
            {content.verification.otp.button}
          </button>
        </form>
      )}
    </div>
  );
};
