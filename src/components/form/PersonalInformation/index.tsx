"use client";

import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import {
  ArrowForward,
  ArrowBack,
} from "@nine-thirty-five/material-symbols-react/rounded/filled";
import { CountrySelector, PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Country, City } from "country-state-city";
import toast from "react-hot-toast";
import arabCountries from "localized-countries/data/ar.json";
import englishCountries from "localized-countries/data/en.json";

const SelectInput = ({ ...rest }: any) => (
  <components.Input {...rest} autoComplete={"nope"} />
);

export default function PersonalInformation({
  stageSet,
  personalInformation,
  formId,
  personalInformationSet,
  content,
  lang = "en",
}: any) {
  const [country, setCountry] = useState("ae");
  const [birthCountry, birthCountrySet] = useState<any>();
  const [cityList, cityListSet] = useState<any>();

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

  const occupationList =
    content?.personalInformation?.occupation?.list.map((item: any) => ({
      value: item,
      label: item,
    })) || [];

  const businessSectorList =
    content?.personalInformation?.businessSector?.list?.map((item: any) => ({
      value: item,
      label: item,
    })) || [];

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

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Personal Information", personalInformation);

    try {
      const data = new FormData();
      data.append("oman_lead_id", formId);
      data.append("full_name", personalInformation.full_name);
      data.append("contact_number", personalInformation.contact_number);
      data.append("linked_in_id", personalInformation.linked_in_id);
      data.append("dob", personalInformation.dob);
      data.append("place_of_birth", personalInformation.place_of_birth);
      data.append("city_of_birth", personalInformation.city_of_birth);
      data.append("occupation", personalInformation.occupation);
      data.append("company_name", personalInformation.company_name);
      const companyWebsite = personalInformation.company_website.startsWith(
        "https://"
      )
        ? personalInformation.company_website
        : `https://${personalInformation.company_website}`;
      data.append("company_website", companyWebsite);
      data.append("home_address", personalInformation.home_address);
      data.append("work_address", personalInformation.work_address);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}personal-information/add`,
        {
          method: "POST",
          body: data,
        }
      );

      const response = await res.json();

      console.log("Response", response);

      if (response?.status === "success") {
        stageSet(2);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("An error occurred, please try again");
    }
  };

  const onChangePersonalInformation = (field: string) => (e: any) => {
    personalInformationSet({
      ...personalInformation,
      [field]: e.target.value,
    });
  };

  const onChangeBirthCountry = (value: any) => {
    birthCountrySet(value);
    personalInformationSet({
      ...personalInformation,
      place_of_birth: value.value,
    });
  };

  const onChangeBirthCity = (value: any) => {
    personalInformationSet({
      ...personalInformation,
      city_of_birth: value.value,
    });
  };

  console.log("country", country);

  return (
    <div>
      <h2 className="text-xl font-bold mt-8 mb-2 text-gray-700">
        {content?.personalInformation?.title}
      </h2>

      <form autoComplete="off" onSubmit={handleOnSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.fullName?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <input
              type="text"
              placeholder={content?.personalInformation?.fullName?.placeholder}
              className="input input-bordered w-full "
              value={personalInformation?.full_name || ""}
              onChange={onChangePersonalInformation("full_name")}
            />
          </label>

          {/* Contact Number */}
          <label className="form-control w-full relative">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.contactNumber?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <div className="input input-bordered flex items-center" dir="ltr">
              <PhoneInput
                defaultCountry="om"
                onChange={(phone) => {
                  personalInformationSet({
                    ...personalInformation,
                    contact_number: phone,
                  });
                }}
                value={personalInformation?.contact_number || ""}
              />
            </div>
          </label>
          {/* LinkedIn ID */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.linkedin?.label}{" "}
                <span className="label-text-alt text-gray-500">
                  {content?.personalInformation?.linkedin?.info}
                </span>
              </span>
            </div>
            <input
              type="text"
              placeholder={content?.personalInformation?.linkedin?.placeholder}
              className="input input-bordered w-full "
              value={personalInformation?.linked_in_id || ""}
              onChange={onChangePersonalInformation("linked_in_id")}
            />
          </label>
          {/* Date of birth */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.dateOfBirth?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <input
              type="date"
              placeholder={
                content?.personalInformation?.dateOfBirth?.placeholder
              }
              className="input input-bordered w-full "
              value={personalInformation?.dob || ""}
              onChange={onChangePersonalInformation("dob")}
            />
          </label>
          {/* Place of Birth - Country */}
          <div className="flex items-center flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text">
                    {content?.personalInformation?.placeOfBirth?.label}
                    <span className="text-error ml-1">*</span>
                  </span>
                </div>
                <Select
                  classNames={{
                    control: () => " rounded-2xl px-2 py-1",
                  }}
                  onChange={onChangeBirthCountry}
                  value={
                    personalInformation?.place_of_birth
                      ? {
                          value: personalInformation?.place_of_birth,
                          label: personalInformation?.place_of_birth,
                        }
                      : null
                  }
                  options={list}
                  placeholder={
                    content?.personalInformation?.placeOfBirth
                      ?.countryPlaceholder
                  }
                  components={{ Input: SelectInput }}
                />
              </label>
            </div>
            <div className="w-full md:w-1/2 h-full">
              <label className="form-control w-full justify-end h-full">
                {lang === "ar" ? (
                  <input
                    type="text"
                    placeholder={
                      content?.personalInformation?.placeOfBirth
                        ?.cityPlaceholder
                    }
                    className="input input-bordered w-full "
                    value={personalInformation?.city_of_birth || ""}
                    onChange={onChangePersonalInformation("city_of_birth")}
                  />
                ) : (
                  <Select
                    classNames={{
                      control: () => " rounded-2xl px-2 py-1",
                    }}
                    onChange={onChangeBirthCity}
                    value={
                      personalInformation?.city_of_birth
                        ? {
                            value: personalInformation?.city_of_birth,
                            label: personalInformation?.city_of_birth,
                          }
                        : null
                    }
                    key={"abc"}
                    options={cityList}
                    placeholder={
                      content?.personalInformation?.placeOfBirth
                        ?.cityPlaceholder
                    }
                    components={{ Input: SelectInput }}
                  />
                )}
              </label>
            </div>
          </div>

          {/* Occupation */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.occupation?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <Select
              classNames={{
                control: () => " rounded-2xl px-2 py-1",
              }}
              options={occupationList}
              value={
                personalInformation?.occupation
                  ? {
                      value: personalInformation?.occupation,
                      label: personalInformation?.occupation,
                    }
                  : null
              }
              onChange={(value: any) =>
                personalInformationSet({
                  ...personalInformation,
                  occupation: value.value,
                })
              }
              placeholder={
                content?.personalInformation?.occupation?.placeholder
              }
            />
          </label>
          {/* Company Name */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.companyName?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <input
              type="text"
              placeholder={
                content?.personalInformation?.companyName?.placeholder
              }
              className="input input-bordered w-full "
              value={personalInformation?.company_name || ""}
              onChange={onChangePersonalInformation("company_name")}
            />
          </label>
          {/* Company website */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.companyWebsite?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            {/* <input
              type="text"
              placeholder="https://example.com"
              className="input input-bordered w-full "
              value={personalInformation?.company_website || ""}
              onChange={onChangePersonalInformation("company_website")}
            /> */}
            <label
              className="input input-bordered flex items-center gap-2"
              dir="ltr"
            >
              https://
              <input
                type="text"
                className="grow"
                placeholder="www.example.com"
                value={
                  personalInformation?.company_website?.replace(
                    "https://",
                    ""
                  ) || ""
                }
                onChange={onChangePersonalInformation("company_website")}
              />
            </label>
          </label>

          {/* office number */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.officeNumber?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <input
              type="text"
              placeholder={
                content?.personalInformation?.officeNumber?.placeholder
              }
              className="input input-bordered w-full "
              value={personalInformation?.office_number || ""}
              onChange={onChangePersonalInformation("office_number")}
            />
          </label>

          {/* business number */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.businessNumber?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <input
              type="text"
              placeholder={
                content?.personalInformation?.businessNumber?.placeholder
              }
              className="input input-bordered w-full "
              value={personalInformation?.business_number || ""}
              onChange={onChangePersonalInformation("business_number")}
            />
          </label>

          {/* business sector */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.businessSector?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <Select
              classNames={{
                control: () => " rounded-2xl px-2 py-1",
              }}
              options={businessSectorList}
              value={
                personalInformation?.business_sector
                  ? {
                      value: personalInformation?.business_sector,
                      label: personalInformation?.business_sector,
                    }
                  : null
              }
              onChange={(value: any) =>
                personalInformationSet({
                  ...personalInformation,
                  business_sector: value.value,
                })
              }
              components={{ Input: SelectInput }}
              placeholder={
                content?.personalInformation?.businessSector?.placeholder
              }
            />
          </label>

          {/* last departure date from Oman */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.lastDeparture?.label}
              </span>
            </div>
            <input
              type="date"
              placeholder={
                content?.personalInformation?.lastDeparture?.placeholder
              }
              className="input input-bordered w-full "
              value={personalInformation?.last_departure_date_from_oman || ""}
              onChange={onChangePersonalInformation(
                "last_departure_date_from_oman"
              )}
            />
          </label>

          {/* Citizenship/s */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.citizenship?.label}
                <span className="text-error ml-1">*</span>{" "}
                <span className="label-text-alt text-gray-500">
                  {content?.personalInformation?.citizenship?.info}
                </span>
              </span>
            </div>
            <Select
              isMulti
              classNames={{
                control: () => " rounded-2xl px-2 py-1",
              }}
              options={list}
              placeholder={
                content?.personalInformation?.citizenship?.placeholder
              }
            />
          </label>

          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.countryOfResidence?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <Select
              isMulti
              classNames={{
                control: () => " rounded-2xl px-2 py-1",
              }}
              options={list}
              placeholder={
                content?.personalInformation?.countryOfResidence?.placeholder
              }
            />
          </label>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
          {/* Home Address */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.homeAddress?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <textarea
              id="homeAddress"
              name="address"
              className="input input-bordered w-full h-20"
              value={personalInformation?.home_address || ""}
              onChange={onChangePersonalInformation("home_address")}
              placeholder={
                content?.personalInformation?.homeAddress?.placeholder
              }
            />
            <div className="label">
              <span className="label-text-alt">
                {content?.personalInformation?.homeAddress?.subText}
              </span>
            </div>
          </label>
          {/* Work Address */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">
                {content?.personalInformation?.workAddress?.label}
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <textarea
              id="workAddress"
              name="address"
              className="input input-bordered w-full h-20"
              value={personalInformation?.work_address || ""}
              onChange={onChangePersonalInformation("work_address")}
              placeholder={
                content?.personalInformation?.workAddress?.placeholder
              }
            />
            <div className="label">
              <span className="label-text-alt">
                {content?.personalInformation?.workAddress?.subText}
              </span>
            </div>
          </label>
        </div>
        <div className="flex justify-between mt-8">
          <button
            className="btn btn-primary btn-outline"
            onClick={() => stageSet(0)}
          >
            {lang === "ar" ? <ArrowForward /> : <ArrowBack />}
            {content?.button?.back}
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            // onClick={() => stageSet(1)}
          >
            {content?.button?.next}
            {lang === "ar" ? <ArrowBack /> : <ArrowForward />}
          </button>
        </div>
      </form>
    </div>
  );
}
