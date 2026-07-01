import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import bridal from "../../../assets/images/featured/bridal.jpg";
import silver from "../../../assets/images/featured/silver.jpeg";
import earing from "../../../assets/images/featured/earing.jpeg";
import neckless from "../../../assets/images/featured/neckless.jpeg";
import kindali from "../../../assets/images/hero/kindali.jpeg";

type Category = {
  title: string;
  tag: string;
  image: string;
  gridArea: string;
  objectPosition?: string;
  filter?: { metal?: string; categories?: string[] };
};

const CATEGORIES: Category[] = [
  {
    title: "Bridal Collection",
    tag: "New Season",
    image: bridal,
    gridArea: "bridal",
    objectPosition: "50% 20%",
    filter: { categories: ["Bridal"] },
  },
  {
    title: "Gold Necklaces",
    tag: "Bestseller",
    image: neckless,
    gridArea: "necklace",
    filter: { metal: "GOLD", categories: ["Necklace"] },
  },
  {
    title: "Silver Rings",
    tag: "Shop Now",
    image: silver,
    gridArea: "silver",
    filter: { metal: "SILVER", categories: ["Ring"] },
  },
  {
    title: "Earrings",
    tag: "Trending",
    image: earing,
    gridArea: "earring",
    filter: { categories: ["Earring"] },
  },
  { title: "More Collections", tag: "New", image: kindali, gridArea: "more" },
];

function CategoryCard({
  item,
  large = false,
  onClick,
}: {
  item: Category;
  large?: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      className="relative overflow-hidden group cursor-pointer isolate"
      sx={{
        gridArea: item.gridArea,
        borderRadius: "20px",
        background: "#111",
        minHeight: "100%",
      }}
    >
      <Box
        component="img"
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
        sx={{
          objectFit: "cover",
          objectPosition: item.objectPosition ?? "center",
        }}
      />
      <Box className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 transition-opacity duration-500" />
      <Box className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-amber-950/55 via-transparent to-transparent" />

      {/* Tag */}
      <Box
        className="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium backdrop-blur-md"
        sx={{
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.9)",
        }}
      >
        {item.tag}
      </Box>

      {/* Content */}
      <Box className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
        <Box
          className="mb-2 w-8 h-[1.5px] rounded-full transition-all duration-500 group-hover:w-14"
          style={{ background: "linear-gradient(90deg, #f59e0b, #fcd34d)" }}
        />
        <Typography
          component="h3"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: "#fff",
            fontSize: large
              ? "clamp(1.4rem, 2.5vw, 2rem)"
              : "clamp(1rem, 1.8vw, 1.3rem)",
          }}
        >
          {item.title}
        </Typography>
        <Box className="mt-2 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Explore{" "}
          <span className="transition-transform duration-300 group-hover:translate-x-1 inline-block">
            →
          </span>
        </Box>
      </Box>
    </Box>
  );
}

export function FeaturedCategories() {
  const navigate = useNavigate();

  const go = (item: Category) => {
    const p = new URLSearchParams();
    if (item.filter?.metal) p.set("metal", item.filter.metal);
    if (item.filter?.categories?.length)
      p.set("categories", item.filter.categories.join(","));
    navigate(p.toString() ? `/products?${p}` : "/products");
  };

  return (
    <Box sx={{ bgcolor: "#fafaf8", py: { xs: 10, sm: 14 } }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box className="text-center mb-10 sm:mb-14">
          <Box className="flex items-center justify-center gap-3 mb-4">
            <Box sx={{ width: 28, height: 1, bgcolor: "#f59e0b" }} />
            <Typography
              sx={{
                fontSize: "0.62rem",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: "#b45309",
                fontWeight: 600,
              }}
            >
              Curated Collections
            </Typography>
            <Box sx={{ width: 28, height: 1, bgcolor: "#f59e0b" }} />
          </Box>
          <Typography
            component="h2"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "2rem", sm: "2.8rem" },
              fontWeight: 600,
              color: "#1c1917",
            }}
          >
            Shop by Category
          </Typography>
        </Box>

        {/* Desktop grid */}
        <Box
          className="hidden md:grid gap-3"
          sx={{
            gridTemplateColumns: "1.3fr 1fr 1fr",
            gridTemplateRows: "300px 300px",
            gridTemplateAreas: `"bridal necklace silver" "bridal earring more"`,
          }}
        >
          {CATEGORIES.map((item) => (
            <CategoryCard
              key={item.gridArea}
              item={item}
              large={item.gridArea === "bridal"}
              onClick={() => go(item)}
            />
          ))}
        </Box>

        {/* Mobile grid */}
        <Box
          className="grid md:hidden gap-2.5"
          sx={{
            gridTemplateColumns: "1fr 1fr",
            gridTemplateAreas: `"bridal bridal" "necklace silver" "earring more"`,
          }}
        >
          {CATEGORIES.map((item) => (
            <Box
              key={item.gridArea}
              sx={{ gridArea: item.gridArea, aspectRatio: "4/5" }}
            >
              <CategoryCard item={item} onClick={() => go(item)} />
            </Box>
          ))}
        </Box>

        {/* CTA */}
        <Box className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/products")}
            className="px-8 py-3.5 rounded-full text-sm uppercase tracking-[0.3em] font-semibold cursor-pointer transition-all duration-300 hover:text-white"
            style={{
              border: "1px solid #b45309",
              color: "#b45309",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#b45309";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#b45309";
            }}
          >
            View All Collections →
          </button>
        </Box>
      </Container>
    </Box>
  );
}
