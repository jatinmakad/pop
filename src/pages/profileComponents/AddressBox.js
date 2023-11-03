import React, { startTransition, useContext, useEffect, useState } from "react";
import { Tabs, Tab, InputGroup, Form, Modal, Button, ProgressBar, Container, Breadcrumb, Col, Row } from "react-bootstrap";
import apiPath from "@/utils/apiPath";
import { apiDelete, apiGet, apiPost, apiPut } from "@/utils/apiFetch";
import { groupBy, isEmpty, orderBy, uniqBy, get as __get } from "lodash";
import { Controller, useForm } from "react-hook-form";
import useToastContext from "@/hooks/useToastContext";
import AuthContext from "@/context/AuthContext";
// import { TagsInput } from "react-tag-input-component";
import MapContainer from "../components/addProperty/MapContainer";
import ErrorMessage from "../components/ErrorMessage";
import RedStar from "../components/common/RedStar";
import { AREA_BOUND, AREA_REGION, COUNTRY_RESTRICTIONS } from "@/utils/constants";
import { LoadScript } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
const libraries = ["places"];
const AddressBox = ({ open, handleClose, editProperty, openType, filter, getData }) => {
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
	const [city, setCity] = useState("");
	const [country, setCountry] = useState("");
	const [postalCode, setPostalCode] = useState(null);
	const [cities, setCities] = useState([]);
	const [communities, setCommunities] = useState([]);
	const [subCommunities, setSubCommunities] = useState([]);
	const [mapAddress, setMapAddress] = useState(null);
	const [selectedCity, setSelectedCity] = useState("");
	const [selectedCommunity, setSelectedCommunity] = useState("");
	const [selectedSubCommunity, setSelectedSubCommunity] = useState("");
	const [allCommunities, setAllCommunities] = useState([]);
	const [markerPosition, setMarkerPosition] = useState(AREA_REGION[config.country]);
	const [center, setCenter] = useState(AREA_REGION[config.country]);
	const [community, setCommunity] = useState(""); 
	const [subCommunity, setSubCommunity] = useState(""); 

	const onSubmit = async (data) => {
		let obj = {
			status: "accepted",
			building: data?.building || editProperty?.building,
			unitNumber: data?.unitNumber || editProperty?.unitNumber,
			postCode: postalCode || editProperty?.postCode,
			address: mapAddress?.formatted_address || editProperty?.address,
			latitude: markerPosition.lat || editProperty?.location?.coordinates[1],
			longitude: markerPosition.lng || editProperty?.location?.coordinates[0],
			country: country,
			street: data?.street || editProperty?.street,
			community: data?.communityId || editProperty?.community,
			subCommunity: data?.subCommunityId || editProperty?.subCommunity,
			city:data?.cityId || editProperty?.city,
			communityId: data?.communityId || editProperty?.community,
			subCommunityId: data?.subCommunityId || editProperty?.subCommunity,
			cityId:data?.cityId || editProperty?.city
		};
		try {
			const { status, data } = await apiPut(`${apiPath.updateAppointmentStatusCompany}/${openType?.id}`, obj);
			if (status == 200) {
				if (data.success) {
					notification.success(data?.message);
					handleClose();
					getData(filter, "");
				}
			} else {
				notification.error(data?.message);
			}
		} catch (error) {
			notification.error(error?.message);
		}
	};

	const addressChanged = ({selectedCity, selectedCommunity, selectedSubCommunity}) => {
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
		if(!isEmpty(selectedSubCommunity)) {
			const locObj = subCommunities.find(c => c._id === selectedSubCommunity);
			if(!isEmpty(locObj)) {
				const positionObj = Array.from(__get(locObj, "location.coordinates")).reverse()
				setMarkerPosition({lat: positionObj[0], lng: positionObj[1]})
				setCenter({lat: positionObj[0], lng: positionObj[1]})
				setCommunity(locObj.name)
			}
		} else if(!isEmpty(selectedCommunity)) {
			
			const locObj = communities.find(c => c._id === selectedCommunity);
			if(!isEmpty(locObj)) {
				const positionObj = Array.from(__get(locObj, "location.coordinates")).reverse()
				setMarkerPosition({lat: positionObj[0], lng: positionObj[1]})
				setCenter({lat: positionObj[0], lng: positionObj[1]})
				setSubCommunity(locObj.name)
			}
		} else if(!isEmpty(selectedCity)) {
			
			const locObj = cities.find(c => c._id === selectedCity);
			if(!isEmpty(locObj)) {
				const positionObj = Array.from(__get(locObj, "location.coordinates")).reverse()
				setMarkerPosition({lat: positionObj[0], lng: positionObj[1]})
				setCenter({lat: positionObj[0], lng: positionObj[1]})
				setCity(locObj.name)
			}
		}
	};

	const getCities = async (countryName = "", ciyId = "", communityId = "", subCommunityId = "") => {
		try {
			const payload = { };
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
			if (!isEmpty(records)) {
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
			} else {
				setSelectedCommunity("");
				setValue("community", "");
				setSelectedSubCommunity("");
				setValue("subCommunity", "");
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
				setSelectedCommunity("");
				setValue("community", "");
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
		getSubCommunities(communityId, {communityId})
	};

	const handleSubComunitySelect = (e) => {
		setSelectedSubCommunity(e.target.value);
	};

	useEffect(() => {
		if (!isEmpty(editProperty)) {
		getCities(editProperty?.country || "UAE", editProperty?.cityId || "", editProperty?.communityId || "", editProperty?.subCommunityId || "");
			//TODO: setCountry if needed
			setValue("unitNumber", editProperty?.unitNumber);
			setValue("street", editProperty?.street);
			setValue("building", editProperty?.building);
			setValue("street", editProperty?.street);
			setEnableEdit(false); //FIXME: What is the use of this?
			startTransition(() => {
				addressChanged(editProperty?.cityId || "", editProperty?.communityId || "", editProperty?.subCommunityId)
			})
		}
	}, [editProperty]);

	useEffect(() => {
		addressChanged({selectedCity, selectedCommunity, selectedSubCommunity})
	}, [selectedCity, selectedCommunity, selectedSubCommunity])

	return (
		<Modal show={open} onHide={handleClose} size="xl">
			<Modal.Header className="d-flex justify-content-center" closeButton>
				<Modal.Title>{t("Meeting_Appointment")}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="address">
				<LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries} language="en">
					<MapContainer
						// editProperty={editProperty}
						addressChanged={addressChanged}
						options={{
							AREA_BOUND: AREA_BOUND[config.country], // Sample: { north: 26.245017, south: 22.495708, east: 56.611014, west: 51.498994}
							AREA_REGION: AREA_REGION[config.country], // Sample: { lat: 23.424076, lng: 53.847818}
							COUNTRY_RESTRICTIONS: COUNTRY_RESTRICTIONS[config.country], // Sample: "AE"
							ADDRESS:!isEmpty(editProperty) ? editProperty?.address : '',
							markerPosition: markerPosition,
							center: center,
							// ...(!isEmpty(editProperty) &&
							// 	editProperty?.location?.coordinates?.length && {
							// 		...(editProperty?.location?.coordinates[1] && { lat: editProperty?.location?.coordinates[1] }),
							// 		...(editProperty?.location?.coordinates[0] && { lng: editProperty?.location?.coordinates[0] }),
							// 	}),
						}}
					/>
					</LoadScript>
					<Form className="theme_form address-form" onSubmit={handleSubmit(onSubmit)}>
						<Row>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" onChange={handleCitySelect}>
									<Form.Label>
										{config?.country === "Saudi" ? "Zone" : "City"}
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
											{communities?.length > 0 &&
												communities?.map((c, index) => {
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
											validate:(value) => {
												setSelectedSubCommunity(value)
											}
										})}
									>
										<option value={""}>{t("SELECT_SUB_COMMUNITY")}</option>
										{subCommunities?.length > 0 &&
											subCommunities?.map((c, index) => {
												return (
													<option key={index} value={c._id}>
														{c.name}
													</option>
												);
											})}
									</Form.Select>
								</Form.Group>
							</Col>

							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>Building</Form.Label>
									<Form.Control
										type="text"
										maxLength={20}
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
											maxLength: {
												value: 20,
												message: "Maximum length must be 20.",
											},
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
									<Form.Label>Unit Number</Form.Label>
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
									<ErrorMessage message={errors?.unitNumber?.message} />
								</Form.Group>
							</Col>

							{config?.country === "UAE" && (
								<Col lg={4} sm={6}>
									<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
										<Form.Label>Street</Form.Label>
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
						</Row>
						<Button type="submit" variant="primary">
							Submit
						</Button>
					</Form>
				</div>
			</Modal.Body>
			<Modal.Footer>
				{/* <Button
                    style={{ background: "red", border: "none" }}
                    onClick={handleClose}
                >
                    No
                </Button> */}
				{/* <Button type="submit" variant="primary">Submit</Button> */}
			</Modal.Footer>
		</Modal>
	);
};

export default AddressBox;
