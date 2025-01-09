import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const images = [
    "https://via.placeholder.com/800x400",
    "https://via.placeholder.com/800x400",
    "https://via.placeholder.com/800x400",
  ];

  const showSlide = (index) => {
    if (index >= images.length) {
      setCurrentSlide(0);
    } else if (index < 0) {
      setCurrentSlide(images.length - 1);
    } else {
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    showSlide(currentSlide - 1);
  };

  const goToEventDetails = () => {
    navigate('/EventsDetails');
  };

  return (
    <div className="carousel-wrapper">
      <div className="carousel-container">
        <div className="carousel">
          <div className="slides" style={{ transform: `translateX(${-currentSlide * 100}%)` }}>
            {images.map((img, index) => (
              <div className="slide" key={index}>
                <img src={img} alt={`Slide ${index + 1}`} onClick={goToEventDetails} />
              </div>
            ))}
          </div>
          <button className="prev" onClick={prevSlide}>❮</button>
          <button className="next" onClick={nextSlide}>❯</button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
