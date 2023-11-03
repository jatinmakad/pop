import {
	Amenities,
	ConstructionStatus,
	NumberInput,
	NumberInputNew,
	constructionStatus,
	financialStatus,
	financialStatusAr,
	furnishedType,
	infoType,
	number,
	parkingCheck,
	parkingType,
	preventMax,
	propertyType,
	readyStage,
	readyStageAr,
	stageType,
	stageTypeAr,
	validationRules,
} from "@/utils/constants";
import React, { useContext, useEffect, useState } from "react";
import CurrencyInput from 'react-currency-input-field';
import classNames from "classnames";
import { InputGroup, Form, Button, Col, Row, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import apiPath from "@/utils/apiPath";
import { apiDelete, apiGet } from "@/utils/apiFetch";
import ErrorMessage from "../ErrorMessage";
import { isEmpty, isNumber, isString } from "lodash";
import Select from "react-select";
import useToastContext from "@/hooks/useToastContext";
import CustomImage from "../CustomImage";
import RedStar from "../common/RedStar";
import AuthContext from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

const MAX_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
const BasicInfo = ({ editProperty, onSubmit, user, setAgentList, agentList }) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		clearErrors,
		watch,
		formState: { errors },
	} = useForm({ mode: "all", shouldFocusError: true, defaultValues: {} });
	const notification = useToastContext();
	const { config, direction } = useContext(AuthContext);
	const { t } = useTranslation();
	const [propertyAmenitiesList, setPropertyAmenitiesList] = useState([]);
	const [propertyAmenities, setPropertyAmenities] = useState([]);
	const [propertyTypes, setPropertyTypes] = useState([]);
	const [priceType, setPriceType] = useState("year");
	const [propertyParkingType, setPropertyParkingType] = useState("");
	const [propertyFurnishedType, setPropertyFurnishedType] = useState("");
	const [propertyFinancialStatus, setPropertyFinancialStatus] = useState("");
	const [propertyStageType, setPropertyStageType] = useState("");
	const [propertyParkingCheck, setPropertyParkingCheck] = useState("");
	const [propertyReadyStageType, setPropertyReadyStageType] = useState("");
	const [propertyProjectStatus, setPropertyProjectStatus] = useState("");
	const [propertyCategoryTypes, setPropertyCategoryTypes] = useState([]);
	const [propertyCategoryTypeName, setPropertyCategoryTypeName] = useState("");
	const [propertyType, setPropertyType] = useState(editProperty?.propertyType?._id || null);
	const [propertyTypeName, setPropertyTypeName] = useState("");
	const [propertyCategoryType, setPropertyCategoryType] = useState(editProperty?.propertyCategory?._id || null);
	const [propertyBedrooms, setPropertyBedrooms] = useState("");
	const [propertyBathrooms, setPropertyBathrooms] = useState(0);
	const [propertyLivingRooms, setPropertyLivingRooms] = useState(0);
	const [propertyGuestRooms, setPropertyGuestRooms] = useState(0);
	const [amenitiesModel, setAmenitiesModel] = useState(false);
	const [propertyCategoriesModel, setPropertyCategoriesModel] = useState(false);
	const [searchedAmenities, setSearchAmenities] = useState([]);
	const fetchMasterRecords = async () => {
		try {
			const payload = {};
			const path = apiPath.propertyMaster;
			const result = await apiGet(path, payload);
			const records = result?.data?.results;
			setPropertyTypes(records?.propertyTypes || []);
			if (records?.propertyTypes?.length > 0) {
				setPropertyType(editProperty?.propertyType?._id);
				setPropertyTypeName(editProperty?.propertyType?.slug);
			}
			if (records?.propertyCategories?.length > 0) {
				setPropertyCategoryType(editProperty?.propertyCategory?._id);
				setPropertyCategoryTypeName(editProperty?.propertyCategory?.name);
			}
			records?.propertyCategories?.sort(function (a, b) {
				return a.name.localeCompare(b?.name);
			});
			setPropertyCategoryTypes(records?.propertyCategories || []);
			setPropertyAmenitiesList(records?.propertyAmenities || []);
			setSearchAmenities(records?.propertyAmenities || []);
			if (isEmpty(propertyType)) setPropertyType(records?.propertyTypes[0]?._id || null);
			setPropertyTypeName(records?.propertyTypes[0]?.slug || null);
		} catch (error) {
			console.error("error in get all users list==>>>>", error.message);
		}
	};

	useEffect(() => {
		if (propertyTypes?.length > 0 && !isEmpty(editProperty)) {
			setPropertyType(editProperty?.propertyType?._id);
			setPropertyTypeName(editProperty?.propertyType?.slug);
		}
		if (propertyCategoryTypes?.length > 0 && !isEmpty(editProperty)) {
			setPropertyCategoryType(editProperty?.propertyCategory?._id);
			setPropertyCategoryTypeName(editProperty?.propertyCategory?.name);
		}
	}, [propertyTypes, propertyCategoryTypes, editProperty]);

	useEffect(() => {
		if (!isEmpty(editProperty)) {
			let temp = agentList?.find((res) => res?.value == editProperty?.agent?._id);
			setValue("agentId", temp);
		}
	}, [editProperty, agentList]);

	useEffect(() => {
		if (!isEmpty(editProperty)) {
			setPropertyType(editProperty?.propertyType?._id);
			setPropertyCategoryType(editProperty?.propertyCategory?._id);
			setPropertyBedrooms(editProperty?.bedrooms);
			setPropertyBathrooms(editProperty?.bathrooms);
			setPropertyLivingRooms(editProperty?.livingRooms);
			setPropertyGuestRooms(editProperty?.guestRooms);
			setValue("title", editProperty?.title);
			setValue("price", editProperty?.price);
			setValue("advertType", editProperty?.advertType);
			setValue("totalFloors", editProperty?.totalFloors);
			setValue("floorNumber", editProperty?.floorNumber);
			setValue("description", editProperty?.description);
			setValue("bua", editProperty?.bua);
			setValue("permitNumber", editProperty?.permitNumber);
			setValue("cheques", editProperty?.cheques);
			setValue("layoutType", editProperty?.layoutType);
			setValue("pricePerUnit", editProperty?.pricePerUnit);
			setValue("propertySize", editProperty?.propertySize);
			setValue("securityDeposit", editProperty?.securityDeposit);
			setValue("serviceCharge", editProperty?.serviceCharge);
			setValue("priceDaily", editProperty?.priceDaily == null ? '' : editProperty?.priceDaily);
			setValue("priceWeekly", editProperty?.priceWeekly == null ? '' : editProperty?.priceWeekly);
			setValue("priceMonthly", editProperty?.priceMonthly == null ? '' : editProperty?.priceMonthly);
			setValue("priceYearly", editProperty?.priceYearly == null ? '' : editProperty?.priceYearly);
			setValue("description", editProperty?.description);
			setValue("titleAr", editProperty?.titleAr);
			setValue("advertTypeAr", editProperty?.advertTypeAr);
			setValue("layoutTypeAr", editProperty?.layoutTypeAr);
			setValue("descriptionAr", editProperty?.descriptionAr);
			setValue('parking', editProperty?.parking)
			setPropertyStageType(editProperty?.stage);
			setPriceType(editProperty?.priceType);
			// setPropertyParkingCheck(editProperty?.parking);
			setPropertyReadyStageType(editProperty?.readyStage);
			setPropertyFurnishedType(editProperty?.furnished);
			setPropertyProjectStatus(editProperty?.projectStatus);
			setPropertyFinancialStatus(editProperty?.financialStatus);
			setPropertyParkingType(editProperty?.parkingType);
			setPropertyAmenities(
				editProperty?.amenities?.map((res) => {
					return res._id;
				})
			);
		}
	}, [editProperty]);

	useEffect(() => {
		fetchMasterRecords();
		window.scrollTo(0, 0);
	}, []);

	const handleChangeCount = (type, value, e) => {
		switch (type) {
			case "bedrooms":
				setPropertyBedrooms(value);
				break;
			case "bathrooms":
				setPropertyBathrooms(value);
				break;
			case "living_rooms":
				setPropertyLivingRooms(value);
				break;
			case "guest_rooms":
				setPropertyGuestRooms(value);
				break;
			case "parkingType":
				setPropertyParkingType(value);
				break;
			case "financialStatus":
				setPropertyFinancialStatus(value);
				break;
			case "projectStatus":
				setPropertyProjectStatus(value);
				break;
			case "furnished":
				setPropertyFurnishedType(value);
				break;
			case "readyStage":
				setPropertyReadyStageType(value);
				break;
			case "stage":
				setPropertyStageType(value);
				break;
			case "parking":
				setPropertyParkingCheck(value);
				break;
			default:
				break;
		}
	};

	const handleAmenitiesClick = (amenity, e) => {
		if (propertyAmenities.includes(amenity?._id)) {
			setPropertyAmenities(propertyAmenities.filter((selectedOption) => selectedOption !== amenity?._id));
		} else {
			setPropertyAmenities([...propertyAmenities, amenity?._id]);
		}
	};

	const handleChangeType = (value, e) => {
		setPropertyType(value?._id || null);
		setPropertyTypeName(value?.slug);
		setPropertyCategoryType("");
		setPropertyCategoryTypeName("");
	};

	const handleCategoryChangeType = (value, e) => {
		setPropertyCategoryType(value?._id || null);
		setPropertyCategoryTypeName(value?.name);
	};


	const isValidPrice = (data) => {
		data = {
			...data,
			priceDaily: Number(data?.priceDaily),
			priceWeekly: Number(data?.priceWeekly),
			priceMonthly: Number(data?.priceMonthly),
			priceYearly: Number(data?.priceYearly)
		}
		if (propertyTypeName === "rent" || propertyTypeName === "commercial-rent") {
			if (isNumber(data?.priceDaily) && data?.priceDaily > 0) {
				return true
			} else if (isNumber(data?.priceWeekly) && data?.priceWeekly > 0) {
				return true
			} else if (isNumber(data?.priceMonthly) && data?.priceMonthly > 0) {
				return true
			} else if (isNumber(data?.priceYearly) && data?.priceYearly > 0) {
				return true
			} else {
				notification.error(t("PLEASE_ENTER_AT_LEAST_ONE_OF_THEM"));
				return false;
			}
		} else {
			return true
		}
	}

	const isValid = () => {
		if (propertyAmenities?.length == 0) {
			notification.error(t("PLEASE_SELECT_AMENITIES"));
			return false;
		}
		if (isString(propertyBedrooms)) {
			notification.error(t("PLEASE_SELECT_PROPERTY_BEDROOM"));
			return false;
		}
		if (isString(propertyBathrooms)) {
			notification.error(t("PLEASE_SELECT_PROPERTY_BATHROOM"));
			return false;
		}
		if (isEmpty(propertyCategoryType)) {
			notification.error(t("PLEASE_SELECT_PROPERTY_CATEGORY"));
			return false;
		}
		if (isEmpty(propertyType)) {
			notification.error(t("PLEASE_SELECT_PROPERTY_TYPE"));
			return false;
		}

		// if (propertyTypeName === "buy") {
		// 	if (isEmpty(propertyFinancialStatus)) {
		// 		notification.error(t("PLEASE_SELECT_FINANCIAL_STATUS"));
		// 		return false;
		// 	}
		// }
		return true;
	};


	const submit = (data) => {
		let valid = isValid(data);
		let isValidPriceCheck = isValidPrice(data)
		if (valid && isValidPriceCheck) {
			let obj = {
				propertyType,
				propertyCategory: propertyCategoryType,
				bedrooms: propertyBedrooms,
				bathrooms: propertyBathrooms,
				livingRooms: config?.country == "Saudi" ? propertyLivingRooms : '',
				guestRooms: config?.country == "Saudi" ? propertyGuestRooms : '',
				amenities: propertyAmenities,
				permitNumber: data?.permitNumber,
				title: data?.title || '',
				titleAr: data?.titleAr || '',
				price: data?.price || '',
				advertType: data?.advertType || '',
				advertTypeAr: data?.advertTypeAr || '',
				priceDaily: (propertyTypeName === "rent" || propertyTypeName === "commercial-rent") && data?.priceDaily > 0 ? data?.priceDaily : null,
				priceWeekly: (propertyTypeName === "rent" || propertyTypeName === "commercial-rent") && data?.priceWeekly > 0 ? data?.priceWeekly : null,
				priceMonthly: (propertyTypeName === "rent" || propertyTypeName === "commercial-rent") && data?.priceMonthly > 0 ? data?.priceMonthly : null,
				priceYearly: (propertyTypeName === "rent" || propertyTypeName === "commercial-rent") && data?.priceYearly > 0 ? data?.priceYearly : null,
				totalFloors: data?.totalFloors || '',
				floorNumber: data?.floorNumber || '',
				description: data?.description || '',
				descriptionAr: data?.descriptionAr || '',
				stage: (propertyTypeName === "rent" && propertyStageType) || '',
				priceType: propertyTypeName === "rent" && priceType,
				readyStage: ((propertyTypeName === "commercial-rent" || propertyTypeName === "commercial-buy") && propertyReadyStageType) || '',
				furnished: propertyFurnishedType || '',
				projectStatus: (propertyTypeName === "buy" && propertyProjectStatus) || '',
				financialStatus: (propertyTypeName === "buy" && propertyFinancialStatus) || '',
				parking: data?.parking || '',
				parkingType: propertyParkingType || '',
				bua: data.bua || '',
				cheques: (propertyTypeName === "rent" && data?.cheques) || '',
				layoutType: data?.layoutType || '',
				layoutTypeAr: data?.layoutTypeAr || '',
				pricePerUnit: (propertyTypeName === "buy" && data?.pricePerUnit) || '',
				propertySize: data?.propertySize || '',
				securityDeposit: (propertyTypeName === "rent" && data?.securityDeposit) || '',
				serviceCharge: (propertyTypeName === "buy" && data?.serviceCharge) || '',
			};
			onSubmit(user.role == "company" ? { ...obj, agentId: data?.agentId?.value || '' } : obj);
		}
	};

	const handleDecimalOffer = (e) => {
		const amount = e.target.value;
		if (!amount || amount.match(/^\d{1,}(\.\d{0,4})?$/)) {
			setValue('pricePerUnit', amount)
		}
	}

	return (
		<Form onSubmit={handleSubmit(submit)} className="theme_form">
			<div className="add_property_block mb-2 py-1 mb-md-3">
				<h5 className="mb-2">
					{t("TYPE")}
					<RedStar />
				</h5>
				<div className="add_property_tabs  new-add-property">
					<ul className="d-flex flex-wrap">
						{propertyTypes?.map((pt, index) => {
							return (
								<li key={index} onClick={handleChangeType.bind(this, pt)} className="position-relative me-2 mb-2">
									<button type="button" className={propertyType === pt?._id ? "active rounded-pill" : "rounded-pill"}>
										<span className="select_tab">{pt?.[`name${direction?.langKey || ''}`]}</span>
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div className="add_property_block mb-2 py-1 mb-md-3">
				<div className="d-flex align-items-center">
					<h5 className="mb-2">
						{t("PROPERTY_CATEGORY")}<span className="text-danger">*</span>
					</h5>
					{propertyCategoryTypeName && (
						<p className="mb-2" style={{ color: "green" }}>
							{" "}
							- {propertyCategoryTypeName}
						</p>
					)}
				</div>
				<button type="button" className="btn btn-primary p-1" style={{ cursor: "pointer" }} onClick={() => setPropertyCategoriesModel(true)}>
					{t("SELECT_PROPERTY_CATEGORY")}
				</button>
			</div>
			{propertyTypeName === "buy" && (
				<div className="add_property_block mb-2 py-1 mb-md-3">
					<h5 className="mb-2">{t("CONSTRUCTION_STATUS")}</h5>
					<div className="add_property_tabs  new-add-property">
						<ul className="d-flex flex-wrap">
							{constructionStatus?.map((res, index) => {
								return (
									<li onClick={handleChangeCount.bind(this, "projectStatus", res.key)} key={index} className="position-relative me-2 mb-2">
										<button type="button" className={propertyProjectStatus === res?.key ? "active rounded-pill" : "rounded-pill"}>
											{res?.[`label${direction?.langKey || ''}`]}
										</button>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			)}
			<Row>
				<Col md={12}>
					<div className="add_property_block mb-2 py-1 mb-md-3 bedroom-counter">
						<h5 className="mb-2">{t("NUMBER_OF_BEDROOMS")}<RedStar /></h5>
						<div className="add_property_tabs  new-add-property">
							<ul className="d-flex flex-wrap">
								<li onClick={handleChangeCount.bind(this, "bedrooms", 0)} className={`position-relative me-2 mb-2 w-auto ${propertyBedrooms === 0 && "active"}`}>
									<button type="button">{t("STUDIO")}</button>
								</li>
								{MAX_NUMBERS.map((value, index) => {
									return (
										<li onClick={handleChangeCount.bind(this, "bedrooms", value)} key={index} className={`position-relative me-2 mb-2 ${propertyBedrooms === value && "active"}`}>
											<button type="button">{value > 7 ? `7+` : value}</button>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</Col>
				<Col md={12}>
					<div className="add_property_block mb-2 py-1 mb-md-3 bedroom-counter">
						<h5 className="mb-2">{t("NUMBER_OF_BATHROOMS")}<RedStar /></h5>
						<div className="add_property_tabs  new-add-property">
							<ul className="d-flex flex-wrap">
								{MAX_NUMBERS.map((value, index) => {
									return (
										<li onClick={handleChangeCount.bind(this, "bathrooms", value)} key={index} className={`position-relative me-2 mb-2 ${propertyBathrooms === value && "active"}`}>
											<button type="button">{value > 7 ? `7+` : value}</button>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</Col>
				{config?.country === "Saudi" && (
					<Col md={12}>
						<div className="add_property_block mb-2 py-1 mb-md-3 bedroom-counter">
							<h5 className="mb-2">{t("NUMBER_OF_LIVING_ROOMS")}</h5>
							<div className="add_property_tabs  new-add-property">
								<ul className="d-flex flex-wrap">
									{MAX_NUMBERS.map((value, index) => {
										return (
											<li onClick={handleChangeCount.bind(this, "living_rooms", value)} key={index} className={`position-relative me-2 mb-2 ${propertyLivingRooms === value && "active"}`}>
												<button type="button">{value > 7 ? `7+` : value}</button>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</Col>
				)}
				{config?.country === "Saudi" && (
					<Col md={12}>
						<div className="add_property_block mb-2 py-1 mb-md-3 bedroom-counter">
							<h5 className="mb-2">{t("NUMBER_OF_GUEST_ROOMS")}</h5>
							<div className="add_property_tabs  new-add-property">
								<ul className="d-flex flex-wrap">
									{MAX_NUMBERS.map((value, index) => {
										return (
											<li onClick={handleChangeCount.bind(this, "guest_rooms", value)} key={index} className={`position-relative me-2 mb-2 ${propertyGuestRooms === value && "active"}`}>
												<button type="button">{value > 7 ? `7+` : value}</button>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</Col>
				)}
			</Row>
			<Row>
				<Col md={6}>
					<div className="add_property_block mb-2 py-1 mb-md-3">
						<h5 className="mb-2">{t("FURNISHED_TYPE")}</h5>
						<div className="add_property_tabs  new-add-property">
							<ul className="d-flex flex-wrap">
								{furnishedType.map((res, index) => {
									return (
										<li onClick={handleChangeCount.bind(this, "furnished", res.key)} key={index} className="position-relative me-2 mb-2">
											<button type="button" className={propertyFurnishedType === res?.key ? "active rounded-pill" : "rounded-pill"}>
												{res?.[`label${direction?.langKey || ''}`]}
											</button>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</Col>
				{propertyTypeName === "buy" && (
					<Col md={6}>
						<div className="add_property_block mb-2 py-1 mb-md-3">
							<h5 className="mb-2">
								{t("FINANCIAL_STATUS")}
							</h5>
							<div className="add_property_tabs  new-add-property">
								<ul className="d-flex flex-wrap">
									{financialStatus.map((res, index) => {
										return (
											<li onClick={handleChangeCount.bind(this, "financialStatus", res.key)} key={index} className="position-relative me-2 mb-2">
												<button type="button" className={propertyFinancialStatus === res?.key ? "active rounded-pill" : "rounded-pill"}>
													{direction?.langKey == 'Ar' ? financialStatusAr[res.key] : res.label}
												</button>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</Col>
				)}
			</Row>
			<Row>
				{(propertyTypeName === "commercial-rent" || propertyTypeName === 'commercial-buy') && (
					<Col lg={6} sm={12}>
						<div className="add_property_block mb-2 py-1 mb-md-3">
							<h5 className="mb-2">{t("READY_STAGE")}</h5>
							<div className="add_property_tabs  new-add-property">
								<ul className="d-flex flex-wrap">
									{readyStage.map((res, index) => {
										return (
											<li onClick={handleChangeCount.bind(this, "readyStage", res.key)} key={index} className="position-relative me-2 mb-2">
												<button type="button" className={propertyReadyStageType === res?.key ? "active rounded-pill" : "rounded-pill"}>
													{direction?.langKey == 'Ar' ? readyStageAr[res.key] : res.label}
												</button>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</Col>
				)}
				{/* <Col lg={6} sm={12}>
					<div className="add_property_block mb-2 py-1 mb-md-3">
						<h5 className="mb-2">{t("PARKING")}</h5>
						<div className="add_property_tabs  new-add-property">
							<ul className="d-flex flex-wrap">
								{parkingCheck.map((res, index) => {
									return (
										<li onClick={handleChangeCount.bind(this, "parking", res.key)} key={index} className="position-relative me-2 mb-2">
											<button type="button" className={propertyParkingCheck === res?.key ? "active rounded-pill" : "rounded-pill"}>
												{res?.[`label${direction?.langKey || ''}`]}
											</button>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</Col> */}
			</Row>

			{propertyTypeName === "rent" && (
				<div className="add_property_block mb-2 py-1 mb-md-3">
					<h5 className="mb-2">{t("STAGE")}</h5>
					<div className="add_property_tabs  new-add-property">
						<ul className="d-flex flex-wrap">
							{stageType.map((res, index) => {
								return (
									<li onClick={handleChangeCount.bind(this, "stage", res.key)} key={index} className="position-relative me-2 mb-2">
										<button type="button" className={propertyStageType === res?.key ? "active rounded-pill" : "rounded-pill"}>
											{direction?.langKey == 'Ar' ? stageTypeAr[res.key] : res.label}
										</button>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			)}
			{/* {propertyParkingCheck === "yes" && ( */}
			<div className="add_property_block mb-2 py-1 mb-md-3">
				<h5 className="mb-2">{t("PARKING_TYPE")}</h5>
				<div className="add_property_tabs  new-add-property">
					<ul className="d-flex flex-wrap">
						{parkingType.map((res, index) => {
							return (
								<li onClick={handleChangeCount.bind(this, "parkingType", res.key)} key={index} className="position-relative me-2 mb-2">
									<button type="button" className={propertyParkingType === res?.key ? "active rounded-pill" : "rounded-pill"}>
										{res?.[`label${direction?.langKey || ''}`]}
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			{/* // )} */}
			<div className="add_property_block mb-2 py-1 mb-md-3">
				<div className="d-flex align-items-center">
					<h5 className="mb-2">{t("AMENITIES")}<RedStar /> </h5>
					{propertyAmenities?.length > 0 && (
						<p className="mb-2" style={{ color: "green" }}>
							{" "}
							- {t("YOU_HAVE_SELECTED")} {propertyAmenities?.length} {t("AMENITIES")}
						</p>
					)}
				</div>
				<button type="button" className="btn btn-primary p-1" style={{ cursor: "pointer" }} onClick={() => setAmenitiesModel(true)}>
					{t("SELECT_AMENITIES")}
				</button>
			</div>
			<Row>
				<Col lg={6} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>
							{t("PROPERTY_TITLE")}
							<RedStar />
						</Form.Label>
						<Form.Control
							type="text"
							placeholder={t("ENTER_PROPERTY_TITLE")}
							{...register("title", {
								required: {
									value: true,
									message: t("PLEASE_ENTER_PROPERTY_TITLE"),
								},
								minLength: {
									value: 2,
									message: t("MINIMUM_LENGTH"),
								},
							})}
						/>
						<ErrorMessage message={errors?.title?.message} />
					</Form.Group>
				</Col>
				<Col lg={6} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>
							{t("PROPERTY_TITLE_ARABIC")}
							<RedStar />
						</Form.Label>
						<Form.Control
							type="text"
							placeholder={t("ENTER_PROPERTY_TITLE")}
							{...register("titleAr", {
								required: {
									value: true,
									message: t("PLEASE_ENTER_PROPERTY_TITLE_ARABIC"),
								},
								minLength: {
									value: 2,
									message: t("MINIMUM_LENGTH"),
								},
							})}
						/>
						<ErrorMessage message={errors?.titleAr?.message} />
					</Form.Group>
				</Col>
				{(propertyTypeName === "buy" || propertyTypeName === "commercial-buy") && (
					<Col lg={6} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
							<Form.Label>
								{t("EXPECTED_PRICE")}
								<RedStar />
							</Form.Label>
							<InputGroup>
								<InputGroup.Text id="basic-addon1" className="bg-light">
									{config?.currency}
								</InputGroup.Text>
								<Controller
									control={control}
									name="price"
									rules={{
										required: {
											value: true,
											message: t("PLEASE_ENTER_PRICE"),
										}, minLength: {
											value: 2,
											message: t("MINIMUM_LENGTH"),
										},
										maxLength: {
											value: 10,
											message: t("MAXIMUM_LENGTH_10"),
										},
									}}
									render={({ field: { ref, ...field } }) => (
										<CurrencyInput
											className='formatted-input form-control'
											name={field.name}
											defaultValue={field.value}
											decimalsLimit={2}
											allowNegativeValue={false}
											maxLength={10}
											minLength={2}
											placeholder='Enter price.'
											onValueChange={(value, name) => {
												field.onChange(value)
												if (Number(watch("bua")) > 0) {
													if (Number(value) > Number(watch("bua"))) {
														setValue("pricePerUnit", Number(value / watch("bua"))?.toFixed(2));
													}
												}
											}}
										/>
									)}
								/>
							</InputGroup>
							<ErrorMessage message={errors?.price?.message} />
						</Form.Group>
					</Col>
				)}
				{(propertyTypeName === "rent" || propertyTypeName === "commercial-rent") && (
					<>
						<Col lg={4} sm={4}>
							<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
								<Form.Label>{t("DAILY_PRICE")}</Form.Label>
								<InputGroup>
									<InputGroup.Text id="basic-addon1" className="bg-light">
										{config?.currency}
									</InputGroup.Text>
									<Form.Control
										style={{ width: "55%" }}
										type="number"
										onInput={(e) => preventMax(e, 10)}
										placeholder={t("ENTER_PRICE")}
										{...register("priceDaily", {
											required: {
												value: false,
												// message: t("PLEASE_ENTER_BUA"),
											},
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
											maxLength: {
												value: 10,
												message: t("MAXIMUM_LENGTH_10"),
											},
											pattern: {
												value: validationRules.numberNew,
												message: t("SPECIAL_CHARACTER_IS_NOT_ALLOWED"),
											},
											validate: (value) => {
												if (value !== '' && value !== null) {
													value = Number(value)
												}
												if (isNumber(value)) {
													if (value == 0) {
														return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
													}
												}
												if (String(value).includes(",")) {
													setValue("priceDaily", value?.replace(/\,/g, ""));
												} else {
													setValue("priceDaily", value);
												}
											},
										})}
										onKeyDown={NumberInputNew}
									/>
								</InputGroup>
								<ErrorMessage message={errors?.priceDaily?.message} />
							</Form.Group>
						</Col>
						<Col lg={4} sm={4}>
							<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
								<Form.Label>{t("WEEKLY_PRICE")}</Form.Label>
								<InputGroup>
									<InputGroup.Text id="basic-addon1" className="bg-light">
										{config?.currency}
									</InputGroup.Text>
									<Form.Control
										style={{ width: "55%" }}
										type="number"
										onInput={(e) => preventMax(e, 10)}
										placeholder={t("ENTER_PRICE")}
										{...register("priceWeekly", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
											maxLength: {
												value: 10,
												message: t("MAXIMUM_LENGTH_10"),
											},
											pattern: {
												value: validationRules.numberNew,
												message: t("SPECIAL_CHARACTER_IS_NOT_ALLOWED"),
											},
											validate: (value) => {
												if (value !== '' && value !== null) {
													value = Number(value)
												}
												if (isNumber(value)) {
													if (value < 1) {
														return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
													}
												}
												if (String(value).includes(",")) {
													setValue("priceWeekly", value?.replace(/\,/g, ""));
												} else {
													setValue("priceWeekly", value);
												}
											},
										})}
										onKeyDown={NumberInputNew}
									/>
								</InputGroup>
								<ErrorMessage message={errors?.priceWeekly?.message} />
							</Form.Group>
						</Col>
						<Col lg={4} sm={4}>
							<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
								<Form.Label>{t("MONTHLY_PRICE")}</Form.Label>
								<InputGroup>
									<InputGroup.Text id="basic-addon1" className="bg-light">
										{config?.currency}
									</InputGroup.Text>
									<Form.Control
										style={{ width: "55%" }}
										type="number"
										maxLength="10"
										placeholder={t("ENTER_PRICE")}
										onInput={(e) => preventMax(e, 10)}
										{...register("priceMonthly", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
											maxLength: {
												value: 10,
												message: t("MAXIMUM_LENGTH_10"),
											},
											pattern: {
												value: validationRules.numberNew,
												message: t("SPECIAL_CHARACTER_IS_NOT_ALLOWED"),
											},
											validate: (value) => {
												if (value !== '' && value !== null) {
													value = Number(value)
												}
												if (isNumber(value)) {
													if (value < 1) {
														return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
													}
												}
												if (String(value).includes(",")) {
													setValue("priceMonthly", value?.replace(/\,/g, ""));
												} else {
													setValue("priceMonthly", value);
												}
											},
										})}
										onKeyDown={NumberInputNew}
									/>
								</InputGroup>
								<ErrorMessage message={errors?.priceMonthly?.message} />
							</Form.Group>
						</Col>
						<Col lg={4} sm={4}>
							<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
								<Form.Label>{t("YEARLY_PRICE")}</Form.Label>
								<InputGroup>
									<InputGroup.Text id="basic-addon1" className="bg-light">
										{config?.currency}
									</InputGroup.Text>
									<Form.Control
										style={{ width: "55%" }}
										type="number"
										placeholder={t("ENTER_PRICE")}
										{...register("priceYearly", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
											maxLength: {
												value: 10,
												message: t("MAXIMUM_LENGTH_10"),
											},
											pattern: {
												value: validationRules.numberNew,
												message: t("SPECIAL_CHARACTER_IS_NOT_ALLOWED"),
											},
											validate: (value) => {
												if (value !== '' && value !== null) {
													value = Number(value)
												}
												if (isNumber(value)) {
													if (value < 1) {
														return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
													}
												}
												if (String(value).includes(",")) {
													setValue("priceYearly", value?.replace(/\,/g, ""));
												} else {
													setValue("priceYearly", value);
												}
											},
										})}
										onInput={(e) => preventMax(e, 10)}
										onKeyDown={NumberInputNew}
									/>
								</InputGroup>
								<ErrorMessage message={errors?.priceYearly?.message} />
							</Form.Group>
						</Col>
					</>
				)}

				<Col lg={4} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>
							{t("BUA")}
							<RedStar />
						</Form.Label>
						<InputGroup>
							<InputGroup.Text id="basic-addon1" className="bg-light">
								{config?.areaUnit}
							</InputGroup.Text>
							<Form.Control
								type="number"
								maxLength="5"
								placeholder={t("ENTER_BUA")}
								onInput={(e) => preventMax(e, 5)}
								{...register("bua", {
									required: {
										value: true,
										message: t("PLEASE_ENTER_BUA"),
									},
									minLength: {
										value: 1,
										message: t("MINIMUM_LENGTH_1"),
									},
									maxLength: {
										value: 5,
										message: t("MAXIMUM_LENGTH_5"),
									},
									pattern: {
										value: validationRules.numberNew,
										message: t("SPECIAL_CHARACTER_IS_NOT_ALLOWED"),
									},
									validate: (value) => {
										if (value !== '' && value !== null) {
											value = Number(value)
										}
										if (isNumber(value)) {
											if (value < 1) {
												return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
											}
										}
										if (Number(watch('price')) > 0 && Number(value) > 0) {
											if (Number(watch("price")) > Number(value)) {
												setValue("pricePerUnit", (Number(watch("price")) / Number(value))?.toFixed(2));
											}
										}
									},
								})}
								onKeyDown={NumberInputNew}
							/>
						</InputGroup>

						<ErrorMessage message={errors?.bua?.message} />
					</Form.Group>
				</Col>

				<Col lg={4} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>{t("PLOT_SIZE")} 45</Form.Label>
						<InputGroup>
							<InputGroup.Text id="basic-addon1" className="bg-light">
								{config?.areaUnit}
							</InputGroup.Text>
							<Form.Control
								type="number"
								maxLength="5"
								placeholder={t("ENTER_PLOT_SIZE")}
								{...register("propertySize", {
									required: {
										value: false,
										message: t("PLEASE_ENTER_PLOT_SIZE"),
									},
									minLength: {
										value: 2,
										message: t("MINIMUM_LENGTH"),
									},
									maxLength: {
										value: 5,
										message: t("MAXIMUM_LENGTH_5"),
									},
									pattern: {
										value: validationRules.numberNew,
										message: t("SPECIAL_CHARACTER_IS_NOT_ALLOWED"),
									},
									validate: (value) => {
										if (Number(value) < 1) {
											return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
										}
									},
								})}
								onKeyDown={NumberInputNew}
								onInput={(e) => preventMax(e, 5)}
							/>
						</InputGroup>
						<ErrorMessage message={errors?.propertySize?.message} />
					</Form.Group>
				</Col>
				<Col lg={4} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>
							{t("PARKING")}
						</Form.Label>
						<Form.Control
							type="text"
							maxLength="30"
							placeholder={t("ENTER_PARKING")}
							{...register("parking", {
								required: {
									value: false,
									message: t("PLEASE_ENTER_PARKING"),
								},
								// minLength: {
								// 	value: 2,
								// 	message: t("MINIMUM_LENGTH"),
								// },
								// maxLength: {
								// 	value: 30,
								// 	message: t("MINIMUM_LENGTH_30"),
								// },
							})}
						/>
						<ErrorMessage message={errors?.parking?.message} />
					</Form.Group>
				</Col>
				<Col lg={4} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>
							{t("ADVERT_TYPES")}
							{/* <RedStar /> */}
						</Form.Label>
						<Form.Control
							type="text"
							maxLength="30"
							placeholder={t("ENTER_ADVERT_TYPES")}
							{...register("advertType", {
								required: {
									value: false,
									message: t("PLEASE_ENTER_ADVERT_TYPES"),
								},
								minLength: {
									value: 2,
									message: t("MINIMUM_LENGTH"),
								},
								maxLength: {
									value: 30,
									message: t("MINIMUM_LENGTH_30"),
								},
								// validate: (value) => {
								//   if (value === "") {
								//     return true;
								//   }
								//   if (!!value.trim()) {
								//     return true;
								//   } else {
								//     ("White spaces not allowed.");
								//   }
								// }
							})}
						/>
						<ErrorMessage message={errors?.advertType?.message} />
					</Form.Group>
				</Col>
				<Col lg={4} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>
							{t("ADVERT_TYPE_ARABIC")}
							{/* <RedStar /> */}
						</Form.Label>
						<Form.Control
							type="text"
							maxLength="30"
							placeholder={t("ENTER_ADVERT_TYPE_ARABIC")}
							{...register("advertTypeAr", {
								required: {
									value: false,
									message: t("PLEASE_ENTER_ADVERT_TYPE_ARABIC"),
								},
								minLength: {
									value: 2,
									message: t("MINIMUM_LENGTH"),
								},
								maxLength: {
									value: 30,
									message: t("MINIMUM_LENGTH_30"),
								},
							})}
						/>
						<ErrorMessage message={errors?.advertTypeAr?.message} />
					</Form.Group>
				</Col>
				<Col lg={4} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>{t("LAYOUT_TYPE")}</Form.Label>
						{/* <Form.Control
							type="text"
							maxLength="30"
							placeholder="Enter layout type"
							{...register("layoutType", {
								minLength: {
									value: 2,
									message: "Minimum length must be 2.",
								},
								maxLength: {
									value: 30,
									message: "Maximum length must be 30.",
								},
							})}
						/> */}
						<Form.Select
							aria-label="Default select example"
							{...register("layoutType", {
								required: {
									value: false,
									message: t("PLEASE_SELECT_LAYOUT_TYPE"),
								},
								onChange: event => {
									const value = event.target.value
									if (value === 'Facing North') {
										setValue('layoutTypeAr', 'مواجهة الشمال')
									} else if (value === 'Facing West') {
										setValue('layoutTypeAr', 'مواجهة الغرب')
									} else if (value === 'Facing East') {
										setValue('layoutTypeAr', 'مواجهة الشرق')
									} else if (value === 'Facing South') {
										setValue('layoutTypeAr', 'التي تواجه الجنوب')
									}
								}
							})}
						>
							<option value="">{t("SELECT_LAYOUT_TYPE")}</option>
							<option value={'Facing North'}>
								{t("FACING_NORTH")}
							</option>
							<option value={'Facing West'}>
								{t("FACING_WEST")}
							</option>
							<option value={'Facing East'}>
								{t("FACING_EAST")}
							</option>
							<option value={'Facing South'}>
								{t("FACING_SOUTH")}
							</option>
						</Form.Select>
						<ErrorMessage message={errors?.layoutType?.message} />
					</Form.Group>
				</Col>
				<Col lg={4} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>{t("LAYOUT_TYPE_ARABIC")}</Form.Label>
						{/* <Form.Control
							type="text"
							maxLength="30"
							placeholder="Enter layout type (Arabic)"
							{...register("layoutTypeAr", {
								minLength: {
									value: 2,
									message: "Minimum length must be 2.",
								},
								maxLength: {
									value: 30,
									message: "Maximum length must be 30.",
								},
							})}
						/> */}
						<Form.Select
							aria-label="Default select example"
							disabled
							value={watch('layoutType')}
							{...register("layoutTypeAr", {
								required: {
									value: false,
									message: t("PLEASE_SELECT_LAYOUT_TYPE_ARABIC"),
								},
							})}
						>
							<option value="">{t("SELECT_LAYOUT_TYPE_ARABIC")}</option>
							<option value={'Facing North'}>
								مواجهة الشمال
							</option>
							<option value={'Facing West'}>
								مواجهة الغرب
							</option>
							<option value={'Facing East'}>
								مواجهة الشرق
							</option>
							<option value={'Facing South'}>
								التي تواجه الجنوب
							</option>
						</Form.Select>
						<ErrorMessage message={errors?.layoutTypeAr?.message} />
					</Form.Group>
				</Col>
				<Col lg={4} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>
							{t("NO_OF_FLOORS")}
							{/* <RedStar /> */}
						</Form.Label>
						<Form.Control
							type="number"
							maxLength="4"
							placeholder={t("ENTER_NO_OF_FLOORS")}
							{...register("totalFloors", {
								required: {
									value: false,
									message: t("PLEASE_ENTER_TOTAL_FLOORS"),
								},
								minLength: {
									value: 1,
									message: t("MINIMUM_LENGTH_1"),
								},
								maxLength: {
									value: 4,
									message: t("MAXIMUM_LENGTH_4"),
								},
								pattern: {
									value: validationRules.numberNew,
									message: t("SPECIAL_CHARACTER_IS_NOT_ALLOWED"),
								},
								validate: (value) => {
									if (value !== '' && value !== null) {
										value = Number(value)
									}
									if (isNumber(value)) {
										if (value < 1) {
											return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
										}
									}
								},
							})}
							onInput={(e) => preventMax(e, 4)}
							onKeyDown={NumberInputNew}
						/>
						<ErrorMessage message={errors?.totalFloors?.message} />
					</Form.Group>
				</Col>
				{/* {console.log(editProperty?.permitNumber, 'editProperty?.permitNumber')} */}
				{(user?.role === 'agent' && !isEmpty(editProperty?.permitNumber) && editProperty?.permitNumber > 0) &&
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
							<Form.Label>{t("PERMIT_NUMBERS")}</Form.Label>
							<Form.Control
								type="number"
								maxLength="12"
								disabled={true}
								placeholder={t("ENTER_PERMIT_NUMBERS")}
								{...register("permitNumber")}
							// onInput={(e) => preventMax(e, 12)}
							// onKeyDown={NumberInputNew}
							/>
							<ErrorMessage message={errors?.permitNumber?.message} />
						</Form.Group>
					</Col>
				}
				{user?.role === 'company' &&
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
							<Form.Label>{t("PERMIT_NUMBERS")}</Form.Label>
							<Form.Control
								type="number"
								maxLength="12"
								disabled={(editProperty?.permitNumber !== undefined || !isEmpty(editProperty?.permitNumber)) ? true : false}
								placeholder={t("ENTER_PERMIT_NUMBERS")}
								{...register("permitNumber", {
									minLength: {
										value: 2,
										message: t("MINIMUM_LENGTH"),
									},
									maxLength: {
										value: 12,
										message: t("MAXIMUM_LENGTH_MUST_BE_12"),
									},
									pattern: {
										value: validationRules.numberNew,
										message: t("SPECIAL_CHARACTER_IS_NOT_ALLOWED"),
									},
									validate: (value) => {
										if (value !== '' && value !== null) {
											value = Number(value)
										}
										if (isNumber(value)) {
											if (value < 1) {
												return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
											}
										}
									},
								})}
								onInput={(e) => preventMax(e, 12)}
								onKeyDown={NumberInputNew}
							/>
							<ErrorMessage message={errors?.permitNumber?.message} />
						</Form.Group>
					</Col>}
				<Col lg={4} sm={6}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>
							{t("FLOOR_NUMBER")}
						</Form.Label>
						<Form.Control
							type="number"
							maxLength="4"
							placeholder={t("ENTER_FLOOR_NUMBER")}
							{...register("floorNumber", {
								required: {
									value: false,
									message: t("PLEASE_ENTER_FLOOR_NUMBER"),
								},
								minLength: {
									value: 1,
									message: t("MINIMUM_LENGTH_1"),
								},
								maxLength: {
									value: 4,
									message: t("MAXIMUM_LENGTH_4"),
								},
								pattern: {
									value: validationRules.numberNew,
									message: t("SPECIAL_CHARACTER_IS_NOT_ALLOWED"),
								},
								validate: (value) => {
									if (value !== '' && value !== null) {
										value = Number(value)
									}
									if (isNumber(value)) {
										if (value < 1) {
											return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
										}
									}
								},
							})}
							onInput={(e) => preventMax(e, 4)}
							onKeyDown={NumberInputNew}
						/>
						<ErrorMessage message={errors?.floorNumber?.message} />
					</Form.Group>
				</Col>
				{user?.role === "company" && (
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
							<Form.Label>
								{t("AGENT")}
								<RedStar />
							</Form.Label>
							<Controller
								control={control}
								name="agentId"
								rules={{
									required: t("PLEASE_ENTER_AGENT"),
								}}
								render={({ field: { ref, ...field } }) => (
									<Select
										{...field}
										inputExtraProps={{
											ref,
											required: true,
											autoFocus: true,
										}}
										aria-label="Default select example"
										placeholder={t("PLEASE_SELECT_AGENT")}
										options={agentList}
										isSearchable
									/>
								)}
							/>
							<ErrorMessage message={errors?.agentId?.message} />
						</Form.Group>
					</Col>
				)}
				{propertyTypeName === "buy" && (
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
							<Form.Label>{t("SERVICE_CHARGE")}</Form.Label>
							<Form.Control
								type="number"
								maxLength="10"
								placeholder={t("ENTER_SERVICE_CHARGE")}
								{...register("serviceCharge", {
									required: {
										value: false,
										message: t("PLEASE_ENTER_SERVICE_CHARGE"),
									},
									minLength: {
										value: 2,
										message: t("MINIMUM_LENGTH"),
									},
									maxLength: {
										value: 10,
										message: t("MAXIMUM_LENGTH_10"),
									},
									validate: (value) => {
										if (value !== '' && value !== null) {
											value = Number(value)
										}
										if (isNumber(value)) {
											if (value < 1) {
												return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
											}
										}
									},
								})}
								onInput={(e) => preventMax(e, 10)}
								onKeyDown={NumberInputNew}
							/>
							<ErrorMessage message={errors?.serviceCharge?.message} />
						</Form.Group>
					</Col>
				)}
				{propertyTypeName === "rent" && (
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
							<Form.Label>{t("CHEQUES")}</Form.Label>
							<Form.Select
								aria-label="Default select example"
								{...register("cheques", {
									required: {
										value: false,
										message: t("PLEASE_ENTER_CHEQUES"),
									},
								})}
							>
								<option value="">{t("SELECT_CHEQUES")}</option>
								{MAX_NUMBERS?.length > 0 &&
									MAX_NUMBERS?.map((res) => {
										return (
											<option key={res} value={res}>
												{res}
											</option>
										);
									})}
							</Form.Select>
							<ErrorMessage message={errors?.cheques?.message} />
						</Form.Group>
					</Col>
				)}
				{propertyTypeName === "rent" && (
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
							<Form.Label>{t("SECURITY_DEPOSIT")}</Form.Label>
							<Form.Control
								type="number"
								maxLength="10"
								placeholder={t("ENTER_SECURITY_DEPOSIT")}
								{...register("securityDeposit", {
									// required: {
									// 	value: false,
									// 	message: "Please enter security deposit.",
									// },
									minLength: {
										value: 1,
										message: t("MINIMUM_LENGTH_1"),
									},
									maxLength: {
										value: 10,
										message: t("MAXIMUM_LENGTH_10"),
									},
									pattern: {
										value: validationRules.numberNew,
										message: t("SPECIAL_CHARACTER_IS_NOT_ALLOWED"),
									},
									validate: (value) => {
										if (value !== '' && value !== null) {
											value = Number(value)
										}
										if (isNumber(value)) {
											if (value < 1) {
												return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
											}
										}
									},
								})}
								onInput={(e) => preventMax(e, 10)}
								onKeyDown={NumberInputNew}
							/>
							<ErrorMessage message={errors?.securityDeposit?.message} />
						</Form.Group>
					</Col>
				)}
				{propertyTypeName === "buy" && (
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
							<Form.Label>{t("PRICE_PER_UNIT")}</Form.Label>
							<InputGroup>
								<InputGroup.Text id="basic-addon1" className="bg-light">
									{config?.currency}
								</InputGroup.Text>
								<Form.Control
									type="text"
									placeholder={t("ENTER_PRICE_PER_UNIT")}
									{...register("pricePerUnit", {
										required: {
											value: false,
											message: t("PLEASE_ENTER_PRICE_PER_UNIT"),
										},
										onChange: (e) => handleDecimalOffer(e),
										minLength: {
											value: 2,
											message: t("MINIMUM_LENGTH"),
										},
										maxLength: {
											value: 10,
											message: t("MAXIMUM_LENGTH_10"),
										},
										pattern: {
											value: validationRules.numberWithDot,
											message: t("PLEASE_ENTER_VALID_NUMBER"),
										},
										validate: (value) => {
											if (value !== '' && value !== null) {
												value = Number(value)
											}
											if (isNumber(value)) {
												if (value < 1) {
													return t("PLEASE_ENTER_NUMBER_GREATER_THAN_0")
												}
											}
										},
									})}
									// onKeyDown={e => {
									// 	pressedKeys.push(e.key);
									// 	var lastKey = pressedKeys[pressedKeys.length - 2]
									// 	if (lastKey == '.') {
									// 		if (['-', '.', '+', 'e'].includes(e.key)) {
									// 			e.preventDefault()
									// 		}
									// 	} else if (['-', '+', 'e'].includes(e.key)) {
									// 		e.preventDefault()
									// 	}
									// }}
									onInput={(e) => preventMax(e, 10)}
								// onKeyDown={NumberInputNew}
								/>
							</InputGroup>
							<ErrorMessage message={errors?.pricePerUnit?.message} />
						</Form.Group>
					</Col>
				)}


				<Col lg={12}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>{t("DESCRIPTION")}</Form.Label>
						<Form.Control type="text" placeholder={t("ENTER_DESCRIPTION")} as="textarea" style={{ height: "120px" }} {...register("description", {})} />
						<ErrorMessage message={errors?.description?.message} />
					</Form.Group>
				</Col>
				<Col lg={12}>
					<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
						<Form.Label>{t("DESCRIPTION_ARABIC")}</Form.Label>
						<Form.Control type="text" placeholder={t("ENTER_DESCRIPTION_ARABIC")} as="textarea" style={{ height: "120px" }} {...register("descriptionAr", {})} />
						<ErrorMessage message={errors?.descriptionAr?.message} />
					</Form.Group>
				</Col>
			</Row>

			<hr className="my-3" />

			<div className="text-center">
				<Button type="submit" className="py-2 mt-2 mt-sm-4 mb-2">
					{t("SAVE_AND_CONTINUE")}
				</Button>
			</div>

			{propertyCategoriesModel && (
				<Modal size="xl" fullscreen="xl-down" show={propertyCategoriesModel} onHide={() => setPropertyCategoriesModel(false)}>
					<Modal.Header className="d-flex justify-content-center" closeButton>
						<Modal.Title>{t("PROPERTY_CATEGORY")}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{/* <pre>{JSON.stringify(propertyCategoryTypes, null, 2)}</pre>
						{propertyType} */}
						<div className="add_property_tabs  new-add-property">
							<ul className="d-flex flex-wrap">
								{propertyCategoryTypes.filter(pt => pt.propertyTypeId === propertyType).map((pct, index) => {
									return (
										<li onClick={handleCategoryChangeType.bind(this, pct)} key={index} className="position-relative me-2 mb-2">
											<button type="button" className={propertyCategoryType === pct?._id ? "active rounded-pill" : "rounded-pill"}>
												<span className="select_tab">{pct?.[`name${direction?.langKey || ''}`]}</span>
											</button>
										</li>
									);
								})}
							</ul>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							onClick={() => {
								{
									setPropertyCategoriesModel(false);
								}
							}}
						>
							{t("SUBMIT")}
						</Button>
					</Modal.Footer>
				</Modal>
			)}

			{amenitiesModel && (
				<Modal size="xl" fullscreen="xl-down" show={amenitiesModel} onHide={() => { setAmenitiesModel(false); setSearchAmenities(propertyAmenitiesList); }}>
					<Modal.Header className="d-flex justify-content-center" closeButton>
						<Modal.Title>{t("AMENITIES")}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="add_property_tabs  new-add-property amenities-modal">
							<Form.Control
								type="text"
								id={`amenities_text`}
								className="mb-2"
								onChange={(e) => {
									if (e.target.value == "") {
										setSearchAmenities(propertyAmenitiesList);
									} else {
										setSearchAmenities(
											propertyAmenitiesList?.length > 0 &&
											_.filter(propertyAmenitiesList, (a) => {
												return a?.name?.toLowerCase().includes(e?.target?.value?.toLowerCase());
											})
										);
									}
								}}
								placeholder={t("SEARCH_AMENITIES")}
							/>
							<ul className="d-flex flex-wrap amenities_link overflow-auto">
								{searchedAmenities?.length > 0 ? (
									searchedAmenities?.map((amenity, index) => {
										return (
											<li key={index} onClick={handleAmenitiesClick.bind(this, amenity)} className="position-relative me-2 mb-2">
												<button type="button" className={propertyAmenities?.includes(amenity._id) ? "active rounded-pill" : "rounded-pill"}>
													<span className="select_tab">
														<CustomImage width={20} height={21} className="w-5 h-5 me-2" src={amenity?.icon} alt={amenity?.name} />
														{amenity?.[`name${direction?.langKey || ''}`]}
													</span>
												</button>
											</li>
										);
									})
								) : (
									<p>{t("NO_RECORD_FOUND")}</p>
								)}
							</ul>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							onClick={() => {
								setAmenitiesModel(false);
								setSearchAmenities(propertyAmenitiesList);
							}}
						>
							{t("SUBMIT")}
						</Button>
					</Modal.Footer>
				</Modal>
			)}
		</Form>
	);
};

export default BasicInfo;
