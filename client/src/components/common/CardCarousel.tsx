import { FC, useEffect, useRef, useState } from 'react';
import { A11y, Navigation, Swiper as SwiperType, Zoom } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';

import { faker } from '@faker-js/faker';
import { Image, Style } from '../../features/productDetail/types';
import { StarRating } from './StarRating';

interface CardCarouselProps {
  cardData: Style[]
}

export const CardCarousel: FC<CardCarouselProps> = ({ cardData }) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const validateImagesAsync = async() => {
      if (!cardData) {
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    validateImagesAsync();
  }, [cardData]);

  return (
    <div className="flex">
      <div className="w-full">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Swiper
            modules={[A11y, Navigation, Zoom]}
            a11y={{ enabled: true }}
            navigation={true}
            initialSlide={filteredImages.length / 2}
            slidesPerView={4}
            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
            zoom={true}
          >
            {cardData &&
              cardData.map((style, index) => (
                <SwiperSlide key={index}>
                  <div className="swiper-zoom-container w-full">
                    <div className="card bg-base-100 shadow-xl m-4 h-300">
                      <figure>
                        <img
                          src={style.photos[0].url || faker.image.url()}
                          alt=""
                          className="h-96 w-full object-cover"
                        />
                      </figure>

                      <div
                        className={'card-body flex flex-col justify-between h-64'}
                      >
                        <div className="h-5">
                          {style['default?'] && (
                            <div className="badge badge-success">Sale</div>
                          )}
                        </div>


                        <h2 className="card-title text-lg font-bold flex-grow">
                          {style.name}
                        </h2>

                        <p className="text-sm text-left">
                          If a dog chews shoes whose shoes does he choose?
                        </p>

                        <div className="card-actions justify-center">
                          <div className="badge badge-outline">Fashion</div>
                          <div className="badge badge-outline">Products</div>
                        </div>
                      </div>

                      <div className="items-center mb-4">
                        <StarRating rating={4.5} size="sm" />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};
