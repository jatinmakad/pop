import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import Slider from 'react-slick'
import apiPath from '../../utils/apiPath'
import { apiGet } from '../../utils/apiFetch'
import slider_config from '../../utils/slider_config'
import helpers from '../../utils/helpers'
import Link from 'next/link'
import BlogCard from './BlogCard'
import { useRouter } from 'next/router'

const BlogList = () => {
	const router = useRouter()
	const [blogData, setBlogData] = useState([])
	const params = router.query.slug
	const blogList = async (data) => {
		try {
			var path = apiPath.blogList
			const result = await apiGet(path, { slug: params })
			var response = result?.data?.results
			setBlogData(response.docs)
		} catch (error) {
			console.log('error in get all users list==>>>>', error.message)
		}
	}

	useEffect(() => {
		blogList()
	}, [params])

	return (
		<>
			{blogData.length ? (
				<Slider {...slider_config.agentSlider} className='SliderNav '>
					{blogData?.map((item, index) => {
						return <BlogCard key={index} item={item} />
					})}
				</Slider>
			) : null}
		</>
	)
}
export default BlogList
