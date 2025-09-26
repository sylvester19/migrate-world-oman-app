"use client";

import React, { useEffect, useState } from "react";
import DependentForm from "./Form";
import {
  Add,
  ArrowForward,
  ArrowBack,
} from "@nine-thirty-five/material-symbols-react/rounded/filled";
import toast from "react-hot-toast";

export default function Dependents({
  stageSet,
  formId,
  content,
  lang = "en",
}: any) {
  const [dependents, setDependents] = useState<any[]>([]);
  const [noDependents, setNoDependents] = useState(false);

  useEffect(() => {
    fetchDependents();
  }, []);

  const fetchDependents = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}dependents/${formId}`
      );

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Dependents fetched:", jsonResponse);
        const list = jsonResponse.data.map((dependent: any) => {
          return {
            ...dependent,
            dob: dependent.dob?.split(" ")[0],
            // residences: dependent.residences?.[0]?.country,
            residences: dependent.residences.map((residence: any) => {
              return residence.country;
            }),
            citizenships: dependent.citizenships.map((citizenship: any) => {
              return citizenship.citizenship;
            }),
          };
        });
        console.log("list", list);
        setDependents(list);
        // setDependents(jsonResponse.data);
      } else {
        console.error(
          "Error fetching dependents:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {}
  };

  const onSubmit = async () => {
    try {
      console.log("dependentsssss", dependents);
      if (dependents.length === 0) {
        if (!noDependents) {
          toast.error(
            "Please add dependents or confirm that you do not have any dependents"
          );
          return;
        }
        stageSet(3);
        return;
      }

      // form data
      const formData = new FormData();
      // formData.append("dependents", JSON.stringify(dependents));
      dependents.forEach((dependent, index) => {
        if (dependent.id) {
          formData.append(`dependents[${index}][id]`, dependent.id);
        }
        formData.append(`dependents[${index}][relation]`, dependent.relation);
        formData.append(`dependents[${index}][full_name]`, dependent.full_name);
        formData.append(`dependents[${index}][email]`, dependent.email);
        formData.append(
          `dependents[${index}][contact_number]`,
          dependent.contact_number
        );
        formData.append(`dependents[${index}][dob]`, dependent.dob);
        formData.append(`dependents[${index}][country]`, dependent.country);
        formData.append(`dependents[${index}][city]`, dependent.city);
        formData.append(
          `dependents[${index}][home_address]`,
          dependent.home_address
        );
        // check child custody certificate is a file
        if (dependent.child_custody_certificate instanceof File) {
          formData.append(
            `dependents[${index}][child_custody_certificate]`,
            dependent.child_custody_certificate
          );
        }
      });

      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}dependent/add/${formId}`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
          },
          // body: JSON.stringify({ dependents }),
          body: formData,
        }
      );

      const res = await data.json();
      console.log("res", res);

      if (res?.status === "success") {
        stageSet(3);
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.log("error", error);
      toast.error(error.message || "An error occurred, please try again");
    }
  };

  console.log("dependents", dependents);

  return (
    <div className="block">
      <h2 className="text-xl font-bold mt-8 mb-2 text-gray-700">
        {content?.dependent?.title}
      </h2>
      <p className="text-gray-500">{content?.dependent?.subtitle}</p>
      {/* Dependents */}
      {dependents.map((dependent, index) => (
        <DependentForm
          key={index}
          count={index + 1}
          dependent={dependent}
          setDependents={setDependents}
          formId={formId}
          content={content}
          lang={lang}
        />
      ))}
      {/* Add Dependents */}
      <button
        className="btn btn-primary btn-outline btn-sm mt-8"
        onClick={() =>
          setDependents([
            ...dependents,
            {
              // oman_lead_id: formId,
              relation: "",
              full_name: "",
              email: "",
              contact_number: "",
              dob: "",
              place_of_birth: "",
              home_address: "",
              residences: [],
              citizenships: [],
            },
          ])
        }
      >
        <Add />
        {content?.dependent?.addDependent}
      </button>

      {/* Show checkbox to confirm if there is no dependent */}
      {dependents.length === 0 && (
        <div className="mt-4">
          <input
            type="checkbox"
            id="no_dependents"
            name="no_dependents"
            value="no_dependents"
            onChange={() => setNoDependents(!noDependents)}
          />
          <label
            className={lang === "ar" ? "mr-2" : "ml-2"}
            htmlFor="no_dependents"
          >
            {content?.dependent?.checkbox}
          </label>
        </div>
      )}
      {/* No Dependents */}

      <div className="flex justify-between mt-8">
        <button
          className="btn btn-primary btn-outline"
          onClick={() => stageSet(1)}
        >
          {lang === "ar" ? <ArrowForward /> : <ArrowBack />}
          {content?.button?.back}
        </button>
        <button className="btn btn-primary " onClick={onSubmit}>
          {content?.button?.next}
          {lang === "ar" ? <ArrowBack /> : <ArrowForward />}
        </button>
      </div>
    </div>
  );
}
