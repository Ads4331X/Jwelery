import { API_BASE_URL } from "../config/appConfig";
import { adminAuthHeaders } from "./adminApi";

const API_BASE = API_BASE_URL;

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// Keep these types aligned with backend enums.
export type AdminOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY_FOR_DELIVERY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type AdminOrderItem = {
  productId: string;
  name: string;
  qty: number;
  price?: number | null;
  imageUrl?: string | null;
};

export type AdminOrderAddress = {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  deliveryNote?: string | null;
};

export type AdminOrderListItem = {
  id?: string;
  orderNumber: string;
  status: AdminOrderStatus;
  totalAmount: number;
  createdAt: string;
  customer?: {
    name?: string | null;
    email?: string | null;
  };
  items: AdminOrderItem[];
};

export type AdminOrdersListResponse = {
  success?: boolean;
  message?: string;
  data?: AdminOrderListItem[];
};

export type AdminOrderDetailResponse = {
  success?: boolean;
  message?: string;
  data?: AdminOrderListItem & {
    address?: AdminOrderAddress;
  };
};

export type AdminOrderRecentItem = {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: AdminOrderStatus;
  createdAt: string;
};

export type AdminOrdersStatsSummary = {
  totalOrders: number;
  ordersToday: number;
  ordersThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  pendingOrders: number;
  processingOrders: number;
  recentOrders: AdminOrderRecentItem[];
};

export type AdminOrdersStatsSummaryResponse = {
  success?: boolean;
  message?: string;
  data?: AdminOrdersStatsSummary;
};

export async function getAdminOrders(): Promise<{
  data: AdminOrderListItem[];
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/orders`, {
      method: "GET",
      headers: {
        ...adminAuthHeaders(),
      },
    });

    const json = await safeJson<AdminOrdersListResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: [],
        error: json?.message ?? `Fetch admin orders failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? [], error: null };
  } catch {
    return {
      data: [],
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function patchAdminOrderStatus(
  id: string,
  status: AdminOrderStatus,
  note?: string,
): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...adminAuthHeaders(),
      },
      body: JSON.stringify({ status, note: note ?? "" }),
    });

    const json = await safeJson<{ success?: boolean; message?: string }>(res);

    if (!res.ok || json?.success === false) {
      return {
        error: json?.message ?? `Update order status failed (${res.status}).`,
      };
    }

    return { error: null };
  } catch {
    return { error: "Cannot reach server. Check your connection." };
  }
}

export async function fetchAdminOrderStats(): Promise<{
  data: AdminOrdersStatsSummary | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/orders/stats/summary`, {
      method: "GET",
      headers: {
        ...adminAuthHeaders(),
      },
    });

    const json = await safeJson<AdminOrdersStatsSummaryResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error:
          json?.message ?? `Fetch admin order stats failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch {
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}
