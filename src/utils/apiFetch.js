/* global localStorage */
const axios = require("axios");

function getHeaders() {
	return { "Content-Type": "application/json" };
}
function getLanguage() {
	return localStorage?.getItem("language_dir") ? JSON.parse(localStorage?.getItem("language_dir")).language : "en"
}
function getTimezoneOffset() {
	const offsetMinutes = new Date().getTimezoneOffset();
	const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
	const offsetMinutesFormatted = Math.abs(offsetMinutes) % 60;
	const offsetString = (offsetMinutes < 0 ? '+' : '-') + ('0' + offsetHours).slice(-2) + ':' + ('0' + offsetMinutesFormatted).slice(-2);
	return offsetString;
}

const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	// timeout: 1000,
	// headers: getHeaders(),
});

instance.interceptors.request.use((config) => {
	if (!['/v1/user/properties/master-data', '/v1/user/map-view', '/v1/user/companies', '/v1/user/agents', '/v1/companies/properties/temporary-photo'].includes(config.url)) {
		if (config?.url?.split('/')[config?.url?.split('/')?.length - 2] !== 'delete-temporary-photo') {
			document.getElementById("loader").style.display = "flex";
		}
	}
	const token = localStorage.getItem("token");
	config = {
		...config,
		headers: { ...config.headers, timezoneOffset: getTimezoneOffset(), language: getLanguage() },
	};

	if (!token) {
		return config;
	}
	config = {
		...config,
		headers: { ...config.headers, Authorization: `Bearer ${token}` },
	};
	return config;
});

instance.interceptors.response.use(
	function (response) {
		document.getElementById("loader").style.display = "none";
		return response;
	},
	function (error) {
		const { status } = error?.response;
		document.getElementById("loader").style.display = "none";
		if (status === 401) {
			localStorage.removeItem("token");
			localStorage.removeItem("refresh_token");
			localStorage.removeItem("uniqueId");
			window.location = "/login";
		} else if (status === 403) {
			localStorage.removeItem("token");
			localStorage.removeItem("refresh_token");
			localStorage.removeItem("uniqueId");
			window.location = "/login";
		} else if (status === 409) {
			localStorage.removeItem("token");
			localStorage.removeItem("refresh_token");
			localStorage.removeItem("uniqueId");
			window.location = "/login";
		}
		return Promise.reject(error);
	}
);

function apiGet(url, params = {}) {
	return instance.get(url, { params });
}

function apiPost(url, body) {
	return instance.post(url, body);
}

function apiPut(url, body) {
	return instance.put(url, body);
}

function apiDelete(url, body) {
	return instance.delete(url, { params: body });
}

export { getHeaders, apiGet, apiPost, apiPut, apiDelete };
