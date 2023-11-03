import React from "react";
import { Container } from "react-bootstrap";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

const CompanyBanner = () => {
  const { t } = useTranslation();
  var banner_slider = {
    dots: true,
    arrow: true,
    loop: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 3,
    autoplay: false,
    autoplaySpeed: 1500,
  };
  return (
    <>
      <section className="overflow-hidden banner-slider-sec">
        <div>
          <Slider {...banner_slider}>
            {Array(5)
              .fill()
              .map((item, index) => {
                return (
                  <div key={index}>
                    {" "}
                    <figure className="banner_pic position-relative">
                      <h1 className="text-white text-center mb-3 pb-2">
                      {t("LUXURY_HOMES_FOR_SALE_AND_BUY")}
                      </h1>
                      <img src="../images/banner-slider.jpg" />
                    </figure>
                  </div>
                );
              })}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default CompanyBanner;
