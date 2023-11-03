import AuthContext from '@/context/AuthContext'
import { validationRules } from '@/utils/constants'
import { Form, Button, InputGroup } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import React, { useContext, useState, useEffect, useRef } from 'react'
import ErrorMessage from './components/ErrorMessage'
import Link from 'next/link'
import CustomImage from './components/CustomImage'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import GoogleLogin from './components/GoogleLogin'
import FacebookLogin from './components/FacebookLogin'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { preventMaxInput } from '@/utils/constants'
import { isEmpty } from 'lodash'
import pathObj from '@/utils/apiPath'
import { apiPost } from '@/utils/apiFetch'
import { useRouter } from "next/router"
import useToastContext from "@/hooks/useToastContext"

function Login() {
  const { t } = useTranslation()
  const notification = useToastContext()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    shouldFocusError: true,
    defaultValues: {
      countryCode: 91
    }
  })
  const router = useRouter()
  const [signupType, setSignupType] = useState('Customer')
  const [rememberMe, setRememberMe] = useState(false)
  const [googleLoginEmail, setGoogleLoginEmail] = useState('')
  const [facebookLoginEmail, setFacebookLoginEmail] = useState('')
  let { loginUser, showPassword, defaultCountry, handleShowPassword, direction, setUser, config } =
    useContext(AuthContext)
  const inputRef = useRef(null)

  const handleRememberMe = (e) => {
    localStorage.setItem('rememberMe', e.target.checked)
    setRememberMe(localStorage.getItem('rememberMe'))
  }


  // const getBrowserName = () => {
  //   let browserInfo = navigator.userAgent
  //   let browser
  //   if (browserInfo.includes('Opera') || browserInfo.includes('Opr')) {
  //     browser = 'Opera'
  //   } else if (browserInfo.includes('Edg')) {
  //     browser = 'Edge'
  //   } else if (browserInfo.includes('Chrome')) {
  //     browser = 'Chrome'
  //   } else if (browserInfo.includes('Safari')) {
  //     browser = 'Safari'
  //   } else if (browserInfo.includes('Firefox')) {
  //     browser = 'Firefox'
  //   } else {
  //     browser = 'unknown'
  //   }
  //   return browser
  // }
  // const browserName = getBrowserName()

  const googleLogin = async ({email}) => {
    const payload = {
      email
    }
    const path = pathObj.googleLogin
    const res = await apiPost(path, payload)
    if (res.data.success) {
      notification.success(res?.data?.message)
      // delete res?.data?.results?.subscriptionDetail
      res?.data?.success && setUser(res?.data?.results)
      localStorage.setItem("token", res?.data?.results?.token)
      localStorage.setItem(
        "refreshToken",
        res?.data?.results?.refresh_token
      )
      setSignupType("customer")
      setGoogleLoginEmail('')
      router.push("/");
      // handleClose()
    } else {
      notification.error(res?.data?.message)
      setGoogleLoginEmail('')
    }
  }
  const facebookLogin = async (facebookLoginEmail) => {
    const payload = {
      email: facebookLoginEmail,
      // browser: browserName
    }
    const path = pathObj.googleLogin
    const res = await apiPost(path, payload)
    if (res.data.success) {
      notification.success(res?.data?.message)
      // delete res?.data?.results?.subscriptionDetail
      res?.data?.success && setUser(res?.data?.results)
      localStorage.setItem("token", res?.data?.results?.token)
      localStorage.setItem(
        "refreshToken",
        res?.data?.results?.refresh_token
      )
      setSignupType("customer")
      setFacebookLoginEmail('')
      router.push("/");
      // handleClose()
    } else {
      notification.error(res?.data?.message)
      setFacebookLoginEmail('')
    }
  }

  useEffect(() => {
    if (!isEmpty(facebookLoginEmail)) {
      facebookLogin(facebookLoginEmail)
    }
  }, [facebookLoginEmail])

  useEffect(() => {
    if (!isEmpty(googleLoginEmail)) {
      googleLogin(googleLoginEmail)
    }
  }, [googleLoginEmail])

  useEffect(() => {
    setRememberMe(localStorage.getItem('rememberMe'))
  }, [])

  
  useEffect(() => {
    if(!isEmpty(router?.query?.type)){
      setSignupType(router?.query?.type)
    }
    },[router?.query])

  useEffect(() => {
    if (localStorage.getItem('rememberMe')) {
      localStorage.getItem('rememberMe') === 'true' ? true : false
      setValue('mobile',`${localStorage.getItem('countryCode')}${localStorage.getItem('mobile')}`)
      setValue('password',localStorage.getItem('password'))
      // reset({
      //   mobile: `${localStorage.getItem('countryCode')}${localStorage.getItem('mobile')}`,
      //   password: localStorage.getItem('password'),
      // })
    }

  }, [])

  const onSubmit = (data) => {
    data.mobile = data?.mobile?.substring(
      inputRef?.current?.state.selectedCountry?.countryCode?.length,
      data?.mobile?.toString()?.length
    )
    data.countryCode = inputRef?.current?.state.selectedCountry?.countryCode
    if (localStorage.getItem('rememberMe') == 'true') {
      localStorage.setItem('countryCode', data.countryCode)
      localStorage.setItem('mobile', data.mobile)
      localStorage.setItem('password', data.password)
    } else {
      localStorage.removeItem('countryCode')
      localStorage.removeItem('mobile')
      localStorage.removeItem('password')
    }
    loginUser({ ...data, type: signupType })
  }
  const resetPassword = () => { }
  return (
    <>
      <div className='login_outer mainLogin'>
        <Head>
          {/* {
            direction?.eventKey == '1' ? <link href='/css/bootstrap.min.css' rel='stylesheet' ></link>
              : <link rel='stylesheet' href='/css/bootstrap.rtl.min.css' ></link>
          } */}
          <title>
            {t('MADA_PROPERTIES')} : {t('LOGIN')}
          </title>
        </Head>
        <div className='leftSec'>
          <div className='wrap'>
            <div className='mb-3 mb-md-4 mb-lg-5 text-center'>
              <Link href='/'>
                <CustomImage width={228} height={78} src='/images/logo.svg' alt='image' />
              </Link>
            </div>
            <h2 className='mb-3 mb-md-4 mb-lg-5 fw-bold  text-center text-dark fs-3'>
              {t('LOGIN')}
            </h2>

            <Form
              className='container-fluid'
              onSubmit={handleSubmit(onSubmit)}
              method='post'
            >
              <div className='d-flex justify-content-between mb-4 tab_radio'>
                <Form.Check
                  checked={signupType == 'Customer' ? true : false}
                  onChange={(e) => {
                    setSignupType('Customer')
                    resetPassword()
                  }}
                  type='radio'
                  id='radio1'
                  label={t('CUSTOMER')}
                />
                <Form.Check
                  checked={signupType == 'Agent' ? true : false}
                  onChange={(e) => {
                    setSignupType('Agent')
                    resetPassword()
                  }}
                  type='radio'
                  id='radio2'
                  label={t('AGENT')}
                />
                <Form.Check
                  checked={signupType == 'Company' ? true : false}
                  onChange={(e) => {
                    setSignupType('Company')
                    resetPassword()
                  }}
                  type='radio'
                  id='radio3'
                  label={t('COMPANY')}
                />
              </div>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>{t('MOBILE_NUMBER')}</Form.Label>
                <Controller
                  control={control}
                  name='mobile'
                  rules={{
                    required: t('PLEASE_ENTER_MOBILE_NUMBER'),
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
                        width: '100%',
                        height: '48px',
                      }}
                      style={{ borderRadius: '20px' }}
                      country={localStorage.getItem('rememberMe') === 'true' ? "" : defaultCountry}
                      enableSearch
                      countryCodeEditable={false}
                    />
                  )}
                />

                <ErrorMessage message={errors?.mobile?.message} />
              </Form.Group>

              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>{t('PASSWORD')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={!showPassword && 'password'}
                    placeholder='Password'
                    className='border-end-0'
                    name='password'
                    maxLength={16}
                    minLength={8}
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
                      },
                    })}
                  />
                  <InputGroup.Text
                    onClick={() => handleShowPassword()}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? (
                      <img src='./images/hide.png' />
                    ) : (
                      <img src='./images/eye.svg' />
                    )}
                  </InputGroup.Text>
                </InputGroup>

                <ErrorMessage message={errors?.password?.message} />
              </Form.Group>

              <div className='term d-flex align-items-center'>
                <Form.Check
                  type='checkbox'
                  id='remember'
                  checked={rememberMe == 'true' ? true : false}
                  label={t('REMEMBER_ME')}
                  onChange={(e) => handleRememberMe(e)}
                />
                <Link href={`/forgotPassword?type=${signupType}`} className='link ms-auto'>
                  {t('FORGOT_PASSWORD')}
                </Link>
              </div>

              <Button type='submit' className='w-100 d-block py-2 my-3 rounded'>
                {t('LOGIN')}
              </Button>

              <div className='divider position-relative text-center mb-3'>
                <span className='bg-white px-2 fw-medium fs-7 text-dark'>
                  {t('OR')}
                </span>
              </div>

              {signupType === 'Customer' &&
                <div className='social_login d-flex align-items-center mb-4 gap-2'>
                  <FacebookLogin setFacebookLoginEmail={setFacebookLoginEmail} type={'login'} />
                  <GoogleLogin setGoogleLoginEmail={setGoogleLoginEmail} type={'login'} />
                  {/* <a href='#' className='fb'>
                    <img src='images/fb.svg' className='me-2' alt='image' /> Facebook
                  </a> */}
                  {/* <a href='#' className='google ms-2'>
                    <img src='images/google.svg' className='me-2' alt='image' /> Google
                  </a> */}
                </div>}
              <p className='text-center'>
                {t('DON')}&apos;{t('HAVE_AN_ACCOUNT')}{' '}
                <Link href={`/register?type=${signupType}`} className='link fw-medium'>
                  {t('SIGN_UP')}
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
export default Login
