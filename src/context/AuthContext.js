import React, { createContext, useState, useEffect, startTransition } from "react";
import jwt_decode from "jwt-decode";
import { isEmpty, pick } from "lodash";
import { useRouter } from "next/router";
import { apiGet, apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import useToastContext from "@/hooks/useToastContext";
import { CommonPath, roles } from "@/utils/constants";
import { useTranslation } from "react-i18next";
import { multiLang } from "@/utils/constants";

const AuthContext = createContext();

export default AuthContext;
export const AuthProvider = ({ children }) => {
	const { t, i18n } = useTranslation();
	const [user, setUser] = useState({});
	const router = useRouter();
	const [sidebar, setSidebar] = useState("profile");
	const notification = useToastContext();
	const [subscription, setSubscription] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [verifyOtpData, setVerifyOtpData] = useState({});
	const [config, setConfig] = useState({});
	const [slugCondition, setSlugCondition] = useState([])
	const [resetPasswordData, setResetPasswordData] = useState({});
	const [adsList, setAdsList] = useState([])
	const [defaultCountry, setDefaultCountry] = useState('')
	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};
	const [notifications, setNotification] = useState(false)
	const [direction, setDirection] = useState(multiLang[0]);
	const [adminInfo, setAdminInfo] = useState({});
	const [common, setCommon] = useState([])
	const [commonCondition, setCommonCondition] = useState(false)
	const getAdminInfo = async (data) => {
		try {
			var path = apiPath.getAdminInfo;
			const result = await apiGet(path, data);
			var response = result?.data?.results;
			setAdminInfo(response);
		} catch (error) {
			console.log("error in get all users list==>>>>", error.message);
		}
	};

	const getAds = async () => {
		try {
			const { status, data } = await apiGet(apiPath.getAds);
			if (status == 200) {
				if (data.success) {
					if (data?.results?.length > 0) {
						let obj = {
							...data?.results[0], display: JSON.parse(data?.results[0]?.display)
						}
						setAdsList(obj);
					}
				}
			}
		} catch (error) { }
	}

	const getProfileData = async (role) => {
		let api = ''
		if (role == 'company') {
			api = apiPath.getCompanyProfile
		} else if (role === 'agent') {
			api = apiPath.getAgentProfile
		} else if (role === 'customer') {
			api = apiPath.getUserProfile
		}
		const { status, data } = await apiGet(apiPath.getCompanyProfile);
		if (status === 200) {
			if (data.success) {
				setUser(data?.results)
			}
		}
	}
	
	useEffect(() => {
		if (commonCondition  && router.route) {
			startTransition(() => {
				if (!isEmpty(localStorage.getItem("token"))) {
					console.log('inner')
					if (router.pathname == '/property/[slug]' || router?.pathname === '/profile') {

					} else {
						setSidebar('profile')
					}
					let userData = jwt_decode(localStorage.getItem("token"));
					setUser(userData);
					
					if (isEmpty(userData)) {
						if (![...CommonPath, ...common].includes(router.route)) {
							router.push("/not-found");
						}
					}
					if (!isEmpty(userData)) {
						let role = roles[userData?.role]
						// if (userData?.role === 'user') {
						// 	role = [...roles[userData?.role], ...common]
						// }
						if (!(userData?.role === 'user' ? [...roles[userData?.role], ...common] : role).includes(router.route)) {
							router.push("/not-found");
						}
					}
				} else {
					if (isEmpty(user)) {
						if (![...CommonPath, ...common].includes(router.route)) {
							router.push("/not-found");
						}
					}
				}
				if (router.route == "/register" || router.route == "/otpVerify") {
				} else {
					setVerifyOtpData({});
				}
			})
		}
	}, [router.route, commonCondition]);

	const getSubscription = async () => {
		const { status, data } = await apiGet(apiPath.activeSubscription);
		if (status === 200) {
			if (data.success) {
				setSubscription(data?.results);
			}
		}
	};

	const checkNotification = async () => {
		try {
			const { status, data } = await apiGet(apiPath.checkNotification);
			if (status == 200) {
				if (data.success) {
					setNotification(data?.results?.unreadNotification);
				}
			} else {
			}
		} catch (error) { }
	}

	const getConfig = async () => {
		const { status, data } = await apiGet(apiPath.getConfigApi);
		if (status === 200) {
			if (data.success) {
				setConfig(data?.results);
				let arr = []
				setSlugCondition(data?.results?.propertyType?.map((res) => {
					if (res?.status === 'active') {
						arr.push(res?.slug == 'commercial-buy' ? '/commercial' : `/${res?.slug}`)
						return res?.slug
					}
				}))
				setCommon(data?.results?.propertyType?.map((res) => {
					if (res?.status === 'active') {
						return res?.slug == 'commercial-buy' ? '/commercial' : `/${res?.slug}`
					}
				}))
				setCommonCondition(true)
				if (!isEmpty(data?.results)) {
					if (data?.results?.country === 'Saudi') {
						setDefaultCountry('sa')
					} else if (data?.results?.country === 'UAE') {
						setDefaultCountry('ae')
					} else {
						setDefaultCountry('in')
					}
				}
			}
		}
	};

	useEffect(() => {
		if (!isEmpty(user)) {
			getSubscription();
			checkNotification()
		}
	}, [user]);

	useEffect(() => {
		getAdminInfo();
		getAds()
		getConfig();
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (localStorage.getItem("language_dir")) {
				setDirection(JSON.parse(localStorage.getItem("language_dir")));
			}
		}
	}, []);

	// useEffect(() => {
	// 	let dir = direction?.name == "Arabic" ? "rtl" : "ltr";
	// 	let lang = direction?.name == "Arabic" ? "ar" : "en";
	// 	document.querySelector("html").setAttribute("dir", dir);
	// 	document.querySelector("html").setAttribute("lang", lang);
	// 	if (direction) {
	// 		if (direction?.name == "Arabic") {
	// 			i18n.changeLanguage("ar");
	// 		} else {
	// 			i18n.changeLanguage("en");
	// 		}
	// 	}
	// }, [direction]);

	let loginUser = async (body) => {
		let api = "";
		if (body?.type == "Customer") {
			api = apiPath.loginUser;
		} else if (body?.type == "Agent") {
			api = apiPath.loginAgent;
		} else {
			api = apiPath.loginCompany;
		}
		document.getElementById("loader").style.display = "flex";
		const { status, data } = await apiPost(api, pick(body, ["countryCode", "mobile", "password"]));
		if (status === 200) {
			if (data.success) {
				getSubscription();
				getConfig();
				const token = data?.results?.token || null;
				const refresh_token = data?.results?.refresh_token || null;
				localStorage.setItem("token", token);
				localStorage.setItem("refresh_token", refresh_token);
				setUser(jwt_decode(token));
				router.push("/");
			} else {
				if (!isEmpty(data.results)) {
					if (!data.results.verified) {
						setVerifyOtpData(data.results);
						router.push("/otpVerify");
					} else {
						notification.error(data?.message);
					}
				} else {
					notification.error(data?.message);
				}
			}
		} else {
			notification.error(data?.message);
		}
		document.getElementById("loader").style.display = "none";
	};

	let logoutUser = () => {
		setUser(null);
		localStorage.removeItem("token");
		localStorage.removeItem("refresh_token");
		router.push(`/login?type=${user?.role == "company" ? 'Company' : user?.role == 'agent' ? "Agent" : "Customer"}`);
	};

	let contextData = {
		user,
		loginUser: loginUser,
		logoutUser: logoutUser,
		showPassword,
		handleShowPassword,
		setVerifyOtpData,
		verifyOtpData,
		setUser,
		setResetPasswordData,
		resetPasswordData,
		subscription,
		getSubscription,
		config,
		setDirection,
		direction,
		adminInfo,
		adsList,
		defaultCountry,
		notifications,
		checkNotification,
		slugCondition,
		setSidebar,
		sidebar
	};

	return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
