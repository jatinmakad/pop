import React, { useContext, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import AuthContext from "@/context/AuthContext";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "./components/ErrorMessage";
import { useTranslation } from "react-i18next";
import RedStar from "./components/common/RedStar";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isEmpty } from "lodash";
import apiPath from "@/utils/apiPath";
import useToastContext from "@/hooks/useToastContext";
import { apiPost } from "@/utils/apiFetch";

const ContactUsNew = () => {
	const notification = useToastContext();
	const { config, adminInfo, defaultCountry,direction } = useContext(AuthContext);
	const { t } = useTranslation();
	const inputRef = useRef(null);
	const [phone, setPhone] = useState("");
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		getValues,
		reset,
		formState: { errors },
	} = useForm();

	const onSubmit = async (body) => {
		try {
			const obj = {
				name: body?.name,
				email: body?.email,
				countryCode: body?.countryCode,
				mobile: body.mobile,
				problem: body?.problem
			};
			const { status, data } = await apiPost(apiPath.contactUsRequest, {
				...obj,
				// countryCode: inputRef?.current?.state.selectedCountry?.countryCode,
				// mobile: obj?.mobile?.substring(inputRef?.current?.state.selectedCountry?.countryCode?.length, obj?.mobile?.toString()?.length),
			});
			if (status == 200) {
				if (data.success) {
					notification.success(data?.message);
					const mobileCode = defaultCountry === "ae" ? "+971" : defaultCountry === "sa" ? "+966" : "+91"
					setPhone(mobileCode)
					setValue('mobile', '')
					reset();
				} else {
					notification.error(data?.message);
				}
			} else {
				notification.error(data?.message);
			}
		} catch (error) {
			notification.error(error?.message);
		}
	};
	return (
		<>
			<Head>
				<title>{adminInfo?.siteName} : Contact Us</title>
			</Head>
			<div className="main_wrap">
				<Container>
					<div className="contact_form">
						<div className="contact-area pb-100px pt-100px">
							<div className="custom-row-2 row">
								<Col lg={4} md={5} className="mb-lm-60px col-sm-12 col-xs-12 w-sm-100">
									<div className="contact-info-wrap">
										<h2 className="title ">{t("CONTACT_INFO")}</h2>
										<div className="single-contact-info ">
											<div className="contact-info-inner">
												<span className="sub-title">{t("PHONE_NUMBER")}</span>
											</div>
											<div className="contact-info-dec">
												<p>
													<a href="tel:+012345678102">
														{" "}
														{config.country === "UAE" && "+971"} {config.country === "Saudi" && "+966"} {adminInfo?.mobile}
													</a>
												</p>
											</div>
										</div>
										<div className="single-contact-info ">
											<div className="contact-info-inner">
												<span className="sub-title">{t("EMAIL")}:</span>
											</div>
											<div className="contact-info-dec">
												<p>{adminInfo?.email}</p>
											</div>
										</div>
										<div className="single-contact-info ">
											<div className="contact-info-inner">
												<span className="sub-title">{t("ADDRESS")}</span>
											</div>
											<div className="contact-info-dec">{adminInfo?.[`siteAddress${direction?.langKey || ''}`]}</div>
										</div>
									</div>
								</Col>
								<Col lg={8} md={7} className="mb-lm-60px col-sm-12 col-xs-12 w-sm-100">
									<div className="contact-form">
										<div className="contact-title mb-30">
											<h2 className="title ">{t("GET_IN_TOUCH")}</h2>
										</div>
										<Form className="contact-form-style" onSubmit={handleSubmit(onSubmit)}>
											<Row>
												<Col lg={4}>
													<Form.Group className="mb-3" controlId="formBasicPassword">
														<Form.Label>
															{t("NAME")}
															<RedStar />
														</Form.Label>
														<Form.Control
															type="text"
															placeholder={t("ENTER_YOUR_NAME")}
															{...register("name", {
																required: {
																	value: true,
																	message: t("PLEASE_ENTER_NAME"),
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

												<Col lg={4}>
													<Form.Group className="mb-3" controlId="formBasicPassword">
														<Form.Label>{t("EMAIL_ID")}<RedStar /></Form.Label>
														<Form.Control
															type="text"
															placeholder={t("ENTER_EMAIL_ID")}
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
												<Col lg={4}>
													<Form.Group className="mb-3" controlId="formBasicPassword">
														<Form.Label>{t("MOBILE_NUMBER")}<RedStar /></Form.Label>
														<PhoneInput
															enableSearch
															searchStyle={{
																alignItems: "center",
																width: "90%",
															}}
															country={defaultCountry}
															value={JSON.stringify(phone)}
															name="mobile"
															{...register("mobile", {
																required: t("PLEASE_ENTER_MOBILE_NUMBER"),
																validate: (value) => {
																	let inputValue = value?.toString()?.slice(inputRef?.current?.state?.selectedCountry?.countryCode?.length, value?.length)
																	if (inputValue?.length < 8) {
																		return t('MOBILE_NUMBER_MUST_CONTAIN_AT_LEAST_5_DIGITS')
																	} else if (inputValue?.length > 12) {
																		return t('MOBILE_NUMBER_SHOULD_NOT_EXCEED_12_DIGITS')
																	} else {
																		return true
																	}
																},
															})}
															onChange={(value, data) => {
																setValue("countryCode", `${data?.dialCode}`, {
																	shouldValidate: true,
																});
																setValue(
																	"mobile",
																	value?.slice(data?.dialCode?.length),
																	{
																		shouldValidate: true,
																	}
																);
																setPhone(
																	data?.dialCode +
																	value?.slice(data?.dialCode?.length)
																);
															}}
															containerStyle={{
																height: "48px",
																outline: 0,
															}}
															dropdownStyle={{
																zIndex: 100,
																maxHeight: "150px",
																outline: 0,
															}}
															inputStyle={{
																width: "100%",
																height: "48px",
																outline: 0,
																paddingLeft: "49px",
															}}
														/>
														<ErrorMessage message={errors?.mobile?.message} />
													</Form.Group>
												</Col>

												<Col lg={12}>
													<Form.Group className="mb-3" controlId="formBasicPassword">
														<Form.Label>{t("PROBLEM")}<RedStar /></Form.Label>
														<Form.Control
															as="textarea"
															rows={10}
															{...register("problem", {
																required: {
																	value: true,
																	message: t("PLEASE_ENTER_PROBLEM"),
																},
																minLength: {
																	value: 2,
																	message: t("MINIMUM_LENGTH"),
																},
															})}
														/>
														<ErrorMessage message={errors?.problem?.message} />
													</Form.Group>
												</Col>
												<Col lg={12}>
													<Button className="theme_btn  w-auto mt-20px" type="submit">
														{t("SUBMIT")}
													</Button>
												</Col>
											</Row>
										</Form>
									</div>
								</Col>
							</div>
						</div>
					</div>
				</Container>
			</div>
		</>
	);
};
export default ContactUsNew;
