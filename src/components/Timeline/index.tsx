import { CheckCircle } from "@nine-thirty-five/material-symbols-react/rounded/filled";
import React from "react";

export default function Timeline({
  stage = 0,
  content,
}: {
  stage?: number;
  content?: any;
}) {
  return (
    <>
      <div className="block md:hidden">
        <div className="flex flex-col align-top gap-4">
          <div className="flex items-center gap-2">
            {stage === 0 ? (
              <div className="h-5 w-5 rounded-full bg-gray-300"></div>
            ) : (
              <CheckCircle className="w-5 h-5 text-gray-500" />
            )}
            Personal Information
          </div>
          <div className="flex items-center gap-2">
            {stage === 1 ? (
              <div className="h-5 w-5 rounded-full bg-gray-300"></div>
            ) : stage > 1 ? (
              <CheckCircle className="w-5 h-5 text-gray-500" />
            ) : (
              <div className="h-5 w-5 rounded-full border-gray-300 border-2"></div>
            )}
            Dependent Information
          </div>
          <div className="flex items-center gap-2">
            {stage === 2 ? (
              <div className="h-5 w-5 rounded-full bg-gray-300"></div>
            ) : stage > 2 ? (
              <CheckCircle className="w-5 h-5 text-gray-500" />
            ) : (
              <div className="h-5 w-5 rounded-full border-gray-300 border-2"></div>
            )}
            Upload Documents
          </div>
          <div className="flex items-center gap-2">
            {stage === 4 ? (
              <div className="h-5 w-5 rounded-full bg-gray-300"></div>
            ) : stage > 4 ? (
              <CheckCircle className="w-5 h-5 text-gray-500" />
            ) : (
              <div className="h-5 w-5 rounded-full border-gray-300 border-2"></div>
            )}
            Verification
          </div>
        </div>
      </div>
      <div className="hidden md:block mx-auto">
        <ul className="timeline mt-12">
          {/* Residency Options */}
          <li>
            <div className="timeline-start px-4">
              {content?.steps?.step1?.title}
            </div>
            <div className="timeline-middle">
              {stage === 0 ? (
                <div className="h-5 w-5 rounded-full bg-gray-300"></div>
              ) : (
                <CheckCircle className="w-5 h-5 text-gray-500" />
              )}
            </div>

            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start px-4">
              {content?.steps?.step2?.title}
            </div>
            <div className="timeline-middle">
              {stage === 1 ? (
                <div className="h-5 w-5 rounded-full bg-gray-300"></div>
              ) : stage > 1 ? (
                <CheckCircle className="w-5 h-5 text-gray-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-gray-300 border-2"></div>
              )}
            </div>

            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start px-4">
              {content?.steps?.step3?.title}
            </div>
            <div className="timeline-middle">
              {stage === 2 ? (
                <div className="h-5 w-5 rounded-full bg-gray-300"></div>
              ) : stage > 2 ? (
                <CheckCircle className="w-5 h-5 text-gray-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-gray-300 border-2"></div>
              )}
            </div>

            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start px-4">
              {content?.steps?.step4?.title}
            </div>
            <div className="timeline-middle">
              {stage === 3 ? (
                <div className="h-5 w-5 rounded-full bg-gray-300"></div>
              ) : stage > 3 ? (
                <CheckCircle className="w-5 h-5 text-gray-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-gray-300 border-2"></div>
              )}
            </div>

            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start px-4">
              {content?.steps?.step6?.title || "Verification"}
            </div>
            <div className="timeline-middle">
              {stage === 4 ? (
                <div className="h-5 w-5 rounded-full bg-gray-300"></div>
              ) : stage > 4 ? (
                <CheckCircle className="w-5 h-5 text-gray-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-gray-300 border-2"></div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
