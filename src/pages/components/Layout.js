import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { useRouter } from 'next/router'
import { layoutCheck } from '@/utils/constants'
import ScrollToTop from 'react-scroll-up'
import CustomImage from './CustomImage'
// Layout.js
const Layout = ({ children }) => {
  const router = useRouter()
  return (
    <div>
      {!layoutCheck?.includes(router?.pathname) && <Header />}
      <main>{children}</main>
      {!layoutCheck?.includes(router?.pathname) && <Footer />}
      {/* <ScrollToTop showUnder={160} duration={100}>
          <CustomImage src={"../images/scroll-up.png"} width={50} height={50} />
        </ScrollToTop> */}
    </div>
  )
}
export default Layout
