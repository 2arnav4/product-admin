import api from "@/lib/axios";

export async function getOrderTotals({ signal } = {}) {
  const { data } = await api.get("/carts", {
    params: { limit: 0, select: "discountedTotal,totalQuantity" },
    signal,
  });
  return data;
}
