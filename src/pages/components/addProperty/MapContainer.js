import React, { useRef, useState, memo, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import { isEmpty } from "lodash";
import Helpers from "@/utils/helpers";
const MapContainer = (props) => {
	
	const containerStyle = { width: "auto", height: "400px" };
	const { addressChanged, options } = props;
	const { AREA_BOUND, AREA_REGION,ADDRESS, COUNTRY_RESTRICTIONS, lat, lng, markerPosition, center } = options; 
	//TODO: Check if options has all required fields and in required format
	const [autocompleteLoaded, setAutocompleteLoaded] = useState(false);
	// const [markerPosition, setMarkerPosition] = useState((Helpers.isValidLatitude(lat) || Helpers.isValidLongitude(lng)) ? { lat: lat, lng: lng } : AREA_REGION);
	
	const [address, setAddress] = useState(!isEmpty(ADDRESS) ? ADDRESS : '');
	const autocompleteRef = useRef(null);

	// const handlePlaceChanged = () => {
	// 	if (autocompleteLoaded) {
	// 		const selectedPlace = autocompleteRef.current.getPlace();
	// 		setMarkerPosition(selectedPlace.geometry.location);
	// 		setCenter(selectedPlace.geometry.location);
	// 		setAddress(selectedPlace.formatted_address);
	// 		setSearchedLocation(selectedPlace);
	// 	}
	// };

	// const handleMarkerDrag = (event) => {
	// 	const newLat = event.latLng.lat();
	// 	const newLng = event.latLng.lng();
	// 	handleLatLongChange(newLat, newLng);
	// };

	// const handleLatLongChange = (newLat, newLng) => {
	// 	const geocoder = new window.google.maps.Geocoder();
	// 	geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
	// 		if (status === "OK") {
	// 			setSearchedLocation(results[0]);
	// 		}
	// 	});

	// 	setMarkerPosition({
	// 		lat: newLat,
	// 		lng: newLat,
	// 	});
	// };

	// const setSearchedLocation = (address) => {
	// 	setMarkerPosition(address.geometry.location);
	// 	setAddress(address.formatted_address);
	// 	addressChanged(address);
	// };


	return (
		<div className="map_outer overflow-hidden rounded-3 my-3 my-md-4">
			
				<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
					<Marker draggable={false} position={markerPosition} />
					{/* <Autocomplete
						onLoad={(autocomplete) => {
							setAutocompleteLoaded(true);
							autocompleteRef.current = autocomplete;
						}}
						options={{
							// types: ["geocode"], 
							componentRestrictions: { country: COUNTRY_RESTRICTIONS },
						}}
						//bounds={AREA_BOUND}
						language="en"
						onPlaceChanged={handlePlaceChanged}
					>
						<input
							type="text"
							placeholder="Search location"
							className="form-control"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							style={{
								boxSizing: `border-box`,
								border: `1px solid transparent`,
								width: `400px`,
								height: `40px`,
								padding: `0 12px`,
								borderRadius: `3px`,
								boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
								fontSize: `14px`,
								outline: `none`,
								textOverflow: `ellipses`,
								position: "absolute",
								left: "50%",
								top: "5px",
							}}
						/>
					</Autocomplete> */}
				</GoogleMap>
		</div>
	);
};

export default memo(MapContainer);
