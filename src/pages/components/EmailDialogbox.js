import React, { useContext, useEffect, useRef, useState } from "react"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form"
import ErrorMessage from "../components/ErrorMessage"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { apiPost } from "@/utils/apiFetch"
import apiPath from "@/utils/apiPath"
import useToastContext from "@/hooks/useToastContext"
import AuthContext from "@/context/AuthContext"
import { isEmpty, isNumber } from "lodash"
import Helpers from "@/utils/helpers"
import { EnquiryTypeCompany } from "@/utils/constants"
import { useTranslation } from "react-i18next"
import CustomImage from "./CustomImage"

const EmailDialogbox = (props) => {
    const { t } = useTranslation()
    let { open, onHide, agentData, type, typeCheck } = props
    const inputRef = useRef(null);
    const { user, config, defaultCountry } = useContext(AuthContext)
    const notification = useToastContext()
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
    } = useForm()

    useEffect(() => {
        if (!isEmpty(user)) {
            setValue('mobile', (user?.country_code || user?.countryCode) + user?.mobile)
            setValue('name', user?.role === 'company' ? user?.name : user?.firstName + ' ' + user?.lastName)
            setValue('email', user?.email)
        }
    }, [user])

    useEffect(() => {
        if (type === 'property') {
            setValue('message', `Hi, I found your property with ref: ${agentData?.propertyId} on Mada Property .Please contact me.Thank you.`)
        }
    }, [type])

    const onSubmit = async (body) => {
        body = {
            email: body?.email,
            name: body?.name,
            mobile: body?.mobile?.substring(
                inputRef?.current?.state.selectedCountry?.countryCode?.length,
                body?.mobile?.toString()?.length),
            countryCode: inputRef?.current?.state.selectedCountry?.countryCode,
            message: body?.message,
            messageType: body?.enquiryType
        }
        let obj = {
            propertyId: agentData?._id,
            email: body?.email,
            name: body?.name,
            mobile: body?.mobile,
            countryCode: body?.countryCode,
            message: body?.message,
        }
        let api = ''
        if (type === 'agent') {
            api = apiPath.sendEmailAgent
            body = { ...body, agentEmail: agentData?.email }
        } else if (type === 'property') {
            api = apiPath.sendEmailProperty
            body = obj
        } else if (type === 'company') {
            body = { ...body, companyEmail: agentData?.email }
            api = apiPath.sendEmailAgent
        }
        const { status, data } = await apiPost(
            api,
            body
        );
        if (status === 200) {
            if (data.success) {
                notification.success(data?.message);
                reset()
                onHide()
            } else {
                notification.error(data?.message)
            }
        }
    }

    const priceFormat = (item) => {
        if (isNumber(item?.priceDaily) && item?.priceDaily > 0) {
            return t("/DAY");
        } else if (isNumber(item?.priceWeekly) && item?.priceWeekly > 0) {
            return t("/WEEK");
        } else if (isNumber(item?.priceMonthly) && item?.priceMonthly > 0) {
            return t("/MONTH");
        } else if (isNumber(item?.priceYearly) && item?.priceYearly > 0) {
            return t("/YEAR");
        } else {
            return "";
        }
    };

    const priceFormatType = (item) => {
        if (item?.propertyType?.slug == "rent" || item?.propertyType?.slug == "commercial-rent") {
            if (isNumber(item?.priceDaily) && item?.priceDaily > 0) {
                return item?.priceDaily;
            } else if (isNumber(item?.priceWeekly) && item?.priceWeekly > 0) {
                return item?.priceWeekly;
            } else if (isNumber(item?.priceMonthly) && item?.priceMonthly > 0) {
                return item?.priceMonthly;
            } else if (isNumber(item?.priceYearly) && item?.priceYearly > 0) {
                return item?.priceYearly;
            }
        } else {
            return item?.price;
        }
    }

    const getBedroomsNo = () => {
        if(agentData?.bedrooms ===0){
            return (<>
            {t("BEDROOM")} :<span>{agentData?.bedrooms == 0 ? 'Studio' : agentData?.bedrooms}</span>
            </>)
        }else if(agentData?.bedrooms ===1){
            return (<>
                {t("BEDROOM")} :<span>1</span>
                </>)
        }else{
            return (<>
                {t("BEDROOMS")} :<span>{ agentData?.bathrooms}</span>
                </>) 
        }
    }

    const getBathroomsNo = () => {
        if(agentData?.bathrooms ===0 || agentData?.bathrooms ===1){ 
            return (<>
            {t("BATHROOM")} :<span>{ agentData?.bathrooms}</span>
            </>)
     }else{
            return (<>
                {t("BATHROOMS")} :<span>{ agentData?.bathrooms}</span>
                </>) 
        }
    }



    return (
        <div className="agent-modal">
            <Modal
                show={open}
                size="lg"
                onHide={onHide}
                className="agent-modal"
                centered
            >
                <Modal.Header closeButton className="d-flex justify-content-center">
                    <Modal.Title className="text-center w-100">
                        {type === 'company' || isEmpty(user) ? t("COMPANY_EMAIL") : t("AGENT_EMAIL")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="agent-main">
                            {type === 'agent' &&
                                <div className="company-list-card bg-white email-agent mt-2">
                                    <div className="d-flex mb-4">
                                        <figure>
                                            <CustomImage
                                                width={100}
                                                height={100}
                                                src={agentData?.profilePic}
                                                className="me-2"
                                                alt=""
                                            />
                                            {/* <img src={agentData?.profilePic} alt="" /> */}
                                        </figure>
                                        <figcaption>
                                            <h2 className="fs-5 fw-medium text-dark d-block text-decoration-none mb-2">
                                                {agentData?.firstName} {agentData?.lastName}
                                            </h2>
                                            <span className="pr">{agentData?.designation}</span>
                                            <ul>
                                                <li>
                                                    {t("BROKER")} :{agentData?.parentType == 'admin' ? <span title='Mada properties'>{t("MADA_PROPERTIES")}</span> : agentData?.parentType == 'freelancer' ? <span title='Freelancer'>{t("FREELANCER")}</span> : agentData?.parentType == 'company' ? `${agentData?.company?.name}` : null}
                                                    {/* <span>{agentData?.company?.name}</span> */}
                                                </li>
                                                <li>
                                                    {t("BRN")} :<span>{agentData?.brn}</span>
                                                </li>
                                            </ul>
                                        </figcaption>
                                    </div>
                                </div>}

                            {type === 'property' &&
                                <div className="company-list-card bg-white email-agent mt-2">
                                    <div className="d-flex mb-4">
                                        <figure>
                                        <CustomImage
                                                width={100}
                                                height={100}
                                                src={agentData?.photos[0]}
                                                className="me-2"
                                                alt=""
                                            />
                                            {/* <img src={agentData?.photos[0]} alt="" /> */}
                                        </figure>
                                        <figcaption>
                                            <h2 className="fs-5 fw-medium text-dark d-block text-decoration-none mb-2">
                                                {agentData?.title}
                                            </h2>
                                            <span className="pr">
                                                {Helpers?.priceFormat(priceFormatType(agentData))}{" "}
                                                {config?.currency}{" "}
                                                {(agentData?.propertyType?.slug == "rent" || agentData?.propertyType?.slug == "commercial-rent") && (
                                                    <small>{priceFormat(agentData)}</small>
                                                )}
                                                {/* {Helpers?.priceFormat(agentData?.price)} {config?.currency} */}
                                            </span>
                                            <ul>
                                                <li>
                                                    {t("AGENT")} :<span>{agentData?.agent?.firstName} {agentData?.agent?.lastName}</span>
                                                </li>
                                                <li>
                                              
                                                 {getBedroomsNo()}
                                                </li>
                                                <li>
                                                    {getBathroomsNo()}
                                                </li>
                                            </ul>
                                        </figcaption>
                                    </div>
                                </div>}

                            {type === 'company' &&
                                <div className="company-list-card bg-white email-agent mt-2">
                                    <div className="d-flex mb-4">
                                        <figure>
                                            <CustomImage
                                                width={100}
                                                height={100}
                                                src={agentData?.logo}
                                                className="me-2"
                                                alt=""
                                            />
                                        </figure>
                                        <figcaption>
                                            <h2 className="fs-5 fw-medium text-dark d-block text-decoration-none mb-2">
                                                {agentData?.name}
                                            </h2>
                                            <ul>
                                                <li>
                                                    {t("ORN")} :<span>{agentData?.orn}</span>
                                                </li>
                                                <li>
                                                    {t("HEAD_OFFICE")} :<span>{agentData?.headOffice}</span>
                                                </li>
                                            </ul>
                                        </figcaption>
                                    </div>
                                </div>}

                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t("MESSAGE")}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            style={{ height: "100px" }}
                                            type="text"
                                            placeholder={t("YOUR_MESSAGE")}
                                            minLength={2}
                                            {...register("message", {
                                                required: {
                                                    value: true,
                                                    message: t("PLEASE_ENTER_MESSAGE"),
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: t("MINIMUM_LENGTH"),
                                                },
                                            })}
                                        />
                                        <ErrorMessage message={errors?.message?.message} />
                                    </Form.Group>
                                </Col>

                                {type !== 'property' &&
                                    <Col sm={12}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>{t("ENQUIRY_TYPE")}</Form.Label>
                                            <Form.Select
                                                {...register("enquiryType", {
                                                    required: {
                                                        value: true,
                                                        message: t("PLEASE_SELECT_ENQUIRY_TYPE"),
                                                    },
                                                })}
                                            >
                                                <option value="">{t("SELECT_ENQUIRY_TYPE")}</option>
                                                {EnquiryTypeCompany?.length > 0 && EnquiryTypeCompany.map((res, index) => {
                                                    return <option key={index} value={res?.key}>{res?.label}</option>
                                                })}
                                            </Form.Select>
                                            <ErrorMessage message={errors?.enquiryType?.message} />
                                        </Form.Group>
                                    </Col>}
                                <Col sm={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t("NAME")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={30}
                                            placeholder={t("NAME")}
                                            {...register("name", {
                                                required: {
                                                    value: true,
                                                    message: t("PLEASE_ENTER_NAME"),
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: t("MINIMUM_LENGTH"),
                                                },
                                                // maxLength: {
                                                //     value: 30,
                                                //     message: t("MINIMUM_LENGTH_30"),
                                                // },
                                            })}
                                        />
                                        <ErrorMessage message={errors?.name?.message} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label className="fs-7">{t("EMAIL")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={t("ENTER_EMAIL")}
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
                                <Col md={12}>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label className="fs-7">{t("MOBILE_NUMBER")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="mobile"
                                            rules={{
                                                required: t("PLEASE_ENTER_MOBILE_NUMBER"),
                                                validate: (value) => {
                                                    let inputValue = value?.toString()?.slice(inputRef?.current?.state?.selectedCountry?.countryCode?.length, value?.length);
                                                    if (!inputValue.split('').some((res) => res > 0) && inputValue?.length >= 8) {
                                                        return "Please enter valid number."
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
                                                    ref={inputRef}
                                                    inputStyle={{
                                                        width: "100%",
                                                        height: "48px",
                                                    }}
                                                    style={{ borderRadius: "20px" }}
                                                    enableSearch
                                                    countryCodeEditable={false}
                                                />
                                            )}
                                        />
                                        <ErrorMessage message={errors?.mobile?.message} />
                                    </Form.Group>
                                </Col>

                                <div className="social_achiv_left pt-3 mt-3 border-top text-center">
                                    <button type="submit" className="btn_link fw-medium bg-green text-white border-0"
                                    >
                                        {t("SEND_MESSAGE")}
                                    </button>
                                </div>
                            </Row>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default EmailDialogbox;
