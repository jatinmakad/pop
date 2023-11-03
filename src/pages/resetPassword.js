import React, { useContext, useState, useEffect } from 'react'
import OtpInput from 'react18-input-otp'
import useToastContext from '@/hooks/useToastContext'
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { apiPost } from '@/utils/apiFetch'
import apiPath from '../utils/apiPath'
import AuthContext from '@/context/AuthContext'
import { isEmpty, isNumber } from 'lodash'
import { NumberInputNew, validationRules } from '../utils/constants'
import { useForm } from 'react-hook-form'
import ErrorMessage from './components/ErrorMessage'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { preventMaxInput } from '@/utils/constants'
import CustomImage from './components/CustomImage'
import Link from 'next/link'

function ResetPassword() {
  const { t } = useTranslation()
  const [otp, setOtp] = useState('')
  const notification = useToastContext()
  const [showPassword, setShowPassword] = useState(false)
  const [conPassToggle, setConPassTogle] = useState(false)
  const router = useRouter()
  const { resetPasswordData, direction } = useContext(AuthContext)
  const [counter, setCounter] = useState(59)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (isEmpty(resetPasswordData)) {
      router.push('/login')
    }
  }, [resetPasswordData])

  const onSubmit = async (body) => {
    let api = ''
    if (resetPasswordData.type === 'Company') {
      api = apiPath.resetPasswordCompany
    } else if (resetPasswordData.type === 'Customer') {
      api = apiPath.resetPasswordUser
    } else {
      api = apiPath.resetPasswordAgent
    }
    if (otp?.toString()?.length !== 4) {
      notification.error(t("Please_enter_4_digit_OTP"))
    } else {
      const { status, data } = await apiPost(api, {
        email: resetPasswordData?.email,
        otp: otp,
        password: body.password
      })
      console.log(data, 'dat')
      if (status === 200) {
        if (data.success) {
          notification.success(data.message)
          reset()
          router.push(`/login?type=${resetPasswordData?.type}`)
        } else {
          notification.error(data.message)
        }
      } else {
        notification.error(data.message)
      }
    }
  }

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
    return () => clearInterval(timer)
  }, [counter])

  useEffect(() => {
    if (!isEmpty(watch('confirmPassword'))) {
      if (watch('password')) {
        trigger('confirmPassword')
      }
    }
  }, [watch('password')])

  const resendOtp = async () => {
    let api = ''
    if (resetPasswordData.type === 'Company') {
      api = apiPath.resendOtpCompanyEmail
    } else if (resetPasswordData.type === 'Customer') {
      api = apiPath.resendOtpUserEmail
    } else {
      api = apiPath.resendOtpAgentEmail
    }
    const { status, data } = await apiPost(api, {
      email: resetPasswordData?.email
    })
    if (status === 200) {
      if (data.success) {
        notification.success(data.message)
      } else {
        notification.error(data.message)
      }
    } else {
      notification.error(data.message)
    }
  }

  return (
    <>
      <div className='login_outer mainLogin'>
        <Head>
          {
            direction?.eventKey == '1' ? <link href='/css/bootstrap.min.css' rel='stylesheet' ></link>
              : <link rel='stylesheet' href='/css/bootstrap.rtl.min.css' ></link>
          }
          <title>
            {t('MADA_PROPERTIES')} : {t('RESET_PASSWORD')}
          </title>
        </Head>
        <div className='leftSec'>
          <div className='wrap'>
            <div className='mb-3 mb-md-4 mb-lg-5 text-center'>
              <Link href='/'>
                <CustomImage width={228} height={78} src='/images/login_logo.svg' alt='image' />
              </Link>
            </div>
            <h2 className='mb-3 mb-md-4 mb-lg-5 fw-bold  text-center text-dark fs-3'>
              {t('RESET_PASSWORD')}
            </h2>
            <Form onSubmit={handleSubmit(onSubmit)} className='container-fluid'>
              <Row className='pwd'>
                <Col sm={12}>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <div className='d-flex justify-content-between align-items-center mb-2'>
                      <Form.Label>{t('EMAIL_OTP')}</Form.Label>
                      <Button
                        onClick={() => {
                          if (counter === 0) {
                            setCounter(59)
                            resendOtp()
                          }
                        }}
                        disabled={counter !== 0}
                        style={{ fontSize: '12px', padding: '3px' }}
                      >
                        {t('RESEND_OTP')} {counter !== 0 && `in ${counter} second`}
                      </Button>
                    </div>
                    <OtpInput
                      numInputs={4}
                      value={otp}
                      isInputNum={true}
                      shouldAutoFocus={true}
                      onKeyDown={NumberInputNew}
                      onChange={(e) => {
                        // if (!validationRules.numberNew.test(e)) {
                        console.log(e, '=========')
                        setOtp(e)
                        // }
                      }}
                      inputStyle={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '4px',
                        border: '1px solid black'
                      }}
                      separator={<span>-</span>}
                    />
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>{t('PASSWORD')}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={!showPassword ? 'password' : 'text'}
                        placeholder={t('ENTER_PASSWORD')}
                        maxLength={16}
                        onInput={(e) => preventMaxInput(e)}
                        {...register('password', {
                          required: t('PLEASE_ENTER_PASSWORD'),
                          validate: (value) => {
                            if (value === '') {
                              return true
                            }
                            if (!!value.trim()) {
                              return true
                            } else {
                              ('White spaces not allowed.')
                            }
                          },
                          pattern: {
                            value: validationRules.password,
                            message:
                              t('PASSWORD_MUST_CONTAIN')
                          },
                          maxLength: {
                            value: 16,
                            message: t("MINIMUM_LENGTH_16"),
                          }
                        })}
                      />

                      <InputGroup.Text
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer' }}
                      >
                        {showPassword ? (
                          <img src='./images/hide.png' alt='image' />
                        ) : (
                          <img src='./images/eye.svg' alt='image' />
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                    <ErrorMessage message={errors?.password?.message} />
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>{t('CONFIRM_PASSWORD')}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        placeholder={t('ENTER_CONFIRM_PASSWORD')}
                        onInput={(e) => preventMaxInput(e)}
                        maxLength={16}
                        type={!conPassToggle ? 'password' : 'text'}
                        {...register('confirmPassword', {
                          required: {
                            value: true,
                            message: t('PLEASE_ENTER_CONFIRM_PASSWORD')
                          },
                          validate: (value) => {
                            if (value === '') {
                              return true
                            }
                            if (!isEmpty(watch('password'))) {
                              if (value === watch('password')) {
                                return true
                              } else {
                                return t('PASSWORD_DOES_NOT_MATCH')
                              }
                            }
                          },
                          // pattern: {
                          //   value: validationRules.password,
                          //   message:
                          //     t('PASSWORD_MUST_CONTAIN')
                          // },
                          maxLength: {
                            value: 16,
                            message: t("MINIMUM_LENGTH_16"),
                          }
                        })}
                        onChange={(e) => {
                          setValue('confirmPassword', e.target.value, {
                            shouldValidate: true
                          })
                        }}
                      />
                      <InputGroup.Text
                        onClick={() => setConPassTogle(!conPassToggle)}
                        style={{ cursor: 'pointer' }}
                      >
                        {conPassToggle ? (
                          <img src='./images/hide.png' alt='image' />
                        ) : (
                          <img src='./images/eye.svg' alt='image' />
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                    <ErrorMessage message={errors?.confirmPassword?.message} />
                  </Form.Group>
                </Col>
              </Row>

              <Button type='submit' className='w-100 d-block py-2 my-3 rounded'>
                {t('RESET_PASSWORD')}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
export default ResetPassword
