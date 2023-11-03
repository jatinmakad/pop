import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import AgentCard from "./agents/agentCard";
import apiPath from "@/utils/apiPath";
import { apiDelete, apiGet } from "@/utils/apiFetch";
import AddAgent from "./agents/addAgent";
import useToastContext from "@/hooks/useToastContext";
import DeleteDialog from "./components/deleteDialog";
import { useForm } from "react-hook-form";
import { isEmpty } from "lodash";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslation } from "react-i18next";

function MyAgent() {
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const notification = useToastContext();
  const router = useRouter();
  // console.log(router.query.type === "add", "router");
  const { subscription } = useContext(AuthContext);
  const [deleteBox, setDeleteBox] = useState(false);
  const [agents, setAgents] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [addOrEdit, setAddOrEdit] = useState("");
  const [agentObj, setAgentObj] = useState({});
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    status: "",
  });

  const { register, handleSubmit, watch, reset } = useForm();

  const getData = async (obj = filter, type) => {
    try {
      const { status, data } = await apiGet(apiPath.manageAgentCompany, {
        page: obj?.page || 1,
        limit: obj?.limit || filter?.limit,
        status: obj?.status === "all" ? "" : obj?.status || filter?.status,
        keyword: obj?.keyword || watch("keyword"),
      });
      if (status == 200) {
        if (data.success) {
          setData(data.results);
          if (type == "add") {
            setAgents([...agents, ...data?.results?.docs]);
          } else {
            setAgents(data?.results?.docs);
          }
        }
      } else {
      }
    } catch (error) { }
  };

  const deleteAgent = async () => {
    try {
      const { status, data } = await apiDelete(
        `${apiPath.deleteAgentCompanies}?agentId=${deleteId}`
      );
      if (status == 200) {
        if (data.success) {
          notification.success(data.message);
          setDeleteBox(false);
          setDeleteId("");
          getData({
            ...filter,
            page: 1,
          });
        }
      } else {
        notification.error(data.message);
      }
    } catch (error) {
      notification.error(data.message);
    }
  };

  const handelChange = () => {
    let obj = {
      ...filter,
      page: filter.page + 1,
    };
    setFilter(obj);
    getData(obj, "add");
  };

  const editAgent = (item) => {
    setAddOrEdit("edit");
    setOpen(true);
    setAgentObj(item);
  };

  const resetEdit = () => {
    setAddOrEdit("");
    setAgentObj({});
  };

  useEffect(() => {
    getData();
  }, []);

  const handleClose = () => {
    setDeleteBox(false);
  };

  useEffect(() => {
    if (router?.query?.type === "add") {
      setOpen(true);
      setAddOrEdit("add");
    }
  }, [router?.query?.type]);
  return (
    <>
      <div className="find_agent position-relative">
        <Head>
          <title>Mada Properties : My Agent</title>
        </Head>
        <div className="filter_box">
          <h1 className="text-white text-center mb-3 pb-2">{t("MANAGE_AGENTS")}</h1>
          <div className="filter_form_wrap my-agent-design">
            <Form
              onSubmit={handleSubmit(getData)}
              className="position-relative"
            >
              <div className="filter_main p-2">
                <div className="search_outer search_outer_secondary">
                  <button className="bg-transparent border-0">
                    <img src="images/search_outer.svg" alt="image" />
                  </button>
                  <Form.Control
                    type="text"
                    placeholder={t("ENTER_AGENT_NAME")}
                    {...register("keyword")}
                  />
                  {!isEmpty(watch("keyword")) && (
                    <p
                      onClick={() => {
                        if (!isEmpty(watch("keyword"))) {
                          reset();
                          getData();
                        }
                      }}
                      className=" h-100 d-flex justify-content-center align-items-center border-0 end-0"
                      style={{ left: "auto" }}
                    >
                      <img
                        src="./images/crossNew.svg"
                        alt="image-logo"
                        style={{
                          width: "22px",
                          height: "22px",
                          marginBottom: "-20px",
                        }}
                      />
                    </p>
                  )}
                </div>
                <Button type="submit" className="btn theme_btn position-static">
                  {t("FIND")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <div className="main_wrap p-0">
        <div className="container">
          <div className="agentWrap my-agent-wrap">
            <Row className="mb-3 mb-sm-4">
              <Col md={7}>
                <div className="inner_heading mb-md-0 mb-3">
                  <h2>
                    {t("MY")} <span className="text-green">{t("AGENTS")}</span>
                  </h2>
                  <p className="fw-normal mb-0">{agents?.length} {t("RESULTS")}</p>
                </div>
                <select
                  className="p-1 mt-2"
                  aria-label="Default select example"
                  value={filter?.status}
                  onChange={(e) => {
                    setFilter({ ...filter, status: e.target.value, page: 1 });
                    getData({ ...filter, status: e.target.value, page: 1 });
                  }}
                >
                  <option value="all">{t("ALL")}</option>
                  <option value="active">{t("ACTIVE")}</option>
                  <option value="inactive">{t("IN_ACTIVE")}</option>
                </select>
              </Col>
              <Col md={5}>
                <div className="d-flex justify-content-end align-items-end h-100">
                  <Button
                    onClick={() => {
                      if (!isEmpty(subscription)) {
                        if (
                          data?.totalDocs >= subscription?.subscriptionAgents
                        ) {
                          notification.error(
                            `${t("YOU_ARE_ALLOWED_TO_ADD_ONLY")} ${subscription?.subscriptionAgents} ${t("AGENTS")}`
                          );
                        } else {
                          setOpen(true);
                          setAddOrEdit("add");
                        }
                      } else {
                        notification.error(
                          `${t("YOU_HAVE_TO_BUY_SUBSCRIPTION_TO_ADD_AGENT")}`
                        );
                      }
                    }}
                  >
                    {" "}
                    + {t("ADD_AGENT")}
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              {agents?.length > 0 &&
                agents?.map((item, index) => {
                  return (
                    <AgentCard
                      setDeleteBox={setDeleteBox}
                      setDeleteId={setDeleteId}
                      key={index}
                      deleteAgent={deleteAgent}
                      editAgent={editAgent}
                      item={item}
                    />
                  );
                })}
              {agents?.length == 0 && (
                <h2 className="w-100 d-flex justify-content-center">
                  {t("NO_RECORD_FOUND")}
                </h2>
              )}
            </Row>
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
        </div>
      </div>
      {open ? (
        <AddAgent
          show={open}
          agentObj={agentObj}
          addOrEdit={addOrEdit}
          onHide={setOpen}
          resetEdit={resetEdit}
          getData={getData}
          filter={filter}
        />
      ) : null}
      {deleteBox ? (
        <DeleteDialog
          deleteBox={deleteBox}
          handleClose={handleClose}
          deleteAgent={deleteAgent}
        />
      ) : null}
    </>
  );
}
export default MyAgent;
