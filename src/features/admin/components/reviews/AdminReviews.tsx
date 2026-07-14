import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Alert,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Rating,
  CircularProgress,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getAdminReviews, deleteAdminReview, type Review } from "../../../../services/reviewsApi";
import ConfirmDialog from "../../../../components/shared/ConfirmDialog";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async (p = 1) => {
    setLoading(true);
    const res = await getAdminReviews(p, 10);
    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setReviews(res.data.reviews);
      setTotalPages(res.data.totalPages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteAdminReview(deleteTarget);
    setDeleting(false);
    if (res.error) {
      alert(res.error);
    } else {
      setDeleteTarget(null);
      fetchReviews(page);
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
          Reviews
        </Typography>
        <Typography variant="body2" className="text-stone-400">
          Manage customer product reviews.
        </Typography>
      </Box>

      <Card elevation={0} className="border border-stone-100 rounded-xl">
        <CardContent className="p-6">
          {loading && reviews.length === 0 ? (
            <Box className="flex justify-center py-10">
              <CircularProgress sx={{ color: "#b45309" }} />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : reviews.length === 0 ? (
            <Box className="py-10 text-center">
              <Typography className="text-stone-400">No reviews found.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell className="font-semibold text-stone-600">Reviewer</TableCell>
                    <TableCell className="font-semibold text-stone-600">Product</TableCell>
                    <TableCell className="font-semibold text-stone-600">Rating</TableCell>
                    <TableCell className="font-semibold text-stone-600">Comment</TableCell>
                    <TableCell className="font-semibold text-stone-600">Date</TableCell>
                    <TableCell align="right" className="font-semibold text-stone-600">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Typography className="text-sm font-medium text-stone-800">
                          {r.user?.firstName} {r.user?.lastName}
                        </Typography>
                        <Typography className="text-xs text-stone-500">
                          @{r.user?.username}
                        </Typography>
                      </TableCell>
                      <TableCell className="text-sm text-stone-700">
                        {r.product?.name}
                      </TableCell>
                      <TableCell>
                        <Rating value={r.rating} readOnly size="small" sx={{ color: "#f59e0b" }} />
                      </TableCell>
                      <TableCell>
                        <Typography
                          className="text-sm text-stone-600 line-clamp-2 max-w-xs"
                          title={r.comment || ""}
                        >
                          {r.comment || <span className="text-stone-300 italic">No comment</span>}
                        </Typography>
                      </TableCell>
                      <TableCell className="text-sm text-stone-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteTarget(r.id)}
                          title="Delete Review"
                        >
                          <DeleteOutlineIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {totalPages > 1 && (
            <Box className="flex justify-center mt-6">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#57534e",
                    "&.Mui-selected": {
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      fontWeight: "bold",
                    },
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isDestructive
        loading={deleting}
      />
    </Box>
  );
}
