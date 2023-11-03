import useToastContext from "@/hooks/useToastContext";
import { apiPost, apiPut } from "@/utils/apiFetch";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InputGroup, Form, Button, Col, Row } from "react-bootstrap";
import apiPath from "@/utils/apiPath";
import ErrorMessage from "../ErrorMessage";
import { compact, isEmpty } from "lodash";
import RedStar from "../common/RedStar";
import FileUploader from "./FileUploader";
import CustomImage from "../CustomImage";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import Sortable from "sortablejs";

let imageCount = 6;
let imageCountMax = 20;

const UploadPropertyPhotos = ({
	propertyId,
	editProperty,
	setKey,
	key,
	getPropertyData,
}) => {
	const { t } = useTranslation();
	const notification = useToastContext();
	const videoRef = useRef();
	const [image, setImage] = useState([]);
	const [visualUrl, setVisualUrl] = useState("");
	const [visualUrlError, setVisualUrlError] = useState(false);
	const [videos, setVideos] = useState([]);
	const [reArrange, setReArrange] = useState(false);
	const [deletedImage, setDeletedImage] = useState([]);
	const [deletedVideo, setDeletedVideo] = useState([]);
	const [deletedFloorPlan, setDeletedFloorPlan] = useState([]);
	const containerRef = useRef(null);
	const [tempImage, setTempImage] = useState([])
	const [floorData, setFloorData] = useState([
		{
			title: "",
			image: "",
			titleAr: ""
		},
	]);

	const addMore = (item) => {
		handleFileUpload(item.target.files);
	};

	const addMoreFloor = () => {
		setFloorData([
			...floorData,
			{
				title: "",
				image: "",
				titleAr: ""
			},
		]);
	};

	const remove = async (index) => {
		if (typeof index !== "object") {
			let check = tempImage?.length > 0 ? tempImage?.find((res) => res?.image == index) : {} || {}
			if (!isEmpty(check)) {
				apiPut(apiPath.deleteTempPhoto + check?._id);
					setTempImage((prev) => {
						return prev?.filter((res) => res.image !== index)
					})
					setImage((prev) => {
						return prev?.filter((res) => res !== index)
					})
			} else {
				const dbUrl = index?.split("net/");
				setDeletedImage((prev) => [...prev, dbUrl[1]]);
			}
		}
		setImage((prev) => {
			return prev.filter((res) => res !== index);
		});
	};

	const removeFloorPlan = (index, img) => {
		if (typeof img !== "object") {
			const dbUrl = img?.split("net/");
			setDeletedFloorPlan((prev) => [...prev, dbUrl[1]]);
		}
		setFloorData((prev) =>
			prev?.filter((res, ind) => {
				return index !== ind;
			})
		);
	};


	const uploadTemporaryPhotos = async (e) => {
		const formData = new FormData();
		formData.append("propertyId", propertyId);
		formData.append("image", e);
		const { data: response } = await apiPost(
			apiPath.uploadTemporaryPhotos,
			formData
		);
		if (response.success) {
			setTempImage((prev) => {
				return [...prev, response?.results]
			})
			setImage((prev) => {
				return [...prev, response?.results?.image];
			});
		} else {
			notification.error(response?.message)
		}
	}

	const handleFileUpload = (e) => {
		let updatedPhotos = image?.filter((res) => {
			return typeof res === 'object'
		})
		if (image?.length + e?.length > imageCountMax) {
			notification.error(
				`${t("PROPERTY_IMAGE_SHOULD_NOT_MORE_THAN")} ${imageCountMax}`
			);
		} else if (updatedPhotos?.length + e?.length > 10) {
			notification.error(t("YOU_CAN_SELECT_10_IMAGES_AT_A_TIME"));
		} else {
			for (let i = 0; i < e?.length; i++) {
				const fileSize = (e[i]?.size / (1024 * 1024)).toFixed(2);
				let getType = e[i].type.split("/");
				if (
					getType[1] !== undefined &&
					(getType[1] === "jpeg" ||
						getType[1] === "png" ||
						getType[1] === "jpg" ||
						getType[1] === "gif")
				) {
					if (fileSize > 2) {
						notification.error(t("PLEASE_SELECT_PHOTOS_BELOW_2_MB"));
					} else {
						// if (editProperty?.photos?.length > 0) {
						uploadTemporaryPhotos(e[i])
						// } else {
						// 	setImage((prev) => {
						// 		if (prev?.length > 0) {
						// 			return [...prev, e[i]];
						// 		} else {
						// 			return [e[i]];
						// 		}
						// 	});
						// }
					}
				} else {
					notification.error(t("ONLY_JPEG_PNG_JPG_GIF_FORMATS_ARE_ALLOWED"));
				}
			}
		}
	};

	const handleFileUploadSingle = (e) => {
		const getType = e.target.files[0].type.split("/");
		const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2);
		if (
			getType[1] !== undefined &&
			(getType[1] === "jpeg" ||
				getType[1] === "png" ||
				getType[1] === "jpg" ||
				getType[1] === "gif")
		) {
			if (fileSize > 2) {
				notification.error(t("PLEASE_SELECT_IMAGE_BELOW_2_MB"));
			} else {
				return true;
			}
		} else {
			notification.error(t("ONLY_JPEG_PNG_JPG_GIF_FORMATS_ARE_ALLOWED"));
		}

	};

	const handelFloorPhotos = (index, item) => {
		let check = handleFileUploadSingle(item);
		if (check) {
			setFloorData(
				floorData?.map((res, ind) => {
					if (index === ind) {
						return {
							...res,
							image: item.target.files[0],
						};
					} else {
						return res;
					}
				})
			);
		}
	};

	const singleVideo = (item) => {
		let getType = item.target.files[0].type.split("/");
		const fileSize = (item.target.files[0]?.size / (1024 * 1024)).toFixed(2);
		if (
			getType[0] !== undefined &&
			(getType[1] === "mp4")
		) {
			if (fileSize > 50) {
				notification.error(
					t("PLEASE_SELECT_VIDEO_BELOW_50_MB")
				);
			} else {

				setVideos([...videos, { url: item?.target?.files[0], blob: URL.createObjectURL(item?.target?.files[0]) }]);
			}
		} else {
			notification.error(
				t("ONLY_MP4_VIDEO_FORMATS_ARE_ALLOWED")
			);
		}
	};

	const multipleVideo = (item) => {
		for (let i = 0; i < item?.target?.files?.length; i++) {
			let getType = item.target.files[i].type.split("/");
			if (
				getType[0] !== undefined &&
				(getType[1] === "mp4")
			) {
				let temp = Object.values(item?.target?.files).map((item) => URL.createObjectURL(item)).map((res) => {
					return {
						url: res
					}
				})
				setVideos([
					{ url: item?.target?.files[0], blob: URL.createObjectURL(item?.target?.files[0]) },
					{ url: item?.target?.files[1], blob: URL.createObjectURL(item?.target?.files[1]) },
				]);
			} else {
				notification.error(
					t("ONLY_MP4_VIDEO_FORMATS_ARE_ALLOWED")
				);
			}
		}
	};

	const handelVideo = (item) => {
		if (videos?.length == 1) {
			if (item?.target?.files?.length === 2) {
				notification.error(t("ONLY_2_VIDEO_ARE_ALLOWED"));
			} else {
				singleVideo(item);
			}
		} else if (videos?.length == 0) {
			if (videos?.length < 2) {
				if (item?.target?.files?.length === 2) {
					multipleVideo(item);
				} else if (item?.target?.files?.length == 1) {
					singleVideo(item);
				} else {
					notification.error(t("ONLY_2_VIDEO_ARE_ALLOWED"));
				}
			} else {
				notification.error(t("ONLY_2_VIDEO_ARE_ALLOWED"));
			}
		} else if (videos?.length === 2) {
			notification.error(t("ONLY_2_VIDEO_ARE_ALLOWED"));
		} else {
			notification.error(t("ONLY_2_VIDEO_ARE_ALLOWED"));
		}
	};

	const removeVideo = (index, img) => {
		if (typeof img !== "object") {
			const dbUrl = img?.split("net/");
			setDeletedVideo((prev) => [...prev, dbUrl[1]]);
		}
		setVideos((prev) =>
			prev?.filter((res, ind) => {
				return index !== ind;
			})
		);
	};

	const validate = () => {
		let updatedPhotos = image
		if (editProperty?.photos?.length == 0) {
			if (updatedPhotos?.length == 0 || updatedPhotos?.length < 6) {
				notification.error(t("PLEASE_UPLOAD_MIN_6_IMAGES"));
				return false;
			} else if (updatedPhotos?.length > 10) {
				notification.error(t("YOU_CAN_ONLY_SELECT_10_IMAGE_AT_A_TIME"));
				return false;
			}
		} else {
			if (tempImage?.length > 10) {
				notification.error(t("YOU_CAN_ONLY_SELECT_10_IMAGE_AT_A_TIME"));
				return false;
			} else {
				if ((editProperty?.photos?.length + tempImage?.length) - deletedImage?.length > imageCountMax) {
					notification.error(`${t("PROPERTY_IMAGE_SHOULD_NOT_MORE_THAN")} ${imageCountMax}`);
					return false
				} else if ((editProperty?.photos?.length + tempImage?.length) - deletedImage?.length < imageCount) {
					notification.error(`${t("PROPERTY_IMAGE_SHOULD_NOT_LESS_THAN")} ${imageCount}`);
					return false
				}
			}
		}
		//  if (updatedPhotos?.length > 10) {
		// 	notification.error("You can only select 10 image at a time");
		// 	return false;
		// } 
		// if (image?.length > imageCountMax) {
		// 	notification.error(`property image should not more than ${imageCountMax}`);
		// 	return false;
		// } 
		//  if (image?.length < imageCountMax) {
		// 	if (updatedPhotos?.length > 10) {
		// 		notification.error("You can only select 10 image at a time");
		// 		return false;
		// 	}
		// }
		// if (editProperty?.photos?.length == 0) {
		// 	notification.error("Please select images");
		// 	return false;
		// }
		// if (updatedPhotos?.length < imageCount && editProperty?.photos?.length == 0) {
		// 	notification.error(`you must add property image more than ${imageCount}`);
		// 	return false;
		// }
		// if (updatedPhotos?.length > imageCountMax) {
		// 	notification.error(
		// 		`property image should not more than ${imageCountMax}`
		// 	);
		// 	return false;
		// }
		if (visualUrlError) {
			notification.error(`Please enter valid URL`);
			return false;
		}
		if (videos?.length > 2) {
			notification.error(`${t("PROPERTY_VIDEO_SHOULD_NOT_MORE_THAN_2")}`);
			return false;
		}
		return true;
	};

	const onSubmit = async () => {
		let temp = floorData?.filter((res) => {
			return res.title !== "" && res.image !== "" && res.titleAr !== '';
		});
		let updatedTemp = temp?.filter((res) => {
			return typeof res?.image === 'object'
		})
		// let updatedPhotos = image?.filter((res) => {
		// 	return typeof res === 'object'
		// })
		let updatedPhotos = image
		let updatedVideos = videos?.filter((res) => {
			return typeof res === 'object'
		})
		let valid = validate();
		if (valid) {
			const formData = new FormData();
			formData.append("_id", propertyId);
			if (compact(updatedVideos)?.length > 0) {
				for (let i = 0; i < compact(updatedVideos)?.length; i++) {
					formData.append("video", updatedVideos[i]?.url);
				}
			}
			if (!isEmpty(visualUrl)) {
				formData.append("threeSixtyView", visualUrl);
			}
			if (updatedTemp?.length > 0) {
				for (let i = 0; i < updatedTemp?.length; i++) {
					formData.append("floorPlan", updatedTemp[i].image);
				}
				formData.append(
					"title",
					JSON.stringify(
						updatedTemp?.map((res) => {
							return res.title;
						})
					)
				);
				formData.append(
					"titleAr",
					JSON.stringify(
						updatedTemp?.map((res) => {
							return res.titleAr;
						})
					)
				);
			}
			if (deletedImage?.length > 0) {
				formData.append("deletePhotos", JSON.stringify(compact(deletedImage)));
			}
			if (deletedFloorPlan?.length > 0) {
				formData.append("deleteFloorPlan", JSON.stringify(compact(deletedFloorPlan)));
			}
			if (deletedVideo?.length > 0) {
				formData.append("deleteVideos", JSON.stringify(compact(deletedVideo)));
			}
			if (updatedPhotos?.length > 0) {
				for (let i = 0; i < updatedPhotos?.length; i++) {
					const dbUrl = updatedPhotos[i]?.split("net/");
					formData.append("photos", dbUrl[1]);
				}
			}
			const { data: response } = await apiPost(
				apiPath.uploadPhotosAddProperty,
				formData
			);
			if (response.success) {
				getPropertyData(editProperty?.slug);
				setKey("upload_documents");
			} else {
				notification.error(response?.message)
			}
		}
	};

	const urlPatternValidation = (URL) => {
		const regex = new RegExp(
			"(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
		);
		return regex.test(URL);
	};

	const changeUrl = (event) => {
		const { value } = event.target;
		const isTrueVal = !value || urlPatternValidation(value);
		setVisualUrl(value);
		setVisualUrlError(isTrueVal == false ? true : false);
	};

	useEffect(() => {
		setImage(editProperty?.photos || []);
		setVisualUrl((editProperty?.threeSixtyView == undefined || editProperty?.threeSixtyView == null) ? '' : editProperty?.threeSixtyView || "");
		if (editProperty?.video?.length > 0) {
			setVideos(
				editProperty?.video.map((res) => {
					return { url: res, blob: res };
				}) || ""
			);
		}
		if (editProperty?.floorPlan?.length > 0) {
			setFloorData(
				editProperty?.floorPlan.map((res) => {
					return {
						...res,
						disabled: true,
					};
				})
			);
		}
	}, [editProperty]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [key]);


	const onDrop = useCallback((acceptedFiles) => {
		setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setImage((prevFiles) => {
			let updatedItems = [...prevFiles];
			updatedItems.splice(newIndex, 0, updatedItems.splice(oldIndex, 1)[0])
			return updatedItems
		});
	};

	useEffect(() => {
		if (containerRef.current) {
			Sortable.create(containerRef.current, {
				animation: 150,
				onEnd: onSortEnd,
			});
		}
	}, [onSortEnd]);

	return (
		<div className="upload_property_photo">
			<h5 className="mb-3 d-sm-flex align-items-center justify-content-between">
				<div>
					<div className="mb-2">
						{t("UPLOAD_PROPERTY_PHOTOS")} <RedStar />{" "}
						<span className="text-danger">({t("MAX_SIZE_2_MB")})</span>
					</div>
					{/* <span className="text-danger">Photos can be sorted after successfully uploading.</span> */}
				</div>
				{/* {image?.length > 0 &&
					image?.filter((res) => typeof res === "object")?.length == 0 &&
					editProperty?.photos?.length == image?.length && (
						<button
							onClick={() => setReArrange(true)}
							className="read_btn text-white text-decoration-none border-0"
						>
							{t("SORT_PHOTOS")}
						</button>
					)} */}
			</h5>
			<Row>
				<Col xs={12} className="mb-3 mb-md-4">
					<div className="upload_wrap upload-property-wrap">
						<input
							type="file"
							onChange={(e) => {
								addMore(e);
							}}
							multiple
							accept="image/png, image/jiffy, image/jpeg, image/jpg"
							onClick={(e) => (e.target.value = null)}
						/>
						<div className="upload_caption">
							<img src="./images/photoupload.svg" className="mb-2" />
							<strong>+ {t("ADD_MORE")}</strong>
							<span style={{ fontSize: "14px", fontWeight: "500" }}>
								{t("MINIMUM_6_PHOTOS")}
							</span>
						</div>
					</div>
				</Col></Row>
				<Row ref={containerRef}>
					{image?.length > 0 &&
						image?.map((res, index) => {
							return (
								<Col style={{ cursor: "move" }} data-id={index} key={res} lg={3} md={4} xs={6} className="mb-3 mb-md-4">
									<div className="uploaded_photo position-relative uploaded_multi_img">
										<figure className="">
											<CustomImage
												width={210}
												height={156}
												src={
													typeof res === "object" ? URL.createObjectURL(res) : res
												}
											/>
										</figure>
										<a
											href="javascript:void(0)"
											onClick={() => remove(res)}
											className="photo_crose"
										>
											<img src="./images/photo-crose.svg" />
										</a>
										{/* {(!isEmpty(editProperty) && editProperty?.photos?.length > 1) && (
										<a href="javascript:void(0)" onClick={() => remove(res)} className="photo_crose">
											<img src="./images/photo-crose.svg" />
										</a>
									)}
									{(!isEmpty(editProperty) && editProperty?.photos?.length == 0 && image?.length > 6) && (
										<a href="javascript:void(0)" onClick={() => remove(res)} className="photo_crose">
											<img src="./images/photo-crose.svg" />
										</a>
									)}
									{(isEmpty(editProperty) && image?.length > 6) && <a href="javascript:void(0)" onClick={() => remove(res)} className="photo_crose">
										<img src="./images/photo-crose.svg" />
									</a>
									} */}
									</div>
								</Col>
							);
						})}
				</Row>
			
			<Form className="theme_form upload-floor-form">
				<div className="form-block">
					<hr className="mb-4" />
					<h5 className="mb-3">{t("UPLOAD_URL_360_VISUAL_AND_VIDEO")}</h5>
					<Row></Row>
					<div className="mb-2">
						<Row>
							<Col md={6}>
								<Form.Group
									className="mb-2 mb-sm-3 mb-md-4"
									controlId="formBasicEmail"
								>
									<Form.Label>{t("ADD_VISUAL_360_DEGREE")}</Form.Label>
									<Form.Control
										type="text"
										placeholder={t("ENTER_URL")}
										value={visualUrl}
										onChange={(e) => {
											changeUrl(e);
										}}
									/>
									{visualUrlError && (
										<ErrorMessage message={t("PLEASE_ENTER_VALID_URL")} />
									)}
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className="mb-2 mb-sm-3 mb-md-4" controlId="">
									<Form.Label>{t("ADD_VIDEO")} <span className="text-danger">({t("MAX_SIZE_50_MB")})</span></Form.Label>
									{/* <InputGroup className='mb-3'>
                        <Form.Control type='file' placeholder='Enter URL' />
                        <InputGroup.Text
                          id='basic-addon2'
                          as='button'
                          className='btn-primary text-white fs-6'
                        >
                          Upload
                        </InputGroup.Text>
                      </InputGroup> */}
									<div className="position-relative">
										<InputGroup className="mb-3">
											<Form.Control
												type="text"
												className="border-end-0"
												placeholder={"Upload video"}
											/>
											<InputGroup.Text className="btn-primary text-white fs-6">
												{t("UPLOAD")}
											</InputGroup.Text>
										</InputGroup>
										<Form.Control
											type="file"
											className="position-absolute top-0 left-0 opacity-0"
											placeholder={t("UPLOAD")}
											// onChange={(e) => handelVideo(index, e)}
											multiple
											onClick={(e) => (e.target.value = null)}
											onChange={(e) => {
												handelVideo(e);
											}}
											accept="video/mp4,video/*,.mkv"
										/>
									</div>
								</Form.Group>

								<div className="d-flex">
									{videos?.length > 0 &&
										videos?.map((item, index) => {
											return (
												item?.blob !== "" && (
													<div
														className="add_vedio_fream"
														key={index}
														style={{ marginRight: "10px" }}
													>
														<div className="uploaded_photo position-relative uploaded_multi_img">

															<figure className="">
																<video
																	style={{
																		height: "100%",
																		width: "100%",
																	}}
																	// ref={videoRef}
																	// autoPlay
																	src={
																		item?.blob
																	}
																	type="video/mp4"
																	controls
																/>
															</figure>
															<a
																href="javascript:void(0)"
																onClick={() => {
																	removeVideo(index, item?.url);
																}}
																className="photo_crose"
															>
																<img src="./images/photo-crose.svg" />
															</a>
														</div>
													</div>
												)
											);
										})}
								</div>
							</Col>
						</Row>
					</div>
					{/* {videos?.length < 2 &&
            <div className="add_more">
              <Link
                href="javascript:void(0)"
                onClick={() => addMoreVideos()}
                className="text-blue"
              >
                + Add more
              </Link>
            </div>
          } */}
				</div>
				<div className="form-block">
					<hr className="mb-4" />
					<h5 className="mb-3">{t("UPLOAD_FLOOR_PLAN_PHOTOS")} <span className="text-danger">({t("MAX_SIZE_2_MB")})</span></h5>
					{floorData?.length > 0 &&
						floorData?.map((item, index) => {
							return (
								<Row key={index} className="align-items-center">
									<Col md={3}>
										<Form.Group
											className="mb-2 mb-sm-3 mb-md-4"
											controlId="formBasicEmail"
										>
											<Form.Label>{t("TITLE")}</Form.Label>
											<Form.Control
												type="text"
												placeholder={t("ENTER_FLOOR_PLAN_TITLE")}
												value={item?.title}
												disabled={item?.disabled}
												onChange={(e) => {
													setFloorData(
														floorData?.map((res, ind) => {
															if (ind === index) {
																return { ...res, title: e.target.value };
															} else {
																return res;
															}
														})
													);
												}}
											/>
										</Form.Group>
									</Col>
									<Col md={3}>
										<Form.Group
											className="mb-2 mb-sm-3 mb-md-4"
											controlId="formBasicEmail"
										>
											<Form.Label>{t("TITLEAR")}</Form.Label>
											<Form.Control
												type="text"
												placeholder={t("ENTER_FLOOR_PLAN_TITLE")}
												value={item?.titleAr}
												disabled={item?.disabled}
												onChange={(e) => {
													setFloorData(
														floorData?.map((res, ind) => {
															if (ind === index) {
																return { ...res, titleAr: e.target.value };
															} else {
																return res;
															}
														})
													);
												}}
											/>
										</Form.Group>
									</Col>
									<Col md={2}>
										<Form.Group
											className="mb-3 fileInput"
											controlId="formBasicEmail"
										>
											<Form.Label>{t("FLOOR_PLAN_PHOTO")}</Form.Label>
											<div className="position-relative">
												<InputGroup>
													<Form.Control
														type="text"
														className="border-end-0"
														placeholder={
															typeof item?.image === "object"
																? item?.image?.name
																: t("UPLOAD_FLOOR_PLAN_PHOTO") ||
																t("UPLOAD_FLOOR_PLAN_PHOTO")
														}
													/>
													<InputGroup.Text>
														<img src="./images/upload.svg" />
													</InputGroup.Text>
												</InputGroup>
												<Form.Control
													type="file"
													className="position-absolute top-0 left-0 opacity-0"
													placeholder={t("UPLOAD")}
													disabled={item?.disabled}
													onChange={(e) => handelFloorPhotos(index, e)}
													accept="image/png, image/jiffy, image/jpeg, image/jpg"
												/>
											</div>
										</Form.Group>
									</Col>
									{item?.image && (
										<Col md={2}>
											<div className="common-profile common-profile-update">
												<img
													src={
														typeof item?.image === "object"
															? URL.createObjectURL(item?.image)
															: item?.image
													}
												/>
											</div>
										</Col>
									)}
									{/* {floorData?.length > 1 && ( */}
									<img onClick={() => removeFloorPlan(index, item?.image)} src={"/images/delete_icon.svg"} style={{ width: "45px", height: "45px", cursor: "pointer" }} alt="delete" />

									{/* )} */}
								</Row>
							);
						})}
					<div className="add_more">
						<Link
							href="javascript:void(0)"
							onClick={() => addMoreFloor()}
							className="text-blue"
						>
							+ {t("ADD_MORE")}
						</Link>
					</div>
					<hr className="mb-4" />
				</div>
				<div className="d-flex mt-4">
					<button
						onClick={() => setKey("address")}
						className="py-2 me-3 px-4 border-green rounded text-green fw-medium fs-xs-5 d-inline-flex outline-btn"
					>
						{t("GO_BACK")}
					</button>
					<Button
						className="py-2"
						onClick={() => {
							onSubmit();
						}}
					>
						{t("SAVE_AND_CONTINUE")}
					</Button>
				</div>
			</Form>
			{reArrange && (
				<FileUploader
					open={reArrange}
					handleClose={() => {
						setReArrange(false);
					}}
					editProperty={editProperty}
					getPropertyData={getPropertyData}
				/>
			)}
		</div>
	);
};

export default UploadPropertyPhotos;
