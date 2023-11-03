import { Html, Head, Main, NextScript } from "next/document";
import { Spinner } from "react-bootstrap";

export default function Document() {
	return (
		<Html lang="en" dir="ltr">
			<Head />
			<title>Mada Properties</title>
			<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"></meta>
			<body>
				<div className="loader" id="loader">
					<Spinner animation="border" size="2xl" role="status">
						<span className="visually-hidden">Loading...</span>
					</Spinner>
				</div>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
