import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

import ourstory4 from "../../../assets/images/our-story/ourstory.jpeg";
import ourstory1 from "../../../assets/images/our-story/ourstory1.jpeg";
import ourstory2 from "../../../assets/images/our-story/ourstory2.jpeg";
import ourstory3 from "../../../assets/images/our-story/ourstory3.jpeg";

export function ImageStack() {
  const images = [ourstory1, ourstory2, ourstory3, ourstory4];

  return (
    <Box className="flex justify-center w-full py-10 px-10 sm:px-14 md:px-20 !overflow-visible">
      <Box className="w-[100vw] sm:w-[50vw] md:w-[50vw] lg:w-[42vw] xl:w-[36vw] max-w-[560px] !overflow-visible">
        <Swiper
          effect="cards"
          grabCursor={true}
          modules={[EffectCards, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          cardsEffect={{
            perSlideOffset: 10,
            perSlideRotate: 3,
            slideShadows: true,
          }}
          className="w-full !overflow-visible"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index} className="!overflow-visible">
              <Box className="relative w-full" style={{ paddingTop: "130%" }}>
                <Box
                  component="img"
                  src={img}
                  alt={`Story ${index}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-2xl"
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}
