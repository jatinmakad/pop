import React, { useContext, useEffect, useState } from "react";
import apiPath from "@/utils/apiPath";
import { apiGet, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { Button } from "react-bootstrap";
import DialogBox from "../components/dialogBox";
import AuthContext from "@/context/AuthContext";
import ManagePropertyCardNew from "../components/properties/ManagePropertyCardNew";
import { useTranslation } from "react-i18next";

const AuctionProperties = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const { user } = useContext(AuthContext)
  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState({
    id: "",
    status: "",
  });
  const notification = useToastContext();
  const [auction, setAuction] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const getData = async (obj = filter, type) => {
    try {
      const { status, data } = await apiGet(apiPath.auctionPropertiesCustomerPlaced, {
        page: obj?.page || 1,
        limit: obj?.limit || filter?.limit,
        status:'active'
      });
      if (status == 200) {
        if (data.success) {
          setData(data.results);
          if (type == "add") {
            setAuction([...auction, ...data?.results?.docs]);
          } else {
            setAuction(data?.results?.docs);
          }
        }
      } else {
      }
    } catch (error) { }
  };

  const handelChange = () => {
    let obj = {
      ...filter,
      page: filter.page + 1,
    };
    setFilter(obj);
    getData(obj, "add");
  };

  const changeStatus = async () => {
    try {
      const { status, data } = await apiPut(
        `${apiPath.updateAppointmentStatusCompany}/${openType?.id}`,
        {
          status: openType?.status,
        }
      );
      if (status == 200) {
        if (data.success) {
          notification.success(data?.message);
          handleClose()
          getData(filter, "");
        }
      } else {
        notification.error(data?.message);
      }
    } catch (error) {
      notification.error(error?.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOpenType({ id: "", status: "" });
  };

  const openDialog = (type) => {
    setOpen(true);
    setOpenType({
      id: type?.id,
      status: type?.status,
    });
  };
  
  useEffect(() => {
    getData();
  }, [user]);



  return (
    <div className="result">
      {auction?.length > 0 &&
        auction?.map((item, index) => {
          return (
            <ManagePropertyCardNew
              changeStatus={changeStatus}
              item={item.property}
              id={item?._id}
              obj={item}
              key={index}
              openDialog={openDialog}
              getData={getData}
              type='auctionProfile'
              showAgent={'no'}
            />
          );
        })}
      {auction?.length == 0 && (
        <h2 className="w-100 d-flex justify-content-center">{t("NO_RECORD_FOUND")}</h2>
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
      {open && (
        <DialogBox
          handleClose={handleClose}
          openType={openType}
          open={open}
          title={`Do you want to ${openType?.status} this appointment.`}
          heading="Appointment"
          onSubmit={changeStatus}
        />
      )}
    </div>
  );
};

export default AuctionProperties;
