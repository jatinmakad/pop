import React, { Fragment, useContext, useEffect, useState } from "react";
import { apiGet, apiPost } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import useToastContext from '@/hooks/useToastContext'
import { Button, Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import DialogBox from "./dialogBox";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import PaymentModal from "./PaymentModal";
import { isEmpty, get as __get } from "lodash";
import { useTranslation } from "react-i18next";
import { subscriptionAr } from "@/utils/constants";

const SubscriptionCard = () => {
  const { t } = useTranslation();
  const notification = useToastContext()
  const router = useRouter()
  const { getSubscription, config, direction, subscription, setSidebar } = useContext(AuthContext)
  const [subscriptions, setSubscriptions] = useState([])
  const [open, setOpen] = useState(false);
  const [sId, setSId] = useState(null);
  const [check, setCheck] = useState(false);
  const [checkData, setCheckData] = useState(false);
  const [validity, setValidity] = useState(0);
  const [subscriptionData, setSubscriptionData] = useState(null)

  const getSubscriptions = async () => {
    const { status, data } = await apiGet(apiPath.subscriptionList, {})
    if (status === 200) {
      if (data.success) {
        setSubscriptions(data.results)
      } else {
        notification.error(data?.message)
      }
    } else {
      notification.error(data?.message)
    }
  }
  const purchaseSubscription = async (selectedPaymentMethodId = null) => {

    if (selectedPaymentMethodId !== null) {
      const finalData = {
        paymentMethodId: selectedPaymentMethodId,
        subscriptionId: sId,
        subscriptionName: checkData,
        subscriptionMonths: validity,
        subscriptionPrice: validity == 1 ? subscriptionData?.oneMonthPrice : validity == 3 ? subscriptionData?.threeMonthPrice : validity == 6 ? subscriptionData?.sixMonthPrice : subscriptionData?.oneYearPrice,
        subscriptionAgents: validity == 1 ? subscriptionData?.oneMonthAgents : validity == 3 ? subscriptionData?.threeMonthAgents : validity == 6 ? subscriptionData?.sixMonthAgents : subscriptionData?.oneYearAgents,
        subscriptionProperties: validity == 1 ? subscriptionData?.oneMonthProperties : validity == 3 ? subscriptionData?.threeMonthProperties : validity == 6 ? subscriptionData?.sixMonthProperties : subscriptionData?.oneYearProperties,
      }
      const { status, data } = await apiPost(apiPath.subscriptionPurchase, finalData)
      if (status === 200) {
        if (data.success) {
          setOpen(false)
          if (data.results?.IsSuccess) {
            window.location.href = data.results.Data.PaymentURL
          }
          // notification.success(data?.message)
          //router.push('/manage-properties')
          getSubscription()
        } else {
          // setOpen(false)
          notification.error(data?.message)
        }
      } else {
        notification.error(data?.message)
      }
    } else {
      notification.error("Please select payment method")
    }
  }

  const handleClose = () => {
    setOpen(false);
    // setOpenType({ id: "", status: "" });
  };
  const subscriptionChange = (a, e) => {
    setCheck(true)
    setCheckData(a?.name)
    setSubscriptionData(a)
    setValidity(e?.target?.value)
    // setOpen(false);
    // setOpenType({ id: "", status: "" });
  };

  useEffect(() => {
    getSubscriptions()
  }, [])

  console.log(!isEmpty(subscription), 'subscription')
  return (
    <div className="subscription-card">
      <div className="section_title text-center mb-3 mb-md-5 ">
        <h2 className="text-white text-center mb-2">
          {t("PURCHASE")} <span className="text-green">{t("SUBSCRIPTION")}</span>
        </h2>
        <p className="text-white">{t("CHOOSE_A_PLAN_THAT_WORKS")}</p>
      </div>
      <Row>
        {
          subscriptions?.map((item, index) => (
            <Col md={4} key={index}>
              <div className="sub-card">
                <div className="basic-sec border-bottom text-center">
                  <h4 className="text-dark">{direction?.langKey == "Ar" ? subscriptionAr[item?.name] : item?.name}</h4>
                </div>
                {
                  check && checkData == item?.name ? (
                    <div className="property_list">
                      {
                        validity == 1 ? (
                          <ul>
                            <li>{item?.oneMonthProperties} {t("PROPERTY_LISTING")}</li>
                            <li>{item?.oneMonthAgents} {t("AGENT_LISTING")}</li>
                          </ul>
                        ) :
                          validity == 3 ? (
                            <ul>
                              <li>{item?.threeMonthProperties} {t("PROPERTY_LISTING")}</li>
                              <li>{item?.threeMonthAgents} {t("AGENT_LISTING")}</li>
                            </ul>
                          ) : validity == 6 ? (
                            <ul>
                              <li>{item?.sixMonthProperties} {t("PROPERTY_LISTING")}</li>
                              <li>{item?.sixMonthAgents} {t("AGENT_LISTING")}</li>
                            </ul>
                          ) : validity == 12 && (
                            <ul>
                              <li>{item?.oneYearProperties} {t("PROPERTY_LISTING")}</li>
                              <li>{item?.oneYearAgents} {t("AGENT_LISTING")}</li>
                            </ul>
                          )
                      }
                    </div>
                  ) : ""
                }

                <div className="subscription-list border-bottom">
                  <ul>
                    <li className="position-relative">
                      <input type="radio" id="1month" name="subscription" value="1" onChange={subscriptionChange.bind(this, item)} /><span className="tabs_ovelay_radio"></span>
                      <span>{t("1_MONTH")}</span><span>{config?.currency} {item?.oneMonthPrice}</span>
                    </li>

                    <li className="position-relative">
                      <input type="radio" id="3month" name="subscription" value="3" onChange={subscriptionChange.bind(this, item)} /><span className="tabs_ovelay_radio"></span>
                      <span>{t("3_MONTH")}</span><span>{config?.currency} {item?.threeMonthPrice}</span>
                    </li>

                    <li className="position-relative">
                      <input type="radio" id="6month" name="subscription" value="6" onChange={subscriptionChange.bind(this, item)} /><span className="tabs_ovelay_radio"></span>
                      <span>{t("6_MONTH")}</span><span>{config?.currency} {item?.sixMonthPrice}</span>
                    </li>

                    <li className="position-relative">
                      <input type="radio" id="1year" name="subscription" value="12" onChange={subscriptionChange.bind(this, item)} /><span className="tabs_ovelay_radio"></span>
                      <span>{t("YEAR")}</span><span>{config?.currency} {item?.oneYearPrice}</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center purchase-btn">
                  <Button className="theme_btn px-4 d-flex align-items-center mx-auto" disabled={item?.name == checkData ? false : true} onClick={() => { if (!isEmpty(subscription)) { router.push('/profile'); setSidebar('subscriptionPlan') } else { setOpen(true); setSId(item?._id) } }}>{!isEmpty(subscription) ? t("Upgrade_Plan") : t("MAKE_PAYMENT")} <span className="d-flex align-items-center"> <img src="./images/right-arrow.png" alt="" /></span></Button>
                </div>
              </div>
            </Col>
          ))
        }
      </Row>
      {open && (
        <PaymentModal subscriptionData={subscriptionData} subscriptionId={sId} validity={validity} handleClose={handleClose} purchaseSubscription={purchaseSubscription} />
      )}
    </div>
  );
};

export default SubscriptionCard;
