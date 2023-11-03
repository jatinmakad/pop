import React, { useContext, useEffect, useState } from "react";
import { Tabs, Tab, ProgressBar, Container, Breadcrumb, Col, Row, Button } from "react-bootstrap";
import BasicInfo from "./components/addProperty/basicInfo";
import AddressProperty from "./components/addProperty/addressProperty";
import UploadPropertyPhotos from "./components/addProperty/uploadPropertyPhotos";
import UploadDocuments from "./components/addProperty/uploadDocuments";
import { isEmpty, pick, result } from "lodash";
import { apiGet, apiPost } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import { apiPut } from "@/utils/apiFetch";
import Link from "next/link";
import AuthContext from "@/context/AuthContext";
import Head from "next/head";
import { useTranslation } from "react-i18next";

function Auction() {
	const { t } = useTranslation();
	const [key, setKey] = useState("basic_info");
	const notification = useToastContext();
	let { user, subscription } = useContext(AuthContext);
	const router = useRouter();
	const [slug, setSlug] = useState("");
	const [editProperty, setEditProperty] = useState({});
	const [propertyId, setPropertyId] = useState("");
	const [agentList, setAgentList] = useState([]);

	const onSubmit = async (body) => {
		let CompanyObj = [
			"title",
			"titleAr",
			"propertyType",
			"propertyCategory",
			"bedrooms",
			"priceType",
			"bathrooms",
			"guestRooms",
			"livingRooms",
			"totalFloors",
			"floorNumber",
			"amenities",
			"advertType",
			"advertTypeAr",
			"description",
			"descriptionAr",
			"price",
			"amenities",
			"permitNumber",
			"agentId",
			"stage",
			"readyStage",
			"furnished",
			"projectStatus",
			"financialStatus",
			"parkingType",
			"parking",
			"bua",
			"cheques",
			"layoutType",
			"layoutTypeAr",
			"pricePerUnit",
			"propertySize",
			"securityDeposit",
			"serviceCharge",
			"priceYearly",
			"priceMonthly",
			"priceWeekly",
			"priceDaily",
		];
		let AgentObj = [
			"title",
			"titleAr",
			"propertyType",
			"propertyCategory",
			"bedrooms",
			"bathrooms",
			"guestRooms",
			"livingRooms",
			"totalFloors",
			"floorNumber",
			"permitNumber",
			"amenities",
			"advertType",
			"advertTypeAr",
			"description",
			"descriptionAr",
			"price",
			"amenities",
			"stage",
			"priceType",
			"readyStage",
			"furnished",
			"projectStatus",
			"financialStatus",
			"parkingType",
			"parking",
			"bua",
			"cheques",
			"layoutType",
			"layoutTypeAr",
			"pricePerUnit",
			"propertySize",
			"securityDeposit",
			"serviceCharge",
			"priceYearly",
			"priceMonthly",
			"priceWeekly",
			"priceDaily",
		];

		const obj = pick(body, user?.role === "company" ? CompanyObj : AgentObj);
		if (isEmpty(editProperty) && slug == "") {
			const { status, data } = await apiPost(apiPath.addCompanyProperty, obj);
			if (status === 200) {
				if (data.success) {
					setPropertyId(data?.results?._id);
					getPropertyData(data?.results?.slug);
					setKey("address");
				} else {
					notification.error(data?.message);
				}
			} else {
				notification.error(data?.message);
			}
		} else {
			const { status, data } = await apiPut(`${apiPath.addCompanyProperty}/${editProperty?._id}`, obj);
			if (status === 200) {
				if (data.success) {
					setPropertyId(data?.results?._id);
					getPropertyData(data?.results?.slug);
					setKey("address");
				} else {
					notification.error(data?.message);
				}
			} else {
				notification.error(data?.message);
			}
		}
	};

	const getAgentList = async () => {
		try {
			const payload = {};
			const path = apiPath.getCompanyAgentList;
			const result = await apiGet(path, payload);
			const records = result?.data?.results;
			const updateRecord = records?.map((res) => {
				return {
					value: res?._id,
					label: `${res?.firstName} ${res?.lastName} (+${res?.countryCode} ${res?.mobile})`,
				};
			});
			setAgentList(updateRecord);
		} catch (error) {
			console.error("error in get all users list==>>>>", error.message);
		}
	};

	const getPropertyData = async (id) => {
		try {
			const { status, data } = await apiGet(apiPath.getPropertyDetailsCompanyNew + id);
			if (status == 200) {
				if (data.success) {
					setEditProperty(data?.results);
					setPropertyId(data?.results?._id);
				} else {
					if (data?.message == 'Unauthorized Property.') {
						router?.push('/manage-properties')
					}
				}
			} else {
			}
		} catch (error) { }
	};

	const getSubscription = async () => {
		const { status, data } = await apiGet(apiPath.activeSubscription);
		if (status === 200) {
			if (data.success) {
				if (isEmpty(data?.results)) {
					notification.error(`You have to buy subscription from Home Page to add property.`);
					router.push("/manage-properties");
				}
			}
		} else {
			notification.error(`You have to buy subscription from Home Page to add property.`);
			router.push("/manage-properties");
		}
	};
	useEffect(() => {
		getSubscription();
	}, [subscription]);

	useEffect(() => {
		if (router?.query?.slug !== undefined) {
			getPropertyData(router?.query?.slug);
			setSlug(router?.query?.slug);
		}
	}, [router?.query?.slug]);

	useEffect(() => {
		window.scrollTo(0, 0);
		getAgentList();
	}, []);

	console.log(editProperty, '==========')
	// !isEmpty(editProperty?.cityId) && !isEmpty(editProperty?.communityId)
	return (
		<div className="main_wrap">
			<Head>
				<title>Mada Properties : {!isEmpty(editProperty) && slug !== "" ? t("EDIT_PROPERTY") : t("ADD_PROPERTY")}</title>
			</Head>
			<div className="breadcrum_Main pt-0">
				<Container>
					<Breadcrumb>
						<Breadcrumb.Item href="#">
							<Link href="/">{t("HOME")}</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item href="#">
							<Link href="/manage-properties">{t("MANAGE_PROPERTY")}</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>{!isEmpty(editProperty) && slug !== "" ? t("EDIT_PROPERTY") : t("ADD_PROPERTY")}</Breadcrumb.Item>
					</Breadcrumb>
				</Container>
			</div>
			<section className="serach_result">
				<Container>
					<Row>
						<Col xl={9} className="">
							<div className="bg-white p-3 p-sm-4 mb-3 rounded">
								<div className="inner_heading mb-2 mb-md-3 d-flex justify-content-between align-items-center">
									<h2>{t("UPLOAD_LISTING")} </h2>
									{agentList?.length === 0 && user?.role == "company" && (
										<span style={{ color: "red" }}>
											{t("PLEASE_ADD_AT_LEAST_1_AGENT_TO_ADD_PROPERTY")}{" "}
											{!isEmpty(user) && user?.role === "company" && (
												<button className="btn">
													<Link href="/myAgents?type=add">+ {t("ADD_AGENT")}</Link>
												</button>
											)}
										</span>
									)}
								</div>
								<div className="filter_form_wrap theme_lg_tabs p-0">
									<Tabs
										defaultActiveKey="photos"
										id="justify-tab-example"
										className="mb-3"
										activeKey={key}
										onSelect={(e) => {
											setKey(e);
											window.scrollTo(0, 0);
											if (!isEmpty(editProperty)) {
												getPropertyData(editProperty?.slug);
											}
										}}
										justify
									>
										<Tab eventKey="basic_info" title={t("BASIC_INFO")}>
											<BasicInfo editProperty={editProperty} onSubmit={onSubmit} user={user} key={key} getPropertyData={getPropertyData} setAgentList={setAgentList} agentList={agentList} />
										</Tab>
										<Tab eventKey="address" disabled={propertyId && editProperty?.completenessPercentage >= 25 ? false : true} title={t("ADDRESSES")}>
											<AddressProperty propertyId={propertyId} setKey={setKey} key={key} getPropertyData={getPropertyData} editProperty={editProperty} />
										</Tab>
										<Tab eventKey="photos" disabled={(!isEmpty(editProperty?.cityId) && !isEmpty(editProperty?.communityId) && editProperty?.completenessPercentage >= 50) ? false : true} title={t("PHOTOS")}>
											<UploadPropertyPhotos propertyId={propertyId} setKey={setKey} key={key} editProperty={editProperty} getPropertyData={getPropertyData} />
										</Tab>
										<Tab eventKey="upload_documents" disabled={(propertyId && editProperty?.photos?.length >= 6) ? false : true} title={t("UPLOAD_DOCUMENTS")}>
											<UploadDocuments propertyId={propertyId} editProperty={editProperty} setKey={setKey} key={key} slug={slug} />
										</Tab>
									</Tabs>
								</div>
							</div>
						</Col>
						<Col xl={3} className="text-center">
							<div className="bg-white p-3 p-sm-4 p-lg-3 mb-3 rounded">
								<div className="inner_heading mb-2 mb-md-3 text-start">
									<h2 className="fs-4">{t("LISTING_COMPLETENESS")}</h2>
									<hr />
								</div>

								<div className="progress_block">
									<strong>{editProperty?.completenessPercentage || 0}%</strong>
									<ProgressBar now={editProperty?.completenessPercentage || 0} />
								</div>
							</div>
							{/* <img src="/images/advertisement.jpg" alt="" /> */}
						</Col>
					</Row>
				</Container>
			</section>
		</div>
	);
}
export default Auction;
