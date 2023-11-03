import React, { useContext } from "react"
import { Button, Col } from "react-bootstrap"
import CustomImage from "../components/CustomImage"
import { isEmpty, upperCase } from "lodash"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import AuthContext from "@/context/AuthContext"
import Image from "next/image"

const AgentCard = ({ item, editAgent, setDeleteBox, setDeleteId, type }) => {
  const { t } = useTranslation()
  const { user, config, defaultCountry } = useContext(AuthContext);
  return (
    <Col className="mb-3 d-flex" sm={6} md={4} lg={3}>
      <div className="box agent-pic w-100 ">
        {
          user?.role === "user" || isEmpty(user) ?
            <span className="property_logo"><CustomImage src={item?.companyLogo} width={175} height={60} alt="companyLogo" /></span>
            : null
        }
        <figure className="position-relative">
          {/* {item?.profilePic && ( */}
            <CustomImage
              width={100}
              height={100}
              src={item?.profilePic !== null ? item?.profilePic : ""}
              alt="profilePic"
            />
          {/* )} */}

          <div className="start-0 agent_logo position-absolute d-flex justify-content-between w-100 px-3 align-items-center">
            {type !== "customer" && (
              <>
                <div className="d-flex align-items-center edit-delete-btn">
                  <Button
                    onClick={() => editAgent(item)}
                    className="me-2 p-2 py-1 pointer-event d-flex align-items-center"
                  >
                    <img src="../images/edit.svg" alt="image" />
                  </Button>
                  {/* <Button
                    onClick={() => {
                      setDeleteBox(true);
                      setDeleteId(item._id);
                    }}
                    className="p-2 py-1 bg-danger border-danger pointer-event d-flex align-items-center"
                  >
                    <img src="../images/bin.svg" alt="image" />
                  </Button> */}
                </div>{" "}
                <span
                  className={`p-1 px-2 text-white rounded-1 text-capitalize activeagent ${item?.status == "active" ? "bg-green" : "bg-danger"
                    }`}
                >
                  {t(upperCase(item?.status))}
                  {/* {item?.status} */}
                </span>
              </>
            )}
          </div>


          {/* <div className="agent-mini-logo">
            <img src="https://images.unsplash.com/photo-1566275529824-cca6d008f3da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80" alt="" />
          </div> */}

        </figure>
        <div className="d-flex flex-column justify-content-between agent-block-inner">
          <figcaption>
            <Link href={`/agents/${item?.slug}`} title={item?.name} className='card-title h5 mb-0 text-truncate'>
              {item?.name}
            </Link>
            {
              user?.role !== 'company'
              &&
              <p className="card-text">
                {" "}
                {item?.parentType == 'admin' ? <span title='Mada properties'>Mada properties</span> : item?.parentType == 'freelancer' ? <span title='Freelancer'>Freelancer</span> : item?.parentType == 'company' ? `${item?.company?.name}` : null}
              </p>
            }
            <small className="card-text mb-2 d-block">{item?.designation}</small>
            <p className="d-flex">
              {t('NATIONALITY')} :{" "}
              <span className="text-green" title={item?.nationality}>{item?.nationality}</span>
            </p>
            <p className="d-flex">
              {t('LANGUAGES')} :{" "}
              <span className="text-green text-truncate" title={item?.language}>{item?.language}</span>
            </p>

            <p className="d-flex">
              {t('PROPERTIES')} :
              <span className="text-green text-truncate">{item?.properties?.length}</span>
            </p>

          </figcaption>
          <div className="bg-green d-flex justify-content-around px-1">
            <p className="text-center text-white ps-2 pe-3 py-1">
              <span className="d-block fs-18  fw-medium">{item?.buyCount}</span>
              {t('BUY')}
            </p>
            <p className="text-center text-white px-3 border-x py-1">
              <span className="d-block fs-18  fw-medium">
                {item?.rentCount}
              </span>
              {t('RENT')}
            </p>
            <p className="text-center text-white px-2 py-1">
              <span className="d-block fs-18  fw-medium">
                {item?.commercialBuyCount + item?.commercialRentCount}
              </span>
              {t('COMMERCIAL_COUNT')}
            </p>
          </div>
        </div>
      </div>
    </Col>
  )
}

export default AgentCard;
