import React from "react";

import "./Banner.scss";
import img1 from "../../../assets/78f0374b0191d762.webp";
import img2 from "../../../assets/7e30535a71227b66.webp";
import img3 from "../../../assets/7ef9754529c2da8b.webp";
import img4 from "../../../assets/9d4c57f64cbfbde5.webp";
import img6 from "../../../assets/f8e89b5a8a8fba15.webp";
import Corouselimgs from '../../Corousel/Corouselimgs'

const Banner = () => {
    const obj = [img1,img2,img3,img4,img6]
    return (
        <div className="hero-banner">
             <Corouselimgs images={obj} neeche={false}/>
        </div>
    );
};

export default Banner;


