import Image from 'next/image'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Tabs, Tab, Form, Button, Collapse, Container, Card, InputGroup, Breadcrumb, Col, Row } from 'react-bootstrap'
import CustomImage from './CustomImage'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { apiGet } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import AuthContext from '@/context/AuthContext'
import Helpers from '@/utils/helpers'
import { NumberInputNew, furnishedType, priceRangeRent, priceRangeSale } from '@/utils/constants'
import { ceil, filter, isEmpty, isFunction, isNumber, isString, startCase } from 'lodash'
import { useRouter } from 'next/router'

let PriceType = [
	{
		value: 'Yearly',
		key: 'yearly',
	},
	{
		value: 'Monthly',
		key: 'monthly',
	},
	{
		value: 'Weekly',
		key: 'weekly',
	},
	{
		value: 'Daily',
		key: 'daily',
	},
]
const UseChange = ({ data }) => {
	let { t } = useTranslation()
	return t(data)
}
export const infoType = [
	{
		label: <>{<UseChange data='BUY' />}</>,
		key: 'buy',
	},
	{
		label: <>{<UseChange data='RENT' />}</>,
		key: 'rent',
	},
	{
		label: <>{<UseChange data='COMMERCIAL_BUY' />}</>,
		key: 'commercial-buy',
	},
	{
		label: <>{<UseChange data='COMMERCIAL_RENT' />}</>,
		key: 'commercial-rent',
	},
]

const SearchForm = ({ tab, type, page, filter, setFilter }) => {
	const { t } = useTranslation()
	const { config, slugCondition, direction } = useContext(AuthContext)
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [selectedInput, setSelectedInput] = useState(null)
	const [search, setSearch] = useState('')
	const [pageType, setPageType] = useState('')
	const [areaArrayMin, setAreaArrayMin] = useState([])
	const [areaArrayMax, setAreaArrayMax] = useState([])
	const [areaArrayMinSet, setAreaArrayMinSet] = useState([])
	const [areaArrayMaxSet, setAreaArrayMaxSet] = useState([])
	const [bathroomArray, setBathroomArray] = useState([])
	const [bedroomArray, setBedroomArray] = useState([])
	const [priceArrayMin, setPriceArrayMin] = useState([])
	const [priceArrayMax, setPriceArrayMax] = useState([])
	const [priceArrayMinSet, setPriceArrayMinSet] = useState([])
	const [priceArrayMaxSet, setPriceArrayMaxSet] = useState([])
	const [furnishedStatusArray, setFurnishedStatusArray] = useState([])
	const [propertyTypeArray, setPropertyTypeArray] = useState([])
	const [propertyType, setPropertyType] = useState('')
	const [propertyTypeName, setPropertyTypeName] = useState([])
	const [amenitiesList, setPropertyAmenitiesList] = useState([])
	const [completeStatus, setCompleteStatus] = useState('')
	const [amenitiesSelected, setAmenitiesSelected] = useState([])
	const [searchedAmenities, setSearchAmenities] = useState('')
	const [projectStatusArray, setProjectStatusArray] = useState([])
	const [projectStatusNormal, setProjectStatusNormal] = useState('')
	const [locationArray, setLocationArray] = useState([])
	const [locationSelected, setLocationSelected] = useState([])
	const [locationArrayFiltered, setLocationArrayFiltered] = useState([])
	const [checkBox, setCheckBox] = useState(false)
	const [locationSearch, setLocationSearch] = useState('')
	const [propertyTypeSelectedId, setPropertyTypeSelectedId] = useState([])
	const [priceRangeToggle, setPriceRangeToggle] = useState(false)
	const [priceRangeToggleMin, setPriceRangeToggleMin] = useState(false)
	const [areaRangeToggle, setAreaRangeToggle] = useState(false)
	const [areaRangeToggleMin, setAreaRangeToggleMin] = useState(false)
	const [priceRange, setPriceRange] = useState({
		min: '',
		max: '',
		value: "",
		type: 'yearly',
	})
	const [bedRoom, setBedRoom] = useState([])
	const [bathRoom, setBathRoom] = useState([])
	const [area, setArea] = useState({
		min: '',
		max: '',
	})
	const [searchTerm, setSearchTerm] = useState('')
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
	const [isInitialized, setIsInitialized] = useState(false)
	const inputRefs = useRef({})

	const handelMainSearch = (e) => {
		setLocationSearch(e.target.value)
		if (e.target.value == '') {
			setLocationArrayFiltered([])
		} else {
			setLocationArrayFiltered(
				locationArray?.length > 0 &&
				_.filter(locationArray, (a) => {
					return a?.name?.toLowerCase().includes(e?.target?.value?.toLowerCase())
				})
			)
		}
	}
	const handelFilterMainSearch = (suggestion) => {
		// if (locationSelected?.includes(suggestion?.name)) {
		// 	setLocationSelected(locationSelected?.filter((res) => suggestion?.name !== res))
		// } else {
		// 	setLocationSelected((prev) => [...prev, suggestion?.name])
		// }
		setLocationSelected([suggestion?.name])
	}
	const handelBedBath = (type, value) => {
		if (type === 'bed') {
			let temp = bedRoom?.length > 0 && bedRoom?.includes(value)
			if (temp) {
				setBedRoom(bedRoom?.length > 0 && bedRoom?.filter((res) => res !== value))
			} else {
				if (value === 'Studio') {
					setBedRoom((prev) => [value].concat(prev))
				} else {
					setBedRoom((prev) => [...prev, value])
				}
			}
		}
		if (type === 'bath') {
			let temp = bathRoom?.length > 0 && bathRoom?.includes(value)
			if (temp) {
				setBathRoom(bathRoom?.length > 0 && bathRoom?.filter((res) => res !== value))
			} else {
				setBathRoom((prev) => [...prev, value])
			}
		}
	}
	const handelSelectAmenities = (value) => {
		let temp = amenitiesSelected?.length > 0 && amenitiesSelected?.includes(value)
		if (temp) {
			setAmenitiesSelected(amenitiesSelected?.length > 0 && amenitiesSelected?.filter((res) => res !== value))
		} else {
			setAmenitiesSelected((prev) => [...prev, value])
		}
	}
	const handleTabOpen = (key) => {
		setSelectedInput(selectedInput !== key ? key : null)
	}
	const handleTabClose = (key) => {
		setSelectedInput(selectedInput !== key ? key : null)
	}

	const fetchMasterRecords = async (slug) => {
		try {
			const path = apiPath.filterMasterRecord
			const result = await apiGet(path, {
				slug: slug,
			})
			const records = result?.data?.results
			setPropertyTypeArray(
				records?.propertyCategory.map((res) => {
					return { value: res?.[`name${direction?.langKey || ''}`], key: res._id }
				}) || []
			)
			setAreaArrayMin(records?.areaMin || [])
			setAreaArrayMax(records?.areaMax || [])
			setAreaArrayMinSet(records?.areaMin || [])
			setAreaArrayMaxSet(records?.areaMax || [])
			setProjectStatusArray(records?.projectStatus || [])
			setFurnishedStatusArray(records?.furnished || [])
			setBathroomArray(records?.bathrooms || [])
			setBedroomArray(['Studio', ...records?.bedrooms] || [])
			setPriceArrayMin(records?.priceMin || [])
			setPriceArrayMax(records?.priceMax || [])
			setPriceArrayMinSet(records?.priceMin || [])
			setPriceArrayMaxSet(records?.priceMax || [])
			setLocationArray(records?.newLocations || [])
			setSearchAmenities(records?.amenities || [])
			setPropertyAmenitiesList(records?.amenities || [])
		} catch (error) { }
	}

	useEffect(() => {
		if ((tab == 'buy' && checkBox) || tab === 'commercial-buy') {
			fetchMasterRecords('commercial')
		} else if ((tab == 'rent' && checkBox) || tab === 'commercial-rent') {
			fetchMasterRecords('commercial-rent')
		} else if (tab == 'buy') {
			fetchMasterRecords(tab)
		} else if (tab === 'rent') {
			fetchMasterRecords(tab)
		} else if (tab == 'project') {
			fetchMasterRecords(tab)
		}
	}, [checkBox, tab])

	const handelPropertyType = (id) => {
		if (id !== 'Select Property Type') {
			// let tempId = propertyTypeSelectedId?.length > 0 && propertyTypeSelectedId?.includes(id)
			// if (tempId) {
			// 	setPropertyTypeSelectedId(propertyTypeSelectedId?.length > 0 && propertyTypeSelectedId?.filter((res) => res !== id))
			// } else {
			// 	setPropertyTypeSelectedId((prev) => [...prev, id])
			// }
			setPropertyTypeSelectedId([id])
		} else {
			setPropertyTypeSelectedId([])
		}
		setSelectedInput(null)
	}

	const PriceRangeText = (obj) => {
		if (obj?.min == '' && obj?.max == '') {
			return tab == "project" ? t("STARTING_PRICE") : t("CUSTOMER_HOME_PRICE");
		} else if (obj?.min !== '' && obj?.max == '') {
			return `From ${obj?.min}`
		} else if (obj?.max !== '' && obj?.min == '') { return `Up to ${obj?.max}` } else {
			return `${obj?.min} - ${obj?.max}`
		}
	};
	const AreaRangeText = (obj) => {
		if (obj?.min == '' && obj?.max == '') {
			return t("AREA")
		} else if (obj?.min !== '' && obj?.max == '') {
			return `From ${obj?.min}`
		} else if (obj?.max !== '' && obj?.min == '') { return `Up to ${obj?.max}` } else {
			return `${obj?.min} - ${obj?.max}`
		}
	};

	const AmenitiesText = (amenitiesSelected) => {
		if (amenitiesSelected?.length == 1) {
			let obj = amenitiesList?.find((res) => {
				return res?._id === amenitiesSelected[0]
			})
			return `${direction?.langKey == 'Ar' ? obj?.nameAr : obj?.name
				}`
		} else if (amenitiesSelected?.length > 1) {
			return `${amenitiesSelected?.length} ${t('AMENITIES')}`
		} else {
			return t('AMENITIES')
		}
	}

	const PropertyTypeText = (propertyTypeSelected) => {
		if (propertyTypeSelected?.length == 1) {
			return `${propertyTypeArray?.find((res) => {
				return res.key === propertyTypeSelected[0]
			})?.value
				}`
		} else if (propertyTypeSelected?.length > 1) {
			return `${propertyTypeSelected?.length} Property Type`
		} else {
			return t('CUSTOMER_HOME_PROPERTY_TYPE')
		}
	}

	let checkObj = {
		city: 'community',
		community: 'subCommunity',
		subCommunity: 'subCommunity'
	}

	const typeCheck = (queryData) => {
		if ('locationSelected' in queryData) {
			if (!isEmpty(queryData.locationSelected)) {
				let locationSelected = JSON.parse(queryData.locationSelected)
				if (locationSelected.length) {
					locationSelected = locationSelected[0]
					return checkObj[locationSelected?.type] || 'city'
				}
			}

			return 'city'
		}
		// if (isEmpty(queryData?.propertyType) && isEmpty(queryData?.locationSelected)) {
		//     return ''
		// } else if (isEmpty(queryData?.propertyType) && !isEmpty(queryData?.locationSelected)) {
		//     return ''
		// } else if (!isEmpty(queryData?.propertyType) && isEmpty(queryData?.locationSelected)) {
		//     return 'city'
		// } else if (!isEmpty(queryData?.propertyType) && !isEmpty(queryData?.locationSelected) && queryData?.type === 'community') {
		//     return 'community'
		// } else if (!isEmpty(queryData?.propertyType) && !isEmpty(queryData?.locationSelected) && queryData?.type === 'subCommunity') {
		//     return 'subCommunity'
		// } else {
		//     return 'building'
		// }
	}

	const PriceFormatMinAndMax = (pageTypeCheck, obj) => {
		if (obj?.minPrice !== '' && !isEmpty(obj?.minPrice)) {
			if (pageTypeCheck === 'rent' || pageTypeCheck === 'commercial-rent') {
				if (obj?.minPrice == '60001') {
					return `${obj?.minPrice}-Above`
				} else {
					return `${obj?.minPrice}-${obj?.maxPrice}`
				}
			} else if (pageTypeCheck === 'buy' || pageTypeCheck === 'commercial-buy' || pageTypeCheck === 'project') {
				if (obj?.minPrice == '600001') {
					return `${obj?.minPrice}-Above`
				} else {
					return `${obj?.minPrice}-${obj?.maxPrice}`
				}
			}
		} else {
			return ''
		}
	}

	const onSubmit = () => {
		let obj = {}
		let selected = locationArray?.filter((el) => {
			return locationSelected?.find((element) => {
				return element === el.name
			})
		})
		selected = selected.map(item => {
			return {
				"_id": item._id,
				"name": item.name,
				"type": item.type
			};
		});
		obj = {
			slug: pageType,
			pageName: pageType,
			minArea: area?.min,
			maxArea: area?.max,
			propertyType: propertyTypeSelectedId,
			bedroom: bedRoom,
			bathroom: bathRoom,
			minPrice: priceRange?.min,
			maxPrice: priceRange?.max,
			amenities: amenitiesSelected,
			completeStatus: completeStatus,
			keyword: search,
			status: projectStatusNormal,
			priceType: priceRange?.type,
			priceRangeType: priceRange?.type,
			locationSelected: selected?.length > 0 ? JSON.stringify(selected) : '',
			checkBox: checkBox
		}

		// if (['rent', 'commercial-rent'].includes(pageType)) {
		// 	obj.priceType = priceRange?.type
		// }
		let type = typeCheck(obj)
		obj = {
			...obj,
			type: type,
		}
		setSelectedInput(null)
		if (isFunction(setFilter)) {
			setFilter({
				...filter,
				page: 1,
			});
		}

		router.push({
			pathname: `/map-search`,
			query: obj,
		})

		// if (tab == 'project') {
		// 	router.push({
		// 		pathname: `/newProjects`,
		// 		query: obj,
		// 	})
		// 	if (isFunction(setFilter)) {
		// 		setFilter({
		// 			...filter,
		// 			page: 1,
		// 		});
		// 	}
		// } else if (checkBox === true) {
		// 	setSelectedInput(null)
		// 	router.push({
		// 		pathname: tab == 'rent' ? '/commercial-rent' : `/commercial`,
		// 		query: obj,
		// 	})
		// 	if (isFunction(setFilter)) {
		// 		setFilter({
		// 			...filter,
		// 			page: 1,
		// 		});
		// 	}
		// } else if (page == 'home') {
		// 	setSelectedInput(null)
		// 	router.push({
		// 		pathname: `/${tab}`,
		// 		query: obj,
		// 	})
		// 	if (isFunction(setFilter)) {
		// 		setFilter({
		// 			...filter,
		// 			page: 1,
		// 		});
		// 	}
		// } else if (pageType == 'commercial-buy') {
		// 	setSelectedInput(null)
		// 	router.push({
		// 		pathname: `/commercial`,
		// 		query: obj,
		// 	})
		// 	if (isFunction(setFilter)) {
		// 		setFilter({
		// 			...filter,
		// 			page: 1,
		// 		});
		// 	}
		// } else if (pageType == 'commercial-rent') {
		// 	setSelectedInput(null)
		// 	router.push({
		// 		pathname: `/commercial-rent`,
		// 		query: obj,
		// 	})
		// 	if (isFunction(setFilter)) {
		// 		setFilter({
		// 			...filter,
		// 			page: 1,
		// 		});
		// 	}
		// } else {
		// 	setSelectedInput(null)
		// 	router.push({
		// 		pathname: `/${pageType}`,
		// 		query: obj,
		// 	})
		// 	if (isFunction(setFilter)) {
		// 		setFilter({
		// 			...filter,
		// 			page: 1,
		// 		});
		// 	}
		// }
	}

	const removeSelected = (key) => {
		setLocationSelected((prev) => {
			return prev?.length == 1 ? [] : prev?.filter((res) => res !== key)
		})
	}

	let bedRoomCheck = (obj) => {
		if (obj?.bedroom == 'Studio') {
			return ['Studio']
		} else if (parseInt(obj?.bedroom) === 10) {
			return [10]
		} else if (parseInt(obj?.bedroom) == 11) {
			return [11]
		} else if (obj?.bedroom?.length === 1) {
			return [Number(obj?.bedroom)]
		} else if (obj?.bedroom?.length > 1) {
			return obj?.bedroom?.map((res) => {
				return res?.length > 3 ? res : Number(res)
			})
		} else {
			return []
		}
	}

	let bedBathCheck = (obj) => {
		if (parseInt(obj?.bathroom) === 10) {
			return [10]
		} else if (parseInt(obj?.bathroom) == 11) {
			return [11]
		} else if (obj?.bathroom?.length === 1) {
			return [Number(obj?.bathroom)]
		} else if (obj?.bathroom?.length > 1) {
			return obj?.bathroom?.map((res) => {
				return res?.length > 3 ? res : Number(res)
			})
		} else {
			return []
		}
	}

	useEffect(() => {
		let obj = router.query
		if (!isEmpty(obj)) {
			setArea({
				min: obj?.minArea || '',
				max: obj?.maxArea || '',
			})
			setBathRoom(bedBathCheck(obj))
			setSearch(obj?.keyword || '')
			setAmenitiesSelected(isString(obj?.amenities) ? [obj?.amenities] : obj?.amenities || [])
			setPriceRange({
				min: obj?.minPrice || '',
				max: obj?.maxPrice || '',
				// value: PriceFormatMinAndMax(tab, obj),
				type: !isEmpty(obj?.priceRangeType) ? obj?.priceRangeType : (obj?.pageName === 'rent' || obj?.pageName === 'commercial-rent') ? 'yearly' : "",
			})
			setPropertyTypeSelectedId(obj?.propertyType?.length == 24 ? [obj?.propertyType] : obj?.propertyType || [])
			setCheckBox(obj?.checkBox)
			setBedRoom(bedRoomCheck(obj))
			setCompleteStatus(obj?.completeStatus || '')
			setPropertyTypeName(obj?.propertyType || '')
			setLocationSelected(
				!isEmpty(obj?.locationSelected)
					? (JSON.parse(obj?.locationSelected).length > 0 &&
						JSON.parse(obj?.locationSelected)?.map((res) => {
							return res.value
						})) ||
					[]
					: []
			)
			setProjectStatusNormal(obj?.status)
		}
		// if (tab !== 'project') {
		// 	setPageType(router?.route?.split('/')[1] == 'commercial' ? 'commercial-buy' : router?.route?.split('/')[1] || '')
		// }
		setPageType(tab)
	}, [router.query])

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!['page_type', 'search_property_type', 'bed_bath', 'price', 'completion', 'status', 'area', 'amenities', 'proj_status', 'rental_period'].some((word) => event?.target?.id.startsWith(word))) {
				setSelectedInput(null)
			}
		}
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

	Array.prototype.contiguous = function () {
		let current = this[0]
		for (let i = 1; i < this.length; i++) {
			if (current + 1 !== this[i]) {
				return false
			}
			current = this[i]
		}
		return true
	}
	const bedRoomText = () => {
		if (bedRoom?.length > 0) {
			if (bedRoom[0] == 'Studio') {
				if (bedRoom?.length == 1) {
					return `Studio `
				} else if (
					bedRoom?.length > 2 &&
					[0, ...bedRoom?.slice(1, bedRoom?.length)]
						?.sort((a, b) => {
							return a - b
						})
						.contiguous()
				) {
					return `Studio - ${bedRoom[bedRoom?.length - 1] > 7 ? '7+' : bedRoom[bedRoom?.length - 1]} `
				} else {
					return bedRoom
						?.sort((a, b) => {
							return a - b
						})
						?.map((res, index) => {
							return `${res > 7 ? '7+' : res} ${bedRoom?.length - 1 !== index ? ',' : ''} `
						})
				}
			} else if (
				bedRoom
					?.sort((a, b) => {
						return a - b
					})
					.contiguous()
			) {
				if (bedRoom?.length == 1) {
					return `${bedRoom[0] > 7 ? `7+` : bedRoom[0]} `
				} else if (bedRoom?.length > 1) {
					return `${bedRoom[0]} - ${bedRoom[bedRoom?.length - 1] > 7 ? '7+' : bedRoom[bedRoom?.length - 1]} `
				}
			} else {
				return bedRoom
					?.sort((a, b) => {
						return a - b
					})
					?.map((res, index) => {
						return `${res > 7 ? '7+' : res} ${bedRoom?.length - 1 !== index ? ',' : ''} `
					})
			}
		}
	}
	const bathRoomText = () => {
		if (bathRoom?.length > 0) {
			if (bathRoom?.length > 1) {
				if (
					bathRoom
						?.sort((a, b) => {
							return a - b
						})
						.contiguous()
				) {
					return `${bathRoom[0]} - ${bathRoom[bathRoom?.length - 1] > 7 ? '7+' : bathRoom[bathRoom?.length - 1]} `
				} else {
					return bathRoom
						?.sort((a, b) => {
							return a - b
						})
						?.map((res, index) => {
							return `${res > 7 ? '7+' : res} ${bathRoom?.length - 1 !== index ? '' : ''} `
						})
				}
			} else if (bathRoom?.length == 1) {
				return `${bathRoom[0] > 7 ? `7+` : bathRoom[0]} `
			}
		} else {
			return ''
		}
	}

	useEffect(() => {
		if (!isInitialized) {
			setIsInitialized(true)
		} else if (searchTerm || !filter?.isReset) {
			if (isFunction(setFilter)) {
				setFilter({ ...filter, isReset: false, searchKey: debouncedSearchTerm ? debouncedSearchTerm : '', isFilter: debouncedSearchTerm ? true : false })
			}
		}
	}, [debouncedSearchTerm])

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm)
		}, 500)
		return () => {
			clearTimeout(timeoutId)
		}
	}, [searchTerm])

	const toggle = (type) => {
		if (type == 'first') {
			setPriceRangeToggle(!priceRangeToggle)
			if (!priceRangeToggle) {
				setPriceRangeToggleMin(false)
			}
		}
		if (type == 'second') {
			setPriceRangeToggleMin(!priceRangeToggleMin)
			if (!priceRangeToggleMin) {
				setPriceRangeToggle(false)
			}
		}
	}


	const toggleArea = (type) => {
		if (type == 'first') {
			setAreaRangeToggle(!areaRangeToggle)
			if (!areaRangeToggle) {
				setAreaRangeToggleMin(false)
			}
		}
		if (type == 'second') {
			setAreaRangeToggleMin(!areaRangeToggleMin)
			if (!areaRangeToggleMin) {
				setAreaRangeToggle(false)
			}
		}
	}

	return (
		<Form className='position-relative'>
			<div className='filter_main filter_drop_set'>
				<div className='search_outer'>
					<button className='bg-transparent border-0'>
						<img src='images/search_outer.svg' />
					</button>
					<Form.Control
						type='text'
						value={locationSearch}
						placeholder={t('CUSTOMER_HOME_CITY_COMMUNITY_SUBCOMMUNITY')}
						onChange={(e) => {
							handelMainSearch(e)
						}}
					/>
					<div className='selected_address'>
						{locationSelected?.length == 1 || locationSelected?.length > 0 ? (
							<span className=''>
								{locationSelected[0]}
								<button type='button' className='p-0 border bg-transparent position-absolute end-1 top-1 '>
									<Image src='/images/close-icon.svg' width={14} height={14} alt='' onClick={() => removeSelected(locationSelected[0])} />
								</button>
							</span>
						) : null}
						{locationSelected?.length !== 1 && locationSelected?.length > 0 && (
							<span className=''>
								{locationSelected?.length - 1} {t('MORE')}
								<button type='button' className='p-0 border bg-transparent position-absolute end-1 top-1 '>
									<Image
										src='/images/close-icon.svg'
										width={14}
										height={14}
										onClick={() => {
											setLocationSelected(locationSelected?.slice(0, 1))
										}}
										alt=''
									/>
								</button>
							</span>
						)}
					</div>
					<div
						className={classNames('search_suggestion_list', {
							'd-none': isEmpty(locationSearch),
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
													handelFilterMainSearch(suggestion)
													setLocationSearch('')
												}}
											>
												<Image src='/images/location.svg' width={24} height={24} alt='' />
												<span> {suggestion?.name}</span>
											</button>
										</li>
									)
								})
							) : (
								<li className='p-2'>
									<span>
										{t('WE_CAN')}&apos;{t('FIND_YOUR_SEARCH_QUERY')}
									</span>
								</li>
							)}
						</ul>
					</div>
				</div>
				{tab === 'project' && (
					<div className='search_outer project_search_outer ps-0 border-start-0'>
						<Form className='d-flex align-items-center justify-content-md-end float-md-end w-100'>
							<InputGroup className='position-relative title_form_outer_wrap'>
								<InputGroup.Text id='basic-addon1' className='bg-white border-end-0 pe-0'>
									<img src='./images/search_outer.svg' alt='image' />
								</InputGroup.Text>
								<Form.Control
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='form-control border-start-0 rounde-around-right'
									placeholder={t("Search_by_title")}
									aria-describedby='basic-addon1'
								/>
								<button
									className={classNames('close', { 'd-none': !searchTerm.length })}
									type='button'
									onClick={() => {
										setSearchTerm('')
									}}
								>
									<Image src='/images/close-icon.svg' width={14} height={14} alt='crossImg' />
								</button>
							</InputGroup>
						</Form>
					</div>
				)}
				{(!isEmpty(pageType) && tab !== 'project') && (
					<div className='filter_cols'>
						<button id='page_type' className='form-select property_filter_inner selected_fine' type='button' onClick={handleTabOpen.bind(this, 'page_type')}>
							{startCase(pageType)}
						</button>
						<div
							className={classNames('property_type filter_dropbox', {
								'd-none': selectedInput != 'page_type',
							})}
						>
							<ul>
								{config?.propertyType?.map((res, index) => {
									if (res?.status === 'active') {
										return (
											<li
												onClick={() => {
													setPageType(res.slug)
													handleTabClose('page_type')
													fetchMasterRecords(res.slug)
													setPropertyTypeSelectedId([])
													setPriceRange({
														min: '',
														max: '',
														value: '',
														type: 'yearly',
													})
												}}
												className={pageType === res.slug && 'selected'}
												key={index}
											>
												{res?.[`name${direction?.langKey || ''}`]}
											</li>
										)
									}
								})}
							</ul>
						</div>
					</div>
				)}

				<div className='filter_cols '>
					<button
						className={`form-select property_filter_inner ${!isEmpty(propertyTypeSelectedId) && 'selected_fine'}`}
						type='button'
						onClick={handleTabOpen.bind(this, 'property_type')}
						id='search_property_type'
						ref={(ref) => (inputRefs.current['search_property_type'] = ref)}
					>
						{propertyTypeSelectedId == 'Select Property Type' ? 'Select Property Type' : PropertyTypeText(propertyTypeSelectedId)}
					</button>

					<div
						className={classNames('property_type filter_dropbox', {
							'd-none': selectedInput != 'property_type',
						})}
					>
						<ul>
							<li
								onClick={() => {
									handelPropertyType('Select Property Type')
								}}
							>
								{t('SELECT_PROPERTY_TYPE')}
							</li>
							{propertyTypeArray?.map((res, index) => {
								return (
									<li
										onClick={() => {
											handelPropertyType(res.key)
										}}
										className={propertyTypeSelectedId?.length > 0 && propertyTypeSelectedId?.includes(res.key) && 'selected'}
										key={index}
										id={`search_property_type_${index}`}
										ref={(ref) => (inputRefs.current[`search_property_type_${index}`] = ref)}
									>
										{res.value}
									</li>
								)
							})}
						</ul>
					</div>
				</div>
				{/* {!checkBox && */}
				<div className='filter_cols beds-bathmns'>
					<button className='form-select property_filter_inner' type='button' id={'bed_bath'} onClick={handleTabOpen.bind(this, 'beds_bath')}>
						{bedRoomText()}
						{tab === 'project' ? t('BEDROOMS') : t('BEDS')}
						{tab !== 'project' ? ` & ${bathRoomText()} ${t('BATHS')}` : ''}
					</button>

					<div
						className={classNames('beds_baths filter_dropbox', {
							'd-none': selectedInput != 'beds_bath',
						})}
					>
						<div className='beds_baths_list'>
							<strong>{t('BEDROOMS')}</strong>
							<ul className='beds_baths_count'>
								{bedroomArray.map((res, index) => {
									return (
										<li
											key={index}
											onClick={() => handelBedBath('bed', isNumber(res) ? Number(res) : res)}
											className={bedRoom.includes(res) && 'active'}
											id='bed_bath_1'
											ref={(ref) => (inputRefs.current['bed_bath_1'] = ref)}
										>
											{res > 7 ? '7+' : res}
										</li>
									)
								})}
							</ul>
						</div>

						{tab !== 'project' && (
							<div className='beds_baths_list'>
								<strong>{t('BATHROOMS')}</strong>
								<ul className='beds_baths_count'>
									{bathroomArray.map((res, index) => {
										return (
											<li
												key={index}
												onClick={() => handelBedBath('bath', Number(res))}
												className={bathRoom.includes(res) && 'active'}
												id='bed_bath_2'
												ref={(ref) => (inputRefs.current['bed_bath_2'] = ref)}
											>
												{res > 7 ? '7+' : res}
											</li>
										)
									})}
								</ul>
							</div>
						)}
						{(bedRoom?.length > 0 || bathRoom?.length > 0) && (
							<div
								style={{ cursor: 'pointer' }}
								className='pt-2 reset_tab'
								onClick={() => {
									setBathRoom([])
									setBedRoom([])
								}}
							>
								{' '}
								<span className='text-green'>{t('RESET')}</span>
							</div>
						)}
					</div>
				</div>
				{/* // } */}
				<div className="filter_cols price_filter">
					<button
						className="form-select property_filter_inner"
						type="button"
						id={"price"}
						onClick={handleTabOpen.bind(this, "price")}
					>
						{PriceRangeText(priceRange)}
					</button>
					<div
						className={classNames("price_filter filter_dropbox", {
							"d-none": selectedInput != "price",
						})}
					>
						<div className="price_filter_set">
							<div className="price_field">
								<Form.Control
									type="text"
									autoComplete="off"
									placeholder={`Min Price (${config?.currency})`}
									value={priceRange?.min}
									onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
									onClick={() => {
										toggle('second')
									}}
									id="search_property_type"
								/>
								<div
									className={classNames("property_type property_type-price filter_dropbox ", {
										"d-none": !priceRangeToggleMin,
									})}
								>
									<ul>
										{priceArrayMin?.map((res, index) => {
											return (
												<li
													onClick={() => {
														{ setPriceRange({ ...priceRange, min: res }); setPriceRangeToggleMin(false) }
													}}
													className={
														priceRange?.min == res &&
														"selected"
													}
													key={index}
													id={`search_property_type_${index}`}
													ref={(ref) =>
													(inputRefs.current[
														`search_property_type_${index}`
													] = ref)
													}
												>
													{Helpers.priceFormat(res)}
												</li>
											);
										})}
									</ul>
								</div>
							</div>
							<span>-</span>
							{/* <div className='filter_cols '>
								<button
									className={`form-select property_filter_inner ${!isEmpty(propertyTypeSelectedId) && 'selected_fine'}`}
									type='button'
									onClick={handleTabOpen.bind(this, 'property_type')}
									id='search_property_type'
									ref={(ref) => (inputRefs.current['search_property_type'] = ref)}
								>
									{propertyTypeSelectedId == 'Select Property Type' ? 'Select Property Type' : PropertyTypeText(propertyTypeSelectedId)}
								</button>

								<div
									className={classNames('property_type filter_dropbox', {
										'd-none': selectedInput != 'property_type',
									})}
								>
									<ul>
										<li
											onClick={() => {
												handelPropertyType('Select Property Type')
											}}
										>
											{t('SELECT_PROPERTY_TYPE')}
										</li>
										{propertyTypeArray?.map((res, index) => {
											return (
												<li
													onClick={() => {
														handelPropertyType(res.key)
													}}
													className={propertyTypeSelectedId?.length > 0 && propertyTypeSelectedId?.includes(res.key) && 'selected'}
													key={index}
													id={`search_property_type_${index}`}
													ref={(ref) => (inputRefs.current[`search_property_type_${index}`] = ref)}
												>
													{res.value}
												</li>
											)
										})}
									</ul>
								</div>
							</div> */}
							<div className="price_field">
								<Form.Control
									type="text"
									autoComplete="off"
									placeholder={`Max Price (${config?.currency})`}
									value={priceRange?.max}
									onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
									onClick={() => {
										toggle('first')
									}}
									id="search_property_type"
									onKeyDown={NumberInputNew}
								/>
								<div
									className={classNames("property_type property_type-price filter_dropbox", {
										"d-none": !priceRangeToggle,
									})}
								>
									<ul>
										{priceArrayMax?.map((res, index) => {
											return (
												<li
													onClick={() => {
														{ setPriceRange({ ...priceRange, max: res }); setPriceRangeToggle(false) }
													}}
													className={
														priceRange?.max == res &&
														"selected"
													}
													key={index}
													id={`search_property_type_${index}`}
													ref={(ref) =>
													(inputRefs.current[
														`search_property_type_${index}`
													] = ref)
													}
												>
													{Helpers.priceFormat(res)}
												</li>
											);
										})}
									</ul>
								</div>
							</div>
						</div>
						{(priceRange?.min !== "" || priceRange?.max !== "") ? (
							<div
								style={{ cursor: "pointer" }}
								className="pt-2 reset_tab"
								onClick={() => {
									setPriceRange({
										min: "",
										max: "",
										value: "",
										type: "yearly",
									});
									setPriceArrayMax(priceArrayMaxSet);
									setPriceArrayMin(priceArrayMinSet);
								}}
							>
								{" "}
								<span className="text-green">{t("RESET")}</span>
							</div>
						) : (
							""
						)}
						{(tab === "rent" || pageType == "rent") && (
							<div className="beds_baths_list mt-3 mt-md-4">
								<strong>Rental Period </strong>
								<ul className="beds_baths_count">
									{PriceType?.map((res, index) => {
										return (
											<li
												onClick={() =>
													setPriceRange({ ...priceRange, type: res?.key })
												}
												key={index}
												id={`rental_period_${index}`}
												className={priceRange?.type === res?.key && "active"}
											>
												{res.value}
											</li>
										);
									})}
								</ul>
							</div>
						)}
					</div>
				</div>
				<div className='btn_outer'> </div>
			</div>
			<div className='show_more filter_drop_set_advance pt-2'>
				<Collapse in={open}>
					<div id='filter_more' className='filter_main filter_drop_set'>
						{tab !== 'project' && !checkBox && (
							<div className='filter_cols'>
								<button className='form-select property_filter_inner' type='button' id='completion' onClick={handleTabOpen.bind(this, 'completeStatus')}>
									{completeStatus !== '' ? startCase(completeStatus) : t('COMPLETION_STATUS')}
								</button>

								<div
									className={classNames('property_type filter_dropbox', {
										'd-none': selectedInput != 'completeStatus',
									})}
								>
									<ul>
										<li
											onClick={() => {
												setCompleteStatus('')
												handleTabClose('completeStatus')
											}}
										>
											Select Complete Status
										</li>
										{furnishedStatusArray?.length > 0 &&
											furnishedStatusArray?.map((res, index) => {
												return (
													<li
														key={index}
														className={completeStatus === res.value && 'selected'}
														onClick={() => {
															setCompleteStatus(res.value)
															handleTabClose('completeStatus')
														}}
													>
														{startCase(res.value)}
													</li>
												)
											})}
									</ul>
								</div>
							</div>
						)}
						{tab !== 'project' && !checkBox && (
							<div className='filter_cols'>
								<button className='form-select property_filter_inner' type='button' id='status' onClick={handleTabOpen.bind(this, 'status')}>
									{!isEmpty(projectStatusNormal) ? startCase(projectStatusNormal) : t('STATUS')}
								</button>

								<div
									className={classNames('property_type filter_dropbox', {
										'd-none': selectedInput != 'status',
									})}
								>
									<ul>
										<li
											onClick={() => {
												setProjectStatusNormal('')
												handleTabClose('status')
											}}
										>
											Select Status
										</li>
										{projectStatusArray?.length > 0 &&
											projectStatusArray?.map((res, index) => {
												return (
													<li
														key={index}
														className={projectStatusNormal === res.value && 'selected'}
														onClick={() => {
															setProjectStatusNormal(res.value)
															handleTabClose('status')
														}}
													>
														{startCase(res.value)}
													</li>
												)
											})}
									</ul>
								</div>
							</div>
						)}

						{tab !== 'project' && (
								<div className="filter_cols">
								<button
									className="form-select property_filter_inner"
									type="button"
									id="area"
									onClick={handleTabOpen.bind(this, "area")}
								>
									{AreaRangeText(area)}
								</button>
								<div
									className={classNames("price_filter filter_dropbox", {
										"d-none": selectedInput != "area",
									})}
								>
									<div className="price_filter_set">

										{/* <div className="price_field">
											<Form.Select
												value={area?.value}
												onChange={(e) => {
													setArea({
														...area,
														value: e.target.value,
													});
													// if (e.target.value === '') {
													// }
													// else {
													// 	const minArea = areaArrayMaxSet.slice(areaArrayMaxSet.findIndex((item) => item == e.target.value) + 1, areaArrayMaxSet.length)
													// 	setAreaArrayMax(minArea)
													// }
												}}
												id="area_select_min"
												className="property_filter_inner price_select"
											>
												<option value="">{`${t("MIN_AREA")} ${config?.areaUnit
													}`}</option>
												{AreaOption?.map((res, index) => {
													return (
														<option
															key={index}
															value={res?.value}
															id={`area_min_${index}`}
														>
															{`${res?.label} ${config?.areaUnit}`}
														</option>
													);
												})}
											</Form.Select>
										</div> */}
										<div className="price_field">
											<Form.Control
												type="text"
												autoComplete="off"
												placeholder={`Min Area (${config?.areaUnit})`}
												value={area?.min}
												onChange={(e) => setArea({ ...area, min: e.target.value })}
												onClick={() => {
													toggleArea('second')
												}}
												id="search_property_type"
												onKeyDown={NumberInputNew}
											/>
											<div
												className={classNames("property_type property_type-price filter_dropbox", {
													"d-none": !areaRangeToggleMin,
												})}
											>
												<ul>
													{areaArrayMin?.map((res, index) => {
														return (
															<li
																onClick={() => {
																	{ setArea({ ...area, min: res }); setAreaRangeToggleMin(false) }
																}}
																className={
																	area?.min == res &&
																	"selected"
																}
																key={index}
																id={`search_property_type_${index}`}
																ref={(ref) =>
																(inputRefs.current[
																	`search_property_type_${index}`
																] = ref)
																}
															>
																{`${Helpers.priceFormat(res)} ${config?.areaUnit}`}
															</li>
														);
													})}
												</ul>
											</div>
										</div>
										<span>-</span>
										<div className="price_field">
											<Form.Control
												type="text"
												autoComplete="off"
												placeholder={`Max Area (${config?.areaUnit})`}
												value={area?.max}
												onChange={(e) => setArea({ ...area, max: e.target.value })}
												onClick={() => {
													toggleArea('first')
												}}
												id="search_property_type"
												onKeyDown={NumberInputNew}
											/>
											<div
												className={classNames("property_type property_type-price filter_dropbox", {
													"d-none": !areaRangeToggle,
												})}
											>
												<ul>
													{areaArrayMax?.map((res, index) => {
														return (
															<li
																onClick={() => {
																	{ setArea({ ...area, max: res }); setAreaRangeToggle(false) }
																}}
																className={
																	area?.max == res &&
																	"selected"
																}
																key={index}
																id={`search_property_type_${index}`}
																ref={(ref) =>
																(inputRefs.current[
																	`search_property_type_${index}`
																] = ref)
																}
															>
																{`${Helpers.priceFormat(res)} ${config?.areaUnit}`}
															</li>
														);
													})}
												</ul>
											</div>
										</div>
									</div>
									{(area?.min !== "" || area?.max !== "") ? (
										<div
											style={{ cursor: "pointer" }}
											className="pt-2 reset_tab"
											onClick={() => {
												setArea({
													min: "",
													max: "",
													value: "",
												});
												setAreaArrayMax(areaArrayMaxSet);
												setAreaArrayMin(areaArrayMinSet);
											}}
										>
											{" "}
											<span className="text-green">{t("RESET")}</span>
										</div>
									) : (
										""
									)}
									{/* {area?.min == '' || area?.max == '' ? '' :
                                        <div style={{ cursor: "pointer" }} className="pt-2 reset_tab" onClick={() => {
                                            setArea({
                                                min: '',
                                                max: ''
                                            })
                                        }}> <span className="text-green">{t("RESET")}</span></div>
                                    } */}
								</div>
							</div>
						)}

						{tab !== 'project' && !checkBox && (
							<div className='filter_cols'>
								<button className='form-select property_filter_inner' type='button' id='amenities' onClick={handleTabOpen.bind(this, 'amenities')}>
									{AmenitiesText(amenitiesSelected)}
								</button>
								<div
									className={classNames('Amenities_filter filter_dropbox', {
										'd-none': selectedInput != 'amenities',
									})}
								>
									<div className='Amenities_filter_set'>
										<Form.Control
											type='text'
											id={`amenities_text`}
											onChange={(e) => {
												if (e.target.value == '') {
													setSearchAmenities(amenitiesList)
												} else {
													setSearchAmenities(
														amenitiesList?.length > 0 &&
														_.filter(amenitiesList, (a) => {
															return a?.name?.toLowerCase().includes(e?.target?.value?.toLowerCase())
														})
													)
												}
											}}
											placeholder={t('SEARCH_AMENITIES')}
										/>
										{isEmpty(amenitiesSelected) ? (
											''
										) : (
											<div
												style={{ cursor: 'pointer' }}
												className='pt-2 reset_tab'
												onClick={() => {
													setAmenitiesSelected([])
												}}
											>
												{' '}
												<span className='text-green'>{t('RESET')}</span>
											</div>
										)}
										<ul>
											{searchedAmenities?.length > 0 ? (
												searchedAmenities?.map((res, index) => {
													return (
														<li key={index}>
															<Form.Check
																id={`amenities_${index}`}
																onClick={() => handelSelectAmenities(res._id)}
																checked={amenitiesSelected?.length > 0 && amenitiesSelected.includes(res._id)}
																onChange={() => {
																	//FIXME: console.log('You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`')
																}}
																type='checkbox'
																label={<span id={`amenities_label_${index}`}>{res?.[`name${direction?.langKey || ''}`]}</span>}
															/>
														</li>
													)
												})
											) : (
												<li>
													<span>{t('NO_AMENITIES_FOUND')}</span>
												</li>
											)}
										</ul>
									</div>
								</div>
							</div>
						)}

						{tab !== 'project' && (
							<div className='search_outer me-0 ms-1'>
								<button className='bg-transparent border-0'>
									<img src='images/search_outer.svg' />
								</button>
								<Form.Control type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('KEYWORDS_BEACH')} />
								<button
									className={classNames('close', { 'd-none': !search.length })}
									type='button'
									onClick={() => {
										setSearch('')
									}}
								>
									<Image src='/images/close-icon.svg' width={14} height={14} alt='' />
								</button>
							</div>
						)}
					</div>
				</Collapse>
			</div>
			{tab !== 'project' && (
				<div className={`filter_bottom pt-2 d-sm-flex align-items-center ${page === 'home' ? 'justify-content-between' : 'justify-content-end'} `}>
					{page == 'home' && !slugCondition?.includes('commercial') && (
						<Form.Check
							checked={checkBox}
							onClick={(e) => {
								setCheckBox(e.target.checked)
							}}
							label={t('CUSTOMER_HOME_COMMERCIAL_PROPERTY')}
						/>
					)}
					<Button onClick={() => setOpen(!open)} className='bg-transparent border-0 p-0 text-primary showmore-option-btn fw-normal fs-6'>
						{!open ? t('SHOW_MORE_SEARCH_OPTION') : t('SHOW_LESS_SEARCH_OPTION')}
						<span className='down_Arrow'>
							<img style={{ rotate: open && '180deg' }} src='images/down-blue.svg' />
						</span>
					</Button>
				</div>
			)}
			{/* <Button onClick={onSubmit} className="btn theme_btn">
                {t("CUSTOMER_HOME_SEARCH")}
            </Button> */}
			<Button onClick={onSubmit} className='btn theme_btn small_btn'>
				<span className='mx-2 d-block d-md-none fs-14'>Find</span>
				<img src='images/search_outer.svg' className='d-none d-md-block' alt='' />
			</Button>
		</Form>
	)
}

export default SearchForm
