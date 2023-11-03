import React, { useContext, useRef } from "react"
import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form"
import ErrorMessage from "./ErrorMessage"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { apiPost } from "@/utils/apiFetch"
import apiPath from "@/utils/apiPath"
import useToastContext from "@/hooks/useToastContext"
import { useTranslation } from 'react-i18next'
import AuthContext from "@/context/AuthContext"
import RedStar from "./common/RedStar"

const RequirementDialogBox = (props) => {
    const { t } = useTranslation()
    let { open, onHide } = props
    const inputRef = useRef(null)
    const {defaultCountry} = useContext(AuthContext)
    const notification = useToastContext()
    const {
        register,
        handleSubmit,
        control,
        reset,
        getValues,
        formState: { errors },
    } = useForm();

    const onSubmit = async (body) => {
        body = {
            email: body?.email,
            name: body?.name,
            mobile: body?.mobile,
            description: body?.description,
            propertyTypeSlug: body?.propertyTypeSlug,
            location: body?.location,
            budgetMax: body?.budgetMax,
            budgetMin: body?.budgetMin
        }
        const res = await apiPost(apiPath.shareRequirement, body)
        if (res.data.success === true) {
            notification.success(res.data.message)
            reset()
            onHide()
        } else {
            notification.error(res?.data?.message)
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
                        {t('SHARE_REQUIREMENT')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="agent-main">
                            <Row>
                                <Col sm={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label className="fs-7">{t('NAME')}<RedStar /></Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={256}
                                            placeholder={t('NAME')}
                                            {...register("name", {
                                                required: {
                                                    value: true,
                                                    message: t('PLEASE_ENTER_NAME'),
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: t('MINIMUM_LENGTH'),
                                                },
                                                maxLength: {
                                                    value: 20,
                                                    message: t('MINIMUM_LENGTH_20')
                                                }
                                            })}
                                        />
                                        <ErrorMessage message={errors?.name?.message} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label className="fs-7">{t('EMAIL')}<RedStar /></Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder={t('ENTER_EMAIL')}
                                            {...register("email", {
                                                required: t('PLEASE_ENTER_EMAIL'),
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: t('INVALID_EMAIL_ADDRESS')
                                                }
                                            })}
                                        />
                                        <ErrorMessage message={errors?.email?.message} />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label className="fs-7">{t('MOBILE_NUMBER')}<RedStar /></Form.Label>
                                        <Controller
                                            control={control}
                                            name="mobile"
                                            rules={{
                                                required: t('PLEASE_ENTER_MOBILE_NUMBER'),
                                                minLength: {
                                                    value: 8,
                                                    message:
                                                        t('MOBILE_NUMBER_SHOULD_CONTAIN_AT_LEAST_8_DIGIT')
                                                }
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
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label className="fs-7">{t('LOCATION')}<RedStar /></Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={20}
                                            placeholder={t('LOCATION')}
                                            {...register("location", {
                                                required: {
                                                    value: true,
                                                    message: t('PLEASE_ENTER_LOCATION'),
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: t('MINIMUM_LENGTH'),
                                                },
                                                maxLength: {
                                                    value: 20,
                                                    message: t('MAXIMUM_LENGTH')
                                                }
                                            })}
                                        />
                                        <ErrorMessage message={errors?.location?.message} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label className="fs-7">{t('BUDGET_MINIMUM')}<RedStar /></Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder={t('BUDGET_MINIMUM')}
                                            {...register("budgetMin", {
                                                required: t('PLEASE_ENTER_BUDGET_MINIMUM')
                                            })}
                                        />
                                        <ErrorMessage message={errors?.budgetMin?.message} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label className="fs-7">{t('BUDGET_MAXIMUM')}<RedStar /></Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder={t('BUDGET_MAXIMUM')}
                                            {...register("budgetMax", {
                                                required: t('PLEASE_ENTER_BUDGET_MAXIMUM'),
                                                validate: (val) => {
                                                    const { budgetMin } = getValues()
                                                    if (Number(budgetMin) > Number(val)) {
                                                      return 'Budget minimum must be less than budget maximum.'
                                                    }
                                                    return 
                                                  }
                                            })}
                                        />
                                        <ErrorMessage message={errors?.budgetMax?.message} />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        {/* <FloatingLabel
                                            controlId="floatingSelectGrid"
                                            label={t('PROPERTY_TYPE')}
                                        > */}
                                        <Form.Label className="fs-7">{t('PROPERTY_TYPE')}<RedStar /></Form.Label>
                                            <Form.Select aria-label="Floating label select example"
                                                {...register("propertyTypeSlug", {required: t('SELECT_PROPERTY_TYPE')})}>
                                                <option value={""} selected>{t('SELECT_PROPERTY_TYPE')} </option>
                                                <option value="buy">{t('RESIDENTIAL_BUY')}</option>
                                                <option value="rent">{t('RESIDENTIAL_RENT')}</option>
                                                <option value="commercial-buy">{t('COMMERCIAL_BUY')}</option>
                                                <option value="commercial-rent">{t('COMMERCIAL_RENT')}</option>
                                            </Form.Select>
                                            <ErrorMessage message={errors?.propertyTypeSlug?.message} />
                                        {/* </FloatingLabel> */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label className="fs-7">{t('DESCRIPTION')}<RedStar /></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            style={{ height: "120px" }}
                                            type="text"
                                            placeholder={t('DESCRIPTION')}
                                            minLength={2}
                                            {...register("description", {
                                                required: {
                                                    value: true,
                                                    message: t('PLEASE_ENTER_DESCRIPTION'),
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: t('MINIMUM_LENGTH'),
                                                },
                                            })}
                                        />
                                        <ErrorMessage message={errors?.description?.message} />
                                    </Form.Group>
                                </Col>
                                <div className="social_achiv_left pt-3 mt-3 border-top">
                                    <button
                                        type="submit"
                                        className="btn_link fw-medium bg-green text-white border-0"
                                    >
                                        {t('SAVE')}
                                    </button>
                                </div>
                            </Row>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default RequirementDialogBox
