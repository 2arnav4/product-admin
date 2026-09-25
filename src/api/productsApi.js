import api from "@/lib/axios";

const LIST_FIELDS = "title,category,price,rating,stock,thumbnail";

function listEndpoint({ q, category }) {
  if (q) return "/products/search";
  if (category) return `/products/category/${encodeURIComponent(category)}`;
  return "/products";
}

export async function getProducts(query, { signal } = {}) {
  const { page, pageSize, q, category, sortBy, order, delay } = query;
  const params = {
    limit: pageSize,
    skip: (page - 1) * pageSize,
    select: LIST_FIELDS,
  };
  if (q) params.q = q;
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }
  if (delay) params.delay = delay;

  const { data } = await api.get(listEndpoint(query), { params, signal });
  return data;
}

export async function getCategories({ signal } = {}) {
  const { data } = await api.get("/products/categories", { signal });
  return data;
}

export async function getProductById(id, { signal } = {}) {
  const { data } = await api.get(`/products/${encodeURIComponent(id)}`, { signal });
  return data;
}

export async function createProduct(payload) {
  const { data } = await api.post("/products/add", payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${encodeURIComponent(id)}`, payload);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${encodeURIComponent(id)}`);
  return data;
}

export async function getAllProductsSummary({ signal } = {}) {
  const { data } = await api.get("/products", {
    params: { limit: 0, select: "title,price,stock,category,thumbnail" },
    signal,
  });
  return data;
}
