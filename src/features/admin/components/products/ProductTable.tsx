import {
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import type { AdminProduct } from "./types";
import { METAL_LABELS } from "./types";

interface Props {
  products: AdminProduct[];
  onEdit: (p: AdminProduct) => void;
  onDelete: (p: AdminProduct) => void;
}

const HEAD = [
  "Image",
  "Name / Slug",
  "Category",
  "Metal",
  "Weight",
  "Stock",
  "Est. Price",
  "Flags",
  "Actions",
];

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ "& th": { borderBottom: "1px solid #f5f5f4" } }}>
            {HEAD.map((h) => (
              <TableCell
                key={h}
                sx={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  py: 1.5,
                  whiteSpace: "nowrap",
                  color: "#a8a29e",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((p) => {
            const primaryImg =
              (p.images ?? []).find((img) => img.isPrimary)?.url ??
              p.images?.[0]?.url ??
              null;

            const stockLabel =
              p.stock === 0
                ? "Out of stock"
                : p.stock <= 3
                  ? `Low (${p.stock})`
                  : String(p.stock);

            const stockColor =
              p.stock === 0
                ? { bg: "#fef2f2", color: "#dc2626" }
                : p.stock <= 3
                  ? { bg: "#fffbeb", color: "#b45309" }
                  : { bg: "#f0fdf4", color: "#15803d" };

            return (
              <TableRow
                key={p.id}
                sx={{
                  "&:last-child td": { border: 0 },
                  "&:hover": { backgroundColor: "#fafaf9" },
                  "& td": { borderBottom: "1px solid #f5f5f4", py: 1.5 },
                  opacity: p.isActive ? 1 : 0.55,
                }}
              >
                {/* Image */}
                <TableCell sx={{ width: 56 }}>
                  <Box className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    {primaryImg ? (
                      <img
                        src={primaryImg}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Box className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
                        —
                      </Box>
                    )}
                  </Box>
                </TableCell>

                {/* Name / slug */}
                <TableCell>
                  <Typography
                    className="text-stone-800 font-medium text-sm leading-tight"
                    sx={{ maxWidth: 200 }}
                  >
                    {p.name}
                  </Typography>
                  <Typography className="text-stone-400 text-[0.65rem] mt-0.5 font-mono">
                    /{p.slug}
                  </Typography>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Typography className="text-stone-600 text-sm whitespace-nowrap">
                    {p.category.name}
                  </Typography>
                </TableCell>

                {/* Metal */}
                <TableCell>
                  <Typography className="text-stone-600 text-sm whitespace-nowrap">
                    {METAL_LABELS[p.metalType] ?? String(p.metalType)}
                    {p.purity && (
                      <Box
                        component="span"
                        className="ml-1 text-stone-400 text-[0.65rem]"
                      >
                        ({p.purity})
                      </Box>
                    )}
                  </Typography>
                </TableCell>

                {/* Weight */}
                <TableCell>
                  <Typography className="text-stone-600 text-sm whitespace-nowrap">
                    {p.weightGrams}g
                  </Typography>
                </TableCell>

                {/* Stock */}
                <TableCell>
                  <Chip
                    label={stockLabel}
                    size="small"
                    sx={{
                      fontSize: "0.68rem",
                      height: 22,
                      fontWeight: 500,
                      backgroundColor: stockColor.bg,
                      color: stockColor.color,
                      border: "none",
                      whiteSpace: "nowrap",
                    }}
                  />
                </TableCell>

                {/* Est. price */}
                <TableCell>
                  <Typography className="text-stone-800 text-sm font-medium whitespace-nowrap">
                    {p.computedPrice != null
                      ? `Rs ${Number(p.computedPrice).toLocaleString("en-NP")}`
                      : "—"}
                  </Typography>
                  <Typography className="text-stone-400 text-[0.6rem]">
                    at today's rate
                  </Typography>
                </TableCell>

                {/* Flags */}
                <TableCell>
                  <Box className="flex items-center gap-1">
                    {!p.isActive && (
                      <Tooltip title="Inactive (hidden)">
                        <Box className="w-2 h-2 rounded-full bg-stone-300" />
                      </Tooltip>
                    )}
                    {p.isFeatured && (
                      <Tooltip title="Featured">
                        <StarIcon sx={{ fontSize: 15, color: "#b45309" }} />
                      </Tooltip>
                    )}
                    {p.isDealOfDay && (
                      <Tooltip title="Deal of the day">
                        <LocalOfferIcon
                          sx={{ fontSize: 14, color: "#15803d" }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <Box className="flex items-center gap-0.5">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(p)}
                        className="text-stone-400 hover:text-stone-700"
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(p)}
                        className="text-stone-400 hover:text-red-600"
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
