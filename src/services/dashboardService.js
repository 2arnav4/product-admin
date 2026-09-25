import { getAllProductsSummary } from "@/api/productsApi";
import { getOrderTotals } from "@/api/ordersApi";
import { applyChangesToList } from "@/lib/productStore";

const LOW_STOCK_LIMIT = 10;
const ALL_PRODUCTS_QUERY = { q: "", category: "", page: 1 };

export async function loadDashboardStats(signal) {
  const [productData, orderData] = await Promise.all([
    getAllProductsSummary({ signal }),
    getOrderTotals({ signal }),
  ]);

  const merged = applyChangesToList(productData, ALL_PRODUCTS_QUERY);
  const products = [...merged.localProducts, ...merged.products];

  const lowStock = products
    .filter((product) => product.stock < LOW_STOCK_LIMIT)
    .sort((a, b) => a.stock - b.stock);

  return {
    productCount: products.length,
    categoryCount: new Set(products.map((product) => product.category)).size,
    inventoryValue: products.reduce((sum, product) => sum + product.price * product.stock, 0),
    lowStock,
    orderCount: orderData.total,
    revenue: orderData.carts.reduce((sum, cart) => sum + cart.discountedTotal, 0),
    unitsSold: orderData.carts.reduce((sum, cart) => sum + cart.totalQuantity, 0),
  };
}
