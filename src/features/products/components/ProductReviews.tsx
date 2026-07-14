import { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Button,
  TextField,
  Rating,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  getProductReviews,
  submitReview,
  deleteReview,
  updateReview,
  type Review,
} from "../../../services/reviewsApi";
import { AuthContext } from "../../auth/context/context";
import { NavLink } from "react-router-dom";

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [canReview, setCanReview] = useState(false);

  // Form state
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchReviews = async (p = 1) => {
    setLoading(true);
    const res = await getProductReviews(productId, p, 5);
    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setReviews(res.data.reviews);
      setTotalPages(res.data.totalPages);
      setCanReview(res.data.canReview ?? false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews(page);
  }, [productId, page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    setFormError(null);

    const res = editingId
      ? await updateReview(productId, editingId, { rating, comment })
      : await submitReview(productId, { rating, comment });

    setSubmitting(false);

    if (res.error) {
      setFormError(res.error);
    } else {
      setRating(5);
      setComment("");
      setEditingId(null);
      setCanReview(false); // Can only review once
      fetchReviews(1); // refresh to show new review
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    const res = await deleteReview(productId, reviewId);
    if (res.error) {
      alert(res.error);
    } else {
      fetchReviews(page);
    }
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setComment(review.comment || "");
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setRating(5);
    setComment("");
    setFormError(null);
  };

  if (loading && reviews.length === 0) {
    return (
      <Box className="flex justify-center py-10">
        <CircularProgress size={24} sx={{ color: "#b45309" }} />
      </Box>
    );
  }

  return (
    <Box className="mt-16 md:mt-24">
      <Typography
        component="h2"
        className="!text-2xl sm:!text-[1.8rem] !font-semibold !text-stone-900 !leading-tight !mb-6"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Customer Reviews
      </Typography>

      {/* Review Form */}
      {user ? (
        canReview || editingId ? (
          <Box className="bg-white p-6 rounded-2xl border border-amber-900/10 mb-10 shadow-sm">
            <Typography className="!text-lg !font-semibold !text-stone-800 !mb-4">
              {editingId ? "Edit your review" : "Write a review"}
            </Typography>

            {formError && (
              <Alert severity="error" className="!mb-4 !rounded-xl">
                {formError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Box>
                <Typography className="!text-sm !text-stone-600 !mb-1.5">
                  Rating *
                </Typography>
                <Rating
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue)}
                  size="large"
                  sx={{ color: "#f59e0b" }}
                />
              </Box>

              <TextField
                label="Comment (optional)"
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />

              <Box className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !rating}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #92400e, #b45309)" }}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </Box>
            </form>
          </Box>
        ) : (
          <Box className="bg-stone-50 p-6 rounded-2xl border border-stone-200 mb-10">
            <Typography className="!text-stone-500 !text-sm !text-center">
              Purchase this item to leave a review after delivery.
            </Typography>
          </Box>
        )
      ) : (
        <Box className="bg-stone-50 p-6 rounded-2xl border border-stone-200 mb-10">
          <Typography className="!text-stone-500 !text-sm !text-center">
            <NavLink to="/login" className="text-amber-700 underline font-semibold">
              Sign in
            </NavLink>{" "}
            and purchase this item to leave a review.
          </Typography>
        </Box>
      )}

      {/* Review List */}
      <Box className="flex flex-col gap-6">
        {reviews.length === 0 ? (
          <Typography className="!text-stone-400 !italic">
            No reviews yet.
          </Typography>
        ) : (
          reviews.map((review) => (
            <Box
              key={review.id}
              className="pb-6 border-b border-stone-100 last:border-0"
            >
              <Box className="flex justify-between items-start mb-2">
                <Box>
                  <Rating
                    value={review.rating}
                    readOnly
                    size="small"
                    sx={{ color: "#f59e0b", mb: 0.5 }}
                  />
                  <Typography className="!text-sm !font-semibold !text-stone-800">
                    {review.user?.firstName} {review.user?.lastName}
                  </Typography>
                  <Typography className="!text-[0.65rem] !text-stone-400">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
                {user && user.id === review.userId && (
                  <Box className="flex gap-1">
                    <IconButton size="small" onClick={() => startEdit(review)}>
                      <EditOutlinedIcon sx={{ fontSize: 16, color: "#78716c" }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(review.id)}>
                      <DeleteOutlineIcon sx={{ fontSize: 16, color: "#ef4444" }} />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {review.comment && (
                <Typography className="!text-[0.85rem] !text-stone-600 !mt-2 !leading-relaxed">
                  {review.comment}
                </Typography>
              )}
            </Box>
          ))
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
      </Box>
    </Box>
  );
}
