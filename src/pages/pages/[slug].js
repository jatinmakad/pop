import AuthContext from '@/context/AuthContext'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import { useContext, useEffect } from 'react'
import { Card, Container } from 'react-bootstrap'
import { apiGet } from '../../utils/apiFetchServer'
import apiPath from '../../utils/apiPath'

function BlogDetails({ data }) {
	const { direction } = useContext(AuthContext)
	const content = data?.results || []

	// const getData = async () => {
	// 	const { data } = await apiGet(apiPath.getAllPages);
	// 	console.log("data :>> ", data.results);
	// };

	// useEffect(() => {
	// 	getData();
	// }, []);

	return (
		<>
			<div className='main_wrap blog-main'>
				<NextSeo
					title={content[`metaTitle${direction?.langKey || ''}`]}
					description={content[`metaDescription${direction?.langKey || ''}`] || ''}
					keywords={content[`metaKeyword${direction?.langKey || ''}`] || ''}
				/>
				<section className='blog_detail'>
					<Container>
						<Card className='border-0 blog-detail-card'>
							<figure>
								<Card.Img src={content?.image || ''} className='card-img-top w-100' />
							</figure>
							<Card.Body className='pb-sm-4'>
								<h2 className='mb-3 mb-lg-4'>{content[`title${direction?.langKey || ''}`]}</h2>
								<div dangerouslySetInnerHTML={{ __html: content[`content${direction?.langKey || ''}`] }}></div>
							</Card.Body>
						</Card>
					</Container>
				</section>
			</div>
		</>
	)
}

export async function getStaticPaths() {
	const { data } = await apiGet(apiPath.getAllPages)
	let slugs = data.results
	console.log('slugs :>> ', slugs)
	slugs = slugs.filter((s) => 'publicSlug' in s)
	const paths = slugs.map(({ publicSlug }) => ({ params: { slug: publicSlug } }))
	return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
	const { slug } = params
	const { status, data } = await apiGet(apiPath.getContent, {
		publicSlug: slug,
	})

	return {
		props: { status, data },
	}
}

export default BlogDetails
