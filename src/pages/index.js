import AuthContext from '@/context/AuthContext'
import React, { useContext } from 'react'
import CompanyHome from './companyHome'
import CustomerHome from './customerHome'

export default function Home() {
  const { user } = useContext(AuthContext)
  let check = ['company', 'agent']
  return (
    check.includes(user?.role) ? <CompanyHome /> : <CustomerHome />
  )
}
