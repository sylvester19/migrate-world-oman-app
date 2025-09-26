"use client";

import React, { useEffect, useState } from "react";
import { ArrowForward } from "@nine-thirty-five/material-symbols-react/rounded/filled";
import toast from "react-hot-toast";

export default function ResidencyOption({
  stageSet,
  formId,
  residencyOption,
  residencyOptionSet,
  content,
  lang = "en",
}: any) {
  // const [residencyOption, residencyOptionSet] = useState<string | null>(null);
  const [isSaved, isSavedSet] = useState(false);

  useEffect(() => {
    fetchResidencyOption();
  }, []);

  // fetch residency option
  const fetchResidencyOption = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}residency-option/${formId}`
      );

      const response = await res.json();

      if (response?.data?.residency_type) {
        residencyOptionSet(response.data.residency_type);
        isSavedSet(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const onConfirm = async () => {
    try {
      if (!residencyOption) {
        toast.error("Please select a residency option");
        return;
      }

      const data = new FormData();
      data.append("oman_lead_id", formId);
      data.append("residency_type", acknoledgement[residencyOption].key);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}residency-option/add`,
        {
          method: "POST",
          body: data,
        }
      );

      const response = await res.json();

      stageSet(1);
      isSavedSet(true);
    } catch (error) {
      console.log("error", error);
      toast.error("An error occurred, please try again");
    }
  };

  const acknoledgement: {
    [key: string]: {
      key: string;
      title: string;
      description: JSX.Element;
    };
  } = {
    "5_years": {
      key: "5_years",
      title: content?.residencySelection?.["5year"]?.title,
      description: (
        <>
          {content?.residencySelection?.["5year"]?.checkbox}{" "}
          <strong>
            {content?.residencySelection?.["5year"]?.checkboxAmount}
          </strong>
        </>
      ),
    },
    "10_years": {
      key: "10_years",
      title: content?.residencySelection?.["10year"]?.title,
      description: (
        <>
          {content?.residencySelection?.["10year"]?.checkbox}{" "}
          <strong>
            {content?.residencySelection?.["10year"]?.checkboxAmount}
          </strong>
        </>
      ),
    },
  };

  return (
    <div>
      {!residencyOption ? (
        <>
          <h2 className="text-xl font-bold mt-8 mb-2 text-gray-700 text-center">
            {content?.residencySelection?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div
              className="card bg-neutral text-neutral-content border border-neutral hover:border-yellow-400 cursor-pointer hover:text-white"
              onClick={() => residencyOptionSet("5_years")}
            >
              <div className="card-body items-center justify-center text-center">
                <h2 className="card-title text-5xl">
                  {content?.residencySelection?.["5year"]?.label}
                </h2>
                <h4 className="card-subtitle text-xl">
                  {content?.residencySelection?.permit}
                </h4>
              </div>
            </div>
            <div
              className="card bg-neutral text-neutral-content border border-neutral hover:border-yellow-400 cursor-pointer hover:text-white"
              onClick={() => residencyOptionSet("10_years")}
            >
              <div className="card-body items-center justify-center text-center">
                <h2 className="card-title text-5xl">
                  {content?.residencySelection?.["10year"]?.label}
                </h2>
                <h4 className="card-subtitle text-xl">
                  {content?.residencySelection?.permit}
                </h4>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <img
            src="/oman.jpg"
            className="w-full h-64 object-cover rounded-lg"
            alt="Oman"
          />
          <div className="flex flex-col items-start justify-center max-w-xl mx-auto gap-6 w-full">
            {isSaved ? (
              <>
                <h4 className="text-xl font-bold text-green-500">
                  {content?.residencySelection?.enrolled}
                </h4>
                <h2 className="text-4xl font-bold text-gray-700 text-center">
                  {acknoledgement[residencyOption].title}
                </h2>
                <button className="btn btn-primary px-6" onClick={onConfirm}>
                  {content?.residencySelection?.button?.continue}
                  <ArrowForward />
                </button>
                <button
                  className="btn btn-primary btn-link btn-sm "
                  onClick={() => {
                    residencyOptionSet(null);
                    isSavedSet(false);
                  }}
                >
                  {content?.residencySelection?.button?.reset}
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-gray-700 text-center">
                  {acknoledgement[residencyOption].title}
                </h2>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className={
                        "checkbox checkbox-sm " +
                        (lang === "ar" ? "ml-2" : "mr-2")
                      }
                    />
                    <span className="label-text">
                      {acknoledgement[residencyOption].description}
                    </span>
                  </label>
                </div>
                <div className="flex justify-center items-center">
                  <button className="btn btn-primary px-6" onClick={onConfirm}>
                    {content?.residencySelection?.button?.confirm}
                    {lang === "ar" ? (
                      <ArrowForward className="rotate-180" />
                    ) : (
                      <ArrowForward />
                    )}
                  </button>
                  {/* Reset */}
                  <button
                    className="btn btn-primary btn-link btn-sm "
                    onClick={() => residencyOptionSet(null)}
                  >
                    {content?.residencySelection?.button?.reset}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
