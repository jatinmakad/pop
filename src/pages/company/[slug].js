import Link from "next/link";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import CompanyPropertyCard from "../components/CompanyPropertyCard";
import apiPath from "../../utils/apiPath";
import { apiGet } from "../../utils/apiFetch";
import ManagePropertyCardNew from "../components/properties/ManagePropertyCardNew";
import AgentCard from "../agents/agentCard";
import AuthContext from "@/context/AuthContext";
import ReactShare from "../components/ReactShare";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import Head from "next/head";
import EmailDialogbox from "../components/EmailDialogbox";
import useToastContext from "@/hooks/useToastContext";
import CustomImage from "../components/CustomImage";
import { useTranslation } from 'react-i18next'

const CompanyDetail = () => {
    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const notifications = useToastContext()
    const [email, setEmail] = useState(false)
    const [images, setImages] = useState([]);
    const [open, setOpen] = useState(false)
    const [company, setCompany] = useState({})
    const [key, setKey] = useState('property')
    const [agentList, setAgentList] = useState([])
    const [agentData, setAgentData] = useState({})
    const [property, setProperty] = useState([])
    const [propertyData, setPropertyData] = useState({})
    const router = useRouter()
    const [shareButton, setShareButton] = useState(false)
    const [shareButtonLink, setShareButtonLink] = useState('')
    const [totalDocs, setTotalDocs] = useState(0)
    const [filterAgent, setFilterAgent] = useState({
        page: 1,
        limit: 10,
    });
    const [filterCompany, setFilterCompany] = useState({
        page: 1,
        limit: 10,
        sortType: '',
        type: 'buy',
        priceType: '',
        sortKey: ''
    });
    const shareFunction = (link) => {
        setShareButtonLink(link)
        setShareButton(true)
    }

    const getCompanyDetail = async (slug) => {
        try {
            var path = apiPath.companyDetails;
            const result = await apiGet(path, { slug: slug });
            var response = result?.data?.results;
            if (!isEmpty(response)) {
                getAgentList(response._id)
                let obj = { ...filterCompany, type: response?.properties?.length > 0 ? response?.properties[0]?.propertyType?.slug : 'buy' }
                setFilterCompany(obj)
                getPropertyList(response._id, obj)
                setCompany(response);
            }
        } catch (error) {
        }
    };

    const getAgentList = async (id, obj = filterAgent, type) => {
        try {
            const { status, data } = await apiGet(apiPath.agentListByCompany, {
                page: obj?.page || 1,
                limit: obj?.limit || filter?.limit,
                companyId: id
            });
            if (status == 200) {
                if (data.success) {
                    setAgentData(data?.results)
                    if (type == "add") {
                        setAgentList([...agentList, ...data?.results.docs]);
                    } else {
                        setAgentList(data?.results.docs);
                    }
                }
            }
        } catch (error) { }
    };

    const getPropertyList = async (id, obj = filterCompany, type) => {
        try {
            var path = apiPath.propertyListByCompany;
            const { status, data } = await apiGet(path, {
                page: obj?.page || 1,
                limit: obj?.limit || filter?.limit,
                companyId: id,
                type: obj?.type,
                sortKey: obj?.sortKey ? obj?.sortKey : 'price',
                sortType: obj?.sortBy,
            });
            if (status == 200) {
                if (data.success) {
                    setPropertyData(data?.results)
                    setTotalDocs(data.results.totalDocs)
                    if (type == "add") {
                        setProperty([...property, ...data?.results.docs]);
                    } else {
                        setProperty(data?.results.docs);
                    }
                }
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        if (router?.query?.slug !== '') {
            getCompanyDetail(router?.query?.slug)
        }
    }, [router?.query?.slug])

    const LoadMoreAgent = () => {
        let obj = {
            ...filterAgent,
            page: filterAgent.page + 1,
        };
        setFilterAgent(obj);
        getAgentList(company?._id, obj, "add");
    };

    const LoadMoreCompany = () => {
        let obj = {
            ...filterCompany,
            page: filterCompany.page + 1,
        };
        setFilterCompany(obj);
        getPropertyList(company?._id, obj, "add");
    };

    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        sortType: '',
        type: 'buy',
        priceType: '',
        sortKey: ''
    });

    return (
        <div className="main_wrap">
            <Head>
                <title>
                    Mada Properties : Company - {company?.name}
                </title>
            </Head>
            <section className="company-listing-sec">
                <Container>
                    <Row>
                        <Col md={8}>
                            <div className="company-list-card bg-white p-4">
                                <div className="d-sm-flex mb-4">
                                    <figure>
                                        <CustomImage width={200} height={142} src={company?.logo || null} alt="companyImage" />
                                    </figure>
                                    <figcaption>
                                        <h2 className="fs-5 fw-medium text-dark d-block text-decoration-none mb-2">
                                            {company?.name}
                                        </h2>
                                        <ul>
                                            <li>
                                                {t('EMPLOYEES')} {company?.agentsCount > 0 ? <span>{company?.agentsCount} {t('AGENTS')}</span> : 0}
                                            </li>
                                            <li>
                                                {t('ACTIVE_LISTING')} {company?.propertyCount > 0  ? <span>{company?.propertyCount} {t('PROPERTIES')}</span> : <span>0 Property</span>}
                                            </li>
                                        </ul>
                                    </figcaption>
                                </div>
                                <div className="about-will-sec">
                                    <h2 className="fs-5 fw-medium text-dark d-block text-decoration-none mb-3">
                                        {company?.name}
                                    </h2>
                                    <ul>
                                        <li>
                                            {t('ORN')} :<span>{company?.orn}</span>
                                        </li>
                                        <li>
                                            {t('HEAD_OFFICE')} :<span>{company?.headOffice}</span>
                                        </li>
                                        <li>
                                            {t('BIO')} :<span>{company?.bio}</span>
                                        </li>
                                    </ul>

                                    {/* <div className="pt-3">
                                        <p>
                                            Lorem Ipsum is simply dummy text of the printing and
                                            typesetting industry. Lorem Ipsum has been the industrys
                                            standard dummy text ever since the 1500s, when an unknown
                                            printer took a galley of type and scrambled it to make a
                                            type specimen book.
                                        </p>
                                        <p>
                                            Lorem Ipsum is simply dummy text of the printing and
                                            typesetting industry. Lorem Ipsum has been the industrys
                                            standard dummy text ever since the 1500s, when an unknown
                                            printer took a galley of type and scrambled it to make a
                                            type specimen book.
                                        </p>
                                    </div> */}
                                </div>
                            </div>
                        </Col>
                        {user?.role !== 'company' &&
                            <Col md={4}>
                                <div className="list_property_box d-flex flex-column justify-content-center align-items-center rounded px-2 text-center">
                                    <h2 className="text-white mb-2">{t('CONTACT_THE_BROKER')}</h2>
                                    <a
                                        href={isEmpty(user) ? 'javascript:void(0)' : `tel:${company?.countryCode + company?.mobile}`}
                                        onClick={() => { if (isEmpty(user)) { notifications.success('Please login to contact agent.') } }}
                                        className="btn theme_btn mt-3 d-block w-75 w-lg-50">
                                        {t('CALL_BROKER')}
                                    </a>
                                    <a
                                        // href={`mailto:${!isEmpty(company) ? company?.email : "#"
                                        //     }`}
                                        href="javascript:void(0)"
                                        onClick={() => { if (!isEmpty(user)) { setEmail(true) } else { notifications.success('Please login to contact agent.') } }}
                                        className="btn theme_btn mt-3 d-block w-75 w-lg-50">
                                        {t('EMAIL_BROKER')}
                                    </a>
                                </div>
                            </Col>
                        }
                    </Row>

                    <div className="filter_form_wrap agentWrap2 my-agent-wrap mt-0 p-4">
                        <Tabs
                            defaultActiveKey="agent_property"
                            id="justify-tab-example"
                            className="mb-3"
                            justify
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                        >
                            <Tab eventKey="agent" title={`${t("COMPANY_AGENTS")} (${agentData?.totalDocs || 0
                                })`}>
                                <div className="py-3 ">
                                    <Row>
                                        {agentList?.length > 0 && agentList?.map((item, index) => {
                                            return (
                                                <Fragment key={index}>
                                                    <AgentCard
                                                        key={index}
                                                        item={item}
                                                        type='customer'
                                                    />
                                                </Fragment>
                                            );
                                        })}
                                        {agentList?.length == 0 && (
                                            <h2 className="w-100 d-flex justify-content-center">
                                                {t('NO_RECORD_FOUND')}
                                            </h2>
                                        )}
                                        {agentData?.totalPages !== agentData.page && (
                                            <div className="text-center loadMore mt-4 mt-md-5 mb-5 mb-xl-0">
                                                <Button
                                                    onClick={() => LoadMoreAgent()}
                                                    className="border-green rounded text-green fw-medium fs-5 text-white"
                                                >
                                                    {t('LOAD_MORE')}
                                                </Button>
                                            </div>
                                        )}
                                    </Row>
                                </div>
                            </Tab>
                            <Tab
                                eventKey="property"
                                title={`${t("COMPANY_PROPERTIES")} (${company?.propertyCount || 0
                                    })`}
                            // title={` ${t('MY_PROPERTIES')}`}
                            >
                                {/* <div className="py-3">
                                    <div className="result">
                                        {property?.length > 0 &&
                                            property.map((item, index) => {
                                                return (
                                                    <ManagePropertyCardNew
                                                        setImages={setImages}
                                                        setOpen={setOpen}
                                                        key={index}
                                                        item={item}
                                                        user={user}
                                                        type={"company"}
                                                        shareFunction={shareFunction}
                                                    />
                                                );
                                            })}
                                        {property?.length == 0 && (
                                            <h2 className="w-100 d-flex justify-content-center">
                                                {t('NO_RECORD_FOUND')}
                                            </h2>
                                        )}
                                        {propertyData?.totalPages !== propertyData.page && (
                                            <div className="text-center loadMore mt-4 mt-md-5 mb-5 mb-xl-0">
                                                <Button
                                                    onClick={() => LoadMoreCompany()}
                                                    className="border-green rounded text-green fw-medium fs-5 text-white"
                                                >
                                                    {t('LOAD_MORE')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div> */}



                                <div className="py-3">
                                    <div className="d-sm-flex justify-content-between flex-wrap align-itmes-center mb-4">
                                        <Form className="d-flex align-items-center agent_filter agent_filter_detail">
                                            <label htmlFor="" className="me-2 fs-6 text-nowrap">
                                                {t('SORT_BY')}
                                            </label>
                                            <select
                                                value={filter?.sortBy} onChange={(e) => {
                                                    let obj = {
                                                        ...filter,
                                                        sortBy: e.target.value,
                                                    };
                                                    setFilter(obj);
                                                    getPropertyList(company?._id, obj, '');
                                                }}
                                                className="form-control fs-6 me-3"
                                            >
                                                <option value="">{t('NEWEST')}</option>
                                                <option value="asc">{t('PRICE_ASC')}</option>
                                                <option value="desc">{t('PRICE_DESC')}</option>
                                            </select>
                                            <select value={filter?.type} onChange={(e) => {
                                                setFilter({
                                                    ...filter,
                                                    type: e.target.value,
                                                    sortKey: (e?.target?.value === 'buy' || e?.target?.value === 'commercial-buy') ? 'price' : '',
                                                    priceType: (e?.target?.value === 'buy' || e?.target?.value === 'commercial-buy') ? '' : filter?.priceType
                                                });
                                                getPropertyList(company?._id, {
                                                    ...filter,
                                                    type: e.target.value,
                                                    sortKey: (e?.target?.value === 'buy' || e?.target?.value === 'commercial-buy') ? 'price' : '',
                                                    priceType: (e?.target?.value === 'buy' || e?.target?.value === 'commercial-buy') ? '' : filter?.priceType
                                                }, '')
                                            }} className="form-control me-3 fs-6">
                                                <option value="buy">{t('RESIDENTIAL_BUY')}</option>
                                                <option value="rent">{t('RESIDENTIAL_RENT')}</option>
                                                <option value="commercial-buy">{t('COMMERCIAL_BUY')}</option>
                                                <option value="commercial-rent">{t('COMMERCIAL_RENT')}</option>
                                            </select>
                                            {(filter?.type == 'commercial-rent' || filter?.type === 'rent') &&
                                                <select value={filter?.priceType} onChange={(e) => {
                                                    setFilter({
                                                        ...filter,
                                                        priceType: e.target.value,
                                                        sortKey: e.target.value
                                                    });
                                                    getPropertyList(company?._id, {
                                                        ...filter,
                                                        priceType: e.target.value,
                                                        sortKey: e.target.value
                                                    }, '')
                                                }} className="form-control fs-6">
                                                    <option defaultValue value=''>All</option>
                                                    <option value="priceDaily">Daily</option>
                                                    <option value="priceWeekly">Weekly</option>
                                                    <option value="priceMonthly">Monthly</option>
                                                    <option value="priceYearly">Yearly</option>
                                                </select>
                                            }
                                        </Form>
                                        <div className="total_property">
                                            {t('TOTAL_PROPERTIES')} <span className="fw-medium">{totalDocs}</span>
                                        </div>
                                    </div>
                                    <div className="result">
                                        {property?.length > 0 &&
                                            property.map((item, index) => {
                                                return (
                                                    <ManagePropertyCardNew
                                                        setImages={setImages}
                                                        setOpen={setOpen}
                                                        key={index}
                                                        item={item}
                                                        user={user}
                                                        type={"company"}
                                                        shareFunction={shareFunction}
                                                    />
                                                );
                                            })}
                                        {property?.length == 0 && (
                                            <h2 className="w-100 d-flex justify-content-center">
                                                {t('NO_RECORD_FOUND')}
                                            </h2>
                                        )}
                                        {propertyData?.totalPages !== propertyData.page && (
                                            <div className="text-center loadMore mt-4 mt-md-5 mb-5 mb-xl-0">
                                                <Button
                                                    onClick={() => LoadMoreCompany()}
                                                    className="border-green rounded text-green fw-medium fs-5 text-white"
                                                >
                                                    {t('LOAD_MORE')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </Container>
            </section>
            {open && (
                <Lightbox
                    open={open}
                    plugins={[Thumbnails]}
                    close={() => setOpen(false)}
                    slides={images}
                />
            )}
            {shareButton && <ReactShare shareButton={shareButton} setShareButton={setShareButton} link={shareButtonLink} />}
            {email && <EmailDialogbox type='company' open={email} agentData={company} onHide={() => setEmail(false)} />}
        </div>
    );
};

export default CompanyDetail;
