import React from 'react';
import './AboutPage.scss'; // Import your SCSS file for styling
import xt from '../../assets/aboutus1.86606deea209badf5925.webp'

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="text-side">
        <div className="about-header">
          <h1>About Baba Store</h1>
        </div>
        <div className="about-content">
          <p>
            Welcome to Baba Store, your one-stop shop for high-quality products and excellent customer service.
            At Baba Store, we take pride in offering a wide range of products that cater to your needs and preferences.
            Whether you're looking for fashion, electronics, home decor, or more, we've got you covered.
          </p>
          <p>
            Our team is dedicated to delivering the best shopping experience for our customers. We strive to provide
            competitive prices, secure transactions, and fast shipping to ensure your satisfaction.
          </p>
          <p>
            Explore our online store, and discover a world of possibilities. Shop with confidence at Baba Store,
            and let us make your shopping experience memorable.
          </p>
        </div>
      </div>
      <div className="image-side">
        <img src={xt} alt="Baba Store" />
      </div>
    </div>
  );
};

export default AboutPage;
