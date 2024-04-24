'use client';
import { useState } from "react";

import {Swiper as SwiperObject} from "swiper"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import { ProductImage } from "../product-image/ProductImage";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export function ProductSlideshow({images, title, className}: Props) {

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

  return (
    <div className={className}>
      <Swiper
        style={{
          '--swiper-navigation-color': '#000',
          '--swiper-pagination-color': '#000',
        } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 2500
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        {
          images.map(image => (
            <SwiperSlide key={image}>
              <ProductImage 
                alt={title} 
                src={image} 
                width={1024} 
                height={800} 
                className="rounded-lg object-fill"
              />
            </SwiperSlide>

          ))
        }
        
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {
          images.map(image => (
            <SwiperSlide key={image}>
              <Image 
                alt={title} 
                src={`/products/${image}`} 
                width={300} 
                height={300} 
                className="rounded-lg object-fill"
              />
            </SwiperSlide>

          ))
        }
      </Swiper>
    </div>
  )
}