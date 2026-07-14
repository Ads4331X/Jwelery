import { API_BASE_URL } from "../config/appConfig";
import { authHeaders, getToken } from "./authApi";
import { getAdminToken, adminAuthHeaders } from "./adminAuthApi";

const API_BASE = API_BASE_URL;

type ApiEnvelope = {
  success?: boolean;
  message?: string;
};

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function authMaybeHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  return authHeaders();
}

function adminAuthMaybeHeaders(): Record<string, string> {
  const token = getAdminToken();
  if (!token) return {};
  return adminAuthHeaders();
}

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string | null;
    lastName: string | null;
    username: string | null;
  };
  product?: {
    name: string;
    slug: string;
  };
};

type GetReviewsResponse = ApiEnvelope & {
  data?: {
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
    avgRating?: number;
    reviewCount?: number;
    canReview?: boolean;
  };
};

type SingleReviewResponse = ApiEnvelope & {
  data?: Review;
};

type DeleteReviewResponse = ApiEnvelope & {
  message?: string;
};

export async function getProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10,
) {
  try {
    const res = await fetch(
      `${API_BASE}/api/products/${productId}/reviews?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          ...authMaybeHeaders(),
        },
      },
    );

    const json = await safeJson<GetReviewsResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Fetch reviews failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Get product reviews network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function submitReview(
  productId: string,
  payload: { rating: number; comment?: string },
) {
  try {
    const res = await fetch(`${API_BASE}/api/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authMaybeHeaders(),
      },
      body: JSON.stringify(payload),
    });

    const json = await safeJson<SingleReviewResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Submit review failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Submit review network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function updateReview(
  productId: string,
  reviewId: string,
  payload: { rating?: number; comment?: string },
) {
  try {
    const res = await fetch(
      `${API_BASE}/api/products/${productId}/reviews/${reviewId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authMaybeHeaders(),
        },
        body: JSON.stringify(payload),
      },
    );

    const json = await safeJson<SingleReviewResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Update review failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Update review network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function deleteReview(productId: string, reviewId: string) {
  try {
    const res = await fetch(
      `${API_BASE}/api/products/${productId}/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          ...authMaybeHeaders(),
        },
      },
    );

    const json = await safeJson<DeleteReviewResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Delete review failed (${res.status}).`,
      };
    }

    return { data: json ?? null, error: null };
  } catch (err) {
    console.error("Delete review network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

// ── Admin ──

export async function getAdminReviews(page: number = 1, limit: number = 10) {
  try {
    const res = await fetch(
      `${API_BASE}/api/admin/reviews?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          ...adminAuthMaybeHeaders(),
        },
      },
    );

    const json = await safeJson<GetReviewsResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Fetch admin reviews failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Get admin reviews network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function deleteAdminReview(reviewId: string) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        ...adminAuthMaybeHeaders(),
      },
    });

    const json = await safeJson<DeleteReviewResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Delete admin review failed (${res.status}).`,
      };
    }

    return { data: json ?? null, error: null };
  } catch (err) {
    console.error("Delete admin review network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}
