import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import apiPath from "@/utils/apiPath";
import { apiDelete, apiGet, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { isEmpty } from "lodash";
import ManagePropertyCardNew from "./components/properties/ManagePropertyCardNew";
import { useRouter } from "next/router";
import DialogBox from "./components/dialogBox";
import AuthContext from "@/context/AuthContext";
import CustomImage from "./components/CustomImage";
import ViewMapAll from "./property/ViewMapAll";
import Head from "next/head";
import { zoomCount } from "@/utils/constants";
import { useTranslation } from "react-i18next";

function ManageProperty() {
  const { t } = useTranslation();
  const notification = useToastContext();
  const router = useRouter();
  const [data, setData] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [openMark, setOpenMark] = useState(false);
  const { user, subscription } = useContext(AuthContext);
  const [propertyId, setPropertyId] = useState("");
  const [property, setProperty] = useState([]);
  const [openMap, setOpenMap] = useState(false);
  const [coordinate, setCoordinates] = useState([]);
  const [agentName, setAgentName] = useState("");
  const [agentList, setAgentList] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const getData = async (obj = filter, type) => {
    try {
      const { status, data } = await apiGet(apiPath.getCompanyProperty, {
        page: obj?.page || 1,
        limit: obj?.limit || filter?.limit,
        agent: obj.name || "",
      });
      if (status == 200) {
        if (data.success) {
          setData(data.results);
          if (type == "add") {
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
            setProperty([...property, ...data?.results?.docs]);
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
            setProperty(data?.results?.docs);
          }
        }
      } else {
      }
    } catch (error) { }
  };

  const getAgentList = async () => {
    try {
      const payload = {};
      const path = apiPath.getCompanyAgentList;
      const result = await apiGet(path, payload);
      const records = result?.data?.results;
      setAgentList(records);
    } catch (error) {
      console.error("error in get all users list==>>>>", error.message);
    }
  };

  const handelChange = () => {
    setFilter({
      ...filter,
      page: filter.page + 1,
    });
  };

  const deleteProperty = async () => {
    try {
      const { status, data } = await apiDelete(apiPath.deleteProperty, {
        propertyId: propertyId,
      });
      if (status == 200) {
        if (data.success) {
          getData(filter, "");
          notification.success(data?.message);
          setOpenDelete(false);
        } else {
          notification.error(data?.message);
        }
      } else {
        notification.error(data?.message);
      }
    } catch (error) {
      notification.error(error?.message);
    }
  };

  const soldProperty = async () => {
    try {
      const { status, data } = await apiPut(
        `${apiPath.markSold}/${propertyId}`,
        {}
      );
      if (status == 200) {
        if (data.success) {
          getData(filter, "");
          notification.success(data?.message);
          setOpenMark(false);
        } else {
          notification.error(data?.message);
        }
      } else {
        notification.error(data?.message);
      }
    } catch (error) {
      notification.error(error?.message);
    }
  };

  useEffect(() => {
    getData();
    getAgentList();
  }, []);

  useEffect(() => {
    if (data?.hasNextPage) {
      getData(filter, "add");
    }
  }, [filter?.page]);

  return (
    <div className="main_wrap">
      <Head>
        <title>Mada Properties : Manage Property</title>
      </Head>
      <section className="serach_result">
        <Container>
          <div className="inner_heading">
            <h2>
              {t("MANAGE")} <span className="text-green">{t("PROPERTY")}</span>
            </h2>
            <p className="fw-normal">
              {data?.totalDocs || 0} {t("RESULTS")}
            </p>
          </div>
          <Row>
            <Col xl={9} className="">
              <div
                className={`d-flex ${property?.length > 0
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
                    {t("MAP_VIEW")}
                  </button>
                )}
                {!isEmpty(user) &&
                  user?.role === "company" && (
                    <Form className="d-flex align-items-center">
                      <Form.Select
                        onChange={(e) => {
                          setAgentName(e.target.value);
                          getData({ ...filter, name: e.target.value, page: 1 });
                        }}
                        value={agentName}
                      >
                        <option value="">{t("SELECT_AGENT")}</option>
                        {agentList?.length > 0 &&
                          agentList?.map((res, index) => {
                            return (
                              <option key={index} value={res._id}>
                                {res?.firstName} {res?.lastName}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form>
                  )}
              </div>

              <div className="result">
                {property?.length > 0 &&
                  property?.map((item, index) => {
                    return (
                      <ManagePropertyCardNew
                        key={index}
                        item={item}
                        setOpenDelete={setOpenDelete}
                        setOpenMark={setOpenMark}
                        setPropertyId={setPropertyId}
                        type="manage-properties"
                        approvedStatus={true}
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
                      {t("LOAD_MORE")}
                    </Button>
                  </div>
                )}
              </div>
            </Col>
            <Col xl={3} className="text-center">
              <div className="list_property_box d-flex flex-column justify-content-center align-items-center rounded">
                <h2 className="text-white mb-2">{t("LIST_YOUR_PROPERTY")}</h2>
                <Button
                  onClick={() => {
                    if (!isEmpty(user) && user?.role === "company") {
                      if (!isEmpty(subscription)) {
                        if (
                          data?.totalDocs >=
                          subscription?.subscriptionProperties
                        ) {
                          notification.error(
                            `${t("YOU_ARE_ALLOWED_TO_ADD_ONLY")} ${subscription?.subscriptionProperties} ${t("PROPERTY")}`
                          );
                        } else {
                          router.push("/addNewProperty");
                        }
                      } else {
                        notification.error(
                          `${t("YOU_HAVE_TO_BUY_SUBSCRIPTION_FROM_HOME_PAGE_TO_ADD_PROPERTY")}`
                        );
                      }
                    } else if (
                      !isEmpty(user) &&
                      user?.role === "agent" &&
                      user?.parentType == "company"
                    ) {
                      if (!isEmpty(subscription)) {
                        if (
                          data?.totalDocs >=
                          subscription?.subscriptionProperties
                        ) {
                          notification.error(
                            `${t("YOU_ARE_ALLOWED_TO_ADD_ONLY")} ${subscription?.subscriptionProperties} ${t("PROPERTY")}`
                          );
                        } else {
                          router.push("/addNewProperty");
                        }
                      } else {
                        notification.error(
                          `${t("YOU_HAVE_TO_BUY_SUBSCRIPTION_FROM_HOME_PAGE_TO_ADD_PROPERTY")}`
                        );
                      }
                    } else {
                      router.push("/addNewProperty");
                    }
                  }}
                  className="btn theme_btn mt-3"
                >
                  {t("ADD_PROPERTY")}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {openDelete && (
        <DialogBox
          handleClose={() => {
            setOpenDelete(false);
            setPropertyId("");
          }}
          open={openDelete}
          title={t("DO_YOY_WANT_TO_DELETE_THIS_PROPERTY")}
          heading={t("DELETE")}
          onSubmit={deleteProperty}
        />
      )}
      {openMark && (
        <DialogBox
          handleClose={() => {
            setOpenMark(false);
            setPropertyId("");
          }}
          open={openMark}
          heading={t("MARK_SOLD")}
          title={t("DO_YOY_WANT_TO_MARK_THIS_PROPERTY")}
          onSubmit={soldProperty}
        />
      )}
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

export default ManageProperty;
