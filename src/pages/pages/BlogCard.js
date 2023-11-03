import Helpers from '@/utils/helpers'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Card } from 'react-bootstrap'
import CustomImage from '../components/CustomImage'
import AuthContext from '@/context/AuthContext'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
const BlogCard = (props) => {
  const { t } = useTranslation()
  const { user, direction } = useContext(AuthContext)
  const { item } = props
  return (
    <div>
      <Card
        className={classNames('mx-2 blog_card', {
          'border border-1': user?.role === 'company',
        })}
      >
        <figure>
          <CustomImage src={item?.image} width={100} height={100} />
        </figure>
        <Card.Body>
          <div className='date'>
            <span>{Helpers.dateFormat(item?.createdAt, 'DD', {language: direction?.langKey})} </span>
            {Helpers.dateFormat(item?.createdAt, 'MMM', {language: direction?.langKey})}
          </div>
          <Card.Title className='fs-5 mb-3 mb-lg-4'>
            <Link href={`/blog/${item?.slug}`}>
              <h3 className='text-dark multiple-text-truncate'>
                {item[`title${direction?.langKey || ""}`]}
              </h3>
            </Link>
          </Card.Title>
          <Link
            href={`/blog/${item?.slug}`}
            className='read_btn text-white text-decoration-none'
          >
            {t('READ_MORE')}
          </Link>
        </Card.Body>
      </Card>
    </div>
  )
}
export default BlogCard
