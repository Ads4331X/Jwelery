import { API_BASE_URL } from "../config/appConfig";
import { authHeaders, getToken } from "./authApi";

const API_BASE = API_BASE_URL;

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type OrderItemCreate = {
  productId: string;
  qty: number;
};

export type ShippingAddress = {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  deliveryNote?: string;
};

export type OrderItem = {
  id?: string;
  productId?: string;
  name: string;
  qty: number;
  price?: number | null;
  imageUrl?: string | null;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY_FOR_DELIVERY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderListItem = {
  id?: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

type ApiEnvelope = {
  success?: boolean;
  message?: string;
};

type CreateOrderResponse = ApiEnvelope & {
  data?: {
    orderNumber?: string;
    id?: string;
  };
};

type GetOrdersResponse = ApiEnvelope & {
  data?: OrderListItem[];
};

type GetOrderResponse = ApiEnvelope & {
  data?: OrderListItem;
};

function authMaybeHeaders(): Record<string, string> {
  // authHeaders() already checks token existence.
  // Keeping this helper makes it easier to tweak if backend auth strategy changes.
  const token = getToken();
  if (!token) return {};
  return authHeaders();
}

export async function createOrder(
  items: OrderItemCreate[],
  address: ShippingAddress,
  addressId?: string,
): Promise<{
  data: { orderNumber?: string; id?: string } | null;
  error: string | null;
}> {
  try {
    const body: Record<string, unknown> = { items, address };
    if (addressId) {
      body.addressId = addressId;
    }

    const res = await fetch(`${API_BASE}/api/customer/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authMaybeHeaders(),
      },
      body: JSON.stringify(body),
    });

    const json = await safeJson<CreateOrderResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Create order failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Create order network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function getOrders(): Promise<{
  data: OrderListItem[] | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/orders`, {
      method: "GET",
      headers: {
        ...authMaybeHeaders(),
      },
    });

    const json = await safeJson<GetOrdersResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Fetch orders failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? [], error: null };
  } catch (err) {
    console.error("Get orders network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function getOrder(
  id: string,
): Promise<{ data: OrderListItem | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/orders/${id}`, {
      method: "GET",
      headers: {
        ...authMaybeHeaders(),
      },
    });

    const json = await safeJson<GetOrderResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Fetch order failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Get order network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}
