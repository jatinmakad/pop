import React, { useEffect, useState } from "react";
import { Button, Container, Col, Row } from "react-bootstrap";
import apiPath from "@/utils/apiPath";
import { apiGet } from "@/utils/apiFetch";
import ManagePropertyCardNew from "./components/properties/ManagePropertyCardNew";
import CustomImage from "./components/CustomImage";
import ViewMapAll from "./property/ViewMapAll";
import Head from "next/head";
import { zoomCount } from "@/utils/constants";

function MyWishlist() {
  const [data, setData] = useState({});
  const [openMap, setOpenMap] = useState(false);
  const [property, setProperty] = useState([]);
  const [coordinate, setCoordinates] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const getData = async (obj = filter, type) => {
    try {
      const { status, data } = await apiGet(apiPath.getWishlist, {
        page: obj?.page || 1,
        limit: obj?.limit || filter?.limit,
      });
      if (status == 200) {
        if (data.success) {
          setData(data.results);
          if (type == "add") {
            setCoordinates([
              ...coordinate,
              ...data?.results?.docs
                ?.filter((res) => {
                  return res?.property?.location?.coordinates?.length > 0;
                })
                .map((res) => {
                  return {
                    lat: res?.property?.location?.coordinates[1],
                    lng: res?.property?.location?.coordinates[0],
                    property: res?.property,
                  };
                }),
            ]);
            setProperty([...property, ...data?.results?.docs]);
          } else {
            setCoordinates(
              data?.results?.docs
                ?.filter((res) => {
                  return res?.property?.location?.coordinates?.length > 0;
                })
                .map((res) => {
                  return {
                    lat: res?.property?.location?.coordinates[1],
                    lng: res?.property?.location?.coordinates[0],
                    property: res?.property,
                  };
                })
            );
            setProperty(data?.results?.docs);
          }
        }
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    getData();
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
      getData(filter, "add");
    }
  }, [filter?.page]);
  return (
    <div className="main_wrap">
      <Head>
        <title>Mada Properties : My Wishlist</title>
      </Head>
      <section className="serach_result">
        <Container>
          <div className="inner_heading">
            <h2>
              My <span className="text-green">Wishlist</span>
            </h2>
            <p className="fw-normal">{data?.totalDocs || 0} results</p>
          </div>
          <Row>
            <Col xl={9} className="without_sidebar">
              {/* <div
                className={`d-flex ${
                  property?.length > 0
                    ? "justify-content-between"
                    : "justify-content-end"
                } flex-wrap align-itmes-center mb-3`}
              >
                {property?.length > 0 && (
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
                    Map View
                  </button>
                )}
              </div> */}

              <div className="result">
                {property?.map((item, index) => {
                  return (
                    <ManagePropertyCardNew
                      key={index}
                      item={item.property}
                      type="wishlist"
                      getData={getData}
                    />
                  );
                })}
                {property?.length == 0 && (
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
                      Load more...
                    </Button>
                  </div>
                )}
              </div>
            </Col>
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

export default MyWishlist;
