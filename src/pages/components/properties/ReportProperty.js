import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/ErrorMessage";
import "react-phone-input-2/lib/style.css";
import { apiGet, apiPost } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import useToastContext from "@/hooks/useToastContext";
import { pick } from "lodash";
import RedStar from "../common/RedStar";
import { useTranslation } from "react-i18next";

const ReportProperty = ({ open, onClose, id }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const notification = useToastContext();
  const [reportReason, setReportReason] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    unregister,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (body) => {
    let obj = {
      reasonId: body.reasonId,
      propertyId: id,
      comment: body.comment,
      userType: body?.userType
    };
    const { status, data } = await apiPost(apiPath.reportProperty, obj);
    if (status === 200) {
      if (data.success) {
        notification.success(data?.message);
        onClose();
        reset();
      } else {
        notification.error(data?.message);
      }
    }
  };

  const getReportReason = async () => {
    try {
      const { status, data } = await apiGet(apiPath.reportReason);
      if (status == 200) {
        if (data.success) {
          setReportReason(data?.results);
        }
      } else {
      }
    } catch (error) { }
  };

  useEffect(() => {
    getReportReason();
  }, []);
  return (
    <div className="agent-modal">
      <Modal
        show={open}
        size="lg"
        onHide={() => {
          onClose();
        }}
        className="agent-modal"
        centered
      >
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title className="text-center w-100">
            {t('REPORT_THIS_PROPERTY')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="agent-main">
              <Row>
                <Col sm={12}>
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>{t('REASON')}<RedStar /></Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      {...register("reasonId", {
                        required: {
                          value: true,
                          message: t('PLEASE_SELECT_REASON'),
                        },
                      })}
                    >
                      <option value="">{t('SELECT_A_REASON')}</option>
                      {reportReason.length > 0 &&
                        reportReason.map((res, index) => {
                          return (
                            <option key={index} value={res?._id}>
                              {res?.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                    <ErrorMessage message={errors?.reasonId?.message} />
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>{t('USER_TYPE')}<RedStar /></Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      {...register("userType", {
                        required: {
                          value: true,
                          message: t('PLEASE_SELECT_USER_TYPE'),
                        },
                      })}
                    >
                      <option value="">{t('SELECT_USER_TYPE')}</option>
                      <option value="I am a potential buyer">I am a potential buyer</option>
                      <option value="I am the owner">I am the owner</option>
                      <option value="I am an agent">I am an agent</option>
                    </Form.Select>
                    <ErrorMessage message={errors?.userType?.message} />
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>{t('ADDITIONAL_COMMENTS')}<RedStar /></Form.Label>
                    <Form.Control
                      name="comment"
                      as="textarea"
                      rows={10}
                      cols={10}
                      placeholder={t('YOUR_MESSAGE')}
                      {...register("comment", {
                        required: {
                          value: true,
                          message: t('PLEASE_ADD_A_COMMENT'),
                        },
                        validate: (value) => {
                          if (value === "") {
                            return true;
                          }
                          if (!!value.trim()) {
                            return true;
                          } else {
                            ("White spaces not allowed.");
                          }
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.comment?.message} />
                  </Form.Group>
                </Col>
                <div className="social_achiv_left2 pt-3 mt-3 border-top">
                  <Row>
                    <Col sm={12} className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn_link fw-medium bg-green text-white border-0"
                      >
                        {t('REPORT')}
                      </button>
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default ReportProperty;
