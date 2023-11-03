import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import ErrorMessage from './ErrorMessage'
import CustomImage from './CustomImage'
import { useForm } from 'react-hook-form'
import AuthContext from '@/context/AuthContext'
import { apiGet } from '@/utils/apiFetch'
import apiPath from "@/utils/apiPath";
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { subscriptionAr } from '@/utils/constants'
const PaymentModal = ({ subscriptionData, subscriptionId, validity, handleClose, purchaseSubscription }) => {
    const { config,direction } = useContext(AuthContext)
    const { t } = useTranslation();
    const { register, handleSubmit, setValue, control, formState: { errors }, } = useForm();
    const [paymentMethods, setPaymentMethods] = useState([])

    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null)

    const [subscriptionPrice] = useState(validity == 1 ? subscriptionData?.oneMonthPrice : validity == 3 ? subscriptionData?.threeMonthPrice : validity == 6 ? subscriptionData?.sixMonthPrice : subscriptionData?.oneYearPrice)
    const [subscriptionAgents] = useState(validity == 1 ? subscriptionData?.oneMonthAgents : validity == 3 ? subscriptionData?.threeMonthAgents : validity == 6 ? subscriptionData?.sixMonthAgents : subscriptionData?.oneYearAgents)
    const [subscriptionProperties] = [validity == 1 ? subscriptionData?.oneMonthProperties : validity == 3 ? subscriptionData?.threeMonthProperties : validity == 6 ? subscriptionData?.sixMonthProperties : subscriptionData?.oneYearProperties]

    const handlePaymentMethodClick = (PaymentMethodId, e) => {
        setSelectedPaymentMethodId(PaymentMethodId)
        setValue("paymentMethodId", PaymentMethodId)
    }

    const onSubmit = () => {
        purchaseSubscription(selectedPaymentMethodId)
    }

    const initiatePayment = async () => {
        try {
            var path = apiPath.initiatePaymentForSubscription
            const response = await apiGet(path, { subscriptionId, validity })
            const responseData = response.data
            if (responseData.success) {
                var results = responseData?.results || []
                setPaymentMethods(results)
            } else {
                console.log("ERROR while fetching payment Methods")
            }

        } catch (error) {
            console.log('error in get all users list==>>>>', error.message)
        }
    }

    useEffect(() => {
        initiatePayment()
    }, [])

    return (
        <div className="agent-modal">
            <Modal
                size="lg"
                show={true}
                onHide={handleClose}
                className="agent-modal purchase_subscription"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton className="d-flex justify-content-center">
                    <Modal.Title className="text-center w-100">Purchase subscription</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="align-items-center py-4">
                            <Col md={12}>
                                <div className="d-flex align-items-baseline purchase_subscription_list">
                                    <span>{t("Subscription_Fees")}:&nbsp;</span>
                                    <h4 className="price fs-7">
                                        {subscriptionPrice} {config?.currency}
                                    </h4>
                                </div>
                                <div className="d-flex align-items-baseline purchase_subscription_list">
                                    <span>{t("Property_Listing_Allowed")}:&nbsp;</span>
                                    <h4 className="price fs-7">
                                        {subscriptionProperties}
                                    </h4>
                                </div>
                                <div className="d-flex align-items-baseline purchase_subscription_list">
                                    <span>{t("Agent_Listing_Allowed")}:&nbsp;</span>
                                    <h4 className="price fs-7">
                                        {subscriptionAgents}
                                    </h4>
                                </div>
                                <div className="d-flex align-items-baseline purchase_subscription_list">
                                    <span>{t("Subscription_Plan")}:&nbsp;</span>
                                    <h4 className="price fs-7">
                                        {direction?.langKey == "Ar" ? subscriptionAr[subscriptionData?.name] : subscriptionData?.name}
                                    </h4>
                                </div>
                                <div className="d-flex align-items-baseline purchase_subscription_list">
                                    <span>{t("Duration")}:&nbsp;</span>
                                    <h4 className="price fs-7">
                                        {validity == 12 ? '1 Year' : `${validity} Months`}
                                    </h4>
                                </div>
                            </Col>
                            <div className='purchase_subscription_payment'>
                            <h5 className="mt-2">{t("Payment_Methods")}</h5>
                            <div className="payment-methods py-2">
                                {
                                    paymentMethods.map((pm, index) => {
                                        return (
                                            <span onClick={handlePaymentMethodClick.bind(this, pm?.PaymentMethodId)} key={index} title={pm?.PaymentMethodEn} className="cursor-pointer">
                                                <CustomImage width={80} height={41} src={pm.ImageUrl} className={classNames('p-2', { 'border-pm rounded': pm?.PaymentMethodId === selectedPaymentMethodId })} />
                                            </span>
                                        )
                                    })
                                }
                                <Form.Control
                                    type="hidden"
                                    {...register("paymentMethodId", {
                                        required: {
                                            value: true,
                                            message: "Please select payment method.",
                                        },
                                    })}
                                />
                                <ErrorMessage message={errors?.paymentMethodId?.message} />
                            </div>
                            </div>
                            <Col md={12} className="text-center">
                                <button
                                    type="submit"
                                    className="btn_link mt-2 fw-medium bg-green text-white border-0 w-50 m-auto"
                                >
                                    {t("SUBMIT")}
                                </button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default PaymentModal