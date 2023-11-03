import { apiGet } from "@/utils/apiFetchServer";
import React, { useContext } from "react";
import apiPath from "@/utils/apiPath";
import Head from "next/head";
import { Container } from "react-bootstrap";
import AuthContext from '@/context/AuthContext'
import { useTranslation } from "react-i18next";

const AboutCompany = ({ data }) => {
	const { direction } = useContext(AuthContext)
	const { t } = useTranslation();
	const content = data?.results || [];
	return (
		<>
			<Head>
				<title>Mada Properties : About Company</title>
			</Head>
			<div className="main_wrap blog_detail">
				<Container>
					<div className="blog-detail-card">
						<div className="border-0 blog-detail-card card">
							<figure>
								<img class="card-img card-img-top w-100" src={content?.image} />
							</figure>
							<div className="pb-sm-4 card-body">
								<h2 className="mb-3 mb-lg-4"> {t('ABOUT_COMPANY')}</h2>
								<p dangerouslySetInnerHTML={{ __html: content[`content${direction?.langKey || ''}`] }}></p>
							</div>
						</div>
					</div>
				</Container>
			</div>
		</>
	);
};

export default AboutCompany;

export async function getStaticProps() {
	const { status, data } = await apiGet(apiPath.getContent, {
		slug: "about-us",
	});

	return {
		props: { status, data },
		revalidate: 10
	}
}
