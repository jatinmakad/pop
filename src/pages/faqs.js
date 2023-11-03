import { apiGet } from '@/utils/apiFetch'
import React, { useEffect, useState, useContext } from 'react'
import apiPath from '@/utils/apiPath'
import useToastContext from '@/hooks/useToastContext'
import Accordion from 'react-bootstrap/Accordion';
import Head from 'next/head'
import AuthContext from '@/context/AuthContext'
import { useTranslation } from "react-i18next";
import { Container } from 'react-bootstrap';

const Faqs = () => {
  const { t } = useTranslation();
  const { direction } = useContext(AuthContext)
  const notification = useToastContext()
  const [content, setContent] = useState([])

  const getContent = async () => {
    const { status, data } = await apiGet(apiPath.faqs, {})
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
  }, [])
  return (
    <>
      <Head>
        <title>
          Mada Properties : FAQsasda
        </title>
      </Head>

      <section className='faq_page_wrap'>
        <Container>

    
      <h1>{t('FAQ')}</h1>
      <div>
        <Accordion defaultActiveKey="0">
          {
            content?.map((i, key) => (

              <Accordion.Item eventKey={key} key={key}>
                <Accordion.Header> {i[`title${direction?.langKey || ''}`]}</Accordion.Header>
                <Accordion.Body>
                  {i[`content${direction?.langKey || ''}`]}
                </Accordion.Body>
              </Accordion.Item>
            ))
          }
        </Accordion>
      </div>
      </Container>
      </section>
    </>
  )
}
export default Faqs
