import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Chance } from 'chance'
mapboxgl.accessToken = 'pk.eyJ1IjoibWFucHJhamFwYXQiLCJhIjoiY2s4OXJmMG5vMDkzNTNncGhzZzZxMHRvbyJ9.AjbPO05wSijJHMCU5Q5N6g'

const Map = () => {
	var chance = new Chance()
	const [data, setData] = useState({
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.10626996063428, 24.057413922693726],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.811577621414415, 24.80822222150148],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.23476221788252, 24.55187037408433],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.061148024459925, 24.354319163360884],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.01774447610347, 24.245534249010092],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.35412197586027, 24.334547027059102],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.28901665332725, 24.344433481102527],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.278165766237294, 24.02768542823874],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.90923560521395, 23.898782553973135],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.55115633128062, 24.08713553259261],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.45349834747935, 23.83924550296925],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.54030544419061, 23.56104515180047],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.95263915357043, 23.56104515180047],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.169656895349505, 23.730023247864168],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.386674637126816, 23.918622151069698],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.1045515728147, 23.431679719701762],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.01774447610347, 23.212465219603843],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.41009479912458, 23.252349276139952],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [53.95435754138825, 23.4714979890485],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.26731487914904, 24.96571448718271],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.408376411305085, 24.995221905197013],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.77730657232837, 24.936199992356052],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.679648588528835, 24.512384926104446],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.79900834650664, 24.15645914647621],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.96177165284092, 24.492637546696685],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.61454326599414, 24.10694611127694],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.75560479815019, 23.72008940476607],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.462630846749846, 23.441635412327372],
					type: 'Point',
				},
				id: 27,
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [55.560288830549354, 24.995221905197013],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.7247705247031, 23.172569252861578],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.67051608925837, 22.912956251097654],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.974340927748756, 23.012866600106136],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.09541907354429, 22.932944224425952],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [53.9977610897447, 23.342044775041657],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.46434923456928, 22.982901248144856],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [53.59627826745486, 23.3918494537851],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [53.45521673529882, 23.888861613594713],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [53.75904157378744, 23.152616808096965],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [54.87668294394743, 22.792966577967107],
					type: 'Point',
				},
			},
			{
				type: 'Feature',
				properties: {
					id: chance.android_id(),
					name: chance.city(),
					price: chance.integer({ min: 1, max: 100 }),
				},
				geometry: {
					coordinates: [56.09198229790698, 24.975551079802145],
					type: 'Point',
				},
				id: 39,
			},
		],
	})
	const [theMap, setMap] = useState(null)

	const mapContainerRef = useRef(null)

	useEffect(() => {
		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [55.2468246, 25.0696169],
			zoom: 7,
			projection: 'mercator',
		})
		map.addControl(new mapboxgl.NavigationControl())
		setMap(map)
		// return () => {
		// 	theMap.remove()
		// }
	}, [])

	useEffect(() => {
		if (theMap) {
			const geojson = data
			const mag1 = ['<', ['get', 'price'], 20]
			const mag2 = ['all', ['>=', ['get', 'price'], 20], ['<', ['get', 'price'], 30]]
			const mag3 = ['all', ['>=', ['get', 'price'], 30], ['<', ['get', 'price'], 40]]
			const mag4 = ['all', ['>=', ['get', 'price'], 40], ['<', ['get', 'price'], 50]]
			const mag5 = ['>=', ['get', 'price'], 50]

			// colors to use for the categories
			const colors = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c']
			theMap.on('load', () => {
				// add a clustered GeoJSON source for a sample set of earthquakes
				theMap.addSource('earthquakes', {
					type: 'geojson',
					data: geojson,
					cluster: true,
					clusterRadius: 80,
					clusterProperties: {
						// keep separate counts for each magnitude category in a cluster
						mag1: ['+', ['case', mag1, 1, 0]],
						mag2: ['+', ['case', mag2, 1, 0]],
						mag3: ['+', ['case', mag3, 1, 0]],
						mag4: ['+', ['case', mag4, 1, 0]],
						mag5: ['+', ['case', mag5, 1, 0]],
						minPrice: ['min', ['get', 'price']],
					},
				})
				// circle and symbol layers for rendering individual earthquakes (unclustered points)
				theMap.addLayer({
					id: 'earthquake_circle',
					type: 'circle',
					source: 'earthquakes',
					filter: ['!=', 'cluster', true],
					paint: {
						'circle-color': ['case', mag1, colors[0], mag2, colors[1], mag3, colors[2], mag4, colors[3], colors[4]],
						'circle-opacity': 0.6,
						'circle-radius': 12,
					},
				})

				theMap.on('click', 'earthquake_circle', (e) => {
					const features = theMap.queryRenderedFeatures(e.point, {
						layers: ['earthquake_circle'],
					})

					console.log('features:', features, e)
				})

				theMap.addLayer({
					id: 'earthquake_label',
					type: 'symbol',
					source: 'earthquakes',
					filter: ['!=', 'cluster', true],
					layout: {
						'text-field': ['number-format', ['get', 'price'], { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }],
						'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
						'text-size': 10,
					},
					paint: {
						'text-color': ['case', ['<', ['get', 'price'], 300], 'black', 'blue'],
					},
				})

				// objects for caching and keeping track of HTML marker objects (for performance)
				const markers = {}
				let markersOnScreen = {}

				function updateMarkers() {
					const newMarkers = {}
					const features = theMap.querySourceFeatures('earthquakes')
					// for every cluster on the screen, create an HTML marker for it (if we didn't yet),
					// and add it to the map if it's not there already
					for (const feature of features) {
						const coords = feature.geometry.coordinates
						const props = feature.properties
						if (!props.cluster) continue
						const id = props.cluster_id

						let marker = markers[id]
						if (!marker) {
							const el = createDonutChart(props)
							marker = markers[id] = new mapboxgl.Marker({
								element: el,
							}).setLngLat(coords)
						}
						newMarkers[id] = marker

						if (!markersOnScreen[id]) marker.addTo(theMap)
					}
					// for every marker we've added previously, remove those that are no longer visible
					for (const id in markersOnScreen) {
						if (!newMarkers[id]) markersOnScreen[id].remove()
					}
					markersOnScreen = newMarkers
				}

				// after the GeoJSON data is loaded, update markers on the screen on every frame
				theMap.on('render', () => {
					if (!theMap.isSourceLoaded('earthquakes')) return
					updateMarkers()
				})
			})

			// code for creating an SVG donut chart from feature properties
			function createDonutChart(props) {
				const offsets = []
				const counts = [props.mag1, props.mag2, props.mag3, props.mag4, props.mag5]
				let total = 0
				for (const count of counts) {
					offsets.push(total)
					total += count
				}
				const fontSize = total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16
				const r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18
				const r0 = Math.round(r * 0.6)
				const w = r * 2

				let html = `<div class='cluster-div'>
				From ${props.minPrice}
				</div>`

				const el = document.createElement('div')
				el.innerHTML = html
				return el.firstChild
			}
		}
	}, [theMap])

	return <div ref={mapContainerRef} style={{ width: 'auto', height: '600px' }} />
}

export default Map
