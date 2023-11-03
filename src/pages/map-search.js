import AuthContext from '@/context/AuthContext'
import { apiGet } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import Helpers from '@/utils/helpers'
import classNames from 'classnames'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {
	startTransition,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import SearchMapForm from './components/SearchMapForm'
import { isEmpty, isNumber, startCase } from 'lodash'
import { AREA_REGION } from '@/utils/constants'
import CustomImage from './components/CustomImage'
import { useTranslation } from 'react-i18next'
const defaultZoom = 8
let checkObj = {
	city: 'community',
	community: 'subCommunity',
	subCommunity: 'subCommunity'
}
const MapSearch = () => {
	const { config, direction } = useContext(AuthContext)
	const { t } = useTranslation();
	const defaultLocation = AREA_REGION[config?.country || 'UAE']
	const location = useRouter()
	const [selectedType, setSelectedType] = useState('city')
	const [theMap, setMap] = useState()
	const [isOpen, setIsOpen] = useState(false)
	const [selectedSearch, setSelectedSearch] = useState({})
	const [isSearched, setIsSearched] = useState(false)
	const [properties, setProperties] = useState([])
	const [queryData, setQueryData] = useState(location.query || {})
	// // console.log('AREA_REGION', AREA_REGION)
	// const [defaultLocation, setDefaultLocation] = useState(
	// 	AREA_REGION[config?.country]
	// )
	const markersRef = useRef([])
	const [geojson, setGeojson] = useState([])
	var isScrolling = useRef()
	var isZooming = useRef()
	var scrollEndTimeout = null

	function handleScrollEnd(e) {
		isScrolling.current = false
		const currentZoom = parseInt(theMap.getZoom())

		var bounds = theMap.getBounds()
		var ne = bounds.getNorthEast()
		var sw = bounds.getSouthWest()

		var lat = (ne.lat + sw.lat) / 2
		var lng = (ne.lng + sw.lng) / 2
		let selectionType = 'city'
		if (currentZoom > 8 && currentZoom < 12) {
			selectionType = 'community'
		} else if (currentZoom >= 12) {
			selectionType = 'subCommunity'
		}

		startTransition(() => {
			setSelectedType(selectionType)
		})

		if (e.type === 'drag') {

		} else {

			setIsSearched(false)

			// getData()
			// isZooming.current = false
		}

		let updateQuery = { type: selectionType }
		if (isEmpty(location?.query?.locationSelected)) {
			updateQuery = { ...updateQuery, ...{ locationSelected: '{}' } }
		}
		startTransition(() => {
			setQueryData((prevState) => {
				return {
					...prevState,
					...updateQuery,
				}
			})
		})


		// startTransition(() => {
		// 	setDefaultLocation({ lat, lng })
		// })
	}

	useEffect(() => {
		if (theMap) {
			const markers = []
			removeMarkers()
			for (const feature of geojson) {
				const el = document.createElement('div')
				el.className = 'marker'
				const priceType = "priceType" in queryData ? `/${queryData.priceType}` : ''
				let innerHTML = `<div class="map-lookup"><span>${t("MORE_HOMES")}</span>
									<h6>${t('FROM')} ${Helpers.priceFormat(feature?.minPrice)} ${config.currency}${priceType}</h6>
								</div>`

				if (feature.type === 'subCommunity') {
					if (feature?.minPrice === feature?.maxPrice) {
						innerHTML = `<div class="map-lookup"><span>${t("MORE_HOMES")}</span>
									<h6>${Helpers.priceFormat(feature?.minPrice)} ${config.currency}${priceType}</h6>
								</div>`
					} else {
						innerHTML = `<div class="map-lookup"><span>${t("MORE_HOMES")}</span>
									<h6>${Helpers.priceFormat(feature?.minPrice)} ${t("TO")} ${Helpers.priceFormat(feature?.maxPrice)} ${config.currency}${priceType}</h6>
								</div>`
					}

				}
				el.innerHTML = innerHTML
				const theMarker = new mapboxgl.Marker(el)
					.setLngLat(feature.location.coordinates)
					.addTo(theMap)
				theMarker.getElement().addEventListener('click', () => {
					handleMarkerClick(feature)
				})
				markers.push(theMarker)
			}
			markersRef.current = markers

			const handleScroll = (e) => {
				if (!isScrolling.current) {
					isScrolling.current = true
				}
				clearTimeout(scrollEndTimeout)
				scrollEndTimeout = setTimeout(function () {
					handleScrollEnd(e)
				}, 500)
			}

			if (!isEmpty(geojson) && isSearched) {
				let zoomLevel = parseInt(theMap.getZoom())
				if (selectedSearch?.type === 'city') {
					zoomLevel = defaultZoom
				} else if (selectedSearch?.type === 'community') {
					zoomLevel = 9
				} if (selectedSearch?.type === 'subCommunity') {
					zoomLevel = 12
				}
				flyMap(geojson[0].location.coordinates, zoomLevel)
			}
			theMap.on('zoomstart', () => {
				// isZooming.current = true
			})
			theMap.on('wheel', handleScroll)
			// theMap.on('drag', handleScroll)
		}
	}, [theMap, geojson])


	const handleMarkerClick = (markerInfo) => {
		setIsSearched(true)
		if (markerInfo.type === 'subCommunity') {
			getProperties(markerInfo)
		} else if (
			markerInfo.type === 'community' && markerInfo.subCommunityCount < 1
		) {
			getProperties(markerInfo)
		} else {
			startTransition(() => {
				setQueryData((prevState) => {
					return {
						...prevState,
						...{
							locationSelected: JSON.stringify({
								type: markerInfo.type,
								name: markerInfo.name,
								_id: markerInfo._id,
							}),
							type: checkObj[markerInfo.type]
						},
					}
				})
			})

			let zoomLevel = parseInt(theMap.getZoom())
			if (markerInfo?.type === 'city') {
				zoomLevel = defaultZoom + 3
			} else if (markerInfo?.type === 'community') {
				zoomLevel = 12
			} if (markerInfo?.type === 'subCommunity') {
				zoomLevel = 16
			}
			// console.log('zoomLevel', zoomLevel)

			flyMap(markerInfo.location.coordinates, zoomLevel)
		}
	}

	const flyMap = (coordinates = [], zoomLevel) => {
		if (zoomLevel < 22) {

			theMap.flyTo({
				center: coordinates,
				zoom: zoomLevel,
				speed: 1.2,
				curve: 1.4,
				easing: function (t) {
					return t
				},
			})
		}
	}

	const getProperties = async (markerInfo) => {
		try {
			let queryParams = {
				slug: queryData?.pageName || '',
				communityId: markerInfo?.communityId || undefined,
				subCommunityId: markerInfo?._id || undefined,
				page: 1,
				pageSize: 10,
			}

			if (markerInfo.type === 'community' && !markerInfo.subCommunityCount) {
				queryParams.communityId = markerInfo._id
				queryParams.subCommunityId = null
			}

			queryParams = {
				...queryParams,
				...queryData,
				...{
					propertyCategory: [queryData.propertyType].join(','),
					amenities: [queryData.amenities].join(','),
					bathroom: [queryData.bathroom].join(','),
					bedroom: [queryData.bedroom].join(','),
					priceMin: queryData?.minPrice || "",
					priceMax: queryData?.maxPrice || "",
					areaMin: queryData?.minArea || "",
					areaMax: queryData?.maxArea || "",
					priceType: queryData?.priceType || "",
				},
			}

			let api = ''
			if (queryData?.pageName === 'project') {
				api = apiPath.ProjectMapProperties
			} else {
				api = apiPath.mapProperties
			}
			const { status, data } = await apiGet(api, queryParams)
			if (status == 200) {
				if (data.success) {
					setIsOpen(true)
					setProperties(data?.results?.docs || [])
				}
			} else {
			}
			// }
		} catch (error) {
			// console.log('error', error)
		}
	}

	useEffect(() => {
		startTransition(() => {
			setQueryData(location.query)
			setIsSearched(true)
		})
		if ('locationSelected' in queryData) {
			if (!isEmpty(queryData)) {
				if ('locationSelected' in queryData) {
					if (!isEmpty(queryData.locationSelected)) {
						const locationSelected = JSON.parse(queryData.locationSelected)
						if (locationSelected.length) {
							setSelectedSearch(locationSelected[0])
						} else {
							setSelectedSearch({})
						}
					} else {
						setSelectedSearch({})
					}
				} else {
					setSelectedSearch({})
				}
			} else {
				setSelectedSearch({})
			}
		} else {
			setSelectedSearch({})
		}

	}, [location])

	useEffect(() => {
		getData()
	}, [queryData])

	useEffect(() => {
		mapboxgl.accessToken = 'pk.eyJ1IjoibWFucHJhamFwYXQiLCJhIjoiY2s4OXJmMG5vMDkzNTNncGhzZzZxMHRvbyJ9.AjbPO05wSijJHMCU5Q5N6g'
		const map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [defaultLocation?.lng, defaultLocation?.lat],
			zoom: defaultZoom,
		})

		// var zoomControl = new mapboxgl.NavigationControl();
		// map.addControl(zoomControl, 'bottom-left');

		setMap(map)
	}, [])

	const getData = async () => {
		try {
			// console.log('queryData', queryData)
			let queryParams = {
				slug: queryData?.pageName || '',
				type: selectedType,
				lat: defaultLocation?.lat,
				lng: defaultLocation?.lng,
				// radius:10000000000000000000
			}
			let locationSelected = {}
			if ('locationSelected' in queryData) {
				if (!isEmpty(queryData.locationSelected)) {
					locationSelected = JSON.parse(queryData.locationSelected) || []
					if (locationSelected.length) {
						locationSelected = locationSelected[0]
					}
				}
			}
			// 	locationSelected = JSON.stringify(locationSelected.map(item => {
			// 		return {
			// 		  "_id": item._id,
			// 		  "type": item.type
			// 		};
			// 	  }))
			// } 
			queryParams = {
				...queryParams,
				...queryData,
				...{
					propertyCategory: [queryData.propertyType].join(','),
					amenities: [queryData.amenities].join(','),
					bathroom: [queryData.bathroom].join(','),
					bedroom: [queryData.bedroom].join(','),
					location: JSON.stringify(locationSelected),
					priceMin: queryData?.minPrice || "",
					priceMax: queryData?.maxPrice || "",
					areaMin: queryData?.minArea || "",
					areaMax: queryData?.maxArea || "",
					priceType: queryData?.priceType || "yearly",
				},
			}
			removeMarkers()
			let api = ''
			if (queryData?.pageName === 'project') {
				api = apiPath.projectMapView
			} else {
				api = apiPath.mapView
			}
			const { status, data } = await apiGet(api, queryParams)

			if (status == 200) {
				if (data.success) {
					setGeojson(data.results)
				}
			}
		} catch (error) {
			// console.log('error', error)
		}
	}

	function removeMarkers() {
		while (markersRef.current.length > 0) {
			markersRef.current.pop().remove();
		}
	}

	const priceFormatForRent = (item, format) => {

		// if (isNumber(item?.priceDaily) && item?.priceDaily > 0) {
		// 	return t("/DAY");
		// } else if (isNumber(item?.priceWeekly) && item?.priceWeekly > 0) {
		// 	return t("/WEEK");
		// } else if (isNumber(item?.priceMonthly) && item?.priceMonthly > 0) {
		// 	return t("/MONTH");
		// } else if (isNumber(item?.priceYearly) && item?.priceYearly > 0) {
		// 	return t("/YEAR");
		// } else {
		// 	return "";
		// }
		return item[`price${startCase(format)}`]
	}

	useEffect(() => {
		getData()
	}, [defaultLocation])


	return (
		<>
			<div className='container inner_filter_form'>
				<div className='filter_form_wrap'>
					{['buy', 'rent', 'commercial-buy', 'commercial-rent', 'project'].includes(
						location.query?.pageName
					) ? (
						<SearchMapForm tab={location.query?.pageName} />
					) : null
					}
				</div>
			</div>

			<div id='map' className='position-relative'>
				<Link
					href={`/${queryData?.pageName == 'project' ? 'newProjects' : queryData?.pageName == 'commercial-buy' ? 'commercial' : queryData?.pageName}`}
					className='shadow-sm exit_map border p-2 rounded bg-white text-dark'
				>
					<img src='/images/close-icon.svg' alt='' className='me-2' />
					{t('Exit_Map')}
				</Link>

				<div
					className={classNames('map_sidebar', {
						map_open_sidebar: isOpen,
					})}
				>
					<span
						onClick={() => { setIsOpen(!isOpen) }}
						className='d-flex align-items-center justify-content-center shadow map_sidebar_close bg-white cursor-pointer'
					>
						<img src='/images/close-icon.svg' alt='' />
					</span>
					<div className='map_sidebar_wrapper position-relative'>
						{/* <h5>FALAJ AL MOALLA </h5>
					<h6>Umm Al Quwain </h6> */}

						<div className='searched_filter d-flex align-items-center justify-content-between'>
							<strong>{t('NEARBY_PROPERTIES')}</strong>

							{/* <div className='short_by d-flex align-items-center'>
							<label className='me-2'>Sort by: </label>
							<select className='form-select py-2 h-auto w-auto'>
								<option>dsdadsd</option>
								<option>dsdadsd</option>
								<option>dsdadsd</option>
								<option>dsdadsd</option>
								<option>dsdadsd</option>
							</select>
						</div> */}
						</div>
						<div className='searched_filter_list_main'>
							{properties.map((item, i) => {
								return (
									<Link
										href={`${queryData?.pageName === 'project' ? `/project/${item?.slug}` : `/property/${item?.slug}`}`}
										target='_blank'
										key={i}
									>
										<div className='searched_filter_list'>
											<figure>
												<CustomImage
													width={120}
													height={120}
													src={item.photos[0]}
													alt=''
												/>
											</figure>
											<figcaption className='searched_filter_info'>
												{/* <span className='searched_filter_list_wishlist'>
													<img src='../images/like.svg' />
												</span> */}
												<small className='text-dark'>
													{queryData?.pageName === 'project' ? item?.propertyCategory?.map((res, index) => {
														return `${res?.[`name${direction?.langKey || ''}`]}${item?.propertyCategory.length - 1 !== index ? '/' : ''}`
													}) : item?.propertyCategory[`name${direction?.langKey || ''}`] || ''}
												</small>
												<strong className='price'>
													{queryData?.pageName === 'project' ? Helpers?.priceFormat(item?.startingPrice) : Helpers?.priceFormat(priceFormatForRent(item, queryData?.priceType))}
													{config?.currency}
													{(item?.propertyType?.slug == 'rent' ||
														item?.propertyType?.slug == 'commercial-rent') && (
															<small>/{queryData?.priceType}</small>
														)}
												</strong>
												<ul className='pro_feature d-flex align-items-center bg-light py-3 px-sm-2'>
													<li className='d-flex align-items-center fs-7 fw-medium px-2  me-md-3'>
														<img src='../images/bedroom.svg' />
														{queryData?.pageName === 'project' ? `${item?.minBedrooms} - ${item?.maxBedrooms} ${t('BEDROOMS')}` :
															item?.bedrooms > 0
																? `${item?.bedrooms} ${t('BEDROOMS')}`
																: t('STUDIO')}
													</li>
													<li className='d-flex align-items-center fs-7 fw-medium px-2  me-md-3'>
														<img src='../images/bathroom.svg' />
														{queryData?.pageName === 'project' ? `${item?.minBathrooms} - ${item?.maxBathrooms}` :
															item?.bathrooms || ''} {t('BATHROOM')}
													</li>
													<li className='d-flex align-items-center fs-7 fw-medium px-2  me-md-3'>
														<img src='../images/sqft.svg' />
														{ queryData?.pageName === 'project' ? item?.pricePerSqFt : item?.bua || ''} {config.areaUnit}
													</li>

													{/* <li className='d-flex align-items-center fs-7 fw-medium px-2  me-md-3 text-elipsis'>
														<img src='../images/sqft.svg' /><span>Completion</span>completed_primary
													</li> */}
												</ul>
											</figcaption>
										</div>
									</Link>
								)
							})}
						</div>
					</div>
				</div>
			</div>
			{/* <div className=''>
				<h5>List of properties</h5>
				<ul>
					{
						properties.map((p, i) => {
							return <li key={i}>{p?.title}</li>
						})
					}
				</ul>
			</div> */}
		</>
	)
}

export default MapSearch
