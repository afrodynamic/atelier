import { FC, useEffect, useRef, useState } from 'react';
import { A11y, Navigation, Swiper as SwiperType, Thumbs, Zoom } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';

import { Image } from '../../features/productDetail/types';
import { validateImages } from '../../utils/validateImages';

interface ImageCarouselWithThumbnailsProps {
  images: Image[];
}

export const ImageCarouselWithThumbnails: FC<ImageCarouselWithThumbnailsProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  const handleThumbnailClick = (image: Image) => {
    setSelectedImage(image);

    if (mainSwiperRef.current) {
      const index = filteredImages.findIndex((img) => img === image);
      mainSwiperRef.current.slideTo(index);
    }
  };

  useEffect(() => {
    const validateImagesAsync = async() => {
      if (!images || images.length === 0) {
        setLoading(false);
        return;
      }

      const filteredImages = await validateImages(images || []);

      setFilteredImages(filteredImages);
      setSelectedImage(filteredImages[0]);
      setLoading(false);
    };

    validateImagesAsync();
  }, [images]);

  return (
    <div className="flex">
      <div className="w-1/6 m-4" style={{height: '448px'}}>
        {loading ? (
          <div>Loading...</div>
        ) : filteredImages.length > 1 && (
          <div className="h-full flex flex-col">
            <Swiper
              modules={[A11y, Navigation, Thumbs]}
              a11y={{ enabled: true }}
              direction="vertical"
              onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
              slidesPerView={filteredImages.length > 7 ? 7 : filteredImages.length}
            >
              {filteredImages.map((image, index) => (
                <SwiperSlide key={index} className="h-16">
                  <img
                    src={
                      image.thumbnail_url
                        ? image.thumbnail_url
                        : image.url
                    }
                    alt=""
                    className="h-16 w-16 object-cover cursor-pointer"
                    onClick={() => handleThumbnailClick(image)}
                    style={{
                      border: image === selectedImage ? '2px solid red' : 'none',
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      <div className="w-5/6">
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
            thumbs={{ swiper: thumbsSwiper }}
            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
            zoom={true}
          >
            {filteredImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="swiper-zoom-container">
                  <img
                    src={image.url}
                    alt=""
                    className="h-96 w-full object-cover"
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
