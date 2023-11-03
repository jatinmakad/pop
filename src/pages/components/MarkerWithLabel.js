import { Marker } from '@react-google-maps/api'

const MarkerWithLabel = ({ label, ...markerProps }) => (
	<>
		<Marker {...markerProps} />
		<div
			style={{
				position: 'absolute',
				transform: 'translate(-50%, -100%)',
				background: 'white',
				padding: '4px 8px',
				borderRadius: '4px',
				fontWeight: 'bold',
				fontSize: '12px',
				color: 'black',
			}}
		>
			{label}
		</div>
	</>
)

export default MarkerWithLabel
