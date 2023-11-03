import "react-phone-input-2/lib/style.css";
import Head from "next/head";
import Link from "next/link";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { isEmpty, pick } from "lodash";
import {
  AlphaInput,
  NumberInput,
  NumberInputNew,
  preventMax,
  validationRules,
} from "../utils/constants";
import apiPath from "../utils/apiPath";
import { apiGet, apiPost } from "../utils/apiFetch";
import ErrorMessage from "./components/ErrorMessage";
import useToastContext from "@/hooks/useToastContext";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-input-2";
import CropperModal from "./components/CropperModal";
import CustomImage from "./components/CustomImage";
import { preventMaxInput } from "@/utils/constants";
import GoogleLogin from "./components/GoogleLogin";
import FacebookLogin from "./components/FacebookLogin";
import pathObj from "@/utils/apiPath";

function Register() {
  const { t } = useTranslation();
  const notification = useToastContext();
  const router = useRouter();
  const [signupType, setSignupType] = useState("Customer");
  const [showPassword, setShowPassword] = useState(false);
  const [conPassToggle, setConPassTogle] = useState(false);
  const {
    setVerifyOtpData,
    verifyOtpData,
    direction,
    setUser,
    defaultCountry,
  } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState("");
  const [imageData, setImageData] = useState();
  const [masterData, setMasterData] = useState({});
  const inputRef = useRef(null);
  const inputRefAgent = useRef(null);
  const inputRefCompany = useRef(null);
  const [preview, setPreview] = useState(null);
  const [src, setSrc] = useState(null);
  const [imageName, setImageName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const imageRef = useRef(null);
  const [googleSignUpData, setGoogleSignUpData] = useState({});
  const [facebookSignUpData, setFacebookSignUpData] = useState({});

  useEffect(() => {
    if (!isEmpty(verifyOtpData)) {
      if (verifyOtpData.type == "company") {
        setSignupType("Company");
        setValueCompany("headOffice", verifyOtpData?.Obj?.headOffice);
        setValueCompany("isWhatsApp", verifyOtpData?.Obj?.isWhatsApp);
        setValueCompany("orn", verifyOtpData?.Obj?.orn);
        setValueCompany(
          "authorizationPersonName",
          verifyOtpData?.Obj?.authorizationPersonName
        );
        setValueCompany("password", verifyOtpData?.Obj?.password);
        setValueCompany("email", verifyOtpData?.Obj?.email);
        setValueCompany("name", verifyOtpData?.Obj?.name);
        setValueCompany(
          "mobile",
          verifyOtpData?.Obj?.countryCode + verifyOtpData?.Obj?.mobile
        );
        setValueCompany("confirmPassword", verifyOtpData?.Obj?.password);
        setPreview(verifyOtpData?.Obj?.logo);
        unregisterCompany("image");
      } else if (verifyOtpData?.type == "agent") {
        setSignupType("Agent");
        setValueAgent("firstName", verifyOtpData?.Obj?.firstName);
        setValueAgent("isWhatsApp", verifyOtpData?.Obj?.isWhatsApp);
        setValueAgent("lastName", verifyOtpData?.Obj?.lastName);
        setValueAgent("password", verifyOtpData?.Obj?.password);
        setValueAgent("email", verifyOtpData?.Obj?.email);
        setValueAgent("brn", verifyOtpData?.Obj?.brn);
        setValueAgent("designation", verifyOtpData?.Obj?.designation);
        setValueAgent("company", verifyOtpData?.Obj?.company);
        setValueAgent("language", verifyOtpData?.Obj?.language);
        setValueAgent("nationality", verifyOtpData?.Obj?.nationality);
        setValueAgent(
          "mobile",
          verifyOtpData?.Obj?.countryCode + verifyOtpData?.Obj?.mobile
        );
        setValueAgent("confirmPassword", verifyOtpData?.Obj?.password);
        setPreview(verifyOtpData?.Obj?.logo);
        unregisterAgent("image");
      } else if (verifyOtpData?.type == "customer") {
        setSignupType("Customer");
        setValue("firstName", verifyOtpData?.Obj?.firstName);
        setValue("isWhatsApp", verifyOtpData?.Obj?.isWhatsApp);
        setValue("lastName", verifyOtpData?.Obj?.lastName);
        setValue("password", verifyOtpData?.Obj?.password);
        setValue("confirmPassword", verifyOtpData?.Obj?.password);
        setValue("email", verifyOtpData?.Obj?.email);
        setValue("mobile", verifyOtpData?.countryCode + verifyOtpData?.mobile);
      }
    }
  }, [verifyOtpData]);

  const handleImgChange = (e) => {
    const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2);
    if (fileSize > 2) {
      notification.error(t("PLEASE_SELECT_PHOTOS_BELOW_2_MB"));
    } else {
      setSrc(URL?.createObjectURL(e.target.files[0]));
      setModalOpen(true);
      setImageName(e.target.files[0]?.name);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    trigger,
    reset,
    clearErrors,
    setFocus,
    formState: { errors },
  } = useForm();

  const {
    register: registerAgent,
    handleSubmit: handleSubmitAgent,
    setValue: setValueAgent,
    control: controlAgent,
    watch: watchAgent,
    trigger: triggerAgent,
    unregister: unregisterAgent,
    reset: resetAgent,
    clearErrors: clearErrorAgent,
    setFocus: setFocusAgent,
    formState: { errors: errorsAgent },
  } = useForm();

  const {
    register: registerCompany,
    handleSubmit: handleSubmitCompany,
    setValue: setValueCompany,
    control: controlCompany,
    watch: watchCompany,
    unregister: unregisterCompany,
    trigger: triggerCompany,
    reset: resetCompany,
    clearErrors: clearErrorCompany,
    setFocus: setFocusCompany,
    formState: { errors: errorsCompany },
  } = useForm();

  const onSubmitCustomer = async (body) => {
    const obj = pick(body, [
      "firstName",
      "lastName",
      "email",
      "password",
      "isWhatsApp",
    ]);
    const { status, data } = await apiPost(apiPath.registerCustomer, {
      ...obj,
      countryCode: inputRef?.current?.state.selectedCountry?.countryCode,
      mobile: body?.mobile?.substring(
        inputRef?.current?.state.selectedCountry?.countryCode?.length,
        body?.mobile?.toString()?.length
      ),
    });
    if (status === 200) {
      if (data.success) {
        setVerifyOtpData({ ...data.results, type: "customer", Obj: obj });
        router.push("/otpVerify");
        notification.success(data?.message);
      } else {
        notification.error(data?.message);
      }
    } else {
      notification.error(data?.message);
    }
  };

  const onSubmitAgent = async (body) => {
    let obj = {
      firstName: body.firstName,
      lastName: body.lastName,
      isWhatsApp: body.isWhatsApp,
      brn: body.brn,
      company: body.company,
      designation: body.designation,
      nationality: body.nationality,
      password: body.password,
      email: body.email,
      name: body.name,
      countryCode: inputRefAgent?.current?.state.selectedCountry?.countryCode,
      mobile: body?.mobile?.substring(
        inputRefAgent?.current?.state.selectedCountry?.countryCode?.length,
        body?.mobile?.toString()?.length
      ),
      language: body?.language,
      logo: preview,
    };
    const formData = new FormData();
    formData.append("firstName", body.firstName);
    formData.append("lastName", body.lastName);
    formData.append("email", body.email);
    formData.append("password", body.password);
    formData.append("brn", body.brn);
    formData.append("company", body.company);
    formData.append("designation", body.designation);
    formData.append("nationality", body.nationality);
    formData.append(
      "language",
      body?.language
        ?.map((res) => {
          return res.label;
        })
        .join(", ")
    );
    formData.append("isWhatsApp", body.isWhatsApp);
    if (preview) {
      let response = await fetch(preview);
      let data = await response.blob();
      let metadata = {
        type: "image/jpeg",
      };
      let file = new File([data], "test.jpg", metadata);
      formData.append("profilePic", file);
    }
    formData.append(
      "countryCode",
      inputRefAgent?.current?.state.selectedCountry?.countryCode
    );
    formData.append(
      "mobile",
      body?.mobile?.substring(
        inputRefAgent?.current?.state.selectedCountry?.countryCode?.length,
        body?.mobile?.toString()?.length
      )
    );
    const { status, data } = await apiPost(apiPath.registerAgent, formData);
    if (status === 200) {
      if (data.success) {
        if (isEmpty(data?.results)) {
          router.push("/login");
          notification.success(data?.message);
        } else {
          setVerifyOtpData({ ...data.results, type: "agent", Obj: obj });
          router.push("/otpVerify");
          notification.success(data?.message);
        }
      } else {
        notification.error(data?.message);
      }
    } else {
      notification.error(data?.message);
    }
  };

  const onSubmitCompany = async (body) => {
    let obj = {
      headOffice: body.headOffice,
      isWhatsApp: body.isWhatsApp,
      orn: body.orn,
      authorizationPersonName: body.authorizationPersonName,
      password: body.password,
      email: body.email,
      name: body.name,
      countryCode: inputRefCompany?.current?.state.selectedCountry?.countryCode,
      mobile: body?.mobile?.substring(
        inputRefCompany?.current?.state.selectedCountry?.countryCode?.length,
        body?.mobile?.toString()?.length
      ),
      logo: preview,
    };
    const formData = new FormData();
    formData.append("name", body.name);
    formData.append("email", body.email);
    formData.append("password", body.password);
    formData.append("authorizationPersonName", body.authorizationPersonName);
    formData.append("orn", body.orn);
    formData.append("headOffice", body.headOffice);
    formData.append("isWhatsApp", body.isWhatsApp);
    if (preview) {
      let response = await fetch(preview);
      let data = await response.blob();
      let metadata = {
        type: "image/jpeg",
      };
      let file = new File([data], "test.jpg", metadata);
      formData.append("logo", file);
    }
    formData.append(
      "countryCode",
      inputRefCompany?.current?.state.selectedCountry?.countryCode
    );
    formData.append(
      "mobile",
      body?.mobile?.substring(
        inputRefCompany?.current?.state.selectedCountry?.countryCode?.length,
        body?.mobile?.toString()?.length
      )
    );
    const { status, data } = await apiPost(apiPath.registerCompany, formData);
    if (status === 200) {
      if (data.success) {
        if (isEmpty(data?.results)) {
          router.push("/login");
          notification.success(data?.message);
        } else {
          setVerifyOtpData({ ...data.results, Obj: obj, type: "company" });
          router.push("/otpVerify");
          notification.success(data?.message);
        }
      } else {
        notification.error(data?.message);
      }
    } else {
      notification.error(data?.message);
    }
  };

  const resetPassword = () => {
    setShowPassword(false);
    setConPassTogle(false);
    setImageUrl("");
    setImageData("");
    reset();
    resetAgent();
    resetCompany();
  };

  const handleFileUpload = (e) => {
    const getType = e?.target?.files[0]?.type?.split("/");
    const fileSize = (e?.target?.files[0]?.size / (1024 * 1024)).toFixed(2);
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
        // setModalOpen(true)
        unregisterCompany("image");
        unregisterAgent("image");
        setImageData(e.target.files[0]);
        setImageUrl(window.URL.createObjectURL(e.target.files[0]));
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
        if (!isEmpty(verifyOtpData)) {
          if (verifyOtpData?.type == "company") {
            setTimeout(() => {
              setValueCompany("headOffice", verifyOtpData?.Obj?.headOffice);
            }, 500);
          }
          if (verifyOtpData?.type == "agent") {
            setTimeout(() => {
              setValueAgent("nationality", verifyOtpData?.Obj?.nationality);
            }, 500);
          }
        }
      }
    }
  };

  const handleGoogleRegister = async (googleSignUpData) => {
    const payloadData = {
      name: googleSignUpData?.name,
      email: googleSignUpData?.email,
      // browser: browserName
    };
    const res = await apiPost(pathObj.googleIndividualSignUp, payloadData);
    if (res.data.success) {
      notification.success(res?.data?.message);
      // delete res?.data?.results?.subscriptionDetail
      res?.data?.success && setUser(res?.data?.results);
      localStorage.setItem("token", res?.data?.results?.token);
      localStorage.setItem("refreshToken", res?.data?.results?.refresh_token);
      router.push(`/`);
      // handleClose()
    } else {
      notification.error(res?.data?.message);
    }
  };

  const handleFacebookRegister = async (facebookSignUpData) => {
    const payloadData = {
      name: facebookSignUpData?.name,
      email: facebookSignUpData?.email,
      // browser: browserName
    };
    const res = await apiPost(pathObj.googleIndividualSignUp, payloadData);
    if (res.data.success) {
      notification.success(res?.data?.message);
      // delete res?.data?.results?.subscriptionDetail
      res?.data?.success && setUser(res?.data?.results);
      localStorage.setItem("token", res?.data?.results?.token);
      localStorage.setItem("refreshToken", res?.data?.results?.refresh_token);
      router.push(`/`);
      // handleClose()
    } else {
      notification.error(res?.data?.message);
    }
  };


  // useEffect(() => {
  //   if (signupType === 'Agent') {
  //     const firstError = Object.keys(errorsAgent).reduce((field, a) => {
  //       return !!errorsAgent[field] ? field : a;
  //     }, null);
  //     if (firstError) {
  //       setFocusAgent(firstError);
  //     }
  //   } else if (signupType === 'Company') {
  //     const firstError = Object.keys(errorsCompany).reduce((field, a) => {
  //       return !!errorsCompany[field] ? field : a;
  //     }, null);

  //     if (firstError) {
  //       setFocusCompany(firstError);
  //     }
  //   } else {
  //     const firstError = Object.keys(errors).reduce((field, a) => {
  //       return !!errors[field] ? field : a;
  //     }, null);
  //     if (firstError) {
  //       setFocus('mobile');
  //     }
  //   }
  // }, [errors,errorsAgent,errorsCompany,setFocusAgent,setFocusCompany, setFocus]);

  useEffect(() => {
    if (!isEmpty(facebookSignUpData)) {
      handleFacebookRegister(facebookSignUpData);
    }
  }, [facebookSignUpData]);

  useEffect(() => {
    if (!isEmpty(googleSignUpData)) {
      handleGoogleRegister(googleSignUpData);
    }
  }, [googleSignUpData]);

  useEffect(() => {
    getMasterData();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isEmpty(watch("confirmPassword"))) {
      if (watch("password")) {
        trigger("confirmPassword");
      }
    }
  }, [watch("password")]);

  useEffect(() => {
    if (!isEmpty(watchAgent("confirmPassword"))) {
      if (watchAgent("password")) {
        triggerAgent("confirmPassword");
      }
    }
  }, [watchAgent("password")]);

  useEffect(() => {
    if (!isEmpty(watchCompany("confirmPassword"))) {
      if (watchCompany("password")) {
        triggerCompany("confirmPassword");
      }
    }
  }, [watchCompany("password")]);

  useEffect(() => {
    if (watch("company") !== "") {
      unregisterAgent("company", { keepValue: true });
    }
  }, [watch("company")]);

  useEffect(() => {
    if (preview) {
      setValueCompany("image", imageName);
      setValueAgent("image", imageName);
      clearErrorCompany("image");
      clearErrorAgent("image");
    }
  }, [preview]);

  // useEffect(() => {
  // 	if(!isEmpty(router?.query?.type)){
  // 	  setSignupType(router?.query?.type)
  // 	}
  // 	},[router?.query])

  useEffect(() => {
    // if (isEmpty(verifyOtpData)) {
    // 	setPreview(null);
    // }
    setSrc(null);
    setImageName("");
    setModalOpen(false);
  }, [signupType]);

  const resetImage = (type) => {
    setPreview("");
    setSrc("");
    setImageName("Upload");
    if (type == "company") {
      registerCompany("image", {
        required: {
          value: true,
          message: "Please select company logo.",
        },
      });
    }
  };
  // console.log(inputRef?.current, 'inputRef')

  useEffect(() => {
    if (!isEmpty(router?.query?.type)) {
      setSignupType(router?.query?.type);
    }
  }, [router?.query]);

  return (
    <>
      <div className="login_outer">
        <Head>
          {/* {direction?.eventKey == "1" ? <link href="/css/bootstrap.min.css" rel="stylesheet"></link> : <link rel="stylesheet" href="/css/bootstrap.rtl.min.css"></link>} */}
          <title>
            {t("MADA_PROPERTIES")} : {t("REGISTER")}
          </title>
        </Head>
        <div className="leftSec register_section">
          <div className="wrap">
            <div className="mb-3 mb-md-4 mb-lg-5 text-center">
              <Link href="/" className="auth_logo">
                <CustomImage
                  width={228}
                  height={78}
                  src="/images/logo.svg"
                  alt="logo"
                />
              </Link>
            </div>
            <h2 className="mb-3 mb-md-4 mb-lg-5 fw-bold text-center text-dark">
              {t("SIGN_UP_TO_CONTINUE")}
            </h2>
            <div className="d-flex justify-content-between mb-4 tab_radio">
              <Form.Check
                checked={signupType === "Customer"}
                onChange={(e) => {
                  setSignupType("Customer");
                  window.scrollTo(0, 0);
                  resetPassword();
                }}
                type="radio"
                id="radio1"
                label={t("CUSTOMER")}
              />
              <Form.Check
                checked={signupType === "Agent"}
                onChange={(e) => {
                  setSignupType("Agent");
                  window.scrollTo(0, 0);
                  resetPassword();
                }}
                type="radio"
                id="radio2"
                label={t("AGENT")}
              />
              <Form.Check
                checked={signupType === "Company"}
                onChange={(e) => {
                  setSignupType("Company");
                  window.scrollTo(0, 0);
                  resetPassword();
                }}
                type="radio"
                id="radio3"
                label={t("COMPANY")}
              />
            </div>
            {signupType === "Customer" && (
              <div className="customer">
                <Form
                  className="container-fluid"
                  onSubmit={handleSubmit(onSubmitCustomer)}
                >
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("FIRST_NAME")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          // maxLength={15}
                          placeholder={t("FIRST_NAME")}
                          // onInput={(e) => preventMaxInput(e)}
                          {...register("firstName", {
                            required: {
                              value: true,
                              message: t("PLEASE_ENTER_FIRST_NAME"),
                            },
                            minLength: {
                              value: 2,
                              message: t("MINIMUM_LENGTH"),
                            },
                            // maxLength: {
                            // 	value: 15,
                            // 	message: t("MAXIMUM_LENGTH_MUST_BE_15"),
                            // }
                          })}
                          onChange={(e) =>
                            setValue("firstName", e.target.value?.trim(), {
                              shouldValidate: true,
                            })
                          }
                          onKeyPress={AlphaInput}
                        />
                        <ErrorMessage message={errors?.firstName?.message} />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("LAST_NAME")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          // maxLength={15}
                          placeholder={t("LAST_NAME")}
                          // onInput={(e) => preventMaxInput(e)}
                          {...register("lastName", {
                            required: {
                              value: true,
                              message: t("PLEASE_ENTER_LAST_NAME"),
                            },
                            minLength: {
                              value: 2,
                              message: t("MINIMUM_LENGTH"),
                            },
                            // maxLength: {
                            // 	value: 15,
                            // 	message: t("MAXIMUM_LENGTH_MUST_BE_15"),
                            // }
                          })}
                          onChange={(e) =>
                            setValue("lastName", e.target.value, {
                              shouldValidate: true,
                            })
                          }
                          onKeyPress={AlphaInput}
                        />
                        <ErrorMessage message={errors?.lastName?.message} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("MOBILE_NUMBER")}
                          <span className="text-danger">*</span>
                        </Form.Label>
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
                              if (
                                !inputValue.split("").some((res) => res > 0) &&
                                inputValue?.length >= 8
                              ) {
                                return "Please enter valid number.";
                              }
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
                              country={defaultCountry}
                              enableSearch
                              countryCodeEditable={false}
                            />
                          )}
                        />
                        <ErrorMessage message={errors?.mobile?.message} />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>
                          {t("EMAIL_ADDRESS")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
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
                  </Row>
                  <Row className="pwd">
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("PASSWORD")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={!showPassword ? "password" : "text"}
                            placeholder={t("ENTER_PASSWORD")}
                            maxLength={16}
                            minLength={8}
                            onInput={(e) => preventMaxInput(e)}
                            {...register("password", {
                              required: t("PLEASE_ENTER_PASSWORD"),
                              // validate: (value) => {
                              //   if (value === '') {
                              //     return true;
                              //   }
                              //   if (!!value.trim()) {
                              //     return true;
                              //   } else {
                              //     ('White spaces not allowed.');
                              //   }
                              // }

                              pattern: {
                                value: validationRules.password,
                                message: t("PASSWORD_MUST_CONTAIN"),
                              },
                              maxLength: {
                                value: 16,
                                message: t("MINIMUM_LENGTH_16"),
                              },
                            })}
                          />
                          <InputGroup.Text
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer" }}
                          >
                            {showPassword ? (
                              <img src="./images/hide.png" alt="image" />
                            ) : (
                              <img src="./images/eye.svg" alt="image" />
                            )}
                          </InputGroup.Text>
                        </InputGroup>
                        <ErrorMessage message={errors?.password?.message} />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("CONFIRM_PASSWORD")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            placeholder={t("ENTER_CONFIRM_PASSWORD")}
                            maxLength={16}
                            minLength={8}
                            onInput={(e) => preventMaxInput(e)}
                            type={!conPassToggle ? "password" : "text"}
                            {...register("confirmPassword", {
                              required: {
                                value: true,
                                message: t("PLEASE_ENTER_CONFIRM_PASSWORD"),
                              },
                              validate: (value) => {
                                if (value === "") {
                                  return true;
                                }
                                if (!isEmpty(watch("password"))) {
                                  if (value === watch("password")) {
                                    return true;
                                  } else {
                                    return t("PASSWORD_DOES_NOT_MATCH");
                                  }
                                }
                              },
                              // pattern: {
                              // 	value: validationRules.password,
                              // 	message: t("CONFIRM_PASSWORD_MUST_CONTAIN"),
                              // },
                              maxLength: {
                                value: 16,
                                message: t("MINIMUM_LENGTH_16"),
                              },
                            })}
                            onChange={(e) => {
                              setValue("confirmPassword", e.target.value, {
                                shouldValidate: true,
                              });
                            }}
                          />
                          <InputGroup.Text
                            onClick={() => setConPassTogle(!conPassToggle)}
                            style={{ cursor: "pointer" }}
                          >
                            {conPassToggle ? (
                              <img src="./images/hide.png" alt="image" />
                            ) : (
                              <img src="./images/eye.svg" alt="image" />
                            )}
                          </InputGroup.Text>
                        </InputGroup>
                        <ErrorMessage
                          message={errors?.confirmPassword?.message}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="term">
                    <Form.Check
                      type="checkbox"
                      id="checkbox2"
                      label={t("THIS_IS_MY_WHATSAPP_NUMBER")}
                      {...register("isWhatsApp")}
                    />
                    <div className="d-flex align-items-center">
                      <Form.Check
                        className="text-dark me-2"
                        // style={{ marginRight: '10px' }}
                        type="checkbox"
                        id="check3"
                        // label='I agree with the Terms & Condition's and Privacy Policy.'
                        {...register("terms", {
                          required: t("PLEASE_SELECT_TERMS_AND_CONDITIONS"),
                        })}
                      />
                      <div
                        className="text-dark"
                        style={{ fontSize: "14px" }}
                        href="javascript:void(0)"
                      >
                        {t("I_AGREE_WITH_THE")}{" "}
                        <a
                          target="_blank"
                          className="text-green"
                          href={"/termsandCondition"}
                        >
                          {t("TERMS_AND_CONDITION")}{" "}
                        </a>
                        {t("AND")}{" "}
                        <a
                          target="_blank"
                          className="text-green"
                          href={"/privacyPolicy"}
                        >
                          {t("PRIVACY_POLICY")}.
                        </a>
                      </div>
                      <label htmlFor="check3">
                        <span class="fa fa-check" />
                      </label>
                    </div>

                    <ErrorMessage message={errors?.terms?.message} />
                  </div>

                  <Button type="submit" className="w-100 d-block py-2 my-3">
                    {t("REGISTER")}
                  </Button>

                  <div className="divider position-relative text-center mb-3">
                    <span className="bg-white px-2 fw-medium fs-7 text-dark">
                      {t("OR")}
                    </span>
                  </div>

                  {/* <div className="social_login d-flex align-items-center mb-4 justify-content-center ">
										<button className="fb">
											<img src="images/fb.svg" className="me-2" alt="" />
											{t("FACEBOOK")}
										</button>
										<button className="google ms-2">
											<img src="images/google.svg" className="me-2" alt="" />
											{t("GOOGLE")}
										</button>
									</div> */}
                  <div className="social_login d-flex align-items-center mb-4 gap-2">
                    <FacebookLogin
                      setFacebookSignUpData={setFacebookSignUpData}
                      type={"signup"}
                    />
                    <GoogleLogin
                      setGoogleSignUpData={setGoogleSignUpData}
                      type={"signup"}
                    />
                  </div>
                  <p className="text-center">
                    {t("ALREADY_HAVE_AN_ACCOUNT")}{" "}
                    <Link
                      href={`/login?type=${signupType}`}
                      className="link fw-medium"
                    >
                      {t("SIGN_IN")}
                    </Link>
                  </p>
                </Form>
              </div>
            )}
            {signupType == "Agent" && (
              <div className="agent">
                <Form
                  className="container-fluid"
                  onSubmit={handleSubmitAgent(onSubmitAgent)}
                >
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("FIRST_NAME")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          maxLength={15}
                          placeholder={t("FIRST_NAME")}
                          onInput={(e) => preventMaxInput(e)}
                          {...registerAgent("firstName", {
                            required: {
                              value: true,
                              message: t("PLEASE_ENTER_FIRST_NAME"),
                            },
                            minLength: {
                              value: 2,
                              message: t("MINIMUM_LENGTH"),
                            },
                            maxLength: {
                              value: 15,
                              message: t("MAXIMUM_LENGTH_MUST_BE_15"),
                            },
                            // validate: (value) => {
                            //   if (value === '') {
                            //     return true;
                            //   }
                            //   if (!!value.trim()) {
                            //     return true;
                            //   } else {
                            //     ('White spaces not allowed.');
                            //   }
                            // }
                          })}
                          onChange={(e) =>
                            setValueAgent("firstName", e.target.value, {
                              shouldValidate: true,
                            })
                          }
                          onKeyPress={AlphaInput}
                        />
                        <ErrorMessage
                          message={errorsAgent?.firstName?.message}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("LAST_NAME")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          maxLength={15}
                          placeholder={t("LAST_NAME")}
                          onInput={(e) => preventMaxInput(e)}
                          {...registerAgent("lastName", {
                            required: {
                              value: true,
                              message: t("PLEASE_ENTER_LAST_NAME"),
                            },
                            minLength: {
                              value: 2,
                              message: t("MINIMUM_LENGTH"),
                            },
                            maxLength: {
                              value: 15,
                              message: t("MAXIMUM_LENGTH_MUST_BE_15"),
                            },
                            // validate: (value) => {
                            //   if (value === '') {
                            //     return true;
                            //   }
                            //   if (!!value.trim()) {
                            //     return true;
                            //   } else {
                            //     ('White spaces not allowed.');
                            //   }
                            // }
                          })}
                          onChange={(e) =>
                            setValueAgent("lastName", e.target.value, {
                              shouldValidate: true,
                            })
                          }
                          onKeyPress={AlphaInput}
                        />
                        <ErrorMessage
                          message={errorsAgent?.lastName?.message}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("MOBILE_NUMBER")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Controller
                          control={controlAgent}
                          name="mobile"
                          rules={{
                            required: t("PLEASE_ENTER_MOBILE_NUMBER"),
                            // minLength: {
                            // 	value: 8,
                            // 	message: 'Mobile number should contain at least 8 digits.',
                            // },

                            // pattern: {
                            // 	value: /^[0-9\b]+$/i,
                            // 	message: 'Mobile number format is invalid.',
                            // },
                            validate: (value) => {
                              let inputValue = value
                                ?.toString()
                                ?.slice(
                                  inputRefAgent?.current?.state?.selectedCountry
                                    ?.countryCode?.length,
                                  value?.length
                                );
                              if (
                                !inputValue.split("").some((res) => res > 0) &&
                                inputValue?.length >= 8
                              ) {
                                return "Please enter valid number.";
                              }
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
                              inputExtraProps={{
                                ref,
                                required: true,
                                autoFocus: true,
                              }}
                              ref={inputRefAgent}
                              inputStyle={{
                                width: "100%",
                                height: "48px",
                              }}
                              style={{ borderRadius: "20px" }}
                              country={defaultCountry}
                              enableSearch={true}
                              countryCodeEditable={false}
                            />
                          )}
                        />
                        <ErrorMessage message={errorsAgent?.mobile?.message} />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>
                          {t("EMAIL_ADDRESS")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          id="email"
                          type="text"
                          placeholder={t("EMAIL_ADDRESS")}
                          onInput={(e) => preventMaxInput(e)}
                          {...registerAgent("email", {
                            required: t("PLEASE_ENTER_EMAIL"),
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: t("INVALID_EMAIL_ADDRESS"),
                            },
                          })}
                        />
                        <ErrorMessage message={errorsAgent?.email?.message} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="pwd">
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>
                          {t("PASSWORD")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={!showPassword ? "password" : "text"}
                            placeholder={t("ENTER_PASSWORD")}
                            maxLength={16}
                            minLength={8}
                            onInput={(e) => preventMaxInput(e)}
                            {...registerAgent("password", {
                              required: t("PLEASE_ENTER_PASSWORD"),
                              validate: (value) => {
                                if (value === "") {
                                  return true;
                                }
                                if (!!value.trim()) {
                                  return true;
                                } else {
                                  ("White spaces not allowed.");
                                }
                              },
                              pattern: {
                                value: validationRules.password,
                                message: t("PASSWORD_MUST_CONTAIN"),
                              },
                            })}
                          />
                          <InputGroup.Text
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer" }}
                          >
                            {showPassword ? (
                              <img src="./images/hide.png" alt="image" />
                            ) : (
                              <img src="./images/eye.svg" alt="image" />
                            )}
                          </InputGroup.Text>
                        </InputGroup>
                        <ErrorMessage
                          message={errorsAgent?.password?.message}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>
                          {t("CONFIRM_PASSWORD")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            placeholder={t("ENTER_CONFIRM_PASSWORD")}
                            onInput={(e) => preventMaxInput(e)}
                            maxLength={16}
                            minLength={8}
                            type={!conPassToggle ? "password" : "text"}
                            {...registerAgent("confirmPassword", {
                              required: {
                                value: true,
                                message: t("PLEASE_ENTER_CONFIRM_PASSWORD"),
                              },
                              validate: (value) => {
                                if (value === "") {
                                  return true;
                                }
                                if (!isEmpty(watchAgent("password"))) {
                                  if (value === watchAgent("password")) {
                                    return true;
                                  } else {
                                    return t("PASSWORD_DOES_NOT_MATCH");
                                  }
                                }
                              },
                              // pattern: {
                              // 	value: validationRules.password,
                              // 	message: t("PASSWORD_MUST_CONTAIN"),
                              // },
                            })}
                            onChange={(e) => {
                              setValueAgent("confirmPassword", e.target.value, {
                                shouldValidate: true,
                              });
                            }}
                          />
                          <InputGroup.Text
                            onClick={() => setConPassTogle(!conPassToggle)}
                            style={{ cursor: "pointer" }}
                          >
                            {conPassToggle ? (
                              <img src="./images/hide.png" alt="image" />
                            ) : (
                              <img src="./images/eye.svg" alt="image" />
                            )}
                          </InputGroup.Text>
                        </InputGroup>
                        <ErrorMessage
                          message={errorsAgent?.confirmPassword?.message}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3 fileInput" controlId="">
                        <Form.Label>
                          {t("PROFILE_PICTURE")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="position-relative">
                          {/* <InputGroup>
                            <Form.Control
                              type='text'
                              className='border-end-0'
                              name='image'
                              placeholder={imageData?.name || 'Upload'}
                              onChange={(e) => {
                                handleFileUpload(e)
                              }}
                              accept='image/png, image/jiffy, image/jpeg, image/jpg'
                              onClick={(e) => (e.target.value = null)}
                            />
                            <InputGroup.Text>
                              <img src='./images/upload.svg' alt='image' />
                            </InputGroup.Text>
                          </InputGroup>
                          <Form.Control
                            type='file'
                            className='position-absolute top-0 left-0 opacity-0'
                            placeholder={imageData?.name || 'Upload'}
                            {...registerAgent('image', {
                              required: true
                            })}
                            accept='image/png, image/jiffy, image/jpeg, image/jpg'
                            onChange={(e) => {
                              handleFileUpload(e)
                            }}
                            onClick={(e) => (e.target.value = null)}
                          /> */}

                          <InputGroup>
                            <Form.Control
                              type="text"
                              className="border-end-0"
                              name="image"
                              {...registerAgent("image", {
                                required: {
                                  value: preview ? false : true,
                                  message: t("PLEASE_SELECT_PROFILE_PICTURE"),
                                },
                              })}
                              accept="image/png, image/gif, image/jpeg"
                              placeholder={imageName || "Upload"}
                              onClick={(e) => (e.target.value = null)}
                              disabled
                            />

                            <InputGroup.Text>
                              <img src="./images/upload.svg" alt="image" />
                            </InputGroup.Text>
                          </InputGroup>

                          <input
                            type="file"
                            name="image"
                            accept="image/png, image/jiffy, image/jpeg, image/jpg"
                            ref={imageRef}
                            className="position-absolute top-0 left-0 opacity-0"
                            onChange={handleImgChange}
                            style={{ width: "100%", height: "100%" }}
                          />
                          <CropperModal
                            modalOpen={modalOpen}
                            src={src}
                            setPreview={setPreview}
                            setModalOpen={setModalOpen}
                            setImageName={setImageName}
                          />
                        </div>

                        {preview && (
                          <figure className="upload-img">
                            <img src={preview} alt="image" />
                          </figure>
                        )}
                        {errorsAgent?.image && (
                          <ErrorMessage
                            message={t("PLEASE_SELECT_PROFILE_PICTURE")}
                          />
                        )}
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>
                          {t("BRN")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          onInput={(e) => preventMax(e, 12)}
                          maxLength={12}
                          placeholder={t("ENTER_BRN")}
                          {...registerAgent("brn", {
                            required: {
                              value: true,
                              message: t("PLEASE_ENTER_BRN"),
                            },
                            minLength: {
                              value: 2,
                              message: t("MINIMUM_LENGTH"),
                            },
                            maxLength: {
                              value: 12,
                              message: t("MAXIMUM_LENGTH_MUST_BE_12"),
                            },
                            // validate: (value) => {
                            //   if (value === '') {
                            //     return true;
                            //   }
                            //   if (!!value.trim()) {
                            //     return true;
                            //   } else {
                            //     ('White spaces not allowed.');
                            //   }
                            // }
                          })}
                          onKeyDown={NumberInputNew}
                        />
                        <ErrorMessage message={errorsAgent?.brn?.message} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("SELECT_LANGUAGE")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        {/* <Form.Select
                          aria-label='Default select example'
                          {...registerAgent('language', {
                            required: 'Please select language.'
                          })}
                        >
                          <option value=''>Select Language</option>
                          {masterData?.language?.length > 0 &&
                            masterData?.language?.map((res, index) => {
                              return (
                                <option key={index} value={res.name}>
                                  {res.name}
                                </option>
                              )
                            })}
                        </Form.Select> */}
                        <Controller
                          control={controlAgent}
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
                        <ErrorMessage
                          message={errorsAgent?.language?.message}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("NATIONALITY")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          {...registerAgent("nationality", {
                            required: {
                              value: true,
                              message: t("PLEASE_SELECT_NATIONALITY"),
                            },
                          })}
                        >
                          <option value="">{t("SELECT_NATIONALITY")}</option>
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
                          message={errorsAgent?.nationality?.message}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    {/* <Col sm={6}>
                      <Form.Group
                        className='mb-3'
                        controlId='formBasicPassword'
                      >
                        <Form.Label>
                          Company<span className='text-danger'>*</span>
                        </Form.Label>
                        <div>
                          <Form.Check
                            type='checkbox'
                            id='admin'
                            label='Mada Properties'
                            checked={watch('company') == 'admin' && true}
                            {...registerAgent('company', {
                              required: {
                                value: true,
                                message: 'Please select Company',
                              },
                            })}
                            onChange={(e) => {
                              setValue('company', e.target.id)
                            }}
                          />
                          <Form.Check
                            type='checkbox'
                            id='freelancer'
                            label='Freelancer'
                            checked={watch('company') == 'freelancer' && true}
                            {...registerAgent('company', {
                              required: {
                                value: true,
                                message: 'Please select Company',
                              },
                            })}
                            onChange={(e) => {
                              setValue('company', e.target.id)
                            }}
                          />
                        </div>
                        <ErrorMessage message={errorsAgent?.company?.message} />
                      </Form.Group>
                    </Col> */}
                    <Col sm={6}>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>
                          {t("COMPANY")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          {...registerAgent("company", {
                            required: t("PLEASE_SELECT_COMPANY"),
                          })}
                        >
                          <option value="">{t("SELECT_COMPANY")}</option>
                          <option value="admin">Mada Properties</option>
                          <option value="freelancer">Freelancer</option>
                        </Form.Select>
                        <ErrorMessage message={errorsAgent?.company?.message} />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>
                          {t("DESIGNATION")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          maxLength={30}
                          name="designation"
                          onInput={(e) => preventMaxInput(e)}
                          placeholder={t("YOUR_DESIGNATION")}
                          {...registerAgent("designation", {
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
                            // validate: (value) => {
                            //   if (value === '') {
                            //     return true;
                            //   }
                            //   if (!!value.trim()) {
                            //     return true;
                            //   } else {
                            //     ('White spaces not allowed.');
                            //   }
                            // }
                          })}
                          onKeyPress={AlphaInput}
                        />
                        <ErrorMessage
                          message={errorsAgent?.designation?.message}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="term">
                    <Form.Check
                      type="checkbox"
                      id="checkbox2"
                      label={t("THIS_IS_MY_WHATSAPP_NUMBER")}
                      {...registerAgent("isWhatsApp")}
                    />

                    {/* <Form.Check
                      className='text-dark'
                      type='checkbox'
                      id='checkbox1'
                      label='I agree with the Terms & Condition's and Privacy Policy.'
                      {...registerAgent('terms', {
                        required: 'Please select terms and condition's.',
                      })}
                    /> */}

                    <div className="d-flex align-items-center">
                      <Form.Check
                        className="text-dark"
                        style={{ marginRight: "10px" }}
                        type="checkbox"
                        id="check3"
                        // label='I agree with the Terms & Condition's and Privacy Policy.'
                        {...registerAgent("terms", {
                          required: t("PLEASE_SELECT_TERMS_AND_CONDITIONS"),
                        })}
                      />
                      <a
                        className="text-dark"
                        style={{ fontSize: "14px" }}
                        href="javascript:void(0)"
                      >
                        {t("I_AGREE_WITH_THE")}{" "}
                        <a
                          target="_blank"
                          className="text-green"
                          href={"/termsandCondition"}
                        >
                          {t("TERMS_AND_CONDITIONS")}
                        </a>{" "}
                        {t("AND")}{" "}
                        <a
                          target="_blank"
                          className="text-green"
                          href={"/privacyPolicy"}
                        >
                          {t("PRIVACY_POLICY")}.
                        </a>
                      </a>
                      <label htmlFor="check3">
                        <span class="fa fa-check" />
                      </label>
                    </div>

                    <ErrorMessage message={errorsAgent?.terms?.message} />
                  </div>
                  <Button type="submit" className="w-100 d-block py-2 my-3">
                    {t("REGISTER")}
                  </Button>

                  <div className="divider position-relative text-center mb-3">
                    <span className="bg-white px-2 fw-medium fs-7 text-dark">
                      {t("OR")}
                    </span>
                  </div>
                  <p className="text-center">
                    {t("ALREADY_HAVE_AN_ACCOUNT")}{" "}
                    <Link
                      href={`/login?type=${signupType}`}
                      className="link fw-medium"
                    >
                      {t("SIGN_IN")}
                    </Link>
                  </p>
                </Form>
              </div>
            )}
            {signupType === "Company" && (
              <div className="company">
                <Form
                  className="container-fluid"
                  onSubmit={handleSubmitCompany(onSubmitCompany)}
                >
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>
                      {t("COMPANY_NAME")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={50}
                      placeholder={t("COMPANY_NAME")}
                      onInput={(e) => preventMaxInput(e)}
                      {...registerCompany("name", {
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
                        // validate: (value) => {
                        //   if (value === '') {
                        //     return true;
                        //   }
                        //   if (!!value.trim()) {
                        //     return true;
                        //   } else {
                        //     ('White spaces not allowed.');
                        //   }
                        // }
                      })}
                    />
                    <ErrorMessage message={errorsCompany?.name?.message} />
                  </Form.Group>
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("COMPANY_EMAIL")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          id="email"
                          type="text"
                          placeholder={t("COMPANY_EMAIL_ADDRESS")}
                          onInput={(e) => preventMaxInput(e)}
                          {...registerCompany("email", {
                            required: t("PLEASE_ENTER_COMPANY_EMAIL_ADDRESS"),
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: t("INVALID_COMPANY_EMAIL_ADDRESS"),
                            },
                          })}
                        />
                        <ErrorMessage message={errorsCompany?.email?.message} />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("MOBILE_NUMBER")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Controller
                          control={controlCompany}
                          name="mobile"
                          rules={{
                            required: t("PLEASE_ENTER_MOBILE_NUMBER"),
                            validate: (value) => {
                              let inputValue = value
                                ?.toString()
                                ?.slice(
                                  inputRefCompany?.current?.state
                                    ?.selectedCountry?.countryCode?.length,
                                  value?.length
                                );
                              if (
                                !inputValue.split("").some((res) => res > 0) &&
                                inputValue?.length >= 8
                              ) {
                                return "Please enter valid number.";
                              }
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
                              inputExtraProps={{
                                ref,
                                required: true,
                                autoFocus: true,
                              }}
                              ref={inputRefCompany}
                              inputStyle={{
                                width: "100%",
                                height: "48px",
                              }}
                              style={{ borderRadius: "20px" }}
                              country={defaultCountry}
                              enableSearch
                              countryCodeEditable={false}
                            />
                          )}
                        />
                        <ErrorMessage
                          message={errorsCompany?.mobile?.message}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3 fileInput" controlId="">
                        <Form.Label>
                          {t("COMPANY_LOGO")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="position-relative">
                          <InputGroup>
                            <Form.Control
                              type="text"
                              className="border-end-0"
                              {...registerCompany("image", {
                                required: {
                                  value: preview ? false : true,
                                  message: t("PLEASE_SELECT_COMPANY_LOGO"),
                                },
                              })}
                              accept="image/png, image/gif, image/jpeg"
                              placeholder={imageName || t("UPLOAD")}
                              onClick={(e) => (e.target.value = null)}
                              disabled
                            />

                            <InputGroup.Text>
                              <img src="./images/upload.svg" alt="image" />
                            </InputGroup.Text>
                          </InputGroup>
                          <input
                            type="file"
                            name="image"
                            accept="image/png, image/jiffy, image/jpeg, image/jpg"
                            ref={imageRef}
                            className="position-absolute top-0 left-0 opacity-0"
                            onChange={handleImgChange}
                            style={{ width: "100%", height: "100%" }}
                          />
                          {modalOpen && (
                            <CropperModal
                              modalOpen={modalOpen}
                              src={src}
                              setPreview={setPreview}
                              setModalOpen={setModalOpen}
                              setImageName={setImageName}
                            />
                          )}

                          {/* <Form.Control
                            type='file'
                            className='position-absolute top-0 left-0 opacity-0'
                            placeholder={imageData?.name || 'Upload'}
                            {...registerCompany('image', {
                              required: true
                            })}
                            accept='image/png, image/jiffy, image/jpeg, image/jpg'
                            onChange={(e) => {
                              handleFileUpload(e)
                            }}
                            onClick={(e) => (e.target.value = null)}
                          /> */}
                        </div>
                        {preview && (
                          <div className="uploaded_photo position-relative uploaded_multi_img">
                            <figure className="upload-img">
                              <img
                                src={
                                  typeof preview === "object"
                                    ? URL.createObjectURL(preview)
                                    : preview
                                }
                                alt="image"
                              />
                            </figure>
                            <a
                              href="javascript:void(0)"
                              onClick={() => resetImage("company")}
                              className="photo_crose"
                            >
                              <img src="./images/photo-crose.svg" />
                            </a>
                          </div>
                        )}
                        {errorsCompany?.image && (
                          <ErrorMessage
                            message={errorsCompany?.image?.message}
                          />
                        )}
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("HEAD_OFFICE")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          {...registerCompany("headOffice", {
                            required: {
                              value: true,
                              message: t("PLEASE_SELECT_HEAD_OFFICE"),
                            },
                          })}
                        >
                          <option value="">Select Head Office</option>
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
                          message={errorsCompany?.headOffice?.message}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("ORN")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          onInput={(e) => preventMax(e, 20)}
                          maxLength={20}
                          placeholder={t("ENTER_ORN")}
                          {...registerCompany("orn", {
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
                            // validate: (value) => {
                            //   if (value === '') {
                            //     return true;
                            //   }
                            //   if (!!value.trim()) {
                            //     return true;
                            //   } else {
                            //     ('White spaces not allowed.');
                            //   }
                            // }
                          })}
                          onKeyDown={NumberInputNew}
                        />
                        <ErrorMessage message={errorsCompany?.orn?.message} />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("NAME_OF_PERSON")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          maxLength={30}
                          placeholder={t("AUTHORIZED_PERSON_NAME")}
                          onInput={(e) => preventMaxInput(e)}
                          {...registerCompany("authorizationPersonName", {
                            required: {
                              value: true,
                              message: t("PLEASE_ENTER_AUTHORIZED_PERSON_NAME"),
                            },
                            minLength: {
                              value: 2,
                              message: t("MINIMUM_LENGTH"),
                            },
                            maxLength: {
                              value: 30,
                              message: t("MINIMUM_LENGTH_30"),
                            },
                            // validate: (value) => {
                            //   if (value === '') {
                            //     return true;
                            //   }
                            //   if (!!value.trim()) {
                            //     return true;
                            //   } else {
                            //     ('White spaces not allowed.');
                            //   }
                            // }
                          })}
                        />
                        <ErrorMessage
                          message={
                            errorsCompany?.authorizationPersonName?.message
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="pwd">
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("PASSWORD")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={!showPassword ? "password" : "text"}
                            maxLength={16}
                            minLength={8}
                            placeholder={t("ENTER_PASSWORD")}
                            onInput={(e) => preventMaxInput(e)}
                            {...registerCompany("password", {
                              required: t("PLEASE_ENTER_PASSWORD"),
                              // validate: (value) => {
                              //   if (value === '') {
                              //     return true;
                              //   }
                              //   if (!!value.trim()) {
                              //     return true;
                              //   } else {
                              //     ('White spaces not allowed.');
                              //   }
                              // },
                              pattern: {
                                value: validationRules.password,
                                message: t("PASSWORD_MUST_CONTAIN"),
                              },
                              maxLength: {
                                value: 16,
                                message: t("MINIMUM_LENGTH_16"),
                              },
                            })}
                          />

                          <InputGroup.Text
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer" }}
                          >
                            {showPassword ? (
                              <img src="./images/hide.png" alt="image" />
                            ) : (
                              <img src="./images/eye.svg" alt="image" />
                            )}
                          </InputGroup.Text>
                        </InputGroup>
                        <ErrorMessage
                          message={errorsCompany?.password?.message}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3" controlId="">
                        <Form.Label>
                          {t("CONFIRM_PASSWORD")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            placeholder={t("ENTER_CONFIRM_PASSWORD")}
                            maxLength={16}
                            minLength={8}
                            onInput={(e) => preventMaxInput(e)}
                            type={!conPassToggle ? "password" : "text"}
                            {...registerCompany("confirmPassword", {
                              required: {
                                value: true,
                                message: t("PLEASE_ENTER_CONFIRM_PASSWORD"),
                              },
                              validate: (value) => {
                                if (value === "") {
                                  return true;
                                }
                                if (!isEmpty(watchCompany("password"))) {
                                  if (value === watchCompany("password")) {
                                    return true;
                                  } else {
                                    return t("PASSWORD_DOES_NOT_MATCH");
                                  }
                                }
                              },
                              // pattern: {
                              // 	value: validationRules.password,
                              // 	message: t("PASSWORD_MUST_CONTAIN"),
                              // },
                              maxLength: {
                                value: 16,
                                message: t("MINIMUM_LENGTH_16"),
                              },
                            })}
                            onChange={(e) => {
                              setValueCompany(
                                "confirmPassword",
                                e.target.value,
                                {
                                  shouldValidate: true,
                                }
                              );
                            }}
                          />
                          <InputGroup.Text
                            onClick={() => setConPassTogle(!conPassToggle)}
                            style={{ cursor: "pointer" }}
                          >
                            {conPassToggle ? (
                              <img src="./images/hide.png" alt="image" />
                            ) : (
                              <img src="./images/eye.svg" alt="image" />
                            )}
                          </InputGroup.Text>
                        </InputGroup>
                        <ErrorMessage
                          message={errorsCompany?.confirmPassword?.message}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="term">
                    <Form.Check
                      type="checkbox"
                      id="checkbox2"
                      label={t("THIS_IS_MY_WHATSAPP_NUMBER")}
                      {...registerCompany("isWhatsApp")}
                    />

                    <div className="d-flex align-items-center">
                      <Form.Check
                        className="text-dark"
                        style={{ marginRight: "10px" }}
                        type="checkbox"
                        id="check3"
                        // label='I agree with the Terms & Condition's and Privacy Policy.'
                        {...registerCompany("terms", {
                          required: t("PLEASE_SELECT_TERMS_AND_CONDITIONS"),
                        })}
                      />
                      <a
                        className="text-dark"
                        style={{ fontSize: "14px" }}
                        href="javascript:void(0)"
                      >
                        {t("I_AGREE_WITH_THE")}{" "}
                        <a
                          target="_blank"
                          className="text-green"
                          href={"/termsandCondition"}
                        >
                          {t("TERMS_AND_CONDITIONS")}
                        </a>{" "}
                        {t("AND")}{" "}
                        <a
                          target="_blank"
                          className="text-green"
                          href={"/privacyPolicy"}
                        >
                          {t("PRIVACY_POLICY")}.
                        </a>
                      </a>
                      <label htmlFor="check3">
                        <span class="fa fa-check" />
                      </label>
                    </div>
                    <ErrorMessage message={errorsCompany?.terms?.message} />
                  </div>
                  <Button type="submit" className="w-100 d-block py-2 my-3">
                    {t("REGISTER")}
                  </Button>
                  <div className="divider position-relative text-center mb-3">
                    <span className="bg-white px-2 fw-medium fs-7 text-dark">
                      {t("OR")}
                    </span>
                  </div>

                  <p className="text-center">
                    {t("ALREADY_HAVE_AN_ACCOUNT")}{" "}
                    <Link
                      href={`/login?type=${signupType}`}
                      className="link fw-medium"
                    >
                      {t("SIGN_IN")}
                    </Link>
                  </p>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
