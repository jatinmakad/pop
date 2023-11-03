import React from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import {
  FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, TwitterShareButton, TwitterIcon
} from "react-share";

const ReactShare = ({ link, shareButton, setShareButton }) => {
  const { t } = useTranslation();
  return (
    <Modal show={shareButton} onHide={() => setShareButton(false)} centered className="agent-modal">
      <Modal.Header className="d-flex justify-content-center" closeButton>
        <Modal.Title>{t("SHARE")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='w-100 d-flex justify-content-center align-items-center' style={{ height: "80px" }}>
          <div className='w-75 d-flex justify-content-center align-items-center'>
            <div className='mx-1'>
              <FacebookShareButton
                url={link}
              >
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
            </div>
            <div className='mx-1'>
              <TwitterShareButton
                url={link}
              >
                <TwitterIcon bookIcon size={32} round={true} />
              </TwitterShareButton>
            </div>
            <div className='mx-1'>
              <WhatsappShareButton
                url={link}
              >
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ReactShare