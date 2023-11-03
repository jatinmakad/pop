import dayjs from "dayjs";
import { isEmpty, isNumber } from "lodash";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useTranslation } from "react-i18next";

const relativeTime = require("dayjs/plugin/relativeTime");
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
require('dayjs/locale/ar');
const MySwal = withReactContent(Swal)
const Helpers = {
	dateFormat: function (date, format = "L ,LT", options = {}) {
		if (options != undefined) {
			if ('language' in options) {
				dayjs.locale(options?.language || "en");
			}
		}

		return dayjs(date).format(format);
	},
	dateFormatAppointment: function (date, format = "DD MMM, YYYY", options = {}) {
		if (options != undefined) {
			if ('language' in options) {
				dayjs.locale(options?.language || "en");
			}
		}
		return dayjs(date).format(format);
	},
	dateFormatTimeAppointment: function (date, format = "hh:mm A", options = {},) {
		if (options != undefined) {
			if ('language' in options) {
				dayjs.locale(options?.language || "en");
			}
		}
		return dayjs(date).format(format);
	},
	remainingTimeFromNow: (date, options) => {
		if (options != undefined) {
			if ('language' in options) {
				dayjs.locale(options?.language || "en");
			}
		}
		const Date = dayjs(date).fromNow();
		return Date;
	},
	ObjectToParams: (obj) => {
		return new URLSearchParams(obj).toString();
	},
	downloadFile: (url) => {
		if (isEmpty(url)) {
			alert("Invalid URL")
			return false
		}
		const parts = url.split('.')
		const filename = parts[parts.length - 1]
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onload = () => {
			const a = document.createElement('a');
			const url = window.URL.createObjectURL(xhr.response);
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		};
		xhr.send();
	},
	priceFormat: (price) => {
		return price?.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 })
	},
	formatPrice: (price) => {
		const sanitizedValue = price.toString()?.replace(/,/g, '');
		const formattedValue = Number(sanitizedValue).toLocaleString();
		return formattedValue
	},
	priceFormatType: (item) => {
		if (
			item?.propertyType?.slug == "rent" ||
			item?.propertyType?.slug == "commercial-rent"
		) {
			if (isNumber(item?.priceDaily) && item?.priceDaily > 0) {
				return item?.priceDaily;
			} else if (isNumber(item?.priceWeekly) && item?.priceWeekly > 0) {
				return item?.priceWeekly;
			} else if (isNumber(item?.priceMonthly) && item?.priceMonthly > 0) {
				return item?.priceMonthly;
			} else if (isNumber(item?.priceYearly) && item?.priceYearly > 0) {
				return item?.priceYearly;
			}
		} else {
			return item?.price;
		}
	},
	alertFunction: (title, item, changeFunction, direction) => {
		MySwal.fire({
			html: <strong>{title}</strong>,
			icon: 'warning',
			showConfirmButton: 'Okay',
			showCancelButton: true,
			confirmButtonColor: "#90c14f",
			confirmButtonText: direction?.eventKey == '1' ? "Ok" : "نعم",
			cancelButtonText: direction?.eventKey == '1' ? "Cancel" : "يلغي",
			showLoaderOnConfirm: true,
			preConfirm: () => {
				changeFunction(item)
			}
		})
	},
	isValidLatitude: (latitude) => {
		return latitude >= -90 && latitude <= 90;
	},
	isValidLongitude: (longitude) => {
		return longitude >= -180 && longitude <= 180;
	},
	calculateDistance: (lat1, lon1, lat2, lon2) => {
		var R = 6371; // Earth's radius in kilometers
		var dLat = Helpers.deg2rad(lat2 - lat1);
		var dLon = Helpers.deg2rad(lon2 - lon1);

		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(Helpers.deg2rad(lat1)) * Math.cos(Helpers.deg2rad(lat2)) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2);

		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var distance = R * c;

		return distance;
	},

	deg2rad: (deg) => {
		return deg * (Math.PI / 180);
	}
};
export default Helpers;
