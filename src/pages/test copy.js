import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api'
import { Chance } from 'chance'
// import MarkerClusterer from '@react-google-maps/api/lib/components/addons/MarkerClusterer'

const containerStyle = {
	width: 'auto',
	height: '600px',
}

const center = {
	lat: 25.0696169,
	lng: 55.2468246,
}

const options = {
	gestureHandling: 'greedy',
}

const Map = () => {
	var chance = new Chance()
	const [markerData, setData] = useState([])

	const handleMarkerClick = (marker) => {
		setSelectedMarker(marker)
	}

	const handleInfoWindowClose = () => {
		setSelectedMarker(null)
	}

	useEffect(() => {
		const dataArray = []

		for (let i = 1; i <= 100; i++) {
			const coordinatesString = chance.coordinates()

			const coordinatesArray = coordinatesString.split(', ')
			const latitude = parseFloat(coordinatesArray[0])
			const longitude = parseFloat(coordinatesArray[1])
			const dataObject = {
				id: i,
				name: chance.city(),
				price: chance.integer({ min: 1, max: 99999999 }),
				location: {
					type: 'Point',
					coordinates: [longitude, latitude],
				},
				position: { lat: latitude, lng: longitude },
			}

			dataArray.push(dataObject)
		}

		setData(dataArray)
	}, [])
	return (
		<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
			<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} options={options}>
				<MarkerClusterer>{(clusterer) => markerData.map((marker, index) => <Marker key={index} position={marker.position} clusterer={clusterer} />)}</MarkerClusterer>
			</GoogleMap>
		</LoadScript>
	)
}

export default Map
