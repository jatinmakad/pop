import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { isEmpty, isNumber, property } from 'lodash'
import Helpers from "@/utils/helpers";
import AuthContext from "@/context/AuthContext";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
const containerStyle = {
    width: '100%',
    height: '100%',
};
const libraries = ["places"];
const ViewMapAll = ({ openMap, setOpenMap, location, onZoomChange, hasNextPage }) => {
    const [coordinates, setCoordinate] = useState(location)
    const [selected, setSelected] = useState({})
    const { config } = useContext(AuthContext)
    const [zoom, setZoom] = useState(10)
    const [center, setCenter] = useState({
        lat: !isEmpty(coordinates) ? coordinates[0]?.lat : 0.00, lng: !isEmpty(coordinates) ? coordinates[0]?.lng : 0.00
    })

    const mapRef = useRef(null);
    const handleZoomChanged = () => {
        const mapZoomLevel = mapRef.current.getZoom();
        setZoom(mapZoomLevel)
    };
    useEffect(() => {
        if (location?.length > 0) {
            setCoordinate(location)
        }
    }, [location])

    if (isEmpty(location)) {
        return <></>
    }

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

    useEffect(() => {
        if (hasNextPage) {
            onZoomChange(zoom)
        }
    }, [zoom])

    return (
        <Modal size="xl" fullscreen show={openMap} onHide={() => setOpenMap(false)} >
            <Modal.Header className="d-flex justify-content-center" closeButton>
                <Modal.Title>Map View</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}
                        onLoad={map => {
                            mapRef.current = map;
                            map.addListener('zoom_changed', handleZoomChanged);
                        }}
                    >
                        {coordinates?.length > 0 && coordinates?.map((marker, index) => {
                            return (
                                <Marker onClick={() => { setSelected(marker); setCenter({ lat: marker?.lat, lng: marker?.lng }) }} key={index} draggable={false} position={{ lat: marker?.lat, lng: marker?.lng }} >
                                    {marker == selected &&
                                        <InfoWindow><div>
                                            <a target="_blank" href={`${window?.location?.origin}/${marker?.property?.check === 'project' ? 'project' : 'property'}/${marker?.property?.slug}`}>{marker?.property?.title}</a>
                                            <p>{marker?.property?.check === 'project' ? 'Starting Price From' : 'Price'} - <span style={{ fontWeight: "500" }}>{priceFormatType(marker?.property)} {config?.currency} {priceFormat(marker?.property)}</span></p>
                                        </div></InfoWindow>
                                    }
                                </Marker>
                            )
                        })}
                    </GoogleMap>
                </LoadScript>
            </Modal.Body>
        </Modal >
    )
}

export default ViewMapAll