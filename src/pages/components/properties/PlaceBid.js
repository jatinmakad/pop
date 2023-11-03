import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import ErrorMessage from "../ErrorMessage";
import { Controller, useForm } from "react-hook-form";
// import PhoneInput from "react-phone-input-2";
import useToastContext from "@/hooks/useToastContext";
import AuthContext from "@/context/AuthContext";
import { isEmpty } from "lodash";
import { NumberInput } from "@/utils/constants";
import { apiGet, apiPost, apiDelete } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import CustomImage from "../CustomImage";
import classNames from "classnames";
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css";
import { t } from "i18next";
import Helpers from "@/utils/helpers";
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
const PlaceBid = ({ handleBidModelClick, handlePlaceBid, bidData, item,afterSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
  const { t } = useTranslation()
  const notification = useToastContext();
  const router = useRouter()
  const { user, config, defaultCountry } = useContext(AuthContext);
  const inputRef = useRef(null)
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

  const handlePaymentMethodClick = (PaymentMethodId, e) => {
    setSelectedPaymentMethodId(PaymentMethodId);
    setValue("paymentMethodId", PaymentMethodId);
  };

  const onSubmit = async (event) => {
    let obj = {
      mobile: user?.mobile,
      email: user?.email,
      bidPrice: event?.bidPrice,
      terms: event?.terms,
      propertyId: bidData?._id,
      paymentMethodId: event?.paymentMethodId,
      name: user?.firstName,
      countryCode: user.country_code,
    };

    const { status, data } = await apiPost(apiPath.placeBid, obj);

    if (status === 200) {
      if (data.success) {
        const results = data?.results;
        if (results.IsSuccess) {
          window.location.href = results?.Data?.PaymentURL;
        }
        // notification.success(data?.message);
        afterSubmit()
        handleBidModelClick()
      } else {
        notification.error(data?.message);
        handleBidModelClick()
      }
    } else {
      notification.error(data?.message);
    }
  };

  const initiatePayment = async () => {
    try {
      var path = apiPath.initiatePaymentForBid;
      const response = await apiGet(path, { propertyId: bidData?._id });
      const responseData = response.data;
      if (responseData.success) {
        var results = responseData?.results || [];
        setPaymentMethods(results);
      } else {
        console.log("ERROR while fetching payment Methods");
      }
    } catch (error) {
      console.log("error in get all users list==>>>>", error.message);
    }
  };

  useEffect(() => {
    initiatePayment();
  }, []);

  console.log(item,'item')
  return (
    <div>
      <div className="agent-modal">
        <Modal
          size="lg"
          show={true}
          onHide={handlePlaceBid}
          className="agent-modal"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton className="d-flex justify-content-center">
            <Modal.Title className="text-center w-100">{t("PLACE_A_BID")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="agent-main place-bid-modal">
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>{t("FULL_NAME")}</Form.Label>
                      <div className="form-control d-flex align-items-center">{`${user?.firstName} ${user.lastName}`}</div>
                      <ErrorMessage message={errors?.firstName?.message} />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label className="fs-7"> {t("MOBILE_NUMBER")}</Form.Label>
                      <div className="form-control d-flex align-items-center position-relative">
                        <span className="position-absolute start-0 h-100 d-flex align-items-center p-3 border-0 right_addon_bxs">
                          {`+${user?.country_code}`}
                        </span><span className="ps-5">{user?.mobile}</span>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label className="fs-7">{t("EMAIL")}</Form.Label>
                      <div className="form-control d-flex align-items-center multiple-text-truncate">
                        {user?.email}
                      </div>
                      <ErrorMessage message={errors?.email?.message} />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="bid-price-option mt-3">
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="fs-7">{t("BID_PRICES")}<span className="text-danger border-0">*</span></Form.Label>
                    <div className="position-relative">
                      <span className="position-absolute start-0 h-100 d-flex align-items-center p-3 border-0 right_addon_bxs">
                        {config?.currency}
                      </span>
                      <Form.Control
                        type="text"
                        className="bid-price-text"
                        placeholder={t("ENTER_BID_PRICES")}
                        {...register("bidPrice", {
                          required: {
                            value: true,
                            message: t("PLEASE_ENTER_BID_PRICES"),
                          },
                          validate: (val) => {
                            if (Number(item?.price) >= Number(val)) {
                              return t("BID_PRICE_MUST_BE_GREATER_THAN_PRICE")
                            }
                            return
                          }
                        })}
                        onKeyPress={NumberInput}
                      />
                    </div>
                    <ErrorMessage message={errors?.bidPrice?.message} />
                  </Form.Group>

                  <div>
                    <div className="d-flex align-items-center">
                      <Form.Check
                        className="text-dark margin-bid"
                        type="checkbox"
                        id="check3"
                        // label="I agree with the Terms & Condition and Privacy Policy."
                        {...register("terms", {
                          required: t("PLEASE_SELECT_TERMS_AND_CONDITIONS"),
                        })}
                      />
                      <span
                        className="text-dark"
                        style={{ fontSize: "14px" }}
                        href="javascript:void(0)"
                      >
                        <a
                          target="_blank"
                          className="text-green"
                          href={"/termsandCondition"}
                        >
                          {t("TERM_AND_CONDITIONS")}
                        </a>{" "}
                        {t("BIDDING_FEES_NON_REFUNDABLE")}
                      </span>
                      <label htmlFor="check3">
                        <span className="fa fa-check" />
                      </label>
                    </div>

                    <ErrorMessage message={errors?.terms?.message} />
                  </div>
                </div>

                <Row className="align-items-center pt-3">
                  <Col md={12}>
                    <div className="py-3">
                      <span> {t("BIDDING_FEES")}&nbsp;</span>
                      <div className="d-flex align-items-baseline pt-1">
                        <h4 className="price">
                          {bidData?.biddingFees ? `${Helpers?.priceFormat(bidData?.biddingFees)} ${config?.currency}` : "0"}
                        </h4>
                        <span>({t("PAY_BEFORE_PLACING_A_BID")})</span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <h5 className="mt-2"> {t("PAYMENT_METHOD")}</h5>
                <div className="payment-methods py-2">
                  {paymentMethods.map((pm, index) => {
                    return (
                      <span
                        onClick={handlePaymentMethodClick.bind(
                          this,
                          pm?.PaymentMethodId
                        )}
                        key={index}
                        title={pm?.PaymentMethodEn}
                        className="cursor-pointer"
                      >
                        <CustomImage
                          width={64}
                          height={41}
                          src={pm.ImageUrl}
                          className={classNames("p-2", {
                            "border-pm rounded":
                              pm?.PaymentMethodId === selectedPaymentMethodId,
                          })}
                        />
                      </span>
                    );
                  })}
                  <Form.Control
                    type="hidden"
                    {...register("paymentMethodId", {
                      required: {
                        value: true,
                        message:  t("PLEASE_SELECT_PAYMENT_METHOD"),
                      },
                    })}
                  />
                  <ErrorMessage message={errors?.paymentMethodId?.message} />
                </div>
                <Col md={12} className="text-center">
                  <button
                    type="submit"
                    className="btn_link mt-2 fw-medium bg-green text-white border-0 w-50 m-auto"
                  >
                     {t("SUBMIT")}
                  </button>
                </Col>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>

      {/* {showBank && (
        <AddBankAccount
          handleShowBank={handleShowBank}
          showBank={showBank}
          banklist={banklist}
          getBankName={getBankName}
        />
      )} */}
    </div>
  );
};

export default PlaceBid;
