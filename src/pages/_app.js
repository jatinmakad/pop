import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SSRProvider from "react-bootstrap/SSRProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContextProvider } from "@/context/ToastContext";
import Layout from "./components/Layout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./../i18n";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config";
import i18n from "./../i18n";

export default function App({ Component, pageProps }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	let html_dir = "ltr";
	let html_lang = "en";
	const handleRouteChange = async () => {
		setIsLoading(true);

		const language_dir = localStorage.getItem("language_dir");
		if (!isEmpty(language_dir)) {
			const language_dirObj = JSON.parse(language_dir);
			const { dir, language } = language_dirObj;
			html_dir = dir;
			html_lang = language;
		}

		document.querySelector("html").setAttribute("dir", html_dir);
		document.querySelector("html").setAttribute("lang", html_lang);
 
		if (html_dir === "rtl") {
			await import("bootstrap/dist/css/bootstrap.rtl.min.css");
		} else {
			await import("bootstrap/dist/css/bootstrap.min.css");
		}
		await import("@/styles/style.css");
		await import("@/styles/developer.css");
		await import("@/styles/responsive.css");
		i18n.changeLanguage(html_lang);
		setIsLoading(false);
	};

	useEffect(() => {
		router.events.on("routeChangeComplete", handleRouteChange);
		handleRouteChange();
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, []);

	const GOOGLE_CLIENT_ID = "1097633375523-jmoai63fg3jc0khi4ib2qlmsann0dtbd.apps.googleusercontent.com";
	return (
		<SSRProvider>
			<ToastContextProvider>
				<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
					<AuthProvider>
						<Layout>
							{isLoading ? (
								<div
									style={{
										position: "fixed",
										top: 0,
										left: 0,
										width: "100%",
										height: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: "#90c14f",
										zIndex: 9999,
										color: "#fff",
									}}
								></div>
							) : (
								<>
									<DefaultSeo {...SEO} />
									<Component {...pageProps} />
								</>
							)}
						</Layout>
					</AuthProvider>
				</GoogleOAuthProvider>
			</ToastContextProvider>
		</SSRProvider>
	);
}
