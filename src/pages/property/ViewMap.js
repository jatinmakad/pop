import AuthContext from "@/context/AuthContext";
import Helpers from "@/utils/helpers";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { isEmpty, isNumber } from "lodash";
import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
const containerStyle = {
    width: '100%',
    height: '100%',
};
const libraries = ["places"];
const staticLocation = {
    lat: 26.9124,
    lng: 75.7873,
};

const ViewMap = ({ openMap, setOpenMap, location, property_address, property, type }) => {
    const { t } = useTranslation()
    const [coordinates, setCoordinate] = useState(!isEmpty(location) ? { lat: location?.coordinates[1], lng: location?.coordinates[0] } : staticLocation)
    const [selected, setSelected] = useState({})
    const { config,direction } = useContext(AuthContext)
    const [markerPosition, setMarkerPosition] = useState(!isEmpty(location) ? { lat: location?.coordinates[1], lng: location?.coordinates[0] } : staticLocation);
    useEffect(() => {
        setCoordinate({ lat: location?.coordinates[1], lng: location?.coordinates[0] })
        setCoordinate({ lat: location?.coordinates[1], lng: location?.coordinates[0] })
    }, [location])
    const priceFormat = (item) => {
        if (item?.propertyType?.slug == "rent" || item?.propertyType?.slug == "commercial-rent") {
            if (isNumber(item?.priceDaily) && item?.priceDaily > 0) {
                return '/day'
            } else if (isNumber(item?.priceWeekly) && item?.priceWeekly > 0) {
                return '/week'
            } else if (isNumber(item?.priceMonthly) && item?.priceMonthly > 0) {
                return '/month'
            } else if (isNumber(item?.priceYearly) && item?.priceYearly > 0) {
                return '/year'
            } else {
                return ''
            }
        } else {
            return ''
        }
    }
    const priceFormatType = (item) => {
        if (type == 'project') {
            return Helpers.priceFormat(item?.startingPrice)
        } else {
            if (item?.propertyType?.slug == "rent" || item?.propertyType?.slug == "commercial-rent") {
                if (isNumber(item?.priceDaily) && item?.priceDaily > 0) {
                    return Helpers.priceFormat(item?.priceDaily)
                } else if (isNumber(item?.priceWeekly) && item?.priceWeekly > 0) {
                    return Helpers.priceFormat(item?.priceWeekly)
                } else if (isNumber(item?.priceMonthly) && item?.priceMonthly > 0) {
                    return Helpers.priceFormat(item?.priceMonthly)
                } else if (isNumber(item?.priceYearly) && item?.priceYearly > 0) {
                    return Helpers.priceFormat(item?.priceYearly)
                }
            } else {
                return Helpers.priceFormat(item?.price)
            }
        }
    }
    return (
        <Modal size="xl" fullscreen show={openMap} onHide={() => setOpenMap(false)} >
            <Modal.Header className="d-flex justify-content-center" closeButton>
                <Modal.Title>{t("View_Map")} {!isEmpty(property_address) ? `(${property_address})` : "" }</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
                    <GoogleMap mapContainerStyle={containerStyle} center={coordinates} zoom={14}>
                        <Marker onClick={() => { setSelected(property) }} draggable={false} position={markerPosition} >
                            {!isEmpty(selected) &&
                                <InfoWindow><div>
                                    <a target="_blank" href={`${window?.location?.origin}/${type === 'project' ? 'project' : 'property'}/${property?.slug}`}>{property_address}</a>
                                    <p>{type === 'project' ? 'Starting Price From' : 'Price'} - <span style={{ fontWeight: "500" }}>{priceFormatType(property)} {config?.currency} {priceFormat(property)}</span></p>
                                </div></InfoWindow>
                            }
                        </Marker>
                    </GoogleMap>
                </LoadScript>
            </Modal.Body>
        </Modal>
    )
}
export default ViewMap