import React, { useContext, useState } from "react";
import CustomImage from "../CustomImage";
import Helpers from "@/utils/helpers";
import { capitalize, compact, isEmpty, upperCase } from "lodash";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import AuthContext from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

const ManagePropertyCard = ({ item, openDialog, check }) => {
  const { t } = useTranslation();
  const { user, direction } = useContext(AuthContext)
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  return (
    <div className="company-card-list">
      <div className={`propertie_card_listView ${check == 'appointment' && 'appointment_list_bottom'}`}>
        <div className="d-md-flex">
          <figure
            className="position-relative"
            style={{ cursor: "pointer" }}
            // onClick={() => {
            //   if (item?.photos?.length > 0) {
            //     setOpen(true);
            //     setImages(
            //       item?.photos?.map((res) => {
            //         return {
            //           src: res,
            //           width: 3840,
            //           height: 2560,
            //         };
            //       })
            //     );
            //   }
            // }}
          >
            <div className="property-img">
              <CustomImage
                width={100}
                height={100}
                className="w-100 h-100"
                src={
                  item?.photos?.length > 0
                    ? item?.photos[0]
                    : "/images/listview.png"
                }
                alt="profilePic"
              />
            </div>
            <span className="img_count">
              <img src="images/img.svg" />
              {item?.photos?.length || 0}
            </span>
          </figure>
          <figcaption className="d-flex flex-column justify-content-between">
            <div className="propertie_detail_first bg-white h-auto position-relative">
              <div className="price_tag  mb-2">
                {/* <strong className="price">
                  326.00 SAR<small>/Month</small>
                </strong>
                <a href="#" className="ms-auto me-2 me-lg-3 mt-1">
                  <img src="./images/heart_active.svg" alt="" />
                </a> */}
                {!isEmpty(item?.propertyCategory) && <span className="apartment appointment_tag px-2 py-1">
                  {item?.propertyCategory[`name${direction?.langKey || ''}`]}
                </span>}
              </div>
              <Link
                className="fs-5 fw-medium text-dark text-decoration-none mb-3 single-text-truncate"
                href={`/property/${item?.property?.slug}`}
              >
                {item?.property?.[`title${direction?.langKey || ''}`]}
              </Link>
              <div className="d-flex justify-content-between align-items-start appoinment-new-cards appoinment-new-cards-location-wrap">
                <div className="properties_location d-flex align-items-start pe-3">
                  <img src="images/location.svg" className="me-2" />
                  <span className="multiple-text-truncate mh-auto">
                    {compact([item?.property?.building, item?.property?.street, item?.property?.subCommunity, item?.property?.community, item?.property?.city]).join(', ') || "No Address Found"}
                  </span>
                </div>

                {/* <div className="social_achiv_left d-flex align-items-center fs-7 text-end">
                  <span className="">
                    {t("PROPERTY_ID")} {item?.property?.propertyId}
                  </span>
                </div> */}
              </div>
              <div className="social_achiv_left text_light_gray d-flex align-items-center mt-3 fs-7">
                {t("PROPERTY_ID")} {item?.property?.propertyId}
              </div>
            </div>

            <div className="customer-detail">
              {/* {user?.role !== 'user' &&
                <h4>{t("CUSTOMER_DETAILS")}</h4>} */}
              <div className="detail-inner">
                {/* {user?.role !== 'user' &&
                  <div className="d-flex align-items-center flex-fill">
                    <div className="common-profile">
                      <CustomImage width={40} height={40} src={item?.user?.profile_pic || "/images/user1.png"} alt="" />
                    </div>
                    <div className="figcaption">
                      <h5 className="single-text-truncate">
                        {item?.user?.firstName} {item?.user?.lastName}
                      </h5>
                      <span>
                        +{item?.user?.country_code} {item?.user?.mobile}
                      </span>
                    </div>
                  </div>} */}

                <div className="customer-date-sec customer-date-sec_main_wrap d-sm-flex ">
                  <div className="mb-2 mb-sm-3">
                    <span className="mb-2 d-none d-sm-inline-block">{t("DATE")}</span>
                    <h6 className="justify-content-end">
                      <img src="/images/calander.svg" alt="" />
                      {/* 20 Apr, 2023 */}
                      {Helpers.dateFormatAppointment(item?.appointmentDateTime, "DD MMM, YYYY", { language: direction?.langKey })}
                    </h6>
                  </div>
                  <div className="mb-2 mb-sm-3">
                    <span className="mb-2  d-none d-sm-inline-block">{t("TIME")}</span>
                    <h6 className="justify-content-end">
                      {" "}
                      <img src="/images/watch.png" alt=""></img>{Helpers.dateFormatTimeAppointment(item?.appointmentDateTime, "hh:mm A", { language: direction?.langKey })}
                    </h6>
                  </div>
                  {!isEmpty(item?.propertyType) &&
                    <div className="mb-2 mb-sm-3">
                      <span className="mb-2  d-inline-block">{t("PROPERTY_TYPE")}:</span>
                      <h6 className="justify-content-end">
                        {" "}
                        {item?.propertyType[`name${direction?.langKey || ''}`]}
                      </h6>
                    </div>}
                </div>
              </div>
            </div>
          </figcaption>
        </div>
        <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white py-3">
          {user?.role !== 'user' ?
            <div className="user fw-medium text-dark fs-7 d-flex align-items-center">
              <CustomImage
                src={item?.user?.profile_pic}
                alt=""
                className="me-2 user-img-updated rounded-circle"
                width={100}
                height={100}
              />
              <h5 className="single-text-truncate appointment_agent">
                {item?.user?.firstName} {item?.user?.lastName} <span>(+{item?.user?.country_code} {item?.user?.mobile})</span>
              </h5>
            </div> :
            <Link href={`/agents/${item?.agent?.slug}`} className="user fw-medium text-dark fs-7 d-flex align-items-center">
              <CustomImage
                src={item?.agent?.profilePic}
                alt=""
                className="me-2 user-img-updated rounded-circle"
                width={100}
                height={100}
              />
              {item?.agent?.firstName
                ? `${item?.agent?.firstName} ${item?.agent?.lastName}`
                : "Agent"}
            </Link>
          }

          <div className="social_achiv_left  d-flex align-items-center ms-auto">
            {user?.role === 'user' ?
              <button
                type="button"
                className={`btn_link d-flex align-items-center bg-green text-white mx-2 mx-sm-3 border-0 ${item?.isApprovedStatus == "rejected" && "bg-reject"
                  }`}
              >
                {t(upperCase(item?.isApprovedStatus))}
              </button> :
              item?.isApprovedStatus == "pending" ? (
                <>
                  <button
                    type='button'
                    className="btn_link d-flex align-items-center bg-green text-white bg-reject border-0"
                    onClick={() =>
                      openDialog({ id: item._id, status: "rejected" })
                    }
                  >
                    {t("REJECT")}
                  </button>
                  <button
                    type='button'
                    className="btn_link d-flex align-items-center bg-green text-white mx-2 mx-sm-3 border-0"
                    onClick={() =>
                      openDialog({ id: item._id, status: "accepted", item: item })
                    }
                  >
                    {t("ACCEPT")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={`btn_link d-flex align-items-center bg-green text-white mx-2 mx-sm-3 border-0 ${item?.isApprovedStatus == "rejected" && "bg-reject"
                    }`}
                >
                  {t(upperCase(item?.isApprovedStatus))}
                </button>
              )}
          </div>
        </div>
      </div>
      {open && (
        <Lightbox
          open={images}
          plugins={[Thumbnails]}
          close={() => setOpen(false)}
          slides={images}
        />
      )}
    </div>
  );
};

export default ManagePropertyCard;
