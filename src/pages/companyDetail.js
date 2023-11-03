import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import CompanyPropertyCard from "./components/CompanyPropertyCard";

const companyDetail = () => {
  return (
    <div className="main_wrap">
      <section className="company-listing-sec">
        <Container>
          <Row>
            <Col md={8}>
              <div className="company-list-card bg-white p-4">
                <div className="d-sm-flex mb-4">
                  <figure>
                    <img src="images/listview.png" alt="" />
                  </figure>
                  <figcaption>
                    <h2 className="fs-5 fw-medium text-dark d-block text-decoration-none mb-2">
                      Williams International Real Estate
                    </h2>
                    <ul>
                      <li>
                        Employes :<span>30 Agents</span>
                      </li>
                      <li>
                        Active Listing :<span>132 Properties</span>
                      </li>
                    </ul>
                  </figcaption>
                </div>
                <div className="about-will-sec">
                  <h2 className="fs-5 fw-medium text-dark d-block text-decoration-none mb-3">
                    Williams International Real Estate
                  </h2>
                  <ul>
                    <li>
                      ORN :<span>30 Agents</span>
                    </li>
                    <li>
                      HEAD OFFICE :<span>132 Properties</span>
                    </li>
                  </ul>

                  <div className="pt-3">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industrys
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book.
                    </p>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industrys
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book.
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="list_property_box d-flex flex-column justify-content-center align-items-center rounded">
                <h2 className="text-white mb-2">Contact the Broker</h2>
                <Link href="/" className="btn theme_btn mt-3 d-block w-75 w-lg-50">
                  Call Broker
                </Link>
                <Link href="/" className="btn theme_btn mt-3 d-block w-75 w-lg-50">
                  Email Broker
                </Link>
              </div>
            </Col>
          </Row>

          <div>
            {Array(5)
              .fill()
              .map((item, index) => {
                return (
                  <div key={index}>
                    <CompanyPropertyCard />
                  </div>
                );
              })}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default companyDetail;
