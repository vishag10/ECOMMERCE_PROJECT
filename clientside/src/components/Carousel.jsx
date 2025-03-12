import React, { useEffect, useRef, useState } from 'react'
import carousel1 from "../assets/1.png";
import carousel2 from "../assets/2.png";
import carousel3 from "../assets/3.png";
import { ChevronLeft, ChevronRight } from 'lucide-react';

    const MainCarousel = React.memo(() => {
        const [currentSlide, setCurrentSlide] = useState(0);
        const timeoutRef = useRef(null);
        
        const carouselImages = [carousel1, carousel2, carousel3];
      
        useEffect(() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            setCurrentSlide((prevSlide) => 
              prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
            );
          }, 5000);
      
          return () => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          };
        }, [currentSlide, carouselImages.length]);
      
        const goToSlide = (index) => setCurrentSlide(index);
        const goToPrevSlide = () => setCurrentSlide(prev => prev === 0 ? carouselImages.length - 1 : prev - 1);
        const goToNextSlide = () => setCurrentSlide(prev => prev === carouselImages.length - 1 ? 0 : prev + 1);
      
        return (
          <div className="relative w-4/5 mx-auto h-48 md:h-56 lg:h-72 overflow-hidden rounded-lg shadow-md">
            <div 
              className="flex transition-transform duration-500 ease-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselImages.map((image, index) => (
                <div key={index} className="w-full h-full flex-shrink-0">
                  <img 
                    src={image} 
                    alt={`Slide ${index + 1}`} 
                    className="w-full h-full object-cover"
                    loading="lazy" 
                  />
                </div>
              ))}
            </div>
      
            <button 
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors"
              onClick={goToPrevSlide}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors"
              onClick={goToNextSlide}
            >
              <ChevronRight size={24} />
            </button>
      
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        );
      });
    

export default MainCarousel