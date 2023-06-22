import { FC, useEffect, useRef, useState } from 'react';
import { A11y, Navigation, Swiper as SwiperType, Zoom } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';

import { Image } from '../../features/productDetail/types';
import { validateImages } from '../../utils/validateImages';

interface ImageCarouselProps {
  images: Image[];
}

export const ImageCarousel: FC<ImageCarouselProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateImagesAsync = async() => {
      if (!images || images.length === 0) {
        setLoading(false);
        return;
      }

      const filteredImages = await validateImages(images);
      setFilteredImages(filteredImages);
      setSelectedImage(filteredImages[0]);
      setLoading(false);
    };

    validateImagesAsync();
  }, [images]);

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
            onSlideChange={(swiper) => {
              setSelectedImage(filteredImages[swiper.activeIndex]);
            }}
            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
            zoom={true}
          >
            {filteredImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="swiper-zoom-container">
                  <img
                    src={image.url}
                    alt=""
                    className="h-64 w-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};
