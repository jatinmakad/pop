import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import Slider from 'react-slick'
import SliderConfig from '@/utils/slider_config'
import PropertyCard from '../components/properties/PropertyCard'
import apiPath from '../../utils/apiPath'
import { apiGet } from '../../utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useTranslation } from 'react-i18next'

const Rent = () => {
  const { t } = useTranslation()
  const notification = useToastContext();
  const [propertyListing, setPropertyListing] = useState([])
  const getFeaturedProperties = async (data) => {
    try {
      var path = apiPath.propertyRent;
      const result = await apiGet(path, data)
      var response = result?.data?.results
      setPropertyListing(response)
    } catch (error) {
      console.log('error in get all users list==>>>>', error.message)
    }
  }

  const clipboard = (item) => {
    navigator.clipboard.writeText(item);
    notification.success('Link has been copied to clipboard!')
  }

  useEffect(() => {
    getFeaturedProperties()
  }, [])
 
  return (
    <section className='properties_for_rent'>
      <Container>
        <div className='section_title'>
          {/* <h2 className=''>
            {t('NEW_PROPERTY')} <span>{t('CUSTOMER_HOME_RENT')}</span>
          </h2> */}
          <h2>
                  {t("EXCLUSIVE_PROPERTIES_FOR")}&nbsp;
                  <span className="text-green">{t("RENT")}</span>
                </h2>
        </div>
        {
          propertyListing?.length > 0 && 
          <Slider {...SliderConfig.properties_slider} className='SliderNav'>
            {propertyListing?.map((item, index) => {
              return <PropertyCard pageType='rent' clipboard={clipboard} key={index} item={item} getFeaturedProperties={getFeaturedProperties} />;
            })}
          </Slider>
        }
        
      </Container>
    </section>
  )
}

export default Rent
