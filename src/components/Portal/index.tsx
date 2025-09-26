"use client";

import { Form } from "@/components/form";
import { Verification } from "@/components/verification";
import { useState } from "react";

export const Portal = ({ content, lang }: { content: any;
  lang: string
 }) => {
  const [isVerified, isVerifiedSet] = useState(false);
  const [refNo, refNoSet] = useState(null);
  const [formId, formIdSet] = useState(null);
  const [personalInformation, personalInformationSet] = useState(null);
  const [residencyOption, residencyOptionSet] = useState(null);

  return (
    <>
      {!isVerified ? (
        <Verification
          isVerifiedSet={isVerifiedSet}
          refNoSet={refNoSet}
          formIdSet={formIdSet}
          personalInformationSet={personalInformationSet}
          content={content}
          lang={lang}
        />
      ) : (
        <Form
          refNo={refNo}
          formId={formId}
          personalInformation={personalInformation}
          personalInformationSet={personalInformationSet}
          residencyOption={residencyOption}
          residencyOptionSet={residencyOptionSet}
          content={content}
          lang={lang}
        />
      )}
    </>
  );
};
