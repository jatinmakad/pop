import React, { useEffect, useState } from "react";
import apiPath from "@/utils/apiPath";
import { apiDelete, apiGet } from "@/utils/apiFetch";
import { Button } from "react-bootstrap";
import ManagePropertyCardNew from "../components/properties/ManagePropertyCardNew";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const Report = () => {
  const [data, setData] = useState({});
  const { t } = useTranslation();
  const [property, setProperty] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const getData = async (obj = filter, type) => {
    try {
      const { status, data } = await apiGet(apiPath.getReportsCompany, {
        page: obj?.page || 1,
        limit: obj?.limit || filter?.limit,
      });
      if (status == 200) {
        if (data.success) {
          setData(data.results);
          if (type == "add") {
            setProperty([...property, ...data?.results?.docs]);
          } else {
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
    getData(obj, "add");
  };

  return (
    <div className="result">
            <Head>
        <title>
          Mada Properties : Reports
        </title>
      </Head>
      {property.map((item, index) => {
        return (
          <ManagePropertyCardNew
            type="report"
            key={index}
            item={item}
          />
        );
      })}
      {property?.length == 0 && (
        <h2 className="w-100 d-flex justify-content-center">{t("NO_RECORD_FOUND")}</h2>
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
  );
};

export default Report;
