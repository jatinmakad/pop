import React, { useContext, useEffect, useState } from "react";
import { Tabs, Tab, InputGroup, Form, Button, ProgressBar, Container, Breadcrumb, Col, Row } from "react-bootstrap";
import MapContainer from "./MapContainer";
import apiPath from "@/utils/apiPath";
import { apiDelete, apiGet, apiPost } from "@/utils/apiFetch";
import { groupBy, isEmpty, uniqBy } from "lodash";
import { Controller, useForm } from "react-hook-form";
import useToastContext from "@/hooks/useToastContext";
import ErrorMessage from "../ErrorMessage";
import RedStar from "../common/RedStar";
import AuthContext from "@/context/AuthContext";
import { TagsInput } from "react-tag-input-component";

const AddressProperty = ({ propertyId, setKey, editProperty, key, getPropertyData }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		getValues,
	} = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
	const notification = useToastContext();
	const [enableEdit, setEnableEdit] = useState(false);
	const { config } = useContext(AuthContext);
	const [city, setCity] = useState("");
	const [country, setCountry] = useState("");
	const [postalCode, setPostalCode] = useState(null);
	const [cities, setCities] = useState([]);
	const [communities, setCommunities] = useState([]);
	const [allCommunities, setAllCommunities] = useState([]);
	const [subCommunities, setSubCommunities] = useState([]);
	const [mapAddress, setMapAddress] = useState(null);
	const [nearestFacility, setNearestFacility] = useState([]);
	const [nearestFacilityAr, setNearestFacilityAr] = useState([]);

	const [selectedCity, setSelectedCity] = useState("");
	const [selectedCommunity, setSelectedCommunity] = useState("");
	const [selectedSubCommunity, setSelectedSubCommunity] = useState("");

	const onSubmit = async (data) => {
		data = {
			...data,
			building: data?.building || null,
			unitNumber: data?.unitNumber || null,
			nearestFacilities: data?.nearestFacilities || null,
			nearestFacility: nearestFacility || null,
			nearestFacilitiesAr: data?.nearestFacilitiesAr || null,
			nearestFacilityAr: nearestFacilityAr || null,
			...{ _id: propertyId, postalCode, address: mapAddress?.formatted_address, latitude: mapAddress?.geometry?.location?.lat(), longitude: mapAddress?.geometry?.location?.lng() },
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

	const addressChanged = (address) => {
		setMapAddress(address);
		const addressComponents = address?.address_components;
		// console.log('addressComponents', addressComponents)
		// let community = '';

		// for (let i = 0; i < addressComponents.length; i++) {
		// 	const types = addressComponents[i].types;

		// 	if (types.includes('sublocality') || types.includes('neighborhood')) {
		// 	community = addressComponents[i].long_name;
		// 	break;
		// 	}
		// }
		// console.log('community', community)

		const cityComponent = addressComponents?.find((component) => component.types.includes("locality") || component.types.includes("administrative_area_level_1"));
		const countryComponent = addressComponents?.find((component) => component.types.includes("country"));
		const postalCodeComponent = addressComponents?.find((component) => component.types.includes("postal_code"));
		if (cityComponent) {
			setCity(cityComponent.long_name);
			setSelectedCity(cityComponent.long_name);
			setValue("city", cityComponent.long_name);
			setSelectedCommunity("");
			setSelectedSubCommunity("");
			getCommunities(cityComponent.long_name, { subCommunityFetch: false });
			// setTimeout(() => {
			// 	setValue('city', cityComponent.long_name)
			// }, 1000)
		}

		if (countryComponent) {
			setCountry(countryComponent.long_name);
		}

		if (postalCodeComponent) {
			setPostalCode(postalCodeComponent.long_name);
		}
	};

	const getCities = async () => {
		try {
			const payload = { countryName: country.trim() };
			const path = apiPath.getCities;
			const result = await apiGet(path, payload);
			const records = result?.data?.results;
			setCities(records);
			// if (!isEmpty(editProperty?.city) && records?.length > 0) {
			// setTimeout(() => {
			// 	setValue('city', editProperty?.city)
			// }, 1000)
			// }
		} catch (error) {
			console.error("error in get all users list==>>>>", error.message);
		}
	};

	const getCommunities = async (cityName = "", option) => {
		try {
			const payload = { cityName };
			const path = apiPath.getCommunities;
			const result = await apiGet(path, payload);
			const records = result?.data?.results;
			setCommunities(uniqBy(records, "communityName"));
			setAllCommunities(records);
			if (option?.subCommunityFetch && !isEmpty(editProperty) && records?.length > 0) {
				const tmpSubCommunities = records.filter((c) => c.communityName === editProperty?.community);
				setSubCommunities(uniqBy(tmpSubCommunities, "subCommunityName"));
				// setTimeout(() => {
				// 	setValue("community", editProperty?.community);
				// 	setValue("subCommunity", editProperty?.subCommunity);
				// }, 500);
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
		getCommunities(e.target.value, { subCommunityFetch: false });
	};

	const handleCommunitySelect = (e) => {
		setSelectedCommunity(e.target.value);
		const tmpSubCommunities = allCommunities.filter((c) => c.communityName === e.target.value);
		setSubCommunities(uniqBy(tmpSubCommunities, "subCommunityName"));
	};

	const handleSubComunitySelect = (e) => {
		setSelectedSubCommunity(e.target.value);
	};

	useEffect(() => {
		setCities([]);
		setCommunities([]);
		setSubCommunities([]);
		if (!isEmpty(country)) {
			getCities();
		}
	}, [country]);

	useEffect(() => {
		if (!isEmpty(city)) {
			getCommunities(city, { subCommunityFetch: true });
		}
	}, [city]);

	useEffect(() => {
		if (!isEmpty(editProperty)) {
			setCity(editProperty?.city);
			setValue("city", editProperty?.city);
			setValue("community", editProperty?.community);
			setValue("subCommunity", editProperty?.subCommunity);
			setSelectedCity(editProperty?.city);
			setSelectedCommunity(editProperty?.community);
			setSelectedSubCommunity(editProperty?.subCommunity);
			setCountry(editProperty?.address?.trim()?.split("-")[editProperty?.address?.trim()?.split("-")?.length - 1]);
			setValue("nearestFacilities", editProperty?.nearestFacilities);
			setValue("nearestFacilitiesAr", editProperty?.nearestFacilitiesAr);
			setValue("unitNumber", editProperty?.unitNumber);
			setValue("street", editProperty?.street);
			setValue("building", editProperty?.building);
			setValue("street", editProperty?.street);
			setEnableEdit(false);
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
		}
	}, [editProperty]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [key]);

	console.log(selectedCity, "selectedCity");
	return (
		<div className="address">
			<div className="map_outer overflow-hidden rounded-3 my-3 my-md-4">
				<MapContainer editProperty={editProperty} addressChanged={addressChanged} />
			</div>
			<Form className="theme_form address-form" onSubmit={handleSubmit(onSubmit)}>
				<Row>
					{/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" onChange={handleCitySelect}>
							<Form.Label>
								{config?.country === "Saudi" ? "Zone" : "City"}
								<RedStar />
							</Form.Label>
							<>
								<Form.Select
									value={selectedCity}
									{...register("city", {
										required: {
											value: true,
											message: `Please select ${config?.country === "Saudi" ? "zone" : "city"}.`,
										},
										// validate: (value) => {
										// 	setValue("city", value);
										// 	setSelectedCity(value);
										// 	setSelectedCommunity("");
										// 	setSelectedSubCommunity("");
										// 	getCommunities(value);
										// },
									})}
								>
									<option value={""}>Select {config?.country === "Saudi" ? "Zone" : "City"}</option>
									{cities?.length > 0 &&
										cities?.map((c, index) => {
											return (
												// <option key={index} value={c.name} selected={city === c.name}>
												<option key={index} value={c.name}>
													{c.name}
												</option>
											);
										})}
								</Form.Select>
								<ErrorMessage message={errors?.city?.message} />
							</>
						</Form.Group>
					</Col>

					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" onChange={handleCommunitySelect}>
							<Form.Label>
								{config?.country === "Saudi" ? "District" : "Community"}
								<RedStar />
							</Form.Label>

							<>
								<Form.Select
									value={selectedCommunity}
									aria-label="Default select example"
									{...register("community", {
										required: {
											value: true,
											message: `Please select ${config?.country === "Saudi" ? "district" : "community"}.`,
										},
										// validate: (value) => {
										// 	console.log("value :>> ", value);
										// 	setValue("community", value);
										// 	const tmpSubCommunities = allCommunities.filter((c) => c.communityName === value);
										// 	setSubCommunities(uniqBy(tmpSubCommunities, "subCommunityName"));
										// 	setSelectedCommunity(value);
										// 	setSelectedSubCommunity("");
										// },
									})}
								>
									<option value={""}>Select {config?.country === "Saudi" ? "District" : "Community"}</option>
									{communities?.map((c, index) => {
										return (
											<option key={index} value={c.communityName}>
												{c.communityName}
											</option>
										);
									})}
								</Form.Select>
								<ErrorMessage message={errors?.community?.message} />
							</>
						</Form.Group>
					</Col>

					<Col lg={4} sm={6}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail" onChange={handleSubComunitySelect}>
							<Form.Label>Sub Community (Optional)</Form.Label>
							<Form.Select
								value={selectedSubCommunity}
								aria-label="Default select example"
								{...register("subCommunity", {
									required: false,
								})}
							>
								<option value={""}>Select Sub Community</option>
								{subCommunities?.length > 0 &&
									subCommunities?.map((c, index) => {
										return (
											<option key={index} value={c.subCommunityName}>
												{c.subCommunityName}
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
								placeholder="Enter Building"
								{...register("building", {
									required: {
										value: false,
										message: "Please enter building.",
									},
									minLength: {
										value: 2,
										message: "Minimum length must be 2.",
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
								placeholder="Enter Unit Number"
								{...register("unitNumber", {
									required: {
										value: false,
										message: "Please enter unit number.",
									},
									minLength: {
										value: 1,
										message: "Minimum length must be 1.",
									},
									maxLength: {
										value: 10,
										message: "Maximum length must be 10.",
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
									placeholder="Enter Street"
									{...register("street", {
										required: {
											value: false,
											message: "Please enter street.",
										},
										minLength: {
											value: 2,
											message: "Minimum length must be 2.",
										},
										maxLength: {
											value: 20,
											message: "Maximum length must be 20.",
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
									<Form.Label>Street Width</Form.Label>
									<Form.Control
										type="text"
										maxLength={10}
										placeholder="Enter Street Width"
										{...register("streetWidth", {
											// required: {
											// 	value: false,
											// 	message: "Please enter building.",
											// },
											minLength: {
												value: 2,
												message: "Minimum length must be 2.",
											},
											maxLength: {
												value: 10,
												message: "Maximum length must be 10.",
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
									<ErrorMessage message={errors?.streetWidth?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>Property Length</Form.Label>
									<Form.Control
										type="text"
										maxLength={10}
										placeholder="Enter Property Length"
										{...register("propertyLength", {
											// required: {
											// 	value: false,
											// 	message: "Please enter building.",
											// },
											minLength: {
												value: 2,
												message: "Minimum length must be 2.",
											},
											maxLength: {
												value: 10,
												message: "Maximum length must be 10.",
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
									<ErrorMessage message={errors?.propertyLength?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>Property Width</Form.Label>
									<Form.Control
										type="text"
										maxLength={10}
										placeholder="Enter Property Width"
										{...register("propertyWidth", {
											// required: {
											// 	value: false,
											// 	message: "Please enter building.",
											// },
											minLength: {
												value: 2,
												message: "Minimum length must be 2.",
											},
											maxLength: {
												value: 10,
												message: "Maximum length must be 10.",
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
									<ErrorMessage message={errors?.propertyWidth?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>Property Age</Form.Label>
									<Form.Control
										type="text"
										maxLength={10}
										placeholder="Enter Property Age"
										{...register("propertyAge", {
											minLength: {
												value: 2,
												message: "Minimum length must be 2.",
											},
											maxLength: {
												value: 10,
												message: "Maximum length must be 10.",
											},
										})}
									/>
									<ErrorMessage message={errors?.propertyAge?.message} />
								</Form.Group>
							</Col>

							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>Street Info 1</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter street info 1"
										{...register("streetInfoOne", {
											minLength: {
												value: 2,
												message: "Minimum length must be 2.",
											},
											// maxLength: {
											// 	value: 10,
											// 	message: "Maximum length must be 10.",
											// },
										})}
									/>
									<ErrorMessage message={errors?.streetInfoOne?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>Street Info 2</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter street info 2"
										{...register("streetInfoTwo", {
											minLength: {
												value: 2,
												message: "Minimum length must be 2.",
											},
											// maxLength: {
											// 	value: 10,
											// 	message: "Maximum length must be 10.",
											// },
										})}
									/>
									<ErrorMessage message={errors?.streetInfoTwo?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>Street Info 3</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter street info 3"
										{...register("streetInfoThree", {
											minLength: {
												value: 2,
												message: "Minimum length must be 2.",
											},
											// maxLength: {
											// 	value: 10,
											// 	message: "Maximum length must be 10.",
											// },
										})}
									/>
									<ErrorMessage message={errors?.streetInfoThree?.message} />
								</Form.Group>
							</Col>
							<Col lg={4} sm={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
									<Form.Label>Street Info 4</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter street info 4"
										{...register("streetInfoFour", {
											minLength: {
												value: 2,
												message: "Minimum length must be 2.",
											},
											// maxLength: {
											// 	value: 10,
											// 	message: "Maximum length must be 10.",
											// },
										})}
									/>
									<ErrorMessage message={errors?.streetInfoFour?.message} />
								</Form.Group>
							</Col>
						</>
					)}
					<Col lg={12}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
							<Form.Label>Nearest Facility</Form.Label>
							<TagsInput
								classNames={{
									input: "w-full h-9 --rti-border: bg-transparent border-2 rounded-lg border-[#DFDFDF]  ",
								}}
								value={nearestFacility}
								onChange={(item) => {
									setNearestFacility(item);
								}}
								name="nearestFacility"
								placeHolder="Please type and press enter to add more nearest facility."
							/>
						</Form.Group>
					</Col>
					<Col lg={12}>
						<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
							<Form.Label>Nearest Facility (Arabic)</Form.Label>
							<TagsInput
								classNames={{
									input: "w-full h-9 --rti-border: bg-transparent border-2 rounded-lg border-[#DFDFDF]  ",
								}}
								value={nearestFacilityAr}
								onChange={(item) => {
									setNearestFacilityAr(item);
								}}
								name="nearestFacility"
								placeHolder="Please type and press enter to add more nearest facility."
							/>
						</Form.Group>
					</Col>
				</Row>

				<hr className="my-3" />

				<div className="d-flex mt-4">
					<button onClick={() => setKey("basic_info")} className="py-2 me-3 px-4 border-green rounded text-green fw-medium fs-xs-5 d-inline-flex outline-btn">
						Go Back
					</button>
					<Button className="py-2" type="submit">
						Save & Continue
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default AddressProperty;
