import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Col, Row, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import OtpInput from 'react18-input-otp';
import { apiPost } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import useToastContext from '@/hooks/useToastContext';
import AuthContext from '@/context/AuthContext';
import jwt_decode from "jwt-decode";
const VerifyMobile = ({ open, onHide, user }) => {
    const { t } = useTranslation()
    const { setUser } = useContext(AuthContext)
    const [otp, setOtp] = useState("")
    const [counter, setCounter] = useState(59)
    const notification = useToastContext()

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
        return () => clearInterval(timer)
    }, [counter])

    const resendOTP = async () => {
        const { status, data } = await apiPost(apiPath.resendOtpUserMobile, {
            countryCode: user?.country_code,
            mobile: user?.mobile
        })
        if (status === 200) {
            if (data.success) {
                notification.success(data.message);
            } else {
                notification.error(data.message)
            }
        } else {
            notification.error(data.message)
        }
    }

    useEffect(() => {
        resendOTP()
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault();
        if (otp.toString()?.length === 0 || otp.toString()?.length < 4) {
            notification.error(t("Please_enter_4_digit_OTP"))
        } else if (
            otp.toString()?.length === 4
        ) {
            const { status, data } = await apiPost(apiPath.verifyMobileUser, {
                countryCode: user?.country_code,
                mobile: user?.mobile,
                email: user?.email,
                otpPhone: otp
            })
            if (status === 200) {
                if (data.success) {
                    if (data?.results?.is_mobile_verified == 1) {
                        notification.success(data?.message)
                        const token = data?.results?.token || null
                        const refresh_token = data?.results?.refresh_token || null
                        localStorage.setItem('token', token)
                        localStorage.setItem('refresh_token', refresh_token)
                        setUser(jwt_decode(token))
                        onHide()
                    }
                } else {
                    notification.error(data.message)
                }
            } else {
                notification.error(data.message)
            }
        }
    }
    return (
        <Modal show={open} onHide={onHide} centered className="agent-modal">
            <Modal.Header className="d-flex justify-content-center" closeButton>
                <Modal.Title>{t("Verify_Mobile")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='w-100 d-flex justify-content-center align-items-center'>
                    <Form className='container-fluid'>
                        <Form.Group className='mb-3' controlId='formBasicEmail'>
                            <div className='d-flex justify-content-between align-items-center mb-2'>
                                <Form.Label>{t('MOBILE_OTP')}</Form.Label>
                                <Button
                                    type='button'
                                    onClick={() => {
                                        if (counter === 0) {
                                            setCounter(59);
                                            resendOTP();
                                        }
                                    }}
                                    disabled={counter !== 0}
                                    style={{ fontSize: '12px', padding: '3px' }}
                                >
                                    {t('RESEND_OTP')} {counter !== 0 && `in ${counter} seconds`}
                                </Button>
                            </div>
                            <OtpInput
                                numInputs={4}
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e);
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

                        <Row className='flex-column-md-reverse'>
                            <Col md={6}>
                                {' '}
                                <Button
                                    onClick={onSubmit}
                                    type='submit'
                                    style={{ lineHeight: "30px" }}
                                    className='w-75 d-block p-1 my-0'
                                >
                                    {t("VERIFY_OTP")}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default VerifyMobile