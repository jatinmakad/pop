import AuthContext from "@/context/AuthContext";
import { apiGet } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import {
	bedroomCheck,
	checkObj,
	checkObjNew,
	zoomCount,
} from "@/utils/constants";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import SaleSlider from "./NewProperties/Sliders/SaleSlider";
import CustomImage from "./components/CustomImage";
import SearchForm from "./components/SearchForm";
import ManagePropertyCardNew from "./components/properties/ManagePropertyCardNew";
import ViewMapAll from "./property/ViewMapAll";
import { isEmpty } from "lodash";
import Link from "next/link";
import useToastContext from "@/hooks/useToastContext";
function Listing() {
	const { t } = useTranslation();
	const notification = useToastContext();
	const router = useRouter();
	const [showMore, setShowMore] = useState(false);
	const [showMoreLength, setShowMoreLength] = useState(0);
	const [properties, setProperties] = useState({});
	const [coordinate, setCoordinates] = useState([]);
	const [openMap, setOpenMap] = useState(false);
	const [propertiesList, setPropertiesList] = useState([]);
	const [propertyCount, setPropertyCount] = useState({});
	const { adsList, config, direction } = useContext(AuthContext);
	const [queryData, setQueryData] = useState({});
	const [filter, setFilter] = useState({
		page: 1,
		limit: 10,
		sortBy: "",
	});

	const [check, setCheck] = useState(true)

	const getData = async (obj = filter, type, queryData = queryData) => {
		let bedroom = bedroomCheck(queryData);
		try {
			const { status, data } = await apiGet(apiPath.getBuyProperties, {
				page: obj?.page || 1,
				limit: obj?.limit || filter?.limit,
				propertyCategory:
					queryData?.propertyType?.length > 0
						? queryData?.propertyType?.toString()
						: "",
				projectStatus: queryData?.status || "",
				furnished: queryData?.completeStatus || "",
				amenities:
					queryData?.amenities?.length > 0
						? queryData?.amenities?.toString()
						: "",
				bedrooms: bedroom,
				bathrooms:
					queryData?.bathroom?.length > 0
						? queryData?.bathroom?.toString()
						: "",
				priceMin: queryData?.minPrice || "",
				priceMax: queryData?.maxPrice || "",
				areaMin: queryData?.minArea || "",
				areaMax: queryData?.maxArea || "",
				keyword: queryData?.keyword || "",
				location: isEmpty(queryData?.locationSelected)
					? null
					: JSON.stringify(queryData?.locationSelected),
				sortKey: "price",
				sortType: obj?.sortBy,
			});
			if (status == 200) {
				if (data.success) {
					setProperties(data?.results);
					if (type == "add") {
						setCoordinates([
							...coordinate,
							...data?.results?.docs
								?.filter((res) => {
									return res?.location?.coordinates?.length > 0;
								})
								.map((res) => {
									return {
										lat: res?.location?.coordinates[1],
										lng: res?.location?.coordinates[0],
										property: res,
									};
								}),
						]);
						setPropertiesList([...propertiesList, ...data?.results?.docs]);
					} else {
						setCoordinates(
							data?.results?.docs
								?.filter((res) => {
									return res?.location?.coordinates?.length > 0;
								})
								.map((res) => {
									return {
										lat: res?.location?.coordinates[1],
										lng: res?.location?.coordinates[0],
										property: res,
									};
								})
						);
						setPropertiesList(data?.results?.docs);
					}
				}
			} else {
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getPropertyCount = async (queryData = queryData, type = "") => {
		let bedroom = bedroomCheck(queryData);
		try {
			const { status, data } = await apiGet(apiPath.getPropertyCount, {
				propertyCategory:
					queryData?.propertyType?.length > 0
						? queryData?.propertyType?.toString()
						: "",
				projectStatus: queryData?.status || "",
				furnished: queryData?.completeStatus || "",
				amenities:
					queryData?.amenities?.length > 0
						? queryData?.amenities?.toString()
						: "",
				bedrooms: bedroom,
				bathrooms:
					queryData?.bathroom?.length > 0
						? queryData?.bathroom?.toString()
						: "",
				priceMin: queryData?.minPrice || "",
				priceMax: queryData?.maxPrice || "",
				areaMin: queryData?.minArea || "",
				areaMax: queryData?.maxArea || "",
				keyword: queryData?.keyword || "",
				location: isEmpty(queryData?.locationSelected)
					? null
					: JSON.stringify(queryData?.locationSelected),
				type: type,
				propertyType: "buy",
			});
			if (status == 200) {
				if (data.success) {
					setPropertyCount(data?.results);
					if (data?.results?.length > 9) {
						setShowMoreLength(9);
					} else {
						setShowMoreLength(data?.results?.length);
					}
				}
			}
		} catch (error) { }
	};

	const propertyCountFunc = (item) => {
		if (
			isEmpty(queryData?.propertyType) &&
			isEmpty(queryData?.locationSelected)
		) {
			router.push({
				pathname: router?.pathname,
				query: { ...queryData, propertyType: item?._id, type: "city" },
			});
			setFilter({
				...filter,
				page: 1,
			});
		} else if (
			!isEmpty(queryData?.propertyType) &&
			isEmpty(queryData?.locationSelected)
		) {
			router.push({
				pathname: router?.pathname,
				query: {
					...queryData,
					locationSelected: JSON.stringify([
						{ key: checkObjNew[queryData?.type], value: item?.name },
					]),
					type: checkObj[queryData?.type],
				},
			});
			setFilter({
				...filter,
				page: 1,
			});
		} else if (
			isEmpty(queryData?.propertyType) &&
			!isEmpty(queryData?.locationSelected)
		) {
			router.push({
				pathname: router?.pathname,
				query: {
					...queryData,
					type: checkObj[JSON.parse(queryData?.locationSelected)[0]?.key],
					propertyType: item?._id,
				},
			});
			setFilter({
				...filter,
				page: 1,
			});
		} else if (
			!isEmpty(queryData?.propertyType) &&
			!isEmpty(queryData?.locationSelected)
		) {
			router.push({
				pathname: router?.pathname,
				query: {
					...queryData,
					locationSelected: JSON.stringify([
						{ key: queryData?.type, value: item?.name },
					]),
					type: checkObj[queryData?.type],
				},
			});
			setFilter({
				...filter,
				page: 1,
			});
		}
	};

	const handelChange = () => {
		setFilter({
			...filter,
			page: filter.page + 1,
		});
		getData({
			...filter,
			page: filter.page + 1,
		}, "add", queryData);
	};
	const [mapCondition, setMapCondition] = useState(true)
	useEffect(() => {
		getData(filter, "", router?.query);
		if (!isEmpty(router?.query)) {
			getPropertyCount(router?.query, router?.query?.type);
			setQueryData(router?.query);
		} else {
			getPropertyCount({}, "");
			setQueryData({});
		}
		if (!isEmpty(router?.query?.locationSelected)) {
			if (JSON.parse(router?.query?.locationSelected)?.length > 1) {
				setMapCondition(false)
			} else if (JSON.parse(router?.query?.locationSelected)?.length == 1) {
				if (router?.query?.type == 'building') {
					setMapCondition(false)
				}
			} else {
				setMapCondition(true)
			}
		} else {
			setMapCondition(true)
		}
	}, [router?.query]);

	// console.log(router?.query?.type == 'building','JSON.parse(router?.query?.locationSelected)')
	return (
		<>
			<div className="container inner_filter_form">
				{/* <Head>
					<title>
						{t("MADA_PROPERTIES")} : {t("BUY")}
					</title>
				</Head> */}
				<div className="filter_form_wrap px-0">
					<SearchForm setFilter={setFilter} tab={"buy"} />
				</div>
			</div>

			<div className="main_wrap">
				<div className="container">
					{queryData?.type !== "building" && propertyCount?.length > 0 && (
						<div className="inner_heading">
							<h2>
								{t("RESIDENTIAL_PROPERTIES")}{" "}
								<span className="text-green">{config?.country == 'UAE' ? t("UAE_PAGE") : t("SAUDI_PAGE")}</span>
							</h2>
						</div>
					)}
					<div className="filterLink d-md-flex">
						{queryData?.type !== "building" && propertyCount?.length > 0 && (
							<div className="linkOuter">
								{propertyCount?.length > 0 &&
									propertyCount.slice(0, showMoreLength)?.map((item, index) => {
										return (
											<a
												key={index}
												href="javascript:void(0)"
												onClick={() => propertyCountFunc(item)}
											>
												{item?.[`name${direction?.langKey || ''}`]} ({item?.count})
											</a>
										);
									})}
							</div>
						)}

						{propertyCount?.length > 9 && (
							<div className="viewAll ms-auto">
								<Dropdown>
									<Dropdown.Toggle
										variant="success"
										onClick={() => {
											if (showMore) {
												setShowMore(false);
												setShowMoreLength(9);
											} else {
												setShowMore(true);
												setShowMoreLength(propertyCount?.length);
											}
										}}
										id="dropdown-basic"
										className="bg-transparent border-0 text-primary p-0 mt-2 mt-md-0"
									>
										{showMore ? t("SHOW_LESS") : t("VIEW_ALL")}
									</Dropdown.Toggle>
								</Dropdown>
							</div>
						)}
					</div>
				</div>

				{isEmpty(queryData) && (
					<section className="properties_for_rent py-4 py-md-5">
						<Container>
							<div className="inner_heading">
								<h2>
									{t("EXCLUSIVE_PROPERTY")}&nbsp;
									<span className="text-green">{t("SALE")}</span>
								</h2>
								<p>{t("FIND_HOMES_FIRST")}</p>
							</div>
							<SaleSlider setCheck={setCheck} type={"buy"} />
						</Container>
					</section>
				)}
				<section className="serach_result">
					<Container>
						<div className="inner_heading">
							<h2>
								{t("SEARCH_RESULT_FOR")}{" "}
								<span className="text-green ">{config?.country}</span>
							</h2>
							<p className="fw-normal">
								{properties?.totalDocs || 0} {t("RESULTS")}
							</p>
						</div>

						<Row>
							<Col xl={9} className={!isEmpty(adsList) && adsList?.display?.includes("buy") ? '' : "without_sidebar"}>
								<div
									className={`d-flex ${propertiesList?.length > 0
										? "justify-content-between"
										: "justify-content-end"
										} flex-wrap align-itmes-center mb-3`}
								>
									{propertiesList?.length > 0 && (
										<Button
											onClick={() => {
												if (!mapCondition) {
													if (router?.query?.type == 'building') {
														notification.error(t('LIMIT_FOR_PROPERTY_BUILDING'))
													} else {
														notification.error(t('LIMIT_FOR_PROPERTY'))
													}
												} else {
													router.push(
														{ pathname: `/map-search`, query: { ...router?.query, pageName: 'buy' } }
													)
												}
											}}
											className="bg-white border d-flex align-items-center p-2 rounded text-dark fs-6"
										>
											<CustomImage
												width={16}
												height={18}
												src="./images/location_black.svg"
												className="me-2"
												alt=""
											/>
											{t("MAP_VIEW")}
										</Button>
									)}

									<Form className="d-flex align-items-center">
										<label
											htmlFor=""
											className="me-2 fs-6"
											style={{ whiteSpace: "nowrap" }}
										// style={{ width: "120px" }}
										>
											{t("SORT_BY")}
										</label>
										<select
											value={filter?.sortBy}
											onChange={(e) => {
												let obj = {
													...filter,
													sortBy: e.target.value,
													page: 1
												};
												setFilter(obj);
												getData(obj, "", queryData);
											}}
											className="short_by form-control fs-6"
										>
											<option value="">{t("NEWEST")}</option>
											<option value="asc">{t("PRICE_ASC")}</option>
											<option value="desc">{t("PRICE_DESC")}</option>
										</select>
									</Form>
								</div>
								<div className="result">
									{propertiesList?.length > 0 &&
										propertiesList?.map((item, index) => {
											return <ManagePropertyCardNew key={index} item={item} type="" showLike={true} showEmail={true} showWhatsApp={true} />;
										})}
									{propertiesList?.length == 0 && (
										<h2 className="w-100 d-flex justify-content-center">
											<CustomImage src="/images/no_property.png" className={"img-no-property"} width={1000} height={500} />
										</h2>
									)}
									{properties?.totalPages !== properties?.page && (
										<div className="text-center loadMore mt-4 mt-md-5 mb-5 mb-xl-0">
											<Button onClick={() => handelChange()} className="border-green rounded text-green fw-medium fs-5 text-white">
												{t("LOAD_MORE")}
											</Button>
										</div>
									)}
								</div>
							</Col>
							{!isEmpty(adsList) && adsList?.display?.includes("buy") && (
								<Col xl={3} className="text-center add_banner_right_cols">
									<a target="_blank" href={adsList?.redirectLink}>
										<img src={adsList?.bannerImage} alt="image" />
									</a>
								</Col>
							)}
						</Row>
					</Container>
				</section>
			</div>
			{openMap && coordinate?.length > 0 && (
				<ViewMapAll
					openMap={openMap}
					setOpenMap={setOpenMap}
					location={coordinate}
					hasNextPage={properties?.hasNextPage}
					onZoomChange={(e) => {
						if (properties?.nextPage == zoomCount[e]) {
							setFilter({
								...filter,
								page: zoomCount[e],
							});
						}
					}}
				/>
			)}
		</>
	);
}

export default Listing;
