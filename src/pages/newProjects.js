import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Breadcrumb, Container, Col, Row } from "react-bootstrap";
import apiPath from "@/utils/apiPath";
import { apiGet } from "@/utils/apiFetch";
import Head from "next/head";
import { isEmpty } from "lodash";
import CustomImage from "./components/CustomImage";
import ViewMapAll from "./property/ViewMapAll";
import NewProjectCard from "./components/properties/NewProjectCard";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SearchForm from "./components/SearchForm";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import { bedroomCheck, zoomCount } from "@/utils/constants";
import Link from "next/link";

function NewProject() {
  const { t } = useTranslation();
  const [projectList, setProjectList] = useState([]);
  const [data, setData] = useState({});
  const [openMap, setOpenMap] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [bedroomList, setBedroomList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [priceListMin, setPriceListMin] = useState([]);
  const [coordinate, setCoordinates] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();
  const { config } = useContext(AuthContext);
  const [queryData, setQueryData] = useState({});
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    sortBy: "",
    searchKey: "",
    isReset: false,
    isFilter: false,
  });
  const { register, handleSubmit, reset, watch } = useForm();

  const handelChange = () => {
    let obj = {
      ...filter,
      page: filter.page + 1,
    };
    setFilter(obj);
  };

  const getProjectList = async (obj = filter, type, queryData = queryData) => {
    let bedroom = bedroomCheck(queryData);
    try {
      const { status, data } = await apiGet(apiPath.getProject, {
        page: obj?.page || 1,
        limit: obj?.limit || filter?.limit,
        propertyCategory:
          queryData?.propertyType?.length > 0
            ? queryData?.propertyType?.toString()
            : "",
        bedrooms: bedroom,
        priceMin: queryData?.minPrice || "",
        priceMax: queryData?.maxPrice || "",
        keyword: obj?.searchKey || "",
        location: isEmpty(queryData?.locationSelected)
          ? null
          : JSON.stringify(queryData?.locationSelected),
        sortKey: "startingPrice",
        sortType: obj?.sortBy,
      });
      if (status == 200) {
        if (data.success) {
          console.log("data?.results", data?.results);
          setData(data?.results);
          if (type == "add") {
            setProjectList([...projectList, ...data?.results?.docs]);
            setCoordinates([
              ...coordinate,
              ...data?.results?.docs
                ?.filter((res) => {
                  return res?.location?.coordinates?.length > 0;
                })
                ?.map((res) => {
                  return {
                    lat: res?.location?.coordinates[1],
                    lng: res?.location?.coordinates[0],
                    property: {
                      title: res?.title,
                      price: res?.startingPrice,
                      slug: res?.slug,
                      check: "project",
                    },
                  };
                }),
            ]);
          } else {
            setCoordinates(
              data?.results?.docs
                ?.filter((res) => {
                  return res?.location?.coordinates?.length > 0;
                })
                ?.map((res) => {
                  return {
                    lat: res?.location?.coordinates[1],
                    lng: res?.location?.coordinates[0],
                    property: {
                      title: res?.title,
                      price: res?.startingPrice,
                      slug: res?.slug,
                      check: "project",
                    },
                  };
                })
            );
            setProjectList(data?.results?.docs);
          }
        }
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getProjectList(filter, "", router?.query);
    if (!isEmpty(router?.query)) {
      setQueryData(router?.query);
    } else {
      setQueryData({});
    }
  }, [router?.query]);

  useEffect(() => {
    if (data?.hasNextPage) {
      getProjectList(filter, "add", queryData);
    }
  }, [filter?.page]);
  return (
    <>
      <div className="container new_project_form">
        <Head>
          <title>
            {t("MADA_PROPERTIES")} : {t("NEW_PROJECTS")}
          </title>
        </Head>
        <div className="filter_form_wrap px-0">
          <SearchForm tab={"project"} filter={filter} setFilter={setFilter} />
        </div>
      </div>
      <div className="main_wrap">
        <div className="breadcrum_Main pt-0">
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item href="#">{t("NEW_PROJECTS")}</Breadcrumb.Item>
              <Breadcrumb.Item active>{config?.country}</Breadcrumb.Item>
            </Breadcrumb>
          </Container>
        </div>
        <section className="serach_result">
          <Container>
            <div className="inner_heading">
              <h2>
                {t("NEW_PROJECTS_IN")}{" "}
                <span className="text-green">{config?.country}</span>
              </h2>
              <p className="fw-normal">
                {data?.totalDocs || 0} {t("RESULTS")}
              </p>
            </div>
            <Row>
              <Col xl={9} className="without_sidebar">
                <div
                  className={`d-flex ${
                    projectList?.length > 0
                      ? "justify-content-between"
                      : "justify-content-end"
                  } flex-wrap align-itmes-center mb-3`}
                >
                  {/* {projectList?.length > 0 && (
                    <button
                      onClick={() => setOpenMap(true)}
                      className="bg-white border d-flex align-items-center p-2 rounded text-dark fs-6"
                    >
                      <CustomImage
                        width={16}
                        height={18}
                        src="./images/location_black.svg"
                        className="me-2"
                        alt=""
                      />
                      {t("MAP_VIEW")}
                    </button>
                  )} */}
                  {projectList?.length > 0 && (
										<Link href={"/map-search?pageName=project"}
											className="bg-white border d-flex align-items-center p-2 rounded text-dark fs-6"
										>
											<CustomImage
												width={16}
												height={18}
												src="./images/location_black.svg"
												className="me-2"
												alt=""
											/>
											{t("MAP_VIEW")}
										</Link>
									)}
                  <Form className="d-flex align-items-center">
                    <label htmlFor="" className="me-2 fs-6 word-no-wrap">
                      {t("SORT_BY")}
                    </label>
                    <select
                      value={filter?.sortBy}
                      onChange={(e) => {
                        let obj = {
                          ...filter,
                          sortBy: e.target.value,
                          page: 1,
                        };
                        setFilter(obj);
                        getProjectList(obj, "", queryData);
                      }}
                      className="form-select fs-6"
                    >
                      <option value="">{t("NEWEST")}</option>
                      <option value="asc">{t("PRICE_ASC")}</option>
                      <option value="desc">{t("PRICE_DESC")}</option>
                    </select>
                  </Form>
                </div>

                <div className="result">
                  {projectList &&
                    projectList?.map((item, index) => {
                      return <NewProjectCard key={index} item={item} />;
                    })}
                  {projectList?.length == 0 && (
                    <h2 className="w-100 d-flex justify-content-center">
                      <CustomImage
                        src="/images/no_property.png"
                        className={"img-no-property"}
                        width={1000}
                        height={500}
                      />
                    </h2>
                  )}
                  {data?.totalPages !== data.page && (
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
              </Col>
              {/* <Col xl={3} className="text-center add_banner_right_cols">
                <img src="images/ad2.jpg" alt="image" />
              </Col> */}
            </Row>
          </Container>
        </section>
        {openMap && (
          <ViewMapAll
            openMap={openMap}
            setOpenMap={setOpenMap}
            location={coordinate}
            hasNextPage={data?.hasNextPage}
            onZoomChange={(e) => {
              if (data?.nextPage == zoomCount[e]) {
                setFilter({
                  ...filter,
                  page: zoomCount[e],
                });
              }
            }}
          />
        )}
      </div>
    </>
  );
}
export default NewProject;
