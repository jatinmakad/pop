import { Form, Button } from 'react-bootstrap'
import React, { useContext, useEffect, useState } from 'react'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import { apiPost } from '@/utils/apiFetch'
import apiPath from '../utils/apiPath'
import AuthContext from '@/context/AuthContext'
import { useForm } from 'react-hook-form'
import ErrorMessage from './components/ErrorMessage'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { preventMaxInput } from '@/utils/constants'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import CustomImage from './components/CustomImage'

function ForgotPassword() {
  const { t } = useTranslation()
  const notification = useToastContext()
  const [signupType, setSignupType] = useState('Customer')
  const { setResetPasswordData, direction } = useContext(AuthContext)
  const router = useRouter()
  // console.log(router?.query?.type,'router')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (body) => {
    let api = ''
    if (signupType == 'Company') {
      api = apiPath.forogtPasswordCompany
    } else if (signupType == 'Customer') {
      api = apiPath.forogtPasswordCustomer
    } else {
      api = apiPath.forogtPasswordAgent
    }
    const { status, data } = await apiPost(api, body)
    if (status === 200) {
      if (data.success) {
        notification.success(data.message)
        setResetPasswordData({ ...body, type: signupType })
        router.push('/resetPassword')
      } else {
        notification.error(data.message)
      }
    } else {
      notification.error(data.message)
    }
  }

  useEffect(() => {
  if(!isEmpty(router?.query?.type)){
    setSignupType(router?.query?.type)
  }
  },[router?.query])

  return (
    <>
      <div className='login_outer mainLogin'>
        <Head>
          {/* {
            direction?.eventKey == '1' ? <link href="/css/bootstrap.min.css" rel="stylesheet" ></link>
              : <link rel="stylesheet" href="/css/bootstrap.rtl.min.css" ></link>
          } */}
          <title>
            {t('MADA_PROPERTIES')} : {t('FORGOT_PASSWORD')}
          </title>
        </Head>
        <div className='leftSec'>
          <div className='wrap'>
            <div className='mb-3 mb-md-4 mb-lg-5 text-center'>
                <Link href="/" className="auth_logo">
                  <CustomImage width={228} height={78} src='/images/logo.svg' alt="logo" />
                </Link>
            </div>
            <h2 className='mb-3 mb-md-4 mb-lg-5 fw-bold  text-center text-dark fs-3'>
              {t('FORGOT_PASSWORD')}
            </h2>
            <Form onSubmit={handleSubmit(onSubmit)} className='container-fluid'>
            <div className='d-flex justify-content-between mb-4 tab_radio'>
              <Form.Check
                checked={signupType === 'Customer' ? true : false}
                onChange={(e) => {
                  router.push("/forgotPassword?type=Customer")
                  setSignupType('Customer')
                }}
                type='radio'
                id='radio1'
                label={t('CUSTOMER')}
              />
              <Form.Check
                checked={signupType === 'Agent' ? true : false}
                onChange={(e) => {
                  router.push("/forgotPassword?type=Agent")
                  setSignupType('Agent')
                }}
                type='radio'
                id='radio2'
                label={t('AGENT')}
              />
              <Form.Check
                checked={signupType === 'Company' ? true : false}
                onChange={(e) => {
                  router.push("/forgotPassword?type=Company")
                  setSignupType('Company')
                }}
                type='radio'
                id='radio3'
                label={t('COMPANY')}
              />
            </div>
            
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>{t('EMAIL_ADDRESS')}</Form.Label>
                <Form.Control
                  id='email'
                  type='text'
                  placeholder={t('ENTER_EMAIL')}
                  onInput={(e) => preventMaxInput(e)}
                  {...register('email', {
                    required: t('PLEASE_ENTER_EMAIL'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('INVALID_EMAIL_ADDRESS')
                    }
                  })}
                />
                <ErrorMessage message={errors?.email?.message} />
              </Form.Group>
              <Button type='submit' className='w-100 d-block py-2 my-3 rounded'>
                {t('SUBMIT')}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
export default ForgotPassword
