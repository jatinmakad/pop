import Link from 'next/link'
import React from 'react'

const Setting = () => {
  return (
    <div>
      <ul>
        <Link href='/faqs'>
          <li>FAQs</li>
        </Link>
        <Link href='/privacyPolicy'>
          <li>Privacy Policy</li>
        </Link>
        <Link href='/termsandCondition'>
          <li>Terms & Conditions</li>
        </Link>
        <Link href='/contactus'>
          {' '}
          <li>Contact Us</li>
        </Link>
      </ul>
    </div>
  )
}
export default Setting
