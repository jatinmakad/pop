import React, { useContext } from "react";
import DiscoverCard from "./components/DiscoverCard";
import { Container } from "react-bootstrap";
import BlogList from "./blog/Blog";
import SubscriptionCard from "./components/SubscriptionCard";
import CompanyBanner from "./components/CompanyBanner";
import AuthContext from "@/context/AuthContext";
import { isEmpty } from "lodash";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const CompanyHome = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  return (
    <>
      <Head>
        <title>Mada Properties : Home</title>
      </Head>
      <CompanyBanner />
      <DiscoverCard />
      {!isEmpty(user) && user?.role === "company" && (
        <section className="subscription-sec">
          <Container>
            <SubscriptionCard />
          </Container>
        </section>
      )}
      <div className="company-blog-sec blog">
        <div className="container">
          <div className="section_title">
            <h2 className="">
            {t("LATEST_PROPERTIES")} <span>{t("BLOGS")}</span>
            </h2>
          </div>
          <BlogList companyBlog="companyBlog" />
        </div>
      </div>
    </>
  );
};

export default CompanyHome;
