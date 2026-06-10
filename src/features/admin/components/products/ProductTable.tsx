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
import type { AdminProduct } from "./types";

interface Props {
  products: AdminProduct[];
  onEdit: (p: AdminProduct) => void;
  onDelete: (p: AdminProduct) => void;
}

const headCells = [
  "Image",
  "Name",
  "Category",
  "Metal",
  "Price",
  "Status",
  "Featured",
  "Actions",
];

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ "& th": { borderBottom: "1px solid #f5f5f4" } }}>
            {headCells.map((h) => (
              <TableCell
                key={h}
                className="text-stone-400 font-medium uppercase tracking-wide"
                sx={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  py: 1.5,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow
              key={p.id}
              sx={{
                "&:last-child td": { border: 0 },
                "&:hover": { backgroundColor: "#fafaf9" },
                "& td": { borderBottom: "1px solid #f5f5f4", py: 1.5 },
              }}
            >
              {/* Image */}
              <TableCell sx={{ width: 56 }}>
                <Box className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
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

              {/* Name */}
              <TableCell>
                <Typography className="text-stone-800 font-medium text-sm leading-tight">
                  {p.name}
                </Typography>
                {p.description && (
                  <Typography className="text-stone-400 text-xs mt-0.5 line-clamp-1 max-w-[200px]">
                    {p.description}
                  </Typography>
                )}
              </TableCell>

              {/* Category */}
              <TableCell>
                <Typography className="text-stone-600 text-sm">
                  {p.category}
                </Typography>
              </TableCell>

              {/* Metal */}
              <TableCell>
                <Typography className="text-stone-600 text-sm">
                  {p.metal}
                </Typography>
              </TableCell>

              {/* Price */}
              <TableCell>
                <Typography className="text-stone-800 text-sm font-medium">
                  {p.price != null
                    ? `Rs ${Number(p.price).toLocaleString("en-NP")}`
                    : "—"}
                </Typography>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Chip
                  label={p.status}
                  size="small"
                  sx={{
                    fontSize: "0.68rem",
                    height: 22,
                    fontWeight: 500,
                    backgroundColor:
                      p.status === "Available" ? "#f0fdf4" : "#fef2f2",
                    color: p.status === "Available" ? "#15803d" : "#dc2626",
                    border: "none",
                  }}
                />
              </TableCell>

              {/* Featured */}
              <TableCell>
                {p.is_featured && (
                  <StarIcon sx={{ fontSize: 16, color: "#b45309" }} />
                )}
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
