import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "../components/ErrorMessage";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { apiGet, apiPost, apiPut } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import useToastContext from "@/hooks/useToastContext";
import { add, isEmpty } from "lodash";
import { NumberInput, NumberInputNew, preventMax } from "@/utils/constants";
import CropperModal from "../components/CropperModal";
import Select from "react-select";
import AuthContext from "@/context/AuthContext";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
const AddAgent = (props) => {
  let { agentObj, addOrEdit } = props;
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const { defaultCountry } = useContext(AuthContext)
  const notification = useToastContext();
  const [imageUrl, setImageUrl] = useState("");
  const [imageData, setImageData] = useState("");
  const [masterData, setMasterData] = useState({});
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const imageRef = useRef(null);
  const handleInputClick = (e) => {
    e.preventDefault();
    imageRef.current.click();
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    unregister,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    getMasterData();
  }, []);
  useEffect(() => {
    if (addOrEdit === "add") {
      setValue("status", true);
    }
    if (!isEmpty(agentObj) && addOrEdit == "edit") {
      setValue("status", agentObj.status == "inactive" ? false : true);
      setValue("firstName", agentObj?.firstName);
      setValue("lastName", agentObj?.lastName);
      setValue("email", agentObj?.email);
      setValue("nationality", agentObj?.nationality);
      setValue("language", agentObj?.language);
      setValue("brn", agentObj?.brn);
      setValue("designation", agentObj?.designation);
      setImageUrl(agentObj?.profilePic);
      setValue(
        "mobile",
        (agentObj?.country_code?.toString() ||
          agentObj?.countryCode?.toString()) + agentObj?.mobile?.toString()
      );
    }
  }, [props.agentObj]);

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

  useEffect(() => {
    if (!isEmpty(masterData) && addOrEdit === "edit") {
      setValue("nationality", agentObj?.nationality);
      setValue(
        "language",
        agentObj?.language?.split(",").map((res) => {
          return {
            label: res,
            value: res,
          };
        })
      );
    }
  }, [masterData]);

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
        setImageUrl(window.URL.createObjectURL(e.target.files[0]));
      } else {
        notification.error("Only jpeg, png, jpg, gif formats are allowed");
      }
    }
  };
  const onSubmit = async (body) => {
    let formData = new FormData();
    formData.append("firstName", body.firstName);
    formData.append("lastName", body.lastName);
    formData.append("email", body.email);
    formData.append("nationality", body.nationality);
    formData.append(
      "language",
      body?.language
        ?.map((res) => {
          return res.label;
        })
        .join(", ")
    );
    formData.append("brn", body.brn);
    formData.append("status", body?.status ? "active" : "inactive");
    formData.append("designation", body.designation);
    if (preview) {
      let response = await fetch(preview);
      let data = await response.blob();
      let metadata = {
        type: "image/jpeg",
      };
      let file = new File([data], "test.jpg", metadata);
      formData.append("profilePic", file);
    } else if (imageData !== "") {
      formData.append("profilePic", imageData);
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
    if (addOrEdit == "edit") {
      const { status, data } = await apiPut(
        `${apiPath.editAgentCompanies}/${agentObj._id}`,
        formData
      );
      if (status === 200) {
        if (data.success) {
          notification.success(data?.message);
          reset();
          setImageData("");
          setImageUrl("");
          props.onHide();
          props.getData(props.filter, "");
        } else {
          notification.error(data?.message);
        }
      }
    } else {
      const { status, data } = await apiPost(
        apiPath.addAgentCompanies,
        formData
      );
      if (status === 200) {
        if (data.success) {
          notification.success(data?.message);
          reset();
          setImageData("");
          setImageUrl("");
          props.onHide();
          props.getData();
        } else {
          notification.error(data?.message);
        }
      }
    }
  };
  const resetFunc = () => {
    reset();
    setImageData("");
    setImageUrl("");
  };

  useEffect(() => {
    if (preview) {
      setValue("image", preview);
      clearErrors("image");
    }
  }, [preview]);
  return (
    <div className="agent-modal">
      <Modal
        {...props}
        size="lg"
        onHide={() => {
          props?.onHide(false);
          props?.resetEdit();
          resetFunc();
        }}
        className="agent-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title className="text-center w-100">
            {addOrEdit == "edit" ? t("EDIT_AGENT") : t("ADD_AGENT")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="profile_pic">
              <div className="profile_img shadow mx-auto">
                <img
                  // src={preview || './images/agent1.jpg'}
                  src={
                    preview
                      ? preview
                      : imageUrl
                        ? imageUrl
                        : 'https://mada-properties-uat.octallabs.com/img/no_image.png'
                  }
                  alt="image"
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />

                {/* <a href='#' className='position-relative camera green-bg'>
                  <input
                    type='file'
                    className='position-absolute'
                    onChange={(e) => {
                      handleFileUpload(e)
                    }}
                    accept="image/png, image/jiffy, image/jpeg, image/jpg"
                    onClick={(e) => (e.target.value = null)}
                  />
                  <img src='./images/camera_profile.svg' alt='' />
                </a>
                {imageUrl == '' && imageData == '' && (
                  <input
                    type='file'
                    className='position-absolute opacity-0'
                    {...register('image', {
                      required: true,
                    })}
                    accept="image/png, image/jiffy, image/jpeg, image/jpg"
                    onClick={(e) => (e.target.value = null)}
                  />
                )} */}
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

              {errors?.image && (
                <div className="mt-3">
                  {" "}
                  <ErrorMessage message={t("PLEASE_SELECT_PROFILE_PIC")} />
                </div>
              )}
            </div>
            <div className="agent-main">
              <Row>
                {/* <Col md={12}>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter Agent Full Name'
                      {...register('name', {
                        required: {
                          value: true,
                          message: 'Please enter full name.',
                        },
                        validate: (value) => {
                          if (!!value.trim()) {
                            return true
                          } else {
                            return 'Please enter full name.'
                          }
                        },
                      })}
                      onChange={(e) =>
                        setValue('name', e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    />
                    <ErrorMessage message={errors?.name?.message} />
                  </Form.Group>
                </Col> */}
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{t("FIRST_NAME")}</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={20}
                      placeholder={t("FIRST_NAME")}
                      {...register("firstName", {
                        required: {
                          value: true,
                          message: t("PLEASE_ENTER_FIRST_NAME"),
                        },
                        minLength: {
                          value: 2,
                          message: t("MINIMUM_LENGTH"),
                        },
                        maxLength: {
                          value: 20,
                          message: t("MAXIMUM_LENGTH_20"),
                        }
                      })}
                      onChange={(e) =>
                        setValue("firstName", e.target.value?.trim(), {
                          shouldValidate: true,
                        })
                      }
                    />
                    <ErrorMessage message={errors?.firstName?.message} />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{t("LAST_NAME")}</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={20}
                      placeholder={t("LAST_NAME")}
                      {...register("lastName", {
                        required: {
                          value: true,
                          message: t("PLEASE_ENTER_LAST_NAME"),
                        },
                        minLength: {
                          value: 2,
                          message: t("MINIMUM_LENGTH"),
                        },
                        maxLength: {
                          value: 20,
                          message: t("MAXIMUM_LENGTH_20"),
                        }
                      })}
                      onChange={(e) =>
                        setValue("lastName", e.target.value?.trim(), {
                          shouldValidate: true,
                        })
                      }
                    />
                    <ErrorMessage message={errors?.lastName?.message} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="fs-7"> {t("MOBILE_NUMBER")}</Form.Label>
                    <Controller
                      control={control}
                      name="mobile"
                      rules={{
                        required: t("PLEASE_ENTER_MOBILE_NUMBER"),
                        validate: (value) => {
                          let inputValue = value?.toString()?.slice(inputRef?.current?.state?.selectedCountry?.countryCode?.length, value?.length);
                          if (!inputValue.split('').some((res) => res > 0) && inputValue?.length >= 8) {
                            return t("PLEASE_ENTER_VALID_NUMBER")
                          }
                          if (inputValue?.length < 8) {
                            return t("MOBILE_NUMBER_MUST_CONTAIN_AT_LEAST_5_DIGITS");
                          } else if (inputValue?.length > 12) {
                            return t("MOBILE_NUMBER_SHOULD_NOT_EXCEED_12_DIGITS");
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
                          disableDropdown={addOrEdit == "edit" && true}
                          disabled={addOrEdit == "edit" && true}
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
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="fs-7">{t("EMAIL")}</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={t("EMAIL_ADDRESS")}
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
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{t("BRN")}</Form.Label>
                    <Form.Control
                      type="number"
                      // onInput={(e) => preventMax(e, 12)}
                      // maxLength={12}
                      placeholder={t("ENTER_BRN")}
                      {...register("brn", {
                        required: {
                          value: false,
                          message: t("PLEASE_ENTER_BRN"),
                        },
                        // minLength: {
                        //   value: 2,
                        //   message: t("MINIMUM_LENGTH"),
                        // },
                        // maxLength: {
                        //   value: 12,
                        //   message: t("MAXIMUM_LENGTH_MUST_BE_12"),
                        // },
                      })}
                      onKeyDown={NumberInputNew}
                    />
                    <ErrorMessage message={errors?.brn?.message} />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{t("DESIGNATION")}</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={20}
                      name="designation"
                      placeholder={t("ENTER_DESIGNATION")}
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
                          value: 20,
                          message: t("MAXIMUM_LENGTH_20"),
                        },
                        // validate: (value) => {
                        //   if (value === "") {
                        //     return true;
                        //   }
                        //   if (!!value.trim()) {
                        //     return true;
                        //   } else {
                        //     ("White spaces not allowed.");
                        //   }
                        // }
                      })}
                    />
                    <ErrorMessage message={errors?.designation?.message} />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>{t("LANGUAGE")}</Form.Label>
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
                          placeholder={t("SELECT_LANGUAGE")}
                          options={masterData?.language}
                          isMulti
                        />
                      )}
                    />
                    <ErrorMessage message={errors?.language?.message} />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>{t("NATIONALITY")}</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      {...register("nationality", {
                        required: {
                          value: true,
                          message: t("PLEASE_SELECT_NATIONALITY"),
                        },
                      })}
                      placeholder={t("SELECT_NATIONALITY")}
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
                    <ErrorMessage message={errors?.nationality?.message} />
                  </Form.Group>
                </Col>
                <div className="social_achiv_left pt-3 mt-3 border-top">
                  <Row>
                    <Col sm={6} className="">
                      <div className="mb-1">{t("STATUS")}</div>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        {...register("status")}
                        label={watch("status") ? t("ACTIVE") : t("INACTIVE")}
                        className={
                          watch("status")
                            ? "position-relative switcher"
                            : "position-relative switcherRed"
                        }
                      />
                    </Col>
                    <Col sm={6} className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn_link fw-medium bg-green text-white border-0"
                      >
                        {addOrEdit == "edit" ? t("EDIT_AGENT") : t("ADD_AGENT")}
                      </button>
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default AddAgent;
