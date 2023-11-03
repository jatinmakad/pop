import { apiGet } from '@/utils/apiFetch'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useContext } from 'react'
import apiPath from '@/utils/apiPath'
import useToastContext from '@/hooks/useToastContext'
import Head from 'next/head'
import { Container } from "react-bootstrap"
import AuthContext from '@/context/AuthContext'
import { useTranslation } from "react-i18next";
const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const router = useRouter()
  const notification = useToastContext()
  const { direction } = useContext(AuthContext)
  const [content, setContent] = useState('')
  const getContent = async () => {
    const { status, data } = await apiGet(apiPath.getContent, {
      slug: 'privacy-policy',
    })
    if (status === 200) {
      if (data.success) {
        setContent(data.results)
      } else {
        notification.error(data?.message)
      }
    } else {
      notification.error(data?.message)
    }
  }
  useEffect(() => {
    getContent()
  }, [router.query])
  return (
    <>
      <Head>
        <title>
          Mada Properties : Privacy Policy
        </title>
      </Head>
      <div className="main_wrap blog_detail">
        <Container>
          <div className="blog-detail-card">
            <div className="border-0 blog-detail-card card">
              <figure><img class="card-img card-img-top w-100" src={content?.image} /></figure>
              <div className="pb-sm-4 card-body">
                <h2 className='mb-3 mb-lg-4'>{t('PRIVACY_POLICY')}</h2>
                <p dangerouslySetInnerHTML={{ __html: content[`content${direction?.langKey || ''}`] }}></p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
export default PrivacyPolicy
