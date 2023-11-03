import React, { useContext, useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import { Breadcrumb, Container, Col, Row, Modal, Button, Form, FloatingLabel } from 'react-bootstrap'
import { apiDelete, apiGet, apiPost } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import Helpers from '@/utils/helpers'
import Link from 'next/link'
import { get as __get, compact, isEmpty, isNumber } from "lodash";
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { constructionStatusObj, constructionStatusObjAr, financialStatusAr, furnishedTypeAr, imageCheck, layoutTypeAr, parkingTypeAr, readyStageAr, stageTypeAr } from '@/utils/constants'
import AuthContext from '@/context/AuthContext'
import ReportProperty from '../components/properties/ReportProperty'
import CustomImage from '../components/CustomImage'
import PropertyCard from '../components/properties/PropertyCard'
import ViewMap from './ViewMap'
import SliderConfig from '@/utils/slider_config'
import ReactShare from '../components/ReactShare'
import Video from 'yet-another-react-lightbox/plugins/video'
import ScheduleMeeting from './ScheduleMeeting'
import MortgageCalculator from './MortgageCalculator'
import VideoThumbnail from 'react-video-thumbnail'
import EmailDialogbox from '../components/EmailDialogbox'
import { useTranslation } from 'react-i18next'
import { NextSeo } from 'next-seo'
import dayjs from 'dayjs'
import classNames from 'classnames'
import PlaceBid from '../components/properties/PlaceBid'


var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);

function PropertyDetail() {
	const router = useRouter()
	const { t } = useTranslation()
	const notification = useToastContext()
	const { adminInfo, direction, adsList } = useContext(AuthContext)
	const [email, setEmail] = useState(false)
	const [isReadMore, setIsReadMore] = useState(true)
	const [videoModel, setVideoModel] = useState(false)
	const { user, config } = useContext(AuthContext)
	const [openReport, setOpenReport] = useState(false)
	const [similarProperty, setSimilarProperty] = useState([])
	const [openMap, setOpenMap] = useState(false)
	const [shareButton, setShareButton] = useState(false)
	const [shareButtonLink, setShareButtonLink] = useState('')
	const [lightBoxType, setLightBoxType] = useState('image')
	const [meetingModel, setMeetingModel] = useState(false)
	const [property, setProperty] = useState({})
	const [images, setImages] = useState([])
	const [open, setOpen] = useState(false)
	const [monthlyMortgage, setMonthlyMortgage] = useState(0)
	const [imageIndex, setImageIndex] = useState(0)

	const getPropertyData = async () => {
		try {
			const { status, data } = await apiGet(apiPath.getPropertyDetailsCompany + router?.query?.slug)
			if (status == 200) {
				if (data.success) {
					setProperty(data?.results)
					if (!data?.results?.forAuction) {
						getData(data?.results?._id)
					}
				} else {
					if(data?.message == 'Unauthorized Property.'){
						router?.push('/')
					}
				}
			} else {
			}
		} catch (error) { }
	}

	const toggleReadMore = () => {
		setIsReadMore(!isReadMore)
	}

	const getData = async (id) => {
		try {
			const { status, data } = await apiGet(apiPath.getNearByProperties, {
				propertyId: id,
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
		if (router?.query?.slug !== undefined) {
			getPropertyData()
		}
	}, [router?.query?.slug])

	const wishlistStatus = async (id) => {
		try {
			const { status, data } = await apiPost(apiPath.addToWishlist, {
				propertyId: id,
			})
			if (status == 200) {
				if (data.success) {
					notification.success(data?.message)
					getPropertyData()
				} else {
					notification.error(data?.message)
				}
			} else {
				notification.error(data?.message)
			}
		} catch (error) {
			notification.error(error?.message)
		}
	}

	const removeWishlistStatus = async (id) => {
		try {
			const { status, data } = await apiDelete(apiPath.removeToWishList, {
				propertyId: id,
			})
			if (status == 200) {
				if (data.success) {
					notification.success(data?.message)
					getPropertyData()
				} else {
					notification.error(data?.message)
				}
			} else {
				notification.error(data?.message)
			}
		} catch (error) {
			notification.error(error?.message)
		}
	}
	const [bidData, setBidData] = useState();
	const [statusPlaceBid, setStatusPlaceBid] = useState(false);
	const handlePlaceBid = (data) => {
		if (user?.loginType === "social" && !user?.mobile) {
			notification.error("Please update mobile number before placing a bid.");
			router.push("/profile");
		} else if (!isEmpty(user)) {
			setStatusPlaceBid(!statusPlaceBid);
			setBidData(data);
		} else {
			notification.error("Please login to make bid");
		}
	};

	const handleBidModelClick = () => {
		setStatusPlaceBid(!statusPlaceBid);
	};

	const shareFunction = (link) => {
		setShareButtonLink(link)
		setShareButton(true)
	}
	const monthly = (value) => {
		setMonthlyMortgage(value)
	}


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

	const priceFormat = (item) => {
		if (isNumber(item?.priceDaily) && item?.priceDaily > 0) {
			return t('/DAY')
		} else if (isNumber(item?.priceWeekly) && item?.priceWeekly > 0) {
			return t('/WEEK')
		} else if (isNumber(item?.priceMonthly) && item?.priceMonthly > 0) {
			return t('/MONTH')
		} else if (isNumber(item?.priceYearly) && item?.priceYearly > 0) {
			return t('/YEAR')
		} else {
			return ''
		}
	}

	const priceFormatType = (item) => {
		if (item?.propertyType?.slug == 'rent' || item?.propertyType?.slug == 'commercial-rent') {
			if (isNumber(item?.priceDaily) && item?.priceDaily > 0) {
				return item?.priceDaily
			} else if (isNumber(item?.priceWeekly) && item?.priceWeekly > 0) {
				return item?.priceWeekly
			} else if (isNumber(item?.priceMonthly) && item?.priceMonthly > 0) {
				return item?.priceMonthly
			} else if (isNumber(item?.priceYearly) && item?.priceYearly > 0) {
				return item?.priceYearly
			}
		} else {
			return item?.price
		}
	}

	const detailmobileslider = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	}

	const auctionStatus = {
		live_auction: t("LIVE_AUCTION"),
		upcoming: t("UPCOMING"),
		closed: t("CLOSED"),
	};

	const GetAuctionData = ({ auctionProperty = {}, type }) => {
		const auctionStartDateTime = dayjs(auctionProperty.auctionStartDateTime);
		const auctionEndDateTime = dayjs(auctionProperty.auctionEndDateTime);
		const currentDate = dayjs();
		let status = null;
		if (
			dayjs(currentDate).isBetween(auctionStartDateTime, auctionEndDateTime)
		) {
			status = "live_auction";
		} else if (dayjs(currentDate).isSameOrBefore(auctionStartDateTime)) {
			status = "upcoming";
		} else if (dayjs(currentDate).isSameOrAfter(auctionEndDateTime)) {
			status = "closed";
		}
		if (type == "status") {
			return (
				<div>
					<span
						className={classNames("apartment px-2 py-2", {
							bg_red: status === "live_auction",
							"bg-green": status === "upcoming",
							"bg-dark": status === "closed",
						})}
					>
						{auctionStatus[status]}
					</span>
				</div>
			);
		} else if (type == "bidButton") {
			if (status === "live_auction") {
				return (
					<button
						className="theme_btn btn ms-sm-2"
						disabled={property?.userBidCount == 1 ? true : false}
						onClick={() => handlePlaceBid(auctionProperty)}
					>
						{t("PLACE_BID")}
					</button>
				);
			}
		}
	};


	const getLive = (auctionProperty = {}) => {
		const auctionStartDateTime = dayjs(auctionProperty.auctionStartDateTime);
		const auctionEndDateTime = dayjs(auctionProperty.auctionEndDateTime);
		const currentDate = dayjs();
		let status = false;
		if (dayjs(currentDate).isBetween(auctionStartDateTime, auctionEndDateTime)) status = true;
		return status;
	};
	const getClose = (auctionProperty = {}) => {
		const auctionStartDateTime = dayjs(auctionProperty.auctionStartDateTime);
		const auctionEndDateTime = dayjs(auctionProperty.auctionEndDateTime);
		const currentDate = dayjs();
		let status = false;
		if (dayjs(currentDate).isSameOrAfter(auctionEndDateTime)) status = true;
		return status;
	};

	return (
		<>
			<section className='property_detail_banner_mobile d-block d-md-none'>
				<Link id='slugAr' href={`/property/${property?.slugAr || property?.slug}`} style={{ display: 'none' }}></Link>
				<Link id='slugEn' href={`/property/${property?.slug}`} style={{ display: 'none' }}></Link>
				<div className='gallery_status view_btn'>
					<div className='d-flex flex-wrap align-items-center justify-content-between mb-3 '>
						{!isEmpty(property?.threeSixtyView) && property?.threeSixtyView !== null && (
							<Link
								href={!isEmpty(property) ? property?.threeSixtyView || '#' : '#'}
								target='_blank'
								className='d-flex align-items-center text-white me-2 mb-2 mb-sm-0 d-inline-block d-md-none mobile_text_hide'
							>
								<CustomImage width={27} height={20} src='/images/360.svg' className='me-2' alt='image' />
								{t('VIEW_360_TOUR')}
							</Link>
						)}
						<div className='d-flex align-items-center gap-2'>
							{!isEmpty(property) && property?.photos?.length > 0 && (
								<a
									href='javascript:void(0)'
									onClick={() => {
										imageDialog(0)
									}}
									className='d-flex align-items-center text-white mb-2 mb-sm-0 me-0'
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
					{property?.photos?.map((img, index) => {
						return (
							<div className='slider_data' key={index}>
								<figure>
									<img src={img} />
								</figure>
							</div>
						)
					})}
				</Slider>

				<div className='detail_caption'>
					<div className='container'>
						<div className='mobile_price_field'>
							<div>
								<h2 className='ms-sm-auto text-dark  mb-2'>
									{Helpers?.priceFormat(priceFormatType(property))} {config?.currency}
									{(property?.propertyType?.slug == 'rent' || property?.propertyType?.slug == 'commercial-rent') && <small>{priceFormat(property)}</small>}
								</h2>
								<p className='text-dark mb-0'>
									{t('LAST_UPDATED_TIME')}{' '}
									{Helpers?.remainingTimeFromNow(property?.lastUpdated, {
										language: direction?.langKey,
									})}
								</p>
							</div>

							<h2 className='text-dark mt-3'>
								{property[`title${direction?.langKey || ''}`]?.split(' ')[0]}{' '}
								<span className='text-green'>
									{property[`title${direction?.langKey || ''}`]
										?.split(' ')
										.splice(1, property[`title${direction?.langKey || ''}`]?.split(' ').length)
										.join(' ')}
								</span>
							</h2>
						</div>
					</div>
				</div>
			</section>

			<div className='detailBanner position-relative inner-banner d-none d-md-block'>
				<NextSeo title={property?.metaTitle || property?.title} description={property?.metaDescription || ''} keywords={property?.metaKeyword || ''} />
				<CustomImage width={100} height={100} src={!isEmpty(property) && !isEmpty(property?.photos[0]) && property?.photos[0]} alt='profilePic' />
				<div className='detail_caption'>
					<div className='container'>
						<div className='d-sm-flex align-items-center'>
							<div>
								<h1 className='same_as_h2 text-white mb-sm-2'>
									{property[`title${direction?.langKey || ''}`]?.split(' ')[0]}{' '}
									<span className='text-green'>
										{property[`title${direction?.langKey || ''}`]
											?.split(' ')
											.splice(1, property[`title${direction?.langKey || ''}`]?.split(' ').length)
											.join(' ')}
									</span>
								</h1>
								<p className='text-white mb-0'>
									{t('LAST_UPDATED_TIME')}{' '}
									{Helpers?.remainingTimeFromNow(property?.lastUpdated, {
										language: direction?.langKey,
									})}
								</p>
							</div>
							<h2 className='ms-sm-auto text-white mt-1 mt-sm-0'>
								{Helpers?.priceFormat(priceFormatType(property))} {config?.currency}
								{(property?.propertyType?.slug == 'rent' || property?.propertyType?.slug == 'commercial-rent') && <small>{priceFormat(property)}</small>}
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
								<Breadcrumb.Item active>{property?.[`title${direction?.langKey || ''}`]}</Breadcrumb.Item>
							</Breadcrumb>
						</Col>
						<Col md={5}>
							<div className='d-sm-flex align-items-center justify-content-md-between  text-center'>
								<div className='breadcrumb_btn d-flex  align-items-center justify-content-center w-100 flex-wrap flex-md-nowrap mt-3 mt-md-0'>
									<a
										href='javascript:void(0)'
										onClick={() => {
											shareFunction(window.location.href)
										}}
										className='d-flex align-items-center mt-1 mt-md-0'
										style={{ marginRight: property?.forAuction ? "10px" : 0 }}
									>
										<CustomImage width={20} height={20} src='/images/share.svg' className='me-2' alt='image' />
										{t('SHARE')}
									</a>
									{(property?.forAuction) && <GetAuctionData auctionProperty={property} type="status" />}
									{(isEmpty(user) || user?.role === 'user') && !property?.forAuction && (
										<>
											<a
												href='javascript:void(0)'
												onClick={() => {
													if (!isEmpty(user)) {
														if (!isEmpty(property) && !isEmpty(user)) {
															if (property?.wishlistCount == 1) {
																removeWishlistStatus(property?._id)
															} else {
																wishlistStatus(property?._id)
															}
														}
													} else {
														notification?.error('Please login to wishlist this property')
													}
												}}
												className={`d-flex align-items-center mx-2 mx-lg-3 like_tab mt-1 mt-md-0`}
											>
												<CustomImage width={20} height={20} src={property?.wishlistCount == 1 ? '/images/savelike.svg' : '/images/like.svg'} className='me-2  unfilltbs' alt='image' />
												{t('SAVE')}
											</a>
											<a
												href='javascript:void(0)'
												onClick={() => {
													if (!isEmpty(user)) {
														setOpenReport(true)
													} else {
														notification?.error('Please login to report this property')
													}
												}}
												className='d-flex align-items-center mt-1 mt-md-0'
											>
												<CustomImage width={20} height={20} src='/images/report.svg' className='me-2' alt='image' />
												{t('REPORT')}
											</a>

											<button onClick={() => setOpenMap(true)} className='border d-flex align-items-center rounded text-dark bg-white px-3 fs-14 fw-300 d-md-none view_on_map ms-2 mt-1 mt-md-0'>
												<CustomImage width={20} height={20} src='/images/location.svg' className='me-1' alt='image' />
												{t('VIEW_ON_MAP')}
											</button>
										</>
									)}
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
			<div className='main_wrap'>
				<Container>
					<Row className='with_sidebar'>
						<Col lg={8} xl={9}>
							{property?.forAuction &&
								<div className="detail_price_secondary mb-3 bg-white  p-2 p-sm-3  rounded">
									{(property?.forAuction) &&
										<div className="social_achiv auction_property  d-sm-flex align-items-center justify-content-between">
											<div>
												<h4 className="price">
													<span className="fs-6 text-dark fw-normal">
														{" "}
														{t("STARTING_BID")}
													</span>{" "}
													<strong className="price">
														{Helpers?.priceFormat(priceFormatType(property))} {config?.currency}{" "}
														{(property?.propertyType?.slug == "rent" ||
															property?.propertyType?.slug == "commercial-rent") && (
																<small>{priceFormat(property)}</small>
															)}
													</strong>
												</h4>
												{getLive(property) ? <>
													{t("AUCTION_END_DATE")}{" "}
													<span className="fw-medium">
														{Helpers.dateFormat(
															property?.auctionEndDateTime,
															"D MMM , YYYY | h:mm A",
															{ language: direction?.langKey }
														)}
													</span></> : (
													<>
														{getClose(property) ? ("") : <>{t("AUCTION_START_DATE")}{" "}
															<span className="fw-medium">
																{Helpers.dateFormat(
																	property?.auctionStartDateTime,
																	"YYYY-MM-DD | h:mm A",
																	{ language: direction?.langKey }
																)}
															</span></>}
													</>
												)}
											</div>
											{getLive(property) ? (
												<p className="mb-0 fs-7  auction-wrap">
													<GetAuctionData auctionProperty={property} type="bidButton" />
												</p>
											) : (
												""
											)}
										</div>}
								</div>
							}


							<div className='d-md-flex flex-wrap align-items-center mb-3 view_btn d-none '>
								{!isEmpty(property?.threeSixtyView) && property?.threeSixtyView !== null && (
									<Link href={!isEmpty(property) ? property?.threeSixtyView || '#' : '#'} target='_blank' className='align-items-center text-white me-2 mb-2 mb-sm-0 d-inline-flex'>
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
										className='align-items-center text-white me-2 mb-2 mb-sm-0 d-inline-flex'
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
										className='align-items-center text-white me-2 mb-2 mb-sm-0 d-inline-flex'
									>
										<CustomImage width={20} height={20} src='/images/video_count.svg' className='me-2' alt='image' />
										{t('SHOW')} {!isEmpty(property) ? property?.video?.length : 0} {t('VIDEOS')}
									</a>
								)}

								<button onClick={() => setOpenMap(true)} className='ms-sm-auto border  align-items-center rounded text-dark bg-white mb-2 p-2 mb-sm-0 px-3 fs-14 fw-300 d-inline-flex'>
									<CustomImage width={20} height={20} src='/images/location.svg' className='me-1' alt='image' />
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
							<ul className='property_desc bg-white px-3 py-3 py-lg-4 mb-3 rounded'>
								<li>
									<figure className='property_desc_icon mb-0'>
										<img src='/images/home.svg' alt='image' />
									</figure>
									<h6>
										<span> {t('TYPE')}</span>
										{property?.propertyCategory?.[`name${direction?.langKey || ''}`]}
									</h6>
								</li>

								<li>
									<figure className='property_desc_icon mb-0'>
										{' '}
										<img src={property?.propertySize > 0 ? '/images/property.png' : '/images/area-color.svg'} alt='image' />
									</figure>
									{(property?.propertySize > 0) ?
										<h6>
											<span> {t('PROPERTY_SIZE')}</span>
											{property?.propertySize} {config?.areaUnit}
										</h6> : <h6>
											<span> {t('BUA')}</span>
											{property?.bua} {config?.areaUnit}
										</h6>}
								</li>
								{property?.bedrooms !== null &&
									<li>
										<figure className='property_desc_icon mb-0'>
											<img src='/images/bedroom_detail.svg' alt='image' />
										</figure>
										<h6>
											<span> {t('BEDROOMS')}</span>
											{property?.bedrooms == 0 ? 'Studio' : property?.bedrooms > 7 ? '7+' : property?.bedrooms}
											{/* {property?.bedrooms} */}
										</h6>
									</li>}
								{property?.bathrooms !== null &&
									<li>
										<figure className='property_desc_icon mb-0'>
											{' '}
											<img src='/images/bathroom_detail.svg' alt='image' />
										</figure>
										<h6>
											<span>{t('BATHROOMS')}</span>
											{property?.bathrooms > 7 ? '7+' : property?.bathrooms}
										</h6>
									</li>}
							</ul>

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
									<li className='d-flex align-items-center'>
										{t('PROPERTY_ID')} <span className='text-green fw-medium ms-1'>{property?.propertyId}</span>
									</li>
									{!isEmpty(property?.advertType) && (
										<li className='d-flex align-items-center'>
											{t('ADVERT_TYPE')}{' '}
											<span title={property?.advertType} className='text-green fw-medium ms-1'>
												{property[`advertType${direction?.langKey || ''}`]}
											</span>
										</li>
									)}
									{!isEmpty(property?.layoutType) && (
										<li className='d-flex align-items-center'>
											{t('LAYOUT_TYPE')} : <span className='text-green fw-medium ms-1'>	{direction?.langKey == 'Ar' ? layoutTypeAr[property?.layoutType] : property?.layoutType}</span>
										</li>
									)}
									{!isEmpty(property?.parking) && (
										<li className='d-flex align-items-center'>
											{t('PARKING')} : <span className='text-green fw-medium ms-1'>{property.parking} </span>
										</li>
									)}

									{!isEmpty(property?.parkingType) && (
										<li className='d-flex align-items-center'>
											{t('PARKING_TYPE')} : <span className='text-green fw-medium ms-1'>{direction?.langKey == "Ar" ? parkingTypeAr[property?.parkingType] : property.parkingType}</span>
										</li>
									)}
									{!isEmpty(property?.stage) && (
										<li className='d-flex align-items-center'>
											{t('STAGE')} : <span className='text-green fw-medium ms-1'>{direction?.langKey == 'Ar' ? stageTypeAr[property.stage] : property.stage}</span>
										</li>
									)}
									<li className='d-flex align-items-center'>
										{t('LISTED_DATE')}{' '}
										<span className='text-green fw-medium ms-1'>
											{Helpers.dateFormat(property?.listedOn)}
										</span>
									</li>
									{!isEmpty(property?.permitNumber) && (
										<li className='d-flex align-items-center'>
											{t('PERMIT_NUMBER')} <span className='text-green fw-medium ms-1'>{property?.permitNumber}</span>
										</li>
									)}
									{!isEmpty(property?.referenceNumber) && (
										<li className='d-flex align-items-center'>
											{t('REFERENCE_NUMBER')} <span className='text-green fw-medium ms-1'>{property?.referenceNumber}</span>
										</li>
									)}

									{config?.country === 'Saudi' && (
										<>
											{!isEmpty(property?.streetWidth) && (
												<li className='d-flex align-items-center'>
													Street Width :<span className='text-green fw-medium ms-1'>{property?.streetWidth}</span>
												</li>
											)}
											{!isEmpty(property?.propertyLength) && (
												<li className='d-flex align-items-center'>
													Property Length :<span className='text-green fw-medium ms-1'>{property?.propertyLength}</span>
												</li>
											)}
											{!isEmpty(property?.propertyWidth) && (
												<li className='d-flex align-items-center'>
													Property Width :<span className='text-green fw-medium ms-1'>{property?.propertyWidth}</span>
												</li>
											)}
											{!isEmpty(property?.propertyAge) && (
												<li className='d-flex align-items-center'>
													Property Age :<span className='text-green fw-medium ms-1'>{property?.propertyAge}</span>
												</li>
											)}

											{!isEmpty(property?.streetInfoOne) && (
												<li className='d-flex align-items-center'>
													Property Age :<span className='text-green fw-medium ms-1'>{property?.streetInfoOne}</span>
												</li>
											)}
											{!isEmpty(property?.streetInfoTwo) && (
												<li className='d-flex align-items-center'>
													Property Age :<span className='text-green fw-medium ms-1'>{property?.streetInfoTwo}</span>
												</li>
											)}
											{!isEmpty(property?.streetInfoThree) && (
												<li className='d-flex align-items-center'>
													Property Age :<span className='text-green fw-medium ms-1'>{property?.streetInfoThree}</span>
												</li>
											)}
											{!isEmpty(property?.streetInfoFour) && (
												<li className='d-flex align-items-center'>
													Property Age :<span className='text-green fw-medium ms-1'>{property?.streetInfoFour}</span>
												</li>
											)}
										</>
									)}
								</ul>
							</div>

							<div className='bg-white p-3 p-sm-4 mb-3 property_feature rounded'>
								<div className='heading_line'>
									<h3 className='position-relative'>{t('FEATURES')}</h3>
								</div>
								<ul>
									{config?.country === 'Saudi' && property?.livingRooms > 0 &&
										<li className='d-flex align-items-center'>
											<img src='/images/feature1.svg' alt='image' className='me-2' /> {t('LIVING_ROOM')}:{' '}
											<span className='text-green fw-medium ms-1'>
												{property?.livingRooms} {t('LIVING_ROOM')}
											</span>
										</li>
									}
									{!isEmpty(property?.furnished) && (
										<li className='d-flex align-items-center'>
											<img src='/images/feature3.svg' alt='image' className='me-2' /> {t('FURNISHED_TYPE')}{' '}
											<span title={!isEmpty(property) ? property?.furnished || '--' : '--'} className='text-green text-capitalize fw-medium ms-1'>
												{!isEmpty(property) ? direction?.langKey == "Ar" ? furnishedTypeAr[property?.furnished] : property?.furnished || '--' : '--'}
											</span>
										</li>
									)}
									{!isEmpty(property?.bua) && (
										<li className='d-flex align-items-center'>
											<img src='/images/area.svg' alt='image' className='me-2' /> {t('BUILT_AREA')}
											<span className='text-green text-capitalize fw-medium ms-1'>
												{!isEmpty(property) ? property?.bua : '--'} {config?.areaUnit}
											</span>
										</li>
									)}
									{(property?.propertyType?.slug === 'buy' && !isEmpty(property?.financialStatus)) && (
										<li className='d-flex align-items-center'>
											<img src='/images/financial-status.svg' alt='image' className='me-2' /> {t('FINANCIAL_STATUS')}{' '}
											<span title={!isEmpty(property) ? _.startCase(property?.financialStatus) || '--' : '--'} className='text-green fw-medium ms-1'>
												{!isEmpty(property) ? direction?.langKey == "Ar" ? financialStatusAr[property?.financialStatus] : _.startCase(property?.financialStatus) || '--' : '--'}
											</span>
										</li>
									)}
									{(property?.propertyType?.slug === 'buy' && !isEmpty(property?.projectStatus)) && (
										<li className='d-flex align-items-center'>
											<img src='/images/construction-status.svg' alt='image' className='me-2' /> {t('CONSTRUCTION_STATUS')}
											<span className='text-green fw-medium ms-1 ellipsis_text' title={!isEmpty(property) ? constructionStatusObj[property?.projectStatus] || '--' : '--'}>
												{!isEmpty(property) ? direction?.langKey == "Ar" ? constructionStatusObjAr[property?.projectStatus] : _.startCase(property?.projectStatus) || '--' : '--'}
											</span>
										</li>
									)}
									{(property?.propertyType?.slug === 'commercial-rent' && !isEmpty(property?.readyStage)) && (
										<li className='d-flex align-items-center'>
											<img src='/images/ready-stage.svg' alt='image' className='me-2' /> {t('READY_STAGE')}{' '}
											<span title={!isEmpty(property) ? _.startCase(property?.readyStage) || '--' : '--'} className='text-green text-capitalize fw-medium ms-1'>
												{!isEmpty(property) ? direction?.langKey == 'Ar' ? readyStageAr[property?.readyStage] : _.startCase(property?.readyStage) || '--' : '--'}
											</span>
										</li>
									)}
								</ul>
							</div>

							{property?.amenities?.length > 0 && (
								<div className='bg-white p-3 p-sm-4 mb-3 property_amenities rounded'>
									<div className='heading_line'>
										<h3 className='position-relative'> {t('AMENITIES')}</h3>
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
								<div className='heading_line d-md-flex align-items-center mb-3 mb-sm-4'>
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
											<p className='mb-0 ms-auto d-flex align-items-center mt-3 mt-md-0'>
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
									<CustomImage onClick={() => setOpenMap(true)} width={900} height={350} src={property?.locationImage} className='w-100 text-center cursor-pointer map_chart' alt='image' />
									{/* </a> */}
								</div>
								<ul className='mb-4'>
									<li>
										{t('LISTED')}{' '}
										<span className='fw-medium'>
											{Helpers?.remainingTimeFromNow(property?.createdAt, {
												language: direction?.langKey,
											})}
										</span>
									</li>
									{!property?.forAuction && (
										<li>
											{t('AGENT_BRN')} <span className='fw-medium'>{!isEmpty(property) ? property?.agent?.brn || '--' : '--'}</span>
										</li>
									)}
								</ul>
								{!isEmpty(property?.nearestFacility) && (
									<div className='p-3 p-md-4 facility mb-3'>
										<h3>{t('NEAREST_FACILITIES')}</h3>
										<ul>
											{property[`nearestFacility${direction?.langKey || ''}`]?.map((nf, index) => {
												return <li key={index}>{nf}</li>
											})}
										</ul>
									</div>
								)}
							</div>
							<div className='bg-white p-3 p-sm-4 mb-3 property_feature rounded'>
								<div className='heading_line d-sm-flex align-items-center mb-3 mb-sm-4'>
									<h3 className='position-relative mb-0'>{t('PRICE_TRENDS')}</h3>
									<p className='mb-0 mt-2 mt-sm-0 ms-auto'>{t('BEDROOMS_VILLAS_SOLD')}</p>
								</div>
								<img src='/images/chart.jpg' alt='image' className='w-100' />
							</div>

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
															<img src={res?.image} className='mw-100 mb-2' alt={res?.image} />
															<h3>{direction?.langKey == "Ar" ? res?.titleAr : res?.title}</h3>
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
								{!property?.forAuction && (
									<div className='agent_detail px-3 pt-2 pb-3 bg-white mb-3'>
										<div className='text-end'>
											{/* <a href="#">
                        <img src="/images/more.png" alt="image" />
                      </a> */}
										</div>

										{/* onClick={() => router.push("/")}  cursor-pointer */}
										<Link href={user?.role === 'agent' ? '' : `/agents/${property?.agent?.slug || ""}`} className='d-flex align-items-center my-3 p-2 shadow-sm bg-white rounded text-dark'>
											<figure className='dealer_img'>
												<CustomImage
													width={100}
													height={100}
													src={property?.agent?.profilePic || '/images/user_agent.png'}
													// src={
													//  "./images/user_agent.png"
													// }
													alt='image'
												/>
											</figure>
											<div className='ps-2'>
												<h6 className='mb-1'>{`${property?.agent?.firstName || ''} ${property?.agent?.lastName || ''}`}</h6>
												<p className='mb-1 fs-7'>
													{!isEmpty(property) ? property?.agent?.agentProperties || '0' : '0'} {t('PROPERTY_LISTINGS')}
												</p>
												<p className='mb-0 fs-7'>
													{property?.agent?.designation} {t('AT')} {property?.agent?.parentType == 'company' ? property?.agent?.company?.name : property?.agent?.parentType == 'admin' ? "Mada Properties" : 'Freelancer'}
												</p>
											</div>
										</Link>

										{(user?.role === 'user' || isEmpty(user)) && (
											!isEmpty(property?.agent?.firstName) &&
											<div className='my-3 pt-2 pb-3 border-bottom social_achiv_left d-flex align-items-center ms-auto justify-content-start'>
												<a
													href={isEmpty(user) ? 'javascript:void(0)' : !property?.forAuction ? `tel:${property?.agent?.countryCode + property?.agent?.mobile}` : `tel:${adminInfo?.mobile}`}
													onClick={() => {
														if (isEmpty(user)) {
															notification.error('Please login to contact agent.')
														}
													}}
													className='btn_link  d-flex align-items-center bg-green text-white'
												>
													<img src='/images/call.svg' className='me-sm-2' /> {t('CALL')}
												</a>
												<a
													href='javascript:void(0)'
													onClick={() => {
														if (!isEmpty(user)) {
															setEmail(true)
														} else {
															notification.success('Please login to contact agent.')
														}
													}}
													className='btn_link d-flex align-items-center bg-green text-white ms-1 ms-xl-2'
												>
													<img src='/images/mail.svg' className='me-sm-2' /> {t('EMAIL')}
												</a>
												{!isEmpty(property) && (
													<a
														href={
															isEmpty(user)
																? 'javascript:void(0)'
																: !property?.forAuction
																	? `https://api.whatsapp.com/send/?phone=${property?.agent?.countryCode + property?.agent?.mobile}&text&type=phone_number&app_absent=0`
																	: `tel:${adminInfo?.mobile}`
														}
														target={isEmpty(user) ? '' : '_blank'}
														onClick={() => {
															if (isEmpty(user)) {
																notification.error('Please login to contact agent.')
															}
														}}
														className='ms-1 ms-xl-2  d-flex align-items-center'
													>
														<img src='/images/whatsapp.svg' alt='image' />
													</a>
												)}
											</div>
										)}
										{!property?.forAuction && (
											!isEmpty(property?.agent?.firstName) &&
											<div className='d-flex align-items-center mb-3'>
												<p className='mb-0 d-flex align-items-center speak-language-text'>
													<img src='/images/language.svg' className='me-1' alt='image' />
													{t('LANGUAGE')}
												</p>
												<p className='mb-0 ms-auto fw-medium text-truncate' title={property?.agent?.language || null}>
													{property?.agent?.language || null}
												</p>
											</div>
										)}
										<div className='bg-light p-3 mb-3 estimate'>
											<h2 className='mb-1 text-green '>
												{Helpers?.priceFormat(priceFormatType(property))} {config?.currency}
												<span className='text-small'>{priceFormat(property)}</span>
											</h2>
											{(property?.propertyType?.slug === 'buy' || property?.propertyType?.slug === 'commercial') && (
												<p className='mb-0 text-dark fs-7'>
													{t('ESTIMATED_MORTGAGE')}{' '}
													<span className='text-blue'>
														{Helpers?.priceFormat(monthlyMortgage)} {t('/MONTH')}
													</span>
												</p>
											)}
										</div>
										{!property?.forAuction && (
											<p className='mb-3'>
												{property?.agent?.firstName} {property?.agent?.lastName} {t('USUALLY_RESPONDS_WITHIN_5_MINUTES')}
											</p>
										)}
										{isEmpty(user) && (
											<Button
												onClick={() => {
													if (isEmpty(user)) {
														notification.error('Please login to schedule a meeting')
													} else if (!isEmpty(user) && user?.role === 'user') {
														setMeetingModel(true)
													}
												}}
												className='w-100 btn theme_btn'
											>
												{t('SCHEDULE_A_MEETING')}
											</Button>
										)}
										{!isEmpty(user) && user?.role == 'user' && (
											<Button
												onClick={() => {
													if (isEmpty(user)) {
														notification.error('Please login to schedule a meeting')
													} else if (!isEmpty(user) && user?.role === 'user') {
														setMeetingModel(true)
													}
												}}
												className='w-100 btn theme_btn'
											>
												{t('SCHEDULE_A_MEETING')}
											</Button>
										)}
										{!property?.forAuction && (
											<div className='bg-light rounded d-flex align-items-center justify-content-between p-3 text-center mt-3'>
												<p className='mb-0'>
													<span className='d-block fw-medium mb-2 fs-5'>{!isEmpty(property) ? property?.agent?.buyCount : 0}</span>
													{t('BUY')}
												</p>
												<p className='mb-0'>
													<span className='d-block fw-medium mb-2 fs-5'> {!isEmpty(property) ? property?.agent?.rentCount : 0}</span>
													{t('RENT')}
												</p>
												<p className='mb-0'>
													<span className='d-block fw-medium mb-2 fs-5'> {!isEmpty(property) ? property?.agent?.commercialBuyCount + property?.agent?.commercialRentCount : 0}</span>
													{t('COMMERCIALS')}
												</p>
											</div>
										)}
									</div>
								)}
								{!property?.forAuction && (property?.propertyType?.slug === 'buy' || property?.propertyType?.slug === 'commercial-buy') && <MortgageCalculator monthly={monthly} property={property} />}
								{/* <img src="/images/ad2.jpg" alt="image" /> */}
								{!isEmpty(adsList) && adsList?.display?.includes('propertyDetail') && (
									// <Col xl={3} className="text-center">
									<a target='_blank' href={adsList?.redirectLink}>
										<img src={adsList?.bannerImage} alt='image' />
									</a>
									// </Col>
								)}
							</div>
						</Col>
					</Row>
				</Container>
			</div>
			{!property?.forAuction && similarProperty?.length > 0 && (
				<section className='properties_for_rent py-4 py-md-5 bg-white'>
					<Container>
						<div className='inner_heading'>
							<h2>
								{t('MORE_AVAILABLE_IN_THE')} <span className='text-green'> {t('SAME_AREA')}</span>
							</h2>
							<p> {t('FIND_HOMES_FIRST')}</p>
						</div>
						{
							<Slider {...SliderConfig.rentProperties} className='SliderNav'>
								{similarProperty?.map((item, key) => {
									return <PropertyCard user={user} key={key} item={item} shareFunction={shareFunction} getFeaturedProperties={getPropertyData} />
								})}
							</Slider>
						}
					</Container>
				</section>
			)}
			{open && <Lightbox open={open} plugins={[lightBoxType == 'video' ? Video : Thumbnails]} close={() => setOpen(false)} slides={images} index={imageIndex} />}
			{openReport && <ReportProperty open={openReport} onClose={() => setOpenReport(false)} id={property?._id} />}
			{videoModel && !isEmpty(property) && property?.video?.length > 0 && (
				<Modal size='xl' fullscreen='xl-down' show={videoModel} onHide={() => setVideoModel(false)}>
					<Modal.Header className='d-flex justify-content-center' closeButton>
						<Modal.Title> {t('VIDEO')}</Modal.Title>
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
			{openMap && property?.location?.coordinates?.length > 0 && <ViewMap type="property" property={property} openMap={openMap} setOpenMap={setOpenMap} location={property?.location} property_address={direction?.langKey == "Ar" ? property?.titleAr : property?.title} />}
			{shareButton && !isEmpty(shareButtonLink) && <ReactShare shareButton={shareButton} setShareButton={setShareButton} link={shareButtonLink} />}
			{meetingModel && <ScheduleMeeting data={property} show={meetingModel} onHide={() => setMeetingModel(false)} />}
			{email && <EmailDialogbox type='property' typeCheck={property?.forAuction && 'company'} open={email} agentData={property} onHide={() => setEmail(false)} />}
			{statusPlaceBid && (
				<PlaceBid
					handleBidModelClick={handleBidModelClick}
					handlePlaceBid={handlePlaceBid}
					bidData={bidData}
					item={property}
					afterSubmit={getPropertyData}
				/>
			)}
		</>
	)
}

export default PropertyDetail
