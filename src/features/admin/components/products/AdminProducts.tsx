import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Snackbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DiamondIcon from "@mui/icons-material/Diamond";
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../../services/productsApi";
import type { AdminProduct, ProductFormData } from "./types";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import DeleteProductDialog from "./DeleteProductDialog";
import ProductFilters from "./ProductFilters";

type Toast = { msg: string; severity: "success" | "error" };

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [metal, setMetal] = useState("All");

  const [toast, setToast] = useState<Toast | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      setProducts(await fetchAdminProducts());
    } catch (e) {
      setFetchError(
        e instanceof Error ? e.message : "Failed to load products.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => void load(), 0);
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);
      const matchesCategory =
        category === "All" || p.category.name === category;
      const matchesMetal = metal === "All" || p.metalType === metal;
      return matchesSearch && matchesCategory && matchesMetal;
    });
  }, [products, search, category, metal]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: AdminProduct) => {
    setEditing(p);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSave = async (data: ProductFormData) => {
    setSaving(true);
    const result = editing
      ? await updateProduct(editing.id, data)
      : await createProduct(data);
    const error = (result as unknown as { error?: string }).error;

    setSaving(false);

    if (error) {
      setToast({ msg: error, severity: "error" });
    } else {
      setToast({
        msg: editing ? "Product updated." : "Product added.",
        severity: "success",
      });
      closeForm();
      void load();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteProduct(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);

    if (error) {
      setToast({ msg: error, severity: "error" });
    } else {
      setToast({ msg: "Product deleted.", severity: "success" });
      void load();
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const activeCount = products.filter((p) => p.isActive).length;

  return (
    <Box className="flex flex-col gap-6">
      {/* Header */}
      <Box className="flex items-start justify-between gap-4">
        <Box>
          <Typography
            variant="h5"
            className="font-semibold text-stone-800 mb-1"
          >
            Products
          </Typography>
          <Typography variant="body2" className="text-stone-400">
            Manage your jewellery inventory.
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          onClick={openAdd}
          className="normal-case rounded-lg h-9 shrink-0"
          sx={{
            backgroundColor: "#1c1917",
            "&:hover": { backgroundColor: "#292524" },
          }}
        >
          Add product
        </Button>
      </Box>

      {/* Quick stats */}
      {!loading && !fetchError && (
        <Box className="grid grid-cols-3 gap-3">
          {[
            { label: "Total products", value: products.length },
            { label: "Active", value: activeCount },
            {
              label: "Total stock",
              value: `${totalStock.toLocaleString("en-NP")} units`,
            },
          ].map((s) => (
            <Box
              key={s.label}
              className="rounded-xl border border-stone-100 bg-white px-4 py-3"
            >
              <Typography className="text-stone-400 text-xs mb-0.5">
                {s.label}
              </Typography>
              <Typography className="text-stone-800 font-semibold text-lg leading-tight">
                {s.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Main card */}
      <Card elevation={0} className="border border-stone-100 rounded-xl">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <DiamondIcon className="text-amber-700" />
            <Typography
              variant="subtitle1"
              className="font-semibold text-stone-800"
            >
              Inventory
            </Typography>
            {!loading && (
              <Typography variant="caption" className="text-stone-400 ml-auto">
                {filtered.length}{" "}
                {filtered.length === 1 ? "product" : "products"}
              </Typography>
            )}
          </Box>
          <Divider className="mb-5" />

          <ProductFilters
            search={search}
            category={category}
            metal={metal}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onMetalChange={setMetal}
          />

          {loading && (
            <Box className="flex justify-center py-16">
              <CircularProgress size={28} className="text-stone-400" />
            </Box>
          )}

          {!loading && fetchError && (
            <Alert severity="error" className="text-sm">
              {fetchError}
            </Alert>
          )}

          {!loading && !fetchError && filtered.length === 0 && (
            <Box className="py-16 text-center">
              <Typography className="text-stone-400 text-sm">
                {products.length === 0
                  ? "No products yet. Add your first product to get started."
                  : "No products match your filters."}
              </Typography>
            </Box>
          )}

          {!loading && !fetchError && filtered.length > 0 && (
            <ProductTable
              products={filtered}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ProductForm
        open={formOpen}
        editing={editing}
        saving={saving}
        onSave={handleSave}
        onClose={closeForm}
      />

      <DeleteProductDialog
        open={deleteTarget !== null}
        productName={deleteTarget?.name ?? ""}
        deleting={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Toast */}
      <Snackbar
        open={toast !== null}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.severity}
          variant="filled"
          className="text-sm rounded-xl shadow-lg"
        >
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
