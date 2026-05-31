import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

import bridal from "../../assets/FeaturedPics/bridal.jpeg";
import silver from "../../assets/FeaturedPics/silver.jpeg";
import earing from "../../assets/FeaturedPics/earing.jpeg";
import neckless from "../../assets/FeaturedPics/neckless.jpeg";
import kindali from "../../assets/HeroPics/kindali.jpeg";

type GalleryItem = {
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  gridArea: string;
  objectPosition?: string;
};

const galleryItems: GalleryItem[] = [
  {
    title: "Bridal Collection",
    subtitle: "Handcrafted for your most cherished moments",
    tag: "New Season",
    image: bridal,
    gridArea: "bridal",
    objectPosition: "50% 20%",
  },
  {
    title: "Gold Necklaces",
    subtitle: "Best sellers",
    tag: "Bestseller",
    image: neckless,
    gridArea: "necklace",
    objectPosition: "center center",
  },
  {
    title: "Silver Jewelry",
    subtitle: "Refined & contemporary",
    tag: "Shop Now",
    image: silver,
    gridArea: "silver",
    objectPosition: "center center",
  },
  {
    title: "Earrings",
    subtitle: "Statement styles",
    tag: "Trending",
    image: earing,
    gridArea: "earring",
    objectPosition: "center top",
  },
  {
    title: "More Collections",
    subtitle: "Explore new arrivals",
    tag: "New",
    image: kindali,
    gridArea: "more",
    objectPosition: "center center",
  },
];

function GalleryCard({
  item,
  large = false,
  onClick,
}: {
  item: GalleryItem;
  large?: boolean;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      className="relative overflow-hidden group cursor-pointer isolate"
      style={{
        gridArea: item.gridArea,
        borderRadius: "24px",
        minHeight: "100%",
        background: "#111",
      }}
    >
      {/* IMAGE */}
      <Box
        component="img"
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full transition-transform duration-[900ms] ease-out group-hover:scale-105"
        style={{
          objectFit: "cover",
          objectPosition: item.objectPosition ?? "center",
        }}
      />

      {/* DARK OVERLAY */}
      <Box className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 transition-opacity duration-500" />

      {/* GOLD HOVER WASH */}
      <Box className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-amber-950/60 via-transparent to-transparent" />

      {/* TAG */}
      <Box className="absolute top-4 left-4 z-10">
        <Box
          className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium backdrop-blur-md"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {item.tag}
        </Box>
      </Box>

      {/* CONTENT */}
      <Box className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
        {/* GOLD LINE */}
        <Box
          className="mb-3 w-8 h-[1.5px] rounded-full transition-all duration-500 group-hover:w-14"
          style={{
            background: "linear-gradient(90deg, #f59e0b, #fcd34d)",
          }}
        />

        {/* TITLE */}
        <Box
          component="h3"
          className="font-semibold leading-tight text-white"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: large
              ? "clamp(1.5rem, 2.5vw, 2.2rem)"
              : "clamp(1rem, 1.8vw, 1.4rem)",
          }}
        >
          {item.title}
        </Box>

        {/* SUBTITLE */}
        <Box className="mt-1.5 text-xs sm:text-sm text-white/70 overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-500">
          {item.subtitle}
        </Box>

        {/* CTA */}
        <Box className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          Explore
          <Box
            component="span"
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </Box>
        </Box>
      </Box>

      {/* CORNER LIGHT */}
      <Box
        className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(251,191,36,0.18), transparent 70%)",
        }}
      />
    </Box>
  );
}

export function GallerySection() {
  const navigate = useNavigate();
  const handleCardClick = () => navigate("/products");

  return (
    <Box className="bg-[#fafaf8] py-16 sm:py-24">
      <Container maxWidth="xl">
        {/* HEADER */}
        <Box className="flex flex-col items-center mb-14 sm:mb-20">
          {/* TOP LABEL */}
          <Box className="flex items-center gap-3 mb-5">
            <Box className="w-8 h-px bg-amber-500" />

            <Box className="text-[10px] uppercase tracking-[0.5em] text-amber-600 font-medium">
              Curated Collections
            </Box>

            <Box className="w-8 h-px bg-amber-500" />
          </Box>

          {/* TITLE */}
          <Box
            component="h2"
            className="text-4xl sm:text-6xl font-semibold text-stone-900 text-center leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Gallery
          </Box>

          {/* SUBTITLE */}
          <Box className="mt-4 text-sm sm:text-base text-stone-400 text-center max-w-md leading-relaxed">
            Each piece is a testament to heritage craftsmanship and timeless
            beauty.
          </Box>

          {/* DECORATIVE DIVIDER */}
          <Box className="mt-6 flex items-center gap-2">
            <Box className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />

            <Box className="w-1.5 h-1.5 rounded-full bg-amber-500" />

            <Box className="w-1.5 h-1.5 rounded-full border border-amber-400" />

            <Box className="w-1.5 h-1.5 rounded-full bg-amber-500" />

            <Box className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
          </Box>
        </Box>

        {/* DESKTOP GRID */}
        <Box
          className="hidden md:grid gap-4"
          style={{
            gridTemplateColumns: "1.3fr 1fr 1fr",
            gridTemplateRows: "320px 320px 320px",
            gridTemplateAreas: `
              "bridal bridal necklace"
              "bridal bridal more"
              "silver earring more"
            `,
          }}
        >
          {galleryItems.map((item) => (
            <GalleryCard
              key={item.gridArea}
              item={item}
              large={item.gridArea === "bridal"}
              onClick={handleCardClick}
            />
          ))}
        </Box>

        {/* MOBILE GRID */}
        <Box
          className="grid md:hidden gap-3"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gridTemplateAreas: `
              "bridal bridal"
              "necklace silver"
              "earring more"
            `,
          }}
        >
          {galleryItems.map((item) => (
            <Box
              key={item.gridArea}
              style={{
                gridArea: item.gridArea,
                aspectRatio: item.gridArea === "bridal" ? "4/5" : "4/5",
              }}
            >
              <GalleryCard
                item={item}
                large={item.gridArea === "bridal"}
                onClick={handleCardClick}
              />
            </Box>
          ))}
        </Box>

        {/* CTA */}
        <Box className="flex justify-center mt-12 sm:mt-16">
          <Box
            component="button"
            onClick={() => navigate("/products")}
            className="group flex items-center gap-3 px-8 py-4 rounded-full text-sm uppercase tracking-[0.3em] font-medium transition-all duration-300 cursor-pointer"
            style={{
              border: "1px solid #b45309",
              color: "#b45309",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#b45309";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#b45309";
            }}
          >
            View All Collections
            <Box
              component="span"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
