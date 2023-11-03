import Helpers from "@/utils/helpers";
import { compact, isEmpty, isNumber } from "lodash";
import React, { useContext, useState } from "react";
import useToastContext from "@/hooks/useToastContext";
import AuthContext from "@/context/AuthContext";
import { apiDelete, apiPost } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import Link from "next/link";
import CustomImage from "../CustomImage";
import ReactShare from "../ReactShare";
import ReportProperty from "./ReportProperty";
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { numify } from "numify";
import { useTranslation } from "react-i18next";
const PropertyCard = ({ item, getFeaturedProperties, type, pageType }) => {
	const { t } = useTranslation();
	const notification = useToastContext();
	const { user, config, direction } = useContext(AuthContext);
	const [openReport, setOpenReport] = useState(false);
	const [images, setImages] = useState([]);
	const [open, setOpen] = useState(false);
	const [isLiked, setIsLiked] = useState(!!item?.wishlistCount);
	const wishlistStatus = async (id) => {
		try {
			const { status, data } = await apiPost(apiPath.addToWishlistUser, {
				propertyId: id,
			});
			if (status == 200) {
				if (data.success) {
					notification.success(data?.message);
					setIsLiked(!isLiked);
					// getFeaturedProperties();
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

	const removeWishlistStatus = async (id) => {
		try {
			const { status, data } = await apiDelete(apiPath.removeToWishListUser, {
				propertyId: id,
			});
			if (status == 200) {
				if (data.success) {
					notification.success(data?.message);
					// getFeaturedProperties();
					setIsLiked(!isLiked);
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

	const [shareButton, setShareButton] = useState(false);
	const [shareButtonLink, setShareButtonLink] = useState("");
	const shareFunction = (link) => {
		setShareButtonLink(link);
		setShareButton(true);
	};

	if (isEmpty(item)) {
		return <></>;
	}

	let address = compact([item?.building, item?.street, item?.subCommunity, item?.community, item?.city]);

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
		if (isNumber(item?.priceDaily) && item?.priceDaily > 0) {
			return item?.priceDaily;
		} else if (isNumber(item?.priceWeekly) && item?.priceWeekly > 0) {
			return item?.priceWeekly;
		} else if (isNumber(item?.priceMonthly) && item?.priceMonthly > 0) {
			return item?.priceMonthly;
		} else if (isNumber(item?.priceYearly) && item?.priceYearly > 0) {
			return item?.priceYearly;
		}
	};

	return (
		<div>
			<div className="propertie_card blog_card">
				<Link href={`/property/${item?.slug}`}>
					<figure>
						<div
							style={{ cursor: "pointer" }}
							onClick={() => {
								if (item?.photos?.length > 0) {
									setOpen(true);
									setImages(
										item?.photos?.map((res) => {
											return {
												src: res,
												width: 3840,
												height: 2560,
											};
										})
									);
								}
							}}
						>
							<figure className="bg-white d-flex align-items-center justify-content-center">
								<CustomImage src={item?.photos[0]} width={100} height={100} />
							</figure>

							<span className="img_count">
								<CustomImage width={20} height={18} src="/images/img.svg" />
								{item?.photos?.length || 0}
							</span>
						</div>
					</figure>
					<figcaption>
						<div className="propertie_detail_first bg-white">
							<div className="price_tag">
								<strong className="price truncate">
									{pageType === "rent" || pageType === "commercial-rent"
										? Helpers?.priceFormat(priceFormatType(item))
										: item?.propertyType?.slug == "rent" || item?.propertyType?.slug == "commercial-rent"
											? Helpers?.priceFormat(priceFormatType(item))
											: Helpers?.priceFormat(item?.price)}{" "}
									{config?.currency}{" "}
									{pageType === "rent" || pageType === "commercial-rent" ? (
										<small>{priceFormat(item)}</small>
									) : item?.propertyType?.slug == "rent" || item?.propertyType?.slug == "commercial-rent" ? (
										<small>{priceFormat(item)}</small>
									) : null}
								</strong>
								{item?.propertyCategory[`name${direction?.langKey || ""}`] && <span className="apartment px-1 py-1">{item?.propertyCategory[`name${direction?.langKey || ""}`]}</span>}
							</div>
							<h4 className="fs-5 fw-medium text-dark d-block text-decoration-none mb-3 ellipsis_text">{item?.title}</h4>
							<span className="properties_location d-flex align-items-start">
								<CustomImage width={24} height={24} src="/images/location.svg" className="me-2" />{" "}
								<span className="location_text">{address?.length > 0 ? address.join(", ") : "No Address Found"}</span>
							</span>
						</div>
						<ul className="pro_feature d-flex align-items-center bg-light justify-content-between py-3 px-sm-2">
							{item?.propertySize > 0 ?
								<li className="d-flex align-items-center fs-7 fw-medium px-2  me-md-3">
									<CustomImage width={16} height={16} src="/images/sqft.svg" className="me-2" />
									{`${item?.propertySize || "0"} ${config?.areaUnit}`}
								</li> : <li className="d-flex align-items-center fs-7 fw-medium px-2  me-md-3">
									<CustomImage width={16} height={16} src="/images/area-black.svg" className="me-2" />
									{item?.bua} {config?.areaUnit}
								</li>}
							{/* <li className="d-flex align-items-center fs-7 fw-medium px-2">
								<CustomImage width={24} height={16} src="/images/sqft.svg" className="me-2" />
								{`${item?.propertySize || "0"} ${config?.areaUnit}`}
							</li> */}
							<li className="d-flex align-items-center fs-7 fw-medium px-2">
								<CustomImage width={24} height={16} src="/images/bedroom.svg" className="me-2" />
								{`${item?.bedrooms == 0 ? "Studio" : item?.bedrooms > 7 ? "7+" : item?.bedrooms} ${item?.bedrooms > 0 ? t("BEDROOM") : ''}`}
							</li>
							<li className="d-flex align-items-center fs-7 fw-medium px-2">
								<CustomImage width={24} height={16} src="/images/bathroom.svg" className="me-2" /> {`${item?.bathrooms > 7 ? "7+" : item?.bathrooms} ${t("BATHROOM")}`}
							</li>
						</ul>
					</figcaption>
				</Link>
				<div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
					<div className="social_achiv_left d-flex align-items-center fs-7">
						<span className="pe-3 border-end">
							{" "}
							{`${numify(item?.view || 0)} ${t("VIEWS")}`}
							{/* {`${item?.view || 0} Views`} */}
						</span>
						<span className="d-flex align-items-center ps-3">
							<CustomImage src="/images/watch.svg" width={16} height={16} className="me-2" />
							{Helpers.remainingTimeFromNow(item?.listedOn, { language: direction?.langKey })}
							{/* {Helpers.dateFormat(item?.createdAt, "DD")} */}
						</span>
					</div>

					<div className="social_achiv_left  d-flex align-items-center ms-auto">
						{(isEmpty(user) || user?.role === "user") && (
							<button
								onClick={() => {
									if (!isEmpty(user) && user?.role === "user") {
										setOpenReport(true);
									} else {
										notification?.error("Please login to report this property");
									}
								}}
								className="p-sm-3 py-3 px-2 border-start bg-transparent border-0"
							>
								<img src="/images/report.svg" />
							</button>
						)}
						<span
							onClick={() => {
								shareFunction(window.location.origin + "/property/" + item?.slug);
							}}
							className="cursor-pointer p-3 border-start"
						>
							<CustomImage src="/images/share.svg" className="me-2 share-icon" width={100} height={100} />
						</span>
						{(isEmpty(user) || user?.role === "user") && (
							<span
								role="button"
								onClick={() => {
									if (isEmpty(user)) {
										notification.error("Please login to add property in wishlist.");
									} else {
										if (!isEmpty(item) && !isEmpty(user)) {
											if (isLiked) {
												removeWishlistStatus(item?._id);
											} else {
												wishlistStatus(item?._id);
											}
										}
									}
								}}
								className="p-3 border-start"
							>
								<CustomImage width={100} height={100} className="me-2 unfilltbs wishlist-icon" src={isLiked ? "/images/savelike.svg" : "/images/like.svg"} />
							</span>
						)}
					</div>
				</div>
			</div>
			{shareButton && <ReactShare shareButton={shareButton} setShareButton={setShareButton} link={shareButtonLink} />}
			{openReport && <ReportProperty open={openReport} onClose={() => setOpenReport(false)} id={item?._id} />}
			{open && (
				<Lightbox
					open={open}
					plugins={[Thumbnails]}
					close={() => setOpen(false)}
					slides={images}
				/>
			)}
		</div>
	);
};

export default PropertyCard;
