import useToastContext from "@/hooks/useToastContext";
import React, { useEffect, useState } from "react";
import { Tabs, Tab, InputGroup, Form, Button, ProgressBar, Container, Breadcrumb, Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { apiGet, apiPost } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import { useRouter } from "next/router";
import { compact, isEmpty } from "lodash";
import Helpers from "@/utils/helpers";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const UploadDocuments = ({ propertyId, editProperty, setKey, key, slug }) => {
	const { t } = useTranslation();
	const accept = "application/pdf,image/jpeg";
	const notification = useToastContext();
	const [deleteDocument, setDeleteDocument] = useState([])
	const router = useRouter();
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

	const handleFileUpload = (e) => {
		const getType = e.target.files[0].type.split("/");
		const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2);
		if (getType[1] !== undefined && (getType[1] === "jpeg" || getType[1] === "pdf")) {
			if (fileSize > 2) {
				notification.error(t("PLEASE_SELECT_DOCUMENT_BELOW_2_MB"));
			} else {
				return true;
			}
		} else {
			notification.error("Only jpeg and pdf formats are allowed");
		}
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [key]);

	const [documents, setDocuments] = useState([
		{
			documentTitle: "",
			documents: "",
		},
	]);

	const addDocuments = () => {
		setDocuments([
			...documents,
			{
				documentTitle: "",
				documents: "",
			},
		]);
	};

	const handleFileUploadSingle = (e) => {
		const getType = e.target.files[0].type.split("/");
		if (getType[1] !== undefined && (getType[1] === "jpeg" || getType[1] === "png" || getType[1] === "jpg" || getType[1] === "gif" || getType[1] === "pdf")) {
			return true;
		} else {
			notification.error("Only jpeg,png,jpg,gif,pdf formats are allowed");
		}
	};

	const handelDocuments = (index, item) => {
		let check = handleFileUpload(item);
		if (check) {
			setDocuments(
				documents?.map((res, ind) => {
					if (index === ind) {
						return {
							...res,
							documents: item.target.files[0],
						};
					} else {
						return res;
					}
				})
			);
		}
	};

	const removeDocument = (index) => {
		setDocuments(
			documents?.map((res, ind) => {
				if (index === ind) {
					return {
						...res,
						documents: "",
					};
				} else {
					return res;
				}
			})
		);
	};

	const removeDocumentIndex = (index, img) => {
		if (typeof img !== "object") {
			if (!isEmpty(img)) {
				const dbUrl = img?.split("net/");
				setDeleteDocument((prev) => [...prev, dbUrl[1]]);
			}
		}
		setDocuments(
			documents?.filter((res, ind) => {
				return index !== ind
			})
		);
	};

	const onSubmit = async () => {
		const formData = new FormData();
		let temp = documents?.filter((res) => {
			return res.documents !== "" && res.documentTitle !== "";
		});
		if (temp?.length > 0) {
			if (deleteDocument?.length > 0) {
				formData.append("deleteDocuments", JSON.stringify(compact(deleteDocument)));
			}
			let updatedTemp = temp?.filter((res) => {
				return typeof res.documents === 'object'
			});

			formData.append("_id", propertyId);
			if (updatedTemp?.length > 0) {
				for (let i = 0; i < updatedTemp?.length; i++) {
					formData.append("documents", updatedTemp[i].documents);
				}
				formData.append(
					"documentTitle",
					JSON.stringify(
						updatedTemp?.map((res) => {
							return res.documentTitle;
						})
					)
				);
			}
			const { data: response } = await apiPost(apiPath.uploadPhotosAddProperty, formData);
			if (response.success) {
				const { status, data } = await apiGet(apiPath.getPropertyDetailsCompanyNew + editProperty?.slug);
				if (status == 200) {
					if (data.success) {
						// console.log(data?.results?.completenessPercentage <= 100 && data?.results?.isApprovedStatus == "pending", '==========')
						if (data?.results?.completenessPercentage <= 100 && data?.results?.isApprovedStatus == "pending") {
							notification.success(t("PROPERTY_HAS_BEEN_SEND_TO_ADMIN_FOR_APPROVAL"));
							router.push("/profile?type=added");
						} else {
							router.push("/manage-properties");
							notification.success(response.message);
						}
					}
				}
			}
		} else {
			notification.error(t("PLEASE_SUBMIT_AT_LEAST_ONE_DOCUMENT"));
		}
	};

	useEffect(() => {
		if (!isEmpty(editProperty)) {
			if (editProperty?.documents?.length > 0) {
				setDocuments(
					editProperty?.documents?.map((res) => {
						return {
							documentTitle: res.title,
							documents: res.image,
							disabled: true
						};
					})
				);
			}
		}
	}, [editProperty]);

	const [documentCondition, setDocumentCondition] = useState(false)
	useEffect(() => {
		if (editProperty?.isApprovedStatus !== 'accepted') {
			if (documents?.length == 1) {
				if (!isEmpty(documents[0]?.documents)) {
					setDocumentCondition(true)
				} else {
					setDocumentCondition(false)
				}
			} else {
				setDocumentCondition(true)
			}
		} else {
			setDocumentCondition(false)
		}
	}, [documents])
	return (
		<div className="upload_property_photo">
			<div className="form-block">
				<Form className="theme_form" onSubmit={handleSubmit(onSubmit)}>
					{/* <Row>
            <Col md={4}>
              <Form.Group className="mb-3 fileInput" controlId="">
                <Form.Label>Property Ownership</Form.Label>
                <div className="position-relative">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      className="border-end-0"
                      accept={accept}
                      onClick={(e) => (e.target.value = null)}
                      placeholder={
                        propertyOwnership?.name || "Upload Property Ownership"
                      }
                    />
                    <InputGroup.Text>
                      <img src="./images/upload.svg" />
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Control
                    type="file"
                    {...register("propertyOwnership", {
                      // required: "Please select property ownership",
                    })}
                    onChange={(e) => {
                      UploadDocument("propertyOwnership", e);
                    }}
                    accept={accept}
                    onClick={(e) => (e.target.value = null)}
                    className="position-absolute top-0 left-0 opacity-0"
                    placeholder="Upload"
                  />
                  {propertyOwnership == '' && (
                    !isEmpty(editProperty?.propertyOwnership) &&
                    <button
                      onClick={() =>
                        Helpers.downloadFile(editProperty?.propertyOwnership)
                      }
                      type="button"
                      className="mt-2 py-1 btn btn-primary"
                      style={{ fontSize: '14px' }}
                    >
                      Download
                    </button>
                  )}
                  {propertyOwnership !== '' && (
                    <div className="position-relative upload_document_main">
                      <div className="position-relative upload_document_shape">
                        <div className="doc_name">
                          <span>{propertyOwnership?.name}</span>
                        </div>
                      </div>
                      <a
                        href="javascript:void(0)"
                        onClick={() => setPropertyOwnership("")}
                        className="photo_crose"
                      >
                        <img src="./images/photo-crose.svg" />
                      </a>
                    </div>
                  )}
                </div>
                <ErrorMessage message={errors?.propertyOwnership?.message} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3 fileInput" controlId="">
                <Form.Label>Power of Attorney</Form.Label>
                <div className="position-relative">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      className="border-end-0"
                      accept={accept}
                      onClick={(e) => (e.target.value = null)}
                      placeholder={
                        powerOfAttony?.name || "Upload Power of Attorney"
                      }
                    />
                    <InputGroup.Text>
                      <img src="./images/upload.svg" />
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Control
                    type="file"
                    {...register("powerOfAttony", {
                      // required: "Please select power of attorney",
                    })}
                    onChange={(e) => {
                      UploadDocument("powerOfAttony", e);
                    }}
                    accept={accept}
                    onClick={(e) => (e.target.value = null)}
                    className="position-absolute top-0 left-0 opacity-0"
                    placeholder="Upload"
                  />
                  {!isEmpty(editProperty?.powerOfAttorney) &&
                    powerOfAttony == '' && (
                      <button
                        type="button"
                        className="mt-2 py-1 btn btn-primary"
                        style={{ fontSize: '14px' }}
                        onClick={() =>
                          Helpers.downloadFile(editProperty?.powerOfAttorney)
                        }
                      >
                        Download
                      </button>
                    )}
                  {powerOfAttony !== '' && powerOfAttony?.name && (
                    <div className="position-relative upload_document_main">
                      <div className="position-relative upload_document_shape">
                        <div className="doc_name">
                          <span>{powerOfAttony?.name}</span>
                        </div>
                        <a
                          href="javascript:void(0)"
                          onClick={() => setPowerOfAttony("")}
                          className="photo_crose"
                        >
                          <img src="./images/photo-crose.svg" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <ErrorMessage message={errors?.powerOfAttony?.message} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3 fileInput" controlId="">
                <Form.Label>Owner ID</Form.Label>
                <div className="position-relative">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      accept={accept}
                      onClick={(e) => (e.target.value = null)}
                      className="border-end-0"
                      placeholder={ownerId?.name || "Upload Owner ID"}
                    />
                    <InputGroup.Text>
                      <img src="./images/upload.svg" />
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Control
                    type="file"
                    {...register("ownerId", {
                      // required: "Please select owner Id",
                    })}
                    onChange={(e) => {
                      UploadDocument("ownerId", e);
                    }}
                    accept={accept}
                    onClick={(e) => (e.target.value = null)}
                    className="position-absolute top-0 left-0 opacity-0"
                    placeholder="Upload"
                  />
                  {!isEmpty(editProperty?.ownerId) &&
                    ownerId == '' && (
                      <button
                        type="button"
                        className="mt-2 py-1 btn btn-primary"
                        style={{ fontSize: '14px' }}
                        onClick={() =>
                          Helpers.downloadFile(editProperty?.ownerId)
                        }
                      >
                        Download
                      </button>
                    )}
                  {ownerId !== '' && ownerId?.name && (
                    <div className="position-relative upload_document_main">
                      <div className="position-relative upload_document_shape">
                        <div className="doc_name">
                          <span>{ownerId?.name}</span>
                        </div>
                        <a
                          href="javascript:void(0)"
                          onClick={() => setOwnerId("")}
                          className="photo_crose"
                        >
                          <img src="./images/photo-crose.svg" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <ErrorMessage message={errors?.ownerId?.message} />
              </Form.Group>
            </Col>
          </Row> */}

					{documents?.length > 0 &&
						documents?.map((item, index) => {
							let type = item?.documents?.type?.split("/")[1];
							return (
								<Row key={index} className="align-items-center">
									<Col md={4}>
										<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="formBasicEmail">
											<Form.Label>{t("DOCUMENT_TITLE")}</Form.Label>
											<Form.Control
												type="text"
												placeholder={t("ENTER_DOCUMENT_TITLE")}
												value={item?.documentTitle}
												disabled={item?.disabled}
												onChange={(e) => {
													setDocuments(
														documents?.map((res, ind) => {
															if (ind === index) {
																return { ...res, documentTitle: e.target.value };
															} else {
																return res;
															}
														})
													);
												}}
											/>
										</Form.Group>
									</Col>
									<Col md={4}>
										<Form.Group className="mb-3 fileInput" controlId="formBasicEmail">
											<Form.Label>{t("DOCUMENT")}</Form.Label>
											<div className="position-relative">
												<InputGroup className="not_input_h">
													<Form.Control type="text" className="border-end-0" accept={accept} onClick={(e) => (e.target.value = null)} />
													<InputGroup.Text>
														<img src="./images/upload.svg" />
													</InputGroup.Text>
													<span title={item?.documents?.name ? item?.documents?.name : !isEmpty(item?.documents) ? item?.documents : t("UPLOAD_DOCUMENT")} className="second_placeholder text-truncate">{item?.documents?.name ? item?.documents?.name : !isEmpty(item?.documents) ? item?.documents : t("UPLOAD_DOCUMENT")}</span>
												</InputGroup>
												<Form.Control
													type="file"
													onChange={(e) => handelDocuments(index, e)}
													accept={accept}
													disabled={item?.disabled}
													onClick={(e) => (e.target.value = null)}
													className="position-absolute top-0 left-0 opacity-0 rounded-md"
													// placeholder="Upload"
													placeholder={item?.documents?.name ? item?.documents?.name : !isEmpty(item?.documents) ? t("UPLOAD_DOCUMENT") : t("UPLOAD_DOCUMENT")}
												/>
											</div>
										</Form.Group>
									</Col>
									<Col md={2}>
										{/* {propertyOwnership == '' && (
                      !isEmpty(editProperty?.propertyOwnership) &&
                      <button
                        onClick={() =>
                          Helpers.downloadFile(editProperty?.propertyOwnership)
                        }
                        type="button"
                        className="mt-2 py-1 btn btn-primary"
                        style={{ fontSize: '14px' }}
                      >
                        Download
                      </button>
                    )} */}
										{item?.documents !== "" && (type == "pdf" || type == "jpg" || type == "png" || type == "jpeg") ? (
											<div className="position-relative upload_document_shape">
												<div className="doc_name">
													<span>{item?.documents?.name}</span>
												</div>
												<a href="javascript:void(0)" onClick={() => removeDocument(index)} className="photo_crose">
													<img src="./images/photo-crose.svg" />
												</a>
											</div>
										) : item?.documents !== "" ? (
											<a href={item?.documents} target="_blank" className="mt-2 py-1 btn btn-primary" style={{ fontSize: "14px" }}>
												{t("DOWNLOAD")}
											</a>
										) : (
											""
										)}
										{/* {item?.documents !== '' && (
                      // <div className="position-relative upload_document_main">
                      <div className="position-relative upload_document_shape">
                        <div className="doc_name">
                          <span>{typeof item?.documents === Object ? item?.documents?.name : item?.documents}</span>
                        </div>
                      </div>
                      // {/* <a
                      //   href="javascript:void(0)"
                      //   onClick={() => removeDocument(index)}
                      //   className="photo_crose"
                      // >
                      //   <img src="./images/photo-crose.svg" />
                      // </a> */}
										{/* // </div> */}
										{/* )} */}
									</Col>

									{documentCondition &&
										<Col lg={2} style={{ display: "flex", alignItems: "center" }}>
											<img onClick={() => removeDocumentIndex(index, item?.documents)} src={"/images/delete_icon.svg"} style={{ width: "24px", height: "24px", cursor: "pointer" }} title="Delete" alt="delete" />
										</Col>
									}
								</Row>
							);
						})}
					{(editProperty?.isApprovedStatus !== "accepted") &&
						<div className="add_more">
							<Link href="javascript:void(0)" onClick={() => addDocuments()} className="text-blue">
								+ {t("ADD_MORE")}
							</Link>
						</div>}
					{documents?.filter((res) => {
						return res.documents !== "" && res.documentTitle !== "";
					})?.length == 0 ? (
						<Form.Text className="text-danger d-flex align-items-center">{t("PLEASE_SUBMIT_AT_LEAST_ONE_DOCUMENT")}</Form.Text>
					) : null}
					<Form.Text className="text-danger d-flex align-items-center">{t("ONLY_JPEG_PDF_FORMATS_ARE_ALLOWED")}</Form.Text>

					<hr className="mb-4" />
					<div className="d-flex mt-4">
						<button onClick={() => setKey("photos")} type="button" className="py-2 me-3 px-4 border-green rounded text-green fw-medium fs-xs-5 d-inline-flex outline-btn">
							{t("GO_BACK")}
						</button>
						<Button className="py-2" type="submit">
							{t("SUBMIT")}
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
};

export default UploadDocuments;
