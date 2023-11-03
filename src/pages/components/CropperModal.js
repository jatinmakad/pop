import AvatarEditor from "react-avatar-editor";
import { useRef, useState } from 'react'
import { Modal, Col, Row, Button } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const boxStyle = {
    width: "300px",
    height: "300px",
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center"
};
const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};


const CropperModal = ({ src, modalOpen, setModalOpen, setPreview, setImageName, submitSave }) => {
    const { t } = useTranslation();
    const [slideValue, setSlideValue] = useState(10);
    const cropRef = useRef(null);
    const [value, setValue] = useState(50);

    const handleSave = async () => {
        if (cropRef) {
            const dataUrl = cropRef.current.getImage().toDataURL();
            const result = await fetch(dataUrl);
            const blob = await result.blob();
            // console.log(URL.createObjectURL(blob),"=====")
            setPreview(URL.createObjectURL(blob));
            setModalOpen(false);
        }
    };
    const closeModal = () => {
        setModalOpen(false)
        setPreview(null)
        // if (setImageName) {
        //     setImageName()
        // }
    }

    return (
        //     <Modal show={showModal} onHide={handleClose}>
        //     <Modal.Header closeButton>
        //       <Modal.Title>Modal Title</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body>
        //       <p>Modal body text goes here.</p>
        //     </Modal.Body>
        //     <Modal.Footer>
        //       <Button variant="secondary" onClick={handleClose}>
        //         Close
        //       </Button>
        //       <Button variant="primary" onClick={handleClose}>
        //         Save Changes
        //       </Button>
        //     </Modal.Footer>
        //   </Modal>
        <Modal sx={modalStyle} show={modalOpen}>
            <Modal.Header >
                <Modal.Title style={{ fontSize: '16px' }}>{t("ZOOM_AND_ADJUST")}</Modal.Title>
            </Modal.Header>
            <AvatarEditor
                ref={cropRef}
                image={src}
                style={{ width: "100%", height: "100%" }}
                border={50}
                color={[0, 0, 0, 0.72]}
                scale={slideValue / 10}
                rotate={0}
            />

            <div className="range" style={{
                width: '100%', display: 'flex', justifyContent: 'center',
                padding: '10px'
            }}>
                <input
                    type='range'
                    min={10}
                    max={50}
                    size="medium"
                    value={slideValue}
                    style={{ width: '80%', display: 'flex', justifyContent: 'center' }}
                    onChange={(e) => setSlideValue(e.target.value)} />
            </div>


            <div className="buttonGroup" style={{
                width: '100%', display: 'flex', justifyContent: 'space-around',
                padding: '10px'
            }}>
                <Button
                    size="small"
                    variant="outlined"
                    style={{ background: "#f75f06" }}
                    onClick={closeModal}
                    className="btn w-60 theme_btn"
                >
                    {t("CANCEL")}
                </Button>
                <Button
                    sx={{ background: "#5596e6" }}
                    size="small"
                    variant="contained"
                    onClick={handleSave}
                    className="btn w-60 theme_btn"
                >
                    {t("SAVE")}
                </Button>

            </div>

        </Modal>
    );
};
export default CropperModal;