import React from 'react'
import { Container } from 'react-bootstrap'
import SaleSlider from './Sliders/SaleSlider'
import { useTranslation } from 'react-i18next'
const Sale = ({ type }) => {
  const { t } = useTranslation()
  return (
    <section className='newProperty'>
      <Container>
        <div className='section_title'>
          <h2 className='text-white'>
            {t("EXCLUSIVE_PROPERTY")}&nbsp;
            <span className="text-green">{t("SALE")}</span>
          </h2>
          {/* <h2 className='text-white'>
            {t('NEW_PROPERTY')} <span>{t('NEW_PROPERTY_SALE')}</span>
          </h2> */}
        </div>
        <SaleSlider type={type} />
      </Container>
    </section>
  )
}

export default Sale