import ManagePropertyCard from "../components/properties/ManagePropertyCard";
import React, { useContext, useEffect, useState } from "react";
import apiPath from "@/utils/apiPath";
import { apiGet, apiPut } from "@/utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import { Button } from "react-bootstrap";
import DialogBox from "../components/dialogBox";
import AuthContext from "@/context/AuthContext";
import AddressBox from "./AddressBox";
import { useTranslation } from "react-i18next";
import Head from "next/head";

const Appointments = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const { user } = useContext(AuthContext)
  const [open, setOpen] = useState(false);
  const [map, setMap] = useState(false)
  const [editProperty, setEditProperty] = useState({})
  const [openType, setOpenType] = useState({
    id: "",
    status: "",
  });
  const notification = useToastContext();
  const [appointment, setAppointment] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const getData = async (obj = filter, type) => {
    let api = ''
    if (user?.role === 'user') {
      api = apiPath?.getAppointmentsCustomer
    } else if (user?.role === 'agent') {
      api = apiPath?.getAppointmentsCompany
    } else {
      api = apiPath?.getAppointmentsCompany
    }
    try {
      const { status, data } = await apiGet(api, {
        page: obj?.page || 1,
        limit: obj?.limit || filter?.limit,
      });
      if (status == 200) {
        if (data.success) {
          setData(data.results);
          if (type == "add") {
            setAppointment([...appointment, ...data?.results?.docs]);
          } else {
            setAppointment(data?.results?.docs);
          }
        }
      } else {
      }
    } catch (error) { }
  };

  useEffect(() => {
    getData();
  }, [user]);

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
    if (type.status === 'rejected') {
      setOpen(true);
      setOpenType({
        id: type?.id,
        status: type?.status,
      });
    } else {
      setMap(true)
      setEditProperty(type?.item?.property)
      setOpenType({
        id: type?.id,
        status: type?.status,
      });
    }
  };
  return (
    <div className="result">
       <Head>
        <title>
          Mada Properties : Appointment
        </title>
      </Head>
      {appointment?.length > 0 &&
        appointment?.map((item, index) => {
          return (
            <ManagePropertyCard
              changeStatus={changeStatus}
              item={item}
              key={index}
              openDialog={openDialog}
              check='appointment'
            />
          );
        })}
      {appointment?.length == 0 && (
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
          title={`Do you want to ${openType?.status === "accepted" ? "accept" : "reject"} this appointment.`}
          heading="Appointment"
          onSubmit={changeStatus}
        />
      )}
      {map && <AddressBox open={map} editProperty={editProperty} filter={filter} getData={getData} openType={openType} handleClose={() => { setMap(false) }} />}
    </div>
  );
};

export default Appointments;
