import React, { useEffect } from 'react'
import CustomImage from '../components/CustomImage'
import { useRouter } from 'next/router'
import { apiGet, apiPost } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import useToastContext from '@/hooks/useToastContext'
const BidPaymentFailed = () => {
    
const router = useRouter() 
const notification = useToastContext();
const updatePaymentStatus = async () => {
  const { status, data } = await apiGet(apiPath.getPaymentStatus, router.query)
  if (status === 200) {
    if (data.success) {

    } else {
      notification.error(data?.message)
    }
  } else {
    notification.error(data?.message)
  }
}

useEffect(() => {

  updatePaymentStatus()
}, [router]) 

  return (
    <div className="text-center">
        <div>
            <CustomImage src="/images/failed.png" width={200} height={180}/>
        </div>
    <h1>Failed</h1> 
        <p>Sorry, your payment is failed, Please try again or contact us.</p>
        <p>Payment Reference Id: #{router.query.Id}</p>
        <p>Payment payment Id: #{router.query.paymentId}</p>
    </div>
  )
}

export default BidPaymentFailed