import React, { useContext, useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import { Breadcrumb, Container, Col, Row, Modal, Button, Form } from 'react-bootstrap'
import { apiDelete, apiGet, apiPost } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import { apiPut } from '@/utils/apiFetch'
import Helpers from '@/utils/helpers'
import Link from 'next/link'
import { compact, isEmpty, startCase } from 'lodash'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { AlphaInput, constructionStatusObj, imageCheck } from '@/utils/constants'
import AuthContext from '@/context/AuthContext'
import ReportProperty from '../components/properties/ReportProperty'
import CustomImage from '../components/CustomImage'
import PropertyCard from '../components/properties/PropertyCard'
import SliderConfig from '@/utils/slider_config'
import ReactShare from '../components/ReactShare'
import Video from 'yet-another-react-lightbox/plugins/video'
import VideoThumbnail from 'react-video-thumbnail'
import nl2br from 'react-nl2br'
import Head from 'next/head'
import ViewMap from '../property/ViewMap'
import { Controller, useForm } from 'react-hook-form'
import ErrorMessage from '../components/ErrorMessage'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useTranslation } from 'react-i18next'
import ProjectFrom from './ProjectFrom'
import { NextSeo } from 'next-seo'
import { preventMaxInput } from '@/utils/constants'
function PropertyDetail() {
	const { t } = useTranslation()
	const router = useRouter()
	const params = router.query.slug
	const notification = useToastContext()
	const [isReadMore, setIsReadMore] = useState(true)
	const [videoModel, setVideoModel] = useState(false)
	const { user, config, defaultCountry, direction } = useContext(AuthContext)
	const [openReport, setOpenReport] = useState(false)
	const [similarProperty, setSimilarProperty] = useState([])
	const [openMap, setOpenMap] = useState(false)
	const [shareButton, setShareButton] = useState(false)
	const [shareButtonLink, setShareButtonLink] = useState('')
	const [lightBoxType, setLightBoxType] = useState('image')
	const [property, setProperty] = useState({})
	const [images, setImages] = useState([])
	const [open, setOpen] = useState(false)
	const inputRef = useRef(null)
	const [phone, setPhone] = useState('')
	const [nearest, setNearest] = useState()

	const toggleReadMore = () => {
		setIsReadMore(!isReadMore)
	}

	const getPropertyData = async () => {
		try {
			const { status, data } = await apiGet(apiPath.getProjectDetails, {
				slug: router?.query?.slug,
			})
			if (status == 200) {
				if (data.success) {
					setProperty(data?.results)
					setNearest(data?.results?.[`nearestFacility${direction.langKey || ''}`])
				}
			} else {
			}
		} catch (error) { }
	}

	const getData = async () => {
		try {
			const { status, data } = await apiGet(apiPath.getNearByProperties, {
				page: 1,
				limit: 10,
			})
			if (status == 200) {
				if (data.success) {
					setSimilarProperty(data?.results?.docs)
				}
			} else {
			}
		} catch (error) { }
	}

	const generateMapURL = (property) => {
		if (isEmpty(property.location)) return ''
		const baseURL = `https://www.google.com/maps?q=`
		const propertyLocation = [property.location.coordinates[1], property.location.coordinates[0]]
		return `${baseURL}${propertyLocation.join(',')}`
	}

	useEffect(() => {
		getData()
	}, [])

	useEffect(() => {
		if (router?.query?.slug !== undefined) {
			getPropertyData()
		}
	}, [router?.query?.slug])

	const {
		register,
		handleSubmit,
		setValue,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm()

	const onSubmit = async (body) => {
		const obj = {
			name: body?.name,
			email: body?.email,
			slug: router?.query?.slug,
			countryCode: body?.countryCode,
			mobile: body.mobile,
		}
		const { status, data } = await apiPost(apiPath.contactForNewProject, {
			...obj,
		})
		if (status === 200) {
			if (data.success) {
				const mobileCode = defaultCountry === 'ae' ? '+971' : defaultCountry === 'sa' ? '+966' : '+91'
				setPhone(mobileCode)
				reset()
				notification.success(data?.message)
			} else {
				notification.error(data?.message)
			}
		} else {
			notification.error(data?.message)
		}
	}

	const shareFunction = (link) => {
		setShareButtonLink(link)
		setShareButton(true)
	}
	const [imageIndex, setImageIndex] = useState(0)
	const imageDialog = (index) => {
		if (!isEmpty(property) && property?.photos?.length > 0) {
			setOpen(true)
			setLightBoxType('image')
			setImageIndex(index)
			setImages(
				property?.photos?.map((res) => {
					return {
						src: res,
						width: 3840,
						height: 2560,
					}
				})
			)
		}
	}

	const ProjectCategories = ({ propertyCategory }) => {
		const propertyCategoryMapped = propertyCategory?.map((p) => { return p[`name${direction?.langKey || ''}`] })
		return propertyCategoryMapped?.join(', ')
	}

	const detailmobileslider = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	}

	return (
		<>
			<section className='property_detail_banner_mobile d-block d-md-none'>
				<Link id='slugAr' href={`/project/${property?.slugAr || property?.slug}`} style={{ display: 'none' }}></Link>
				<Link id='slugEn' href={`/project/${property?.slug}`} style={{ display: 'none' }}></Link>
				<div className='gallery_status view_btn'>
					<div className='d-flex flex-wrap align-items-center justify-content-between mb-3 '>
						{!isEmpty(property?.threeSixtyView) && property?.threeSixtyView !== null && (
							<Link href={!isEmpty(property) ? property?.threeSixtyView || '#' : '#'} target='_blank' className='d-flex align-items-center text-white me-2 mb-2 mb-sm-0 d-none d-md-inline-block'>
								<CustomImage width={27} height={20} src='/images/360.svg' className='me-2' alt='image' />
							</Link>
						)}
						<div className='d-flex align-items-center'>
							{!isEmpty(property) && property?.photos?.length > 0 && (
								<a
									href='javascript:void(0)'
									onClick={() => {
										imageDialog(0)
									}}
									className='d-flex align-items-center text-white me-2 mb-2 mb-sm-0'
								>
									<CustomImage width={20} height={18} src='/images/camera.svg' className='me-2' alt='image' />
									{/* {t("SHOW")} */}
									{!isEmpty(property) ? property?.photos?.length : 0} {/* {t("PHOTOS")} */}
								</a>
							)}
							{property?.video?.length > 0 && (
								<a
									href='javascript:void(0)'
									onClick={() => {
										if (!isEmpty(property) && property?.video?.length > 0) {
											setOpen(true)
											setLightBoxType('video')
											setImageIndex(0)
											setImages(
												property?.video?.map((res) => {
													return {
														type: 'video',
														width: 1280,
														height: 720,
														sources: [
															{
																src: res,
																type: 'video/mp4',
															},
														],
													}
												})
											)
										}
									}}
									className='d-flex align-items-center text-white me-2 mb-2 mb-sm-0'
								>
									<CustomImage width={20} height={20} src='/images/video_count.svg' className='me-2' alt='image' />
									{/* {t("SHOW")} */}
									{!isEmpty(property) ? property?.video?.length : 0} {/* {t("VIDEOS")} */}
								</a>
							)}
						</div>
					</div>
				</div>

				<Slider {...detailmobileslider}>
					{[{ id: 1 }, { id: 2 }, { id: 3 }].map((img, index) => {
						return (
							<div key={index} className='slider_data'>
								<figure>
									<img src='../images/dtlsliderpic.jpg' />
								</figure>
							</div>
						)
					})}
				</Slider>

				<div className='detail_caption'>
					<div className='container'>
						<div className='mobile_price_field'>
							<div>
								<h2 className='ms-sm-auto text-dark mt-1 mt-sm-0'>
									{Helpers?.priceFormat(property?.startingPrice)} {config?.currency}
								</h2>

								<h2 className='text-dark mb-sm-2'>
									{property?.title?.split(' ')[0]} <span className='text-green'>{property?.title?.split(' ').splice(1, property?.title.split(' ').length).join(' ')}</span>
								</h2>
								{/* <p className="text-white mb-0">
                  Last updated time:{" "}
                  {Helpers?.remainingTimeFromNow(property?.updatedAt)}
                </p> */}
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className='detailBanner position-relative inner-banner d-none d-md-block'>
				<NextSeo title={property?.metaTitle || property?.title} description={property?.metaDescription || ''} keywords={property?.metaKeyword || ''} />
				<CustomImage width={100} height={100} src={!isEmpty(property) && !isEmpty(property?.photos[0]) ? property?.photos[0] : '/images/detail_banner.jpg'} alt='profilePic' />
				<div className='detail_caption'>
					<div className='container'>
						<div className='d-sm-flex align-items-center'>
							<div>
								{/* <h2 className='text-white mb-sm-2'>
									{property?.title?.split(' ')[0]} <span className='text-green'>{property?.title?.split(' ').splice(1, property?.title.split(' ').length).join(' ')}</span>
								</h2> */}
								<h1 className='same_as_h2 text-white mt-3'>
									{/* {property[`title${direction?.langKey || ''}`]?.split(' ')[0]}{' '} */}
									<span className='text-green'>
										{property[`title${direction?.langKey || ''}`]}
									</span>
								</h1>

								{/* <h1 className='same_as_h2 text-white mt-3'>
									{property[`title${direction?.langKey || ''}`]?.split(' ')[0]}{' '}
									<span className='text-green'>
										{property[`title${direction?.langKey || ''}`]
											?.split(' ')
											.splice(1, property[`title${direction?.langKey || ''}`]?.split(' ').length)
											.join(' ')}
									</span>
								</h1> */}


								{/* <p className="text-white mb-0">
                  Last updated time:{" "}
                  {Helpers?.remainingTimeFromNow(property?.updatedAt)}
                </p> */}
							</div>
							<h2 className='ms-sm-auto text-white mt-1 mt-sm-0'>
								{Helpers?.priceFormat(property?.startingPrice)} {config?.currency}
							</h2>
						</div>
					</div>
				</div>
			</div>

			<div className='breadcrum_Main py-3'>
				<Container>
					<Row className='align-items-center'>
						<Col md={7} className='d-none d-md-block'>
							<Breadcrumb>
								<Breadcrumb.Item linkAs={Link} href='/'>
									{t('HOME')}
								</Breadcrumb.Item>
								<Breadcrumb.Item linkAs={Link} href='/newProjects'>
									{t('NEW_PROJECT')}
								</Breadcrumb.Item>
								<Breadcrumb.Item active>{property?.[`title${direction?.langKey || ''}`]}</Breadcrumb.Item>
							</Breadcrumb>
						</Col>
						<Col md={5}>
							<div className='breadcrumb_btn d-flex  align-items-center justify-content-center w-100 flex-wrap flex-md-nowrap mt-3 mt-md-0'>
								<a
									href='javascript:void(0)'
									onClick={() => {
										shareFunction(window.location.href)
									}}
									className='d-flex align-items-center'
								>
									<CustomImage width={20} height={20} src='/images/share.svg' className='me-2' alt='image' />
									{t('SHARE')}
								</a>
								{/* {!isEmpty(user) && user?.role === "user" && (
										<>
											<a
												href="javascript:void(0)"
												onClick={() => {
													if (!isEmpty(property) && !isEmpty(user)) {
														if (property?.wishlistCount == 1) {
															removeWishlistStatus(property?._id);
														} else {
															wishlistStatus(property?._id);
														}
													}
												}}
												className={`d-flex align-items-center mx-2 mx-lg-3 like_tab ${property?.wishlistCount == 1 && "active"}`}
											>
												<CustomImage width={20} height={20} src="/images/like.svg" className="me-2 unfilltbs" alt="image" />
												<CustomImage width={20} height={20} src="/images/savelike.svg" className="me-2 filltbs" alt="image" />
												Save
											</a>
											<a
												href="javascript:void(0)"
												onClick={() => {
													setOpenReport(true);
												}}
												className="d-flex align-items-center"
											>
												<CustomImage width={20} height={20} src="/images/report.svg" className="me-2" alt="image" />
												Report
											</a>
										</>
									)} */}

								<button onClick={() => setOpenMap(true)} className='border d-flex align-items-center rounded text-dark bg-white px-3 fs-14 fw-300 d-md-none view_on_map ms-2 mt-1 mt-md-0'>
									<CustomImage width={20} height={20} src='/images/location.svg' className='me-2 cursor-pointer' alt='image' />
									{t('VIEW_ON_MAP')}
								</button>
							</div>
						</Col>
					</Row>
				</Container>
			</div>

			<div className='main_wrap'>
				<Container>
					<Row>
						<Col lg={8} xl={9}>
							<div className='d-md-flex flex-wrap align-items-center mb-3 view_btn d-none'>
								{!isEmpty(property?.threeSixtyView) && property?.threeSixtyView !== null && (
									<Link href={!isEmpty(property) ? property?.threeSixtyView || '#' : '#'} target='_blank' className='d-flex align-items-center text-white me-2 mb-2 mb-sm-0'>
										<CustomImage width={27} height={20} src='/images/360.svg' className='me-2' alt='image' />
										{t('VIEW_360_TOUR')}
									</Link>
								)}
								{!isEmpty(property) && property?.photos?.length > 0 && (
									<a
										href='javascript:void(0)'
										onClick={() => {
											imageDialog(0)
										}}
										className='d-flex align-items-center text-white me-2 mb-2 mb-sm-0'
									>
										<CustomImage width={20} height={18} src='/images/camera.svg' className='me-2' alt='image' />
										{t('SHOW')} {!isEmpty(property) ? property?.photos?.length : 0} {t('PHOTOS_ONLY')}
									</a>
								)}
								{property?.video?.length > 0 && (
									<a
										href='javascript:void(0)'
										onClick={() => {
											if (!isEmpty(property) && property?.video?.length > 0) {
												setOpen(true)
												setLightBoxType('video')
												setImageIndex(0)
												setImages(
													property?.video?.map((res) => {
														return {
															type: 'video',
															width: 1280,
															height: 720,
															sources: [
																{
																	src: res,
																	type: 'video/mp4',
																},
															],
														}
													})
												)
											}
										}}
										className='d-flex align-items-center text-white me-2 mb-2 mb-sm-0'
									>
										<CustomImage width={20} height={20} src='/images/video_count.svg' className='me-2' alt='image' />
										{t('SHOW')} {!isEmpty(property) ? property?.video?.length : 0} {t('VIDEOS')}
									</a>
								)}
								<button onClick={() => setOpenMap(true)} className='ms-sm-auto border  align-items-center rounded text-dark bg-white mb-2 p-2 mb-sm-0 px-3 fs-14 fw-300 d-none d-md-inline-flex'>
									<CustomImage width={24} height={24} src='/images/location.svg' className='me-2 cursor-pointer' alt='image' />
									{t('VIEW_ON_MAP')}
								</button>
							</div>

							<div className='d-none d-md-block'>
								<Row className='position-relative detial_main_pic gx-2'>
									<Col md={8}>
										<figure
											onClick={() => {
												imageDialog(0)
											}}
											className='large_pic mb-0 cursor-pointer'
										>
											<CustomImage width={100} height={100} src={imageCheck(0, property)} alt='profilePic' />
										</figure>
									</Col>
									<Col md={4} className='d-md-block d-flex right_side_thumb'>
										<figure
											onClick={() => {
												imageDialog(property?.photos?.length - 1 >= 1 ? 1 : 0)
											}}
											className='medium_thumbnail mb-thumb-space cursor-pointer'
										>
											<CustomImage width={100} height={100} src={imageCheck(1, property)} alt='image' />
										</figure>
										<figure
											onClick={() => {
												imageDialog(property?.photos?.length - 1 >= 2 ? 2 : 0)
											}}
											className='medium_thumbnail cursor-pointer'
										>
											<CustomImage width={100} height={100} src={imageCheck(2, property)} alt='image' />
										</figure>
									</Col>
									<div className='col-md-12 thumbnail_main'>
										<ul>
											<li>
												<figure
													onClick={() => {
														imageDialog(property?.photos?.length - 1 >= 3 ? 3 : 0)
													}}
													className='medium_thumbnail cursor-pointer'
												>
													<CustomImage width={100} height={100} src={imageCheck(3, property)} alt='image' />
												</figure>
											</li>
											<li>
												<figure
													onClick={() => {
														imageDialog(property?.photos?.length - 1 >= 4 ? 4 : 0)
													}}
													className='medium_thumbnail cursor-pointer'
												>
													<CustomImage width={100} height={100} src={imageCheck(4, property)} alt='image' />
												</figure>
											</li>
											<li>
												<figure
													onClick={() => {
														if (!isEmpty(property) && !isEmpty(property.video[0])) {
														} else {
															imageDialog(property?.photos?.length - 1 >= 5 ? 5 : 0)
														}
													}}
													className='medium_thumbnail position-relative d-block cursor-pointer'
												>
													{!isEmpty(property) && property?.photos[5] && !isEmpty(property.video[0]) ? (
														<VideoThumbnail videoUrl={property?.video[0]} cors={true} />
													) : (
														<CustomImage width={100} height={100} src={imageCheck(5, property)} alt='image' />
													)}
													{/* {!isEmpty(property) && property?.photos[5] && !isEmpty(property.video[0]) && (
														<span onClick={() => setVideoModel(true)} className='video_icon'>
															<img src='/images/video_icon.svg' alt='image' />
														</span>
													)} */}
													{!isEmpty(property) && property?.photos[5] && !isEmpty(property.video[0]) && (
														<span
															onClick={() => {
																if (!isEmpty(property) && property?.video?.length > 0) {
																	setOpen(true)
																	setLightBoxType('video')
																	setImageIndex(0)
																	setImages(
																		property?.video?.map((res) => {
																			return {
																				type: 'video',
																				width: 1280,
																				height: 720,
																				sources: [
																					{
																						src: res,
																						type: 'video/mp4',
																					},
																				],
																			}
																		})
																	)
																}
															}}
															className='video_icon'
														>
															<img src='/images/video_icon.svg' alt='image' />
														</span>
													)}
												</figure>
											</li>
										</ul>
									</div>
								</Row>
							</div>
							<div className='bg-white p-3 p-md-4'>
								<div className='bg-light rounded p-3'>
									<div className='d-flex align-items-center mb-2 off_plan_wrap'>
										<h3 className='mb-0 fs-5'>{property[`title${direction?.langKey || ''}`]}</h3>
										<p className='text-white bg-danger p-2 px-3 rounded-1 ms-auto mb-1' href='#'>
											{startCase(property?.projectStatus)}
										</p>
									</div>
									<div className='d-md-flex align-items-center flex-wrap'>
										<h4 className='price mb-2 mb-md-0 d-flex align-items-center'>
											<span className='fs-6 text-dark fw-normal me-2'>{t('STARTING_PRICE_FROM')}</span>
											{Helpers?.priceFormat(property?.startingPrice)} {config?.currency}
										</h4>
										<p className='ms-auto mb-0'>
											{t('HANDOVER_DATE')} <span className='fw-medium fs-7'>{Helpers?.dateFormatAppointment(property?.handOverDate, 'DD MMM, YYYY', { language: direction?.langKey })}</span>
										</p>
									</div>
								</div>
							</div>
							<ul className='property_desc project_cols bg-white px-3 py-4 mb-3 rounded'>
								<li>
									<figure className='property_desc_icon mb-0'>
										<img src='/images/home.svg' alt='image' />
									</figure>
									<h6>
										<span>{t('TYPE')}</span>
										<ProjectCategories propertyCategory={property?.propertyCategory} />
									</h6>
								</li>

								<li>
									<figure className='property_desc_icon mb-0'>
										<img src='/images/property.png' alt='image' />
									</figure>
									<h6>
										<span>{t('PROPERTY_SIZE')}</span>
										{property?.minPropertySize} {property?.maxPropertySize && `- ${property?.maxPropertySize}`} {config?.areaUnit}
										{/* {property?.minPropertySize} - {property?.maxPropertySize} {config?.areaUnit} */}
									</h6>
								</li>

								<li>
									<figure className='property_desc_icon mb-0'>
										<img src='/images/bedroom_detail.svg' alt='image' />
									</figure>
									<h6>
										<span>{t('BEDROOMS')}</span>
										{property?.minBedrooms} {property?.maxBedrooms && `- ${property?.maxBedrooms}`}
									</h6>
								</li>
								<li>
									<figure className='property_desc_icon mb-0'>
										<img src='/images/bathroom_detail.svg' alt='image' />
									</figure>
									<h6>
										<span>{t('BATHROOMS')}</span>
										{/* {property?.minBathrooms} Full */}
										{property?.minBathrooms} {property?.maxBathrooms && `- ${property?.maxBathrooms}`}
										{/* {property?.minBathrooms} - {property?.minBathrooms} */}
									</h6>
								</li>
								{property?.pricePerSqFt > 0 &&
									<li>
										<figure className='property_desc_icon mb-0'>
											<img src='/images/property.png' alt='image' />
										</figure>
										<h6>
											<span>{config?.currency}</span>
											{property?.pricePerSqFt}/{config?.areaUnit}
										</h6>
									</li>}
							</ul>

							{/* <div className='bg-white  p-3 p-sm-4 mb-3 rounded'>
								<div className='heading_line'>
									<h3 className='position-relative'>{t('DESCRIPTION')}</h3>
								</div>
								<p>{nl2br(property?.description)}</p>
							</div> */}
							<div className='bg-white  p-3 p-sm-4 mb-3 rounded'>
								<div className='heading_line'>
									<h3 className='position-relative'>{t('DESCRIPTION')}</h3>
								</div>
								{isReadMore ? (
									<p
										dangerouslySetInnerHTML={{
											__html: property[`description${direction?.langKey || ''}`]?.slice(0, 500),
										}}
									></p>
								) : (
									<p
										dangerouslySetInnerHTML={{
											__html: property[`description${direction?.langKey || ''}`],
										}}
									></p>
								)}
								{property[`description${direction?.langKey || ''}`]?.length > 500 && (
									<a href='javascript:void(0)' className='link' onClick={() => toggleReadMore()}>
										{isReadMore ? 'Read more..' : 'Show less..'}
									</a>
								)}
							</div>

							<div className='bg-white p-2 p-sm-3 mb-3 property_feature property_id rounded'>
								<ul>
									{property?.projectId !== '' &&
										<li className='d-flex align-items-center'>
											{t('PROJECT_ID')} <span className='text-green fw-medium ms-1'>{property?.projectId}</span>
										</li>}

									<li>
										{t('LISTED')} <span className='text-green fw-medium ms-1'>{Helpers?.dateFormatAppointment(property?.createdAt, 'DD MMM, YYYY', { language: direction?.langKey })}</span>
									</li>
									{!isEmpty(property?.pricePerSqFt) && property?.pricePerSqFt > 0 &&
										<li>
											{t('PRICE_PER_SQFT')}: <span className='text-green fw-medium ms-1'>{property?.pricePerSqFt}</span>
										</li>
									}
								</ul>
							</div>
							{(property?.minLivingRooms > 0 || property?.minGuestRooms > 0) &&
								<div className='bg-white p-3 p-sm-4 mb-3 property_feature rounded'>
									<div className='heading_line'>
										<h3 className='position-relative'>{t('FEATURES')}</h3>
									</div>
									<ul>
										{(property?.minLivingRooms) > 0 &&
											<li className='d-flex align-items-center'>
												<img src='/images/feature1.svg' alt='image' className='me-2' /> {t('LIVING_ROOM')}:{' '}
												<span className='text-green fw-medium ms-1'>
													{property?.minLivingRooms} {property?.maxLivingRooms && `- ${property?.maxLivingRooms}`}
												</span>
											</li>
										}
										{(property?.minGuestRooms > 0) &&
											<li className='d-flex align-items-center'>
												<img src='/images/feature1.svg' alt='image' className='me-2' /> {t('GUEST_ROOM')}:{' '}
												<span className='text-green fw-medium ms-1'>
													{property?.minGuestRooms} {property?.maxGuestRooms && `- ${property?.maxGuestRooms}`}
												</span>
											</li>
										}
									</ul>
								</div>}
							{(property?.paymentPercent?.length > 0 && property?.paymentPercent?.filter((res) => { return !isEmpty(res?.paymentTitle) && !isEmpty(res?.percentage) })?.length > 0) &&
								<div className='bg-white p-3 p-sm-4 mb-3 property_feature rounded'>
									<div className='heading_line'>
										<h3 className='position-relative'>{t('PAYMENT_PLAN')}</h3>
									</div>
									<ul>
										{property?.paymentPercent?.map((res, index) => {
											if (direction?.langKey == 'Ar') {
												if (!isEmpty(res?.paymentTitleAr)) {
													return <li key={index} className='d-flex align-items-center'>
														{res[`paymentTitle${direction?.langKey || ''}`]} : <span className='text-green fw-medium ms-1'>{res?.percentage}%</span>
													</li>
												}
											} else {
												return <li key={index} className='d-flex align-items-center'>
													{res[`paymentTitle${direction?.langKey || ''}`]} : <span className='text-green fw-medium ms-1'>{res?.percentage}%</span>
												</li>
											}
										})}
										{/* <li className='d-flex align-items-center'>
										{t('TITLE')}: <span className='text-green fw-medium ms-1'>{property?.paymentPercent?.[0]?.paymentTitle}</span>
									</li>
									<li className='d-flex align-items-center'>
										{t('PERCENTAGE')}: <span className='text-green fw-medium ms-1'>{property?.paymentPercent?.[0]?.percentage}</span>
									</li> */}
									</ul>
								</div>}
							{property?.amenities?.length > 0 && (
								<div className='bg-white p-3 p-sm-4 mb-3 property_amenities rounded'>
									<div className='heading_line'>
										<h3 className='position-relative'>{t('AMENITIES')}</h3>
									</div>
									<div className='add_property_tabs  new-add-property'>
										<ul className='d-flex flex-wrap amenities_link amenities_link_unic'>
											{!isEmpty(property) &&
												property?.amenities?.length > 0 &&
												property?.amenities?.map((res, index) => {
													if (res?.icon !== '' && res?.name !== '') {
														if (direction?.langKey == "Ar") {
															if (res?.nameAr !== undefined) {
																return (
																	<li style={{ pointerEvents: "none" }} key={index} className='d-flex align-items-center text-start'>
																		<img className='w-5 h-5 me-2' src={res?.icon} alt={res?.name} />
																		{res[`name${direction?.langKey || ''}`]}
																	</li>
																)
															}
														} else {
															return (
																<li style={{ pointerEvents: "none" }} key={index} className='d-flex align-items-center text-start'>
																	<img className='w-5 h-5 me-2' src={res?.icon} alt={res?.name} />
																	{res[`name${direction?.langKey || ''}`]}
																</li>
															)
														}
													}
												})}
										</ul>
									</div>
								</div>
							)}
							<div className='bg-white p-3 p-sm-4 mb-3 property_feature rounded'>
								<div className='heading_line d-sm-flex align-items-center mb-3 mb-sm-4'>
									<h3 className='position-relative mb-0'>{t('LOCATION')}</h3>
									{!isEmpty(
										compact([
											property?.building,
											property?.street,
											property?.subCommunity,
											property?.community,
											property?.city,
										]).join(', ')
									) && (
											<p title={compact([
												property?.building,
												property?.street,
												property?.subCommunity,
												property?.community,
												property?.city,
											]).join(', ')} className='mb-0 mt-2 mt-sm-0 ms-auto d-flex align-items-center text-truncate'>
												<CustomImage width={24} height={24} src='/images/location.svg' alt='location_icon' className='me-2' />
												{compact([
													property?.building,
													property?.street,
													property?.subCommunity,
													property?.community,
													property?.city,
												]).join(', ')}
											</p>
										)}
								</div>
								<div className='mb-4'>
									{/* <a href={generateMapURL(property)} target="_blank"> */}
									<CustomImage width={900} onClick={() => setOpenMap(true)} height={350} src={property?.locationImage} className='w-100 text-center' alt='image' />
									{/* </a> */}
								</div>
								<div className='p-3 p-md-4 facility mb-3'>
									<h3>{t('NEAREST_FACILITIES')}</h3>
									{nearest &&
										nearest?.map((item, index) => (
											!isEmpty(item) && (
												<ul key={index}>
													<li>{item ? nl2br(item) : null}</li>
												</ul>

											)
										))}
								</div>
								{/* {!isEmpty(property?.[`nearestFacility${direction?.langKey || ''}`]) && (
									<div className='p-3 p-md-4 facility mb-3'>
										<h3>{t('NEAREST_FACILITIES')}</h3>
										<ul>
											<li>{property?.[`nearestFacility${direction?.langKey || ''}`] ? nl2br(property?.[`nearestFacility${direction?.langKey || ''}`]) : null}</li>
										</ul>
									</div>
								)} */}
							</div>
							{/* {property?.paymentPercentOnBooking == null && property?.paymentPercentDuringConstruction == null && property?.paymentPercentOnHandover == null ? (
								''
							) : (
								<div className='bg-white p-3 p-sm-4 mb-3 payment_plan rounded'>
									<div className='heading_line mb-3 mb-sm-4'>
										<h3 className='position-relative mb-0'>{t('PAYMENT_PLAN')}</h3>
									</div>
									<Row className='justify-content-center'>
										{property?.paymentPercentOnBooking > 0 && (
											<Col md={4} sm={6}>
												<div className='border p-3 bg-light text-center rounded mb-3 mb-md-0 payment_plan_sm_wrap'>
													<span className='fw-medium text-dark'>{property?.paymentPercentOnBooking || 0}% </span>
													{t('ON_BOOKING')}
												</div>
											</Col>
										)}
										{property?.paymentPercentDuringConstruction > 0 && (
											<Col md={4} sm={6}>
												<div className='border p-3 bg-light text-center rounded mb-3 mb-md-0 payment_plan_sm_wrap'>
													<span className='fw-medium text-dark'>{property?.paymentPercentDuringConstruction || 0}% </span>
													{t('DURING_CONSTRUCTION')}
												</div>
											</Col>
										)}
										{property?.paymentPercentOnHandover > 0 && (
											<Col md={4} sm={6}>
												<div className='border p-3 bg-light text-center rounded mb-3 mb-md-0 payment_plan_sm_wrap'>
													<span className='fw-medium text-dark'>{property?.paymentPercentOnHandover || 0}% </span>
													{t('ON_HANDOVER')}
												</div>
											</Col>
										)}
									</Row>
								</div>
							)} */}

							{property?.floorPlan?.length > 0 && (
								<div className='bg-white p-3 p-sm-4 mb-3 floor_plan rounded'>
									<div className='heading_line mb-3 mb-sm-4 d-sm-flex align-items-center'>
										<h3 className='position-relative mb-0'>{t('FLOOR_PLANS')}</h3>
									</div>
									<div className='FloorPlanSlider'>
										<Slider {...SliderConfig.floorPlanSlider} className='SliderNav'>
											{property?.floorPlan?.map((res, index) => {
												return (
													<div key={index}>
														<div className='mx-2 text-center border floor-card'>
															<img src={res?.image} className='mw-100 mb-2' alt={res.image} />
															<h3>{direction?.langKey == "Ar" ? res?.titleAr : res.title}</h3>
														</div>
													</div>
												)
											})}
										</Slider>
									</div>
								</div>
							)}
						</Col>
						<Col lg={4} xl={3}>
							<div className='sidebar'>
								<div className='agent_detail px-3 pt-2 pb-3 bg-white mb-3'>
									<div className='text-center pt-5 user-agent-img'>
										<figure>
											<CustomImage width={50} height={50} src={property?.developerImage} alt='image' />
										</figure>
										<h6 className='mt-2 mb-3'>{property[`developerName${direction?.langKey || ''}`]}</h6>
										<img src='/images/sidebar_logo.svg' alt='image' />
									</div>
									{/* <ProjectFrom
                    handleSubmit={handleSubmit}
                  /> */}
									<Form onSubmit={handleSubmit(onSubmit)} className='sidebar_form'>
										<h4 className='text-center'>{t('CONTACT_MADA_PROPERTIES')}</h4>
										<Form.Group className='mb-3' controlId=''>
											<Form.Label className='fs-7'>
												{t('NAME')}
												<span className='text-danger'>*</span>
											</Form.Label>
											<Form.Control
												type='text'
												maxLength={15}
												placeholder={t('NAME')}
												onInput={(e) => preventMaxInput(e)}
												{...register('name', {
													required: {
														value: true,
														message: t('PLEASE_ENTER_NAME'),
													},
													minLength: {
														value: 2,
														message: t('MINIMUM_LENGTH'),
													},
													maxLength: {
														value: 15,
														message: t('MAXIMUM_LENGTH_MUST_BE_15'),
													},
												})}
												// onChange={(e) =>
												//   setValue("name", e.target.value?.trim(), {
												//     shouldValidate: true,
												//   })
												// }
												onKeyPress={AlphaInput}
											/>
											<ErrorMessage message={errors?.name?.message} />
										</Form.Group>
										<Form.Group className='mb-3' controlId='formBasicEmail'>
											<Form.Label className='fs-7'>
												{t('EMAIL_ADDRESS')}
												<span className='text-danger'>*</span>
											</Form.Label>
											<Form.Control
												type='email'
												placeholder={t('ENTER_EMAIL')}
												{...register('email', {
													required: t('PLEASE_ENTER_EMAIL'),
													pattern: {
														value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
														message: t('INVALID_EMAIL_ADDRESS'),
													},
												})}
											/>
											<ErrorMessage message={errors?.email?.message} />
										</Form.Group>
										<Form.Group className='mb-3' controlId=''>
											<Form.Label>
												{t('MOBILE_NUMBER')}
												<span className='text-danger'>*</span>
											</Form.Label>
											<PhoneInput
												enableSearch
												searchStyle={{
													alignItems: 'center',
													width: '90%',
												}}
												country={defaultCountry}
												value={JSON.stringify(phone)}
												name='mobile'
												{...register('mobile', {
													required: t('PLEASE_ENTER_MOBILE_NUMBER'),
													validate: (value) => {
														let inputValue = value
														if (inputValue?.length < 5) {
															return t('MOBILE_NUMBER_MUST_CONTAIN_AT_LEAST_5_DIGITS')
														} else if (inputValue?.length > 12) {
															return t('MOBILE_NUMBER_SHOULD_NOT_EXCEED_12_DIGITS')
														} else {
															return true
														}
													},
												})}
												onChange={(value, data) => {
													setValue('countryCode', `${data?.dialCode}`, {
														shouldValidate: true,
													})
													setValue('mobile', value?.slice(data?.dialCode?.length), {
														shouldValidate: true,
													})
													setPhone(data?.dialCode + value?.slice(data?.dialCode?.length))
												}}
												containerStyle={{
													height: '48px',
													outline: 0,
												}}
												dropdownStyle={{
													zIndex: 100,
													maxHeight: '150px',
													outline: 0,
												}}
												inputStyle={{
													width: '100%',
													height: '48px',
													outline: 0,
													paddingLeft: '49px',
												}}
											/>
											<ErrorMessage message={errors?.mobile?.message} />
										</Form.Group>

										<div className='social_achiv_left d-flex align-items-center justify-content-center fs-7 pt-3 mt-3 border-top'>
											<button type='submit' className='btn_link bg-green text-white  w-100 border-0'>
												{t('REQUEST_DETAILS')}
											</button>
											<a href={`tel:${9112345678}`} className='ms-2 btn_link d-flex align-items-center bg-green text-white w-100 justify-content-center'>
												<img src='/images/call.svg' className='me-sm-2' /> {t('CALL')}
											</a>
										</div>
									</Form>
								</div>
								<div className='text-center'>
									<img src='/images/ad2.jpg' alt='image' />
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
			{open && <Lightbox open={open} plugins={[lightBoxType == 'video' ? Video : Thumbnails]} close={() => setOpen(false)} slides={images} index={imageIndex} />}
			{openReport && <ReportProperty open={openReport} onClose={() => setOpenReport(false)} id={property?._id} />}
			{videoModel && !isEmpty(property) && property?.video?.length > 0 && (
				<Modal size='xl' fullscreen='xl-down' show={videoModel} onHide={() => setVideoModel(false)}>
					<Modal.Header className='d-flex justify-content-center' closeButton>
						<Modal.Title>{t('VIDEO')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{' '}
						<figure className=''>
							<video
								style={{
									height: '100%',
									width: '100%',
								}}
								autoPlay
								src={property?.video[0]}
								type='video/mp4'
								controls
							/>
						</figure>
					</Modal.Body>
				</Modal>
			)}
			{openMap && property?.location?.coordinates?.length > 0 && <ViewMap type="project" property={property} openMap={openMap} setOpenMap={setOpenMap} location={property?.location} property_address={property?.address} />}
			{shareButton && !isEmpty(shareButtonLink) && <ReactShare shareButton={shareButton} setShareButton={setShareButton} link={shareButtonLink} />}
		</>
	)
}

export default PropertyDetail
