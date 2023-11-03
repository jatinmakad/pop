import React, { useEffect, useState } from "react";
import {
  InputGroup,
  Form,
  Breadcrumb,
  Container,
  Col,
  Row,
} from "react-bootstrap";
import apiPath from "../utils/apiPath";
import { apiGet } from "../utils/apiFetch";
import BlogCard from "./blog/BlogCard";
import { useRef } from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";

function Blog() {
  const { t } = useTranslation();
  const [blogData, setBlogData] = useState([]);
  const [pagination, setPagination] = useState();
  const [page, setPage] = useState(1);
  const [filterData, setFilterData] = useState({
    category: "",
    searchkey: "",
    isReset: false,
    isFilter: false,
  });
  const [pagerecord, setPagerecord] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  let searchingCounter = useRef(-1);
  const blogList = async (page = pagerecord.page) => {
    try {
      const { searchkey } = filterData;
      let local = [];
      let condi = {
        page: page || 1,
        keyword: searchkey,
      };
      var path = apiPath.blogList;
      const result = await apiGet(path, condi);
      var response = result?.data?.results;
      if (searchingCounter.current === 0) {
        setBlogData([...response.docs]);
      } else if (searchingCounter.current === 1) {
        setBlogData([...response.docs]);
      } else if (searchingCounter.current === -1) {
        setBlogData([...blogData, ...response.docs]);
      }
      setPagination(response);
    } catch (error) {
      console.log("error in get all users list==>>>>", error.message);
    }
  };

  const handleChangeData = (e) => {
    setFilterData({ ...filterData, searchkey: e.target.value, isFilter: true });
    if (e.target.value.length === 0) {
      searchingCounter.current = 0;
    }
    if (e.target.value.length > 0) {
      searchingCounter.current = 1;
    }
    setPage(1);
  };
  const loadMore = (e) => {
    searchingCounter.current = -1;
    setPage(page + 1);
    blogList(page + 1);
  };

  useEffect(() => {
    blogList();
  }, [filterData]);

  return (
    <div className="main_wrap blog-main">
      <Head>
        <title>Mada Properties : Blogs</title>
      </Head>
      <div className="breadcrum_Main pt-0">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">{t("HOME")}</Breadcrumb.Item>
            <Breadcrumb.Item active>{t("LATEST_PROPERTY_BLOGS")}</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      <section className="serach_result">
        <Container>
          <Row className="mb-3 mb-sm-4">
            <Col md={7}>
              <div className="inner_heading mb-md-0 mb-3">
                <h2>
                  {t("LATEST")} <span className="text-green">{t("LATEST_PROPERTY_BLOGS")}</span>
                </h2>
                <p className="fw-normal mb-0">
                  {pagination?.totalDocs} {t("RESULTS")}
                </p>
              </div>
            </Col>
            <Col md={5}>
              <Form
                className="d-flex align-items-center justify-content-md-end float-md-end"
                style={{ "max-width": "340px", width: "100%" }}
              >
                <InputGroup className="position-relative">
                  <InputGroup.Text
                    id="basic-addon1"
                    className="bg-white border-end-0 pe-0"
                  >
                    <img src="./images/search_outer.svg" alt="image" />
                  </InputGroup.Text>
                  <Form.Control
                    onChange={(e) => handleChangeData(e)}
                    className="form-control border-start-0 rounde-around-right"
                    placeholder={t("SEARCH")}
                    aria-describedby="basic-addon1"
                  />
                  <p class="form_crose_btn d-none"><img src="./images/crossNew.svg" alt="image" /></p>
                </InputGroup>
              </Form>
            </Col>
          </Row>
          <Row className="gy-3">
            {blogData?.length > 0 &&
              blogData?.map((item, index) => {
                return (
                  <Col sm={6} lg={3} md={4} key={index}>
                    <BlogCard item={item} />
                  </Col>
                );
              })}
          </Row>
          {pagination?.hasNextPage == true && page <= pagination?.page && (
            <div className="text-center loadMore mt-4 mt-md-5 mb-5 mb-xl-0">
              <button
                className="read_btn outline_btn text-white text-decoration-none border-0"
                onClick={() => loadMore()}
              >
                {" "}
                {t("LOAD_MORE")}
              </button>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
export default Blog;
