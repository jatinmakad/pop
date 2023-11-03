import React, { useEffect, useState } from 'react'
import { Tabs, Form, Button, Tab, Row, Nav } from 'react-bootstrap'
import { apiGet } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import AgentCard from './agents/agentCard'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

function FindAgent() {
	const router = useRouter()
	const [agents, setAgents] = useState([])
	const [tab, setTab] = useState('agent')
	const [data, setData] = useState({})
	const [masterData, setMasterData] = useState({})
	const { t } = useTranslation()
	const [filter, setFilter] = useState({
		page: 1,
		pageSize: 12,
	})
	const [totalDocs, setTotalDocs] = useState(0)
	const [locationSearch, setLocationSearch] = useState('')
	const [locationArrayFiltered, setLocationArrayFiltered] = useState([])
	const [styleNone, setStyleNone] = useState('')
	const [isInitialized, setIsInitialized] = useState(false)
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
	const { register, handleSubmit, reset, watch, setValue } = useForm()

	const getData = async (obj = filter, type = '') => {
		try {
			const { status, data } = await apiGet(apiPath.getAgentCustomer, {
				page: obj?.page || 1,
				pageSize: obj?.pageSize || filter?.pageSize,
				language: obj?.language || '',
				nationality: obj?.nationality || '',
				keyword: obj?.keyword || '',
			})
			if (status == 200) {
				if (data.success) {
					setData(data.results)
					setTotalDocs(data.results.totalDocs)
					if (type == 'add') {
						setAgents([...agents, ...data?.results?.docs])
						setLocationArrayFiltered(data?.results?.docs?.map(item => item?.firstName + ' ' + item?.lastName))
					} else {
						setAgents(data?.results?.docs)
						setLocationArrayFiltered(data?.results?.docs?.map(item => item?.firstName + ' ' + item?.lastName))
					}
				}
			}
		} catch (error) { }
	}

	const onSubmit = (body) => {
		getData(body)
	}

	const getMasterData = async () => {
		const { status, data } = await apiGet(apiPath.masterData)
		if (status === 200) {
			if (data.success) {
				setMasterData(data.results)
			}
		}
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
		setStyleNone(e.target.value)
		if (e.target.value == '') {
			setLocationArrayFiltered([])
		}
	}
	useEffect(() => {
		getData({ ...filter, keyword: locationSearch })
		getMasterData()
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
						{t('MADA_PROPERTIES')} : {t('FIND_AGENT')}
					</title>
				</Head>
				<div className='filter_box'>
					<h1 className='text-white text-center mb-3 pb-2'>{t('FIND_YOUR_AGENT')}</h1>
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
								<Form onSubmit={handleSubmit(onSubmit)} className='position-relative'>
									<div className='filter_main'>
										<div className='search_outer  search_outer_secondary'>
											<button className='bg-transparent border-0'>
												<img src='images/search_outer.svg' />
											</button>
											<Form.Control
												type='text'
												placeholder={t('ENTER_AGENT_NAME')}
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
										{/* <Form.Select className='property_filter'>
                      <option>Service Needed</option>
                      <option value='1'>One</option>
                      <option value='2'>Two</option>
                      <option value='3'>Three</option>
                    </Form.Select>
                    <Form.Select
                      className='property_filter'
                      aria-label='Default select example'
                      {...register('language')}
                    >
                      <option value=''>Select Language</option>
                      {masterData?.language?.length > 0 &&
                        masterData?.language?.map((res, index) => {
                          return (
                            <option key={index} value={res.name}>
                              {res.name}
                            </option>
                          )
                        })}
                    </Form.Select>
                    <Form.Select
                      className='property_filter price_select'
                      aria-label='Default select example'
                      {...register('nationality')}
                    >
                      <option value=''>Select Nationality</option>
                      {masterData?.country?.length > 0 &&
                        masterData?.country?.map((res, index) => {
                          return <option key={index} value={res.name}>{res.name}</option>
                        })}
                    </Form.Select> */}

										<Button type='submit' className='btn theme_btn position-static'>
											{t('SEARCH')}
										</Button>
									</div>
								</Form>
							</Tab>
							<Tab eventKey='companies' title={t('COMPANIES')}>
								<Form className='position-relative'>
									<div className='filter_main'>
										<div className='search_outer  search_outer_secondary'>
											<button className='bg-transparent border-0'>
												<img src='images/search_outer.svg' />
											</button>
											<Form.Control type='text' placeholder={t('ENTER_LOCATION_AGENT_NAME')} />
											<p onClick={() => { }} className=' h-100 d-flex justify-content-center align-items-center border-0 end-0 px-2' style={{ left: 'auto' }}>
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
						</Tabs>
					</div>
				</div>
			</div>
			<div className='main_wrap p-0'>
				<div className='container'>
					<div className='agentWrap'>
						<h3 className='mb-3'>
							{totalDocs} {t('TOTAL_REGISTERED_COUNT')}
						</h3>
						<Row>
							{agents?.length > 0 &&
								agents?.map((item, index) => {
									return <AgentCard type='customer' key={index} item={item} />
								})}
							{agents?.length == 0 && <h2 className='w-100 d-flex justify-content-center'>{t('NO_RECORD_FOUND')}</h2>}
						</Row>
						{data?.totalPages !== data?.page && (
							<div className='text-center loadMore mt-4 mt-md-5 mb-5 mb-xl-0'>
								<Button onClick={() => handelChange()} className='border-green rounded text-green fw-medium fs-5 text-white'>
									{t('LOAD_MORE')}
								</Button>
							</div>
						)}
						{/* <div className='text-center loadMore mt-4 mt-md-5 mb-5 mb-xl-0'>
              <a
                href='#'
                className='border-green rounded text-green fw-medium fs-5'
              >
                Load more...
              </a>
            </div> */}
					</div>
				</div>
			</div>
		</>
	)
}
export default FindAgent
