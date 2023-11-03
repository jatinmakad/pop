import React, { Fragment, useContext, useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import useToastContext from "@/hooks/useToastContext";
import { Button, Row, Col, Modal } from "react-bootstrap";
import Slider from "react-slick";
import AuthContext from "@/context/AuthContext";
import DialogBox from "../components/dialogBox";
import { isEmpty } from "lodash";
import PaymentModal from "../components/PaymentModal";
const SubscriptionPlanDialog = ({ updateBox, setUpdateBox, getSubscriptionsNew }) => {
    const notification = useToastContext();
    const { getSubscription, subscription, config } = useContext(AuthContext);
    const [subscriptions, setSubscriptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [sId, setSId] = useState({});
    const [check, setCheck] = useState(false);
    const [checkData, setCheckData] = useState(false);
    const [validity, setValidity] = useState(0);
    const [subscriptionData, setSubscriptionData] = useState(null);

    const getSubscriptions = async () => {
        const { status, data } = await apiGet(apiPath.subscriptionList, {});
        if (status === 200) {
            if (data.success) {
                setSubscriptions(data.results);
                let obj = checkSubscription(
                    subscription?.subscriptionName,
                    subscription?.subscriptionMonths
                );
                if (!isEmpty(obj)) {
                    let temp = data?.results?.map((res) => {
                        if (res.name == "Basic") {
                            return {
                                ...res,
                                obj: {
                                    isDisabledObj: obj.checkBasic,
                                    isDisabled: obj.disableBasic,
                                },
                            };
                        } else if (res.name == "Standard") {
                            return {
                                ...res,
                                obj: {
                                    isDisabledObj: obj.checkStandard,
                                    isDisabled: obj.disableStandard,
                                },
                            };
                        } else if (res.name == "Gold") {
                            return {
                                ...res,
                                obj: {
                                    isDisabledObj: obj.checkGold,
                                    isDisabled: obj.disableGold,
                                },
                            };
                        } else {
                            return res;
                        }
                    });
                    setSubscriptions(temp);
                }
                // console.log(obj, "obj")
            } else {
                notification.error(data?.message);
            }
        } else {
            notification.error(data?.message);
        }
    };

    const purchaseSubscription = async (selectedPaymentMethodId) => {
        let obj = {
            companySubscriptionId: subscription._id,
            paymentMethodId: selectedPaymentMethodId,
            // subscriptionMonths: validity,
            subscriptionId: sId,
            subscriptionName: checkData,
            subscriptionMonths: validity,
            subscriptionPrice: validity == 1 ? subscriptionData?.oneMonthPrice : validity == 3 ? subscriptionData?.threeMonthPrice : validity == 6 ? subscriptionData?.sixMonthPrice : subscriptionData?.oneYearPrice,
            subscriptionAgents: validity == 1 ? subscriptionData?.oneMonthAgents : validity == 3 ? subscriptionData?.threeMonthAgents : validity == 6 ? subscriptionData?.sixMonthAgents : subscriptionData?.oneYearAgents,
            subscriptionProperties: validity == 1 ? subscriptionData?.oneMonthProperties : validity == 3 ? subscriptionData?.threeMonthProperties : validity == 6 ? subscriptionData?.sixMonthProperties : subscriptionData?.oneYearProperties,
        }
        const { status, data } = await apiPut(
            apiPath.upgradeSubscription,
            obj
        );
        if (status === 200) {
            if (data.success) {
                if (data.results.IsSuccess) {
                    setOpen(false);
                    setUpdateBox(false)
                    getSubscription();
                    getSubscriptionsNew()
                    const { PaymentURL } = data.results.Data
                    window.location.href = PaymentURL
                }
                
                //notification.success(data?.message);
            } else {
                setOpen(false);
                notification.error(data?.message);
            }
        } else {
            notification.error(data?.message);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const subscriptionChange = (a, e, check) => {
        if (!check) {
            setCheck(true);
            setCheckData(a?.name);
            setSubscriptionData(a);
            setValidity(e?.target?.value);
        }
    };

    useEffect(() => {
        getSubscriptions();
    }, []);

    const checkSubscription = (name, month) => {
        let obj = {
            disableStandard: false,
            checkStandard: {
                first: false,
                second: false,
                third: false,
                fourth: false,
            },
            disableBasic: false,
            checkBasic: {
                first: false,
                second: false,
                third: false,
                fourth: false,
            },
            disableGold: false,
            checkGold: {
                first: false,
                second: false,
                third: false,
                fourth: false,
            },
        };

        if (name == "Basic") {
            return (obj = {
                ...obj,
                checkBasic: {
                    first: month >= 1 ? true : false,
                    second: month >= 3 ? true : false,
                    third: month >= 6 ? true : false,
                    fourth: month >= 12 ? true : false,
                },
                disableBasic: false,
            });
        } else if (name == "Standard") {
            return (obj = {
                ...obj,
                checkStandard: {
                    first: month >= 1 ? true : false,
                    second: month >= 3 ? true : false,
                    third: month >= 6 ? true : false,
                    fourth: month >= 12 ? true : false,
                },
                disableStandard: false,
                disableBasic: true,
                checkBasic: {
                    first: true,
                    second: true,
                    third: true,
                    fourth: true,
                },
            });
        } else if (name == "Gold") {
            return (obj = {
                ...obj,
                checkGold: {
                    first: month >= 1 ? true : false,
                    second: month >= 3 ? true : false,
                    third: month >= 6 ? true : false,
                    fourth: month >= 12 ? true : false,
                },
                disableBasic: true,
                disableStandard: true,
                checkBasic: {
                    first: true,
                    second: true,
                    third: true,
                    fourth: true,
                },
                checkStandard: {
                    first: true,
                    second: true,
                    third: true,
                    fourth: true,
                },
            });
        }
    };
    return (
        <>
            <Modal show={updateBox} size="xl" onHide={() => setUpdateBox(false)}>
                <Modal.Header className="d-flex justify-content-center" closeButton>
                    <Modal.Title>Upgrade</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="subscription-card">
                        <Row>
                            {subscriptions?.map((item, i) => {
                                return (
                                    <Col md={4} key={i}>
                                        <div className="sub-card">
                                            <div className="basic-sec border-bottom text-center">
                                                <h4 className="text-dark">{item?.name}</h4>
                                            </div>
                                            {check && checkData == item?.name ? (
                                                <div className="property_list">
                                                    {validity == 1 ? (
                                                        <ul>
                                                            <li>
                                                                {item?.oneMonthProperties} Property Listing
                                                            </li>
                                                            <li>{item?.oneMonthAgents} agent Listing</li>
                                                        </ul>
                                                    ) : validity == 3 ? (
                                                        <ul>
                                                            <li>
                                                                {item?.threeMonthProperties} Property Listing
                                                            </li>
                                                            <li>{item?.threeMonthAgents} agent Listing</li>
                                                        </ul>
                                                    ) : validity == 6 ? (
                                                        <ul>
                                                            <li>
                                                                {item?.sixMonthProperties} Property Listing
                                                            </li>
                                                            <li>{item?.sixMonthAgents} agent Listing</li>
                                                        </ul>
                                                    ) : (
                                                        validity == 12 && (
                                                            <ul>
                                                                <li>
                                                                    {item?.oneYearProperties} Property Listing
                                                                </li>
                                                                <li>{item?.oneYearAgents} agent Listing</li>
                                                            </ul>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                ""
                                            )}

                                            <div className="subscription-list border-bottom">
                                                <ul>
                                                    <li className="position-relative" style={{ background: item?.obj?.isDisabledObj?.first && "lightgrey" }}>
                                                        <input
                                                            type="radio"
                                                            id="1month"
                                                            disabled={item?.obj?.isDisabledObj?.first}
                                                            name="subscription"
                                                            value="1"
                                                            onChange={!item?.obj?.isDisabledObj?.first && subscriptionChange.bind(this, item)}
                                                        />
                                                        <span className="tabs_ovelay_radio"></span>
                                                        <span>1 Month</span>
                                                        <span>{config?.currency} {item?.oneMonthPrice}</span>
                                                    </li>

                                                    <li className="position-relative" style={{ background: item?.obj?.isDisabledObj?.second && "lightgrey" }}>
                                                        <input
                                                            type="radio"
                                                            id="3month"
                                                            disabled={item?.obj?.isDisabledObj?.second}
                                                            name="subscription"
                                                            value="3"
                                                            onChange={!item?.obj?.isDisabledObj?.second && subscriptionChange.bind(this, item)}
                                                        />
                                                        <span className="tabs_ovelay_radio"></span>
                                                        <span>3 Month</span>
                                                        <span>{config?.currency} {item?.threeMonthPrice}</span>
                                                    </li>

                                                    <li className="position-relative" style={{ background: item?.obj?.isDisabledObj?.third && "lightgrey" }}>
                                                        <input
                                                            type="radio"
                                                            id="6month"
                                                            disabled={item?.obj?.isDisabledObj?.third}
                                                            name="subscription"
                                                            value="6"
                                                            onChange={!item?.obj?.isDisabledObj?.third && subscriptionChange.bind(this, item)}
                                                        />
                                                        <span className="tabs_ovelay_radio"></span>
                                                        <span>6 Month</span>
                                                        <span>{config?.currency} {item?.sixMonthPrice}</span>
                                                    </li>

                                                    <li className="position-relative" style={{ background: item?.obj?.isDisabledObj?.fourth && "lightgrey" }}>
                                                        <input
                                                            type="radio"
                                                            id="1year"
                                                            disabled={item?.obj?.isDisabledObj?.fourth}
                                                            name="subscription"
                                                            value="12"
                                                            onChange={!item?.obj?.isDisabledObj?.fourth && subscriptionChange.bind(this, item)}
                                                        />
                                                        <span className="tabs_ovelay_radio"></span>
                                                        <span>1 Year</span>
                                                        <span>{config?.currency} {item?.oneYearPrice}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="text-center purchase-btn">
                                                <Button
                                                    className="theme_btn px-4 d-flex align-items-center mx-auto"
                                                    disabled={
                                                        item?.obj?.isDisabled
                                                            ? true
                                                            : item?.name == checkData
                                                                ? false
                                                                : true
                                                    }
                                                    onClick={() => {
                                                        setOpen(true), setSId(item._id
                                                        );
                                                    }}
                                                >
                                                    Make Payment{" "}
                                                    <span className="d-flex align-items-center">
                                                        {" "}
                                                        <img src="./images/right-arrow.png" alt="" />
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>
            {open && (
                <PaymentModal subscriptionData={subscriptionData} subscriptionId={sId} validity={validity} handleClose={handleClose} purchaseSubscription={purchaseSubscription} />
            )}

        </>
    );
};

export default SubscriptionPlanDialog;
