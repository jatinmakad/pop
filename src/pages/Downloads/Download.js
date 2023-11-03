import React from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Download = () => {
  const { t } = useTranslation();
  return (
    <section className="download py-4 py-md-5">
      <Container>
        <div className="downloadBG">
          <div className="downloadBG_contentwrap">
            <div className="section_title">
              <h2>
                {t("DOWNLOAD_MADA_PROPERTIES")}{" "}
                <span>{t("DOWNLOAD_MOBILE_APP")}</span>
              </h2>
            </div>
            <ul className="p-0 ms-0 mb-4">
              <li>{t("DOWNLOAD_GET_TO_KNOW")}</li>
              <li>{t("DOWNLOAD_MANAGE_PROPERTIES")}</li>
            </ul>
            <h5 className="fw-normal mb-3">
              {t("DOWNLOAD_GET_YOUR_APP_TODAY")}
            </h5>
            <a
              href="https://www.apple.com/in/app-store/"
              target="_blank"
              className="me-2"
            >
              <img src="images/apple-badge.png" />
            </a>
            <a href="https://play.google.com/store/games" target="_blank">
              <img src="images/play-badge.png" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Download;
