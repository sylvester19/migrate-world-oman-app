"use client";

import Dependents from "@/components/form/Dependents";
import PersonalInformation from "@/components/form/PersonalInformation";
import UploadDocuments from "@/components/form/UploadDocuments";
import Timeline from "@/components/Timeline";
import { Verification } from "@/components/verification";
import { useState } from "react";
import PersonaVerification from "./Verification";
import ResidencyOption from "./ResidencyOption";

export const Form = ({
  refNo,
  personalInformation,
  formId,
  personalInformationSet,
  residencyOption,
  residencyOptionSet,
  content,
  lang = "en",
}: any) => {
  const [stage, stageSet] = useState(0);

  return (
    <>
      <p className="text-gray-500">{content?.subtitle}</p>
      <Timeline stage={stage} content={content} />
      {stage === 0 ? (
        <ResidencyOption
          stageSet={stageSet}
          personalInformation={personalInformation}
          formId={formId}
          personalInformationSet={personalInformationSet}
          residencyOption={residencyOption}
          residencyOptionSet={residencyOptionSet}
          content={content}
          lang={lang}
        />
      ) : stage === 1 ? (
        // Personal Information
        <PersonalInformation
          stageSet={stageSet}
          personalInformation={personalInformation}
          formId={formId}
          personalInformationSet={personalInformationSet}
          content={content}
          lang={lang}
        />
      ) : stage === 2 ? (
        <Dependents
          stageSet={stageSet}
          formId={formId}
          content={content}
          lang={lang}
        />
      ) : stage === 3 ? (
        <UploadDocuments
          stageSet={stageSet}
          formId={formId}
          content={content}
          lang={lang}
        />
      ) : (
        <PersonaVerification />
      )}
    </>
  );
};
