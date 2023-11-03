import React, { useContext, useEffect, useState, startTransition } from "react";
import { Tabs, Tab, InputGroup, Form, Button, ProgressBar, Container, Breadcrumb, Col, Row } from "react-bootstrap";
import MapContainer from "./MapContainer";
import apiPath from "@/utils/apiPath";
import { apiDelete, apiGet, apiPost } from "@/utils/apiFetch";
import { AREA_BOUND, AREA_REGION, COUNTRY_RESTRICTIONS } from "@/utils/constants";
import { groupBy, isEmpty, orderBy, uniqBy, get as __get } from "lodash";
import { Controller, useForm } from "react-hook-form";
import useToastContext from "@/hooks/useToastContext";
import ErrorMessage from "../ErrorMessage";
import RedStar from "../common/RedStar";
import AuthContext from "@/context/AuthContext";
import { TagsInput } from "react-tag-input-component";
import { LoadScript } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
const libraries = ["places"];
const AddressProperty = ({ propertyId, setKey, editProperty, key, getPropertyData }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		getValues,
	} = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
	const { t } = useTranslation();
	const notification = useToastContext();
	const [enableEdit, setEnableEdit] = useState(false);
	const { config } = useContext(AuthContext);
	const [markerPosition, setMarkerPosition] = useState(AREA_REGION[config.country]);
	const [center, setCenter] = useState(AREA_REGION[config.country]);
	const [cities, setCities] = useState([]);
	const [communities, setCommunities] = useState([]);
	const [subCommunities, setSubCommunities] = useState([]);
	const [nearestFacility, setNearestFacility] = useState([]);
	const [nearestFacilityAr, setNearestFacilityAr] = useState([]);

	const [selectedCity, setSelectedCity] = useState("");
	const [selectedCommunity, setSelectedCommunity] = useState("");
	const [selectedSubCommunity, setSelectedSubCommunity] = useState("");
	const [city, setCity] = useState("");
	const [community, setCommunity] = useState("");
	const [subCommunity, setSubCommunity] = useState("");

	const onSubmit = async (data) => {
		data = {
			...data,
			building: data?.building || null,
			unitNumber: data?.unitNumber || null,
			nearestFacilities: data?.nearestFacilities || null,
			nearestFacility: nearestFacility || null,
			nearestFacilitiesAr: data?.nearestFacilitiesAr || null,
			nearestFacilityAr: nearestFacilityAr || null,
			_id: propertyId,
			latitude: data?.latitude || null,
			longitude: data?.longitude || null,
			// ...(postalCode && {
			// 	postalCode: postalCode,
			// }),p
			// ...(country && {
			// 	country: country,
			// }),
			// ...(mapAddress?.formatted_address && {
			// 	address: mapAddress?.formatted_address,
			// }),
			...(markerPosition && {
				latitude: markerPosition.lat,
			}),
			...(markerPosition && {
				longitude: markerPosition.lng,
			}),
			city,
			community,
			subCommunity,
			subCommunityId: data?.subCommunityId == '' ? null : data?.subCommunityId
		};
		if (config?.country === "UAE") {
			data = {
				...data,
				street: data?.street || null,
			};
		}
		if (config?.country === "Saudi") {
			data = {
				...data,
				propertyLength: data?.propertyLength || "",
				streetWidth: data?.streetWidth || "",
				propertyWidth: data?.propertyWidth || "",
				propertyAge: data?.propertyAge || "",
				streetInfoOne: data?.streetInfoOne || "",
				streetInfoTwo: data?.streetInfoTwo || "",
				streetInfoThree: data?.streetInfoThree || "",
				streetInfoFour: data?.streetInfoFour || "",
			};
		}
		try {
			const payload = data;
			const path = apiPath.addAddressProperty;
			const result = await apiPost(path, payload);
			const resultResponse = result?.data;
			if (resultResponse?.success) {
				setKey("photos");
				getPropertyData(editProperty?.slug);
				window.scrollTo(0, 0);
			} else {
				notification.error(resultResponse.message);
			}
		} catch (error) {
			console.error("error in get all users list==>>>>", error.message);
		}
	};
	const addressChanged = ({ selectedCity, selectedCommunity, selectedSubCommunity }) => {
		// setMapAddress(address);
		// const addressComponents = address?.address_components;

		// const countryComponent = addressComponents?.find((component) => component.types.includes("country"));
		// const cityComponent = addressComponents?.find((component) => component.types.includes("locality") || component.types.includes("administrative_area_level_1"));

		// const communityComponent = addressComponents.find((component) => component.types.includes("sublocality_level_1") || component.types.includes("sublocality"));
		// const subCommunityComponent = addressComponents.find(
		// 	(component) => component.types.includes("neighborhood") || component.types.includes("sublocality_level_2") || component.types.includes("sublocality_level_3")
		// );

		// setCountry(countryComponent?.long_name);
		// startTransition(() => {
		// 	getCities(countryComponent?.long_name || "", cityComponent?.long_name || "", communityComponent?.long_name || "", subCommunityComponent?.long_name || "");
		// }); 
		if (!isEmpty(selectedSubCommunity)) {

			const locObj = subCommunities.find(c => c._id === selectedSubCommunity);
			if (!isEmpty(locObj)) {
				const positionObj = Array.from(__get(locObj, "location.coordinates")).reverse()
				setMarkerPosition({ lat: positionObj[0], lng: positionObj[1] })
				setCenter({ lat: positionObj[0], lng: positionObj[1] })
				setSubCommunity(locObj.name)
			}
		} else if (!isEmpty(selectedCommunity)) {

			const locObj = communities.find(c => c._id === selectedCommunity);
			if (!isEmpty(locObj)) {
				const positionObj = Array.from(__get(locObj, "location.coordinates")).reverse()
				setMarkerPosition({ lat: positionObj[0], lng: positionObj[1] })
				setCenter({ lat: positionObj[0], lng: positionObj[1] })
				setCommunity(locObj.name)
				setSubCommunity('')
			}
		} else if (!isEmpty(selectedCity)) {

			const locObj = cities.find(c => c._id === selectedCity);
			if (!isEmpty(locObj)) {
				const positionObj = Array.from(__get(locObj, "location.coordinates")).reverse()
				setMarkerPosition({ lat: positionObj[0], lng: positionObj[1] })
				setCenter({ lat: positionObj[0], lng: positionObj[1] })
				setCity(locObj.name)
			}
		}
	};

	const getCities = async (countryName = "", ciyId = "", communityId = "", subCommunityId = "") => {
		try {
			const payload = {};
			const path = apiPath.getAllCities;
			const result = await apiGet(path, payload);
			const records = result?.data?.results;
			setCities(records);
			startTransition(() => {
				setValue("cityId", ciyId);
				setSelectedCity(ciyId);
				getCommunities(ciyId, { communityId, subCommunityId });
			});
			// }
		} catch (error) {
			console.error("error in get all users list==>>>>", error.message);
		}
	};

	const getCommunities = async (cityId = "", option) => {
		try {
			const payload = { cityId };
			const path = apiPath.getAllCommunities;
			const result = await apiGet(path, payload);
			const records = result?.data?.results;
			if (result?.data?.success) {
				if (!isEmpty(records)) {
					if (records?.length > 0) {
						setCommunities(orderBy(records, ["name"], ["asc"]));
						startTransition(() => {
							setValue("communityId", option?.communityId);
							setSelectedCommunity(option?.communityId);
							startTransition(() => {
								getSubCommunities(option?.communityId, { subCommunityId: option?.subCommunityId });
							})
							// const tmpSubCommunities = records.filter((c) => c.communityName === option?.communityName);
							// setSubCommunities(orderBy(uniqBy(tmpSubCommunities, "subCommunityName"), ["subCommunityName"], ["asc"]));
							// startTransition(() => {
							// 	setValue("subCommunity", option?.subCommunityName);
							// 	setSelectedSubCommunity(option?.subCommunityName);
							// });

						});
					}
				} else {
					setSelectedCommunity("");
					setValue("community", "");
					setSelectedSubCommunity("");
					setValue("subCommunity", "");
				}
			}

		} catch (error) {
			console.error("error in get all users list==>>>>", error.message);
		}
	};

	const getSubCommunities = async (communityId = "", option) => {
		try {
			const payload = { communityId: communityId };
			console.log('payload', payload)
			const path = apiPath.getAllSubCommunities;
			const result = await apiGet(path, payload);
			const records = result?.data?.results;
			if (!isEmpty(records)) {
				setSubCommunities(orderBy(records, ["name"], ["asc"]));
				startTransition(() => {
					setValue("subCommunityId", option?.subCommunityId);
					setSelectedSubCommunity(option?.subCommunityId);
				});
			} else {
				// setSelectedCommunity("");
				// setValue("community", "");
				setSelectedSubCommunity("");
				setValue("subCommunity", "");
			}

		} catch (error) {
			console.error("error in get all users list==>>>>", error.message);
		}
	};

	const handleCitySelect = (e) => {
		setSelectedCity(e.target.value);
		setSelectedCommunity("");
		setSelectedSubCommunity("");
		setCommunities([]);
		setSubCommunities([]);

		getCommunities(e.target.value, {});

	};

	const handleCommunitySelect = (e) => {
		const communityId = e.target.value;
		setSelectedCommunity(communityId);
		// const tmpSubCommunities = allCommunities.filter((c) => c.communityName === communityName);
		// setSubCommunities(orderBy(uniqBy(tmpSubCommunities, "subCommunityName"), ["subCommunityName"], ["asc"]));
		getSubCommunities(communityId, { communityId })
	};

	const handleSubComunitySelect = (e) => {
		setSelectedSubCommunity(e.target.value);
	};

	useEffect(() => {
		if (!isEmpty(editProperty)) {
			getCities(editProperty?.country || "UAE", editProperty?.cityId || "", editProperty?.communityId || "", editProperty?.subCommunityId || "");
			//TODO: setCountry if needed
			setValue("nearestFacilities", editProperty?.nearestFacilities);
			setValue("nearestFacilitiesAr", editProperty?.nearestFacilitiesAr);
			setValue("unitNumber", editProperty?.unitNumber);
			setValue("street", editProperty?.street);
			setValue("building", editProperty?.building);
			setValue("street", editProperty?.street);
			setEnableEdit(false); //FIXME: What is the use of this?
			setValue("street", editProperty?.street);
			setValue("streetInfoOne", editProperty?.streetInfoOne);
			setValue("streetInfoTwo", editProperty?.streetInfoTwo);
			setValue("streetInfoThree", editProperty?.streetInfoThree);
			setValue("streetInfoFour", editProperty?.streetInfoFour);
			setValue("propertyLength", editProperty?.propertyLength);
			setValue("propertyWidth", editProperty?.propertyWidth);
			setValue("propertyAge", editProperty?.propertyAge);
			setValue("streetWidth", editProperty?.streetWidth);
			setNearestFacility(editProperty?.nearestFacility || []);
			setNearestFacilityAr(editProperty?.nearestFacilityAr || []);
			startTransition(() => {
				addressChanged(editProperty?.cityId || "", editProperty?.communityId || "", editProperty?.subCommunityId)
			})
		}
	}, [editProperty]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [key]);

	useEffect(() => {
		addressChanged({ selectedCity, selectedCommunity, selectedSubCommunity })
	}, [selectedCity, selectedCommunity, selectedSubCommunity])

	return (
		<div className="address">
			<div className="map_outer overflow-hidden rounded-3 my-3 my-md-4">
				<LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries} language="en">
					<MapContainer
						addressChanged={addressChanged}
						options={{
							AREA_BOUND: AREA_BOUND[config.country], // Sample: { north: 26.245017, south: 22.495708, east: 56.611014, west: 51.498994}
							AREA_REGION: AREA_REGION[config.country], // Sample: { lat: 23.424076, lng: 53.847818}
							COUNTRY_RESTRICTIONS: COUNTRY_RESTRICTIONS[config.country], // Sample: "AE"
							ADDRESS: !isEmpty(editProperty) ? editProperty?.address : '',
							// ...(!isEmpty(editProperty) &&
							// 	editProperty?.location?.coordinates?.length && {
							// 		...(editProperty?.location?.coordinates[1] && { lat: editProperty?.location?.coordinates[1] }),
							// 		...(editProperty?.location?.coordinates[0] && { lng: editProperty?.location?.coordinates[0] }),
							// 	}),
							// ...(
							// 	{
							// 		lat: 26.9124, lng:75.7873
							// 	}
							// )
							markerPosition: markerPosition,
							center: center,
						}}
					/>
				</LoadScript>
			</div>
			<Form className="theme_form address-form" onSubmit={handleSubmit(onSubmit)}>
				<Row>
					{/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" onChange={handleCitySelect}>
							<Form.Label>
								{config?.country === "Saudi" ? t("ZONE") : t("CITY")}
								<RedStar />
							</Form.Label>
							<>
								<Form.Select
									value={selectedCity}
									{...register("cityId", {
										required: {
											value: true,
											message: `${t("PLEASE_SELECT")} ${config?.country === "Saudi" ? t("ZONE") : t("CITY")}.`,
										},
									})}
								>
									<option value={""}>Select {config?.country === "Saudi" ? t("ZONE") : t("CITY")}</option>
									{cities?.length > 0 &&
										cities?.map((c, index) => {
											return (
												<option key={index} value={c._id}>
													{c.name}
												</option>
											);
										})}
								</Form.Select>
								<ErrorMessage message={errors?.cityId?.message} />
							</>
						</Form.Group>
					</Col>

					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" onChange={handleCommunitySelect}>
							<Form.Label>
								{config?.country === "Saudi" ? t("DISTRICT") : t("COMMUNITY")}
								<RedStar />
							</Form.Label>
							<>
								<Form.Select
									value={selectedCommunity}
									aria-label="Default select example"
									{...register("communityId", {
										required: {
											value: true,
											message: `${t("PLEASE_SELECT")} ${config?.country === "Saudi" ? t("DISTRICT") : t("COMMUNITY")}.`,
										},
									})}
								>
									<option value={""}>Select {config?.country === "Saudi" ? t("DISTRICT") : t("COMMUNITY")}</option>
									{communities?.map((c, index) => {
										return (
											<option key={index} value={c._id}>
												{c.name}
											</option>
										);
									})}
								</Form.Select>
								<ErrorMessage message={errors?.communityId?.message} />
							</>
						</Form.Group>
					</Col>

					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
							<Form.Label>{t("SUB_COMMUNITY")}</Form.Label>
							<Form.Select
								value={selectedSubCommunity}
								aria-label="Default select example"
								{...register("subCommunityId", {
									required: false,
									validate: (value) => {
										setSelectedSubCommunity(value)
										if (value == '')
											setSubCommunity('')
									}
								})}
							>
								<option value={""}>{t("SELECT_SUB_COMMUNITY")}</option>
								{subCommunities?.length > 0 && subCommunities?.map((c, index) => (
									c?.communityId == selectedCommunity &&
									(
										<option key={index} value={c._id} >
											{c.name}
										</option>
									)
								))}
								{/* {subCommunities?.length > 0 &&
									subCommunities?.map((c, index) => {
										return (
											<option key={index} value={c._id}>
												{c.name}
											</option>
										);
									})} */}
							</Form.Select>
						</Form.Group>
					</Col>
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
							<Form.Label>{t("LATITUDE")}</Form.Label>
							<Form.Control
								type="text"
								placeholder={t("ENTER_LATITUDE")}
								{...register("latitude", {
									required: {
										value: false,
										message: t("PLEASE_ENTER_LATITUDE"),
									}
								})}
							/>
							<ErrorMessage message={errors?.latitude?.message} />
						</Form.Group>
					</Col>
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
							<Form.Label>{t("LONGITUDE")}</Form.Label>
							<Form.Control
								type="text"
								placeholder={t("ENTER_LONGITUDE")}
								{...register("longitude", {
									required: {
										value: false,
										message: t("PLEASE_ENTER_LONGITUDE"),
									},
								})}
							/>
							<ErrorMessage message={errors?.longitude?.message} />
						</Form.Group>
					</Col>
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
							<Form.Label>{t("BUILDING")}</Form.Label>
							<Form.Control
								type="text"
								// maxLength={20}
								placeholder={t("ENTER_BUILDING")}
								{...register("building", {
									required: {
										value: false,
										message: t("PLEASE_ENTER_BUILDING"),
									},
									minLength: {
										value: 2,
										message: t("MINIMUM_LENGTH"),
									},
									// maxLength: {
									// 	value: 20,
									// 	message: "Maximum length must be 20.",
									// },
									// validate: (value) => {
									// 	if (value === "") {
									// 	  return true;
									// 	}
									// 	if (!!value.trim()) {
									// 	  return true;
									// 	} else {
									// 	  ("White spaces not allowed.");
									// 	}
									//   }
								})}
							/>
							<ErrorMessage message={errors?.building?.message} />
						</Form.Group>
					</Col>

					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
							<Form.Label>{t("UNIT_NUMBER")}</Form.Label>
							<Form.Control
								type="text"
								maxLength={10}
								placeholder={t("ENTER_UNIT_NUMBER")}
								{...register("unitNumber", {
									required: {
										value: false,
										message: t("PLEASE_ENTER_UNIT_NUMBER"),
									},
									minLength: {
										value: 1,
										message: t("MINIMUM_LENGTH_1"),
									},
									maxLength: {
										value: 10,
										message: t("MAXIMUM_LENGTH_10"),
									},
								})}
							/>
							<ErrorMessage message={errors?.unitNumber?.message} />
						</Form.Group>
					</Col>

					{config?.country === "UAE" && (
						<Col lg={4} sm={6}>
							<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
								<Form.Label>{t("STREET")}</Form.Label>
								<Form.Control
									type="text"
									maxLength={20}
									placeholder={t("ENTER_STREET")}
									{...register("street", {
										required: {
											value: false,
											message: t("PLEASE_ENTER_STREET"),
										},
										minLength: {
											value: 2,
											message: t("MINIMUM_LENGTH"),
										},
										maxLength: {
											value: 20,
											message: t("MINIMUM_LENGTH_20"),
										},
									})}
								/>
								<ErrorMessage message={errors?.street?.message} />
							</Form.Group>
						</Col>
					)}

					{config?.country === "Saudi" && (
						<>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>{t("STREET_WIDTH")}</Form.Label>
									<Form.Control
										type="text"
										maxLength={10}
										placeholder={t("ENTER_STREET_WIDTH")}
										{...register("streetWidth", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
											maxLength: {
												value: 10,
												message: t("MAXIMUM_LENGTH_10"),
											},
										})}
									/>
									<ErrorMessage message={errors?.streetWidth?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>{t("PROPERTY_LENGTH")}</Form.Label>
									<Form.Control
										type="text"
										maxLength={10}
										placeholder={t("ENTER_PROPERTY_LENGTH")}
										{...register("propertyLength", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
											maxLength: {
												value: 10,
												message: t("MAXIMUM_LENGTH_10"),
											},
										})}
									/>
									<ErrorMessage message={errors?.propertyLength?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>{t("PROPERTY_WIDTH")}</Form.Label>
									<Form.Control
										type="text"
										maxLength={10}
										placeholder={t("ENTER_PROPERTY_WIDTH")}
										{...register("propertyWidth", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
											maxLength: {
												value: 10,
												message: t("MAXIMUM_LENGTH_10"),
											},
										})}
									/>
									<ErrorMessage message={errors?.propertyWidth?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>{t("PROPERTY_AGE")}</Form.Label>
									<Form.Control
										type="text"
										maxLength={10}
										placeholder={t("ENTER_PROPERTY_AGE")}
										{...register("propertyAge", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
											maxLength: {
												value: 10,
												message: t("MAXIMUM_LENGTH_10"),
											},
										})}
									/>
									<ErrorMessage message={errors?.propertyAge?.message} />
								</Form.Group>
							</Col>

							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>{t("STREET_INFO")}</Form.Label>
									<Form.Control
										type="text"
										placeholder={t("ENTER_STREET_INFO")}
										{...register("streetInfoOne", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
										})}
									/>
									<ErrorMessage message={errors?.streetInfoOne?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>{t("STREET_INFO_2")}</Form.Label>
									<Form.Control
										type="text"
										placeholder={t("ENTER_STREET_INFO_2")}
										{...register("streetInfoTwo", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
										})}
									/>
									<ErrorMessage message={errors?.streetInfoTwo?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>{t("STREET_INFO_3")}</Form.Label>
									<Form.Control
										type="text"
										placeholder={t("ENTER_STREET_INFO_3")}
										{...register("streetInfoThree", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
										})}
									/>
									<ErrorMessage message={errors?.streetInfoThree?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>{t("STREET_INFO_4")}</Form.Label>
									<Form.Control
										type="text"
										placeholder={t("ENTER_STREET_INFO_4")}
										{...register("streetInfoFour", {
											minLength: {
												value: 2,
												message: t("MINIMUM_LENGTH"),
											},
										})}
									/>
									<ErrorMessage message={errors?.streetInfoFour?.message} />
								</Form.Group>
							</Col>
						</>
					)}
					<Col lg={12}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
							<Form.Label>{t("NEAREST_FACILITY")}</Form.Label>
							<TagsInput
								classNames={{
									input: "w-full h-9 --rti-border: bg-transparent border-2 rounded-lg border-[#DFDFDF]  ",
								}}
								value={nearestFacility}
								onChange={(item) => {
									setNearestFacility(item);
								}}
								name="nearestFacility"
								placeHolder={t("PLEASE_TYPE_AND_PRESS_ENTER_TO_ADD_MORE_NEAREST_FACILITY")}
							/>
						</Form.Group>
					</Col>
					<Col lg={12}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
							<Form.Label>{t("NEAREST_FACILITY_ARABIC")}</Form.Label>
							<TagsInput
								classNames={{
									input: "w-full h-9 --rti-border: bg-transparent border-2 rounded-lg border-[#DFDFDF]  ",
								}}
								value={nearestFacilityAr}
								onChange={(item) => {
									setNearestFacilityAr(item);
								}}
								name="nearestFacility"
								placeHolder={t("PLEASE_TYPE_AND_PRESS_ENTER_TO_ADD_MORE_NEAREST_FACILITY")}
							/>
						</Form.Group>
					</Col>
				</Row>

				<hr className="my-3" />

				<div className="d-flex mt-4">
					<button type='button' onClick={() => setKey("basic_info")} className="py-2 me-3 px-4 border-green rounded text-green fw-medium fs-xs-5 d-inline-flex outline-btn">
						{t("GO_BACK")}
					</button>
					<Button className="py-2" type="submit">
						{t("SAVE_AND_CONTINUE")}
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default AddressProperty;
