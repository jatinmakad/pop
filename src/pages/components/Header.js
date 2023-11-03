import AuthContext from '@/context/AuthContext'
import { multiLang } from '@/utils/constants'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Container, Dropdown, Nav, NavLink, Navbar } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import helper from '../../utils/helpers'
import CustomImage from './CustomImage'
import { apiPut } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import classNames from 'classnames'

const countryList = [
	{
		name: 'UAE',
		logo: '/images/country.svg',
		eventKey: '1',
	},
	{
		name: 'Saudi Arabia',
		logo: '/images/saudiArabia.svg',
		eventKey: '2',
	},
]

const languageList = multiLang

function Header() {
	const { t } = useTranslation()
	const [language, setLanguage] = useState(1)
	const { user, logoutUser, setDirection, config, notifications, slugCondition, direction } = useContext(AuthContext)
	const router = useRouter()
	const [route, setRoute] = useState('')
	const [image, setImage] = useState('')
	const [countrySelect, setCountrySelect] = useState({})

	const [languageSelect, setLanguageSelect] = useState({})

	const changeLanguageHandler = (eventKey) => {
		console.log('eventKey', eventKey)
	}

	const changeURLHandler = (item) => {
		if (item?.eventKey == 1) {
			router.push(process.env.NEXT_PUBLIC_AE_DOMAIN_URL)
		} else if (item?.eventKey == 2) {
			router.push(process.env.NEXT_PUBLIC_SA_DOMAIN_URL)
		}
	}

	const handleLanguage = (res) => {
		setDirection(res)
		if (typeof window !== 'undefined') {
			localStorage.setItem('language_dir', JSON.stringify(res))
			if (res.language === 'ar' && document.getElementById('slugAr')) {
				window.location.href = document.getElementById('slugAr').getAttribute('href')
			} else if (res.language === 'en' && document.getElementById('slugEn')) {
				window.location.href = document.getElementById('slugEn').getAttribute('href')
			} else {
				window.location.reload()
			}
		}
	}
	const changeLanguage = async (data) => {
		try {
			console.log("changeLanguage", data)
			const payload = {
				language: data?.language
			}
			var path = apiPath.changeLanguage
			const result = await apiPut(path, payload)
		} catch (error) {
			console.log("error", error)
		}
	}


	const handleClick = () => {
		const elements = document.querySelectorAll('.nav-link.active')
		elements.forEach((element) => {
			element.classList.remove('active')
		})
	}

	useEffect(() => {
		setRoute(router?.route)
	}, [router?.route])

	const getSlug = (slug) => {
		const obj = config?.staticContent?.find((s) => s.slug === slug)
		return `/pages/${obj?.publicSlug}`
	}

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

	useEffect(() => {
		if (config.country === 'Saudi') {
			setCountrySelect(countryList[1])
			if (typeof window !== 'undefined') {
				if (localStorage.getItem('language_dir')) {
					setLanguageSelect(JSON.parse(localStorage.getItem('language_dir')))
				} else {
					setLanguageSelect(languageList[1])
				}
			} else {
				setLanguageSelect(languageList[1])
			}
		} else if (config.country === 'UAE') {
			setCountrySelect(countryList[0])
			if (typeof window !== 'undefined') {
				if (localStorage.getItem('language_dir')) {
					setLanguageSelect(JSON.parse(localStorage.getItem('language_dir')))
				} else {
					setLanguageSelect(languageList[0])
				}
			} else {
				setLanguageSelect(languageList[0])
			}
		}
	}, [config])

	const [expand, setExpand] = useState(false)
	useEffect(() => {
		if (expand) {
			setExpand(false)
		}
	}, [route])

	useEffect(() => {
		if (typeof window !== "undefined" && !isEmpty(user)) {
			if (localStorage.getItem("language_dir")) {
				changeLanguage(JSON.parse(localStorage.getItem("language_dir")))
			} else {
				changeLanguage(direction)
			}
		}
	}, [direction])

	const handleLogout = () => {
		logoutUser()
	}

	const DropDownToggle = () => {
		return (
			<>
				<Dropdown.Toggle variant='success' id='dropdown-basic' className='bg-transparent p-0 border-0 text-dark'>
					<span className='country_tag'>
						<img src={countrySelect?.logo} style={{ width: '26px', height: '26px', borderRadius: '50%' }} alt='image' className='rounded-0' />
					</span>
					{countrySelect?.name}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					{countryList.map((res, index) => {
						return (
							<Dropdown.Item
								key={index}
								value={res}
								onClick={() => {
									setCountrySelect(res)
									changeURLHandler(res)
								}}
							>
								{res.name}
							</Dropdown.Item>
						)
					})}
				</Dropdown.Menu>
			</>
		)
	}

	return (
		<>
			<header className='border-bottom'>
				<Navbar expanded={expand} className='bg-white' expand='xl'>
					<Container fluid>
						<NavLink onClick={handleClick} as={Link} href='/' className={({ isActive, isPending }) => (isPending ? '' : isActive ? 'active' : '')} end>
							<img src='/images/logo.svg' className='header_logo' alt='image' />
						</NavLink>
						<Dropdown className='d-block d-xl-none ms-auto pe-2'>
							<DropDownToggle />
						</Dropdown>
						<Navbar.Toggle
							aria-controls='navbarScroll'
							onClick={() => {
								setExpand(!expand)
							}}
						/>
						<Navbar.Collapse id='navbarScroll' className='header_nav'>
							<Nav className={`m-auto my-2 my-lg-0 ${(user?.role == 'company' || user?.role === 'agent') && 'header-company'}`} navbarScroll>
								{!isEmpty(user) && (user?.role == 'company' || user?.role === 'agent') ? (
									<>
										<Link href='/manage-properties'
											className={classNames('nav-link', { 'active': route === '/manage-properties' })}
										>
											{t('MANAGE_PROPERTIES')}
										</Link>
										{user?.role === 'company' && (
											<Link
												className={classNames('nav-link', { 'active': route === '/myAgents' })} href='/myAgents'>
												{t('MANAGE_AGENTS')}
											</Link>
										)}
										<Link className={classNames('nav-link', { 'active': router?.asPath === getSlug('about-us') })} href={getSlug('about-us')}>
											{t('ABOUT_COMPANY')}
										</Link>
									</>
								) : (
									<>
										{slugCondition?.includes('buy') && (
											<Link href='/buy'
												className={classNames('nav-link', { 'active': route === '/buy' })}
											>
												{t('BUY')}
											</Link>
										)}
										{slugCondition?.includes('rent') && (
											<Link href='/rent'
												className={classNames('nav-link', { 'active': route === '/rent' })}
											>
												{t('RENT')}
											</Link>
										)}
										{slugCondition?.includes('commercial-buy') && (
											<Link href='/commercial'
												className={classNames('nav-link', { 'active': route === '/commercial' })}
											>
												{t('COMMERCIALS')}
											</Link>
										)}
										<Link className={classNames('nav-link', { 'active': route === '/auctionProperties' })} href='/auctionProperties'>
											{t('AUCTION_PROPERTY')}
										</Link>
										<Link className={classNames('nav-link', { 'active': route === '/newProjects' })} href='/newProjects'>
											{t('NEW_PROJECTS')}
										</Link>
										<Link className={classNames('nav-link', { 'active': route === '/findAgent' })} href='/findAgent'>
											{t('FIND_AGENT')}
										</Link>
										<Link className={classNames('nav-link', { 'active': router?.asPath === getSlug('about-us') })} href={getSlug('about-us')}>
											{t('ABOUT_COMPANY')}
										</Link>
									</>
								)}
							</Nav>

							<div className='nav-right'>
								<ul className='list-unstyled d-flex align-items-center mb-0'>
									{!isEmpty(countrySelect) && (
										<li>
											<Dropdown>
												<DropDownToggle />
											</Dropdown>
										</li>
									)}
									{!isEmpty(user) && (
										<li>
											<Link href='/notifications' className='notification-dots position-relative d-block'>
												<CustomImage width={18} height={20} src='/images/notificai.svg' alt='image' />
												{notifications && <span></span>}
											</Link>
										</li>
									)}
									{!isEmpty(user) && user?.role === 'user' && (
										<li>
											<Link href='/myWishlist'>
												<img src='/images/like.svg' alt='image' />
											</Link>
										</li>
									)}
									<li>
										<Dropdown onSelect={changeLanguageHandler}>
											<Dropdown.Toggle variant='success' className='bg-transparent p-0 border-0 text-dark' id='dropdown-basic' value='En'>
												<span className='country_tag'>
													<img src={languageSelect?.logo} style={{ width: '26px', height: '26px', borderRadius: '50%' }} alt='image' className='rounded-0' />
												</span>{' '}
												{languageSelect?.lang}
											</Dropdown.Toggle>

											<Dropdown.Menu>
												{languageList.map((res, index) => {
													return (
														<Dropdown.Item
															eventKey={`${index + 1}`}
															key={index}
															onClick={() => {
																handleLanguage(res)
																// changeLanguage(res)
															}}
														>
															<img src='./images/flag.svg' className='me-2' alt='' /> <span>{res.lang}</span>
														</Dropdown.Item>
													)
												})}
											</Dropdown.Menu>
										</Dropdown>
									</li>
									<li className='user_header'>
										{!isEmpty(user) ? (
											<Dropdown>
												<Dropdown.Toggle variant='success' id='dropdown-basic' className='bg-transparent p-0 border-0 text-dark'>
													<span className='country_tag user-img'>
														<img src={image} className='w-100 h-100 rounded-0' />
														{/* <CustomImage
															width={100}
															height={100}
															className='w-100 h-100'
															src={image}
															alt='profile'
															/> */}
													</span>{' '}
													<small className='logined_username'>{user?.firstName || user?.name}</small>
												</Dropdown.Toggle>
												<Dropdown.Menu className='header-dropdown'>
													<Dropdown.Item as={Link} href='/profile'>
														{t('PROFILE')}
													</Dropdown.Item>
													<Dropdown.Item onClick={() => helper.alertFunction(`${t('ARE_YOU_SURE_YOU_WANT_TO_LOGOUT')}`, '', handleLogout, direction)}>{t('LOGOUT')}</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										) : (
											<Link href='/login' className='btn outline-green-btn'>
												{t('LOGIN')}
											</Link>
										)}
									</li>
								</ul>
							</div>
						</Navbar.Collapse>
					</Container>
				</Navbar>
			</header>
		</>
	)
}
export default Header
