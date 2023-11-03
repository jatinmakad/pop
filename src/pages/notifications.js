import { apiGet } from '@/utils/apiFetch'
import React, { useState, useEffect, useContext } from 'react'
import { Button } from 'react-bootstrap'
import apiPath from '@/utils/apiPath'
import useToastContext from '@/hooks/useToastContext'
import dayjs from 'dayjs'
import Head from 'next/head'
import AuthContext from '@/context/AuthContext'
import { useTranslation } from 'react-i18next'
import CustomImage from './components/CustomImage'
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const Notifications = () => {
  const { t } = useTranslation()
  const [content, setContent] = useState([])
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const notification = useToastContext()
  const { user,checkNotification } = useContext(AuthContext)
  const getContent = async (page = page,type) => {
    let api = ''
    if (user?.role === 'user') {
      api = apiPath?.getUserNotification
    } else if (user?.role === 'company') {
      api = apiPath?.notifications
    } else {
      api = apiPath?.agentNotification
    }
    const { status, data } = await apiGet(api, { page,pageSize:10 })
    if (status === 200) {
      checkNotification()
      if (data.success) {
        setData(data.results)
        if (type == "add") {
          setContent([...content, ...data.results.docs])
        } else {
          setContent(data.results.docs)
        }
      } else {
        notification.error(data?.message)
      }
    } else {
      notification.error(data?.message)
    }
  }
  const moreData = () => {
    setPage(page + 1)
    getContent(page + 1,'add')
  }
  useEffect(() => {
    getContent()
  }, [user])


  return (
    <div class='container mt-3'>
      <Head>
        <title>
          Mada Properties : Notifications
        </title>
      </Head>
      <h2 className='mb-2'>{t("NOTIFICATIONS")}</h2>
      {
        content?.map((i, key) => (
          <div key={key} class='container mb-3'>
            <ul class='list-group notification_list'>
              <li class='list-group-item'>
                <figure><CustomImage width={20} height={20} src="./images/notificai.svg"/></figure>
                <figcaption>
                <div class='d-flex justify-content-between align-items-center'>
                  <h5 class='mb-1'>{i?.title}</h5>
                  <small>{dayjs(i?.createdAt).fromNow()}</small>
                </div>
                <p class='mb-1'>{i?.description}</p>
                </figcaption>
              </li>
            </ul>
          </div>
        ))
      }
      {/* {
        data?.totalDocs > content.length ? (
          <button className='btn btn-success item-center' onClick={() => moreData()}>Load More</button>
        ) : ''
      } */}
      {data?.totalPages !== data?.page ? (
        <div className='text-center loadMore mt-4 mt-md-5 mb-5 '>
          <Button
            onClick={() => moreData()}
            className='border-green rounded text-green fw-medium fs-5 text-white'
          >
            {t('LOAD_MORE')}
          </Button>
        </div>
      ) : ''}
    </div>

  )
}

export default Notifications