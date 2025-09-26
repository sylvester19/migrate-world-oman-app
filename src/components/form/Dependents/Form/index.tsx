"use client";

import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import UploadFile from "../../UploadDocuments/UploadFile";
import { Country, State, City } from "country-state-city";
import { PhoneInput } from "react-international-phone";
import { Delete } from "@nine-thirty-five/material-symbols-react/outlined";
import toast from "react-hot-toast";
import arabCountries from "localized-countries/data/ar.json";



const SelectInput = ({ ...rest }: any) => (
  <components.Input {...rest} autoComplete={"nope"} />
);

export default function DependentForm({
  dependent,
  count,
  setDependents,
  formId,
  content,
  lang = "en",
}: any) {
  const [country, setCountry] = useState("ae");
  const [birthCountry, birthCountrySet] = useState<any>();
  const [cityList, cityListSet] = useState<any>();

  const relations: any[] =
    content?.dependent?.dependentInformation?.relation?.list?.map(
      (relation: any) => ({
        value: relation,
        label: relation,
      })
    ) || [];
  //   [
  //   { value: "spouse", label: "Spouse" },
  //   { value: "children", label: "Children" },
  //   { value: "mother/father", label: "Mother/Father" },
  //   { value: "in-laws", label: "In-laws" },
  //   { value: "brother/sister", label: "Brother/Sister" },
  //   { value: "grandchildren", label: "Grandchildren" },
  // ];

  const list: any =
      lang === "ar"
        ? Object.values(arabCountries).map((c) => ({
            value: c,
            label: c,
          }))
        : Country.getAllCountries().map((c) => ({
            value: c.name,
            label: c.name,
          }));

  useEffect(() => {
    cityListSet(
      City.getCitiesOfCountry(
        Country.getAllCountries().find((c) => c.name === birthCountry?.value)
          ?.isoCode as string
      )?.map((c) => ({
        value: c.name,
        label: c.name,
      }))
    );
  }, [birthCountry]);

  const onRemove = async () => {
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}dependent/delete/${formId}/${dependent.id}`,
        {
          method: "DELETE",
        }
      );

      if (data.ok) {
        setDependents((prev: any) => {
          prev.splice(count - 1, 1);
          return [...prev];
        });
        toast.success("Dependent removed successfully");
      } else {
        toast.error("Error removing dependent");
      }
    } catch (error) {
      toast.error("Error removing dependent");
    }
  };

  console.log("content", content);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mt-8 mb-2 text-gray-700">
            {content?.dependent?.name} {count}
          </h3>
          <p className="text-gray-500 mb-4">
            {content?.dependent?.description}
          </p>
        </div>
        {/* Trash */}
        <button
          className="btn btn-primary btn-outline btn-xs"
          onClick={onRemove}
        >
          <Delete height="1rem" width="1rem" />
          {content?.dependent?.remove}
        </button>
      </div>
      <form autoComplete="off">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Relation */}
          <div>
            <label htmlFor="relation" className="block text-gray-600">
              {content?.dependent?.dependentInformation?.relation?.label}
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
              options={relations}
              value={relations.find((r) => r.value === dependent.relation)}
              onChange={(selected: any) => {
                setDependents((prev: any) => {
                  prev[count - 1].relation = selected.value;
                  return [...prev];
                });
              }}
              placeholder={
                content?.dependent?.dependentInformation?.relation?.placeholder
              }
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-gray-600">
              {content?.dependent?.dependentInformation?.fullName?.label}
              <span className="text-error ml-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full border-gray-300 border rounded-md px-4 h-10"
              value={dependent.full_name}
              onChange={(e) => {
                setDependents((prev: any) => {
                  prev[count - 1].full_name = e.target.value;
                  return [...prev];
                });
              }}
              placeholder={
                content?.dependent?.dependentInformation?.fullName?.placeholder
              }
            />
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-600">
              {content?.dependent?.dependentInformation?.email?.label}
              <span className="text-error ml-1">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border-gray-300 border rounded-md px-4 h-10"
              value={dependent.email}
              onChange={(e) => {
                setDependents((prev: any) => {
                  prev[count - 1].email = e.target.value;
                  return [...prev];
                });
              }}
              placeholder={
                content?.dependent?.dependentInformation?.email?.placeholder
              }
            />
          </div>
          {/* Contact Number */}
          <div>
            <label htmlFor="email" className="block text-gray-600">
              {content?.dependent?.dependentInformation?.contactNumber?.label}
              <span className="text-error ml-1">*</span>
            </label>
            <div
              className="w-full border-gray-300 border rounded-md px-2 h-10 flex items-center"
              dir="ltr"
            >
              <PhoneInput
                defaultCountry="om"
                onChange={(phone) => {
                  setDependents((prev: any) => {
                    prev[count - 1].contact_number = phone;
                    return [...prev];
                  });
                }}
                value={dependent?.contact_number || ""}
              />
            </div>
          </div>

          {/* Date of birth */}
          <div>
            <label htmlFor="dob" className="block text-gray-600">
              {content?.dependent?.dependentInformation?.dateOfBirth?.label}
              <span className="text-error ml-1">*</span>
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              className="w-full border-gray-300 border rounded-md px-4 h-10"
              value={dependent.dob}
              onChange={(e) => {
                setDependents((prev: any) => {
                  prev[count - 1].dob = e.target.value;
                  return [...prev];
                });
              }}
              placeholder={
                content?.dependent?.dependentInformation?.dateOfBirth
                  ?.placeholder
              }
            />
          </div>
          {/* Place of Birth */}
          {/* <div>
            <label htmlFor="pob" className="block text-gray-600">
              Place of Birth
            </label>
            <input
              type="text"
              id="pob"
              name="pob"
              className="w-full border-gray-300 border rounded-md px-4 h-10"
              value={dependent.place_of_birth}
              onChange={(e) => {
                setDependents((prev: any) => {
                  prev[count - 1].place_of_birth = e.target.value;
                  return [...prev];
                });
              }}
            />
          </div> */}

          {/* Place of Birth - Country */}
          <div className="flex items-center flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="form-control w-full ">
                <label htmlFor="pob" className="block text-gray-600">
                  {
                    content?.dependent?.dependentInformation?.placeOfBirth
                      ?.label
                  }
                  <span className="text-error ml-1">*</span>
                </label>
                <Select
                  classNames={{
                    control: () => " rounded-2xl px-2",
                  }}
                  // onChange={onChangeBirthCountry}
                  onChange={(selected: any) => {
                    birthCountrySet(selected);
                    setDependents((prev: any) => {
                      prev[count - 1].country = selected.value;
                      return [...prev];
                    });
                  }}
                  value={
                    dependent?.country
                      ? {
                          value: dependent?.country,
                          label: dependent?.country,
                        }
                      : null
                  }
                  options={list}
                  placeholder={
                    content?.dependent?.dependentInformation?.placeOfBirth
                      ?.countryPlaceholder
                  }
                  components={{ Input: SelectInput }}
                />
              </label>
            </div>
            <div className="w-full md:w-1/2 h-full">
              <label className="form-control w-full justify-end h-full">
                .
                {lang === "ar" ? (
                  <input
                    type="text"
                    className="w-full border-gray-300 border rounded-md px-4 h-10"
                    value={dependent?.place_of_birth}
                    onChange={(e) => {
                      setDependents((prev: any) => {
                        prev[count - 1].place_of_birth = e.target.value;
                        return [...prev];
                      });
                    }}
                    placeholder={
                      content?.dependent?.dependentInformation?.placeOfBirth
                        ?.cityPlaceholder
                    }
                  />
                ) : (
                  <Select
                    classNames={{
                      control: () => " rounded-2xl px-2",
                    }}
                    // onChange={onChangeBirthCity}
                    
                    onChange={(selected: any) => {
                      setDependents((prev: any) => {
                        prev[count - 1].city = selected.value;
                        return [...prev];
                      });
                    }}
                    value={
                      dependent?.city
                        ? {
                            value: dependent?.city,
                            label: dependent?.city,
                          }
                        : null
                    }
                    key={"abc"}
                    options={cityList}
                    placeholder={
                      content?.dependent?.dependentInformation?.placeOfBirth
                        ?.cityPlaceholder
                    }
                    components={{ Input: SelectInput }}
                  />
                )}
              </label>
            </div>
          </div>

          {/* Citizenship/s */}
          <div>
            <label htmlFor="citizenship" className="block text-gray-600">
              {content?.dependent?.dependentInformation?.citizenship?.label}
              <span className="text-error ml-1">*</span>{" "}
              <span className="label-text-alt text-gray-500">
                {content?.dependent?.dependentInformation?.citizenship?.info}
              </span>
            </label>
            <Select
              isMulti
              styles={{
                control: (styles) => ({
                  ...styles,
                  borderColor: "#d1d5db",
                  borderRadius: "0.375rem",
                  height: "2.5rem",
                }),
              }}
              options={list}
              value={list.filter((c: any) =>
                dependent.citizenships.includes(c.value)
              )}
              onChange={(selected: any) => {
                setDependents((prev: any) => {
                  prev[count - 1].citizenships = selected.map(
                    (s: any) => s.value
                  );
                  return [...prev];
                });
              }}
              placeholder={
                content?.dependent?.dependentInformation?.citizenship
                  ?.placeholder
              }
            />
          </div>
          {/* Country of Residence */}
          <div>
            <label htmlFor="residence" className="block text-gray-600">
              {
                content?.dependent?.dependentInformation?.countryOfResidence
                  ?.label
              }
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
              options={list}
              value={
                list.filter((c: any) =>
                  dependent.residences?.includes(c.value)
                )[0]
              }
              onChange={(selected: any) => {
                setDependents((prev: any) => {
                  prev[count - 1].residences = [selected.value];
                  return [...prev];
                });
              }}
              placeholder={
                content?.dependent?.dependentInformation?.countryOfResidence
                  ?.placeholder
              }
            />
          </div>
          {/* Home Address */}
          <div>
            <label htmlFor="address" className="block text-gray-600">
              {content?.dependent?.dependentInformation?.homeAddress?.label}
              <span className="text-error ml-1">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              className="w-full border-gray-300 border rounded-md p-3 h-20"
              value={dependent.home_address}
              onChange={(e) => {
                setDependents((prev: any) => {
                  prev[count - 1].home_address = e.target.value;
                  return [...prev];
                });
              }}
              placeholder={
                content?.dependent?.dependentInformation?.homeAddress
                  ?.placeholder
              }
            />
            <div className="label">
              <span className="label-text-alt">
                {content?.dependent?.dependentInformation?.homeAddress?.subText}
              </span>
            </div>
          </div>
          <div />
          <UploadFile
            title={content?.dependent?.dependentInformation?.file?.label}
            alt={content?.dependent?.dependentInformation?.file?.alt}
            name="Children Custody Certificate"
            onChange={(e: any) => {
              setDependents((prev: any) => {
                prev[count - 1].child_custody_certificate = e.target.files[0];
                return [...prev];
              });
            }}
            document={dependent.custody_certificate_download_link}
            content={content}
          />
        </div>
      </form>
    </div>
  );
}
