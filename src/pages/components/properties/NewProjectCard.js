import React, { useContext, useState } from 'react'
import CustomImage from '../CustomImage'
import AuthContext from '@/context/AuthContext'
import { useTranslation } from 'react-i18next'
import Helpers from '@/utils/helpers'
import Link from 'next/link'
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { compact } from 'lodash'

const NewProjectCard = ({ item }) => {
    const { config, direction } = useContext(AuthContext)
    const { t } = useTranslation()
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState([]);
    // const [addressView] = useState(
    //     compact([
    //         item?.unitNumber,
    //         item?.building,
    //         item?.street,
    //         item?.subCommunity,
    //         item?.community,
    //         item?.city,
    //     ]) || []
    // );
    let price = Helpers?.priceFormat(item?.startingPrice)
    return (
        <div className='company-card-list'>
            <div className='propertie_card_listView'>
                <div className='d-md-flex'>
                <Link href={`/project/${item?.slug}`} >
                    <figure
                        className='position-relative'
                        style={{ cursor: "pointer" }}
                        // onClick={() => {
                        //     if (item?.photos?.length > 0) {
                        //         setOpen(true)
                        //         setImages(
                        //             item?.photos?.map((res) => {
                        //                 return {
                        //                     src: res,
                        //                     width: 3840,
                        //                     height: 2560,
                        //                 }
                        //             })
                        //         )
                        //     }
                        // }}
                    >
                        <div className='property-img'>
                            <CustomImage
                                width={100}
                                height={100}
                                className='w-100 h-100'
                                src={
                                    item?.photos?.length > 0
                                        ? item?.photos[0]
                                        : ''
                                }
                                alt='profilePic'
                            />
                        </div>
                        <span className='img_count'>
                            <img src='images/img.svg' />
                            {item?.photos?.length}
                        </span>
                    </figure>
                    </Link>
                    <figcaption>
                             <Link href={`/project/${item?.slug}`}  className='propertie_detail_first bg-white'>
                            <div className='price_tag mb-2 position-static'>
                               <div className='fs-5 fw-medium text-dark d-block text-decoration-none' >
                                    {item?.[`title${direction?.langKey || ''}`]}
                                </div>
                                <span title={item?.propertyCategory?.map((res, index) => {
                                    return `${res?.[`name${direction?.langKey || ''}`]}${item?.propertyCategory.length - 1 !== index ? '/' : ''}`
                                })} className='apartment px-1 py-1 ms-auto text-truncate'>
                                    {item?.propertyCategory?.map((res, index) => {
                                        return `${res?.[`name${direction?.langKey || ''}`]}${item?.propertyCategory.length - 1 !== index ? '/' : ''}`
                                    })}
                                </span>
                            </div>
                            <p className='mb-2'>{t("BY")} {item?.developerName}</p>

                            <span className='properties_location d-flex align-items-start mb-2'>
                                <img src='images/location.svg' className='me-2' alt='image' />{' '}
                                <span className='ellipsis_text'>{compact([
                                    // item?.unitNumber,
                                    item?.building,
                                    item?.street,
                                    item?.subCommunity,
                                    item?.community,
                                    item?.city,
                                ]).join(", ")}</span>
                            </span>
                            <p className='mb-2'>{item?.minBedrooms}  {item?.maxBedrooms  > 0 ? t("TO")  : ""} {item?.maxBedrooms} {t("BEDROOMS")}</p>
                            <div className='d-sm-flex justify-content-between align-items-center'>
                                <h4 className='price d-flex align-items-center'>
                                    <span className='fs-6 text-dark fw-normal me-2'>
                                        {t('STARTING_PRICE_FROM')}
                                    </span>{' '}
                                    {Helpers?.priceFormat(price)} {config?.currency}{" "}
                                    {/* {`${price}.00`} {config?.currency}{' '} */}
                                </h4>

                                <span   className='btn theme_btn h-auto py-2 mt-2 mt-sm-0'>
                                    {t('VIEW_MORE')}
                                </span>
                            </div>
                        </Link>
                    </figcaption>
                </div>
            </div>
            {open && (
                <Lightbox
                    open={images}
                    plugins={[Thumbnails]}
                    close={() => setOpen(false)}
                    slides={images}
                />
            )}
        </div>
    )
}

export default NewProjectCard
