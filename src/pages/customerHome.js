import React, { useContext, useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Form,
  Button,
  Collapse,
  Container,
  Card,
} from "react-bootstrap";
import Slider from "react-slick";
import Link from "next/link";
import Download from "./Downloads/Download";
import Rent from "./NewProperties/RentProperties";
import Sale from "./NewProperties/SaleProperties";
import DiscoverCard from "./components/DiscoverCard";
import BlogList from "./blog/Blog";
import { useTranslation } from "react-i18next";
import SearchForm from "./components/SearchForm";
import RequirementDialogBox from "./components/RequirementDialogBox";
import AuthContext from "@/context/AuthContext";
import { NextSeo } from "next-seo";
import { apiGet } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
const CustomerHome = () => {
  const { t } = useTranslation();
  const [key, setKey] = useState("buy");
  const [open, setOpen] = useState(false);
  const { slugCondition } = useContext(AuthContext);
  const [banner, setBanner] = useState([])
  useEffect(() => {
    if (!slugCondition?.includes("buy")) {
      if (slugCondition?.includes("rent")) {
        setKey("rent");
      }
    }
  }, [slugCondition]);

  const getData = async () => {
    try {
      const { status, data } = await apiGet(apiPath.getCustomerBanner)
      if (status == 200) {
        if (data.success) {
          setBanner(data.results)
        }
      }
    } catch (error) { }
  }

  useEffect(() => {
    getData()
  }, [])

  var home_banner_slider = {
    dots: false,
    arrow: false,
    loop: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <>
      <section className="banner home_banner">
        <NextSeo
          title="Find Your Dream Property in UAE - Mada Finder"
          description="Explore a wide range of properties for sale and rent in UAE/Saudi Arabia. Discover your dream home, apartment, villa, or commercial space with [Website Name]. Start your property search now!"
        />

        <Slider {...home_banner_slider}>
          {banner?.length > 0 ? banner?.map((res, index) => {
            return <div key={index} className="banner_item">
              <figure style={{height: "600px", }}><img style={{ width: "100%", objectFit: "cover" }} src={res?.bannerImage} /></figure>
            </div>
          }) : <div className="banner_item">
            <figure><img src="../images/banner.jpg" /></figure>
          </div>}


          {/* <div className="banner_item">
              <figure><img src="../images/banner.jpg" /></figure>
          </div> */}

        </Slider>

        <div className="filter_box">
          <h1 className="text-white text-center mb-3 pb-2">
            {t("CUSTOMER_HOME_EASIEST")}
          </h1>

          {(slugCondition?.includes("buy") ||
            slugCondition?.includes("rent")) && (
              <div className="filter_form_wrap">
                <Tabs
                  activeKey={key}
                  id="justify-tab-example"
                  className="mb-3"
                  justify
                  onSelect={(k) => setKey(k)}
                >
                  {slugCondition?.includes("buy") && (
                    <Tab eventKey="buy" title={t("CUSTOMER_HOME_BUY")}>
                      {key === "buy" && <SearchForm tab={key} page="home" />}
                    </Tab>
                  )}
                  {slugCondition?.includes("rent") && (
                    <Tab eventKey="rent" title={t("CUSTOMER_HOME_RENT")}>
                      {key === "rent" && <SearchForm tab={key} page="home" />}
                    </Tab>
                  )}
                </Tabs>
              </div>
            )}
        </div>
      </section>
      {/* home search easy */}
      <DiscoverCard />
      {/* selling-option */}
      <section className="selling_option">
        <Container>
          <div className="selling_content_wrap">
            <div className="section_title">
              <h2 className="text-white mb-2">
                {t("CUSTOMER_HOME_RIGHT_OPTION")}{" "}
                <span>{t("CUSTOMER_HOME_FOR_YOU")}</span>
              </h2>
              <p className="fs-18 text-white">
                {t("CUSTOMER_HOME_COMPLEXITY")}
              </p>
            </div>

            <div className="selling_point">
              <ul>
                <li>
                  <span>
                    <img src="images/tick.svg" />
                  </span>
                  {t("CUSTOMER_HOME_FIND_EXCELLENT")}
                </li>
                <li>
                  <span>
                    <img src="images/tick.svg" />
                  </span>
                  {t("CUSTOMER_HOME_FRIENDLY")}
                </li>
                <li>
                  <span>
                    <img src="images/tick.svg" />
                  </span>
                  {t("CUSTOMER_HOME_OWN_PROPERTY")}
                </li>
              </ul>

              <button
                onClick={() => setOpen(true)}
                className="btn theme_btn mt-3"
              >
                {t("CUSTOMER_HOME_SHARE_REQUIREMENT")}
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* propertie_for_rent */}

      <Rent />
      <Sale type="buy" />

      <div className="ad">
        <div className="container text-center">
          <img src="images/ad.png" />
        </div>
      </div>

      {/* <div className='agents'>
      <div className='container'>
        <div className='section_title'>
          <h2>
            Dedicated <span>Agents</span>
          </h2>
          <p>Find a local real estate agent</p>
        </div>
        <Slider {...agentSlider} className='SliderNav'>
          <div>
            <Card className='mx-2'>
              <Card.Img src='images/agent1.jpg' className='card-img-top' />
              <Card.Body>
                <Card.Title className='fs-5'>Emmy Doe</Card.Title>
                <div className='d-flex align-items-center'>
                  <Card.Text>Empro Properties</Card.Text>
                  <span className='ms-auto rounded-pill bg-warning text-white d-flex align-items-center fs-7 px-2 py-1'>
                    <img className='me-1' src='images/star.svg' alt='...' />{' '}
                    4.8
                  </span>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div>
            <Card className='mx-2'>
              <Card.Img src='images/agent2.jpg' className='card-img-top' />
              <Card.Body>
                <Card.Title className='fs-5'>Emmy Doe</Card.Title>
                <div className='d-flex align-items-center'>
                  <Card.Text>Empro Properties</Card.Text>
                  <span className='ms-auto rounded-pill bg-warning text-white d-flex align-items-center fs-7 px-2 py-1'>
                    <img className='me-1' src='images/star.svg' alt='...' />{' '}
                    4.8
                  </span>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div>
            <Card className='mx-2'>
              <Card.Img src='images/agent3.jpg' className='card-img-top' />
              <Card.Body>
                <Card.Title className='fs-5'>Emmy Doe</Card.Title>
                <div className='d-flex align-items-center'>
                  <Card.Text>Empro Properties</Card.Text>
                  <span className='ms-auto rounded-pill bg-warning text-white d-flex align-items-center fs-7 px-2 py-1'>
                    <img className='me-1' src='images/star.svg' alt='...' />{' '}
                    4.8
                  </span>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div>
            <div>
              <Card className='mx-2'>
                <Card.Img src='images/agent4.jpg' className='card-img-top' />
                <Card.Body>
                  <Card.Title className='fs-5'>Emmy Doe</Card.Title>
                  <div className='d-flex align-items-center'>
                    <Card.Text>Empro Properties</Card.Text>
                    <span className='ms-auto rounded-pill bg-warning text-white d-flex align-items-center fs-7 px-2 py-1'>
                      <img className='me-1' src='images/star.svg' alt='...' />{' '}
                      4.8
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Slider>
      </div>
    </div> */}

      <div className="blog">
        <div className="container">
          <div className="section_title">
            <h2 className="text-white">
              {t("LATEST_PROPERTY")} <span> {t("LATEST_PROPERTY_BLOGS")}</span>
            </h2>
          </div>

          <BlogList />
        </div>
        <div className="text-center loadMore mt-4 mt-md-5 mb-2 mb-sm-3 mb-xl-0">
          <Link
            href="/blogs"
            className="border-green rounded text-green fw-medium fs-5"
          >
            {t("VIEW_ALL")}
          </Link>
        </div>
      </div>

      <Download />
      {open && (
        <RequirementDialogBox open={open} onHide={() => setOpen(false)} />
      )}
    </>
  );
};

export default CustomerHome;
