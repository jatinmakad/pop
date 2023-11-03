import React, { useEffect, useState } from "react";
import apiPath from "@/utils/apiPath";
import { apiDelete, apiGet } from "@/utils/apiFetch";
import { Button } from "react-bootstrap";
import ManagePropertyCardNew from "../components/properties/ManagePropertyCardNew";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import DialogBox from "../components/dialogBox";
import useToastContext from "@/hooks/useToastContext";

const PropertyApproval = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const [property, setProperty] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [propertyId, setPropertyId] = useState("");
  let notification = useToastContext()
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    propertyStatus: "pending",
  });
  const getData = async (obj = filter, type) => {
    try {
      const { status, data } = await apiGet(apiPath.getCompanyProperty, {
        page: obj?.page || 1,
        limit: obj?.limit || filter?.limit,
        propertyStatus: obj?.propertyStatus || filter?.propertyStatus,
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
    } catch (error) { }
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


  return (
    <div className="result">
      <Head>
        <title>
          Mada Properties : Property Approval
        </title>
      </Head>
      {property.map((item, index) => {
        return (
          <ManagePropertyCardNew
            key={index}
            item={item}
            type='propertyApproval'
            approvedStatus={true}
            setOpenDelete={setOpenDelete}
            setPropertyId={setPropertyId}
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
            {t("LOAD_MORE")}
          </Button>
        </div>
      )}
        {openDelete && (
        <DialogBox
          handleClose={() => {
            setOpenDelete(false);
            setPropertyId("");
          }}
          open={openDelete}
          title={`Do you want to delete this property.`}
          heading="Delete"
          onSubmit={deleteProperty}
        />
      )}
    </div>
  );
};

export default PropertyApproval;
