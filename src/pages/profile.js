import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Container, Col, Row, Button } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import AuthContext from "@/context/AuthContext";
import { Controller, useForm } from "react-hook-form";
import { isEmpty } from "lodash";
import ErrorMessage from "./components/ErrorMessage";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useToastContext from "@/hooks/useToastContext";
import apiPath from "../utils/apiPath";
import { apiGet, apiPut } from "@/utils/apiFetch";
import ChangePassword from "./profileComponents/ChangePassword";
import { NumberInput, NumberInputNew, preventMax, sideBarObj, sideBarObjHeader } from "@/utils/constants";
import jwt_decode from "jwt-decode";
import SavedProperties from "./profileComponents/savedProperties";
import AuctionProperties from "./profileComponents/auctionProperties";
import Appointments from "./profileComponents/Appointments";
import PropertyApproval from "./profileComponents/propertyApproval";
import SubscriptionPlan from "./profileComponents/subscriptionPlan";
import Report from "./profileComponents/reports";
import CropperModal from "../pages/components/CropperModal";
import Select from "react-select";
import RedStar from "./components/common/RedStar";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { preventMaxInput } from "@/utils/constants";
import OTPDialogBox from "./components/OTPDialogBox";
import classNames from "classnames";
import VerifyMobile from "./components/VerifyMobile";

function Profile() {
  const { t } = useTranslation();
  const { user, logoutUser, setUser, setSidebar, sidebar, defaultCountry } = useContext(AuthContext);
  const inputRef = useRef(null);
  const notification = useToastContext();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [masterData, setMasterData] = useState({});
  const [imageData, setImageData] = useState("");
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const imageRef = useRef(null);
  const [open, setOpen] = useState(false)
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const [openVerify, setOpenVerify] = useState(false)
  useEffect(() => {
    if (router?.query?.type === "added") {
      setSidebar("propertyApproval");
    }
    if (router?.query?.type === "appointment") {
      setSidebar("appointments");
    }
  }, [router?.query?.type]);

  const handleInputClick = (e) => {
    e.preventDefault();
    imageRef.current.click();
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    unregister,
    formState: { errors },
  } = useForm();

  const onSubmit = async (body) => {
    if (user?.loginType == "social") {
      body.mobile = body?.mobile?.substring(
        inputRef?.current?.state.selectedCountry?.countryCode?.length,
        body?.mobile?.toString()?.length
      );
      body.countryCode = inputRef?.current?.state.selectedCountry?.countryCode;
    }
    const formDataUser = new FormData();
    if (user.role == "user") {
      formDataUser.append("firstName", body.firstName);
      formDataUser.append("lastName", body.lastName);
      formDataUser.append("email", body.email);
      if (user?.loginType === "social")
        formDataUser.append("mobile", body?.mobile);
      if (user?.loginType === "social")
        formDataUser.append("countryCode", body?.countryCode);
      if (preview) {
        let response = await fetch(preview);
        let data = await response.blob();
        let metadata = {
          type: "image/jpeg",
        };
        let file = new File([data], "test.jpg", metadata);
        formDataUser.append("profile_pic", file);
      }
    }

    let objAgent = {
      language: body?.language
        ?.map((res) => {
          return res?.label;
        })
        .join(", "),
      bio: body?.bio,
      designation: body?.designation,
      nationality: body?.nationality,
      email: body?.email,
      firstName: body?.firstName,
      lastName: body?.lastName,
    };

    const formData = new FormData();
    if (user?.role === "company") {
      formData.append("name", body.name);
      formData.append("email", body.email);
      formData.append("country", body.country);
      formData.append("authorizationPersonName", body.authorizationPersonName);
      formData.append("orn", body.orn);
      formData.append("headOffice", body.headOffice);
      formData.append("bio", body?.bio);
      if (preview) {
        let response = await fetch(preview);
        let data = await response.blob();
        let metadata = {
          type: "image/jpeg",
        };
        let file = new File([data], "test.jpg", metadata);
        formData.append("logo", file);
      } else if (imageData !== "") {
        formData.append("logo", imageData);
      }
      formData.append(
        "countryCode",
        inputRef?.current?.state.selectedCountry?.countryCode
      );
      formData.append(
        "mobile",
        body?.mobile?.substring(
          inputRef?.current?.state.selectedCountry?.countryCode?.length,
          body?.mobile?.toString()?.length
        )
      );
    }

    let api = "";
    if (user.role === "company") {
      api = apiPath.updateProfileCompany;
    } else if (user.role === "user") {
      api = apiPath.updateProfileCustomer;
    } else {
      api = apiPath.updateProfileAgent;
    }
    let ObjData = "";
    if (user.role === "company") {
      ObjData = formData;
    } else if (user.role === "user") {
      ObjData = formDataUser;
    } else {
      ObjData = objAgent;
    }
    const { status, data } = await apiPut(api, ObjData);
    if (status === 200) {
      if (data.success) {
        notification.success(data?.message);
        if (user?.role === 'company') {
          getProfileData()
        }
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        const token = data?.results?.token || null;
        const refreshToken = data?.results?.refresh_token || null;
        localStorage.setItem("token", token);
        localStorage.setItem("refresh_token", refreshToken);
        setUser(jwt_decode(token));
      } else {
        notification.error(data?.message);
      }
    } else {
      notification.error(data?.message);
    }
  };

  const handleFileUpload = (e) => {
    const getType = e.target.files[0].type.split("/");
    const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2);
    if (fileSize > 2) {
      notification.error(t("PLEASE_SELECT_PHOTOS_BELOW_2_MB"));
    } else {
      if (
        getType[1] !== undefined &&
        (getType[1] === "jpeg" ||
          getType[1] === "png" ||
          getType[1] === "jpg" ||
          getType[1] === "gif")
      ) {
        unregister("image");
        setModalOpen(true);
        setSrc(URL.createObjectURL(e.target.files[0]));
        setImageData(e.target.files[0]);
        setPreview(window.URL.createObjectURL(e.target.files[0]));
      } else {
        notification.error("Only jpeg,png,jpg,gif formats are allowed");
      }
    }
  };

  const getMasterData = async () => {
    const { status, data } = await apiGet(apiPath.masterData);
    if (status === 200) {
      if (data.success) {
        setMasterData({
          ...data.results,
          language: data?.results?.language?.map((res) => {
            return {
              value: res?.name,
              label: res?.name,
            };
          }),
        });
      }
    }
  };

  const handleCloseClick = () => {
    setSideBarOpen(!sideBarOpen)
  }

  const getProfileData = async () => {
    const { status, data } = await apiGet(apiPath.getCompanyProfile);
    if (status === 200) {
      if (data.success) {
        setValue('bio', data?.results?.bio)
      }
    }
  }

  useEffect(() => {
    getMasterData();
    if (user?.role === 'company') {
      getProfileData()
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(user)) {
      if (user?.role === "user" || user?.role === "agent") {
        setValue("firstName", user?.firstName);
        setValue("lastName", user?.lastName);
      }
      if (user?.role === "agent") {
        setImageUrl(user?.profilePic);
      } else if (user?.role === "company") {
        setImageUrl(user?.logo);
      } else {
        setImageUrl(user?.profile_pic);
      }
      setValue("email", user?.email);
      if (user?.loginType !== "social") {
        setValue(
          "mobile",
          (user?.country_code?.toString() || user?.countryCode?.toString()) +
          user?.mobile?.toString()
        );
      }
      if (user?.loginType == "social") {
        if (!isEmpty(user?.mobile)) {
          setValue(
            "mobile",
            (user?.country_code?.toString() || user?.countryCode?.toString()) +
            user?.mobile
          );
        }
      }
      if (user?.role === "agent") {
        setValue("designation", user?.designation);
        setValue("bio", user?.bio);
      }
      if (user?.role === "company") {
        setValue("headOffice", user?.headOffice);
        setValue("orn", user?.orn);
        setValue("name", user?.name);
        setValue("authorizationPersonName", user?.authorizationPersonName);
        setValue("bio", user?.bio);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!isEmpty(user)) {
      if (user?.role === "agent") {
        if (masterData?.language?.length > 0) {
          setValue(
            "language",
            user?.language?.split(",").map((res) => {
              res = res?.trim()
              if (!isEmpty(res)) {
                return {
                  label: res.trim(),
                  value: res.trim(),
                };
              }
            })
          );
        }
        if (masterData?.country?.length > 0) {
          setValue("nationality", user?.nationality);
        }
      }
      if (user?.role === "company") {
        if (masterData?.country?.length > 0) {
          setValue("headOffice", user.headOffice);
        }
      }
    }
  }, [masterData, user]);

  useEffect(() => {
    setSideBarOpen(false)
  }, [sidebar])

  return (
    <div className="main_wrap">
      <Head>
        <title>
          {t("MADA_PROPERTIES")} : {sideBarObjHeader[sidebar]}
        </title>
      </Head>
      <Container>
        <Row>
          <Col lg={3} md={4} className={classNames({ 'open_profile_sidebar': sideBarOpen })}>
            <button className="btn btn-primary fs-7 d-inline-block d-lg-none mb-2 profile_toggle" onClick={handleCloseClick} ><img src="../images/profiletoggle.png" /></button>
            <Sidebar
              sidebar={sidebar}
              setSidebar={setSidebar}
              user={user}
              logoutUser={logoutUser}
              handleCloseClick={handleCloseClick}
            />

          </Col>
          <Col lg={9} md={12}>
            <div className="bg-white p-3 p-md-4 pb-lg-5">
              <div className="profile_heading d-flex align-items-center">

                <h2>{sideBarObj[sidebar]}</h2>
              </div>
              {sidebar == "profile" && (
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <div className="profile_pic">
                    <div className="profile_img shadow mx-auto">
                      <img
                        src={preview || imageUrl}
                        alt="image"
                        style={{ height: "100%", width: "100%" }}
                      />
                      <a
                        href="#"
                        onClick={handleInputClick}
                        {...register("image", {
                          required: imageUrl ? false : true,
                        })}
                        className="position-relative camera green-bg"
                      >
                        <img src="./images/camera_profile.svg" alt="image" />
                      </a>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        accept="image/png, image/jiffy, image/jpeg, image/jpg"
                        ref={imageRef}
                        className="position-absolute"
                        onChange={(e) => handleFileUpload(e)}
                      />
                      <CropperModal
                        modalOpen={modalOpen}
                        src={src}
                        setPreview={setPreview}
                        setModalOpen={setModalOpen}
                      />
                    </div>
                  </div>
                  <Row>
                    {user?.role === "user" || user?.role === "agent" ? (
                      <>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="">
                            <Form.Label className="fs-7">
                              {t("FIRST_NAME")}
                              <RedStar />
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={t("FIRST_NAME")}
                              onInput={(e) => preventMaxInput(e)}
                              {...register("firstName", {
                                required: {
                                  value: true,
                                  message: t("PLEASE_ENTER_FIRST_NAME"),
                                },
                              })}
                              onChange={(e) =>
                                setValue("firstName", e.target.value, {
                                  shouldValidate: true,
                                })
                              }
                            />
                            <ErrorMessage
                              message={errors?.firstName?.message}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="">
                            <Form.Label className="fs-7">
                              {t("LAST_NAME")}
                              <RedStar />
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={t("LAST_NAME")}
                              onInput={(e) => preventMaxInput(e)}
                              {...register("lastName", {
                                required: {
                                  value: true,
                                  message: t("PLEASE_ENTER_LAST_NAME"),
                                },
                              })}
                              onChange={(e) =>
                                setValue("lastName", e.target.value, {
                                  shouldValidate: true,
                                })
                              }
                            />
                            <ErrorMessage message={errors?.lastName?.message} />
                          </Form.Group>
                        </Col>
                      </>
                    ) : null}
                    {user?.role == "company" && (
                      <>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="">
                            <Form.Label>
                              {t("COMPANY_NAME")}
                              <RedStar />
                            </Form.Label>
                            <Form.Control
                              type="text"
                              maxLength={50}
                              placeholder={t("COMPANY_NAME")}
                              onInput={(e) => preventMaxInput(e)}
                              {...register("name", {
                                required: {
                                  value: true,
                                  message: t("PLEASE_ENTER_COMPANY_NAME"),
                                },
                                minLength: {
                                  value: 2,
                                  message: t("MINIMUM_LENGTH"),
                                },
                                maxLength: {
                                  value: 50,
                                  message: t("MAXIMUM_LENGTH"),
                                },
                              })}
                            />
                            <ErrorMessage message={errors?.name?.message} />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3" controlId="">
                            <Form.Label>
                              {t("ORN")}
                              <RedStar />
                            </Form.Label>
                            <Form.Control
                              type="number"
                              onInput={(e) => preventMax(e, 20)}
                              placeholder={t("ENTER_ORN")}
                              {...register("orn", {
                                required: {
                                  value: true,
                                  message: t("PLEASE_ENTER_ORN"),
                                },
                                minLength: {
                                  value: 2,
                                  message: t("MINIMUM_LENGTH"),
                                },
                                maxLength: {
                                  value: 20,
                                  message: t("MINIMUM_LENGTH_20"),
                                },
                              })}
                              onKeyDown={NumberInputNew}
                            />
                            <ErrorMessage message={errors?.orn?.message} />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3" controlId="">
                            <Form.Label>
                              {t("AUTHORIZED_PERSON_NAME")}
                              <RedStar />
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={t("AUTHORIZED_PERSON_NAME")}
                              onInput={(e) => preventMaxInput(e)}
                              {...register("authorizationPersonName", {
                                required: {
                                  value: true,
                                  message: t(
                                    "PLEASE_ENTER_AUTHORIZED_PERSON_NAME"
                                  ),
                                },
                                minLength: {
                                  value: 2,
                                  message: t("MINIMUM_LENGTH"),
                                },
                                maxLength: {
                                  value: 30,
                                  message: t("MINIMUM_LENGTH_30"),
                                },
                              })}
                            />
                            <ErrorMessage
                              message={errors?.authorizationPersonName?.message}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              {t("HEAD_OFFICE")}
                              <RedStar />
                            </Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              {...register("headOffice", {
                                required: {
                                  value: true,
                                  message: t("PLEASE_SELECT_HEAD_OFFICE"),
                                },
                              })}
                            >
                              <option value="">
                                {t("SELECT_HEAD_OFFICE")}
                              </option>
                              {masterData?.country?.length > 0 &&
                                masterData?.country?.map((res, index) => {
                                  return (
                                    <option key={index} value={res.name}>
                                      {res.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                            <ErrorMessage
                              message={errors?.headOffice?.message}
                            />
                          </Form.Group>
                        </Col>
                      </>
                    )}
                    {user?.role === "agent" && (
                      <>
                        <Col sm={6}>
                          <Form.Group className="mb-3" controlId="">
                            <Form.Label>{t("BRN")}</Form.Label>
                            <Form.Control
                              type="number"
                              disabled={true}
                              value={user?.brn}
                              placeholder={t("ENTER_BRN")}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3" controlId="">
                            <Form.Label>{t("COMPANY")}</Form.Label>
                            <Form.Select
                              disabled={true}
                              defaultValue={user?.parentType === 'company' ? user?.company?.name : user?.parentType}
                              value={user?.parentType === 'company' ? user?.company?.name : user?.parentType}
                              aria-label="Default select example"
                            >
                              {user?.parentType === 'company' ? <option value={user?.company?.name}>{user?.company?.name}</option> : <> <option value="">{t("SELECT_COMPANY")}</option>
                                <option value="admin">
                                  {t("MADA_PROPERTIES")}
                                </option>
                                <option value="freelancer">
                                  {t("FREELANCER")}
                                </option> </>
                              }
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3" controlId="">
                            <Form.Label>
                              {t("DESIGNATION")}
                              <RedStar />
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="designation"
                              placeholder={t("YOUR_DESIGNATION")}
                              onInput={(e) => preventMaxInput(e)}
                              {...register("designation", {
                                required: {
                                  value: true,
                                  message: t("PLEASE_ENTER_DESIGNATION"),
                                },
                                minLength: {
                                  value: 2,
                                  message: t("MINIMUM_LENGTH"),
                                },
                                maxLength: {
                                  value: 30,
                                  message: t("MINIMUM_LENGTH_30"),
                                },
                              })}
                            />
                            <ErrorMessage
                              message={errors?.designation?.message}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3" controlId="">
                            <Form.Label>
                              {t("SELECT_LANGUAGE")}
                              <RedStar />
                            </Form.Label>
                            <Controller
                              control={control}
                              name="language"
                              rules={{
                                required: t("PLEASE_SELECT_LANGUAGE"),
                              }}
                              render={({ field: { ref, ...field } }) => (
                                <Select
                                  {...field}
                                  inputExtraProps={{
                                    ref,
                                    required: true,
                                    autoFocus: true,
                                  }}
                                  placeholder={t("PLEASE_SELECT_LANGUAGE")}
                                  options={masterData?.language}
                                  isMulti
                                />
                              )}
                            />
                            <ErrorMessage message={errors?.language?.message} />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3" controlId="">
                            <Form.Label>
                              {t("NATIONALITY")}
                              <RedStar />
                            </Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              {...register("nationality", {
                                required: {
                                  value: true,
                                  message: t("PLEASE_SELECT_NATIONALITY"),
                                },
                              })}
                            >
                              <option value="">
                                {t("SELECT_NATIONALITY")}
                              </option>
                              {masterData?.country?.length > 0 &&
                                masterData?.country?.map((res, index) => {
                                  return (
                                    <option key={index} value={res.name}>
                                      {res.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                            <ErrorMessage
                              message={errors?.nationality?.message}
                            />
                          </Form.Group>
                        </Col>
                      </>
                    )}
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="">
                        <div className="d-flex justify-content-between mb-2">
                          <Form.Label className="fs-7">
                            {t("MOBILE_NUMBER")}
                          </Form.Label>
                          {(user?.loginType == "social" && user?.is_mobile_verified == 0 && !isEmpty(user?.mobile)) ?
                            <Button onClick={() => setOpenVerify(true)} style={{
                              fontSize: "12px",
                              padding: "3px",
                            }}>{t("Verify")}</Button>
                            :
                            <span
                              className="text-green"
                              style={{
                                fontSize: "12px",
                                padding: "3px",
                                color: user?.is_mobile_verified == 0 && "red",
                              }}
                            >
                              {user?.is_mobile_verified == 1
                                ? t("VERIFIED")
                                : <span className="">{t("NOT_VERIFIED")}</span>
                              }
                            </span>}
                        </div>
                        <Controller
                          control={control}
                          name="mobile"
                          rules={{
                            required: t("PLEASE_ENTER_MOBILE_NUMBER"),
                            validate: (value) => {
                              let inputValue = value
                                ?.toString()
                                ?.slice(
                                  inputRef?.current?.state?.selectedCountry
                                    ?.countryCode?.length,
                                  value?.length
                                );
                              if (inputValue?.length < 8) {
                                return t(
                                  "MOBILE_NUMBER_MUST_CONTAIN_AT_LEAST_5_DIGITS"
                                );
                              } else if (inputValue?.length > 12) {
                                return t(
                                  "MOBILE_NUMBER_SHOULD_NOT_EXCEED_12_DIGITS"
                                );
                              } else {
                                return true;
                              }
                            },
                          }}
                          render={({ field: { ref, ...field } }) => (
                            <PhoneInput
                              {...field}
                              disabled={
                                user?.loginType !== "social" ? true : false
                              }
                              disableDropdown={
                                user?.role !== "company" &&
                                  true &&
                                  user?.loginType !== "social"
                                  ? true
                                  : false
                              }
                              inputExtraProps={{
                                ref,
                                required: true,
                                autoFocus: true,
                              }}
                              ref={inputRef}
                              inputStyle={{
                                width: "100%",
                                height: "48px",
                              }}
                              style={{ borderRadius: "20px" }}
                              country={!isEmpty(user?.mobile) ? "" : defaultCountry}
                              enableSearch
                              countryCodeEditable={false}
                            />
                          )}
                        />
                        <ErrorMessage message={errors?.mobile?.message} />
                      </Form.Group>
                    </Col>
                    {/* } */}
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="">
                        <div className="d-flex justify-content-between mb-2">
                          <Form.Label className="fs-7">
                            {t("EMAIL")}
                            <RedStar />
                          </Form.Label>
                          <span
                            className="text-green"
                            style={{
                              fontSize: "12px",
                              padding: "3px",
                              color: user?.is_email_verified == 0 && "red",
                            }}
                          >
                            {user?.is_email_verified == 1
                              ? t("VERIFIED")
                              : t("NOT_VERIFIED")}
                          </span>
                        </div>

                        <Form.Control
                          type="text"
                          disabled={user?.loginType == "social" ? true : false}
                          placeholder={t("ENTER_EMAIL")}
                          onInput={(e) => preventMaxInput(e)}
                          {...register("email", {
                            required: t("PLEASE_ENTER_EMAIL"),
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: t("INVALID_EMAIL_ADDRESS"),
                            },
                          })}
                        />
                        <ErrorMessage message={errors?.email?.message} />
                      </Form.Group>
                    </Col>
                    {(user?.role === "agent" || user?.role === "company") && (
                      <Col md={12}>
                        <Form.Group className="mb-3" controlId="">
                          <Form.Label>
                            {t("BIO")}
                            <RedStar />
                          </Form.Label>
                          <Form.Control
                            type="text"
                            as="textarea"
                            rows={5}
                            className="h-25"
                            placeholder={t("BIO")}
                            onInput={(e) => preventMaxInput(e)}
                            {...register("bio", {
                              required: {
                                value: true,
                                message: t("PLEASE_ENTER_BIO"),
                              },
                              minLength: {
                                value: 2,
                                message: t("MINIMUM_LENGTH"),
                              },
                            })}
                            onChange={(e) =>
                              setValue("bio", e.target.value, {
                                shouldValidate: true,
                              })
                            }
                          />
                          <ErrorMessage message={errors?.bio?.message} />
                        </Form.Group>
                      </Col>
                    )}
                    <Col>
                      <div className="social_achiv_left2 pt-3 mt-3 border-top">
                        <button
                          type="submit"
                          className="btn_link fw-medium bg-green text-white border-0 update_profile_btn"
                        >
                          {t("UPDATE_PROFILE")}
                        </button>
                        {user?.loginType === 'social' ? '' :
                          <button
                            onClick={() => setSidebar("changePassword")}
                            className="ms-2 link bg-transparent border-0 text-primary"
                          >
                            {t("CHANGE_PASSWORD")}
                          </button>}

                      </div>
                    </Col>
                  </Row>
                </Form>
              )}
              {sidebar === "changePassword" && <ChangePassword user={user} />}
              {sidebar === "savedProperties" && <SavedProperties user={user} />}
              {sidebar === "auction" && <AuctionProperties user={user} />}
              {sidebar === "appointments" && <Appointments user={user} />}
              {sidebar === "propertyApproval" && (
                <PropertyApproval user={user} />
              )}
              {sidebar === "subscriptionPlan" && <SubscriptionPlan />}
              {sidebar === "reports" && <Report user={user} />}
            </div>
          </Col>
        </Row>
      </Container>
      {open && <OTPDialogBox open={open} onHide={() => setOpen(false)} />}
      {openVerify && <VerifyMobile user={user} open={openVerify} onHide={() => setOpenVerify(false)} />}
    </div>
  );
}
export default Profile;
