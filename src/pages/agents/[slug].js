import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import {
  Tabs,
  Tab,
  Form,
  Breadcrumb,
  Collapse,
  Container,
  Col,
  Row,
  Button,
} from "react-bootstrap";
import { useRouter } from "next/router";
import apiPath from "../../utils/apiPath";
import { apiGet } from "../../utils/apiFetch";
import Link from "next/link";
import ManagePropertyCardNew from "../components/properties/ManagePropertyCardNew";
import AuthContext from "@/context/AuthContext";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { isEmpty } from "lodash";
import CustomImage from "../components/CustomImage";
import ReactShare from "../components/ReactShare";
import Head from "next/head";
import EmailDialogbox from "../components/EmailDialogbox";
import useToastContext from "@/hooks/useToastContext";
import { useTranslation } from "react-i18next";
function AgentDetails() {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = router.query.slug;
  const notifications = useToastContext();
  const [agentData, setAgentData] = useState({});
  const [propertyData, setPropertyData] = useState({});
  const [propertyDataList, setPropertyDataList] = useState([]);
  const [email, setEmail] = useState(false);
  const [totalDocs, setTotalDocs] = useState(0);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    sortType: "",
    type: "buy",
    priceType: "",
    sortKey: "",
  });

  const agentList = async () => {
    try {
      var path = apiPath.getAgentDetails;
      const result = await apiGet(path, { slug: params });
      var response = result?.data?.results;
      setAgentData(response);
      let obj = { ...filter, type: response?.properties?.length > 0 ? response?.properties[0]?.propertyType?.slug : 'buy' }
      setFilter(obj)
      propertyList(obj);
    } catch (error) {
      console.log("error in get all users list==>>>>", error.message);
    }
  };

  const propertyList = async (obj = filter, type) => {
    try {
      const { status, data } = await apiGet(apiPath.getPropertyDetails, {
        page: obj?.page || 1,
        limit: obj?.limit || filter?.limit,
        slug: params,
        type: obj?.type,
        sortKey: obj?.sortKey ? obj?.sortKey : "price",
        sortType: obj?.sortBy,
        // priceType:obj?.priceType
      });
      if (status == 200) {
        if (data.success) {
          setPropertyData(data.results);
          setTotalDocs(data.results.totalDocs);
          if (type == "add") {
            setPropertyDataList([...propertyDataList, ...data?.results?.docs]);
          } else {
            setPropertyDataList(data?.results?.docs);
          }
        }
      } else {
      }
    } catch (error) { }
  };

  useEffect(() => {
    agentList();
  }, [params]);

  const [shareButton, setShareButton] = useState(false);
  const [shareButtonLink, setShareButtonLink] = useState("");

  const shareFunction = (link) => {
    setShareButtonLink(link);
    setShareButton(true);
  };

  const handelChange = () => {
    setFilter({
      ...filter,
      page: filter.page + 1,
    });
    propertyList(
      {
        ...filter,
        page: filter.page + 1,
      },
      "add"
    );
  };
  return (
    <>
      <div className="main_wrap">
        <Head>
          <title>
            Mada Properties : Agent - {agentData?.firstName}{" "}
            {agentData?.lastName}
          </title>
        </Head>
        <div className="breadcrum_Main pt-0">
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item href="/">{t("HOME")}</Breadcrumb.Item>
              {user?.role === "company" || user?.role === "agent" ? (
                <Breadcrumb.Item href="/myAgents">
                  {t("MANAGE_AGENTS")}
                </Breadcrumb.Item>
              ) : (
                <Breadcrumb.Item href="/findAgent">
                  {t("FIND_AGENTS")}
                </Breadcrumb.Item>
              )}
              <Breadcrumb.Item active>
                {agentData?.firstName} {agentData?.lastName}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Container>
        </div>

        <section className="serach_result">
          <Container>
            <Row>
              <Col xl={9} className="">
                <div className="bg-white p-3 mb-3 rounded-3 agent_main d-flex flex-wrap">
                  <figure className="agent_pic">
                    <img src={agentData?.profilePic} />
                  </figure>
                  <figcaption className="pro_agent_detail">
                    <div className="agent_head d-flex justify-content-between w-100">
                      <h2>
                        {agentData?.firstName} {agentData?.lastName}
                        <br />
                        <small>{agentData?.designation}</small>
                      </h2>
                      <a href="#">
                        <CustomImage
                          width={100}
                          height={100}
                          src={
                            !isEmpty(agentData)
                              ? agentData?.company?.logo
                              : "/images/logo.svg"
                          }
                        />
                      </a>
                    </div>

                    <div className="pro_info_li">
                      <ul>
                        <li className="d-flex align-items-center">
                          {t("NATIONALITY")}:
                          <span
                            className="d-inline-block text-green ms-2"
                            title={agentData?.nationality}
                          >
                            {agentData?.nationality}
                          </span>
                        </li>
                        <li className="d-flex align-items-center justify-content-sm-end">
                          {t("LANGUAGE")}
                          <span
                            className="d-inline-block text-green ms-2 text-truncate"
                            title={agentData?.language}
                          >
                            {agentData?.language}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <hr />

                    <div className="pro_info_li pt-0">
                      <ul>
                        <li>
                          {t("ACTIVE_LISTINGS")}
                          <span className="text-dark ms-2 fw-medium">
                            {agentData?.propertyCount} {t("PROPERTIES")}
                          </span>
                        </li>
                        <li>
                          {t("BRN")}:
                          <span className="text-dark ms-2 fw-medium">
                            {agentData?.brn}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </figcaption>
                </div>

                <div className="filter_form_wrap">
                  <Tabs
                    defaultActiveKey="agent_property"
                    id="justify-tab-example"
                    className="mb-3"
                    justify
                  >
                    <Tab eventKey="about_me" title={t("ABOUT_ME")}>
                      <div>
                        {!isEmpty(agentData?.bio) ? (
                          agentData?.bio
                        ) : (
                          <p>{t("NO_BIO_FOUND")}</p>
                        )}
                      </div>
                    </Tab>
                    <Tab
                      eventKey="agent_property"
                      title={`${t("AGENT_PROPERTIES")} (${agentData?.propertyCount || 0
                        })`}
                    >
                      <div className="py-3">
                        <div className="d-sm-flex justify-content-between flex-wrap align-itmes-center mb-4">
                          <Form className="d-flex align-items-center agent_filter agent_filter_detail">
                            <label htmlFor="" className="me-2 fs-6 text-nowrap">
                              {t("SORT_BY")}
                            </label>
                            <select
                              value={filter?.sortBy}
                              onChange={(e) => {
                                let obj = {
                                  ...filter,
                                  sortBy: e.target.value,
                                };
                                setFilter(obj);
                                propertyList(obj, "");
                              }}
                              className="form-control fs-6 me-3"
                            >
                              <option value="">{t("NEWEST")}</option>
                              <option value="asc">{t("PRICE_ASC")}</option>
                              <option value="desc">{t("PRICE_DESC")}</option>
                            </select>
                            <select
                              value={filter?.type}
                              onChange={(e) => {
                                setFilter({
                                  ...filter,
                                  type: e.target.value,
                                  sortKey:
                                    e?.target?.value === "buy" ||
                                      e?.target?.value === "commercial-buy"
                                      ? "price"
                                      : "",
                                  priceType:
                                    e?.target?.value === "buy" ||
                                      e?.target?.value === "commercial-buy"
                                      ? ""
                                      : filter?.priceType,
                                });
                                propertyList({
                                  ...filter,
                                  type: e.target.value,
                                  sortKey:
                                    e?.target?.value === "buy" ||
                                      e?.target?.value === "commercial-buy"
                                      ? "price"
                                      : "",
                                  priceType:
                                    e?.target?.value === "buy" ||
                                      e?.target?.value === "commercial-buy"
                                      ? ""
                                      : filter?.priceType,
                                });
                              }}
                              className="form-control me-3 fs-6"
                            >
                              <option value="buy">
                                {t("RESIDENTIAL_BUY")}
                              </option>
                              <option value="rent">
                                {t("RESIDENTIAL_RENT")}
                              </option>
                              <option value="commercial-buy">
                                {t("COMMERCIAL_BUY")}
                              </option>
                              <option value="commercial-rent">
                                {t("COMMERCIAL_RENT")}
                              </option>
                            </select>
                            {(filter?.type == "commercial-rent" ||
                              filter?.type === "rent") && (
                                <select
                                  value={filter?.priceType}
                                  onChange={(e) => {
                                    setFilter({
                                      ...filter,
                                      priceType: e.target.value,
                                      sortKey: e.target.value,
                                    });
                                    propertyList({
                                      ...filter,
                                      priceType: e.target.value,
                                      sortKey: e.target.value,
                                    });
                                  }}
                                  className="form-control fs-6"
                                >
                                  <option defaultValue value="">
                                    All
                                  </option>
                                  <option value="priceDaily">Daily</option>
                                  <option value="priceWeekly">Weekly</option>
                                  <option value="priceMonthly">Monthly</option>
                                  <option value="priceYearly">Yearly</option>
                                </select>
                              )}
                          </Form>
                          <div className="total_property">
                            {t("TOTAL_PROPERTIES")}{" "}
                            <span className="fw-medium">{totalDocs}</span>
                          </div>
                        </div>
                        <div className="result">
                          {propertyDataList?.length > 0 &&
                            propertyDataList?.map((item, index) => {
                              return (
                                <ManagePropertyCardNew
                                  setImages={setImages}
                                  setOpen={setOpen}
                                  key={index}
                                  item={item}
                                  user={user}
                                  agentData={agentData}
                                  type={"agent"}
                                  showLike={
                                    isEmpty(user)
                                      ? true
                                      : user?.role == "user"
                                        ? true
                                        : false
                                  }
                                  showEmail={
                                    isEmpty(user)
                                      ? true
                                      : user?.role == "user"
                                        ? true
                                        : false
                                  }
                                  showWhatsApp={
                                    isEmpty(user)
                                      ? true
                                      : user?.role == "user"
                                        ? true
                                        : false
                                  }
                                  shareFunction={shareFunction}
                                  showAgent={"no"}
                                />
                              );
                            })}
                          {propertyDataList?.length == 0 && (
                            <h2 className="w-100 d-flex justify-content-center">
                              {t("NO_RECORD_FOUND")}
                            </h2>
                          )}
                          {propertyData?.totalPages !== propertyData.page && (
                            <div className="text-center loadMore mt-4 mt-md-5 mb-5 mb-xl-0">
                              <Button
                                onClick={() => handelChange()}
                                className="border-green rounded text-green fw-medium fs-5 text-white"
                              >
                                {t("LOAD_MORE")}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </Col>

              <Col xl={3} className="text-center">
                <div className="list_property_box d-flex flex-column justify-content-center align-items-center rounded px-2 mb-3">
                  <h2 className="text-white mb-2">{t("CONTACT_THIS_AGENT")}</h2>
                  <div className="contact_agent d-flex">
                    <a
                      href={
                        isEmpty(user)
                          ? "#"
                          : `tel:${agentData?.countryCode + agentData?.mobile}`
                      }
                      onClick={() => {
                        if (isEmpty(user)) {
                          notifications.success(
                            "Please login to contact agent."
                          );
                        }
                      }}
                      className="btn theme_btn mt-3"
                    >
                      <span className="me-2">
                        <img src="/images/call.svg" />
                      </span>
                      {t("CALL")}
                    </a>
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        if (!isEmpty(user)) {
                          setEmail(true);
                        } else {
                          notifications.success(
                            "Please login to contact agent."
                          );
                        }
                      }}
                      className="btn theme_btn mt-3"
                    >
                      <span className="me-2">
                        <img src="/images/email.svg" />
                      </span>
                      {t("EMAIL")}
                    </a>
                    {/* <Link
											onClick={() => {
												if (isEmpty(user)) {
													notifications.success("Please login to contact agent.");
												}
											}}
											href={isEmpty(user) ? "#" : `https://api.whatsapp.com/send/?phone=${agentData?.countryCode + agentData?.mobile}&text&type=phone_number&app_absent=0`}
											className="btn mt-2"
										>
											<img src="/images/whatsapp.svg" />
										</Link> */}
                  </div>
                </div>

                <div className="bg-white p-3 p-sm-4 p-lg-3 mb-3 rounded">
                  <div className="inner_heading mb-2 mb-md-3 text-start">
                    <h2 className="fs-4">{t("COMPANY")}</h2>
                    <hr />
                  </div>

                  <div className="compny_profile d-flex flex-wrap justify-content-between mb-2">
                    <h3 className="fs-5 mb-1">
                      {!isEmpty(agentData)
                        ? agentData?.company?.name || "Mada Properties"
                        : "Mada Properties"}
                    </h3>
                    <a href={agentData?.parentType !== "admin" ? `/company/${agentData?.company?.slug}` : 'javascript:void(0)'} className="agent_sidebar_logo">
                      <CustomImage
                        width={100}
                        height={100}
                        src={
                          !isEmpty(agentData)
                            ? agentData?.company?.logo
                            : "/images/logo.svg"
                        }
                      />
                    </a>
                  </div>
                  {agentData?.parentType !== "admin" && (
                    <Link
                      href={`/company/${agentData?.company?.slug}`}
                      className="text-blue d-block text-start pb-3"
                    >
                      {t("VIEW_PROFILE")}
                    </Link>
                  )}
                </div>
                <div className="text-center">
                  <img src="/images/advertisement.jpg" />{" "}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      {open && (
        <Lightbox
          open={open}
          plugins={[Thumbnails]}
          close={() => setOpen(false)}
          slides={images}
        />
      )}
      {shareButton && (
        <ReactShare
          shareButton={shareButton}
          setShareButton={setShareButton}
          link={shareButtonLink}
        />
      )}
      {email && (
        <EmailDialogbox
          type="agent"
          open={email}
          agentData={agentData}
          onHide={() => setEmail(false)}
        />
      )}
    </>
  );
}

export default AgentDetails;
