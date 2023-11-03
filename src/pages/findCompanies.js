import React, { useEffect, useState } from 'react'
import { Tabs, Form, Button, Tab, Row } from 'react-bootstrap'
import { apiGet } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import CompanyCard from './companyCard'
import { isEmpty } from 'lodash'
import Head from 'next/head'
import classNames from 'classnames'
import AgentCard from './agents/agentCard'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

function FindCompanies() {
	const router = useRouter()
	const [company, setCompany] = useState([])
	const [tab, setTab] = useState('agent')
	const [data, setData] = useState({})
	const [totalDocs, setTotalDocs] = useState(0)

	const { t } = useTranslation()

	const [filter, setFilter] = useState({ page: 1, pageSize: 12 })
	const [locationSearch, setLocationSearch] = useState('')
	const [locationArrayFiltered, setLocationArrayFiltered] = useState([])
	const [styleNone, setStyleNone] = useState('')
	const [isInitialized, setIsInitialized] = useState(false)
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
	const { register, handleSubmit, reset, watch, setValue } = useForm()

	const getData = async (obj = filter, type = '') => {
		try {
			const { status, data } = await apiGet(apiPath.getCompanyCustomer, {
				page: obj?.page || 1,
				pageSize: obj?.pageSize || filter?.pageSize,
				keyword: obj?.keyword || '',
			})
			if (status == 200) {
				if (data.success) {
					setData(data.results)
					setTotalDocs(data.results.totalDocs)
					if (type == 'add') {
						setCompany([...company, ...data.results.docs])
						setLocationArrayFiltered(data?.results?.docs?.map(item => item?.name))
					} else {
						setCompany(data.results.docs)
						setLocationArrayFiltered(data?.results?.docs?.map(item => item?.name))
					}
				}
			}
		} catch (error) { }
	}

	const onSubmit = (body) => {
		getData(body)
	}

	const handelChange = () => {
		let obj = {
			...filter,
			page: filter.page + 1,
		}
		setFilter(obj)
		getData(obj, 'add')
	}

	const handelMainSearch = (e) => {
		setValue('keyword', e.target.value)
		setLocationSearch(e.target.value)
		if (e.target.value == '') {
			setLocationArrayFiltered([])
		}
	}
	useEffect(() => {
		getData({ ...filter, keyword: locationSearch })
		// getMasterData()
	}, [filter])

	useEffect(() => {
		setTab(router?.pathname == '/findAgent' ? 'agent' : 'companies')
	}, [])

	useEffect(() => {
		if (!isInitialized) {
			setIsInitialized(true)
		} else if (locationSearch || !filter?.isReset) {
			setFilter({ ...filter, keyword: debouncedSearchTerm ? debouncedSearchTerm : ''})
		}
	}, [debouncedSearchTerm])

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedSearchTerm(locationSearch)
		}, 500)
		return () => {
			clearTimeout(timeoutId)
		}
	}, [locationSearch])

	return (
		<>
			<div className='find_agent position-relative'>
				<Head>
					<title>
						{t('MADA_PROPERTIES')} : {t('FIND_COMPANIES')}
					</title>
				</Head>
				<div className='filter_box'>
					<h1 className='text-white text-center mb-3 pb-2'>{t('FIND_YOUR_COMPANY')}</h1>
					<div className='filter_form_wrap'>
						<Tabs
							defaultActiveKey='buy'
							id='justify-tab-example'
							className='mb-3'
							justify
							activeKey={tab}
							onSelect={(e) => {
								setTab(e)
								if (e == 'companies') {
									router.push('/findCompanies')
								} else if (e == 'agent') {
									router.push('/findAgent')
								}
							}}
						>
							<Tab eventKey='agent' title={t('AGENTS')}>
								<Form className='position-relative'>
									<div className='filter_main'>
										<div className='search_outer search_outer_secondary'>
											<button className='bg-transparent border-0'>
												<img src='images/search_outer.svg' />
											</button>
											<Form.Control type='text' placeholder='Enter company name' />
											<p className=' h-100 d-flex justify-content-center align-items-center border-0 end-0' style={{ left: 'auto' }}>
												<img
													src='./images/crossNew.svg'
													alt='image'
													style={{
														width: '22px',
														height: '22px',
														marginBottom: '-20px',
													}}
												/>
											</p>
										</div>
										<Button className='btn theme_btn position-static'>{t('SEARCH')}</Button>
									</div>
								</Form>
							</Tab>
							<Tab eventKey='companies' title={t('COMPANIES')}>
								<Form onSubmit={handleSubmit(onSubmit)} className='position-relative'>
									<div className='filter_main'>
										<div className='search_outer search_outer_secondary'>
											<button className='bg-transparent border-0'>
												<img src='images/search_outer.svg' />
											</button>
											<Form.Control
												type='text'
												placeholder={t('ENTER_LOCATION_COMPANY_NAME')}
												{...register('keyword', {
													onChange: (e) => {
														handelMainSearch(e)
													}
												})}
											/>
											<div
												className={classNames('search_suggestion_list', {
													'd-none': isEmpty(styleNone),
												})}
											>
												<ul>
													{locationArrayFiltered?.length > 0 ? (
														locationArrayFiltered?.map((suggestion, index) => {
															return (
																<li key={index}>
																	<button
																		type='button'
																		onClick={() => {
																			setLocationSearch(suggestion)
																			setStyleNone('')
																			setValue('keyword', suggestion)
																			setLocationArrayFiltered([])
																		}}
																	>
																		<span> {suggestion}</span>
																	</button>
																</li>
															)
														})
													) : ''}
												</ul>
											</div>
											{!isEmpty(watch('keyword')) && (
												<p
													onClick={() => {
														if (!isEmpty(watch('keyword'))) {
															setLocationSearch('')
															reset()
															getData()
														}
													}}
													className=' h-100 d-flex justify-content-center align-items-center border-0 end-0 px-2'
													style={{ left: 'auto' }}
												>
													<img
														src='./images/crossNew.svg'
														alt='image'
														style={{
															width: '22px',
															height: '22px',
															marginBottom: '-20px',
														}}
													/>
												</p>
											)}
										</div>
										<Button type='submit' className='btn theme_btn position-static'>
											{t('SEARCH')}
										</Button>
									</div>
								</Form>
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>
			<div className='main_wrap p-0'>
				<div className='container'>
					<div className='agentWrap'>
						<h3 className='mb-3'>
							{totalDocs} {t('COMPANY_FOUND')}
						</h3>
						<Row>
							{company?.length > 0 &&
								company?.map((item, index) => {
									return <CompanyCard type='customer' key={index} item={item} />
								})}
							{company?.length == 0 && <h2 className='w-100 d-flex justify-content-center'>{t('NO_RECORD_FOUND')}</h2>}
						</Row>
						{data?.totalPages !== data?.page && (
							<div className='text-center loadMore mt-4 mt-md-5 mb-5 mb-xl-0'>
								<Button onClick={() => handelChange()} className='border-green rounded text-green fw-medium fs-5 text-white'>
									{t('LOAD_MORE')}
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default FindCompanies
