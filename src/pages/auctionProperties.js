import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Collapse, Container, Col, Row } from "react-bootstrap";
import ManagePropertyCardNew from "./components/properties/ManagePropertyCardNew";
import apiPath from "@/utils/apiPath";
import { apiGet, apiPost, apiDelete } from "@/utils/apiFetch";
import AuthContext from "@/context/AuthContext";
import useToastContext from "@/hooks/useToastContext";
import Head from "next/head";
import CustomImage from "./components/CustomImage";
import { useTranslation } from "react-i18next";
import ViewMapAll from "./property/ViewMapAll";
import { zoomCount } from "@/utils/constants";

function Auction() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const notification = useToastContext();
  const [actionListing, setActionListing] = useState();
  const [data, setData] = useState({});
  const [images, setImages] = useState([]);
  const [openMap, setOpenMap] = useState(false);
  const [coordinate, setCoordinates] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    status: "",
  });
  const getActionData = async (obj = filter, type) => {
    try {
      var path = apiPath.actionPropertyList;
      const { status, data } = await apiGet(path, {
        page: obj?.page || 1,
        limit: obj?.limit || filter?.limit,
        status: obj?.status,
      });
      if (status == 200) {
        if (data.success) {
          setData(data?.results);
          if (type == "add") {
            setActionListing([...actionListing, ...data?.results?.docs]);
            setCoordinates([
              ...coordinate,
              ...data?.results?.docs
                ?.filter((res) => {
                  return res?.location?.coordinates?.length > 0;
                })
                .map((res) => {
                  return {
                    lat: res?.location?.coordinates[1],
                    lng: res?.location?.coordinates[0],
                    property: res,
                  };
                }),
            ]);
          } else {
            setCoordinates(
              data?.results?.docs
                ?.filter((res) => {
                  return res?.location?.coordinates?.length > 0;
                })
                .map((res) => {
                  return {
                    lat: res?.location?.coordinates[1],
                    lng: res?.location?.coordinates[0],
                    property: res,
                  };
                })
            );
            setActionListing(data?.results?.docs);
          }
        }
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    getActionData();
  }, []);

  const handelChange = () => {
    let obj = {
      ...filter,
      page: filter.page + 1,
    };
    setFilter(obj);
  };

  useEffect(() => {
    if (data?.hasNextPage) {
      getActionData(filter, "add");
    }
  }, [filter?.page]);

  return (
    <div className="main_wrap">
      <Head>
        <title>
          {t("MADA_PROPERTIES")} : {t("AUCTION_PROPERTIES")}
        </title>
      </Head>
      <section className="serach_result">
        <Container>
          <div className="inner_heading">
            <h2>
              {t("AUCTION_PROPERTY1")}{" "}
              <span className="text-green">{t("AUCTION_PROPERTY2")}</span>
            </h2>
            <p className="fw-normal">
              {data?.totalDocs || 0} {t("RESULTS")}
            </p>
          </div>

          <Row>
            <Col xl={9} className="without_sidebar">
              <div
                className={`d-flex ${
                  actionListing?.length > 0
                    ? "justify-content-between"
                    : "justify-content-end"
                } flex-wrap align-itmes-center mb-3`}
              >
                {/* {actionListing?.length > 0 && (
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
                <div className="bg-white d-flex align-items-center p-2 rounded text-dark fs-6 bg-transparent">
                  
                </div>
                <Form className="d-flex align-items-center">
                  <label
                    htmlFor=""
                    className="me-2 fs-6"
                    style={{ width: "100px", textWrap: "nowrap"}}
                  >
                    {t("SORT_BY")}
                  </label>
                  <select
                    value={filter?.sortBy}
                    onChange={(e) => {
                      let obj = {
                        ...filter,
                        status: e.target.value,
                        page: 1
                      };
                      setFilter(obj);
                      getActionData(obj);
                    }}
                    className="form-control fs-6"
                  >
                    <option value="">{t("STATUS")}</option>
                    <option value="upcoming">{t("UPCOMING")}</option>
                    <option value="live">{t("LIVE")}</option>
                    <option value="closed">{t("CLOSED")}</option>
                  </select>
                </Form>
              </div>

              <div className="result">
                {actionListing &&
                  actionListing.map((item, index) => {
                    return (
                      <ManagePropertyCardNew
                        key={index}
                        item={item}
                        actionType="auction"
                        afterSubmit={getActionData}
                      />
                    );
                  })}
                {actionListing?.length == 0 && (
                  <h2 className="w-100 d-flex justify-content-center">
                    <CustomImage
                      src="/images/no_property.png"
                      className={"img-no-property"}
                      width={1000}
                      height={500}
                    />
                  </h2>
                )}
                {data?.totalPages !== data?.page && (
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
            {/* <Col xl={3} className="text-center ad2_wrapper">
              <img src="images/ad2.jpg" alt="" />
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
  );
}

export default Auction;
