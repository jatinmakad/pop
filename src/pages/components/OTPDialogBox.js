import React, { useContext, useRef, useState, useEffect } from "react"
import { Button, Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap"
import OtpInput from 'react18-input-otp'
import { apiPost } from "@/utils/apiFetch"
import apiPath from "@/utils/apiPath"
import useToastContext from "@/hooks/useToastContext"
import { useTranslation } from 'react-i18next'
import AuthContext from "@/context/AuthContext"
import { useRouter } from 'next/router'

const OTPDialogBox = (props) => {
    const { t } = useTranslation()
    let { open, onHide, setOpen } = props
    const [otp, setOtp] = useState({
        mobile: '',
        email: ''
    })
    const [counter, setCounter] = useState(59)
    const notification = useToastContext()
    const router = useRouter()
    const { verifyOtpData, setUser, direction } = useContext(AuthContext)

    const apiCall = async (obj, type) => {
        let api = ''
        if (type === 'both') {
            if (verifyOtpData.role === 'company') {
                api = apiPath.verifyEmailandOtpCompany
            } else if (verifyOtpData.role === 'user') {
                api = apiPath.verifyEmailandOtpCustomer
            } else {
                api = apiPath.verifyEmailandOtpAgent
            }
        } else if (type === 'email') {
            if (verifyOtpData.role === 'company') {
                api = apiPath.verifyEmailCompany
            } else if (verifyOtpData.role === 'user') {
                api = apiPath.verifyEmailUser
            } else {
                api = apiPath.verifyEmailAgent
            }
        } else if (type === 'mobile') {
            if (verifyOtpData.role === 'company') {
                api = apiPath.verifyMobileCompany
            } else if (verifyOtpData.role === 'user') {
                api = apiPath.verifyMobileUser
            } else {
                api = apiPath.verifyMobileAgent
            }
        }
        const { status, data } = await apiPost(api, {
            ...obj,
            countryCode: verifyOtpData?.countryCode,
            mobile: verifyOtpData?.mobile,
            email: verifyOtpData?.email
        })
        if (status === 200) {
            if (data.success) {
                if (isEmpty(data.results)) {
                    if (verifyOtpData?.role === 'company') {
                        router.push(`/login?type=Company`)
                    } else if (verifyOtpData.role === 'user') {
                        router.push(`/login?type=Customer`)
                    } else {
                        router.push(`/login?type=Agent`)
                    }
                    notification.success(data?.message)
                } else {
                    if (data?.results?.isApprovedStatus === 'pending') {
                        if (verifyOtpData?.role === 'company') {
                            router.push(`/login?type=Company`)
                        } else if (verifyOtpData.role === 'user') {
                            router.push(`/login?type=Customer`)
                        } else {
                            router.push(`/login?type=Agent`)
                        }
                        notification.success(data?.message)
                    } else if (data?.results?.isApprovedStatus === 'rejected') {
                        if (verifyOtpData?.role === 'company') {
                            router.push(`/login?type=Company`)
                        } else if (verifyOtpData.role === 'user') {
                            router.push(`/login?type=Customer`)
                        } else {
                            router.push(`/login?type=Agent`)
                        }
                        notification.success(data?.message)
                    } else {
                        notification.success(data?.message)
                        const token = data?.results?.token || null
                        const refresh_token = data?.results?.refresh_token || null
                        localStorage.setItem('token', token)
                        localStorage.setItem('refresh_token', refresh_token)
                        setUser(jwt_decode(token))
                        router.push(`/`)
                    }
                }
            } else {
                notification.error(data.message)
            }
        } else {
            notification.error(data.message)
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (
            verifyOtpData?.is_mobile_verified === 0 &&
            verifyOtpData?.is_email_verified === 0
        ) {
            if (
                otp.mobile?.toString()?.length === 4 &&
                otp.email?.toString()?.length === 4
            ) {
                apiCall({ otpPhone: otp?.mobile, otpEmail: otp?.email }, 'both')
            } else {
                notification.error('please enter 4 digit OTP')
            }
        } else if (verifyOtpData?.is_email_verified === 0) {
            if (otp.email?.toString()?.length === 4) {
                apiCall({ otpEmail: otp?.email }, 'email')
            } else {
                notification.error('please enter 4 digit OTP')
            }
        } else if (verifyOtpData?.is_mobile_verified === 0) {
            if (otp.mobile?.toString()?.length === 4) {
                apiCall({ otpPhone: otp?.mobile }, 'mobile')
            } else {
                notification.error('please enter 4 digit OTP')
            }
        }
    }
    const resendOtp = async () => {
        let api = ''
        let obj = {}
        if (
            verifyOtpData?.is_mobile_verified === 0 &&
            verifyOtpData?.is_email_verified === 0
        ) {
            if (verifyOtpData.role === 'company') {
                api = apiPath.resendOtpCompany
            } else if (verifyOtpData.role === 'user') {
                api = apiPath.resendOtpUser
            } else {
                api = apiPath.resendOtpAgent
            }
            obj = {
                countryCode: verifyOtpData?.countryCode,
                mobile: verifyOtpData?.mobile,
                email: verifyOtpData?.email
            }
        } else if (
            verifyOtpData?.is_mobile_verified === 0 &&
            verifyOtpData?.is_email_verified === 1
        ) {
            if (verifyOtpData.role === 'company') {
                api = apiPath.resendOtpCompanyMobile
            } else if (verifyOtpData.role === 'user') {
                api = apiPath.resendOtpUserMobile
            } else {
                api = apiPath.resendOtpAgentMobile
            }
            obj = {
                countryCode: verifyOtpData?.countryCode,
                mobile: verifyOtpData?.mobile
            }
        } else if (
            verifyOtpData?.is_mobile_verified === 1 &&
            verifyOtpData?.is_email_verified === 0
        ) {
            if (verifyOtpData.role === 'company') {
                api = apiPath.resendOtpCompanyEmail
            } else if (verifyOtpData.role === 'user') {
                api = apiPath.resendOtpUserEmail
            } else {
                api = apiPath.resendOtpAgentEmail
            }
            obj = {
                email: verifyOtpData?.email
            }
        }

        const { status, data } = await apiPost(api, obj)
        if (status === 200) {
            if (data.success) {
                notification.success(data.message);
                setOtp({
                    mobile: '',
                    email: ''
                })
            } else {
                notification.error(data.message)
            }
        } else {
            notification.error(data.message)
        }
    }

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
        return () => clearInterval(timer)
    }, [counter])

    // useEffect(() => {
    //   if (isEmpty(verifyOtpData)) {
    //     router.push(`/login`)
    //   }
    // }, [verifyOtpData])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

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
                        {t('OTP_VERIFY')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='container-fluid'>
                        {verifyOtpData?.is_mobile_verified === 0 && (
                            <Form.Group className='mb-3' controlId='formBasicEmail'>
                                <div className='d-flex justify-content-between align-items-center mb-2'>
                                    <Form.Label>{t('MOBILE_OTP')}</Form.Label>
                                    {verifyOtpData?.is_mobile_verified === 0 &&
                                        verifyOtpData?.is_email_verified === 0 && (
                                            <Button
                                                onClick={() => {
                                                    if (counter === 0) {
                                                        setCounter(59);
                                                        resendOtp();
                                                    }
                                                }}
                                                disabled={counter !== 0}
                                                style={{ fontSize: '12px', padding: '3px' }}
                                            >
                                                {t('RESEND_OTP')} {counter !== 0 && `in ${counter} seconds`}
                                            </Button>
                                        )}
                                </div>
                                <OtpInput
                                    numInputs={4}
                                    value={otp.mobile}
                                    onChange={(e) => {
                                        setOtp({ ...otp, mobile: e });
                                    }}
                                    isInputNum={true}
                                    shouldAutoFocus={true}
                                    inputStyle={{
                                        width: '100%',
                                        height: '40px',
                                        borderRadius: '4px',
                                        border: '1px solid black',
                                    }}
                                    separator={<span>-</span>}
                                />
                            </Form.Group>
                        )}
                        {verifyOtpData?.is_email_verified === 0 && (
                            <Form.Group className='mb-3' controlId='formBasicEmail'>
                                <div className='d-flex justify-content-between align-items-center mb-2'>
                                    <Form.Label>{t('EMAIL_OTP')}</Form.Label>
                                    {verifyOtpData?.is_mobile_verified === 1 && (
                                        <Button
                                            onClick={() => {
                                                if (counter === 0) {
                                                    setCounter(59);
                                                    resendOtp();
                                                }
                                            }}
                                            disabled={counter !== 0}
                                            style={{ fontSize: '12px', padding: '3px' }}
                                        >
                                            {t('RESEND_OTP')} {counter !== 0 && `in ${counter} second`}
                                        </Button>
                                    )}
                                </div>
                                <OtpInput
                                    numInputs={4}
                                    value={otp.email}
                                    isInputNum={true}
                                    onChange={(e) => setOtp({ ...otp, email: e })}
                                    inputStyle={{
                                        width: '100%',
                                        height: '40px',
                                        borderRadius: '4px',
                                        border: '1px solid black',
                                    }}
                                    separator={<span>-</span>}
                                />
                            </Form.Group>
                        )}
                        <Row className='flex-column-md-reverse'>
                            <Col md={4}>

                                <div className="loadMore text-center  mt-3  my-3">
                                    <button className="border-green rounded text-green fw-medium fs-5 outline_btn_forgot_password" onClick={() => setOpen(false)} > {t('CLOSE')}</button></div>
                            </Col>
                            <Col md={8}>
                                {' '}
                                <Button
                                    onClick={() => onSubmit()}
                                    className='w-100 d-block py-2 my-0 my-md-3'
                                >
                                    {t('VERIFY_OTP')}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default OTPDialogBox
