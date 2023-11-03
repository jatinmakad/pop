import React from "react";

const CompanyPropertyCard = () => {
  return (
    <div className="company-card-list">
      <div className="propertie_card_listView">
        <div className="d-md-flex">
          <figure className="position-relative">
            <div className="property-img">
              <img src="images/listview.png" />
            </div>
          </figure>
          <figcaption>
            <div className="propertie_detail_first bg-white h-auto">
              <div className="d-flex justify-content-between">
                <ul className="luxury-listing">
                  <li>Luxury living </li>
                  <li>Good View </li>
                  <li>High Floor </li>
                </ul>
                <a href="#" className="ms-auto me-2 me-lg-3 mt-1">
                  <img src="./images/heart_active.svg" alt="" />
                </a>
              </div>

              <div className="mb-2 aprt-list">
                <span className="d-block">Apartment</span>
                <span className="d-block">Commericial Buy</span>
              </div>

              <span
                className="fs-5 fw-medium text-dark d-block text-decoration-none mb-3"
                href="#"
              >
                From $87969
              </span>
              <span className="properties_location d-flex align-items-start">
                <img src="images/location.svg" className="me-2" /> A-463, Palm
                beach, Abu dhabi, Dubai
              </span>
            </div>
            <ul className="pro_feature d-flex align-items-center bg-light py-2 px-sm-3">
              <li className="d-flex align-items-center fs-7 fw-medium px-2  me-md-3">
                <img src="images/sqft.svg" className="me-2" />
                1200 Sqft
              </li>
              <li className="d-flex align-items-center fs-7 fw-medium px-2 me-md-3">
                <img src="images/bedroom.svg" className="me-2" />4 Bedroom
              </li>
              <li className="d-flex align-items-center fs-7 fw-medium px-2">
                <img src="images/bathroom.svg" className="me-2" />4 Bathroom
              </li>
            </ul>
          </figcaption>
        </div>
        <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
          <div className="d-flex align-items-center">
            <div className="common-profile">
              <img src="images/user1.png" alt="" />
            </div>
            <div className="figcaption">
              <h5 className="ps-3">Listed 10 days ago</h5>
            </div>
          </div>
          <span className="ps-3">658 views</span>

          <div className="social_achiv_left  d-flex align-items-center ms-auto">
            <a href="#" className="p-sm-3 py-3 px-2 border-start">
              <img src="images/phone-call.png" />
            </a>

            <a href="#" className="p-sm-3 py-3 px-2 border-start">
              <img src="images/whatsapp.png" />
            </a>

            <a href="#" className="p-sm-3 py-3 px-2 border-start">
              <img src="images/email.png" />
            </a>

            <a href="#" className="p-sm-3 py-3 px-2 border-start">
              <img src="images/share.svg" />
            </a>
            <a href="#" className="p-sm-3 py-3 px-2 border-start">
              <img src="images/report.svg" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPropertyCard;
