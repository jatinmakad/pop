const SliderConfig = {
  agentSlider: {
    dots: false,
    nav: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1
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
  },
  properties_slider: {
    dots: false,
    nav: true,
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
          slidesToScroll: 1,
          infinite: false,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1.5,
          infinite: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          infinite: false,
          slidesToShow: 1.2,
          slidesToScroll: 1.2
        }
      }
    ]
  },
 floorPlanSlider : {
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
  },
  rentProperties : {
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
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1.5,
					slidesToScroll: 1.5,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1.2,
					slidesToScroll: 1.2,
				},
			},
		],
	}
}
export default SliderConfig