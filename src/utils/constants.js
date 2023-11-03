import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

export const validationRules = {
	email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
	password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/,
	passwordMessage: 'Password must contain uppercase and lowercase characters, numbers, special character and must be minimum 8 character long.',
	characters: /^[a-zA-Z_ ]*$/,
	numbers: /^[0-9]*$/,
	removeWhitespace: /^[a-zA-Z0-9]+$/,
	numberNew: /^[0-9]*$/,
	numberWithDot: /^\d*(\.\d{0,10})?$/,
}
export const preventMaxInput = (e) => {
	e.target.value = e.target.value.trimStart()
	e.target.value = e.target.value.replace(/  +/g, ' ')
}
const UseChange = ({ data }) => {
	let { t } = useTranslation()
	return t(data)
}
export const sideBarObj = {
	changePassword: <>{<UseChange data='CHANGE_PASSWORD' />}</>,
	profile: <>{<UseChange data='MY_PROFILE' />}</>,
	savedProperties: <>{<UseChange data='SAVED_PROPERTIES' />}</>,
	auction: <>{<UseChange data='AUCTION_PROPERTIES' />}</>,
	setting: <>{<UseChange data='SETTINGS' />}</>,
	appointments: <>{<UseChange data='MY_APPOINTMENT' />}</>,
	propertyApproval: <>{<UseChange data='PROPERTY_APPROVAL' />}</>,
	reports: <>{<UseChange data='REPORTS' />}</>,
}
export const sideBarObjHeader = {
	changePassword: 'Change Password',
	profile: 'My Profile',
	savedProperties: 'Saved Properties',
	auction: 'Auction Properties',
	setting: 'Setting',
	appointments: 'My Appointment',
	propertyApproval: 'Property Approval',
	reports: 'Report',
}
export const layoutCheck = ['/login', '/register', '/forgotPassword', '/otpVerify', '/resetPassword']
export const AlphaInput = (event) => {
	// if (event) {
	// 	const char = String.fromCharCode(event.which);
	// 	if (!/^[a-zA-Z ]+$/.test(char)) {
	// 		event.preventDefault();
	// 	}
	// }
}

export const FloatInput = (event) => {
	if (event) {
		const char = String.fromCharCode(event.which)
		if (!/^\d*(\.\d{0,2})?$/.test(char)) {
			event.preventDefault()
		}
	}
}

export const NumberInput = (event) => {
	if (event) {
		const char = String.fromCharCode(event.which)
		if (!/[0-9]/.test(char)) {
			event.preventDefault()
		}
	}
}
export const preventMax = (e, max) => {
	if (e.target.value.length > max) {
		e.target.value = e.target.value.slice(0, max)
	}
}
export const NumberInputNew = (event) => {
	if (event) {
		if (!['Backspace', 'Delete', 'Tab'].includes(event.key) && !/[0-9]/.test(event.key)) {
			event.preventDefault()
		}
	}
}

export const NumberInputWithDot = (event) => {
	if (event) {
		const char = String.fromCharCode(event.which)
		if (!/^[0-9]*\.?[0-9]*$/.test(char)) {
			event.preventDefault()
		}
	}
}

export const infoType = [
	{
		label: <>{<UseChange data='BUY' />}</>,
		key: 'Buy',
	},
	{
		label: <>{<UseChange data='RENT' />}</>,
		key: 'Rent',
	},
	{
		label: <>{<UseChange data='COMMERCIAL_BUY' />}</>,
		key: 'Commercial Buy',
	},
	{
		label: <>{<UseChange data='COMMERCIAL_RENT' />}</>,
		key: 'Commercial Rent',
	},
]
export const propertyType = [
	{
		label: 'Apartment',
		key: 'Apartment',
	},
	{
		label: 'Independent House',
		key: 'Independent House',
	},
	{
		label: 'Independent Floor',
		key: 'Independent Floor',
	},
	{
		label: 'Plot',
		key: 'Plot',
	},
	{
		label: 'Villa',
		key: 'Villa',
	},
]
export const constructionStatus = [
	{
		label: 'Off-plan Secondary',
		key: 'offPlanSecondary',
		labelAr: 'على الخارطة الثانوية',
	},
	{
		label: 'Off-plan Primary',
		key: 'offPlanPrimary',
		labelAr: 'على الخارطة الابتدائية',
	},
	{
		label: 'Ready Secondary',
		key: 'readySecondary',
		labelAr: 'جاهز ثانوي',
	},
	{
		label: 'Ready Primary',
		key: 'readyPrimary',
		labelAr: 'جاهز الابتدائية',
	},
]
export const constructionStatusObj = {
	offPlanSecondary: 'Off-plan Secondary',
	offPlanPrimary: 'Off-Plan Primary',
	readySecondary: 'Ready Secondary',
	readyPrimary: 'Ready Primary',
}
export const constructionStatusObjAr = {
	offPlanSecondary: 'على الخارطة الثانوية',
	offPlanPrimary: 'أساسيات البيع على الخارطة',
	readySecondary: 'جاهز ثانوي',
	readyPrimary: 'جاهز الابتدائية',
}

export const layoutTypeAr = {
	'Facing North': 'مواجهة الشمال',
	'Facing West': 'مواجهة الغرب',
	'Facing East': 'مواجهة الشرق',
	'Facing South': 'التي تواجه الجنوب',
}
export const parkingType = [
	{
		label: 'Open',
		key: 'open',
		labelAr: 'يفتح',
	},
	{
		label: 'Covered',
		key: 'covered',
		labelAr: 'مغطى',
	},
	{
		label: 'Closed',
		key: 'closed',
		labelAr: 'مغلق',
	},
	{
		label: 'Public',
		key: 'public',
		labelAr: 'عام',
	},
]

export const financialStatus = [
	{
		label: 'Mortgaged',
		key: 'mortgaged',
	},
	{
		label: 'Cash',
		key: 'cash',
	},
]

export const subscriptionAr = {
	Gold: 'ذهب',
	Standard: 'معيار',
	Basic: 'أساسي',
}
export const furnishedTypeAr = {
	unfurnished: 'غير مفروش',
	semiFurnished: 'نصف مفروش أو نصف مجهز أو شبه مفروش',
	furnished: 'مفروشة، مد، زود',
}
export const financialStatusAr = {
	mortgaged: 'مرهون',
	cash: 'نقدي',
}
export const furnishedType = [
	{
		label: 'Un-furnished',
		key: 'unfurnished',
		labelAr: 'غير مفروش',
	},
	{
		label: 'Semi-Furnished',
		key: 'semiFurnished',
		labelAr: 'نصف مفروش أو نصف مجهز أو شبه مفروش',
	},
	{
		label: 'Furnished',
		key: 'furnished',
		labelAr: 'مفروشة، مد، زود',
	},
]

export const parkingCheck = [
	{
		label: 'Yes',
		key: 'yes',
		labelAr: 'نعم',
	},
	{
		label: 'No',
		key: 'no',
		labelAr: 'لا',
	},
]

export const stageTypeAr = {
	vacant: 'شاغر',
	rented: 'مستأجرة',
	vacantOnTransfer: 'شاغر عند التحويل',
}
export const stageType = [
	{
		label: 'Vacant',
		key: 'vacant',
	},
	{
		label: 'Rented',
		key: 'rented',
	},
	{
		label: 'Vacant On Transfer',
		key: 'vacantOnTransfer',
	},
]
export const readyStage = [
	{
		label: 'Fitted',
		key: 'fitted',
	},
	{
		label: 'Semi-Fitted',
		key: 'semiFitted',
	},
	{
		label: 'Shell',
		key: 'shell',
	},
	{
		label: 'Core',
		key: 'core',
	},
]
export const readyStageAr = {
	fitted: 'تركيب',
	semiFitted: 'شبه جاهزة',
	shell: 'صدَفَة',
	core: 'جوهر',
}

export const checkObj = {
	city: 'community',
	community: 'subCommunity',
	subCommunity: 'building',
}
export const checkObjNew = {
	city: 'city',
	community: 'community',
	subCommunity: 'subCommunity',
	building: 'building',
}

export const EnquiryTypeCompany = [
	{
		label: 'Book A viewing',
		key: 'Book A viewing',
	},
	{
		label: 'General Enquiry',
		key: 'General Enquiry',
	},
	{
		label: 'Make an offer',
		key: 'Make an offer',
	},
	{
		label: 'Property information',
		key: 'Property information',
	},
	{
		label: 'Request a call back',
		key: 'Request a call back',
	}
]

export const roles = {
	user: [
		'/',
		'/manage-properties',
		'/property/[slug]',
		'/termsandCondition',
		'/privacyPolicy',
		'/faqs',
		'/aboutCompany',
		'/myWishlist',
		'/map-search',
		'/contactus',
		'/blog/[slug]',
		'/company/[slug]',
		'/blogs',
		'/notifications',
		'/profile',
		'/findAgent',
		'/findCompanies',
		'/project/[slug]',
		'/auctionProperties',
		'/newProjects',
		'/agents/[slug]',
		'/contactUsNew',
		'/otpVerify',
		'/pages/[slug]',
		'/payments/paymentSuccess',
		'/payments/paymentFailed',
	],
	company: [
		'/',
		'/addNewProperty',
		'/manage-properties',
		'/myAgents',
		'/aboutCompany',
		'/agents/[slug]',
		'/property/[slug]',
		'/company/[slug]',
		'/termsandCondition',
		'/privacyPolicy',
		'/faqs',
		'/contactus',
		'/contactUsNew',
		'/addAgent',
		'/blog/[slug]',
		'/blogs',
		'/notifications',
		'/profile',
		'/pages/[slug]',
		'/payments/paymentSuccess',
		'/payments/paymentFailed',
	],
	agent: [
		'/',
		'/addNewProperty',
		'/manage-properties',
		'/aboutCompany',
		'/property/[slug]',
		'/termsandCondition',
		'/privacyPolicy',
		'/faqs',
		'/contactus',
		'/contactUsNew',
		'/blog/[slug]',
		'/blogs',
		'/notifications',
		'/profile',
		'/pages/[slug]',
	],
}
export const CommonPath = [
	'/',
	'/property/[slug]',
	'/termsandCondition',
	'/privacyPolicy',
	'/aboutCompany',
	'/faqs',
	'/project/[slug]',
	'/contactus',
	'/contactUsNew',
	'/blog/[slug]',
	'/blogs',
	'/login',
	'/findAgent',
	'/findCompanies',
	'/agents/[slug]',
	'/forgotPassword',
	'/register',
	'/otpVerify',
	'/newProjects',
	'/auctionProperties',
	'/resetPassword',
	'/companyDetail',
	'/company/[slug]',
	'/pages/[slug]',
	'/map-search',
	'/test'
]

export const zoomCount = {
	10: 1,
	9: 2,
	8: 3,
	7: 4,
	6: 5,
	5: 6,
	4: 7,
	3: 8,
	2: 9,
	0: 10,
}
export const imageCheck = (index, property) => {
	if (!isEmpty(property)) {
		if (property?.photos?.length > 0) {
			if (!isEmpty(property?.photos[index])) {
				return property?.photos[index]
			} else {
				if (!isEmpty(property?.photos[0])) {
					return property?.photos[0]
				} else {
					return ''
				}
			}
		}
	}
}
export const multiLang = [
	{
		name: 'English',
		lang: 'English',
		logo: '/images/united-kingdom.png',
		eventKey: '1',
		dir: 'ltr',
		language: 'en',
		langKey: '',
	},
	{
		name: 'Arabic',
		lang: 'عربي',
		logo: '/images/country.svg',
		eventKey: '2',
		dir: 'rtl',
		language: 'ar',
		langKey: 'Ar',
	},
]

export const AREA_BOUND = {
	UAE: {
		north: 26.245017,
		south: 22.495708,
		east: 56.611014,
		west: 51.498994,
	},
	Saudi: {
		north: 32.1543,
		south: 16.4688,
		east: 55.6667,
		west: 34.5718,
	},
}

export const AREA_REGION = {
	UAE: {
		lat: 25.2048,
		lng: 55.2708,
	},
	Saudi: {
		lat: 23.8859,
		lng: 45.0792,
	},
}

export const COUNTRY_RESTRICTIONS = {
	UAE: 'AE',
	Saudi: 'SA',
}
export const bedroomCheck = (queryData) => {
	if (queryData?.bedroom == 'Studio') {
		return '0'
	} else if (parseInt(queryData?.bedroom) === 10) {
		return 10
	} else if (parseInt(queryData?.bedroom) == 11) {
		return 11
	} else if (queryData?.bedroom?.length === 1) {
		return [Number(queryData?.bedroom)].toString()
	} else if (queryData?.bedroom?.length > 1) {
		return queryData?.bedroom
			?.map((res) => {
				return res?.length > 3 ? '0' : Number(res)
			})
			.toString()
	}
}

export const parkingTypeAr = {
	open: 'يفتح',
	covered: 'مغطى',
	closed: 'مغلق',
	public: 'عام',
}
export const priceRangeRent = [
	{
		label: "0 - 20000 AED",
		value: "0 - 20000"
	},
	{
		label: "20001 - 40000 AED",
		value: "20001 - 40000"
	},
	{
		label: "40001 - 60000 AED",
		value: "40001 - 60000"
	},
	{
		label: "60001 AED - Above",
		value: "60001 - Above"
	},
]
export const priceRangeSale = [
	{
		label: "0 - 200000 AED",
		value: "0 - 200000"
	},
	{
		label: "200001 - 400000 AED",
		value: "200001 - 400000"
	},
	{
		label: "400001 - 600000 AED",
		value: "400001 - 600000"
	},
	{
		label: "600001 AED - Above",
		value: "600001 - Above"
	},
]