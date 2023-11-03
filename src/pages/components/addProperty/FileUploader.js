import { apiPost, apiPut } from "@/utils/apiFetch";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import Sortable from "sortablejs";
import apiPath from "@/utils/apiPath";
import { useTranslation } from "react-i18next";
const FileUploader = ({ editProperty, open, handleClose, getPropertyData }) => {
	const { t } = useTranslation();
	const [files, setFiles] = useState(editProperty?.photos || []);
	const containerRef = useRef(null);
	const [updatedArray, setUpdateArray] = useState(editProperty?.photos || []);
	const onDrop = useCallback((acceptedFiles) => {
		setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
	Array.prototype.swap = function (swapFirst, swapSecond) {
		var x = swapFirst
		var y = swapSecond
		var b = this[y];
		this[y] = this[x];
		this[x] = b;
		return this;
	}

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setFiles((prevFiles) => {
			const updatedItems = [...prevFiles];
			updatedItems.splice(newIndex, 0, updatedItems.splice(oldIndex, 1)[0])
			return updatedItems
		});

		// console.log(oldIndex,newIndex,'Index')
		// setFiles((prevFiles) => {
		// 	let updated = prevFiles?.swap(oldIndex, newIndex)
		// 	// console.log(updated,'=============')
		// 	return updated
		// });
	};

	useEffect(() => {
		if (containerRef.current) {
			Sortable.create(containerRef.current, {
				animation: 150,
				onEnd: onSortEnd,
			});
		}
	}, [onSortEnd]);

	const onSubmit = async () => {
		const { data: response } = await apiPost(apiPath.rearrangePhotos, {
			propertyId: editProperty?._id,
			photoArr: files?.map((res) => {
				return res?.split('net/')[1]
			})
		});
		if (response.success) {
			handleClose()
			getPropertyData(editProperty?.slug);
		}
	}

	return (
		<>
			<Modal show={open} onHide={handleClose} size="lg" className="resize_filter_modal">
				<Modal.Header className="d-flex justify-content-center" closeButton>
					<Modal.Title>{t("RE_ARRANGE")}</Modal.Title>
				</Modal.Header>
				{/* <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
				<input {...getInputProps()} />
				<p>Drag and drop files here, or click to select files</p>
			</div> */}
				<Modal.Body>
					<Row>
						<Col lg={3} md={4} xs={6} {...getRootProps()} className={`mb-3 mb-md-4 dropzone ${isDragActive ? "active" : ""}`}>
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
								<input {...getInputProps()} />
								<div className="upload_caption">
									<img src="./images/photoupload.svg" className="mb-2" />
									<strong>+ Add more</strong>
									<span style={{ fontSize: "14px", fontWeight: "500" }}>minimum 6 photos</span>
								</div>
							</div>
						</Col>
						{/* {files.map((file, index) => (
					<div key={file.name} data-id={index} className="image-preview">
						<img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
					</div>
				))} */}
						<Row ref={containerRef}>
							{files?.map((file, index) => (
								<Col style={{ cursor: "move" }} key={file} data-id={index} lg={3} md={4} xs={6} className="mb-3 mb-md-4">
									<div className="uploaded_photo position-relative uploaded_multi_img">
										<figure className="">
											<img src={typeof file === "object" ? URL.createObjectURL(file) : file} />
										</figure>
										{/* <a href="javascript:void(0)" className="photo_crose">
											<img src="./images/photo-crose.svg" />
										</a> */}
									</div>
								</Col>
							))}
						</Row>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={onSubmit} variant="primary">{t("SUBMIT")}</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default FileUploader;
