import AuthContext from "@/context/AuthContext";
import useToastContext from "@/hooks/useToastContext";
import { apiDelete, apiPost } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import Helpers from "@/utils/helpers";
import classNames from "classnames";
import dayjs from "dayjs";
import { get as __get, compact, isEmpty, isNumber, startCase } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { numify } from "numify";
import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import CustomImage from "../CustomImage";
import EmailDialogbox from "../EmailDialogbox";
import ReactShare from "../ReactShare";
import DialogBox from "../dialogBox";
import PlaceBid from "./PlaceBid";
import ReportProperty from "./ReportProperty";
import RejectReason from "./RejectReason";

var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);

const ManagePropertyCardNew = ({
	item,
	type,
	setOpenDelete,
	setOpenMark,
	setPropertyId,
	agentData,
	actionType,
	getData,
	obj,
	showLike,
	showEmail,
	showWhatsApp,
	showAgent,
	id,
	approvedStatus,
	afterSubmit
}) => {
	const [statusPlaceBid, setStatusPlaceBid] = useState(false);
	const router = useRouter();
	const [bidData, setBidData] = useState();
	const [openReport, setOpenReport] = useState(false);
	const { config, user, direction } = useContext(AuthContext);
	const [images, setImages] = useState([]);
	const notifications = useToastContext();
	const [open, setOpen] = useState(false);
	const notification = useToastContext();
	const [withdrawBidOpen, setWithdrawBidOpen] = useState(false);
	const { t } = useTranslation();
	const [reasonOpen, setReasonOpen] = useState(false)
	const [rejectReason, setRejectReason] = useState('')
	const auctionStatus = {
		live_auction: t("LIVE_AUCTION"),
		upcoming: t("UPCOMING"),
		closed: t("CLOSED"),
	};

	const [email, setEmail] = useState(false);
	const [withDrawId, setWithDrawId] = useState("");
	// const [addressView] = useState(
	//   compact([
	//     item?.unitNumber,
	//     item?.building,
	//     item?.street,
	//     item?.subCommunity,
	//     item?.community,
	//     item?.city,
	//   ]) || []
	// );

	const GetAuctionData = ({ auctionProperty = {}, type }) => {
		const auctionStartDateTime = dayjs(auctionProperty.auctionStartDateTime);
		const auctionEndDateTime = dayjs(auctionProperty.auctionEndDateTime);
		const currentDate = dayjs();
		let status = null;

		if (auctionProperty?.auctionStatus == 'ended') {
			status = "closed";
		} else if (
			dayjs(currentDate).isBetween(auctionStartDateTime, auctionEndDateTime) && auctionProperty?.auctionStatus == 'active'
		) {
			status = "live_auction";
		} else if (dayjs(currentDate).isSameOrBefore(auctionStartDateTime) && auctionProperty?.auctionStatus == 'active') {
			status = "upcoming";
		} else if (dayjs(currentDate).isSameOrAfter(auctionEndDateTime)) {
			status = "closed";
		}

		if (type == "status") {
			return (
				<div>
					<span
						className={classNames("apartment px-2 py-1", {
							bg_red: status === "live_auction",
							"bg-green": status === "upcoming",
							"bg-dark": status === "closed",
						})}
					>
						{auctionStatus[status]}
					</span>
				</div>
			);
		} else if (type == "bidButton") {
			if (status === "live_auction") {
				return (
					<button
						className="theme_btn btn ms-sm-2"
						disabled={item?.userBidCount == 1 ? true : false}
						onClick={() => handlePlaceBid(auctionProperty)}
					>
						{t("PLACE_BID")}
					</button>
				);
			}
		}
	};

	const handlePlaceBid = (data) => {
		if (user?.loginType === "social" && !user?.mobile) {
			notification.error("Please update mobile number before placing a bid.");
			router.push("/profile");
		} else if (!isEmpty(user)) {
			setStatusPlaceBid(!statusPlaceBid);
			setBidData(data);
		} else {
			notification.error("Please login to make bid");
		}
	};

	const handleBidModelClick = () => {
		setStatusPlaceBid(!statusPlaceBid);
	};

	const [isLiked, setIsLiked] = useState(
		item?.wishlistCount == 0 ? false : true
	);
	const [shareButton, setShareButton] = useState(false);
	const [shareButtonLink, setShareButtonLink] = useState("");
	const shareFunction = (link) => {
		setShareButtonLink(link);
		setShareButton(true);
	};
	const handleLikeUnlike = async (id, e) => {
		if (!isEmpty(user)) {
			if (user.role === "user") {
				if (!isLiked) {
					try {
						const { status, data } = await apiPost(apiPath.addWishlistUser, {
							propertyId: id,
						});
						if (status == 200) {
							if (data.success) {
								notification.success(data?.message);
								setIsLiked(true);
							} else {
								notification.error(data?.message);
							}
						} else {
							notification.error(data?.message);
						}
					} catch (error) {
						notification.error(error?.message);
					}
				} else if (isLiked) {
					try {
						const { status, data } = await apiDelete(
							`${apiPath.removeWishlistUser}?propertyId=${id}`
						);
						if (status == 200) {
							if (data.success) {
								if (type === "wishlist") {
									getData();
								} else {
									setIsLiked(false);
								}
								notification.success(data?.message);
							} else {
								notification.error(data?.message);
							}
						} else {
							notification.error(data?.message);
						}
					} catch (error) {
						notification.error(error?.message);
					}
				}
			} else {
				notification.error("Only user can add property to wishlist");
			}
		} else {
			notification.error("Please login to add into wishlist");
		}
	};

	const priceFormat = (item) => {
		if (isNumber(item?.priceDaily) && item?.priceDaily > 0) {
			return t("/DAY");
		} else if (isNumber(item?.priceWeekly) && item?.priceWeekly > 0) {
			return t("/WEEK");
		} else if (isNumber(item?.priceMonthly) && item?.priceMonthly > 0) {
			return t("/MONTH");
		} else if (isNumber(item?.priceYearly) && item?.priceYearly > 0) {
			return t("/YEAR");
		} else {
			return "";
		}
	};

	const priceFormatType = (item) => {
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
	};

	const Withdraw = async () => {
		try {
			const { status, data } = await apiDelete(
				`${apiPath.withdrawBid}${withDrawId}`
			);
			if (status == 200) {
				if (data.success) {
					getData();
					setWithdrawBidOpen(false);
					setWithDrawId("");
					notification.success(data?.message);
				} else {
					notification.error(data?.message);
				}
			} else {
				notification.error(data?.message);
			}
		} catch (error) {
			notification.error(error?.message);
		}
	};

	const getLive = (auctionProperty = {}) => {
		const auctionStartDateTime = dayjs(auctionProperty.auctionStartDateTime);
		const auctionEndDateTime = dayjs(auctionProperty.auctionEndDateTime);
		const currentDate = dayjs();
		let status = false;
		if (dayjs(currentDate).isBetween(auctionStartDateTime, auctionEndDateTime)) status = true;
		return status;
	};

	const getClose = (auctionProperty = {}) => {
		const auctionStartDateTime = dayjs(auctionProperty.auctionStartDateTime);
		const auctionEndDateTime = dayjs(auctionProperty.auctionEndDateTime);
		const currentDate = dayjs();
		let status = false;
		if (dayjs(currentDate).isSameOrAfter(auctionEndDateTime)) status = true;
		return status;
	};

	return (
		<div className="propertie_card_listView">
			<Link href={`/property/${item?.slug}`}>
				<div className="d-md-flex">
					<figure
						className="position-relative"
						style={{ cursor: "pointer" }}
					// onClick={() => {
					// 	if (item?.photos?.length > 0) {
					// 		setOpen(true);
					// 		setImages(
					// 			item?.photos?.map((res) => {
					// 				return {
					// 					src: res,
					// 					width: 3840,
					// 					height: 2560,
					// 				};
					// 			})
					// 		);
					// 	}
					// }}
					>
						<div className="property-img">
							<CustomImage width={100} height={100} className="w-100 h-100" src={item?.photos?.length > 0 ? item?.photos[0] : ""} alt="profilePic" />
						</div>
						<span className="img_count">
							<img src="/images/img.svg" />
							{item?.photos?.length}
						</span>
					</figure>
					<figcaption>
						<div className="propertie_detail_first bg-white h-auto">
							<div className="price_tag mb-3">
								{actionType == "auction" ? (
									<GetAuctionData auctionProperty={item} type="status" />
								) : (
									<strong className="price truncate">
										{Helpers?.priceFormat(priceFormatType(item))} {config?.currency}{" "}
										{(item?.propertyType?.slug == "rent" || item?.propertyType?.slug == "commercial-rent") && <small>{priceFormat(item)}</small>}
									</strong>
								)}
								<div>
									{item?.propertyCategory[`name${direction?.langKey || ""}`] && <span className="apartment px-1 py-1 me-2">{item?.propertyCategory[`name${direction?.langKey || ""}`]}</span>}
									{actionType === "auction" ? null : approvedStatus ? (
										<span className={item?.isApprovedStatus == "rejected" ? "apartment px-1 py-1 bg-danger" : "apartment px-1 py-1 bg-success"}>{startCase(item?.isApprovedStatus)}</span>
									) : null}
								</div>
							</div>
							{/* <Link href={`/property/${item?.slug}`}> */}
							<div className="d-flex justify-content-between align-items-center mb-2">
								<h4 className="fs-5 fw-medium text-dark d-block text-decoration-none mb-2 ellipsis_text">
									{item[`title${direction?.langKey || ""}`]}
									{/* {item?.title} */}
								</h4>
							</div>
							{/* </Link> */}
							<div className="properties_location d-flex align-items-start multiple-text-truncate">
								<CustomImage width={18} height={20} src="/images/location.svg" className="me-2" />
								<span className="multiple-text-truncate" title={compact([item?.building, item?.street, item?.subCommunity, item?.community, item?.city]).join(", ")}>
									{compact([item?.building, item?.street, item?.subCommunity, item?.community, item?.city]).join(", ")}
								</span>
							</div>

							<div className="social_achiv_left text_light_gray d-flex align-items-center mt-3 fs-7">
								<span className="d-flex align-items-center pe-3 border-end">
									<CustomImage width={16} height={16} src="/images/watch.png" className="me-2" />
									{type == "auctionProfile" ? (
										<>{Helpers?.remainingTimeFromNow(obj?.createdAt, { language: direction?.langKey })}</>
									) : (
										<>{Helpers?.remainingTimeFromNow(item?.listedOn, { language: direction?.langKey })}</>
									)}
								</span>
								<span className="pe-3 border-end view-padding">
									{numify(item?.view || 0)} {t("VIEWS")}
								</span>
								<span className="view-padding">
									{"propertyType" in item && item?.propertyType[`name${direction?.langKey || ""}`]}
									{/* {item?.propertyType?.name} */}
								</span>
							</div>
						</div>

						<ul className="pro_feature d-flex align-items-center bg-light py-3 px-sm-2">
							{item?.propertySize > 0 && !isEmpty(item?.propertySize) ?
								<li className="d-flex align-items-center fs-7 fw-medium px-2  me-md-3">
									<CustomImage width={16} height={16} src="/images/sqft.svg" className="me-2" />
									{item?.propertySize} {config?.areaUnit}
								</li> : <li className="d-flex align-items-center fs-7 fw-medium px-2  me-md-3">
									<CustomImage width={16} height={16} src="/images/area-black.svg" className="me-2" />
									{item?.bua}  {config?.areaUnit}
								</li>}
							{item?.bedrooms !== null &&
								<li className="d-flex align-items-center fs-7 fw-medium px-2 me-md-3">
									<CustomImage width={24} height={15} src="/images/bedroom.svg" className="me-2" />
									{item?.bedrooms == 0 ? "Studio" : item?.bedrooms > 7 ? "7+" : item?.bedrooms} {item?.bedrooms == 0 ? '' : t("BEDROOMS")}
								</li>}
							{item?.bathrooms !== null &&
								<li className="d-flex align-items-center fs-7 fw-medium px-2">
									<CustomImage width={16} height={16} src="/images/bathroom.svg" className="me-2" />
									{item?.bathrooms > 7 ? "7+" : item?.bathrooms} {t("BATHROOM")}
								</li>}
						</ul>
					</figcaption>
				</div>
			</Link>
			{type === "auctionProfile" && (
				<div className="border-top  d-flex align-items-center p-2 bg-white justify-content-around">
					<p className="mb-0 fs-7">
						{t("BID_ID")}
						<span className="fw-medium p-1">{obj?.bidId}</span>
					</p>
					<p className="mb-0 fs-7">
						{t("BID_PRICE")}
						<span className="fw-medium p-1">{obj?.bidPrice}</span>
					</p>
					<p className="mb-0 fs-7">
						{t("BIDDING_FEES")}
						<span className="fw-medium p-1">{obj?.biddingFees}</span>
					</p>
					<p className="mb-0 fs-7">
						{t("PAYMENT_STATUS")}
						<span className="fw-medium p-1">{startCase(obj?.paymentStatus)}</span>
					</p>
					<p className="mb-0 fs-7">
						{t("O_STATUS")}
						<span className="fw-medium p-1">{startCase(obj?.status)}</span>
					</p>
				</div>
			)}

			{type === "propertyApproval" && item?.isApprovedStatus === "rejected" ? (
				<div className="social_achiv border-top  d-flex align-items-center p-2 bg-white justify-content-between">
					<p className="mb-0 fs-7">
						{t("REJECTED_DATE")}{" "}
						{Helpers?.dateFormat(item?.actionDate, "D MMM , YYYY | h:mm A", {
							language: direction?.langKey,
						})}
					</p>
					<div className="d-flex">
						{/* <Button variant="danger" className="me-2">
							{t("REJECTED")}
						</Button> */}
						<Link
							href={{
								pathname: "/addNewProperty",
								query: { slug: item?.slug },
							}}
							className="btn_link d-flex align-items-center bg-green text-white mx-2 mx-sm-3"
						>
							<CustomImage
								width={18}
								height={18}
								src="/images/edit.svg"
								className="me-sm-2"
							/>{" "}
							{t("EDIT")}
						</Link>
						{!isEmpty(item?.rejectReason) &&
							<img style={{ cursor: "pointer", width: "30px" }} onClick={() => { setReasonOpen(true); setRejectReason(item?.rejectReason) }} src={'/images/icons8-info.svg'} />}
					</div>
				</div>
			) : actionType == "auction" ? (
				<div className="social_achiv auction_property border-top  d-flex align-items-center ps-3 bg-white justify-content-between">
					<h4 className="price">
						<span className="fs-6 text-dark fw-normal">
							{" "}
							{t("STARTING_BID")}
						</span>{" "}
						<strong className="price">
							{Helpers?.priceFormat(priceFormatType(item))} {config?.currency}{" "}
							{(item?.propertyType?.slug == "rent" ||
								item?.propertyType?.slug == "commercial-rent") && (
									<small>{priceFormat(item)}</small>
								)}
						</strong>
					</h4>
					{getLive(item) ? (
						<p className="mb-0 fs-7 pe-sm-4 auction-wrap">
							{t("AUCTION_END_DATE")}{" "}
							<span className="fw-medium">
								{Helpers.dateFormat(
									item?.auctionEndDateTime,
									"D MMM , YYYY | h:mm A",
									{ language: direction?.langKey }
								)}
							</span>
							<GetAuctionData auctionProperty={item} type="bidButton" />
						</p>
					) : (
						<>
							{getClose(item) ? (
								""
							) : (
								<p className="mb-0 fs-7 pe-sm-4">
									{t("AUCTION_START_DATE")}{" "}
									<span className="fw-medium">
										{Helpers.dateFormat(
											item?.auctionStartDateTime,
											"YYYY-MM-DD | h:mm A",
											{ language: direction?.langKey }
										)}
									</span>
								</p>
							)}
						</>
					)}
					<div className="social_achiv_left  d-flex align-items-center">
						<button
							href="javascript:void(0)"
							onClick={() => {
								shareFunction(
									window?.location?.origin + "/property/" + item?.slug
								);
							}}
							className="p-sm-3 py-3 px-2 border-start bg-transparent border-0"
						>
							<img src="/images/share.svg" />
						</button>
						{(isEmpty(user) || user?.role === "user") && !item?.forAuction && (
							<button
								onClick={() => {
									if (!isEmpty(user) && user?.role === "user") {
										setOpenReport(true);
									} else {
										notification?.error("Please login to report this property");
									}
								}}
								className="p-md-3 py-3 px-2 border-start bg-transparent border-0"
							>
								<img src="/images/report.svg" />
							</button>
						)}
					</div>
				</div>
			) : (
				<div
					className={classNames(
						"social_achiv border-top  d-flex align-items-center ps-3 bg-white justify-content-between",
						{ "justify-content-end": showAgent === "no" }
					)}
				>
					{!["agent"].includes(type) && showAgent != "no" ? (
						<div className="user fw-medium text-dark fs-7 d-flex align-items-center">
							{(!isEmpty(item?.agent) && !isEmpty(item?.agent?.firstName)) && (
								<CustomImage
									className={"user-img user-img-updated me-2"}
									src={item?.agent?.profilePic || ""}
									width={100}
									height={100}
								/>
							)}
							<Link
								className="text-dark"
								style={{ pointerEvents: user?.role === 'agent' ? "none" : "" }}
								href={user?.role === 'agent' ? '' : `/agents/${__get(item, "agent.slug") || ""}`}
							>{`${__get(item, "agent.firstName") || ""} ${__get(item, "agent.lastName") || ""
								}`}</Link>
						</div>
					) : null}
					{type == "manage-properties" &&
						item?.isApprovedStatus === "accepted" && (
							<div className="social_achiv d-flex align-items-center p-2 bg-white justify-content-between">
								<p className="mb-0 fs-7">
									Accepted Date :{" "}
									{Helpers?.dateFormat(
										item?.listedOn,
										"D MMM , YYYY | h:mm A",
										{ language: direction?.langKey }
									)}
								</p>
							</div>
						)}
					<div className="social_achiv_left  d-flex align-items-center justify-content-end">
						{["company", "agent"].includes(user?.role) &&
							(!["report", "agent"].includes(type) ? (
								<div className="d-flex">
									{type !== "propertyApproval" && type !== 'company' &&
										item?.isApprovedStatus == "accepted" && (
											<Button
												disabled={item?.isSold != true ? false : true}
												onClick={() => {
													setPropertyId(item._id);
													setOpenMark(true);
												}}
												variant="danger"
												className="me-2"
											>
												{item?.isSold != true ? t("MARK_SOLD") : t("SOLD")}
											</Button>
										)}
									{!item?.isSold && type !== 'company' && (
										<>
											<Link
												href={{
													pathname: "/addNewProperty",
													query: { slug: item?.slug },
												}}
												className="btn_link d-flex align-items-center bg-green text-white mx-2 mx-sm-3"
											>
												<CustomImage
													width={18}
													height={18}
													src="/images/edit.svg"
													className="me-sm-2"
												/>{" "}
												{t("EDIT")}
											</Link>
											{user?.role == "company" && (
												<Button
													onClick={() => {
														setOpenDelete(true);
														setPropertyId(item._id);
													}}
													variant="danger"
													className="me-2"
												>
													{t("DELETE")}
												</Button>
											)}
										</>
									)}
								</div>
							) : null)}
						{/* {['company', 'agent'].includes(user?.role) ? "" : !['agent'].includes(type) ? ( */}
						<>
							{showLike && (
								!isEmpty(item?.agent?.firstName) &&
								<a
									onClick={() => {
										if (isEmpty(user)) {
											notifications.success("Please login to contact agent.");
										}
									}}
									href={
										isEmpty(user)
											? "javascript:void(0)"
											: `tel:${item?.agent?.countryCode + item?.agent?.mobile}`
									}
									className="btn_link  d-flex align-items-center bg-green text-white call_tag"
								>
									<img src="/images/call.svg" className="me-sm-2" /> {t("CALL")}
								</a>
							)}
							{showEmail && (
								!isEmpty(item?.agent?.firstName) &&
								<a
									href="javascript:void(0)"
									onClick={() => {
										if (!isEmpty(user)) {
											setEmail(true);
										} else {
											notifications.success(
												"Please login to enquiry this property."
											);
										}
									}}
									className="btn_link d-flex align-items-center bg-green text-white ms-2 ms-sm-3 email_tag"
								>
									<img src="/images/mail.svg" className="me-sm-2" />{" "}
									{t("EMAIL")}
								</a>
							)}

							{showWhatsApp && (
								!isEmpty(item?.agent?.firstName) &&
								<div>
									<Link
										target="_blank"
										onClick={() => {
											if (isEmpty(user)) {
												notifications.success("Please login to message agent.");
											}
										}}
										href={
											isEmpty(user)
												? "javascript:void(0)"
												: `https://api.whatsapp.com/send/?phone=${item?.agent?.countryCode}${item?.agent?.mobile}&text&type=phone_number&app_absent=0`
										}
										className="mx-sm-3 mx-2 d-flex align-items-center border-start"
									>
										<img src="/images/whatsapp.svg" />
									</Link>
								</div>
							)}
						</>
						{type == "auctionProfile" && (
							(item?.auctionStatus == 'active' && getLive(item)) &&
							<button
								onClick={() => {
									setWithDrawId(id);
									setWithdrawBidOpen(true);
											}}
								disabled={ obj?.paymentStatus !== 'Paid' }
								className="btn_link d-flex align-items-center bg-green text-white me-2 ms-sm-3 border-0 px-3"
							>
								{t("WITHDRAW_BID")}
							</button>
						)}

						<button
							onClick={() => {
								shareFunction(
									window?.location?.origin + "/property/" + item?.slug
								);
							}}
							className="p-md-3 py-3 px-2 border-start bg-transparent border-0"
						>
							<img src="/images/share.svg" />
						</button>
						{(isEmpty(user) || user?.role === "user") && (
							<button
								onClick={() => {
									if (!isEmpty(user) && user?.role === "user") {
										setOpenReport(true);
									} else {
										notification?.error("Please login to report this property");
									}
								}}
								className="p-md-3 py-3 px-2 border-start bg-transparent border-0"
							>
								<img src="/images/report.svg" />
							</button>
						)}
						{(user?.role == "user" || isEmpty(user)) &&
							type !== "auctionProfile" && (
								<button
									onClick={handleLikeUnlike.bind(this, item?._id)}
									className={classNames(
										"p-md-3 py-3 px-2 border-start border-0 bg-transparent",
										{ "like-img": isLiked }
									)}
								>
									<CustomImage
										width={22}
										height={20}
										src={isLiked ? "/images/heart.png" : "/images/like.svg"}
										alt="No_image"
									/>
								</button>
							)}
					</div>
				</div>
			)}
			{statusPlaceBid && (
				<PlaceBid
					handleBidModelClick={handleBidModelClick}
					handlePlaceBid={handlePlaceBid}
					bidData={bidData}
					item={item}
					afterSubmit={afterSubmit}
				/>
			)}
			{openReport && (
				<ReportProperty
					open={openReport}
					onClose={() => setOpenReport(false)}
					id={item?._id}
				/>
			)}
			{shareButton && (
				<ReactShare
					shareButton={shareButton}
					setShareButton={setShareButton}
					link={shareButtonLink}
				/>
			)}
			{open && (
				<Lightbox
					open={open}
					plugins={[Thumbnails]}
					close={() => setOpen(false)}
					slides={images}
				/>
			)}
			{withdrawBidOpen && (
				<DialogBox
					handleClose={() => {
						setWithdrawBidOpen(false);
						setWithDrawId("");
					}}
					open={withdrawBidOpen}
					title={`Do you want to withdraw this bid?`}
					heading="Withdraw Bid"
					onSubmit={Withdraw}
				/>
			)}
			{email && (
				<EmailDialogbox
					type="property"
					open={email}
					agentData={item}
					agent={agentData}
					onHide={() => setEmail(false)}
				/>
			)}
			{reasonOpen && <RejectReason open={reasonOpen} data={rejectReason} handleClose={() => setReasonOpen(false)} />}
		</div>
	);
};

export default ManagePropertyCardNew;
