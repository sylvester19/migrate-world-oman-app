"use client";

import React, { useEffect, useState } from "react";
import {
  Add,
  ArrowForward,
  ArrowBack,
} from "@nine-thirty-five/material-symbols-react/rounded/filled";
import UploadFile from "./UploadFile";
import Select, { components } from "react-select";

export default function UploadDocuments({
  stageSet,
  formId,
  content,
  lang = "en",
}: any) {
  const [documentTypes, documentTypesSet] = useState([]);
  const [residencyDocumentTypes, residencyDocumentTypesSet] = useState<any>([]);
  const [uploadedDocuments, uploadedDocumentsSet] = useState<any>([]);
  const [residencyOption, residencyOptionSet] = useState<string | null>(null);

  useEffect(() => {
    fetchDocumentTypes();
    fetchDocuments();
    fetchResidencyDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}document-types`
    );

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Document types fetched:", jsonResponse);
      documentTypesSet(jsonResponse.data);
    } else {
      console.error(
        "Error fetching document types:",
        response.status,
        response.statusText
      );
    }
  };

  const fetchResidencyDocumentTypes = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}residence-document-options`
    );

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Residency document types fetched:", jsonResponse);
      residencyDocumentTypesSet(jsonResponse.data);
    } else {
      console.error(
        "Error fetching residency document types:",
        response.status,
        response.statusText
      );
    }
  };

  const fetchDocuments = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}documents?oman_lead_id=${formId}`
    );

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Documents fetched:", jsonResponse);
      uploadedDocumentsSet(jsonResponse.data);
    } else {
      console.error(
        "Error fetching documents:",
        response.status,
        response.statusText
      );
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      let isEmpty = true;

      const formData = new FormData();

      formData.append("oman_lead_id", formId);
      const inputs = e.target.querySelectorAll("input[type=file]");
      inputs.forEach((input: any, index: any) => {
        if (input.files?.[0] && index < documentTypes.length) {
          formData.append(`documents[${index}][document_type_id]`, index + 1);
          formData.append(`documents[${index}][file]`, input.files[0]);
          isEmpty = false;
        }
      });

      if (isEmpty) {
        stageSet(4);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}upload-documents`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      if (response.ok) {
        const jsonResponse = await response.json();

        stageSet(4);
        console.log("Upload successful:", jsonResponse);
      } else {
        console.error(
          "Error uploading documents:",
          response.status,
          response.statusText
        );
      }

      // TODO: upload documents
    } catch (error) {
      console.error(error);
    }
  };

  console.log("residencyDocumentTypes", residencyDocumentTypes);

  return (
    <form className="block" onSubmit={onSubmit}>
      <h2 className="text-xl font-bold mt-8 mb-2 text-gray-700">
        {content?.uploadDocuments?.title}
      </h2>
      <p className="text-gray-500">{content?.uploadDocuments?.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {documentTypes.map((documentType: any) => (
          <UploadFile
            key={documentType.id}
            title={lang === "ar" ? documentType.name_ar : documentType.name}
            alt={
              lang === "ar"
                ? documentType.description_ar
                : documentType.description
            }
            name={documentType.name}
            document={
              uploadedDocuments.find(
                (doc: any) => doc.oman_lead_document_type_id == documentType.id
              )?.download_link
            }
            required={documentType.required}
            content={content}
          />
        ))}
      </div>
      <hr />

      {residencyDocumentTypes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div>
            <label
              htmlFor="residence"
              className="block text-gray-600 mx-2 my-2"
            >
              {content?.uploadDocuments?.residenceOption?.label}
              <span className="text-error ml-1">*</span>
            </label>
            <Select
              styles={{
                control: (styles) => ({
                  ...styles,
                  borderColor: "#d1d5db",
                  borderRadius: "0.375rem",
                  height: "2.5rem",
                }),
              }}
              options={residencyDocumentTypes.map((c: any) => ({
                value: c.id,
                label: lang === "ar" ? c.name_ar : c.name,
              }))}
              value={
                residencyDocumentTypes
                  .map((c: any) => ({
                    value: c.id,
                    label: lang === "ar" ? c.name_ar : c.name,
                  }))
                  .filter((c: any) => c.value === residencyOption)[0]
              }
              onChange={(selected: any) => {
                residencyOptionSet(selected.value);
              }}
              placeholder={
                content?.uploadDocuments?.residenceOption?.placeholder
              }
            />
          </div>
        </div>
      )}

      <hr />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {residencyOption &&
          residencyDocumentTypes.length > 0 &&
          residencyDocumentTypes
            .find((c: any) => c.id === residencyOption)
            ?.document_option_types?.map((document: any) => (
              <UploadFile
                key={document.id}
                title={lang === "ar" ? document.name_ar : document.name}
                alt={
                  lang === "ar" ? document.description_ar : document.description
                }
                name={document.name}
                document={null}
                required={true || document.required}
                content={content}
              />
            ))}
      </div>

      <div className="flex justify-between mt-12">
        <button
          className="btn btn-primary btn-outline"
          onClick={() => stageSet(2)}
        >
          {lang === "ar" ? <ArrowForward /> : <ArrowBack />}
          {content?.button?.back}
        </button>
        <button className="btn btn-primary " type="submit">
          {content?.button?.next}
          {lang === "ar" ? <ArrowBack /> : <ArrowForward />}
        </button>
      </div>
    </form>
  );
}
