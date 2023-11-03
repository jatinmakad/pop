import React, { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import apiPath from "@/utils/apiPath";
import { apiGet, apiPost, apiDelete } from "@/utils/apiFetch";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import useToastContext from "@/hooks/useToastContext";
import { NumberInput } from "@/utils/constants";

const AddBankAccount = ({
  showBank,
  handleShowBank,
  banklist,
  getBankName,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const notification = useToastContext();

  const [data, setData] = useState();

  const onSubmit = async (payload) => {
    const { status, data } = await apiPost(apiPath.addBank, payload);
    if (status === 200) {
      if (data.success) {
        setData(false);
        notification.success(data?.message);
        getBankName();
        handleShowBank();
      } else {
        setData(false);
        notification.error(data?.message);
      }
    } else {
      notification.error(data?.message);
    }
  };

  return (
    <div className="agent-modal">
      <Modal
        size="lg"
        show={showBank}
        onHide={handleShowBank}
        className="agent-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title className="text-center w-100">
            Create Bank Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="agent-main place-bid-modal">
              <Row className="align-items-center py-4">
                <Col md={12}>
                  <Form.Select
                    aria-label="Default select example"
                    className="mb-3"
                    {...register("bankName", {
                      required: "Please select Bank",
                    })}
                  >
                    <option value="">Select Bank</option>

                    {banklist &&
                      banklist?.map((item, index) => {
                        return (
                          <option key={index} value={item.label}>
                            {item.label}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <ErrorMessage message={errors?.bankName?.message} />
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3" controlId="">
                    <Form.Control
                      type="text"
                      maxLength={15}
                      placeholder="Account Number"
                      {...register("accountNo", {
                        required: {
                          value: true,
                          message: "Please Enter Account Number.",
                        },
                        minLength: {
                          value: 8,
                          message: "Minimum length must be 8.",
                        },
                        maxLength: {
                          value: 16,
                          message: "Maximum length must be 16.",
                        },
                      })}
                      onKeyPress={NumberInput}
                    />

                    <ErrorMessage message={errors?.accountNo?.message} />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3" controlId="">
                    <Form.Control
                      type="text"
                      placeholder="AccountHolder Name"
                      {...register("accountHolderName", {
                        required: {
                          value: true,
                          message: "Please enter last name.",
                        },
                      })}
                    />
                    <ErrorMessage
                      message={errors?.accountHolderName?.message}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3" controlId="">
                    <Form.Control
                      type="text"
                      maxLength={15}
                      placeholder="SwiftCode"
                      {...register("swiftCode", {
                        required: {
                          value: true,
                          message: "Please Enter swiftCode",
                        },
                        pattern: {
                          value:
                            /^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$/,
                          message: "Invalid Format.",
                        },
                      })}
                    />
                    <ErrorMessage message={errors?.swiftCode?.message} />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <button
                    type="submit"
                    className="btn_link fw-medium bg-green text-white border-0 w-100"
                  >
                    Submit
                  </button>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddBankAccount;
