// components/ProductPagination.tsx
import { Box, Button, Typography } from "@mui/material";

interface ProductPaginationProps {
  page: number;
  pageCount: number;
  totalCount: number;
  onPageChange: (value: number) => void;
}

export default function ProductPagination({
  page,
  pageCount,
  totalCount,
  onPageChange,
}: ProductPaginationProps) {
  if (pageCount <= 1) return null;

  const getPages = (): (number | "...")[] => {
    if (pageCount <= 7)
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(pageCount - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < pageCount - 2) pages.push("...");
    pages.push(pageCount);
    return pages;
  };

  const pages = getPages();

  return (
    <Box className="mt-10 pt-6 border-t border-amber-700/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Typography className="!text-[0.68rem] !uppercase !tracking-[0.15em] !text-black/30">
        Page {page} of {pageCount}&nbsp;·&nbsp;{totalCount} pieces
      </Typography>

      <Box className="flex items-center gap-1">
        {/* Prev */}
        <Button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={[
            "!min-w-[32px] !h-8 !px-2 !rounded-lg !text-[0.8rem] !font-medium !normal-case",
            page === 1
              ? "!text-black/20 !cursor-not-allowed"
              : "!text-amber-900 hover:!bg-amber-50 hover:!border-amber-200",
          ].join(" ")}
        >
          ‹
        </Button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <Typography
              key={`ellipsis-${i}`}
              className="!min-w-[32px] !h-8 !flex !items-center !justify-center !text-[0.8rem] !text-black/30 !select-none"
            >
              …
            </Typography>
          ) : (
            <Button
              key={p}
              type="button"
              onClick={() => onPageChange(p as number)}
              aria-current={p === page ? "page" : undefined}
              className={[
                "!min-w-[32px] !h-8 !px-2 !rounded-lg !text-[0.8rem] !font-medium !normal-case !border !border-transparent",
                p === page
                  ? "!bg-gradient-to-br !from-amber-900 !to-amber-700 !text-white !shadow-sm"
                  : "!text-amber-900 hover:!bg-amber-50 hover:!border-amber-200",
              ].join(" ")}
            >
              {p}
            </Button>
          ),
        )}

        {/* Next */}
        <Button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          className={[
            "!min-w-[32px] !h-8 !px-2 !rounded-lg !text-[0.8rem] !font-medium !normal-case",
            page === pageCount
              ? "!text-black/20 !cursor-not-allowed"
              : "!text-amber-900 hover:!bg-amber-50 hover:!border-amber-200",
          ].join(" ")}
        >
          ›
        </Button>
      </Box>
    </Box>
  );
}
