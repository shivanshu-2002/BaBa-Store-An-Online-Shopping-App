import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Carouselimg = ({ images, neeche,obj }) => {
  return (
    <Carousel autoPlay={true} interval={2000} infiniteLoop={true} showThumbs={false} >
      {images?.map((image, index) => (
        <div key={index} style={!neeche ?{ display: 'flex', justifyContent: 'center', alignItems: 'center',  }:{}}>
          <img
            src={image}
            alt={`Image ${index + 1}`}
            style={{ objectFit: "contain" ,maxHeight:'60vh' }}
            
          />
        </div>
      ))}
    </Carousel>
  );
};

export default Carouselimg;
