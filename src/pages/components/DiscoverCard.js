import React from 'react'
import { Container } from 'react-bootstrap'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'

const DiscoverCard = () => {
  const { t } = useTranslation()
  var home_search = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1.5,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1.2,
        },
      },
    ],
  };
  return (
    <>
      <section className='home_search_easy'>
        <Container>
          <div className='section_title'>
            <h2>
              {t('CUSTOMER_HOME_SEARCH_MADE')} <span>{t('CUSTOMER_HOME_SEARCH_EASY')}</span>
            </h2>
            <p>{t('CUSTOMER_HOME_DISCOVER')}</p>
          </div>
          <div className='home_search_section'>
            <Slider {...home_search}>
              <div>
                <div className='home_search_card'>
                  <figure className=''>
                    <img src='images/affordable.svg' />
                  </figure>
                  <h3>{t('CUSTOMER_HOME_AFFORDABLE_PRICE')}</h3>
                  <p>
                  {t('CUSTOMER_HOME_AFFORDABLE_PRICE_DATA')}
                  </p>
                </div>
              </div>

              <div>
                <div className='home_search_card'>
                  <figure className=''>
                    <img src='images/payment.svg' />
                  </figure>
                  <h3>{t('CUSTOMER_HOME_EASY_PAYMENT')}</h3>
                  <p>
                  {t('CUSTOMER_HOME_EASY_PAYMENT_DATA')}
                  </p>
                </div>
              </div>

              <div>
                <div className='home_search_card'>
                  <figure className=''>
                    <img src='images/insurance.svg' />
                  </figure>
                  <h3>{t('CUSTOMER_HOME_PROPERTY_INSURANCE')}</h3>
                  <p>
                  {t('CUSTOMER_HOME_PROPERTY_INSURANCE_DATA')}
                  </p>
                </div>
              </div>
            </Slider>
          </div>
        </Container>
      </section>
    </>
  )
}

export default DiscoverCard
