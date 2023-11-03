import React, { useEffect, useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import 'react-phone-input-2/lib/style.css'
import { validationRules } from '../../utils/constants'
import apiPath from '../../utils/apiPath'
import { isEmpty, pick } from 'lodash'
import { apiPost } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { preventMaxInput } from '@/utils/constants'

const ChangePassword = ({ user }) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm()

  const notification = useToastContext()
  const [oldPassToggle, setOldPassToggle] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [conPassToggle, setConPassToggle] = useState(false)

  const onSubmit = async (body) => {
    const obj = pick(body, ['oldPassword', 'newPassword'])
    let api = ''
    if (user.role === 'user') {
      api = apiPath.changePasswordUser
    } else if (user.role === 'company') {
      api = apiPath.changePasswordCompany
    } else {
      api = apiPath.changePasswordAgent
    }
    const { status, data } = await apiPost(api, obj)
    if (status === 200) {
      if (data.success) {
        reset()
        notification.success(data?.message)
      } else {
        notification.error(data?.message)
      }
    } else {
      notification.error(data?.message)
    }
  }

  useEffect(() => {
    if (!isEmpty(watch('confirmPassword'))) {
      if (watch('newPassword')) {
        trigger('confirmPassword')
      }
    }
  }, [watch('newPassword')])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Head>
        <title>
          {t('MADA_PROPERTIES')} : {t('CHANGE_PASSWORD')}
        </title>
      </Head>
      <Row>
        <Row className='pwd'>
          <Col sm={12}>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>{t('OLD_PASSWORD')}</Form.Label>
              <span className='text-danger'>*</span>
              <InputGroup>
                <Form.Control
                  type={!oldPassToggle ? 'password' : 'text'}
                  placeholder={t('ENTER_OLD_PASSWORD')}
                  maxLength={16}
                  minLength={8}
                  onInput={(e) => preventMaxInput(e)}
                  {...register('oldPassword', {
                    required: t('PLEASE_ENTER_OLD_PASSWORD'),
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
                        t('OLD_PASSWORD_MUST_CONTAIN')
                    },
                  })}
                />
                <InputGroup.Text
                  onClick={() => setOldPassToggle(!oldPassToggle)}
                  style={{ cursor: 'pointer' }}
                >
                  {oldPassToggle ? (
                    <img src='./images/hide.png' alt='image' />
                  ) : (
                    <img src='./images/eye.svg' alt='image' />
                  )}
                </InputGroup.Text>
              </InputGroup>
              <ErrorMessage message={errors?.oldPassword?.message} />
            </Form.Group>
          </Col>
          <Col sm={12}>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>{t('NEW_PASSWORD')}</Form.Label>
              <span className='text-danger'>*</span>
              <InputGroup>
                <Form.Control
                  type={!showPassword ? 'password' : 'text'}
                  maxLength={16}
                  minLength={8}
                  placeholder={t('ENTER_PASSWORD')}
                  onInput={(e) => preventMaxInput(e)}
                  {...register('newPassword', {
                    required: t('PLEASE_ENTER_NEW_PASSWORD'),
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
                        t('NEW_PASSWORD_MUST_CONTAIN')
                    }
                  })}
                />
                <InputGroup.Text
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? (
                    <img src='./images/hide.png' />
                  ) : (
                    <img src='./images/eye.svg' />
                  )}
                </InputGroup.Text>
              </InputGroup>
              <ErrorMessage message={errors?.newPassword?.message} />
            </Form.Group>
          </Col>
          <Col sm={12}>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>{t('CONFIRM_PASSWORD')}</Form.Label>
              <span className='text-danger'>*</span>
              <InputGroup>
                <Form.Control
                  placeholder={t('ENTER_CONFIRM_PASSWORD')}
                  onInput={(e) => preventMaxInput(e)}
                  maxLength={16}
                  minLength={8}
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
                      if (!isEmpty(watch('newPassword'))) {
                        if (value == watch('newPassword')) {
                          return true
                        } else {
                          return t('PASSWORD_DOES_NOT_MATCH')
                        }
                      }
                    }
                  })}
                  onChange={(e) => {
                    setValue('confirmPassword', e.target.value, {
                      shouldValidate: true
                    })
                  }}
                />
                <InputGroup.Text
                  onClick={() => setConPassToggle(!conPassToggle)}
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
        <Col>
          <div className='social_achiv_left2 pt-3 mt-3 border-top'>
            <button
              type='submit'
              className='btn_link fw-medium bg-green text-white border-0'
            >
              {t('CHANGE_PASSWORD')}
            </button>
          </div>
        </Col>
      </Row>
    </Form>
  )
}
export default ChangePassword
