import AuthContext from "@/context/AuthContext";
import classNames from "classnames";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CustomImage from "./CustomImage";

function Footer() {
	const { t } = useTranslation();
	const { config, adminInfo, user,direction } = useContext(AuthContext);

	const getSlug = (slug) => {
		const obj = config?.staticContent?.find((s) => s.slug === slug);
		return `/pages/${obj?.publicSlug}`;
	};

	return (
		<>
			<footer>
				<Container>
					<div className={classNames("top_footer d-flex justify-content-xl-between pb-3 mb-4 flex-wrap justify-content-sm-center", { border_bottom: isEmpty(user) || user?.role === "user" })}>
						<div className="footer_logo">
							<Link href="/">
								{/* <img src='/images/footerLogo.svg' alt='image' /> */}
								<CustomImage width={176} height={60} src={adminInfo?.logo || ""} alt="image" />
							</Link>
						</div>
						<p className="text-white mb-0 d-flex align-items-start company_location_fix">
							<img src="/images/location_white.svg" alt="image" className="me-2" />
							{/* Al Aqiq, Office 15, 2nd floor, Riyadh 13515 */}
							{adminInfo && adminInfo?.[`siteAddress${direction?.langKey || ''}`]}
						</p>
						<p className="text-white mb-0 d-flex align-items-center">
							<img src="/images/call_white.svg" alt="image" className="me-2" />
							{/* +966 55 008 8601 */}
						{config?.country == "UAE" ? '+971' : '+966'} {adminInfo && adminInfo?.mobile}
						</p>
						<p className="text-white mb-0 d-flex align-items-center">
							<img src="/images/mail_white.svg" alt="image" className="me-2" />
							{adminInfo && adminInfo?.email}
						</p>
						<div className="social d-flex align-items-center">
							<p className="mb-0 text-white me-3 fw-medium ms-sm-2 ms-0">{t("FOLLOW_US")}</p>
							<a href={adminInfo && adminInfo?.facebookUrl} target="_blank" className="me-2">
								<img src="/images/fb.svg" alt="image" />
							</a>
							<a href={adminInfo && adminInfo?.linkedinUrl} target="_blank" className="mx-2">
								<img src="/images/linkedin.svg" alt="image" />
							</a>
							<a href={adminInfo && adminInfo?.twitterUrl} target="_blank" className="mx-2">
								<img src="/images/twitter.svg" alt="image" />
							</a>
							<a href={adminInfo && adminInfo?.youtubeUrl} target="_blank" className="mx-2">
								<img src="/images/youtube.svg" alt="image" />
							</a>
							<a href={adminInfo && adminInfo?.instgramUrl} target="_blank" className="mx-2">
								<img src="/images/instagram.svg" alt="image" />
							</a>
						</div>
					</div>
					{(isEmpty(user) || user?.role === "user") && (
						<Row>
							<Col md={6} lg={3} sm={6} className="mb-3 mb-lg-0">
								<h6 className="fw-medium text-white mb-3">{t("POPULAR_SEARCHES")}</h6>
								<ul>
									<li>
										<Link href="/rent">{`${t("PROPERTY_FOR_RENT_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/buy">{`${t("PROPERTY_FOR_SALE_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/rent?propertyType=64413caa2d35d5de34a3eeb1">{`${t("APARTMENT_FOR_RENT_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/buy?propertyType=64413caa2d35d5de34a3eeb1">{`${t("APARTMENT_FOR_SALE_IN")} ${config?.country}`}</Link>
									</li>
								</ul>
							</Col>
							<Col md={6} lg={3} sm={6} className="mb-3 mb-lg-0">
								<h6 className="fw-medium text-white mb-3">{t("POPULAR_AREAS")}</h6>
								<ul>
									<li>
										<Link href="/rent">{`${t("PROPERTY_FOR_RENT_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/buy">{`${t("PROPERTY_FOR_SALE_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/rent?propertyType=64413caa2d35d5de34a3eeb1">{`${t("APARTMENT_FOR_RENT_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/buy?propertyType=64413caa2d35d5de34a3eeb1">{`${t("APARTMENT_FOR_SALE_IN")} ${config?.country}`}</Link>
									</li>
								</ul>
							</Col>
							<Col md={6} lg={3} sm={6} className="mb-3 mb-lg-0">
								<h6 className="fw-medium text-white mb-3">{t("PROPERTY_FOR_RENT")}</h6>
								<ul>
									<li>
										<Link href="/rent">{`${t("PROPERTY_FOR_RENT_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/buy">{`${t("PROPERTY_FOR_SALE_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/rent?propertyType=64413caa2d35d5de34a3eeb1">{`${t("APARTMENT_FOR_RENT_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/buy?propertyType=64413caa2d35d5de34a3eeb1">{`${t("APARTMENT_FOR_SALE_IN")} ${config?.country}`}</Link>
									</li>
								</ul>
							</Col>
							<Col md={6} lg={3} sm={6} className="mb-3 mb-lg-0">
								<h6 className="fw-medium text-white mb-3">{t("PROPERTY_FOR_SALE")}</h6>
								<ul>
									<li>
										<Link href="/rent">{`${t("PROPERTY_FOR_RENT_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/buy">{`${t("PROPERTY_FOR_SALE_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/rent?propertyType=64413caa2d35d5de34a3eeb1">{`${t("APARTMENT_FOR_RENT_IN")} ${config?.country}`}</Link>
									</li>
									<li>
										<Link href="/buy?propertyType=64413caa2d35d5de34a3eeb1">{`${t("APARTMENT_FOR_SALE_IN")} ${config?.country}`}</Link>
									</li>
								</ul>
							</Col>
						</Row>
					)}
				</Container>
				<div className="copyright border_top">
					<Container>
						<div className="d-flex align-items-center justify-content-xl-between text-white flex-wrap justify-content-center copyright_wrap">
							<p className="mb-0">
								© {dayjs().format("YYYY")} {t("MADA_PROPERTY_ALL_RIGHT_RESERVED")}
							</p>
							<ul className="ms-0 pt-0 ps-0 pt-0 d-flex align-items-center">
								<li>
									<Link href={getSlug("about-us")}>{t("ABOUT_COMPANY")}</Link>
								</li>
								<li>
									<Link href="/blogs">{t("BLOGS")}</Link>
								</li>
								<li>
									<Link href={getSlug("terms-and-conditions")}>{t("TERMS_AND_CONDITION")}</Link>
								</li>
								<li>
									<Link href={getSlug("privacy-policy")}>{t("PRIVACY_POLICY")}</Link>
								</li>
								<li>
									<Link href="/faqs">{t("FAQS")}</Link>
								</li>
								<li>
									<Link href="/contactus">{t("CONTACT_US")}</Link>
								</li>
							</ul>
						</div>
					</Container>
				</div>
			</footer>
		</>
	);
}
export default Footer;
