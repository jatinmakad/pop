import PropertyCard from "../../components/properties/PropertyCard";
import SliderConfig from '@/utils/slider_config';
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import apiPath from "../../../utils/apiPath";
import { apiGet } from "../../../utils/apiFetch";
import useToastContext from "@/hooks/useToastContext";
import ReactShare from "@/pages/components/ReactShare";
const SaleSlider = ({ type, pageType }) => {
    const notification = useToastContext();
    const [propertyListing, setPropertyListing] = useState([]);
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState([]);
    const getFeaturedProperties = async (data) => {
        try {
            let path = ''
            if (type === 'rent') {
                path = apiPath.propertyRent
            } else if (type === 'buy') {
                path = apiPath.propertyBuy
            } else if (type === 'commercial-buy') {
                path = apiPath.propertyCommercialBuy
            } else if (type === 'commercial-rent') {
                path = apiPath.propertyCommercialRent
            }
            const result = await apiGet(path, data);
            var response = result?.data?.results;
            setPropertyListing(response);
        } catch (error) {
            console.log("error in get all users list==>>>>", error.message);
        }
    };

    useEffect(() => {
        getFeaturedProperties();
    }, []);

    const [shareButton, setShareButton] = useState(false)
    const [shareButtonLink, setShareButtonLink] = useState('')
    const shareFunction = (link) => {
        setShareButtonLink(link)
        setShareButton(true)
    }

    return (
        <>
            {
                propertyListing?.length > 0 &&
                <Slider {...SliderConfig.properties_slider} className="SliderNav">
                    {propertyListing?.map((item, index) => {
                        return <PropertyCard pageType={pageType} setImages={setImages} setOpen={setOpen} shareFunction={shareFunction} key={index} item={item} getFeaturedProperties={getFeaturedProperties} />;
                    })}
                </Slider>
            }
            {shareButton && <ReactShare shareButton={shareButton} setShareButton={setShareButton} link={shareButtonLink} />}
        </>
    )
}

export default SaleSlider