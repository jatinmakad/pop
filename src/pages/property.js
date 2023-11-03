import React, { useContext, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { Breadcrumb, Container, Col, Row } from "react-bootstrap";
import { apiDelete, apiGet, apiPost } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import useToastContext from "@/hooks/useToastContext";
import { useRouter } from "next/router";
import { apiPut } from "@/utils/apiFetch";
import Helpers from "@/utils/helpers";
import Link from "next/link";
import { isEmpty } from "lodash";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { constructionStatusObj } from "@/utils/constants";
import AuthContext from "@/context/AuthContext";
import ReportProperty from "./components/properties/ReportProperty";
import CustomImage from "./components/CustomImage";
import Head from "next/head";
import { useTranslation } from "react-i18next";

function PropertyDetail() {
  const { t } = useTranslation()
  const router = useRouter();
  const notification = useToastContext();
  const { user, config, direction } = useContext(AuthContext);
  const [openReport, setOpenReport] = useState(false);
  const rentProperties = {
    nav: true,
    dots: false,
    arrow: true,
    infinite: false,
    speed: 500,
    margin: 20,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1.5,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1.2,
        },
      },
    ],
  };

  const [property, setProperty] = useState({});
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);

  const getPropertyData = async () => {
    try {
      const { status, data } = await apiGet(
        apiPath.getPropertyDetailsCompany + router?.query?.slug
      );
      if (status == 200) {
        if (data.success) {
          setProperty(data?.results);
        }
      } else {
      }
    } catch (error) { }
  };

  useEffect(() => {
    if (router?.query?.slug !== undefined) {
      getPropertyData();
    }
  }, [router?.query?.slug]);

  const wishlistStatus = async (id) => {
    try {
      const { status, data } = await apiPost(apiPath.addToWishlist, {
        propertyId: id,
      });
      if (status == 200) {
        if (data.success) {
          notification.success(data?.message);
          getPropertyData();
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
      const { status, data } = await apiDelete(apiPath.removeToWishList, {
        propertyId: id,
      });
      if (status == 200) {
        if (data.success) {
          notification.success(data?.message);
          getPropertyData();
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

  return (
    <>
      <div className="detailBanner position-relative inner-banner">
        <Head>
          <title>Mada Properties : Property</title>
        </Head>
        <img
          src={
            property?.photos?.length > 0
              ? property?.photos[0]
              : "./images/detail_banner.jpg"
          }
          alt="image"
        />
        <div className="detail_caption">
          <div className="container">
            <div className="d-sm-flex align-items-center">
              <div>
                <h2 className="text-white mb-sm-2">
                  {property?.title}
                  {/* Minoas Sea Villa */}
                  {/* <span className='text-green'>Heated Pool</span> */}
                </h2>
                <p className="text-white mb-0">
                  {t("LAST_UPDATED_TIME")}{" "}
                  {Helpers?.remainingTimeFromNow(property?.updatedAt, { language: direction?.langKey })}
                </p>
              </div>
              <h2 className="ms-sm-auto text-white mt-1 mt-sm-0">
                {Helpers?.priceFormat(property?.price)} {config?.currency}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="main_wrap">
        <div className="breadcrum_Main pt-0">
          <Container>
            <Row className="align-items-center">
              <Col md={7}>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link href={"/"}>Home</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item href="#">
                    {t("VILLAS_FOR_SALE_IN_DUBAI")}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>{property?.title}</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col md={5}>
                <div className="breadcrumb_btn d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      notification.success(
                        "Link has been copied to clipboard!"
                      );
                    }}
                    className="d-flex align-items-center"
                  >
                    <img
                      src="./images/share.svg"
                      className="me-2"
                      alt="image"
                    />
                    {t("SHARE")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEmpty(property) && !isEmpty(user)) {
                        if (property?.wishlistCount == 1) {
                          removeWishlistStatus(property?._id);
                        } else {
                          wishlistStatus(property?._id);
                        }
                      }
                    }}
                    className={`d-flex align-items-center mx-2 mx-lg-3 like_tab ${property?.wishlistCount == 1 && "active"
                      }`}
                  >
                    <img
                      src="./images/like.svg"
                      className="me-2 unfilltbs"
                      alt="image"
                    />
                    <img
                      src="./images/savelike.svg"
                      className="me-2 filltbs"
                      alt="image"
                    />
                    {t("SAVE")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenReport(true);
                    }}
                    className="d-flex align-items-center"
                  >
                    <img
                      src="./images/report.svg"
                      className="me-2"
                      alt="image"
                    />
                    {t("REPORT")}
                  </button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row>
            <Col lg={8} xl={9}>
              <div className="d-flex flex-wrap align-items-center mb-3 view_btn">
                <Link
                  href={
                    !isEmpty(property) ? property?.threeSixtyView || "#" : "#"
                  }
                  target="_blank"
                  className="d-flex align-items-center text-white me-2 mb-2 mb-sm-0"
                >
                  <img src="./images/360.svg" className="me-2" alt="image" />
                  {t("VIEW_360_TOUR")}
                </Link>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    if (!isEmpty(property) && property?.photos?.length > 0) {
                      setOpen(true);
                      setImages(
                        property?.photos?.map((res) => {
                          return {
                            src: res,
                            width: 3840,
                            height: 2560,
                          };
                        })
                      );
                    }
                  }}
                  className="d-flex align-items-center text-white me-2 mb-2 mb-sm-0"
                >
                  <img src="./images/camera.svg" className="me-2" alt="image" />
                  {t("SHOW")} {!isEmpty(property) ? property?.photos?.length : 20}{" "}
                  {t("PHOTOS")}
                </a>
                <a
                  href="#"
                  className="ms-sm-auto border d-flex align-items-center rounded text-dark bg-white mb-2 mb-sm-0"
                >
                  <img
                    src="./images/location.svg"
                    className="me-2"
                    alt="image"
                  />
                  {t("VIEW_ON_MAP")}
                </a>
              </div>

              <Row className="position-relative detial_main_pic gx-2">
                <Col md={8}>
                  <figure className="large_pic mb-0">
                    <CustomImage
                      width={100}
                      height={100}
                      src={
                        !isEmpty(property)
                          ? property?.photos[0]
                          : "./images/detail_main.jpg"
                      }
                      alt="profilePic"
                    />
                    {/* <img
                      src={
                        !isEmpty(property)
                          ? property?.photos[0]
                          : "./images/detail_main.jpg"
                      }
                      // src={property?.photos[0]}
                      className="w-100"
                      alt="image"
                    /> */}
                  </figure>
                </Col>
                <Col md={4} className="d-md-block d-flex right_side_thumb">
                  <figure className="medium_thumbnail mb-thumb-space">
                    {/* <img
                      // src="./images/thumb1.jpg"
                      src={
                        !isEmpty(property)
                          ? property?.photos[1]
                          : "./images/detail_main.jpg"
                      }
                      // src={property?.photos[1]}
                      className="w-100"
                      alt="image"
                    /> */}
                    <CustomImage
                      width={100}
                      height={100}
                      src={
                        !isEmpty(property)
                          ? property?.photos[1]
                          : "./images/detail_main.jpg"
                      }
                      alt="image"
                    />
                  </figure>
                  <figure className="medium_thumbnail">
                    {/* <img
                      // src="./images/thumb2.jpg"
                      src={
                        !isEmpty(property)
                          ? property?.photos[2]
                          : "./images/detail_main.jpg"
                      }
                      // src={property?.photos[2]}
                      className="w-100"
                      alt="image"
                    /> */}
                    <CustomImage
                      width={100}
                      height={100}
                      src={
                        !isEmpty(property)
                          ? property?.photos[2]
                          : "./images/detail_main.jpg"
                      }
                      alt="image"
                    />
                  </figure>
                </Col>
                <div className="col-md-12 thumbnail_main">
                  <ul>
                    <li>
                      <figure className="medium_thumbnail">
                        {/* <img
                          // src="./images/thumb3.jpg"
                          src={
                            !isEmpty(property)
                              ? property?.photos[3]
                              : "./images/detail_main.jpg"
                          }
                          className="w-100"
                          alt="image"
                        /> */}
                        <CustomImage
                          width={100}
                          height={100}
                          src={
                            !isEmpty(property)
                              ? property?.photos[3]
                              : "./images/detail_main.jpg"
                          }
                          alt="image"
                        />
                      </figure>
                    </li>
                    <li>
                      <figure className="medium_thumbnail">
                        {/* <img
                          // src="./images/thumb4.jpg"
                          src={
                            !isEmpty(property)
                              ? property?.photos[4]
                              : "./images/detail_main.jpg"
                          }
                          className="w-100"
                          alt="image"
                        /> */}
                        <CustomImage
                          width={100}
                          height={100}
                          src={
                            !isEmpty(property)
                              ? property?.photos[4]
                              : "./images/detail_main.jpg"
                          }
                          alt="image"
                        />
                      </figure>
                    </li>
                    <li>
                      <figure className="medium_thumbnail position-relative d-block">
                        {/* <img
                          // src={"./images/thumb5.jpg"}
                          src={
                            !isEmpty(property)
                              ? property?.photos[5]
                              : "./images/detail_main.jpg"
                          }
                          className="w-100"
                          alt="image"
                        /> */}
                        <CustomImage
                          width={100}
                          height={100}
                          src={
                            !isEmpty(property)
                              ? property?.photos[5]
                              : "./images/detail_main.jpg"
                          }
                          alt="image"
                        />
                        {!isEmpty(property) && property?.photos[5] && (
                          <span className="video_icon">
                            <img src="./images/video_icon.svg" alt="image" />
                          </span>
                        )}
                      </figure>
                    </li>
                  </ul>
                </div>
              </Row>
              <ul className="property_desc bg-white px-3 py-4 mb-3 rounded">
                <li>
                  <img src="./images/home.svg" alt="image" />
                  <h6>
                    <span>{t("TYPE")}</span>
                    {property?.propertyCategory?.name}
                  </h6>
                </li>

                <li>
                  <img src="./images/property.png" alt="image" />
                  <h6>
                    <span>{t("PROPERTY_SIZE")}</span>1200 {config?.areaUnit}
                  </h6>
                </li>

                <li>
                  <img src="./images/bedroom_detail.svg" alt="image" />
                  <h6>
                    <span>{t("BEDROOMS")}</span>
                    {property?.bedrooms > 7 ? '7+' : property?.bedrooms} {t("BEDROOMS")}
                    {/* 3 Bedrooms / 4 Beds */}
                  </h6>
                </li>
                <li>
                  <img src="./images/bathroom_detail.svg" alt="image" />
                  <h6>
                    <span>{t("BATHROOM")}</span>
                    {property?.bathrooms == 7 ? '7+' : property?.bathrooms}
                  </h6>
                </li>
              </ul>

              <div className="bg-white  p-3 p-sm-4 mb-3 rounded">
                <div className="heading_line">
                  <h3 className="position-relative">{t("DESCRIPTION")}</h3>
                </div>
                <p>{property?.description}</p>
                {/* <p>
                  Mada Properties is proud to present this vacant and
                  unfurnished Sidra villa in Dubai Hills. Boasts five spacious
                  bedrooms and six well-appointed bathrooms, making it the
                  perfect retreat for a large family or those who love to
                  entertain. The villa is situated in a desirable location
                  within a single row, ensuring plenty of privacy and a peaceful
                  living environment
                </p> */}
              </div>

              <div className="bg-white p-3 p-sm-4 mb-3 property_feature rounded">
                <div className="heading_line">
                  <h3 className="position-relative">{t("FEATURES")}</h3>
                </div>
                <ul>
                  <li className="d-flex align-items-center">
                    <img
                      src="./images/feature1.svg"
                      alt="image"
                      className="me-2"
                    />{" "}
                    {t("LIVING_ROOM")}:{" "}
                    <span className="text-green fw-medium ms-1">
                      {property?.livingRooms} {t("LIVING_ROOM")}
                    </span>
                  </li>

                  <li className="d-flex align-items-center">
                    <img
                      src="./images/feature3.svg"
                      alt="image"
                      className="me-2"
                    />{" "}
                    {t("FURNISHED_TYPE")}{" "}
                    <span className="text-green text-capitalize fw-medium ms-1">
                      {!isEmpty(property) ? property?.furnished || "--" : "--"}
                    </span>
                  </li>

                  <li className="d-flex align-items-center">
                    <img
                      src="./images/feature4.svg"
                      alt="image"
                      className="me-2"
                    />{" "}
                    {t("BUILT_AREA")}
                    <span className="text-green text-capitalize fw-medium ms-1">
                      {!isEmpty(property) ? property?.bua : "--"} M2
                    </span>
                  </li>

                  <li className="d-flex align-items-center">
                    <img
                      src="./images/feature4.svg"
                      alt="image"
                      className="me-2"
                    />{" "}
                    {t("FINANCIAL_STATUS")}{" "}
                    <span className="text-green text-capitalize  fw-medium ms-1">
                      {!isEmpty(property)
                        ? property?.financialStatus || "--"
                        : "--"}
                    </span>
                  </li>

                  <li className="d-flex align-items-center">
                    <img
                      src="./images/feature2.svg"
                      alt="image"
                      className="me-2"
                    />{" "}
                    {t("CONSTRUCTION_STATUS")}{" "}
                    <span className="text-green fw-medium ms-1">
                      {!isEmpty(property)
                        ? constructionStatusObj[property?.projectStatus] || "--"
                        : "--"}
                    </span>
                  </li>

                  <li className="d-flex align-items-center">
                    <img
                      src="./images/feature4.svg"
                      alt="image"
                      className="me-2"
                    />{" "}
                    {t("READY_STAGE")}{" "}
                    <span className="text-green text-capitalize fw-medium ms-1">
                      {!isEmpty(property) ? property?.readyStage || "--" : "--"}
                    </span>
                  </li>
                </ul>

                {/* <a href="#" className="link">
                  More...
                </a> */}
              </div>

              <div className="bg-white p-3 p-sm-4 mb-3 property_amenities rounded">
                <div className="heading_line">
                  <h3 className="position-relative">{t("AMENITIES")}</h3>
                </div>
                <ul>
                  {!isEmpty(property) &&
                    property?.amenities?.length > 0 &&
                    property?.amenities?.map((res, index) => {
                      return (
                        <li key={index} className="d-flex align-items-center">
                          {/* <img src={res.icon} alt="image" className="me-2" />{" "} */}
                          {res?.name}
                        </li>
                      );
                    })}
                </ul>
              </div>

              <div className="bg-white p-3 p-sm-4 mb-3 property_feature rounded">
                <div className="heading_line d-sm-flex align-items-center mb-3 mb-sm-4">
                  <h3 className="position-relative mb-0">{t("LOCATION")}</h3>
                  <p className="mb-0 mt-2 mt-sm-0 ms-auto d-flex align-items-center">
                    <img
                      src="./images/location.svg"
                      alt="image"
                      className="me-2"
                    />
                    {t("DUBAI_HILLS_ESTATE")}
                  </p>
                </div>
                <div className="mb-4">
                  <img src="./images/map.jpg" className="w-100" alt="image" />
                </div>
                <ul className="mb-4">
                  <li>
                    {t("REFERENCE")} <span className="fw-medium">P2-515-1202</span>
                  </li>
                  <li>
                    {t("LISTED")}{" "}
                    <span className="fw-medium">
                      {Helpers?.remainingTimeFromNow(property?.createdAt, { language: direction?.langKey })}
                    </span>
                  </li>
                  <li>
                    {t("TRAKHEESI_PERMIT")}{" "}
                    <span className="fw-medium">
                      {!isEmpty(property)
                        ? property?.propertyOwnership || "--"
                        : "--"}
                    </span>
                  </li>

                  <li>
                    {t("BROKER_ORN")}{" "}
                    <span className="fw-medium">
                      {!isEmpty(property) ? property?.orn || "--" : "--"}
                    </span>
                  </li>
                  <li>
                    {t("AGENT_BRN")}{" "}
                    <span className="fw-medium">
                      {!isEmpty(property) ? property?.agent?.brn || "--" : "--"}
                    </span>
                  </li>
                  <li>
                    {t("OWNERSHIP")}{" "}
                    <span className="fw-medium">
                      {!isEmpty(property)
                        ? property?.propertyOwnership || "--"
                        : "--"}
                    </span>
                  </li>
                </ul>

                <div className="p-3 p-md-4 facility mb-3">
                  <h3>{t("NEAREST_FACILITIES")}</h3>
                  <ul>
                    <li>10 Minutes away from Hospital</li>
                    <li>15 Minutes away from Park</li>
                    <li>20 Minutes away from Garden</li>
                    <li>10 Minutes away from Mall</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white p-3 p-sm-4 mb-3 property_feature rounded">
                <div className="heading_line d-sm-flex align-items-center mb-3 mb-sm-4">
                  <h3 className="position-relative mb-0">{t("PRICE_TRENDS")}</h3>
                  <p className="mb-0 mt-2 mt-sm-0 ms-auto mt-2 mt-sm-0">
                    {t("BEDROOMS_VILLAS_SOLD")}
                  </p>
                </div>
                <img src="./images/chart.jpg" alt="image" className="w-100" />
              </div>
            </Col>
            <Col lg={4} xl={3}>
              <div className="sidebar">
                <div className="agent_detail px-3 pt-2 pb-3 bg-white mb-3">
                  <div className="text-end">
                    <a href="#">
                      <img src="./images/more.png" alt="image" />
                    </a>
                  </div>

                  <div className="d-flex align-items-center my-3 p-2 shadow-sm bg-white rounded">
                    <figure className="dealer_img">
                      <img
                        src={
                          property?.agent?.profilePic ||
                          "./images/user_agent.png"
                        }
                        // src={
                        //  "./images/user_agent.png"
                        // }
                        alt="image"
                      />
                    </figure>
                    <div className="ps-2">
                      <h6 className="mb-1">
                        {property?.agent?.firstName || "Nathan Richmond"}
                      </h6>
                      <p className="mb-1 fs-7">
                        {!isEmpty(property)
                          ? property?.agent?.agentProperties || "0"
                          : "0"}{" "}
                        {t("PROPERTY_LISTINGS")}
                      </p>
                      <p className="mb-0 fs-7">
                        {property?.agent?.designation} {t("AT_MADA_PROPERTIES")}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3 pb-3 border-bottom social_achiv_left d-flex align-items-center ms-auto justify-content-center">
                    <a
                      href={`tel:${property?.agent?.countryCode + property?.agent?.mobile
                        }`}
                      className="btn_link  d-flex align-items-center bg-green text-white"
                    >
                      <img src="images/call.svg" className="me-sm-2" /> {t("CALL")}
                    </a>
                    <a
                      href={`mailto:${!isEmpty(property) ? property?.agent?.email : "#"
                        }`}
                      className="btn_link d-flex align-items-center bg-green text-white ms-2 ms-sm-3"
                    >
                      <img src="images/mail.svg" className="me-sm-2" /> {t("EMAIL")}
                    </a>
                    {!isEmpty(property) && (
                      <a
                        href={`https://api.whatsapp.com/send/?phone=${property?.agent?.countryCode + property?.agent?.mobile
                          }&text&type=phone_number&app_absent=0`}
                        target="_blank"
                        className="ms-sm-3 ms-2 d-flex align-items-center"
                      >
                        <img src="images/whatsapp.svg" alt="image" />
                      </a>
                    )}
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <p className="mb-0 d-flex align-items-center">
                      <img
                        src="./images/language.svg"
                        className="me-1"
                        alt="image"
                      />{" "}
                      {t("SPEAKS_LANGUAGE")}
                    </p>
                    <p className="mb-0 ms-auto fw-medium">
                      {property?.agent?.language || "English, Arabic"}
                    </p>
                  </div>

                  <div className="bg-light p-3 mb-3 estimate">
                    <h2 className="mb-1 text-green ">{Helpers?.priceFormat(property?.price)} {config?.currency}</h2>
                    <p className="mb-0 text-dark fs-7">
                      {t("ESTIMATED_MORTGAGE")}{" "}
                      <span className="text-blue">40,881/month</span>
                    </p>
                  </div>
                  <p className="mb-3">
                    {property?.agent?.firstName} {property?.agent?.lastName}{" "}
                    {t("USUALLY_RESPONDS_WITHIN_5_MINUTES")}
                  </p>
                  {!isEmpty(user) && user?.role == "user" && (
                    <a href="#" className="w-100 btn theme_btn">
                      {t("SCHEDULE_A_MEETING")}
                    </a>
                  )}

                  <div className="bg-light rounded d-flex align-items-center justify-content-between p-3 text-center mt-3">
                    <p className="mb-0">
                      <span className="d-block fw-medium mb-2 fs-5">
                        {!isEmpty(property) ? property?.agent?.buyCount : 0}
                      </span>
                      {t("BUY")}
                    </p>
                    <p className="mb-0">
                      <span className="d-block fw-medium mb-2 fs-5">
                        {" "}
                        {!isEmpty(property)
                          ? property?.agent?.commercialRentCount
                          : 0}
                      </span>
                      {t("RENT")}
                    </p>
                    <p className="mb-0">
                      <span className="d-block fw-medium mb-2 fs-5">
                        {" "}
                        {!isEmpty(property)
                          ? property?.agent?.commercialBuyCount
                          : 0}
                      </span>
                      {t("COMMERCIAL")}
                    </p>
                  </div>
                </div>
                <img src="./images/ad2.jpg" alt="image" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <section className="properties_for_rent py-4 py-md-5 bg-white">
        <Container>
          <div className="inner_heading">
            <h2>
              {t("MORE_AVAILABLE_IN_THE")}{" "}
              <span className="text-green">{t("SAME_AREA")}</span>
            </h2>
            <p>Find homes first, only on Mada Properties.</p>
          </div>

          <Slider {...rentProperties} className="SliderNav">
            <div>
              <div className="propertie_card">
                <figure className="position-relative">
                  <a href="#">
                    <img src="images/properties1.jpg" />
                    <span className="img_count">
                      <img src="images/img.svg" />
                      03
                    </span>
                  </a>
                </figure>
                <figcaption>
                  <div className="propertie_detail_first bg-white">
                    <div className="price_tag">
                      <strong className="price">
                        326.00 SAR<small>/Month</small>
                      </strong>
                      <span className="apartment px-1 py-1">Apartment</span>
                    </div>
                    <a
                      className="fs-5 fw-medium text-dark d-block text-decoration-none mb-2"
                      href="#"
                    >
                      Contemporary apartment
                    </a>
                    <span className="properties_location d-flex align-items-start">
                      <img src="images/location.svg" className="me-2" /> A-463,
                      Palm beach, Abu dhabi, Dubai
                    </span>
                  </div>
                  <ul className="pro_feature d-flex align-items-center bg-light justify-content-between py-3 px-sm-2">
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/sqft.svg" className="me-2" />
                      1200 Sqft
                    </li>
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/bedroom.svg" className="me-2" />4 Bedroom
                    </li>
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/bathroom.svg" className="me-2" />4
                      Bathroom
                    </li>
                  </ul>

                  <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
                    <div className="social_achiv_left d-flex align-items-center fs-7">
                      <span className="pe-3 border-end">658 Views</span>
                      <span className="d-flex align-items-center ps-3">
                        <img src="images/watch.png" className="me-2" />
                        10 Days ago
                      </span>
                    </div>

                    <div className="social_achiv_left  d-flex align-items-center ms-auto">
                      <a href="#" className="p-3 border-start">
                        <img src="images/share.svg" />
                      </a>
                      <a href="#" className="p-3 border-start">
                        <img src="images/like.svg" />
                      </a>
                    </div>
                  </div>
                </figcaption>
              </div>
            </div>
            <div>
              <div className="propertie_card">
                <figure className="position-relative">
                  <a href="#">
                    <img src="images/properties2.jpg" />
                    <span className="img_count">
                      <img src="images/img.svg" />
                      03
                    </span>
                  </a>
                </figure>
                <figcaption>
                  <div className="propertie_detail_first bg-white">
                    <div className="price_tag">
                      <strong className="price">
                        326.00 SAR<small>/Month</small>
                      </strong>
                      <span className="apartment px-1 py-1">Apartment</span>
                    </div>
                    <a
                      className="fs-5 fw-medium text-dark d-block text-decoration-none mb-2"
                      href="#"
                    >
                      Contemporary apartment
                    </a>
                    <span className="properties_location d-flex align-items-start">
                      <img src="images/location.svg" className="me-2" /> A-463,
                      Palm beach, Abu dhabi, Dubai
                    </span>
                  </div>
                  <ul className="pro_feature d-flex align-items-center bg-light justify-content-between py-3 px-sm-2">
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/sqft.svg" className="me-2" />
                      1200 Sqft
                    </li>
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/bedroom.svg" className="me-2" />4 Bedroom
                    </li>
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/bathroom.svg" className="me-2" />4
                      Bathroom
                    </li>
                  </ul>

                  <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
                    <div className="social_achiv_left d-flex align-items-center fs-7">
                      <span className="pe-3 border-end">658 Views</span>
                      <span className="d-flex align-items-center ps-3">
                        <img src="images/watch.png" className="me-2" />
                        10 Days ago
                      </span>
                    </div>

                    <div className="social_achiv_left  d-flex align-items-center ms-auto">
                      <a href="#" className="p-3 border-start">
                        <img src="images/share.svg" />
                      </a>
                      <a href="#" className="p-3 border-start">
                        <img src="images/like.svg" />
                      </a>
                    </div>
                  </div>
                </figcaption>
              </div>
            </div>
            <div>
              <div className="propertie_card">
                <figure className="position-relative">
                  <a href="#">
                    <img src="images/properties3.jpg" />
                    <span className="img_count">
                      <img src="images/img.svg" />
                      03
                    </span>
                  </a>
                </figure>
                <figcaption>
                  <div className="propertie_detail_first bg-white">
                    <div className="price_tag">
                      <strong className="price">
                        326.00 SAR<small>/Month</small>
                      </strong>
                      <span className="apartment px-1 py-1">Apartment</span>
                    </div>
                    <a
                      className="fs-5 fw-medium text-dark d-block text-decoration-none mb-2"
                      href="#"
                    >
                      Contemporary apartment
                    </a>
                    <span className="properties_location d-flex align-items-start">
                      <img src="images/location.svg" className="me-2" /> A-463,
                      Palm beach, Abu dhabi, Dubai
                    </span>
                  </div>
                  <ul className="pro_feature d-flex align-items-center bg-light justify-content-between py-3 px-sm-2">
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/sqft.svg" className="me-2" />
                      1200 Sqft
                    </li>
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/bedroom.svg" className="me-2" />4 Bedroom
                    </li>
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/bathroom.svg" className="me-2" />4
                      Bathroom
                    </li>
                  </ul>

                  <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
                    <div className="social_achiv_left d-flex align-items-center fs-7">
                      <span className="pe-3 border-end">658 Views</span>
                      <span className="d-flex align-items-center ps-3">
                        <img src="images/watch.png" className="me-2" />
                        10 Days ago
                      </span>
                    </div>

                    <div className="social_achiv_left  d-flex align-items-center ms-auto">
                      <a href="#" className="p-3 border-start">
                        <img src="images/share.svg" />
                      </a>
                      <a href="#" className="p-3 border-start">
                        <img src="images/like.svg" />
                      </a>
                    </div>
                  </div>
                </figcaption>
              </div>
            </div>
            <div>
              <div className="propertie_card">
                <figure className="position-relative">
                  <a href="#">
                    <img src="images/properties1.jpg" />
                    <span className="img_count">
                      <img src="images/img.svg" />
                      03
                    </span>
                  </a>
                </figure>
                <figcaption>
                  <div className="propertie_detail_first bg-white">
                    <div className="price_tag">
                      <strong className="price">
                        326.00 SAR<small>/Month</small>
                      </strong>
                      <span className="apartment px-1 py-1">Apartment</span>
                    </div>
                    <a
                      className="fs-5 fw-medium text-dark d-block text-decoration-none mb-2"
                      href="#"
                    >
                      Contemporary apartment
                    </a>
                    <span className="properties_location d-flex align-items-start">
                      <img src="images/location.svg" className="me-2" /> A-463,
                      Palm beach, Abu dhabi, Dubai
                    </span>
                  </div>
                  <ul className="pro_feature d-flex align-items-center bg-light justify-content-between py-3 px-sm-2">
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/sqft.svg" className="me-2" />
                      1200 Sqft
                    </li>
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/bedroom.svg" className="me-2" />4 Bedroom
                    </li>
                    <li className="d-flex align-items-center fs-7 fw-medium px-2">
                      <img src="images/bathroom.svg" className="me-2" />4
                      Bathroom
                    </li>
                  </ul>

                  <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
                    <div className="social_achiv_left d-flex align-items-center fs-7">
                      <span className="pe-3 border-end">658 Views</span>
                      <span className="d-flex align-items-center ps-3">
                        <img src="images/watch.png" className="me-2" />
                        10 Days ago
                      </span>
                    </div>

                    <div className="social_achiv_left  d-flex align-items-center ms-auto">
                      <a href="#" className="p-3 border-start">
                        <img src="images/share.svg" />
                      </a>
                      <a href="#" className="p-3 border-start">
                        <img src="images/like.svg" />
                      </a>
                    </div>
                  </div>
                </figcaption>
              </div>
            </div>
          </Slider>
        </Container>
      </section>
      {open && (
        <Lightbox
          open={open}
          plugins={[Thumbnails]}
          close={() => setOpen(false)}
          slides={images}
        />
      )}
      {openReport && (
        <ReportProperty
          open={openReport}
          onClose={() => setOpenReport(false)}
          id={property?._id}
        />
      )}
    </>
  );
}

export default PropertyDetail;
