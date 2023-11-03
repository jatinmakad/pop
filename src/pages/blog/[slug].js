import React, { useState, useContext } from "react";
import Slider from "react-slick";
import {
  Tabs,
  InputGroup,
  Form,
  Card,
  Breadcrumb,
  Container,
  Col,
  Row,
} from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import apiPath from "../../utils/apiPath";
import { apiGet } from "../../utils/apiFetch";
import { useRouter } from "next/router";
import { useEffect } from "react";
import helpers from "../../utils/helpers";
import Link from "next/link";
import Head from "next/head";
import AuthContext from '@/context/AuthContext'
import BlogList from "./Blog";
import { useTranslation } from "react-i18next";

function BlogDetails() {
  const { t } = useTranslation();
  const [blogData, setBlogData] = useState({});
  const router = useRouter();
  const { direction } = useContext(AuthContext)
  const params = router.query.slug;

  const blogList = async () => {
    try {
      var path = apiPath.viewBlog;

      const result = await apiGet(path, { slug: params });
      var response = result?.data?.results;
      setBlogData(response);
    } catch (error) {
      console.log("error in get all users list==>>>>", error.message);
    }
  };
  console.log("params", params)

  useEffect(() => {
    blogList();
  }, [params]);

  var agentSlider = {
    dots: false,
    nav: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
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

  return (
    <>
      <div className="main_wrap blog-main">
        <Head>
          <title>Mada Properties : Blog - {blogData[`description${direction?.langKey || ''}`]}</title>
        </Head>
        <div className="breadcrum_Main pt-0">
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item href="/">{t("HOME")}</Breadcrumb.Item>
              <Breadcrumb.Item href="/blogs" active>{t("BLOG")}</Breadcrumb.Item>
              {/* <Breadcrumb.Item active>{blogData?.title}</Breadcrumb.Item> */}
            </Breadcrumb>
          </Container>
        </div>

        <section className="blog_detail">
          <Container>
            <Card className="border-0 blog-detail-card">
              <figure>
                <Card.Img
                  src={blogData?.image && blogData?.image}
                  className="card-img-top w-100"
                />
              </figure>
              <Card.Body className="pb-sm-4">
                {/* <div className="date">
                  <span>10</span>Mar
                </div> */}
                <div className="date">
                  <span>{helpers.dateFormat(blogData?.createdAt, "DD", {language: direction?.langKey})} </span>
                  {helpers.dateFormat(blogData?.createdAt, "MMM", {language: direction?.langKey})}
                </div>
                <h2 className="mb-3 mb-lg-4">
                  {blogData[`title${direction?.langKey || ""}`]}
                </h2>
                <div
                  dangerouslySetInnerHTML={{ __html: blogData[`description${direction?.langKey || ''}`]}}
                ></div>

                {/* <p>Dubai real estate is showing no signs of slowing down, despite the rising interest rate and inflation. The market recently witnessed a deal for the most expensive villa in Tilal Al Ghaf worth AED 90.5 million.</p>

                <p>The rising economy, the opportunity to earn high ROI, world-className attractions, and new developments – these are some of the major factors that attract many new HNWIs and foreign investors to the Dubai property market.</p>

                <p>However, it’s important that you know about the latest Dubai real estate laws in 2023 before venturing into the property market. This will ensure a smooth, complication-free transaction.</p>
                <h3>Dubai Strata Law</h3>
                <p>Dubai Starta Law is applicable to multi-unit developments. For example, if a building or development contains multiple units, it’s called a multi-unit development.</p>

                <p>The main principle of The Starta Law relates to the division of development into different units that can be owned privately. Furthermore, it also concerns jointly owned common areas of the development, such as parks, lobby, swimming pools, etc. An owners association is set up to manage these jointly-owned areas.</p>

                <p>The association is responsible for maintaining and managing these facilities and common areas.</p>
                <h3>For Real Estate Brokers</h3>
                <ul>
                  <li>Brokers are required to undergo training from Dubai Real Estate Institute before working in Dubai.</li>
                  <li>They must have a valid license, which can be obtained by passing a RERA exam.</li>
                  <li>They have to follow a set of guidelines when working with different clients.</li>
                </ul> */}
              </Card.Body>
            </Card>
          </Container>
        </section>
      </div>
      <section className="blog_detail">
        <div className="blog">
          <div className="container">
            <div className="section_title">
              <h2 className="text-black">
                {t("LATEST_PROPERTY")}{" "}
                <span> {t("LATEST_PROPERTY_BLOGS")}</span>
              </h2>
            </div>

            <BlogList />
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogDetails;
