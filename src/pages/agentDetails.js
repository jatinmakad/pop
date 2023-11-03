import React from "react";
import {
  Tabs,
  Tab,
  Form,
  Breadcrumb,
  Container,
  Col,
  Row,
} from "react-bootstrap";

function AgentDetails() {
  return (
    <>
      <div className="main_wrap">
        <div className="breadcrum_Main pt-0">
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="#">Manage Property</Breadcrumb.Item>
              <Breadcrumb.Item active>Add Property</Breadcrumb.Item>
            </Breadcrumb>
          </Container>
        </div>

        <section className="serach_result">
          <Container>
            <Row>
              <Col xl={9}>
                <div className="bg-white p-3 mb-3 rounded-3 agent_main d-flex flex-wrap">
                  <figure className="agent_pic">
                    <img src="images/agent.png" />
                  </figure>
                  <figcaption className="pro_agent_detail">
                    <div className="agent_head d-flex justify-content-between w-100">
                      <h2>
                        Emmy Doe
                        <br />
                        <small>Property Advisor</small>
                      </h2>
                      <a href="#">
                        <img src="images/logo.svg" />
                      </a>
                    </div>

                    <div className="pro_info_li">
                      <ul>
                        <li>
                          Nationality:
                          <span className="text-green ms-2">India</span>
                        </li>
                        <li>
                          Languages:
                          <span className="text-green ms-2">
                            English, Arabic
                          </span>
                        </li>
                      </ul>
                    </div>

                    <hr />

                    <div className="pro_info_li pt-0">
                      <ul>
                        <li>
                          Active Listings:
                          <span className="text-dark ms-2 fw-medium">
                            32 Properties
                          </span>
                        </li>
                        <li>
                          BRN:
                          <span className="text-dark ms-2 fw-medium">
                            8452254
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
                    <Tab eventKey="about_me" title="About Me">
                      <div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industrys standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen book.
                        </p>
                        <p>
                          {" "}
                          It has survived not only five centuries, but also the
                          leap into electronic typesetting, remaining
                          essentially unchanged. It was popularised in the 1960s
                          with the release of Letraset sheets containing Lorem
                          Ipsum passages, and more recently with desktop
                          publishing software like Aldus PageMaker including
                          versions of Lorem Ipsum.
                        </p>
                      </div>
                    </Tab>
                    <Tab eventKey="agent_property" title="My Properties(32)">
                      <div className="py-3">
                        <div className="d-flex justify-content-between flex-wrap align-itmes-center mb-4">
                          <Form className="d-flex align-items-center agent_filter">
                            <label htmlFor="" className="me-2 fs-6 text-nowrap">
                              Sort by:
                            </label>
                            <select
                              name=""
                              id=""
                              className="form-select fs-6 me-3"
                            >
                              <option value="">Featured</option>
                            </select>
                            <select name="" id="" className="form-control fs-6">
                              <option value="">Residential Buy</option>
                            </select>
                          </Form>
                          <div className="total_property">
                            Total Propeties:<span className="fw-medium">7</span>
                          </div>
                        </div>
                        <div className="result">
                          <div className="propertie_card_listView">
                            <div className="d-md-flex">
                              <figure className="position-relative">
                                <a href="#">
                                  <img src="images/listview.png" />
                                  <span className="img_count">
                                    <img src="images/img.svg" />
                                    03
                                  </span>
                                </a>
                              </figure>
                              <figcaption>
                                <div className="propertie_detail_first bg-white h-auto">
                                  <div className="price_tag mb-2">
                                    <strong className="price">
                                      326.00 SAR<small>/Month</small>
                                    </strong>
                                    <a
                                      href="#"
                                      className="ms-auto me-2 me-lg-3 mt-1"
                                    >
                                      <img
                                        src="./images/heart_active.svg"
                                        alt=""
                                      />
                                    </a>
                                    <span className="apartment px-1 py-1">
                                      Apartment
                                    </span>
                                  </div>
                                  <a
                                    className="fs-5 fw-medium text-dark d-block text-decoration-none mb-3"
                                    href="#"
                                  >
                                    Contemporary apartment
                                  </a>
                                  <span className="properties_location d-flex align-items-start">
                                    <img
                                      src="images/location.svg"
                                      className="me-2"
                                    />{" "}
                                    A-463, Palm beach, Abu dhabi, Dubai
                                  </span>

                                  <div className="social_achiv_left d-flex align-items-center mt-3 fs-7">
                                    <span className="d-flex align-items-center pe-3">
                                      <img
                                        src="images/watch.png"
                                        className="me-2"
                                      />
                                      10 Days ago
                                    </span>
                                    <span className="pe-3 border-end">
                                      658 Views
                                    </span>
                                  </div>
                                </div>
                                <ul className="pro_feature d-flex align-items-center bg-light py-2 px-sm-2">
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2  me-md-3">
                                    <img
                                      src="images/sqft.svg"
                                      className="me-2"
                                    />
                                    1200 Sqft
                                  </li>
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2 me-md-3">
                                    <img
                                      src="images/bedroom.svg"
                                      className="me-2"
                                    />
                                    4 Bedroom
                                  </li>
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2">
                                    <img
                                      src="images/bathroom.svg"
                                      className="me-2"
                                    />
                                    4 Bathroom
                                  </li>
                                </ul>
                              </figcaption>
                            </div>
                            <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
                              <div className="user fw-medium text-dark fs-7 d-flex align-items-center">
                                <img
                                  src="images/user1.png"
                                  alt=""
                                  className="me-2"
                                />
                                Andrew Van Wyk
                              </div>

                              <div className="social_achiv_left  d-flex align-items-center ms-auto">
                                <a
                                  href="#"
                                  className="btn_link  d-flex align-items-center bg-green text-white"
                                >
                                  <img
                                    src="images/call.svg"
                                    className="me-sm-2"
                                  />{" "}
                                  Call
                                </a>
                                <a
                                  href="#"
                                  className="btn_link d-flex align-items-center bg-green text-white ms-2 ms-sm-3"
                                >
                                  <img
                                    src="images/mail.svg"
                                    className="me-sm-2"
                                  />{" "}
                                  Email
                                </a>
                                <a
                                  href="#"
                                  className="mx-sm-3 mx-2 d-flex align-items-center"
                                >
                                  <img src="images/whatsapp.svg" />
                                </a>
                                <a
                                  href="#"
                                  className="p-sm-3 py-3 px-2 border-start"
                                >
                                  <img src="images/share.svg" />
                                </a>
                                <a
                                  href="#"
                                  className="p-sm-3 py-3 px-2 border-start"
                                >
                                  <img src="images/like.svg" />
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="propertie_card_listView">
                            <div className="d-md-flex">
                              <figure className="position-relative">
                                <a href="#">
                                  <img src="images/listview.png" />
                                  <span className="img_count">
                                    <img src="images/img.svg" />
                                    03
                                  </span>
                                </a>
                              </figure>
                              <figcaption>
                                <div className="propertie_detail_first bg-white h-auto">
                                  <div className="price_tag mb-2">
                                    <strong className="price">
                                      326.00 SAR<small>/Month</small>
                                    </strong>
                                    <a
                                      href="#"
                                      className="ms-auto me-2 me-lg-3 mt-1"
                                    >
                                      <img
                                        src="./images/heart_active.svg"
                                        alt=""
                                      />
                                    </a>
                                    <span className="apartment px-1 py-1">
                                      Apartment
                                    </span>
                                  </div>
                                  <a
                                    className="fs-5 fw-medium text-dark d-block text-decoration-none mb-3"
                                    href="#"
                                  >
                                    Contemporary apartment
                                  </a>
                                  <span className="properties_location d-flex align-items-start">
                                    <img
                                      src="images/location.svg"
                                      className="me-2"
                                    />{" "}
                                    A-463, Palm beach, Abu dhabi, Dubai
                                  </span>

                                  <div className="social_achiv_left d-flex align-items-center mt-3 fs-7">
                                    <span className="d-flex align-items-center pe-3">
                                      <img
                                        src="images/watch.png"
                                        className="me-2"
                                      />
                                      10 Days ago
                                    </span>
                                    <span className="pe-3 border-end">
                                      658 Views
                                    </span>
                                  </div>
                                </div>
                                <ul className="pro_feature d-flex align-items-center bg-light py-2 px-sm-2">
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2  me-md-3">
                                    <img
                                      src="images/sqft.svg"
                                      className="me-2"
                                    />
                                    1200 Sqft
                                  </li>
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2 me-md-3">
                                    <img
                                      src="images/bedroom.svg"
                                      className="me-2"
                                    />
                                    4 Bedroom
                                  </li>
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2">
                                    <img
                                      src="images/bathroom.svg"
                                      className="me-2"
                                    />
                                    4 Bathroom
                                  </li>
                                </ul>
                              </figcaption>
                            </div>
                            <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
                              <div className="user fw-medium text-dark fs-7 d-flex align-items-center">
                                <img
                                  src="images/user1.png"
                                  alt=""
                                  className="me-2"
                                />
                                Andrew Van Wyk
                              </div>

                              <div className="social_achiv_left  d-flex align-items-center ms-auto">
                                <a
                                  href="#"
                                  className="btn_link  d-flex align-items-center bg-green text-white"
                                >
                                  <img
                                    src="images/call.svg"
                                    className="me-sm-2"
                                  />{" "}
                                  Call
                                </a>
                                <a
                                  href="#"
                                  className="btn_link d-flex align-items-center bg-green text-white ms-2 ms-sm-3"
                                >
                                  <img
                                    src="images/mail.svg"
                                    className="me-sm-2"
                                  />{" "}
                                  Email
                                </a>
                                <a
                                  href="#"
                                  className="mx-sm-3 mx-2 d-flex align-items-center"
                                >
                                  <img src="images/whatsapp.svg" />
                                </a>
                                <a
                                  href="#"
                                  className="p-sm-3 py-3 px-2 border-start"
                                >
                                  <img src="images/share.svg" />
                                </a>
                                <a
                                  href="#"
                                  className="p-sm-3 py-3 px-2 border-start"
                                >
                                  <img src="images/like.svg" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="propertie_card_listView">
                            <div className="d-md-flex">
                              <figure className="position-relative">
                                <a href="#">
                                  <img src="images/listview.png" />
                                  <span className="img_count">
                                    <img src="images/img.svg" />
                                    03
                                  </span>
                                </a>
                              </figure>
                              <figcaption>
                                <div className="propertie_detail_first bg-white h-auto">
                                  <div className="price_tag mb-2">
                                    <strong className="price">
                                      326.00 SAR<small>/Month</small>
                                    </strong>
                                    <a
                                      href="#"
                                      className="ms-auto me-2 me-lg-3 mt-1"
                                    >
                                      <img
                                        src="./images/heart_active.svg"
                                        alt=""
                                      />
                                    </a>
                                    <span className="apartment px-1 py-1">
                                      Apartment
                                    </span>
                                  </div>
                                  <a
                                    className="fs-5 fw-medium text-dark d-block text-decoration-none mb-3"
                                    href="#"
                                  >
                                    Contemporary apartment
                                  </a>
                                  <span className="properties_location d-flex align-items-start">
                                    <img
                                      src="images/location.svg"
                                      className="me-2"
                                    />{" "}
                                    A-463, Palm beach, Abu dhabi, Dubai
                                  </span>

                                  <div className="social_achiv_left d-flex align-items-center mt-3 fs-7">
                                    <span className="d-flex align-items-center pe-3">
                                      <img
                                        src="images/watch.png"
                                        className="me-2"
                                      />
                                      10 Days ago
                                    </span>
                                    <span className="pe-3 border-end">
                                      658 Views
                                    </span>
                                  </div>
                                </div>
                                <ul className="pro_feature d-flex align-items-center bg-light py-2 px-sm-2">
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2  me-md-3">
                                    <img
                                      src="images/sqft.svg"
                                      className="me-2"
                                    />
                                    1200 Sqft
                                  </li>
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2 me-md-3">
                                    <img
                                      src="images/bedroom.svg"
                                      className="me-2"
                                    />
                                    4 Bedroom
                                  </li>
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2">
                                    <img
                                      src="images/bathroom.svg"
                                      className="me-2"
                                    />
                                    4 Bathroom
                                  </li>
                                </ul>
                              </figcaption>
                            </div>
                            <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
                              <div className="user fw-medium text-dark fs-7 d-flex align-items-center">
                                <img
                                  src="images/user1.png"
                                  alt=""
                                  className="me-2"
                                />
                                Andrew Van Wyk
                              </div>

                              <div className="social_achiv_left  d-flex align-items-center ms-auto">
                                <a
                                  href="#"
                                  className="btn_link  d-flex align-items-center bg-green text-white"
                                >
                                  <img
                                    src="images/call.svg"
                                    className="me-sm-2"
                                  />{" "}
                                  Call
                                </a>
                                <a
                                  href="#"
                                  className="btn_link d-flex align-items-center bg-green text-white ms-2 ms-sm-3"
                                >
                                  <img
                                    src="images/mail.svg"
                                    className="me-sm-2"
                                  />{" "}
                                  Email
                                </a>
                                <a
                                  href="#"
                                  className="mx-sm-3 mx-2 d-flex align-items-center"
                                >
                                  <img src="images/whatsapp.svg" />
                                </a>
                                <a
                                  href="#"
                                  className="p-sm-3 py-3 px-2 border-start"
                                >
                                  <img src="images/share.svg" />
                                </a>
                                <a
                                  href="#"
                                  className="p-sm-3 py-3 px-2 border-start"
                                >
                                  <img src="images/like.svg" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="propertie_card_listView">
                            <div className="d-md-flex">
                              <figure className="position-relative">
                                <a href="#">
                                  <img src="images/listview.png" />
                                  <span className="img_count">
                                    <img src="images/img.svg" />
                                    03
                                  </span>
                                </a>
                              </figure>
                              <figcaption>
                                <div className="propertie_detail_first bg-white h-auto">
                                  <div className="price_tag mb-2">
                                    <strong className="price">
                                      326.00 SAR<small>/Month</small>
                                    </strong>
                                    <a
                                      href="#"
                                      className="ms-auto me-2 me-lg-3 mt-1"
                                    >
                                      <img
                                        src="./images/heart_active.svg"
                                        alt=""
                                      />
                                    </a>
                                    <span className="apartment px-1 py-1">
                                      Apartment
                                    </span>
                                  </div>
                                  <a
                                    className="fs-5 fw-medium text-dark d-block text-decoration-none mb-3"
                                    href="#"
                                  >
                                    Contemporary apartment
                                  </a>
                                  <span className="properties_location d-flex align-items-start">
                                    <img
                                      src="images/location.svg"
                                      className="me-2"
                                    />{" "}
                                    A-463, Palm beach, Abu dhabi, Dubai
                                  </span>

                                  <div className="social_achiv_left d-flex align-items-center mt-3 fs-7">
                                    <span className="d-flex align-items-center pe-3">
                                      <img
                                        src="images/watch.png"
                                        className="me-2"
                                      />
                                      10 Days ago
                                    </span>
                                    <span className="pe-3 border-end">
                                      658 Views
                                    </span>
                                  </div>
                                </div>
                                <ul className="pro_feature d-flex align-items-center bg-light py-2 px-sm-2">
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2  me-md-3">
                                    <img
                                      src="images/sqft.svg"
                                      className="me-2"
                                    />
                                    1200 Sqft
                                  </li>
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2 me-md-3">
                                    <img
                                      src="images/bedroom.svg"
                                      className="me-2"
                                    />
                                    4 Bedroom
                                  </li>
                                  <li className="d-flex align-items-center fs-7 fw-medium px-2">
                                    <img
                                      src="images/bathroom.svg"
                                      className="me-2"
                                    />
                                    4 Bathroom
                                  </li>
                                </ul>
                              </figcaption>
                            </div>
                            <div className="social_achiv border-top  d-flex align-items-center ps-3 bg-white">
                              <div className="user fw-medium text-dark fs-7 d-flex align-items-center">
                                <img
                                  src="images/user1.png"
                                  alt=""
                                  className="me-2"
                                />
                                Andrew Van Wyk
                              </div>

                              <div className="social_achiv_left  d-flex align-items-center ms-auto">
                                <a
                                  href="#"
                                  className="btn_link  d-flex align-items-center bg-green text-white"
                                >
                                  <img
                                    src="images/call.svg"
                                    className="me-sm-2"
                                  />{" "}
                                  Call
                                </a>
                                <a
                                  href="#"
                                  className="btn_link d-flex align-items-center bg-green text-white ms-2 ms-sm-3"
                                >
                                  <img
                                    src="images/mail.svg"
                                    className="me-sm-2"
                                  />{" "}
                                  Email
                                </a>
                                <a
                                  href="#"
                                  className="mx-sm-3 mx-2 d-flex align-items-center"
                                >
                                  <img src="images/whatsapp.svg" />
                                </a>
                                <a
                                  href="#"
                                  className="p-sm-3 py-3 px-2 border-start"
                                >
                                  <img src="images/share.svg" />
                                </a>
                                <a
                                  href="#"
                                  className="p-sm-3 py-3 px-2 border-start"
                                >
                                  <img src="images/like.svg" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="text-center loadMore mt-4 mt-md-5 mb-5 mb-xl-0">
                            <a
                              href="#"
                              className="border-green rounded text-green fw-medium fs-5"
                            >
                              Load more...
                            </a>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </Col>

              <Col xl={3} className="text-center">
                <div className="list_property_box d-flex flex-column justify-content-center align-items-center rounded px-2 mb-3">
                  <h2 className="text-white mb-2">Contact this agent</h2>
                  <div className="contact_agent d-flex">
                    <a href="#" className="btn theme_btn mt-3">
                      <span className="me-2">
                        <img src="images/call.svg" />
                      </span>
                      Call
                    </a>
                    <a href="#" className="btn theme_btn mt-3">
                      <span className="me-2">
                        <img src="images/email.svg" />
                      </span>
                      Email
                    </a>
                  </div>
                </div>

                <div className="bg-white p-3 p-sm-4 p-lg-3 mb-3 rounded">
                  <div className="inner_heading mb-2 mb-md-3 text-start">
                    <h2 className="fs-4">Company</h2>
                    <hr />
                  </div>

                  <div className="compny_profile d-flex flex-wrap justify-content-between mb-2">
                    <h3 className="fs-5 mb-1">Mada Properties</h3>
                    <a href="#" className="agent_sidebar_logo">
                      <img src="images/logo.svg" />
                    </a>
                  </div>
                </div>

                <div className="text-center">
                  <img src="images/advertisement.jpg" />{" "}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
}

export default AgentDetails;
