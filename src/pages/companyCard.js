import React from 'react'
import { Col } from 'react-bootstrap'
import CustomImage from './components/CustomImage'
import Link from 'next/link'
import { useTranslation } from "react-i18next"

const CompanyCard = ({ item }) => {
  const { t } = useTranslation()
  return (
    <Col className='mb-3' sm={6} md={4} lg={3}>
      <div className='box blog_card'>
        <figure className='position-relative'>
          <CustomImage
            width={100}
            height={100}
            src={item?.logo}
            alt='logo'
          />
        </figure>
        <figcaption className='text-center'>
          <Link href={`/company/${item?.slug}`} className='card-title h5 mb-0 text-truncate'>
            {item?.name}
          </Link>
          <p className='card-text'>{item?.authorizationPersonName}</p>
          <p className='card-text ellipsis_text' title={item?.headOffice}>{item?.headOffice}</p>
          <p className='card-text'>{t('AGENTS')} : {item?.agentsCount}</p>
        </figcaption>
        <div className='bg-green d-flex justify-content-around px-1'>
          <p className='text-center text-white ps-2 pe-3 py-1'>
            <span className='d-block fs-18  fw-medium'>{item?.buyCount}</span>
            {t('BUY')}
          </p>
          <p className='text-center text-white px-3 border-x py-1'>
            <span className='d-block fs-18  fw-medium'>
              {item?.rentCount}
            </span>
            {t('RENT')}
          </p>
          <p className='text-center text-white px-2 py-1'>
            <span className='d-block fs-18  fw-medium'>
              {item?.commercialBuyCount + item?.commercialRentCount}
            </span>
            {t('COMMERCIAL_COUNT')}
          </p>

          {/* <p className='text-center text-white ps-2  pe-3 py-1'>
            <span className='d-block fs-18  fw-medium'>{item?.agentsCount}</span>
            Agent
          </p>
          <p className='text-center text-white px-3 py-1'>
            <span className='d-block fs-18  fw-medium'>
              {item?.propertyCount}
            </span>
            Property
          </p> */}
        </div>
      </div>
    </Col>
  )
}

export default CompanyCard