import React from 'react'
import Slider from 'react-slick'
import { Breadcrumb, Container, Col, Row, Form } from 'react-bootstrap'

function ProjectDetail () {
  const floorPlanSlider = {
    nav: true,
    dots: false,
    arrow: true,
    infinite: false,
    speed: 500,
    margin: 20,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1.5
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1.2
        }
      }
    ]
  }
  const rentProperties = {
    nav: true,
    dots: false,
    arrow: true,
    infinite: false,
    speed: 500,
    margin: 20,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1.5
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1.2
        }
      }
    ]
  }

  return (
    <>
      <div className='detailBanner position-relative'>
        <img src='./images/detail_banner.jpg' className='w-100' alt='image' />
        <div className='detail_caption'>
          <div className='container'>
            <div className='d-sm-flex align-items-center'>
              <div className='pe-3'>
                <h2 className='text-white mb-2'>
                  Vezul <span className='text-green'>Residence</span>
                </h2>
              </div>
              <h2 className='ms-auto text-white'>10,000 SAR</h2>
            </div>
          </div>
        </div>
      </div>

      <div className='main_wrap'>
        <div className='breadcrum_Main pt-0'>
          <Container>
            <Row className='align-items-center'>
              <Col md={7}>
                <Breadcrumb>
                  <Breadcrumb.Item href='#'>Home</Breadcrumb.Item>
                  <Breadcrumb.Item href='#'>New Projects</Breadcrumb.Item>
                  <Breadcrumb.Item active>Vezul Residence</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col md={5}>
                <div className='breadcrumb_btn d-flex align-items-center justify-content-md-end mt-3 mt-md-0'>
                  <a href='#' className='d-flex align-items-center'>
                    <img src='./images/share.svg' className='me-2' />
                    Share
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center mx-2 mx-lg-3'
                  >
                    <img src='./images/like.svg' className='me-2' />
                    Save
                  </a>
                  <a href='#' className='d-flex align-items-center'>
                    <img src='./images/report.svg' className='me-2' />
                    Report
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row>
            <Col lg={8} xl={9}>
              <div className='d-flex flex-wrap align-items-center mb-3 view_btn'>
                <a
                  href='#'
                  className='d-flex align-items-center text-white me-2 mb-2 mb-sm-0'
                >
                  <img src='./images/360.svg' className='me-2' />
                  View 360 Tour
                </a>
                <a
                  href='#'
                  className='d-flex align-items-center text-white me-2 mb-2 mb-sm-0'
                >
                  <img src='./images/camera.svg' className='me-2' />
                  Show 20 photos
                </a>
                <a
                  href='#'
                  className='ms-sm-auto border d-flex align-items-center rounded text-dark bg-white mb-2 mb-sm-0'
                >
                  <img src='./images/location.svg' className='me-2' alt='image' />
                  View on Map
                </a>
              </div>

              <Row className='position-relative detial_main_pic gx-2'>
                <Col md={8}>
                  <img
                    src='./images/detail_main.jpg'
                    className='w-100'
                    alt='image'
                  />
                </Col>
                <Col md={4}>
                  <a href='#'>
                    <img src='./images/thumb1.jpg' className='w-100' alt='image' />
                  </a>
                  <a href='#'>
                    <img src='./images/thumb2.jpg' className='w-100' alt='image' />
                  </a>
                </Col>
                <div className='col-md-12 thumbnail_main'>
                  <ul>
                    <li>
                      <a href='#'>
                        <img
                          src='./images/thumb3.jpg'
                          className='w-100'
                          alt='image'
                        />
                      </a>
                    </li>
                    <li>
                      <a href='#'>
                        <img
                          src='./images/thumb4.jpg'
                          className='w-100'
                          alt='image'
                        />
                      </a>
                    </li>
                    <li>
                      <a href='#' className='position-relative d-block'>
                        <img
                          src='./images/thumb5.jpg'
                          className='w-100'
                          alt='image'
                        />
                        <span className='video_icon'>
                          <img src='./images/video_icon.svg' alt='image' />
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </Row>
              <div className='bg-white p-3 p-md-4'>
                <div className='bg-light rounded p-3'>
                  <div className='d-flex align-items-center mb-2'>
                    <h3 className='mb-0 fs-5'>Vezul Residence</h3>
                    <a
                      className='text-white bg-danger p-2 rounded ms-auto'
                      href='#'
                    >
                      Off-Plan
                    </a>
                  </div>
                  <div className='d-md-flex align-items-center flex-wrap'>
                    <h4 className='price mb-2 mb-md-0'>
                      <span className='fs-6 text-dark fw-normal'>
                        Starting Price From:
                      </span>
                      326.00 SAR
                    </h4>
                    <p className='ms-auto mb-0'>
                      Handover Date:{' '}
                      <span className='fw-medium fs-7'>20 Apr, 2024</span>
                    </p>
                  </div>
                </div>
              </div>
              <ul className='property_desc bg-white px-3 pb-4 mb-3 rounded'>
                <li>
                  <img src='./images/home.svg' alt='image' />
                  <h6>
                    <span>Type</span>Apartment/ House
                  </h6>
                </li>

                <li>
                  <img src='./images/property.png' alt='image' />
                  <h6>
                    <span>Property Size</span>1200 Sqft
                  </h6>
                </li>

                <li>
                  <img src='./images/bedroom_detail.svg' alt='image' />
                  <h6>
                    <span>Bedrooms</span>3 Bedrooms / 4 Beds
                  </h6>
                </li>
                <li>
                  <img src='./images/bathroom_detail.svg' alt='image' />
                  <h6>
                    <span>Bathrooms</span>3 Full
                  </h6>
                </li>
              </ul>

              <div className='bg-white  p-3 p-sm-4 mb-3 rounded'>
                <div className='heading_line'>
                  <h3 className='position-relative'>Description</h3>
                </div>
                <p>
                  Mada Properties is proud to present this vacant and
                  unfurnished Sidra villa in Dubai Hills. Boasts five spacious
                  bedrooms and six well-appointed bathrooms, making it the
                  perfect retreat for a large family or those who love to
                  entertain. The villa is situated in a desirable location
                  within a single row, ensuring plenty of privacy and a peaceful
                  living environment
                </p>
                <p>
                  Mada Properties is proud to present this vacant and
                  unfurnished Sidra villa in Dubai Hills. Boasts five spacious
                  bedrooms and six well-appointed bathrooms, making it the
                  perfect retreat for a large family or those who love to
                  entertain. The villa is situated in a desirable location
                  within a single row, ensuring plenty of privacy and a peaceful
                  living environment
                </p>
              </div>

              <div className='bg-white p-3 p-sm-4 mb-3 property_feature rounded'>
                <div className='heading_line'>
                  <h3 className='position-relative'>Features</h3>
                </div>
                <ul>
                  <li className='d-flex align-items-center'>
                    <img src='./images/feature1.svg' alt='image' className='me-2' />{' '}
                    Living Room:{' '}
                    <span className='text-green fw-medium ms-1'>
                      2 Living Room
                    </span>
                  </li>

                  <li className='d-flex align-items-center'>
                    <img src='./images/feature2.svg' alt='image' className='me-2' />{' '}
                    Electricity:{' '}
                    <span className='text-green fw-medium ms-1'>Yes</span>
                  </li>

                  <li className='d-flex align-items-center'>
                    <img src='./images/feature3.svg' alt='image' className='me-2' />{' '}
                    Water:{' '}
                    <span className='text-green fw-medium ms-1'>Yes</span>
                  </li>

                  <li className='d-flex align-items-center'>
                    <img src='./images/feature4.svg' alt='image' className='me-2' />{' '}
                    Built Area:{' '}
                    <span className='text-green fw-medium ms-1'>30 M2</span>
                  </li>

                  <li className='d-flex align-items-center'>
                    <img src='./images/feature4.svg' alt='image' className='me-2' />{' '}
                    Land Area:{' '}
                    <span className='text-green fw-medium ms-1'>80 M2</span>
                  </li>

                  <li className='d-flex align-items-center'>
                    <img src='./images/feature4.svg' alt='image' className='me-2' />{' '}
                    Street Width:{' '}
                    <span className='text-green fw-medium ms-1'>80 M2</span>
                  </li>
                </ul>

                <a href='#' className='link'>
                  More...
                </a>
              </div>

              <div className='bg-white p-3 p-sm-4 mb-3 property_amenities rounded'>
                <div className='heading_line'>
                  <h3 className='position-relative'>Amenities</h3>
                </div>
                <ul>
                  <li className='d-flex align-items-center'>
                    <img
                      src='./images/amenities1.svg'
                      alt='image'
                      className='me-2'
                    />{' '}
                    Furnished
                  </li>

                  <li className='d-flex align-items-center'>
                    <img
                      src='./images/amenities2.svg'
                      alt='image'
                      className='me-2'
                    />{' '}
                    Central AC
                  </li>

                  <li className='d-flex align-items-center'>
                    <img
                      src='./images/amenities3.svg'
                      alt='image'
                      className='me-2'
                    />{' '}
                    Pet Allowed
                  </li>

                  <li className='d-flex align-items-center'>
                    <img
                      src='./images/amenities4.svg'
                      alt='image'
                      className='me-2'
                    />{' '}
                    Shared Gym
                  </li>

                  <li className='d-flex align-items-center'>
                    <img
                      src='./images/amenities5.svg'
                      alt='image'
                      className='me-2'
                    />{' '}
                    Security
                  </li>

                  <li className='d-flex align-items-center'>
                    <img
                      src='./images/amenities6.svg'
                      alt='image'
                      className='me-2'
                    />{' '}
                    Park
                  </li>

                  <li className='d-flex align-items-center'>
                    <img
                      src='./images/amenities7.svg'
                      alt='image'
                      className='me-2'
                    />{' '}
                    Parking
                  </li>
                </ul>
              </div>

              <div className='bg-white p-3 p-sm-4 mb-3 property_feature rounded'>
                <div className='heading_line d-sm-flex align-items-center mb-3 mb-sm-4'>
                  <h3 className='position-relative mb-0'>Location</h3>
                  <p className='mb-0 mt-2 mt-sm-0 ms-sm-auto d-flex align-items-center'>
                    <img src='./images/location.svg' alt='image' className='me-2' />
                    Dubai, Dubai Hills Estate, Sidra Villas
                  </p>
                </div>
                <div className='mb-4'>
                  <img src='./images/map.jpg' className='w-100' alt='image' />
                </div>
                <ul className="mb-4">
                  <li>
                    Reference: <span className='fw-medium'>P2-515-1202</span>
                  </li>
                  <li>
                    Listed: <span className='fw-medium'>10 Days ago</span>
                  </li>
                  <li>
                    Trakheesi Permit:{' '}
                    <span className='fw-medium'>P2-515-1202</span>
                  </li>

                  <li>
                    Broker ORN: <span className='fw-medium'>230620</span>
                  </li>
                  <li>
                    Agent BRN: <span className='fw-medium'>8452254</span>
                  </li>
                  <li>
                    Ownership: <span className='fw-medium'>P2-515-1202</span>
                  </li>
                </ul>

                <div className='p-3 p-md-4 facility mb-3'>
                  <h3>Nearest Facilities</h3>
                  <ul>
                    <li>10 Minutes away from Hospital</li>
                    <li>15 Minutes away from Park</li>
                    <li>20 Minutes away from Garden</li>
                    <li>10 Minutes away from Mall</li>
                  </ul>
                </div>
              </div>

              <div className='bg-white p-3 p-sm-4 mb-3 payment_plan rounded'>
                <div className='heading_line mb-3 mb-sm-4'>
                  <h3 className='position-relative mb-0'>Payment Plan</h3>
                </div>
                <Row className='justify-content-center'>
                  <Col md={4} sm={6}>
                    <div className='border p-3 bg-light text-center rounded mb-3 mb-md-0'>
                      <span className='fw-medium text-dark'>10% </span>On
                      Booking
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className='border p-3 bg-light text-center rounded mb-3 mb-md-0'>
                      <span className='fw-medium text-dark'>10% </span>During
                      Construction
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className='border p-3 bg-light text-center rounded mb-3 mb-md-0'>
                      <span className='fw-medium text-dark'>80% </span>On
                      Handover
                    </div>
                  </Col>
                </Row>
              </div>

              <div className='bg-white p-3 p-sm-4 mb-3 floor_plan rounded'>
                <div className='heading_line mb-3 mb-sm-4 d-sm-flex align-items-center'>
                  <h3 className='position-relative mb-0'>Floor plans</h3>
                  <Form className='d-flex align-items-center ms-sm-auto mt-2 mt-sm-0'>
                    <label htmlFor=''>Number of bedrooms:</label>
                    <select
                      name=''
                      id=''
                      className='border rounded py-2 px-3 ms-2'
                    >
                      <option value=''>All</option>
                    </select>
                  </Form>
                </div>

                <div className='FloorPlanSlider'>
                  <Slider {...floorPlanSlider} className='SliderNav'>
                    <div>
                      <div className='mx-2 text-center border'>
                        <img src='./images/floor.png' className='mw-100' />
                      </div>
                    </div>
                    <div>
                      <div className='mx-2 text-center border'>
                        <img src='./images/floor.png' className='mw-100' />{' '}
                      </div>{' '}
                    </div>
                    <div>
                      <div className='mx-2 text-center border'>
                        <img src='./images/floor.png' className='mw-100' />{' '}
                      </div>
                    </div>
                    <div>
                      <div className='mx-2 text-center border'>
                        <img src='./images/floor.png' className='mw-100' />{' '}
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
            </Col>
            <Col lg={4} xl={3}>
              <div className='sidebar'>
                <div className='agent_detail px-3 pt-2 pb-3 bg-white mb-3'>
                  <div className='text-center pt-5'>
                    <img src='./images/user_agent.png' alt='image' />
                    <h6 className='mt-2 mb-3'>Nathan Richmond</h6>
                    <img src='./images/sidebar_logo.svg' alt='image' />
                  </div>
                  

                  <Form>
                    <Form.Group className='mb-3' controlId='formBasicEmail'>
                      <Form.Label className='fs-7'>Name</Form.Label>
                      <Form.Control type='email' placeholder='Name' />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                      <Form.Label className='fs-7'>Email Address</Form.Label>
                      <Form.Control type='text' placeholder='Email' />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                      <Form.Label className='fs-7'>Mobile Number</Form.Label>
                      <div className='d-flex align-items-center form-control'>
                          <select name='' id='' className='border-0'>
                            <option value=''>+91</option>
                          </select>
                          <Form.Control type='text' className='border-0 border-start rounded-0 py-2  h-auto' placeholder='Mobile Number' />
                      </div>
                    </Form.Group>
                   
                    <div className='social_achiv_left d-flex align-items-cente justify-content-center fs-7 pt-3 mt-3 border-top'>
                      <button
                        className='btn_link bg-green text-white  w-100 border-0'
                      >
                        Request Details
                      </button>
                      <a
                        href='#'
                        className='ms-2 btn_link d-flex align-items-center bg-green text-white w-100 justify-content-center'
                      >
                        <img src='images/call.svg' className='me-sm-2' /> Call
                      </a>
                    </div>
                  </Form>
                </div>
                <div className='text-center'>
                <img src='./images/ad2.jpg' alt='image' />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <section className='properties_for_rent py-4 py-md-5 bg-white'>
        <Container>
          <div className='inner_heading'>
            <h2>
              More available in the{' '}
              <span className='text-green'>same area</span>
            </h2>
            <p>Find homes first, only on Mada Properties.</p>
          </div>

          <Slider {...rentProperties} className='SliderNav'>
            <div>
              <div className='propertie_card'>
                <figure className='position-relative'>
                  <a href='#'>
                    <img src='images/properties1.jpg' />
                    <span className='img_count'>
                      <img src='images/img.svg' />
                      03
                    </span>
                  </a>
                </figure>
                <figcaption>
                  <div className='propertie_detail_first bg-white'>
                    <div className='price_tag'>
                      <strong className='price'>
                        326.00 SAR<small>/Month</small>
                      </strong>
                      <span className='apartment px-1 py-1'>Apartment</span>
                    </div>
                    <a
                      className='fs-5 fw-medium text-dark d-block text-decoration-none mb-2'
                      href='#'
                    >
                      Contemporary apartment
                    </a>
                    <span className='properties_location d-flex align-items-start'>
                      <img src='images/location.svg' className='me-2' /> A-463,
                      Palm beach, Abu dhabi, Dubai
                    </span>
                  </div>
                  <ul className='pro_feature d-flex align-items-center bg-light justify-content-between py-3 px-sm-2'>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/sqft.svg' className='me-2' />
                      1200 Sqft
                    </li>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/bedroom.svg' className='me-2' />4 Bedroom
                    </li>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/bathroom.svg' className='me-2' />4
                      Bathroom
                    </li>
                  </ul>

                  <div className='social_achiv border-top  d-flex align-items-center ps-3 bg-white'>
                    <div className='social_achiv_left d-flex align-items-center fs-7'>
                      <span className='pe-3 border-end'>658 Views</span>
                      <span className='d-flex align-items-center ps-3'>
                        <img src='images/watch.png' className='me-2' />
                        10 Days ago
                      </span>
                    </div>

                    <div className='social_achiv_left  d-flex align-items-center ms-auto'>
                      <a href='#' className='p-3 border-start'>
                        <img src='images/share.svg' />
                      </a>
                      <a href='#' className='p-3 border-start'>
                        <img src='images/like.svg' />
                      </a>
                    </div>
                  </div>
                </figcaption>
              </div>
            </div>
            <div>
              <div className='propertie_card'>
                <figure className='position-relative'>
                  <a href='#'>
                    <img src='images/properties2.jpg' />
                    <span className='img_count'>
                      <img src='images/img.svg' />
                      03
                    </span>
                  </a>
                </figure>
                <figcaption>
                  <div className='propertie_detail_first bg-white'>
                    <div className='price_tag'>
                      <strong className='price'>
                        326.00 SAR<small>/Month</small>
                      </strong>
                      <span className='apartment px-1 py-1'>Apartment</span>
                    </div>
                    <a
                      className='fs-5 fw-medium text-dark d-block text-decoration-none mb-2'
                      href='#'
                    >
                      Contemporary apartment
                    </a>
                    <span className='properties_location d-flex align-items-start'>
                      <img src='images/location.svg' className='me-2' /> A-463,
                      Palm beach, Abu dhabi, Dubai
                    </span>
                  </div>
                  <ul className='pro_feature d-flex align-items-center bg-light justify-content-between py-3 px-sm-2'>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/sqft.svg' className='me-2' />
                      1200 Sqft
                    </li>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/bedroom.svg' className='me-2' />4 Bedroom
                    </li>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/bathroom.svg' className='me-2' />4
                      Bathroom
                    </li>
                  </ul>

                  <div className='social_achiv border-top  d-flex align-items-center ps-3 bg-white'>
                    <div className='social_achiv_left d-flex align-items-center fs-7'>
                      <span className='pe-3 border-end'>658 Views</span>
                      <span className='d-flex align-items-center ps-3'>
                        <img src='images/watch.png' className='me-2' />
                        10 Days ago
                      </span>
                    </div>

                    <div className='social_achiv_left  d-flex align-items-center ms-auto'>
                      <a href='#' className='p-3 border-start'>
                        <img src='images/share.svg' />
                      </a>
                      <a href='#' className='p-3 border-start'>
                        <img src='images/like.svg' />
                      </a>
                    </div>
                  </div>
                </figcaption>
              </div>
            </div>
            <div>
              <div className='propertie_card'>
                <figure className='position-relative'>
                  <a href='#'>
                    <img src='images/properties3.jpg' />
                    <span className='img_count'>
                      <img src='images/img.svg' />
                      03
                    </span>
                  </a>
                </figure>
                <figcaption>
                  <div className='propertie_detail_first bg-white'>
                    <div className='price_tag'>
                      <strong className='price'>
                        326.00 SAR<small>/Month</small>
                      </strong>
                      <span className='apartment px-1 py-1'>Apartment</span>
                    </div>
                    <a
                      className='fs-5 fw-medium text-dark d-block text-decoration-none mb-2'
                      href='#'
                    >
                      Contemporary apartment
                    </a>
                    <span className='properties_location d-flex align-items-start'>
                      <img src='images/location.svg' className='me-2' /> A-463,
                      Palm beach, Abu dhabi, Dubai
                    </span>
                  </div>
                  <ul className='pro_feature d-flex align-items-center bg-light justify-content-between py-3 px-sm-2'>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/sqft.svg' className='me-2' />
                      1200 Sqft
                    </li>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/bedroom.svg' className='me-2' />4 Bedroom
                    </li>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/bathroom.svg' className='me-2' />4
                      Bathroom
                    </li>
                  </ul>

                  <div className='social_achiv border-top  d-flex align-items-center ps-3 bg-white'>
                    <div className='social_achiv_left d-flex align-items-center fs-7'>
                      <span className='pe-3 border-end'>658 Views</span>
                      <span className='d-flex align-items-center ps-3'>
                        <img src='images/watch.png' className='me-2' />
                        10 Days ago
                      </span>
                    </div>

                    <div className='social_achiv_left  d-flex align-items-center ms-auto'>
                      <a href='#' className='p-3 border-start'>
                        <img src='images/share.svg' />
                      </a>
                      <a href='#' className='p-3 border-start'>
                        <img src='images/like.svg' />
                      </a>
                    </div>
                  </div>
                </figcaption>
              </div>
            </div>
            <div>
              <div className='propertie_card'>
                <figure className='position-relative'>
                  <a href='#'>
                    <img src='images/properties1.jpg' />
                    <span className='img_count'>
                      <img src='images/img.svg' />
                      03
                    </span>
                  </a>
                </figure>
                <figcaption>
                  <div className='propertie_detail_first bg-white'>
                    <div className='price_tag'>
                      <strong className='price'>
                        326.00 SAR<small>/Month</small>
                      </strong>
                      <span className='apartment px-1 py-1'>Apartment</span>
                    </div>
                    <a
                      className='fs-5 fw-medium text-dark d-block text-decoration-none mb-2'
                      href='#'
                    >
                      Contemporary apartment
                    </a>
                    <span className='properties_location d-flex align-items-start'>
                      <img src='images/location.svg' className='me-2' /> A-463,
                      Palm beach, Abu dhabi, Dubai
                    </span>
                  </div>
                  <ul className='pro_feature d-flex align-items-center bg-light justify-content-between py-3 px-sm-2'>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/sqft.svg' className='me-2' />
                      1200 Sqft
                    </li>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/bedroom.svg' className='me-2' />4 Bedroom
                    </li>
                    <li className='d-flex align-items-center fs-7 fw-medium px-2'>
                      <img src='images/bathroom.svg' className='me-2' />4
                      Bathroom
                    </li>
                  </ul>

                  <div className='social_achiv border-top  d-flex align-items-center ps-3 bg-white'>
                    <div className='social_achiv_left d-flex align-items-center fs-7'>
                      <span className='pe-3 border-end'>658 Views</span>
                      <span className='d-flex align-items-center ps-3'>
                        <img src='images/watch.png' className='me-2' />
                        10 Days ago
                      </span>
                    </div>

                    <div className='social_achiv_left  d-flex align-items-center ms-auto'>
                      <a href='#' className='p-3 border-start'>
                        <img src='images/share.svg' />
                      </a>
                      <a href='#' className='p-3 border-start'>
                        <img src='images/like.svg' />
                      </a>
                    </div>
                  </div>
                </figcaption>
              </div>
            </div>
          </Slider>
        </Container>
      </section>
    </>
  )
}
export default ProjectDetail
