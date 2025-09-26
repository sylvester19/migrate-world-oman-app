import React from "react";
import { Check } from "@nine-thirty-five/material-symbols-react/rounded/filled";

export default function UploadFile({
  title,
  alt = "",
  name,
  document = null,
  onChange = null,
  required = false,
  content = null,
}: {
  title: string;
  alt?: string;
  name: string;
  document?: any;
  onChange?: any;
  required?: boolean;
  content?: any;
}) {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">
          {title}
          {required && <span className="text-error ml-1">*</span>}
          {alt && (
            <span className="label-text-alt ml-1 text-gray-500">({alt})</span>
          )}
        </span>
      </div>
      <input
        type="file"
        className="file-input file-input-bordered w-full "
        name={name}
        onChange={onChange}
      />
      <div className="label">
        <span className="label-text-alt text-gray-500">
          {content?.upload?.info}
        </span>
        {document && (
          <span className="label-text-alt flex items-center">
            <a
              href={document}
              target="_blank"
              className="text-blue-500"
              download
            >
              {content?.upload?.preview}
            </a>
          </span>
        )}
      </div>
    </label>
  );
}
