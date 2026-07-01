import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { SearchBar } from "./components/SearchBar";
import ProductGrid from "./components/ProductGrid";
import ProductPagination from "./components/ProductPagination";
import { FilterPanel, type Filters } from "./components/FilterPanel";
import { FilterDrawer } from "./components/FilterDrawer";
import { ActiveFilterPill } from "./components/ActiveFilterPill";
import { fetchProducts } from "../../services/productsApi";
import { usePageMeta } from "../../hooks/usePageMeta";
import type { Product } from "./types";
import { METAL_LABELS } from "./types";

const PAGE_SIZE_OPTIONS = [12, 24, 48];

const QUICK_CATEGORIES = [
  "All",
  "Ring",
  "Necklace",
  "Earring",
  "Bracelet",
  "Bridal",
];

export default function Products() {
  usePageMeta({
    title: "Shop Gold & Silver Jewellery | Anand Jewellers",
    description: "Browse handcrafted gold and silver jewellery from Anand Jewellers, Nepal. View collections, prices, and product details online.",
  });

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = useMemo<Filters>(() => {
    const metal = searchParams.get("metal") ?? "All";
    const rawCategories = searchParams.get("categories") ?? "";
    const categories = rawCategories
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0 && c.toLowerCase() !== "all");
    return {
      metal: metal === "" ? "All" : metal,
      categories,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("q") ?? "",
  );
  const [filters, setFilters] = useState<Filters>(initialFilters);
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

  const syncToUrl = useCallback(
    (next: Filters, query?: string) => {
      const params = new URLSearchParams();
      const q = query ?? searchTerm;
      if (q.trim()) params.set("q", q.trim());
      if (next.metal && next.metal !== "All") params.set("metal", next.metal);
      if (next.categories.length > 0)
        params.set("categories", next.categories.join(","));
      setSearchParams(params, { replace: true });
    },
    [setSearchParams, searchTerm],
  );

  const handleFilterChange = useCallback(
    (key: keyof Filters, value: Filters[keyof Filters]) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        syncToUrl(next);
        return next;
      });
      setPage(1);
    },
    [syncToUrl],
  );

  const clearFilters = useCallback(() => {
    const cleared: Filters = { metal: "All", categories: [] };
    setFilters(cleared);
    syncToUrl(cleared);
    setPage(1);
  }, [syncToUrl]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setPage(1);
      syncToUrl(filters, value);
    },
    [filters, syncToUrl],
  );

  const handleQuickCategory = (cat: string) => {
    if (cat === "All") {
      handleFilterChange("categories", []);
      return;
    }
    handleFilterChange(
      "categories",
      filters.categories.includes(cat) ? [] : [cat],
    );
  };

  const activeFilterCount =
    (filters.metal !== "All" ? 1 : 0) + filters.categories.length;

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      const categoryName = p.category?.name ?? "";
      const metalLabel =
        METAL_LABELS[p.metalType]?.toLowerCase() ??
        String(p.metalType).toLowerCase();

      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        categoryName.toLowerCase().includes(q) ||
        metalLabel.includes(q) ||
        p.slug.toLowerCase().includes(q);

      const matchesMetal =
        filters.metal === "All" || p.metalType === filters.metal;

      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.some((cat) =>
          categoryName.toLowerCase().includes(cat.toLowerCase()),
        );

      return p.isActive && matchesSearch && matchesMetal && matchesCategory;
    });
  }, [products, searchTerm, filters]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredProducts, safePage, pageSize],
  );

  const metalPillLabel =
    filters.metal !== "All"
      ? (METAL_LABELS[filters.metal as keyof typeof METAL_LABELS] ??
        filters.metal)
      : null;

  return (
    <Box className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <Box
        className="border-b border-stone-200 bg-white"
        sx={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
      >
        <Box className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
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
        </Box>
      </Box>

      <Box className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <Box
          className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide"
          sx={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {QUICK_CATEGORIES.map((cat) => {
            const active =
              cat === "All"
                ? filters.categories.length === 0
                : filters.categories.includes(cat);
            return (
              <Chip
                key={cat}
                label={cat}
                onClick={() => handleQuickCategory(cat)}
                sx={{
                  flexShrink: 0,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  bgcolor: active ? "#b45309" : "#fff",
                  color: active ? "#fff" : "#44403c",
                  border: active ? "none" : "1px solid #e7e5e4",
                  "&:hover": {
                    bgcolor: active ? "#92400e" : "#fafaf9",
                  },
                }}
              />
            );
          })}
        </Box>

        <Stack direction="row" sx={{ gap: { lg: 2 } }}>
          {isDesktop && (
            <Paper
              component="aside"
              elevation={0}
              className="w-52 shrink-0 sticky top-[4.5rem] self-start bg-white! rounded-lg! border! border-stone-200! p-4"
            >
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
                activeCount={activeFilterCount}
              />
            </Paper>
          )}

          <Box className="flex-1 min-w-0">
            <Box className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              {!loading && !error && (
                <Typography className="text-sm text-stone-600">
                  {filteredProducts.length} result
                  {filteredProducts.length !== 1 ? "s" : ""}
                </Typography>
              )}

              {!isDesktop && (
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-stone-300 bg-white text-sm font-medium text-stone-700 cursor-pointer hover:border-amber-600 hover:text-amber-800 transition-colors"
                >
                  <TuneIcon style={{ fontSize: 18 }} />
                  Filters
                  {activeFilterCount > 0 && (
                    <Box
                      component="span"
                      className="px-1.5 py-0.5 rounded-full bg-amber-700 text-[0.65rem] font-bold text-white"
                    >
                      {activeFilterCount}
                    </Box>
                  )}
                </button>
              )}
            </Box>

            {activeFilterCount > 0 && (
              <Stack
                direction="row"
                sx={{ flexWrap: "wrap", alignItems: "center", gap: 1, mb: 3 }}
              >
                {metalPillLabel && (
                  <ActiveFilterPill
                    label={metalPillLabel}
                    onRemove={() => handleFilterChange("metal", "All")}
                  />
                )}
                {filters.categories.map((cat) => (
                  <ActiveFilterPill
                    key={cat}
                    label={cat}
                    onRemove={() =>
                      handleFilterChange(
                        "categories",
                        filters.categories.filter((x) => x !== cat),
                      )
                    }
                  />
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-amber-700 underline cursor-pointer bg-transparent border-0"
                >
                  Clear all
                </button>
              </Stack>
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
