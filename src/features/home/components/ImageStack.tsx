import { Box } from "@mui/material";

import ourstory4 from "../../../assets/images/our-story/ourstory.jpeg";
import ourstory1 from "../../../assets/images/our-story/ourstory1.jpeg";
import ourstory2 from "../../../assets/images/our-story/ourstory2.jpeg";
import ourstory3 from "../../../assets/images/our-story/ourstory3.jpeg";

const IMAGES = [
  { src: ourstory1, alt: "Quality product craftsmanship" },
  { src: ourstory2, alt: "Product detail showcase" },
  { src: ourstory3, alt: "Premium product design" },
  { src: ourstory4, alt: "Store collection showcase" },
];

export function ImageStack() {
  return (
    <Box className="grid grid-cols-2 gap-3 w-full max-w-md">
      {IMAGES.map(({ src, alt }) => (
        <Box
          key={alt}
          className="aspect-[4/5] overflow-hidden rounded-xl border border-amber-900/8 bg-stone-100"
        >
          <Box
            component="img"
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </Box>
      ))}
    </Box>
  );
}
