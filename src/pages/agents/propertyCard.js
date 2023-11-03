import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import dayjs from "dayjs";
import AuthContext from "@/context/AuthContext";
import Helpers from "@/utils/helpers";
import { startCase } from "lodash";
import { useTranslation } from "react-i18next";

const PropertyCard = ({ item, editAgent, setDeleteBox, setDeleteId, type }) => {
  const { t } = useTranslation();
  const today = dayjs();
  const diffInDays = today.diff(item?.createdAt, "day");
  const { config } = useContext(AuthContext);
  const handleWhatsApp = () => {
    const phoneNumber = "1234567890";
    const message = "Hello, this is a test message!"; // Replace with your custom message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="propertie_card_listView">
      <div className="d-md-flex">
        <figure className="position-relative">
          <a href="#">
            <img src={item?.photos && item?.photos[0]} />
            <span className="img_count">
              <img src="/images/img.svg" />
              {item?.photos && item?.photos.length}
            </span>
          </a>
        </figure>
        <figcaption>
          <div className="propertie_detail_first bg-white h-auto">
            <div className="price_tag mb-2">
              <strong className="price">
                {Helpers?.priceFormat(item?.price)} {config?.currency}
                <small>/Month</small>
              </strong>
              <a href="#" className="ms-auto me-2 me-lg-3 mt-1">
                <img src="./images/heart_active.svg" alt="" />
              </a>
              <span className="apartment px-1 py-1">
                {item?.propertyCategory?.name}
              </span>
            </div>
            <a
              className="fs-5 fw-medium text-dark d-block text-decoration-none mb-3"
              href="#"
            >
              {item?.title}
            </a>
            <span className="properties_location d-flex align-items-start">
              <img src="/images/location.svg" className="me-2" />{" "}
              {item?.address}
            </span>

            <div className="social_achiv_left d-flex align-items-center mt-3 fs-7">
              <span className="d-flex align-items-center pe-3">
                <img src="/images/watch.png" className="me-2" />
                {diffInDays} {t("DAYS_AGO")}
              </span>
              <span className="pe-3 border-end">
                {item?.view} {t("VIEWS")}
              </span>
            </div>
          </div>
          <ul className="pro_feature d-flex align-items-center bg-light py-2 px-sm-2">
            <li className="d-flex align-items-center fs-7 fw-medium px-2  me-md-3">
              <img src="/images/sqft.svg" className="me-2" />
              {item?.propertySize || 0} {startCase(config?.areaUnit)}
            </li>
            <li className="d-flex align-items-center fs-7 fw-medium px-2 me-md-3">
              <img src="/images/bedroom.svg" className="me-2" />
              {item?.bedrooms === 0
                ? "Studio"
                : item?.bedrooms > 7
                ? "7+"
                : item?.bedrooms}{" "}
              { item?.bedrooms > 0 ? item?.bedrooms === 0 ? '' : t("BEDROOM") : null }
            </li>
            <li className="d-flex align-items-center fs-7 fw-medium px-2">
              <img src="/images/bathroom.svg" className="me-2" />
              {item?.bathrooms > 7 ? "7+" : item?.bathrooms} {t("BATHROOM")}
            </li>
          </ul>
        </figcaption>
      </div>
      <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
        {/* <div className="user fw-medium text-dark fs-7 d-flex align-items-center">
                        <img src="/images/user1.png" alt="" className="me-2" />
                        Andrew Van Wyk
                    </div> */}

        <div className="social_achiv_left  d-flex align-items-center ms-auto">
          <a
            href="#"
            className="btn_link  d-flex align-items-center bg-green text-white"
          >
            <img src="/images/call.svg" className="me-sm-2" /> {t("CALL")}
          </a>
          <a
            href="#"
            className="btn_link d-flex align-items-center bg-green text-white ms-2 ms-sm-3"
          >
            <img src="/images/mail.svg" className="me-sm-2" /> {t("EMAIL")}
          </a>
          <div onClick={handleWhatsApp}>
            <Link
              href="#"
              className="mx-sm-3 mx-2 d-flex align-items-center border-start"
            >
              <img src="/images/whatsapp.svg" />
            </Link>
          </div>
          <a href="#" className="p-sm-3 py-3 px-2 border-start">
            <img src="/images/share.svg" />
          </a>
          <a href="#" className="p-sm-3 py-3 px-2 border-start">
            <img src="/images/like.svg" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
