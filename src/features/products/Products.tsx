// Products.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Paper, Stack, Typography } from "@mui/material";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { SearchBar } from "./components/SearchBar";
import ProductGrid from "./components/ProductGrid";
import ProductPagination from "./components/ProductPagination";
import { ProductsHero } from "./components/ProductsHero";
import { FilterPanel, type Filters } from "./components/FilterPanel";
import { FilterDrawer } from "./components/FilterDrawer";
import { ActiveFilterPill } from "./components/ActiveFilterPill";
import { fetchProducts } from "../../services/productsApi";
import type { Product } from "./types";

const PAGE_SIZE_OPTIONS = [9, 12, 18];

export default function Products() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    metal: "All",
    category: "All",
  });
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchProducts()
      .then((data) => {
        if (alive) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (alive) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const handleFilterChange = useCallback(
    (key: keyof Filters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters({ metal: "All", category: "All" });
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const activeFilterCount =
    (filters.metal !== "All" ? 1 : 0) + (filters.category !== "All" ? 1 : 0);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));

      const matchesMetal =
        filters.metal === "All" ||
        p.tags.some((t) =>
          t.toLowerCase().includes(filters.metal.toLowerCase()),
        ) ||
        p.title.toLowerCase().includes(filters.metal.toLowerCase());

      const matchesCategory =
        filters.category === "All" ||
        p.tags.some((t) =>
          t.toLowerCase().includes(filters.category.toLowerCase()),
        ) ||
        p.title.toLowerCase().includes(filters.category.toLowerCase());

      return matchesSearch && matchesMetal && matchesCategory;
    });
  }, [products, searchTerm, filters]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredProducts, safePage, pageSize],
  );

  return (
    <Box className="min-h-screen bg-[#fafaf7]">
      <Header />
      <ProductsHero />

      <Box className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <Stack direction="row" sx={{ gap: { lg: 3 } }}>
          {/* ── Desktop sidebar ── */}
          {isDesktop && (
            <Paper
              component="aside"
              elevation={0}
              className="w-56 shrink-0 sticky top-24 bg-white! rounded-[20px]! border! border-amber-900/8! p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]!"
            >
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
                activeCount={activeFilterCount}
              />
            </Paper>
          )}

          {/* ── Main content ── */}
          <Box className="flex-1 min-w-0">
            {/* Search bar — full width always */}
            <SearchBar
              query={searchTerm}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onQueryChange={handleSearchChange}
              onSearch={() => setPage(1)}
              onPageSizeChange={(v) => {
                setPageSize(v);
                setPage(1);
              }}
            />

            {/* Mobile: filter button on its own row, below search */}
            {!isDesktop && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className={[
                  "w-full mb-4 flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold tracking-wide cursor-pointer transition-all duration-200",
                  activeFilterCount > 0
                    ? "border-amber-700 text-white"
                    : "border-amber-900/15 text-amber-900 bg-white hover:border-amber-700 hover:bg-amber-50",
                ].join(" ")}
                style={
                  activeFilterCount > 0
                    ? {
                        background: "linear-gradient(135deg, #92400e, #b45309)",
                      }
                    : undefined
                }
              >
                <TuneIcon style={{ fontSize: 18 }} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/25 text-[0.6rem] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <Stack
                direction="row"
                sx={{ flexWrap: "wrap", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Typography className="text-[0.6rem]! uppercase! tracking-[0.15em]! text-black/30!">
                  Active:
                </Typography>
                {filters.metal !== "All" && (
                  <ActiveFilterPill
                    label={filters.metal}
                    onRemove={() => handleFilterChange("metal", "All")}
                  />
                )}
                {filters.category !== "All" && (
                  <ActiveFilterPill
                    label={filters.category}
                    onRemove={() => handleFilterChange("category", "All")}
                  />
                )}
              </Stack>
            )}

            {/* Results count */}
            {!loading && !error && (
              <Typography className="text-[0.68rem]! uppercase! tracking-[0.15em]! text-black/30! mb-4!">
                {filteredProducts.length} piece
                {filteredProducts.length !== 1 ? "s" : ""} found
              </Typography>
            )}

            <ProductGrid
              products={paginatedProducts}
              loading={loading}
              error={error}
            />

            <ProductPagination
              page={safePage}
              pageCount={pageCount}
              totalCount={filteredProducts.length}
              onPageChange={(v) => setPage(v)}
            />
          </Box>
        </Stack>
      </Box>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClear={clearFilters}
        activeCount={activeFilterCount}
        resultCount={filteredProducts.length}
      />

      <Footer />
    </Box>
  );
}
