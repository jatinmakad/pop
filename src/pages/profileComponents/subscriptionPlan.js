import React, { useContext, useEffect, useState } from "react";
import { apiGet, apiPost } from '@/utils/apiFetch'
import apiPath from '@/utils/apiPath'
import useToastContext from '@/hooks/useToastContext'
import dayjs from "dayjs";
import SubscriptionPlanDialog from "./subscriptionPlanDialog";
import Head from "next/head";
import AuthContext from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

function subscriptionPlan() {
    const notification = useToastContext()
    const { t } = useTranslation();
    const { subscription,config } = useContext(AuthContext)
    const [subscriptions, setSubscriptions] = useState([])
    const [updateBox, setUpdateBox] = useState(false)
    const getSubscriptions = async () => {
        const { status, data } = await apiGet(apiPath.purchasedSubscription, {})
        if (status === 200) {
            if (data.success) {
                setSubscriptions(data.results)
            }
        }
    }
    useEffect(() => {
        getSubscriptions()
    }, [])

    return (
        <div>
            <Head>
                <title>
                    Mada Properties : Subscription Plan
                </title>
            </Head>
            {
                subscriptions?.map((item, index) => (
                    <div key={index} className='subscript_list_main'>
                        <div className='subscript_list_list'>
                            <div className='subscript_list_left'>
                                <strong>{item?.subscriptionName}</strong>
                                <span>{item?.remainingProperties} {t("PROPERTY_LISTING")}</span>
                                <span>{item?.remainingAgents} {t("AGENT_LISTING")}</span>
                            </div>

                            <div className='subscript_list_center'>
                                <div className='sar'>{config?.currency } {item?.subscriptionPrice}/{item?.subscriptionMonths} {t("MONTHS")}</div>
                                {
                                    dayjs(item?.expiryDate).diff(new Date(), 'days', true) > 0 ? (
                                        <span>{t("DAY_LEFT")} {Math.floor(dayjs(item?.expiryDate).diff(new Date(), 'days', true))} {t("DAYS")}</span>
                                    ) : "Expired"
                                }
                            </div>

                            <div className='subscript_list_right'>
                                <div className='suscription_date'>{dayjs(item?.createdAt).format('LL')}</div>
                                {subscription?.subscriptionName == 'Gold' && subscription?.subscriptionMonths == 12 ? "" :
                                    dayjs(item?.expiryDate).diff(new Date(), 'days', true) > 0 && (
                                        <a href='#' className='btn theme_btn mt-3 btn btn-primary' onClick={() => setUpdateBox(true)}>{t("UPGRADE")}</a>
                                    )
                                }
                            </div>

                        </div>
                    </div>
                ))
            }

            {
                subscriptions?.length < 1 ? <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{t("NO_RECORD_FOUND")}</span> : ""
            }


            {updateBox && <SubscriptionPlanDialog getSubscriptionsNew={getSubscriptions} updateBox={updateBox} setUpdateBox={setUpdateBox} />}


        </div>
    )
}

export default subscriptionPlan