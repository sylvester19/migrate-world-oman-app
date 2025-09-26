"use client";

import React, { useEffect, useState } from "react";
import { ArrowBack, ArrowForward } from "@nine-thirty-five/material-symbols-react/outlined";

export default function Payment({
  stageSet,
  formId,
  residencyOption,
  content,
  lang = "en",
}: any) {
  const [breakdown, setBreakdown] = useState<any>(null);

  const acknoledgement: any = {
    "5_years": {
      key: "5_years",
      title: content?.residencySelection?.["5year"]?.title,
    },
    "10_years": {
      key: "10_years",
      title: content?.residencySelection?.["10year"]?.title,
    },
  };

  useEffect(() => {
    // fetch breakdown
    fetchBreakdown();
  }, []);

  const fetchBreakdown = async () => {
    // https://mgw.migrateworld.a2hosted.com/api/oman/payment-structure/%7Boman_lead_id%7D
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}payment-structure/${formId}`
      );

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Residency document types fetched:", jsonResponse);
        setBreakdown(jsonResponse.data.payment_structure);
      } else {
        console.error(
          "Error fetching residency document types:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching residency document types:", error);
    }
  };

  console.log("breakdown residencyOption", residencyOption);

  return (
    <>
      <div className="overflow-x-auto w-2/3 max-w-2xl mx-auto card shadow-md border">
        <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-700 text-center">
          {content?.paymentDetails?.title}
        </h2>
        <h4 className="text-lg font-bold mb-2 text-gray-700 text-center">
          {acknoledgement[residencyOption]?.title}
        </h4>
        <p className="text-center text-gray-500 mt-2 mb-4">
          {content?.paymentDetails?.description}
        </p>
        <hr />
        <table className="table">
          {/* head */}

          <tbody>
            <tr>
              <td rowSpan={3}>
                <strong>{content?.paymentDetails?.mainApplicant}</strong>
              </td>
              <td>{content?.paymentDetails?.fees?.legal}</td>
              <td>
                {content?.paymentDetails?.OMR}{" "}
                {breakdown?.cost_breakdown?.main_applicant?.legal_fee_vat_inc ||
                  0}
              </td>
            </tr>
            <tr>
              <td>{content?.paymentDetails?.fees?.government}</td>
              <td>
                {content?.paymentDetails?.OMR}{" "}
                {breakdown?.cost_breakdown?.main_applicant?.government_fee || 0}
              </td>
            </tr>
            <tr className="border-gray-300">
              <td>
                <strong>{content?.paymentDetails?.total}</strong>
              </td>
              <td>
                <strong>
                  {content?.paymentDetails?.OMR}{" "}
                  {breakdown?.cost_breakdown?.main_applicant?.total_amount || 0}
                </strong>
              </td>
            </tr>
            {breakdown?.cost_breakdown?.above_12?.map(
              (item: any, index: number) => (
                <>
                  <tr key={index}>
                    <td rowSpan={3}>
                      <p>
                        <strong>{content?.dependent?.name} {index + 1} </strong>
                      </p>
                      <p className="capitalize">
                        {item.relation} ({content?.paymentDetails?.age}: {item.age})
                      </p>
                    </td>
                    <td>{content?.paymentDetails?.fees?.legal}</td>
                    <td>
                      {content?.paymentDetails?.OMR} {item.legal_fee_vat_inc}
                    </td>
                  </tr>
                  <tr>
                    <td>{content?.paymentDetails?.fees?.government}</td>
                    <td>
                      {content?.paymentDetails?.OMR} {item.government_fee}
                    </td>
                  </tr>
                  <tr className="border-gray-300">
                    <td>
                      <strong>{content?.paymentDetails?.total}</strong>
                    </td>
                    <td>
                      <strong>
                        {content?.paymentDetails?.OMR} {item.total_amount}
                      </strong>
                    </td>
                  </tr>
                </>
              )
            )}
            {breakdown?.cost_breakdown?.below_12?.map(
              (item: any, index: number) => (
                <>
                  <tr key={index}>
                    <td rowSpan={3}>
                      <p>
                        <strong>
                          {content?.dependent?.name}{" "}
                          {index +
                            1 +
                            breakdown?.cost_breakdown?.above_12?.length}
                        </strong>
                      </p>
                      <p className="capitalize">
                        {item.relation} ({content?.paymentDetails?.age}:{" "}
                        {item.age})
                      </p>
                    </td>
                    <td>{content?.paymentDetails?.fees?.legal}</td>
                    <td>
                      {content?.paymentDetails?.OMR} {item.legal_fee_vat_inc}
                    </td>
                  </tr>
                  <tr>
                    <td>{content?.paymentDetails?.fees?.government}</td>
                    <td>
                      {content?.paymentDetails?.OMR} {item.government_fee}
                    </td>
                  </tr>
                  <tr className="border-gray-300">
                    <td>
                      <strong>{content?.paymentDetails?.total}</strong>
                    </td>
                    <td>
                      <strong>
                        {content?.paymentDetails?.OMR} {item.total_amount}
                      </strong>
                    </td>
                  </tr>
                </>
              )
            )}

            <tr>
              <td colSpan={2}>
                <strong>{content?.paymentDetails?.overallTotal}</strong>
              </td>
              <td>
                <strong>
                  {content?.paymentDetails?.OMR}{" "}
                  {breakdown?.cost_breakdown?.overall_total}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-12">
        <button
          className="btn btn-primary btn-outline"
          onClick={() => stageSet(3)}
        >
          {lang === "ar" ? <ArrowForward /> : <ArrowBack />}
          {content?.button?.back}
        </button>
        <button className="btn btn-primary" onClick={() => stageSet(5)}>
          {content?.paymentDetails?.payNow}
        </button>
      </div>
    </>
  );
}
