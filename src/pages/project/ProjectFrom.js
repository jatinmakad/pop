import React, { useContext, useRef } from "react"
import { Form } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form"
import ErrorMessage from "../components/ErrorMessage";
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { useTranslation } from 'react-i18next'
import { AlphaInput } from "@/utils/constants";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import { apiPost } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import useToastContext from "@/hooks/useToastContext";

const ProjectFrom = () => {
    const { t } = useTranslation()
    const router = useRouter();
    const notification = useToastContext();
    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm();
    const { defaultCountry } = useContext(AuthContext);
    const inputRef = useRef(null);
    const onSubmit = async (body) => {
        const obj = {
            name: body?.name,
            email: body?.email,
            slug: router?.query?.slug,
        };
        const { status, data } = await apiPost(apiPath.contactForNewProject, {
            ...obj,
            countryCode: inputRef?.current?.state.selectedCountry?.countryCode,
            mobile: body?.mobile?.substring(
                inputRef?.current?.state.selectedCountry?.countryCode?.length,
                body?.mobile?.toString()?.length
            ),
        });
        if (status === 200) {
            if (data.success) {
                reset();
                // inputRef.current.reset();
                notification.success(data?.message);
            } else {
                notification.error(data?.message);
            }
        } else {
            notification.error(data?.message);
        }
    };
    return (
        <div>
            <Form
                onSubmit={handleSubmit(onSubmit)}
                className="sidebar_form"
            >
                <h4 className="text-center">Contact Mada Properties</h4>
                <Form.Group className="mb-3" controlId="">
                    <Form.Label className="fs-7">
                        Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        maxLength={15}
                        placeholder="Name"
                        {...register("name", {
                            required: {
                                value: true,
                                message: "Please enter name.",
                            },
                            minLength: {
                                value: 2,
                                message: "Minimum length must be 2.",
                            },
                            maxLength: {
                                value: 15,
                                message: "Maximum length must be 15.",
                            },
                        })}
                        onChange={(e) =>
                            setValue("name", e.target.value?.trim(), {
                                shouldValidate: true,
                            })
                        }
                        onKeyPress={AlphaInput}
                    />
                    <ErrorMessage message={errors?.name?.message} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="fs-7">
                        Email Address<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        {...register("email", {
                            required: "Please enter email.",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address.",
                            },
                        })}
                    />
                    <ErrorMessage message={errors?.email?.message} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="">
                    <Form.Label>
                        Mobile Number<span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                        control={control}
                        name="mobile"
                        rules={{
                            required: "Please enter mobile number.",
                            validate: (value) => {
                                let inputValue = value
                                    ?.toString()
                                    ?.slice(
                                        inputRef?.current?.state?.selectedCountry
                                            ?.countryCode?.length,
                                        value?.length
                                    );
                                if (inputValue?.length < 5) {
                                    return "Mobile number must contain at least 5 digits.";
                                } else if (inputValue?.length > 12) {
                                    return "Mobile number should not exceed 12 digits.";
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
                <div className="social_achiv_left d-flex align-items-center justify-content-center fs-7 pt-3 mt-3 border-top">
                    <button
                        type="submit"
                        className="btn_link bg-green text-white  w-100 border-0"
                    >
                        Request Details
                    </button>
                    <a
                        href={`tel:${9112345678}`}
                        className="ms-2 btn_link d-flex align-items-center bg-green text-white w-100 justify-content-center"
                    >
                        <img src="/images/call.svg" className="me-sm-2" /> Call
                    </a>
                </div>
            </Form>
        </div>
    )
}
export default ProjectFrom
