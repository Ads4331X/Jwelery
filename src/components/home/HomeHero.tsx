import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";

import chura from "../../assets/HeroPics/chura.jpeg";
import bracelet from "../../assets/HeroPics/bracelet.jpeg";
import neckless from "../../assets/HeroPics/nackless.jpeg";
import kindali from "../../assets/HeroPics/kindali.jpeg";

const images = [chura, bracelet, neckless, kindali];

export function HomeHero() {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box className="w-full overflow-hidden">
      {/* ── MOBILE / TABLET (< lg) ── */}
      <Box
        className="relative block h-svh w-full overflow-hidden lg:hidden"
        onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const delta = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 40)
            setCurrent((p) =>
              delta > 0
                ? (p + 1) % images.length
                : (p - 1 + images.length) % images.length,
            );
        }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
              current === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <Box className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10" />

        {/* centered text */}
        <Box className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Box
            component="span"
            className="mb-4 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-5 py-1.5 text-[0.65rem] uppercase tracking-[0.35em] text-white/85 backdrop-blur-md"
          >
            Since 2017
          </Box>

          <Typography
            component="h1"
            className="mb-3 text-[2.4rem] font-semibold leading-tight text-white sm:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Crafting{" "}
            <Box component="span" className="text-amber-400">
              Timeless
            </Box>{" "}
            Elegance
          </Typography>

          <Typography className="mx-auto mb-6 max-w-xs text-sm leading-7 text-white/75">
            Premium handcrafted gold & silver jewelry heritage, purity & luxury
            in every piece.
          </Typography>

          <Box className="flex flex-wrap justify-center gap-3">
            <Button className="!rounded-full !bg-gradient-to-br !from-amber-700 !to-amber-500 !px-6 !py-2.5 !text-xs !font-bold !uppercase !tracking-widest !text-white shadow-[0_8px_24px_rgba(180,83,9,0.5)]">
              Explore Collection
            </Button>
            <Button className="!rounded-full !border !border-white/50 !px-6 !py-2.5 !text-xs !font-bold !uppercase !tracking-widest !text-white backdrop-blur-sm hover:!bg-white/10">
              Contact Now
            </Button>
          </Box>
        </Box>

        {/* dots pinned to bottom */}
        <Box className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
          {images.map((_, i) => (
            <Box
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                current === i ? "w-6 bg-amber-400" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </Box>
      </Box>

      {/* ── DESKTOP (≥ lg) ── */}
      <Box className="hidden lg:flex lg:h-screen w-full">
        {/* left */}
        <Box className="relative flex w-1/2 items-center justify-center overflow-hidden bg-[#fffdf8] px-8 xl:px-16">
          <Box className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_70%,#fef3c7,transparent_65%)] opacity-80" />

          <Box className="relative max-w-md">
            <Box
              component="span"
              className="inline-flex items-center rounded-full border border-amber-700/25 bg-amber-100 px-5 py-1.5 text-[0.65rem] uppercase tracking-[0.35em] text-amber-700"
            >
              Since 2017
            </Box>

            <Typography
              component="h1"
              className="mt-5 text-[2.7rem] font-semibold leading-tight text-[#1a1207] xl:text-[3.8rem]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Crafting <br />
              <Box component="span" className="text-amber-700">
                Timeless
              </Box>
              <br />
              Elegance
            </Typography>

            <Box className="mt-4 h-0.5 w-14 rounded bg-linear-to-r from-amber-700 to-amber-500" />

            <Typography className="mt-5 max-w-sm text-[0.95rem] leading-8 text-gray-500">
              Premium handcrafted gold & silver jewelry designed with trust,
              purity, and luxury.
            </Typography>

            <Box className="mt-8 flex flex-wrap gap-4">
              <Button className="!rounded-full !bg-gradient-to-br !from-amber-700 !to-amber-600 !px-6 !py-2.5 !text-xs !font-bold !uppercase !tracking-widest !text-white shadow-[0_8px_24px_rgba(180,83,9,0.3)]">
                Explore Collection
              </Button>
              <Button className="!rounded-full !border !border-amber-700 !px-6 !py-2.5 !text-xs !font-bold !uppercase !tracking-widest !text-amber-700 hover:!bg-amber-100">
                Contact Now
              </Button>
            </Box>
          </Box>
        </Box>

        {/* right grid */}
        <Box className="grid h-full w-1/2 grid-cols-2 grid-rows-2 gap-0.75 bg-[#1a1207]">
          {images.map((img, i) => (
            <Box key={i} className="group relative overflow-hidden">
              <img
                src={img}
                alt=""
                loading={i < 2 ? "eager" : "lazy"}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
              />
              <Box className="absolute inset-0 bg-black/15 transition-opacity duration-300 group-hover:opacity-0" />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
