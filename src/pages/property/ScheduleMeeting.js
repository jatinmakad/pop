import React, { useEffect, useRef, useState, useContext } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "react-phone-input-2/lib/style.css";
import { apiPost } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import useToastContext from "@/hooks/useToastContext";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AuthContext from "@/context/AuthContext";
require('dayjs/locale/ar');
const ScheduleMeeting = (props) => {
    const { t } = useTranslation();
    const notification = useToastContext();
    const { direction } = useContext(AuthContext)
    const router = useRouter()
    const [time, setTime] = useState('')
    const onSubmit = async () => {
        if (time !== '') {
            const { status, data } = await apiPost(
                apiPath.scheduleMeeting,
                {
                    propertyId: props?.data?._id,
                    appointmentDateTime: time
                }
            );
            if (status === 200) {
                if (data.success) {
                    notification.success(data?.message);
                    router.push('/profile?type=appointment')
                    props.onHide();
                } else {
                    notification.error(data?.message);
                }
            }
        } else {
            notification.error("Please select date and time.")
        }
    };


    return (
        <div className="agent-modal">
            <Modal
                {...props}
                size="lg"
                onHide={() => {
                    props?.onHide(false);
                }}
                className="agent-modal"
                aria-labelledby="contained-modal-titl  e-vcenter"
                centered
            >
                <Modal.Header closeButton className="d-flex justify-content-center">
                    <Modal.Title className="text-center w-100">
                        {t("SCHEDULE_MEETING")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="agent-main">
                        <Row>
                            <Col sm={12}>
                                <Form.Group className="mb-3" controlId="">
                                    <Form.Label>{t("AGENT_NAME")}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        disabled
                                        placeholder={t("FIRST_NAME")}
                                        value={`${props?.data?.agent?.firstName} ${props?.data?.agent?.lastName}`}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={12}>
                                <Form.Group className="mb-3" controlId="">
                                    <Form.Label>{t("SELECT_DATE_AND_TIME")}</Form.Label>
                                    <Flatpickr
                                        placeholder={t("SELECT_DATE_AND_TIME")}
                                        className="form-control"
                                        options={{
                                            enableTime: true,
                                            options: '',
                                            dateFormat: "d M, Y | h:i K",
                                            minDate: 'today',
                                            minTime:new Date(),
                                            defaultHour: time > new Date() ? '' : dayjs().format('HH'),
                                            defaultMinute: time > new Date() ? '' : dayjs().format('HH'),
                                            // defaultDate: "13:45",
                                            minTime: time > new Date() ? '' : dayjs().format('HH mm'),
                                            time_24hr: false,
                                        }}
                                        value={time || ''}
                                        onChange={(date) => {
                                            let selectedDate = new Date(date[0]);
                                            console.log(selectedDate, dayjs(selectedDate).format('LT')  , dayjs(new Date()).format('LT') ,dayjs(selectedDate).format('M') > dayjs(new Date()).format('M'),'date')
                                            setTime(selectedDate)
                                        }}
                                    />
                                </Form.Group>

                            </Col>
                            <div className="pt-3 mt-3 border-top">
                                <Row>
                                    <Col sm={12} className="d-flex justify-content-center">
                                        <button
                                            onClick={onSubmit}
                                            className="btn_link fw-medium bg-green text-white border-0"
                                        >
                                            {t("SUBMIT")}
                                        </button>
                                    </Col>
                                </Row>
                            </div>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default ScheduleMeeting;
