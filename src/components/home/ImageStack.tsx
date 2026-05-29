import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";

import { EffectCards, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";

import ourstory4 from "../../assets/ourstory/ourstory.jpeg";
import ourstory1 from "../../assets/ourstory/ourstory1.jpeg";
import ourstory2 from "../../assets/ourstory/ourstory2.jpeg";
import ourstory3 from "../../assets/ourstory/ourstory3.jpeg";

export function ImageStack() {
  const images = [ourstory1, ourstory2, ourstory3, ourstory4];

  return (
    <Box className="flex justify-center w-full">
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        cardsEffect={{
          perSlideOffset: 10,
          perSlideRotate: 2,
        }}
        className="
          w-[300px]
          h-[400px]

          xs:w-[340px]
          xs:h-[460px]

          sm:w-[380px]
          sm:h-[500px]

          md:w-[440px]
          md:h-[580px]

          lg:w-[520px]
          lg:h-[680px]

          xl:w-[580px]
          xl:h-[740px]
        "
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={img}
              alt={`Story ${index}`}
              className="
                w-full
                h-full
                object-cover
                rounded-2xl
                md:rounded-3xl
                shadow-2xl
              "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
