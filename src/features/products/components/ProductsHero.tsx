import { useContext } from "react";
import { PageHero } from "../../../components/shared/hero/PageHero";
import { Box, Typography } from "@mui/material";
import { AuthContext } from "../../auth/context/context";

export function ProductsHero() {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  if (user) {
    return (
      <Box
        component="section"
        className="flex flex-col items-center justify-center text-center px-6 py-20 bg-linear-to-br from-amber-50/50 via-stone-50 to-amber-100/30"
        style={{ marginTop: 72, borderBottom: "1px solid rgba(180,83,9,0.08)" }}
      >
        <Box className="flex items-center gap-3 mb-4 justify-center">
          <Box className="w-6 h-px bg-amber-600" />
          <Typography className="text-[0.62rem] uppercase tracking-[0.4em] font-semibold text-amber-800">
            Exclusive Member Portal
          </Typography>
          <Box className="w-6 h-px bg-amber-600" />
        </Box>

        <Typography
          component="h1"
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Welcome back,{" "}
          <Box component="span" className="italic text-amber-700">
            {user.firstName}
          </Box>
        </Typography>

        <Typography className="mt-4 text-xs sm:text-sm text-stone-500 leading-relaxed max-w-md">
          Explore your personalized vault of hand-crafted gold & silver collections. 
        </Typography>

        {/* Promo Banner inside Hero */}
        <Box 
          className="mt-6 px-4 py-2 rounded-full border border-amber-900/10 bg-amber-50/80 inline-flex items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
            Special Offer
          </span>
          <Typography className="text-[10px] font-medium text-stone-700 tracking-wide">
            Use code <strong className="text-amber-800">MEMBER10</strong> for 10% off at checkout.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <PageHero
      label="Anand Jewellers"
      title={
        <>
          Our{" "}
          <Box component="span" className="italic text-amber-700">
            Collection
          </Box>
        </>
      }
      subtitle="Handcrafted 24 karat and 22 karat gold jewellery, each piece a celebration of Nepal's heritage and timeless artistry."
    />
  );
}
