import React, { useEffect, useState, useContext } from 'react'
import CustomImage from './CustomImage'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import helper from '../../utils/helpers'
import AuthContext from '@/context/AuthContext'

function Sidebar({ setSidebar, user, logoutUser, sidebar, handleCloseClick }) {
  const { t } = useTranslation()
  const [image, setImage] = useState('')
  const { direction } = useContext(AuthContext);
  useEffect(() => {
    if (!isEmpty(user)) {
      if (user?.role === 'agent') {
        setImage(user?.profilePic)
      } else if (user?.role === 'company') {
        setImage(user?.logo)
      } else {
        setImage(user?.profile_pic)
      }
    }
  }, [user])
  const handleLogout = () => {
    // if (window.confirm('Are you sure to logout?')) {
    logoutUser()
    // }
  }
  return (
    <>
      <div className='sidebar_main bg-white pb-2'>
        <div className='p-3 p-md-4 border-bottom text-center'>
        
          <div className='sidebar_profile_img'>
            {/* <CustomImage
              width={100}
              height={100}
              className='w-100 h-100'
              src={image}
              alt='profile'
            /> */}
            <img src={image} className='w-100 h-100' />
          </div>
          <h4 className='fw-medium'>
            <span className='fs-7 fw-normal d-block'>{t('WELCOME')}</span>
            {user?.role === 'company' ? user?.name : `${user?.firstName} ${user?.lastName}`}
          </h4>
        </div>
        <ul>
          <li>
            <button
              onClick={() => setSidebar('profile')}
              className={`link bg-transparent border-0 sidelink ${sidebar === 'profile' && 'active'}`}

            >
              <div>
                <img src='./images/profile.svg' alt='' />
              </div>
              {t('MY_PROFILE')}
            </button>
          </li>
          <li>
            <button
              onClick={() => setSidebar('appointments')}
              className={`link bg-transparent border-0 sidelink ${sidebar === 'appointments' && 'active'}`}
            >
              <div>
                <img src='./images/appointment.svg' alt='image' />
              </div>
              {t('APPOINTMENTS')}
            </button>
          </li>
          {user?.role == 'agent' || user?.role == 'company' ? (
            <>
              <li>
                <button
                  onClick={() => setSidebar('propertyApproval')}
                  className={`link bg-transparent border-0 sidelink ${sidebar === 'propertyApproval' && 'active'}`}
                >
                  <div>
                    {' '}
                    <img src='./images/icon1.svg' alt='' />
                  </div>
                  {t('PROPERTY_APPROVAL')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSidebar('reports')}
                  className={`link bg-transparent border-0 sidelink ${sidebar === 'reports' && 'active'}`}
                >
                  <div>
                    {' '}
                    <img src='./images/icon2.svg' alt='' />
                  </div>
                  {t('REPORTS')}
                </button>
              </li>
            </>
          ) : null}
          {user?.role == 'company' && (
            <li>
              <button
                onClick={() => setSidebar('subscriptionPlan')}
                className={`link bg-transparent border-0 sidelink ${sidebar === 'subscriptionPlan' && 'active'}`}
              >
                <div>
                  {' '}
                  <img src='./images/auction.svg' alt='image' />
                </div>
                {t('SUBSCRIPTION_PLAN')}
              </button>
            </li>
          )}
          {/* {user?.role === 'user' && (
            <li>
              <button
                onClick={() => setSidebar('savedProperties')}
                className={`link bg-transparent border-0 sidelink ${sidebar === 'savedProperties' && 'active'}`}
              >
                <div>
                  <img src='./images/saved.svg' alt='image' />
                </div>
                Saved Properties
              </button>
            </li>
          )} */}
          {user?.role == 'user' && (
            <li>
              <button
                onClick={() => setSidebar('auction')}
                className={`link bg-transparent border-0 sidelink ${sidebar === 'auction' && 'active'}`}
              >
                <div>
                  {' '}
                  <img src='./images/auction.svg' alt='image' />
                </div>
                {t('AUCTION_PROPERTIES')}
              </button>
            </li>
          )}
          {/* <li>
            <button
              onClick={() => setSidebar('setting')}
              className={`link bg-transparent border-0 sidelink ${sidebar === 'setting' && 'active'}`}
            >
              <div>
                <img src='./images/setting.svg' alt='' />
              </div>
              Settings
            </button>
          </li> */}
          <li>
            <button onClick={(e) => helper.alertFunction(`${t('ARE_YOU_SURE_YOU_WANT_TO_LOGOUT')}`, '', handleLogout, direction)}
              className={`link bg-transparent border-0 sidelink`}>
              <div>
                <img src='./images/logout.svg' alt='' />
              </div>
              {t('LOGOUT')}{' '}
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}
export default Sidebar
